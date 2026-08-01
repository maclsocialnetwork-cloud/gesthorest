import { createClient } from "@/lib/supabase/server";
import TelechargementsCMS from "@/components/admin/contenu/TelechargementsCMS";

export const metadata = { title: "Éditeur — Téléchargements" };

export default async function AdminTelechargePage() {
  const supabase = createClient();

  const { data: documents } = await supabase
    .from("telechargements")
    .select("id, titre, description, type_document, url_fichier, actif, nb_telechargements, created_at")
    .order("created_at", { ascending: false });

  return <TelechargementsCMS documents={documents ?? []} />;
}
