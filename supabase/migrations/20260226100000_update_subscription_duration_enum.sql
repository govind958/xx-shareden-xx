-- Migration: Change subscription_duration enum from '1 month', '3 month', '6 month' to 'monthly', 'yearly'

-- Step 1: Add new enum type
CREATE TYPE subscription_duration_new AS ENUM ('monthly', 'yearly');

-- Step 2: Add temporary column with new type
ALTER TABLE stacks 
ADD COLUMN subscription_duration_temp subscription_duration_new DEFAULT 'yearly';

-- Step 3: Migrate existing data (map old values to new)
UPDATE stacks 
SET subscription_duration_temp = CASE 
    WHEN subscription_duration = '1 month' THEN 'monthly'::subscription_duration_new
    ELSE 'yearly'::subscription_duration_new
END
WHERE subscription_duration IS NOT NULL;

-- Step 4: Drop old column
ALTER TABLE stacks DROP COLUMN subscription_duration;

-- Step 5: Rename new column to original name
ALTER TABLE stacks RENAME COLUMN subscription_duration_temp TO subscription_duration;

-- Step 6: Drop old enum type
DROP TYPE subscription_duration;

-- Step 7: Rename new enum type to original name
ALTER TYPE subscription_duration_new RENAME TO subscription_duration;
