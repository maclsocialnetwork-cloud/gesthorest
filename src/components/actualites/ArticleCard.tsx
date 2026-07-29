import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/data/articles-seed";
import { formatDate } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full">
        <Image
          src={article.imageUrl}
          alt={article.titre}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-gesthorest-light px-3 py-1 text-xs font-semibold text-gesthorest-primary">
          {article.categorie}
        </span>
        <h3 className="mt-3 font-heading text-lg font-semibold text-gesthorest-primary">
          {article.titre}
        </h3>
        <p className="mt-2 flex-1 text-sm text-gesthorest-text-light">{article.extrait}</p>
        <p className="mt-4 text-xs text-gesthorest-text-light">{formatDate(article.createdAt)}</p>
      </div>
    </Link>
  );
}
