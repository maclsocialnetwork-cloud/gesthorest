import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id, role")
    .eq("user_id", user.id)
    .single();

  if (!apprenant || apprenant.role !== "admin") return null;
  return { userId: user.id, apprenantId: apprenant.id as string };
}
