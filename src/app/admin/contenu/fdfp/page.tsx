import { createClient } from "@/lib/supabase/server";
import FdfpAdmin from "@/components/admin/contenu/FdfpAdmin";

export const metadata = { title: "Éditeur — Demandes FDFP" };

export default async function AdminFdfpPage() {
  const supabase = createClient();

  const { data: demandes } = await supabase
    .from("fdfp_demandes")
    .select("id, nom, entreprise, email, telephone, formation_souhaitee, statut, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return <FdfpAdmin demandes={demandes ?? []} />;
}
