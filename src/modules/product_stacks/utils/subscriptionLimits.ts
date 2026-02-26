// Utility functions for subscription limits

import { SubscriptionLimit } from '@/src/types/product_stacks';

/**
 * All available subscription duration options from database enum
 */
export const SUBSCRIPTION_LIMITS: readonly SubscriptionLimit[] = [
  'monthly',
  'yearly'
] as const;

/**
 * Format subscription limit for display
 * Converts 'monthly' -> 'Monthly', 'yearly' -> 'Yearly'
 */
export function formatSubscriptionLimit(limit: SubscriptionLimit): string {
  return limit.charAt(0).toUpperCase() + limit.slice(1);
}

/**
 * Default subscription limit (UI default, not database default)
 */
export const DEFAULT_SUBSCRIPTION_LIMIT: SubscriptionLimit = 'yearly';

