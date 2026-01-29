-- Revert handle_new_user function back to original (only create profile, not organization)
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

