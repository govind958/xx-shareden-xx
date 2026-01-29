alter table "public"."organizations" add column "user_id" uuid;

alter table "public"."organizations" add constraint "organizations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."organizations" validate constraint "organizations_user_id_fkey";


