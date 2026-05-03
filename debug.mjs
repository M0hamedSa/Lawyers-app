import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data: users, error: uError } = await supabase.from("users").select("*");
  console.log("Users in public.users:", users);
  if (uError) console.error(uError);

  // We can't query pg_policies using anon key without bypassing RLS, but let's try anyway.
  const { data, error } = await supabase.from("pg_policies").select("*");
  console.log("Policies:", data);
  if (error) console.error(error);
}

main();
