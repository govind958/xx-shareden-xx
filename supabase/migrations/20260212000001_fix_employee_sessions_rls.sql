-- Fix employee_sessions RLS: allow all access (same pattern as employees table)
-- The previous policy blocked all access which prevented session creation

DROP POLICY IF EXISTS "employee_sessions: no public access" ON "public"."employee_sessions";

CREATE POLICY "employee_sessions: allow all access"
  ON "public"."employee_sessions" USING (true) WITH CHECK (true);
