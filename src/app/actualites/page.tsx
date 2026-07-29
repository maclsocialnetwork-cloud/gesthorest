import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ActualitesClient from "@/components/actualites/ActualitesClient";
import { getArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Toute l'actualité de Gesthorest International : tendances RH, témoignages clients, actualités du cabinet et conseils formation.",
};

export default async function ActualitesPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHeader
        title="Actualités"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
      />
      <section className="section-padding container-gesthorest">
        <ActualitesClient articles={articles} />
      </section>
    </>
  );
}
