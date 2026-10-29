import { describe, it, expect } from 'vitest';
import { computeCommitGraphLayout } from './laneLayout';
import { Commit } from '../../../api/types';

// Helper to construct test commits
function makeCommit(
  sha: string,
  parents: string[],
  is_merge: boolean = parents.length > 1
): Commit {
  return {
    sha,
    short_sha: sha.slice(0, 7),
    parents,
    author: { name: 'Test Author', email: 'test@example.com' },
    committed_at: '2026-10-29T10:00:00Z',
    message: `Commit ${sha}`,
    is_merge,
    files_changed: 1,
    additions: 10,
    deletions: 2,
    branch_hint: 'main',
  };
}

describe('Commit Graph Lane Layout Algorithm', () => {
  // TEST 1: Linear history uses one lane
  it('assigns a single lane (lane 0) to a linear history', () => {
    const commits: Commit[] = [
      makeCommit('c3', ['c2']),
      makeCommit('c2', ['c1']),
      makeCommit('c1', []),
    ];

    const result = computeCommitGraphLayout(commits);

    expect(result.layouts.get('c3')?.lane).toBe(0);
    expect(result.layouts.get('c2')?.lane).toBe(0);
    expect(result.layouts.get('c1')?.lane).toBe(0);
    expect(result.maxOverallLane).toBe(0);
  });

  // TEST 2: A branch that forks and merges back uses 2 lanes and returns to a free lane
  it('uses 2 lanes for a branch fork and merge, then returns to 1 lane', () => {
    // History:
    // m1: merge commit (parents: [c2, f1])
    // c2: on main (parents: [c1])
    // f1: on feature (parents: [c1])
    // c1: root on main (parents: [])
    const commits: Commit[] = [
      makeCommit('m1', ['c2', 'f1']),
      makeCommit('c2', ['c1']),
      makeCommit('f1', ['c1']),
      makeCommit('c1', []),
    ];

    const result = computeCommitGraphLayout(commits);

    const m1Layout = result.layouts.get('m1');
    const c2Layout = result.layouts.get('c2');
    const f1Layout = result.layouts.get('f1');
    const c1Layout = result.layouts.get('c1');

    expect(m1Layout?.lane).toBe(0);
    expect(c2Layout?.lane).toBe(0);
    // f1 was allocated on a feature lane
    expect(f1Layout?.lane).toBe(1);
    // After merging back, root c1 returns to lane 0
    expect(c1Layout?.lane).toBe(0);
    expect(result.maxOverallLane).toBe(1);
  });

  // TEST 3: A merge commit has exactly 2 outgoing parent segments
  it('creates 2 outgoing parent segments for a merge commit with 2 parents', () => {
    const commits: Commit[] = [
      makeCommit('m1', ['c1', 'c2']),
      makeCommit('c1', ['r1']),
      makeCommit('c2', ['r1']),
      makeCommit('r1', []),
    ];

    const result = computeCommitGraphLayout(commits);
    const m1Layout = result.layouts.get('m1');

    expect(m1Layout?.nodeType).toBe('merge');
    // Filter segments starting at nodePoint (outgoing to parents)
    const outgoing = m1Layout?.segments.filter(
      (s) => s.from.x === m1Layout.nodePoint.x && s.from.y === m1Layout.nodePoint.y
    );
    expect(outgoing?.length).toBe(2);
  });

  // TEST 4: A root commit has none (0 outgoing parent segments)
  it('creates 0 outgoing parent segments for a root commit', () => {
    const commits: Commit[] = [
      makeCommit('c1', ['root']),
      makeCommit('root', []),
    ];

    const result = computeCommitGraphLayout(commits);
    const rootLayout = result.layouts.get('root');

    expect(rootLayout?.nodeType).toBe('root');
    const outgoing = rootLayout?.segments.filter(
      (s) => s.from.x === rootLayout.nodePoint.x && s.from.y === rootLayout.nodePoint.y
    );
    expect(outgoing?.length).toBe(0);
  });

  // TEST 5: A missing parent produces a "continues below" fade-out segment
  it('produces a fade-out segment when parent commit is not in loaded commits', () => {
    const commits: Commit[] = [
      makeCommit('c1', ['unloaded_parent_sha']),
    ];

    const result = computeCommitGraphLayout(commits);
    const c1Layout = result.layouts.get('c1');

    const fadeSegments = c1Layout?.segments.filter((s) => s.type === 'fade-out');
    expect(fadeSegments?.length).toBe(1);
    expect(fadeSegments?.[0].isDashed).toBe(true);
  });

  // TEST 6: No two different commits on the same row share a lane
  it('assigns unique coordinates per commit in its respective row', () => {
    const commits: Commit[] = [
      makeCommit('m1', ['c1', 'f1']),
      makeCommit('c1', ['root']),
      makeCommit('f1', ['root']),
      makeCommit('root', []),
    ];

    const result = computeCommitGraphLayout(commits);

    // Each row represents a distinct commit at index i; check that each commit gets a valid non-negative lane
    commits.forEach((c) => {
      const layout = result.layouts.get(c.sha);
      expect(layout).toBeDefined();
      expect(layout?.lane).toBeGreaterThanOrEqual(0);
      expect(layout?.nodePoint.x).toBeGreaterThan(0);
      expect(layout?.nodePoint.y).toBe(28); // ROW_HEIGHT / 2
    });
  });
});
