// Subscription Limit Type - matches database enum: subscription_duration
export type SubscriptionLimit = 'monthly' | 'yearly';

// Core Product Stack Types
export interface SubStack {
  id: string
  stack_id: string
  name: string
  price: number
  is_free: boolean
  created_at: string
  author_id: string
  type?: string
}

export interface Stack {
  id: string
  name: string
  description?: string
  type?: string
  base_price: number
  active: boolean
  author_id?: string
  created_at: string
  sub_stacks?: SubStack[]
}

// Canvas-related Types
export interface CanvasNode {
  id: string;
  label: string;
  type?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  parentId?: string;
  isSaved?: boolean; // For clusters and locked children
  base_price?: number; // Price for pricing calculations
}

export interface InteractionState {
  mode: 'idle' | 'drag' | 'resize';
  id: string | null;
}

export interface ZoomState {
  scale: number;
  panOffset: { x: number; y: number };
}

