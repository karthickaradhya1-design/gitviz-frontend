import { describe, it, expect } from 'vitest';
import commitsData from './commits.json';
import commitDetailData from './commit-detail.json';
import filesData from './files.json';
import fileHistoryData from './file-history.json';
import fileHistorySimpleData from './file-history-simple.json';
import metricsChurnData from './metrics-churn.json';
import metricsBusFactorData from './metrics-bus-factor.json';

describe('API Contract Verification (Mock Fixtures)', () => {
  describe('commits.json contract', () => {
    it('matches CommitListResponse structure and primitive types', () => {
      expect(Array.isArray(commitsData.commits)).toBe(true);
      expect(commitsData.commits.length).toBeGreaterThan(0);
      expect('next_cursor' in commitsData).toBe(true);

      const commit = commitsData.commits[0];
      expect(typeof commit.sha).toBe('string');
      expect(typeof commit.short_sha).toBe('string');
      expect(Array.isArray(commit.parents)).toBe(true);
      expect(typeof commit.author).toBe('object');
      expect(typeof commit.author.name).toBe('string');
      expect(typeof commit.author.email).toBe('string');
      expect(typeof commit.committed_at).toBe('string');
      expect(typeof commit.message).toBe('string');
      expect(typeof commit.is_merge).toBe('boolean');
      expect(typeof commit.files_changed).toBe('number');
      expect(typeof commit.additions).toBe('number');
      expect(typeof commit.deletions).toBe('number');
    });
  });

  describe('commit-detail.json contract', () => {
    it('matches CommitDetail structure with changed file objects', () => {
      expect(typeof commitDetailData.sha).toBe('string');
      expect(Array.isArray(commitDetailData.files)).toBe(true);
      expect(commitDetailData.files.length).toBeGreaterThan(0);

      const file = commitDetailData.files[0];
      expect(typeof file.path).toBe('string');
      expect(file.old_path === null || typeof file.old_path === 'string').toBe(true);
      expect(typeof file.additions).toBe('number');
      expect(typeof file.deletions).toBe('number');
      expect(typeof file.is_binary).toBe('boolean');
    });
  });

  describe('files.json contract', () => {
    it('matches FileSummary array structure and primitive types', () => {
      expect(Array.isArray(filesData)).toBe(true);
      expect(filesData.length).toBeGreaterThan(0);

      const file = filesData[0];
      expect(typeof file.path).toBe('string');
      expect(typeof file.commit_count).toBe('number');
      expect(typeof file.last_touch_at).toBe('string');
    });
  });

  describe('file-history.json and simple variant contract', () => {
    it('matches FileHistoryResponse structure with timeline entries and diffs', () => {
      for (const history of [fileHistoryData, fileHistorySimpleData]) {
        expect(typeof history.path).toBe('string');
        expect(typeof history.history_complete).toBe('boolean');
        expect(Array.isArray(history.entries)).toBe(true);
        expect(history.entries.length).toBeGreaterThan(0);

        const entry = history.entries[0];
        expect(typeof entry.sha).toBe('string');
        expect(typeof entry.short_sha).toBe('string');
        expect(Array.isArray(entry.parents)).toBe(true);
        expect(typeof entry.author).toBe('object');
        expect(typeof entry.author.name).toBe('string');
        expect(typeof entry.committed_at).toBe('string');
        expect(typeof entry.message).toBe('string');
        expect(typeof entry.is_merge).toBe('boolean');
        expect(typeof entry.additions).toBe('number');
        expect(typeof entry.deletions).toBe('number');
        if (entry.diff !== undefined) {
          expect(typeof entry.diff).toBe('string');
        }
      }
    });
  });

  describe('metrics-churn.json contract', () => {
    it('matches ChurnResponse structure and primitive types', () => {
      expect(typeof metricsChurnData.repo).toBe('object');
      expect(typeof metricsChurnData.repo.name).toBe('string');
      expect(typeof metricsChurnData.repo.commit_count).toBe('number');
      expect(typeof metricsChurnData.repo.author_count).toBe('number');
      expect(typeof metricsChurnData.repo.first_commit_at).toBe('string');
      expect(typeof metricsChurnData.repo.last_commit_at).toBe('string');

      expect(typeof metricsChurnData.merge_commits_counted).toBe('boolean');
      expect(Array.isArray(metricsChurnData.ignored_patterns)).toBe(true);
      expect(Array.isArray(metricsChurnData.top_files)).toBe(true);
      expect(Array.isArray(metricsChurnData.commits_per_author)).toBe(true);
      expect(Array.isArray(metricsChurnData.churn_over_time)).toBe(true);

      const topFile = metricsChurnData.top_files[0];
      expect(typeof topFile.path).toBe('string');
      expect(typeof topFile.churn_commits).toBe('number');
      expect(typeof topFile.churn_lines).toBe('number');
      expect(typeof topFile.last_touch_at).toBe('string');

      const author = metricsChurnData.commits_per_author[0];
      expect(typeof author.name).toBe('string');
      expect(typeof author.commits).toBe('number');
      expect(typeof author.lines_added).toBe('number');

      const point = metricsChurnData.churn_over_time[0];
      expect(typeof point.period).toBe('string');
      expect(typeof point.commits).toBe('number');
      expect(typeof point.lines_changed).toBe('number');
    });
  });

  describe('metrics-bus-factor.json contract', () => {
    it('matches BusFactorResponse structure and primitive types', () => {
      expect(typeof metricsBusFactorData.score).toBe('number');
      expect(typeof metricsBusFactorData.label).toBe('string');
      expect(typeof metricsBusFactorData.top_contributor_share).toBe('number');
      expect(Array.isArray(metricsBusFactorData.modules)).toBe(true);
      expect(metricsBusFactorData.modules.length).toBeGreaterThan(0);

      const mod = metricsBusFactorData.modules[0];
      expect(typeof mod.path).toBe('string');
      expect(typeof mod.bus_factor).toBe('number');
      expect(typeof mod.top_author).toBe('string');
      expect(typeof mod.top_author_share).toBe('number');
    });
  });
});
