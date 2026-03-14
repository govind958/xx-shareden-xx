-- Drop the extra updated_at column from the support_tickets table
ALTER TABLE support_tickets 
DROP COLUMN IF EXISTS updated_at;