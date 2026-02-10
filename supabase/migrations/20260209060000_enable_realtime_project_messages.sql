-- Enable REPLICA IDENTITY FULL for project_messages table
-- This is required for realtime filters to work (e.g., order_item_id=eq.${id})
-- Note: project_messages is already in supabase_realtime publication

ALTER TABLE project_messages REPLICA IDENTITY FULL;
