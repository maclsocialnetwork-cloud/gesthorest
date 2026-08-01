import { createClient } from "@/lib/supabase/server";
import EvenementsAdmin from "@/components/admin/contenu/EvenementsAdmin";

export const metadata = { title: "Éditeur — Événements" };

export default async function AdminEvenementsPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("evenements")
    .select("id, titre, description, date_evenement, lieu, places, prix, devise, statut")
    .order("date_evenement", { ascending: false });

  return <EvenementsAdmin evenements={data ?? []} />;
}
