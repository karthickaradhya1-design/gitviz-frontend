import { describe, it, expect } from 'vitest';
import {
  computeFileSummary,
  classifyDiffLine,
  parseDiff,
  filterHistoryEntries,
  formatDate,
} from './historyUtils';
import { FileHistoryEntry } from '../../api/types';

describe('historyUtils', () => {
  describe('computeFileSummary', () => {
    it('returns empty summary when entries list is empty', () => {
      const summary = computeFileSummary([]);
      expect(summary).toEqual({
        totalCommits: 0,
        uniqueAuthorsCount: 0,
        firstCommittedAt: null,
        lastCommittedAt: null,
        totalAdditions: 0,
        totalDeletions: 0,
        hasHistoryBreak: false,
        hasRename: false,
      });
    });

    it('aggregates commits, authors, churn, renames, and history breaks correctly', () => {
      const mockEntries: FileHistoryEntry[] = [
        {
          sha: 'aaa111',
          short_sha: 'aaa111',
          parents: ['bbb222'],
          author: { name: 'Alice', email: 'alice@test.com' },
          committed_at: '2026-10-24T12:00:00Z',
          message: 'latest commit',
          is_merge: false,
          additions: 15,
          deletions: 5,
          old_path: null,
          break_after: null,
        },
        {
          sha: 'bbb222',
          short_sha: 'bbb222',
          parents: ['ccc333'],
          author: { name: 'Bob', email: 'bob@test.com' },
          committed_at: '2026-10-20T10:00:00Z',
          message: 'rename commit',
          is_merge: false,
          additions: 2,
          deletions: 2,
          old_path: 'src/old-router.ts',
          break_after: null,
        },
        {
          sha: 'ccc333',
          short_sha: 'ccc333',
          parents: ['ddd444'],
          author: { name: 'Alice', email: 'alice@test.com' },
          committed_at: '2026-10-10T08:00:00Z',
          message: 'break commit',
          is_merge: true,
          additions: 30,
          deletions: 10,
          old_path: null,
          break_after: 'Git could not detect a rename here.',
        },
      ];

      const summary = computeFileSummary(mockEntries);
      expect(summary.totalCommits).toBe(3);
      expect(summary.uniqueAuthorsCount).toBe(2); // Alice and Bob
      expect(summary.firstCommittedAt).toBe('2026-10-10T08:00:00Z');
      expect(summary.lastCommittedAt).toBe('2026-10-24T12:00:00Z');
      expect(summary.totalAdditions).toBe(47);
      expect(summary.totalDeletions).toBe(17);
      expect(summary.hasRename).toBe(true);
      expect(summary.hasHistoryBreak).toBe(true);
    });
  });

  describe('classifyDiffLine', () => {
    it('identifies hunk headers', () => {
      expect(classifyDiffLine('@@ -10,5 +10,6 @@ export function run()')).toBe('hunk');
    });

    it('identifies added lines', () => {
      expect(classifyDiffLine('+ const a = 42;')).toBe('added');
      expect(classifyDiffLine('+\tconsole.log("hello");')).toBe('added');
    });

    it('identifies removed lines', () => {
      expect(classifyDiffLine('- const a = 20;')).toBe('removed');
    });

    it('identifies context and file header lines', () => {
      expect(classifyDiffLine('  const unchanged = true;')).toBe('context');
      expect(classifyDiffLine('+++ b/src/router.ts')).toBe('context');
      expect(classifyDiffLine('--- a/src/router.ts')).toBe('context');
    });
  });

  describe('parseDiff', () => {
    it('returns empty array for empty diff', () => {
      expect(parseDiff('')).toEqual([]);
      expect(parseDiff(undefined)).toEqual([]);
    });

    it('parses multiple lines into typed line objects', () => {
      const raw = '@@ -1,2 +1,3 @@\n-old\n+new\n context';
      const parsed = parseDiff(raw);
      expect(parsed).toHaveLength(4);
      expect(parsed[0]).toEqual({ type: 'hunk', content: '@@ -1,2 +1,3 @@' });
      expect(parsed[1]).toEqual({ type: 'removed', content: '-old' });
      expect(parsed[2]).toEqual({ type: 'added', content: '+new' });
      expect(parsed[3]).toEqual({ type: 'context', content: ' context' });
    });
  });

  describe('filterHistoryEntries', () => {
    const entries: FileHistoryEntry[] = [
      {
        sha: '1',
        short_sha: '1',
        parents: ['p1'],
        author: { name: 'A', email: 'a@a.com' },
        committed_at: '2026-10-01',
        message: 'regular commit',
        is_merge: false,
        additions: 1,
        deletions: 0,
      },
      {
        sha: '2',
        short_sha: '2',
        parents: ['p1', 'p2'],
        author: { name: 'B', email: 'b@b.com' },
        committed_at: '2026-10-02',
        message: 'merge commit',
        is_merge: true,
        additions: 4,
        deletions: 1,
      },
    ];

    it('keeps merge commits when showMerges is true', () => {
      const result = filterHistoryEntries(entries, true);
      expect(result).toHaveLength(2);
    });

    it('removes merge commits when showMerges is false', () => {
      const result = filterHistoryEntries(entries, false);
      expect(result).toHaveLength(1);
      expect(result[0].sha).toBe('1');
      expect(result[0].is_merge).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO strings', () => {
      const formatted = formatDate('2026-10-24T18:30:00Z');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Oct');
    });

    it('handles null and invalid strings gracefully', () => {
      expect(formatDate(null)).toBe('—');
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });
  });
});
