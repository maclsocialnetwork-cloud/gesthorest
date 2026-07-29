import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CandidatureForm from "@/components/forms/CandidatureForm";

export const metadata: Metadata = {
  title: "Espace candidats",
  description:
    "Déposez votre candidature et rejoignez les meilleures équipes en Afrique et en Europe avec Gesthorest International.",
};

export default function CandidatsPage() {
  return (
    <>
      <PageHeader
        title="Rejoignez les meilleures équipes en Afrique et en Europe"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Candidats" }]}
      />

      <section className="section-padding container-gesthorest mx-auto max-w-2xl">
        <CandidatureForm />
      </section>
    </>
  );
}
