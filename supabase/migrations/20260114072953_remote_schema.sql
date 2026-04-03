

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_users_with_order_stats"() RETURNS TABLE("user_id" "uuid", "email" "text", "name" "text", "orders_count" bigint, "total_amount" numeric, "last_order_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    au.id AS user_id,
    au.email::text,
    p.name,
    COUNT(o.id) AS orders_count,
    COALESCE(SUM(o.total_amount), 0) AS total_amount,
    MAX(o.created_at) AS last_order_at
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.user_id
  LEFT JOIN public.orders o ON au.id = o.user_id
  GROUP BY au.id, au.email, p.name
  ORDER BY MAX(o.created_at) DESC NULLS LAST;
END;
$$;


ALTER FUNCTION "public"."get_users_with_order_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (user_id, name)
  values (new.id, new.email);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin_user_id" "uuid" NOT NULL,
    "session_token" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "secret_key_hash" "text" NOT NULL,
    "password_hash" "text" NOT NULL,
    "name" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_stacks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stack_id" "uuid" NOT NULL,
    "sub_stack_ids" "uuid"[],
    "total_price" numeric DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cart_stacks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "order_item_id" "uuid" NOT NULL,
    "assigned_at" timestamp with time zone DEFAULT "now"(),
    "assigned_by" "uuid",
    "status" character varying(50) DEFAULT 'assigned'::character varying,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."employee_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "role" character varying(100) NOT NULL,
    "specialization" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."employees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forms" (
    "form_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "label" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image_url" "text"
);


ALTER TABLE "public"."forms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stack_id" "uuid" NOT NULL,
    "sub_stack_ids" "uuid"[],
    "status" "text" DEFAULT 'initiated'::"text" NOT NULL,
    "step" integer DEFAULT 1 NOT NULL,
    "progress_percent" integer DEFAULT 0 NOT NULL,
    "eta" "date",
    "user_note" "text",
    "admin_note" "text",
    "assigned_to" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "total_amount" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text",
    "description" "text",
    "base_price" numeric(10,2),
    "active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."stacks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sub_stacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "stack_id" "uuid",
    "name" "text" NOT NULL,
    "price" numeric(10,2) DEFAULT 0,
    "is_free" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."sub_stacks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usage_tracking" (
    "user_id" "uuid" NOT NULL,
    "year_month" "text" NOT NULL,
    "tasks_created" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."usage_tracking" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_sessions"
    ADD CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_sessions"
    ADD CONSTRAINT "admin_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_stacks"
    ADD CONSTRAINT "cart_stacks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_employee_id_order_item_id_key" UNIQUE ("employee_id", "order_item_id");



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("form_id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."stacks"
    ADD CONSTRAINT "stacks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sub_stacks"
    ADD CONSTRAINT "sub_stacks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usage_tracking"
    ADD CONSTRAINT "usage_tracking_pkey" PRIMARY KEY ("user_id", "year_month");



CREATE INDEX "admin_sessions_admin_user_id_idx" ON "public"."admin_sessions" USING "btree" ("admin_user_id");



CREATE INDEX "admin_sessions_expires_at_idx" ON "public"."admin_sessions" USING "btree" ("expires_at");



CREATE INDEX "admin_sessions_token_idx" ON "public"."admin_sessions" USING "btree" ("session_token");



CREATE INDEX "admin_users_email_idx" ON "public"."admin_users" USING "btree" ("email");



CREATE INDEX "admin_users_is_active_idx" ON "public"."admin_users" USING "btree" ("is_active");



CREATE INDEX "employee_assignments_employee_id_idx" ON "public"."employee_assignments" USING "btree" ("employee_id");



CREATE INDEX "employee_assignments_order_item_id_idx" ON "public"."employee_assignments" USING "btree" ("order_item_id");



CREATE INDEX "employee_assignments_status_idx" ON "public"."employee_assignments" USING "btree" ("status");



CREATE INDEX "employees_email_idx" ON "public"."employees" USING "btree" ("email");



CREATE INDEX "employees_is_active_idx" ON "public"."employees" USING "btree" ("is_active");



CREATE INDEX "employees_role_idx" ON "public"."employees" USING "btree" ("role");



CREATE INDEX "forms_created_at_idx" ON "public"."forms" USING "btree" ("created_at");



CREATE INDEX "forms_user_id_idx" ON "public"."forms" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "update_employee_assignments_updated_at" BEFORE UPDATE ON "public"."employee_assignments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_employees_updated_at" BEFORE UPDATE ON "public"."employees" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."admin_sessions"
    ADD CONSTRAINT "admin_sessions_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_stacks"
    ADD CONSTRAINT "cart_stacks_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "public"."stacks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_stacks"
    ADD CONSTRAINT "cart_stacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "public"."stacks"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sub_stacks"
    ADD CONSTRAINT "sub_stacks_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "public"."stacks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usage_tracking"
    ADD CONSTRAINT "usage_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



CREATE POLICY "Allow select all forms" ON "public"."forms" FOR SELECT USING (true);



CREATE POLICY "admin_sessions: no public access" ON "public"."admin_sessions" USING (false) WITH CHECK (false);



CREATE POLICY "admin_users: no public access" ON "public"."admin_users" USING (false) WITH CHECK (false);



ALTER TABLE "public"."employee_assignments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employee_assignments: admins can CRUD" ON "public"."employee_assignments" USING (true) WITH CHECK (true);



CREATE POLICY "employee_assignments: employees can view own" ON "public"."employee_assignments" FOR SELECT USING (true);



ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employees: admins can CRUD" ON "public"."employees" USING (true) WITH CHECK (true);



ALTER TABLE "public"."forms" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "forms: owner can CRUD" ON "public"."forms" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles: insert own" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "profiles: read own" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "profiles: update own" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "usage: read own" ON "public"."usage_tracking" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "usage: update own" ON "public"."usage_tracking" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "usage: upsert own" ON "public"."usage_tracking" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."usage_tracking" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_users_with_order_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_with_order_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_with_order_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."admin_sessions" TO "anon";
GRANT ALL ON TABLE "public"."admin_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."cart_stacks" TO "anon";
GRANT ALL ON TABLE "public"."cart_stacks" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_stacks" TO "service_role";



GRANT ALL ON TABLE "public"."employee_assignments" TO "anon";
GRANT ALL ON TABLE "public"."employee_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";



GRANT ALL ON TABLE "public"."forms" TO "anon";
GRANT ALL ON TABLE "public"."forms" TO "authenticated";
GRANT ALL ON TABLE "public"."forms" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."stacks" TO "anon";
GRANT ALL ON TABLE "public"."stacks" TO "authenticated";
GRANT ALL ON TABLE "public"."stacks" TO "service_role";



GRANT ALL ON TABLE "public"."sub_stacks" TO "anon";
GRANT ALL ON TABLE "public"."sub_stacks" TO "authenticated";
GRANT ALL ON TABLE "public"."sub_stacks" TO "service_role";



GRANT ALL ON TABLE "public"."usage_tracking" TO "anon";
GRANT ALL ON TABLE "public"."usage_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."usage_tracking" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


