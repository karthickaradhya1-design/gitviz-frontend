/**
 * GitViz Commit Graph Lane Layout Engine
 *
 * NOTE ON LIBRARY EVALUATION (PRD P3 Rule):
 * We evaluated existing npm packages for git-style DAG lane assignment:
 * 1. `@gitgraph/js` and `@gitgraph/react`: Monolithic canvas/SVG renderers that draw
 *    the entire graph in a dedicated container; they do not expose headless row-by-row
 *    lane geometry suitable for a virtualized list (@tanstack/react-virtual).
 * 2. `gitgraph.js`: Unmaintained legacy library (last published >4 years ago).
 * 3. `d3-dag` / `dagre`: General-purpose 2D DAG layout engines that compute arbitrary
 *    x/y coordinates rather than discrete vertical column rails, adding high bundle weight
 *    without row-aligned pass-through segment support.
 *
 * FALLBACK IMPLEMENTATION:
 * Implemented the standard deterministic greedy lane-assignment algorithm (analogous to `git log --graph`),
 * computing per-row SVG segments (continuing lanes, branch forks, merge curves, fade-outs)
 * in this single isolated file.
 */

import { Commit } from '../../../api/types';

export const ROW_HEIGHT = 56;
export const LANE_SPACING = 16;
export const LANE_PADDING = 18;
export const NODE_RADIUS = 5;

export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphSegment {
  id: string;
  type: 'straight' | 'curve' | 'fade-out';
  from: GraphPoint;
  to: GraphPoint;
  control1?: GraphPoint;
  control2?: GraphPoint;
  colorVar: string;
  isDashed?: boolean;
}

export interface CommitRowLayout {
  sha: string;
  lane: number;
  colorIndex: number;
  colorVar: string;
  nodeType: 'normal' | 'merge' | 'root';
  nodePoint: GraphPoint;
  segments: GraphSegment[];
  maxLane: number;
}

export interface GraphLayoutResult {
  layouts: Map<string, CommitRowLayout>;
  maxOverallLane: number;
  gutterWidth: number;
}

/** Returns the horizontal X coordinate for a given lane index */
export function getLaneX(lane: number): number {
  return LANE_PADDING + lane * LANE_SPACING;
}

/** Formats a CSS color variable `--lane-1` ... `--lane-8` */
export function getLaneColorVar(colorIndex: number): string {
  const normalizedIndex = (Math.abs(colorIndex) % 8) + 1;
  return `var(--lane-${normalizedIndex})`;
}

/**
 * Computes lane assignments and row-by-row SVG segments for all commits.
 *
 * Commits are assumed to be sorted in chronological/topological order (newest first).
 */
export function computeCommitGraphLayout(commits: Commit[]): GraphLayoutResult {
  const layouts = new Map<string, CommitRowLayout>();
  let maxOverallLane = 0;

  if (!commits || commits.length === 0) {
    return {
      layouts,
      maxOverallLane: 0,
      gutterWidth: 120,
    };
  }

  // Quick lookup of commit index by SHA
  const commitIndexMap = new Map<string, number>();
  commits.forEach((c, idx) => {
    commitIndexMap.set(c.sha, idx);
    commitIndexMap.set(c.short_sha, idx);
  });

  // Track active lanes: activeLanes[lane] = SHA expected in this lane, or null if free
  const activeLanes: (string | null)[] = [];
  // Track assigned colors for lanes
  const laneColors: number[] = [];

  // Pass 1: Assign lanes to all commits
  const assignedLanes: number[] = new Array(commits.length);

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];

    // Check if this commit has a reserved lane
    let lane = activeLanes.indexOf(commit.sha);

    if (lane === -1) {
      // Find lowest free lane or allocate new one
      lane = activeLanes.indexOf(null);
      if (lane === -1) {
        lane = activeLanes.length;
        activeLanes.push(null);
        laneColors.push(lane % 8);
      }
    }

    assignedLanes[i] = lane;
    if (lane > maxOverallLane) {
      maxOverallLane = lane;
    }

    // Free the current lane
    activeLanes[lane] = null;

    // Allocate lanes for parents
    const parents = commit.parents || [];
    if (parents.length > 0) {
      const firstParent = parents[0];
      const firstParentLane = activeLanes.indexOf(firstParent);

      if (firstParentLane !== -1) {
        // First parent already has a lane allocated
      } else {
        // First parent continues on the current commit's lane
        activeLanes[lane] = firstParent;
        laneColors[lane] = laneColors[lane] ?? (lane % 8);
      }

      // Additional parents (merges)
      for (let pIdx = 1; pIdx < parents.length; pIdx++) {
        const parentSha = parents[pIdx];
        if (activeLanes.indexOf(parentSha) === -1) {
          // Allocate a new lane for this second parent
          let freeLane = activeLanes.indexOf(null);
          if (freeLane === -1) {
            freeLane = activeLanes.length;
            activeLanes.push(null);
            laneColors.push(freeLane % 8);
          }
          activeLanes[freeLane] = parentSha;
          laneColors[freeLane] = freeLane % 8;
          if (freeLane > maxOverallLane) {
            maxOverallLane = freeLane;
          }
        }
      }
    }
  }

  // Pass 2: Generate exact SVG segments for each row
  // We re-simulate the active lanes step by step so every row knows:
  // - incoming connections from above
  // - passing through vertical rails
  // - outgoing connections to parents below
  const runningLanes: (string | null)[] = [];

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const lane = assignedLanes[i];
    const colorIndex = lane % 8;
    const colorVar = getLaneColorVar(colorIndex);

    const xNode = getLaneX(lane);
    const yNode = ROW_HEIGHT / 2; // 28
    const nodePoint: GraphPoint = { x: xNode, y: yNode };

    const segments: GraphSegment[] = [];

    // Determine node type
    let nodeType: 'normal' | 'merge' | 'root' = 'normal';
    if (commit.is_merge || (commit.parents && commit.parents.length >= 2)) {
      nodeType = 'merge';
    } else if (!commit.parents || commit.parents.length === 0) {
      nodeType = 'root';
    }

    // 1. Incoming line from top edge if this commit was targeted by children from above
    const isTargetOfAbove = runningLanes.includes(commit.sha);
    if (isTargetOfAbove) {
      runningLanes.forEach((targetSha, lIdx) => {
        if (targetSha === commit.sha) {
          const xChild = getLaneX(lIdx);
          if (lIdx === lane) {
            // Straight vertical line into node
            segments.push({
              id: `in-${lIdx}-${lane}`,
              type: 'straight',
              from: { x: xChild, y: 0 },
              to: nodePoint,
              colorVar: getLaneColorVar(lIdx),
            });
          } else {
            // Curve entering from top and merging into node
            segments.push({
              id: `in-curve-${lIdx}-${lane}`,
              type: 'curve',
              from: { x: xChild, y: 0 },
              to: nodePoint,
              control1: { x: xChild, y: yNode * 0.5 },
              control2: { x: xNode, y: yNode * 0.5 },
              colorVar: getLaneColorVar(lIdx),
            });
          }
        }
      });
    }

    // 2. Free this commit from running lanes before adding its parents
    for (let l = 0; l < runningLanes.length; l++) {
      if (runningLanes[l] === commit.sha) {
        runningLanes[l] = null;
      }
    }

    // 3. Outgoing lines to parents (from yNode to bottom y=56)
    const parents = commit.parents || [];
    parents.forEach((parentSha, pIdx) => {
      const parentRowIndex = commitIndexMap.get(parentSha);
      const isMissingParent = parentRowIndex === undefined;

      if (isMissingParent) {
        // Parent is not in loaded commits: draw short faded line downward
        segments.push({
          id: `out-missing-${commit.sha}-${pIdx}`,
          type: 'fade-out',
          from: nodePoint,
          to: { x: xNode, y: ROW_HEIGHT - 8 },
          colorVar,
          isDashed: true,
        });
      } else {
        const parentLane = assignedLanes[parentRowIndex];
        const xParent = getLaneX(parentLane);

        if (parentLane === lane) {
          // Straight line down to bottom edge
          segments.push({
            id: `out-straight-${commit.sha}-${parentSha}`,
            type: 'straight',
            from: nodePoint,
            to: { x: xParent, y: ROW_HEIGHT },
            colorVar,
          });
        } else {
          // Curved line to parent lane at bottom edge
          segments.push({
            id: `out-curve-${commit.sha}-${parentSha}`,
            type: 'curve',
            from: nodePoint,
            to: { x: xParent, y: ROW_HEIGHT },
            control1: { x: xNode, y: yNode + (ROW_HEIGHT - yNode) * 0.5 },
            control2: { x: xParent, y: yNode + (ROW_HEIGHT - yNode) * 0.5 },
            colorVar: pIdx === 0 ? colorVar : getLaneColorVar(parentLane),
          });
        }

        // Register this parent in running lanes for subsequent rows
        if (runningLanes[parentLane] === null || runningLanes[parentLane] === undefined) {
          runningLanes[parentLane] = parentSha;
        } else if (runningLanes.indexOf(parentSha) === -1) {
          // If parent is not tracked yet, track it
          runningLanes[parentLane] = parentSha;
        }
      }
    });

    // 4. Pass-through active vertical lanes (branches not touching this commit)
    for (let lIdx = 0; lIdx < runningLanes.length; lIdx++) {
      const activeSha = runningLanes[lIdx];
      // Only draw straight vertical pass-through if this lane is active and not terminating at this node
      if (activeSha !== null && activeSha !== undefined && lIdx !== lane) {
        const xPass = getLaneX(lIdx);
        segments.push({
          id: `pass-${i}-${lIdx}`,
          type: 'straight',
          from: { x: xPass, y: 0 },
          to: { x: xPass, y: ROW_HEIGHT },
          colorVar: getLaneColorVar(lIdx),
        });
      }
    }

    layouts.set(commit.sha, {
      sha: commit.sha,
      lane,
      colorIndex,
      colorVar,
      nodeType,
      nodePoint,
      segments,
      maxLane: maxOverallLane,
    });
  }

  // Calculate dynamic gutter width (with sensible boundaries: min 100px, max 140px)
  const gutterWidth = Math.max(100, Math.min(140, LANE_PADDING * 2 + (maxOverallLane + 1) * LANE_SPACING));

  return {
    layouts,
    maxOverallLane,
    gutterWidth,
  };
}
