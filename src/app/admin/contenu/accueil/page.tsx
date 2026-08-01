import { createClient } from "@/lib/supabase/server";
import AccueilEditor from "@/components/admin/contenu/AccueilEditor";

export const metadata = { title: "Éditeur — Accueil" };

export default async function AdminAccueilPage() {
  const supabase = createClient();

  const [{ data: temoignages }, { data: articles }] = await Promise.all([
    supabase
      .from("temoignages")
      .select("id, nom, entreprise, texte, note, photo_url, actif")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("articles")
      .select("id, titre, categorie, statut, image_url, contenu")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <AccueilEditor
      temoignages={temoignages ?? []}
      articles={articles ?? []}
    />
  );
}
