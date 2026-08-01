import { createClient } from "@/lib/supabase/server";
import SessionsAdmin from "@/components/admin/SessionsAdmin";

export const metadata = { title: "Sessions — Administration" };

export default async function AdminSessionsPage() {
  const supabase = createClient();

  const [{ data: sessions }, { data: formations }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, date_debut, date_fin, lieu, places_total, places_restantes, statut, formation_id")
      .order("date_debut", { ascending: false }),
    supabase.from("formations").select("id, titre").order("titre"),
  ]);

  return <SessionsAdmin sessions={sessions ?? []} formations={formations ?? []} />;
}
