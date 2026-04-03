
  create table "public"."project_messages" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "order_item_id" uuid,
    "sender_id" uuid,
    "sender_role" text,
    "content" text not null,
    "created_at" timestamp with time zone default now()
      );


CREATE UNIQUE INDEX project_messages_pkey ON public.project_messages USING btree (id);

alter table "public"."project_messages" add constraint "project_messages_pkey" PRIMARY KEY using index "project_messages_pkey";

alter table "public"."project_messages" add constraint "project_messages_order_item_id_fkey" FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE not valid;

alter table "public"."project_messages" validate constraint "project_messages_order_item_id_fkey";

alter table "public"."project_messages" add constraint "project_messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) not valid;

alter table "public"."project_messages" validate constraint "project_messages_sender_id_fkey";

grant delete on table "public"."project_messages" to "anon";

grant insert on table "public"."project_messages" to "anon";

grant references on table "public"."project_messages" to "anon";

grant select on table "public"."project_messages" to "anon";

grant trigger on table "public"."project_messages" to "anon";

grant truncate on table "public"."project_messages" to "anon";

grant update on table "public"."project_messages" to "anon";

grant delete on table "public"."project_messages" to "authenticated";

grant insert on table "public"."project_messages" to "authenticated";

grant references on table "public"."project_messages" to "authenticated";

grant select on table "public"."project_messages" to "authenticated";

grant trigger on table "public"."project_messages" to "authenticated";

grant truncate on table "public"."project_messages" to "authenticated";

grant update on table "public"."project_messages" to "authenticated";

grant delete on table "public"."project_messages" to "service_role";

grant insert on table "public"."project_messages" to "service_role";

grant references on table "public"."project_messages" to "service_role";

grant select on table "public"."project_messages" to "service_role";

grant trigger on table "public"."project_messages" to "service_role";

grant truncate on table "public"."project_messages" to "service_role";

grant update on table "public"."project_messages" to "service_role";


