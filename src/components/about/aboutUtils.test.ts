import { describe, it, expect } from 'vitest';
import {
  filterLimitations,
  getAreaCounts,
  resolveHashToLimitationId,
  toggleAccordionItem,
  toggleExpandedSet,
} from './aboutUtils';
import { LimitationItem } from '../../content/about';

const mockItems: LimitationItem[] = [
  {
    id: 'renames-break-history',
    title: 'Renames can break history',
    area: 'history',
    description: 'Renames detection test',
  },
  {
    id: 'git-log-follow',
    title: 'git log --follow is not used',
    area: 'history',
    description: 'Follow limitation',
  },
  {
    id: 'bus-factor-estimate',
    title: 'Bus factor is an estimate',
    area: 'metrics',
    description: 'Bus factor test',
  },
  {
    id: 'large-history-limits',
    title: 'Performance limits',
    area: 'performance',
    description: 'Perf test',
  },
];

describe('aboutUtils', () => {
  describe('filterLimitations', () => {
    it('returns all items when area is "all"', () => {
      const result = filterLimitations(mockItems, 'all');
      expect(result).toHaveLength(4);
    });

    it('filters items strictly by area', () => {
      const historyItems = filterLimitations(mockItems, 'history');
      expect(historyItems).toHaveLength(2);
      expect(historyItems.every((item) => item.area === 'history')).toBe(true);

      const metricsItems = filterLimitations(mockItems, 'metrics');
      expect(metricsItems).toHaveLength(1);
      expect(metricsItems[0].id).toBe('bus-factor-estimate');
    });
  });

  describe('getAreaCounts', () => {
    it('counts occurrences for all known areas and total', () => {
      const counts = getAreaCounts(mockItems);
      expect(counts.all).toBe(4);
      expect(counts.history).toBe(2);
      expect(counts.metrics).toBe(1);
      expect(counts.performance).toBe(1);
      expect(counts.scope).toBe(0);
    });
  });

  describe('resolveHashToLimitationId', () => {
    it('resolves direct exact id with or without hash prefix', () => {
      expect(resolveHashToLimitationId('#bus-factor-estimate', mockItems)).toBe('bus-factor-estimate');
      expect(resolveHashToLimitationId('bus-factor-estimate', mockItems)).toBe('bus-factor-estimate');
    });

    it('resolves common aliases properly', () => {
      expect(resolveHashToLimitationId('#bus-factor', mockItems)).toBe('bus-factor-estimate');
      expect(resolveHashToLimitationId('#renames', mockItems)).toBe('renames-break-history');
      expect(resolveHashToLimitationId('#follow', mockItems)).toBe('git-log-follow');
    });

    it('returns null for unknown hashes or empty strings', () => {
      expect(resolveHashToLimitationId('#unknown-anchor', mockItems)).toBe(null);
      expect(resolveHashToLimitationId('', mockItems)).toBe(null);
      expect(resolveHashToLimitationId('#', mockItems)).toBe(null);
    });
  });

  describe('toggleAccordionItem', () => {
    it('opens an item when nothing is open', () => {
      expect(toggleAccordionItem(null, 'faq-1')).toBe('faq-1');
    });

    it('closes an item when clicking the already open item', () => {
      expect(toggleAccordionItem('faq-1', 'faq-1')).toBe(null);
    });

    it('switches to new item when another item is currently open', () => {
      expect(toggleAccordionItem('faq-1', 'faq-2')).toBe('faq-2');
    });
  });

  describe('toggleExpandedSet', () => {
    it('adds id if not in set', () => {
      const initial = new Set(['item-1']);
      const updated = toggleExpandedSet(initial, 'item-2');
      expect(updated.has('item-1')).toBe(true);
      expect(updated.has('item-2')).toBe(true);
    });

    it('removes id if already present in set', () => {
      const initial = new Set(['item-1', 'item-2']);
      const updated = toggleExpandedSet(initial, 'item-1');
      expect(updated.has('item-1')).toBe(false);
      expect(updated.has('item-2')).toBe(true);
    });
  });
});
