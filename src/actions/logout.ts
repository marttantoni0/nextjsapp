import { createClient } from "@/utils/supabase/server";

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut()
  }