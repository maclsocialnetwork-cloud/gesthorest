import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { getArticleBySlug } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article introuvable" };
  return { title: article.titre, description: article.extrait };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <>
      <PageHeader
        title={article.titre}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Actualités", href: "/actualites" },
          { label: article.titre },
        ]}
      />

      <article className="section-padding container-gesthorest mx-auto max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-gesthorest-text-light">
          <span className="rounded-full bg-gesthorest-light px-3 py-1 font-semibold text-gesthorest-primary">
            {article.categorie}
          </span>
          <span>{formatDate(article.createdAt)}</span>
        </div>

        {article.imageUrl && (
          <div className="relative mt-6 h-72 w-full overflow-hidden rounded sm:h-96">
            <Image
              src={article.imageUrl}
              alt={article.titre}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
            />
          </div>
        )}

        <div className="mt-8 space-y-4">
          {article.contenu.map((paragraphe, i) => (
            <p key={i} className="leading-relaxed text-gesthorest-text">
              {paragraphe}
            </p>
          ))}
        </div>
      </article>
    </>
  );
}
