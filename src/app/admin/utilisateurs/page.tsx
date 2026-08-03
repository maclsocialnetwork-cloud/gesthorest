import { createAdminClient } from "@/lib/supabase/server";
import UtilisateursAdmin from "@/components/admin/UtilisateursAdmin";

export const metadata = { title: "Gestion des apprenants" };

type ApprenantRow = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  role: string;
  statut: string;
  created_at: string;
};

export default async function AdminUtilisateursPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("apprenants")
    .select("id, nom, prenom, email, telephone, entreprise, role, statut, created_at")
    .order("created_at", { ascending: false });

  const utilisateurs = (data ?? []) as ApprenantRow[];

  return <UtilisateursAdmin utilisateurs={utilisateurs} />;
}
