-- Migration: Move subscription_duration from stacks to orders table

-- Add subscription_duration column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subscription_duration subscription_duration DEFAULT 'yearly';

-- Remove subscription_duration column from stacks table
ALTER TABLE stacks DROP COLUMN IF EXISTS subscription_duration;
