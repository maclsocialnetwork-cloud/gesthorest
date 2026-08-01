import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function requireAdmin() {
  // Cookie-based admin session (admin@gesthorest.com via /api/admin/auth/login)
  try {
    const cookieStore = cookies();
    if (cookieStore.get("gesthorest_admin_session")?.value === "1") {
      return { userId: "cookie-admin", apprenantId: "cookie-admin" };
    }
  } catch { /* cookies() unavailable outside request context */ }

  // Supabase auth fallback
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
