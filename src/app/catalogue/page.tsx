import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CatalogueClient from "@/components/catalogue/CatalogueClient";
import { getFormations } from "@/lib/data/formations";

export const metadata: Metadata = {
  title: "Catalogue des formations",
  description:
    "Découvrez le catalogue complet des formations professionnelles Gesthorest International : management, RH, finance, digital et plus encore.",
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: { domaine?: string };
}) {
  const formations = await getFormations();

  return (
    <>
      <PageHeader
        title="Catalogue des formations"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Catalogue" }]}
      />
      <CatalogueClient formations={formations} initialDomaine={searchParams.domaine} />
    </>
  );
}
