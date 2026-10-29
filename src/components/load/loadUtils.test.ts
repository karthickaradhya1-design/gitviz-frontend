import { describe, it, expect } from 'vitest';
import {
  validateRepoPath,
  getRepoNameFromPath,
  getStepFromPct,
  getStepItems,
  addRecentRepo,
  RecentRepo,
} from './loadUtils';

describe('loadUtils', () => {
  describe('validateRepoPath', () => {
    it('returns error when path is empty or whitespace-only', () => {
      expect(validateRepoPath('')).toBe('Repository path is required.');
      expect(validateRepoPath('   ')).toBe('Repository path is required.');
      expect(validateRepoPath(null as unknown as string)).toBe('Repository path is required.');
    });

    it('returns error when path contains control characters or newlines', () => {
      expect(validateRepoPath('C:\\projects\\my-repo\n')).toBe(
        'Path contains invalid control characters or line breaks.'
      );
      expect(validateRepoPath('/home/user/repo\r\n')).toBe(
        'Path contains invalid control characters or line breaks.'
      );
      expect(validateRepoPath('repo\twith\ttabs')).toBe(
        'Path contains invalid control characters or line breaks.'
      );
      expect(validateRepoPath('bad\x00path')).toBe(
        'Path contains invalid control characters or line breaks.'
      );
    });

    it('accepts valid Windows and Unix paths', () => {
      expect(validateRepoPath('C:\\Users\\you\\projects\\my-repo')).toBeNull();
      expect(validateRepoPath('D:/dev/gitviz')).toBeNull();
      expect(validateRepoPath('~/projects/my-repo')).toBeNull();
      expect(validateRepoPath('/var/git/linux.git')).toBeNull();
      expect(validateRepoPath('./local-repository')).toBeNull();
      expect(validateRepoPath('C:\\code\\folder with spaces\\project')).toBeNull();
      expect(validateRepoPath('/home/user/projets/développement')).toBeNull();
    });
  });

  describe('getRepoNameFromPath', () => {
    it('extracts name from Unix paths', () => {
      expect(getRepoNameFromPath('/home/user/projects/gitviz')).toBe('gitviz');
      expect(getRepoNameFromPath('~/code/awesome-tool')).toBe('awesome-tool');
    });

    it('extracts name from Windows paths with backslashes', () => {
      expect(getRepoNameFromPath('C:\\Users\\dev\\projects\\my-app')).toBe('my-app');
      expect(getRepoNameFromPath('D:\\repositories\\gitviz-backend')).toBe('gitviz-backend');
    });

    it('handles trailing slashes and backslashes cleanly', () => {
      expect(getRepoNameFromPath('/home/user/projects/gitviz/')).toBe('gitviz');
      expect(getRepoNameFromPath('/home/user/projects/gitviz///')).toBe('gitviz');
      expect(getRepoNameFromPath('C:\\Users\\dev\\projects\\my-app\\')).toBe('my-app');
      expect(getRepoNameFromPath('C:\\Users\\dev\\projects\\my-app\\\\\\')).toBe('my-app');
    });

    it('handles paths with spaces and punctuation', () => {
      expect(getRepoNameFromPath('/var/www/my cool website')).toBe('my cool website');
      expect(getRepoNameFromPath('C:\\code\\project (v2)')).toBe('project (v2)');
    });

    it('handles root or empty inputs gracefully', () => {
      expect(getRepoNameFromPath('')).toBe('repository');
      expect(getRepoNameFromPath('/')).toBe('repository');
      expect(getRepoNameFromPath('C:\\')).toBe('drive-c');
    });
  });

  describe('getStepFromPct & getStepItems', () => {
    it('maps pct ranges to correct milestone step id', () => {
      expect(getStepFromPct(0)).toBe('queued');
      expect(getStepFromPct(10)).toBe('reading');
      expect(getStepFromPct(50)).toBe('reading');
      expect(getStepFromPct(80)).toBe('saving');
      expect(getStepFromPct(95)).toBe('saving');
      expect(getStepFromPct(100)).toBe('done');
    });

    it('derives accurate step statuses for 0% (Queued)', () => {
      const items = getStepItems(0);
      expect(items).toEqual([
        { id: 'queued', label: 'Queued', status: 'active' },
        { id: 'reading', label: 'Reading history', status: 'pending' },
        { id: 'saving', label: 'Saving results', status: 'pending' },
        { id: 'done', label: 'Done', status: 'pending' },
      ]);
    });

    it('derives accurate step statuses for 50% (Reading history)', () => {
      const items = getStepItems(50);
      expect(items).toEqual([
        { id: 'queued', label: 'Queued', status: 'completed' },
        { id: 'reading', label: 'Reading history', status: 'active' },
        { id: 'saving', label: 'Saving results', status: 'pending' },
        { id: 'done', label: 'Done', status: 'pending' },
      ]);
    });

    it('derives accurate step statuses for 85% (Saving results)', () => {
      const items = getStepItems(85);
      expect(items).toEqual([
        { id: 'queued', label: 'Queued', status: 'completed' },
        { id: 'reading', label: 'Reading history', status: 'completed' },
        { id: 'saving', label: 'Saving results', status: 'active' },
        { id: 'done', label: 'Done', status: 'pending' },
      ]);
    });

    it('derives accurate step statuses for 100% (Done)', () => {
      const items = getStepItems(100);
      expect(items).toEqual([
        { id: 'queued', label: 'Queued', status: 'completed' },
        { id: 'reading', label: 'Reading history', status: 'completed' },
        { id: 'saving', label: 'Saving results', status: 'completed' },
        { id: 'done', label: 'Done', status: 'completed' },
      ]);
    });
  });

  describe('addRecentRepo', () => {
    it('adds entry to an empty recent list', () => {
      const result = addRecentRepo([], { path: '~/projects/gitviz' });
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('~/projects/gitviz');
      expect(result[0].name).toBe('gitviz');
      expect(result[0].lastLoadedAt).toBeDefined();
    });

    it('deduplicates existing path and moves it to the front', () => {
      const initial: RecentRepo[] = [
        { path: '~/projects/alpha', name: 'alpha', lastLoadedAt: '2026-10-01T00:00:00Z' },
        { path: '~/projects/beta', name: 'beta', lastLoadedAt: '2026-10-02T00:00:00Z' },
      ];

      const result = addRecentRepo(initial, { path: '~/projects/beta' });
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('beta');
      expect(result[1].name).toBe('alpha');
    });

    it('limits list to a maximum of 5 recent repositories', () => {
      const initial: RecentRepo[] = [
        { path: '/repo/1', name: 'repo-1', lastLoadedAt: '2026-10-01' },
        { path: '/repo/2', name: 'repo-2', lastLoadedAt: '2026-10-02' },
        { path: '/repo/3', name: 'repo-3', lastLoadedAt: '2026-10-03' },
        { path: '/repo/4', name: 'repo-4', lastLoadedAt: '2026-10-04' },
        { path: '/repo/5', name: 'repo-5', lastLoadedAt: '2026-10-05' },
      ];

      const result = addRecentRepo(initial, { path: '/repo/repo-6' });
      expect(result).toHaveLength(5);
      expect(result[0].name).toBe('repo-6');
      expect(result.some((r) => r.name === 'repo-5')).toBe(false); // Oldest dropped
    });
  });
});
