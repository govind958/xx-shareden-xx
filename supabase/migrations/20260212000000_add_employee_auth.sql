-- Add password_hash column to employees table
ALTER TABLE "public"."employees"
  ADD COLUMN IF NOT EXISTS "password_hash" TEXT;

-- Create employee_sessions table (mirrors admin_sessions)
CREATE TABLE IF NOT EXISTS "public"."employee_sessions" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "employee_id" uuid NOT NULL,
    "session_token" text NOT NULL,
    "expires_at" timestamptz NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT "employee_sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "employee_sessions_session_token_key" UNIQUE ("session_token"),
    CONSTRAINT "employee_sessions_employee_id_fkey"
      FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."employee_sessions" OWNER TO "postgres";

-- Indexes
CREATE INDEX IF NOT EXISTS "employee_sessions_token_idx"
  ON "public"."employee_sessions" USING btree ("session_token");

CREATE INDEX IF NOT EXISTS "employee_sessions_employee_id_idx"
  ON "public"."employee_sessions" USING btree ("employee_id");

CREATE INDEX IF NOT EXISTS "employee_sessions_expires_at_idx"
  ON "public"."employee_sessions" USING btree ("expires_at");

-- RLS: allow all access (same pattern as employees table)
ALTER TABLE "public"."employee_sessions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employee_sessions: allow all access"
  ON "public"."employee_sessions" USING (true) WITH CHECK (true);

-- Grant access to roles
GRANT ALL ON TABLE "public"."employee_sessions" TO "anon";
GRANT ALL ON TABLE "public"."employee_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_sessions" TO "service_role";
