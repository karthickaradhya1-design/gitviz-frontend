import { LimitationItem, LimitationArea } from '../../content/about';

export type AreaFilter = 'all' | LimitationArea;

/**
 * Filter limitations by area category
 */
export function filterLimitations(
  items: LimitationItem[],
  area: AreaFilter
): LimitationItem[] {
  if (area === 'all') {
    return items;
  }
  return items.filter((item) => item.area === area);
}

/**
 * Compute counts for all filter tabs
 */
export function getAreaCounts(items: LimitationItem[]): Record<AreaFilter, number> {
  const counts: Record<AreaFilter, number> = {
    all: items.length,
    history: 0,
    metrics: 0,
    performance: 0,
    scope: 0,
  };

  for (const item of items) {
    if (counts[item.area] !== undefined) {
      counts[item.area]++;
    }
  }

  return counts;
}

/**
 * Resolve URL hash fragment (e.g. #bus-factor or #renames-break-history)
 * to a specific limitation id, supporting exact matches and common aliases.
 */
export function resolveHashToLimitationId(
  hash: string,
  items: LimitationItem[]
): string | null {
  if (!hash) return null;
  const clean = hash.replace(/^#/, '').toLowerCase().trim();
  if (!clean) return null;

  // 1. Direct match on id
  const exact = items.find((item) => item.id.toLowerCase() === clean);
  if (exact) return exact.id;

  // 2. Prefix / alias matching
  const aliasMap: Record<string, string> = {
    'bus-factor': 'bus-factor-estimate',
    'renames': 'renames-break-history',
    'follow': 'git-log-follow',
    'churn': 'churn-not-bug-predictor',
    'merge-commits': 'merge-commits-affect-numbers',
    'lockfiles': 'lockfiles-ignored-by-default',
    'performance': 'large-history-limits',
    'graph': 'graph-layout-overlap',
  };

  if (aliasMap[clean]) {
    const aliased = items.find((item) => item.id === aliasMap[clean]);
    if (aliased) return aliased.id;
  }

  // 3. Substring match
  const partial = items.find(
    (item) => item.id.includes(clean) || clean.includes(item.id)
  );
  return partial ? partial.id : null;
}

/**
 * Handle one-open-at-a-time accordion state
 */
export function toggleAccordionItem(
  currentOpenId: string | null,
  clickedId: string
): string | null {
  return currentOpenId === clickedId ? null : clickedId;
}

/**
 * Toggle a card id inside a Set of expanded IDs
 */
export function toggleExpandedSet(
  currentSet: Set<string>,
  id: string
): Set<string> {
  const next = new Set(currentSet);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}
