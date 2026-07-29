"use client";

import { useMemo, useState } from "react";
import type { Article, CategorieArticle } from "@/lib/data/articles-seed";
import ArticleCard from "./ArticleCard";

const CATEGORIES: CategorieArticle[] = [
  "Tendances RH",
  "Témoignages",
  "Actualités cabinet",
  "Conseils formation",
];

export default function ActualitesClient({ articles }: { articles: Article[] }) {
  const [categorie, setCategorie] = useState<"Toutes" | CategorieArticle>("Toutes");

  const filtered = useMemo(() => {
    if (categorie === "Toutes") return articles;
    return articles.filter((a) => a.categorie === categorie);
  }, [articles, categorie]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {(["Toutes", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategorie(cat)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              categorie === cat
                ? "border-gesthorest-accent bg-gesthorest-accent text-white"
                : "border-gesthorest-primary/20 text-gesthorest-primary hover:border-gesthorest-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
