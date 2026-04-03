-- Enable REPLICA IDENTITY FULL for order_items table for realtime notifications
ALTER TABLE order_items REPLICA IDENTITY FULL;

-- Add order_items to realtime publication (if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
  END IF;
END $$;

-- Also ensure project_messages is in the publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'project_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE project_messages;
  END IF;
END $$;

