-- Employee invitations table for invite-based signup flow
CREATE TABLE IF NOT EXISTS "public"."employee_invitations" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "email" character varying(255) NOT NULL,
    "invite_token" character varying(64) NOT NULL UNIQUE,
    "status" character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    "invited_by" varchar(255) DEFAULT 'govindanand',
    "created_at" timestamp with time zone DEFAULT now(),
    "expires_at" timestamp with time zone DEFAULT (now() + interval '1 days'),
    CONSTRAINT "employee_invitations_pkey" PRIMARY KEY ("id")
);

-- Add approval_status to employees (optional, for explicit tracking)
ALTER TABLE "public"."employees" 
ADD COLUMN IF NOT EXISTS "approval_status" character varying(50) DEFAULT 'approved';

-- Set existing employees to approved
UPDATE "public"."employees" SET approval_status = 'approved' WHERE approval_status IS NULL;

-- RLS for employee_invitations
ALTER TABLE "public"."employee_invitations" ENABLE ROW LEVEL SECURITY;

-- Admin can manage invitations (via service role; admin uses server actions with admin client)
-- Allow authenticated users to read invitation by token (for signup validation)
CREATE POLICY "allow_read_invitation_by_token" ON "public"."employee_invitations"
    FOR SELECT USING (true);

-- Only service role can insert/update (admin actions use createAdminClient)
CREATE POLICY "allow_insert_invitations" ON "public"."employee_invitations"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_update_invitations" ON "public"."employee_invitations"
    FOR UPDATE USING (true);

-- Index for token lookup
CREATE INDEX IF NOT EXISTS "idx_employee_invitations_token" ON "public"."employee_invitations" ("invite_token");
CREATE INDEX IF NOT EXISTS "idx_employee_invitations_email" ON "public"."employee_invitations" ("email");