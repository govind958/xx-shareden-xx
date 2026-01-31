// Utility functions for subscription limits

import { SubscriptionLimit } from '@/src/types/product_stacks';

/**
 * All available subscription duration options from database enum
 */
export const SUBSCRIPTION_LIMITS: readonly SubscriptionLimit[] = [
  '1 month',
  '3 month', 
  '6 month'
] as const;

/**
 * Format subscription limit for display
 * Converts '1 month' -> '1 Month'
 */
export function formatSubscriptionLimit(limit: SubscriptionLimit): string {
  const [number, unit] = limit.split(' ');
  return `${number} ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
}

/**
 * Default subscription limit (UI default, not database default)
 */
export const DEFAULT_SUBSCRIPTION_LIMIT: SubscriptionLimit = '6 month';

