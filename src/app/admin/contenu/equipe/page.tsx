import { createAdminClient } from "@/lib/supabase/server";
import EquipeEditor from "@/components/admin/contenu/EquipeEditor";

export const metadata = { title: "Éditeur — Équipe" };

export default async function AdminEquipePage() {
  const supabase = createAdminClient();

  const { data: equipe } = await supabase
    .from("equipe")
    .select("id, nom, prenom, titre, bio, photo_url, ordre, actif")
    .order("ordre", { ascending: true });

  return <EquipeEditor equipe={equipe ?? []} />;
}
