import { createClient } from "@/lib/supabase/server";
import ArticlesAdmin from "@/components/admin/contenu/ArticlesAdmin";

export const metadata = { title: "Éditeur — Actualités" };

export default async function AdminArticlesPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("articles")
    .select("id, titre, slug, contenu, image_url, categorie, statut, created_at")
    .order("created_at", { ascending: false });

  return <ArticlesAdmin articles={data ?? []} />;
}
