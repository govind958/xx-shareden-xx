import { SubscriptionLimit } from "@/src/types/product_stacks";

/**
 * Calculate next payment date based on created_at + subscription_duration
 */
export const calculateNextPayment = (
  createdAt: string,
  duration: SubscriptionLimit
): { date: string; days: number } => {
  const created = new Date(createdAt);
  const now = new Date();

  // Extract the number from duration (e.g., "3 month" -> 3)
  const months = parseInt(duration.split(" ")[0]);

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
  return duration.replace("month", "Month");
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
  const months = parseInt(duration.split(" ")[0]);
  const nextPayment = new Date(created);
  nextPayment.setMonth(nextPayment.getMonth() + months);
  
  const diffTime = nextPayment.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

