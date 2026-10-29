import { describe, it, expect } from 'vitest';
import {
  truncateMiddle,
  getTopHotspotPaths,
  classifyBusFactor,
  escapeCsvField,
  generateTopFilesCsv,
  formatActivePeriod,
  formatPercent,
} from './metricsUtils';
import { TopFile } from '../../api/types';

describe('metricsUtils', () => {
  describe('truncateMiddle', () => {
    it('returns short path unchanged', () => {
      expect(truncateMiddle('src/App.tsx', 20)).toBe('src/App.tsx');
    });

    it('middle-truncates long path with ellipsis', () => {
      const longPath = 'src/components/graph/layout/laneLayout.ts';
      const truncated = truncateMiddle(longPath, 25);
      expect(truncated.length).toBe(25);
      expect(truncated).toContain('...');
      expect(truncated.startsWith('src/')).toBe(true);
      expect(truncated.endsWith('.ts')).toBe(true);
    });

    it('handles edge cases for empty string and short maxLength', () => {
      expect(truncateMiddle('', 20)).toBe('');
      expect(truncateMiddle('abcdefghij', 4)).toBe('abcd');
    });
  });

  describe('getTopHotspotPaths', () => {
    const mockFiles: TopFile[] = [
      { path: 'fileA.ts', churn_commits: 10, churn_lines: 100, last_touch_at: '2026-01-01' },
      { path: 'fileB.ts', churn_commits: 40, churn_lines: 400, last_touch_at: '2026-01-01' },
      { path: 'fileC.ts', churn_commits: 25, churn_lines: 250, last_touch_at: '2026-01-01' },
      { path: 'fileD.ts', churn_commits: 5, churn_lines: 50, last_touch_at: '2026-01-01' },
      { path: 'fileE.ts', churn_commits: 50, churn_lines: 500, last_touch_at: '2026-01-01' },
    ];

    it('returns the top 3 files by churn_commits', () => {
      const hotspots = getTopHotspotPaths(mockFiles, 3);
      expect(hotspots.size).toBe(3);
      expect(hotspots.has('fileE.ts')).toBe(true); // 50
      expect(hotspots.has('fileB.ts')).toBe(true); // 40
      expect(hotspots.has('fileC.ts')).toBe(true); // 25
      expect(hotspots.has('fileA.ts')).toBe(false);
      expect(hotspots.has('fileD.ts')).toBe(false);
    });

    it('handles empty input cleanly', () => {
      expect(getTopHotspotPaths([])).toEqual(new Set());
    });
  });

  describe('classifyBusFactor', () => {
    it('classifies 1 as Concentrated (danger)', () => {
      const result = classifyBusFactor(1);
      expect(result.level).toBe('danger');
      expect(result.label).toBe('Concentrated');
    });

    it('classifies 2 as Moderate (warning)', () => {
      const result = classifyBusFactor(2);
      expect(result.level).toBe('warning');
      expect(result.label).toBe('Moderate');
    });

    it('classifies 3 and above as Spread (success)', () => {
      const result3 = classifyBusFactor(3);
      expect(result3.level).toBe('success');
      expect(result3.label).toBe('Spread');

      const result5 = classifyBusFactor(5);
      expect(result5.level).toBe('success');
      expect(result5.label).toBe('Spread');
    });
  });

  describe('escapeCsvField', () => {
    it('leaves standard strings unchanged', () => {
      expect(escapeCsvField('src/router.ts')).toBe('src/router.ts');
      expect(escapeCsvField(42)).toBe('42');
    });

    it('escapes fields containing commas', () => {
      expect(escapeCsvField('src/hello, world.ts')).toBe('"src/hello, world.ts"');
    });

    it('escapes fields containing quotes', () => {
      expect(escapeCsvField('src/"quoted"/file.ts')).toBe('"src/""quoted""/file.ts"');
    });
  });

  describe('generateTopFilesCsv', () => {
    it('returns header row on empty input', () => {
      expect(generateTopFilesCsv([])).toBe('path,churn_commits,churn_lines,last_touch_at');
    });

    it('generates valid multi-row CSV including quoted strings', () => {
      const files: TopFile[] = [
        { path: 'src/main.ts', churn_commits: 12, churn_lines: 90, last_touch_at: '2026-10-24' },
        { path: 'src/config,defaults.ts', churn_commits: 8, churn_lines: 45, last_touch_at: '2026-10-20' },
      ];
      const csv = generateTopFilesCsv(files);
      const lines = csv.split('\n');
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('path,churn_commits,churn_lines,last_touch_at');
      expect(lines[1]).toBe('src/main.ts,12,90,2026-10-24');
      expect(lines[2]).toBe('"src/config,defaults.ts",8,45,2026-10-20');
    });
  });

  describe('formatActivePeriod', () => {
    it('formats ISO dates to Month Year span', () => {
      const period = formatActivePeriod('2025-11-04T10:14:00Z', '2026-10-24T18:30:00Z');
      expect(period).toContain('Nov 2025');
      expect(period).toContain('Oct 2026');
      expect(period).toContain('–');
    });

    it('returns dash on null or invalid input', () => {
      expect(formatActivePeriod(null, null)).toBe('—');
      expect(formatActivePeriod('invalid', 'dates')).toBe('—');
    });
  });

  describe('formatPercent', () => {
    it('converts decimal fraction to percentage string', () => {
      expect(formatPercent(0.58)).toBe('58%');
      expect(formatPercent(0.882)).toBe('88%');
      expect(formatPercent(1)).toBe('100%');
      expect(formatPercent(0)).toBe('0%');
    });
  });
});
