import { SubscriptionLimit } from "@/src/types/product_stacks";

/**
 * Get months for subscription duration
 */
const getMonthsForDuration = (duration: SubscriptionLimit): number => {
  return duration === 'yearly' ? 12 : 1;
};

/**
 * Calculate next payment date based on created_at + subscription_duration
 */
export const calculateNextPayment = (
  createdAt: string,
  duration: SubscriptionLimit
): { date: string; days: number } => {
  const created = new Date(createdAt);
  const now = new Date();

  const months = getMonthsForDuration(duration);

  // Calculate next payment date
  const nextPayment = new Date(created);
  nextPayment.setMonth(nextPayment.getMonth() + months);

  // Calculate days remaining
  const diffTime = nextPayment.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    date: nextPayment.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    days: Math.max(0, diffDays),
  };
};

/**
 * Format subscription cycle for display
 */
export const formatSubscriptionCycle = (duration: SubscriptionLimit): string => {
  return duration.charAt(0).toUpperCase() + duration.slice(1);
};

/**
 * Calculate remaining subscription period in days
 */
export const calculateRemainingDays = (
  createdAt: string,
  duration: SubscriptionLimit
): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const months = getMonthsForDuration(duration);
  const nextPayment = new Date(created);
  nextPayment.setMonth(nextPayment.getMonth() + months);
  
  const diffTime = nextPayment.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

