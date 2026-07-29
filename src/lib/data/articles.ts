import { createClient } from "@/lib/supabase/server";
import {
  SEED_ARTICLES,
  getArticleBySlug as getSeedArticleBySlug,
  type Article,
  type CategorieArticle,
} from "./articles-seed";

type ArticleRow = {
  id: string;
  slug: string;
  titre: string;
  contenu: string;
  image_url: string | null;
  categorie: string;
  created_at: string;
};

function mapRow(row: ArticleRow): Article {
  const paragraphs = row.contenu.split("\n").filter(Boolean);
  return {
    id: row.id,
    slug: row.slug,
    titre: row.titre,
    extrait: paragraphs[0]?.slice(0, 160) ?? "",
    contenu: paragraphs,
    imageUrl: row.image_url ?? "",
    categorie: row.categorie as CategorieArticle,
    createdAt: row.created_at,
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("statut", "publie")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return SEED_ARTICLES;
    }

    return (data as ArticleRow[]).map(mapRow);
  } catch {
    return SEED_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return getSeedArticleBySlug(slug);
    }

    return mapRow(data as ArticleRow);
  } catch {
    return getSeedArticleBySlug(slug);
  }
}
