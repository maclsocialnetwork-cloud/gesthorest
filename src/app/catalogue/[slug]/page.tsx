import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronDown } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import FormationSidebar from "@/components/catalogue/FormationSidebar";
import { getFormationBySlug } from "@/lib/data/formations";
import { DOMAIN_LABELS, DOMAIN_BADGE_CLASSES } from "@/lib/data/formations-seed";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const formation = await getFormationBySlug(params.slug);
  if (!formation) return { title: "Formation introuvable" };
  return {
    title: formation.titre,
    description: formation.description.slice(0, 155),
  };
}

export default async function FormationPage({ params }: Props) {
  const formation = await getFormationBySlug(params.slug);
  if (!formation) notFound();

  return (
    <>
      <PageHeader
        title={formation.titre}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/catalogue" },
          { label: formation.titre },
        ]}
      />

      <div className="container-gesthorest section-padding grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${DOMAIN_BADGE_CLASSES[formation.domaine]}`}
            >
              {DOMAIN_LABELS[formation.domaine]}
            </span>
            <span className="inline-flex items-center rounded-full bg-gesthorest-light px-3 py-1 text-xs font-semibold text-gesthorest-primary">
              {formation.format}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-gesthorest-text">
            {formation.description}
          </p>

          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
              Programme
            </h2>
            <div className="mt-4 space-y-3">
              {formation.programme.map((module) => (
                <details
                  key={module.titre}
                  className="group rounded border border-gray-100 bg-gesthorest-light p-4"
                  open
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-heading font-semibold text-gesthorest-primary">
                    {module.titre}
                    <ChevronDown
                      size={18}
                      className="transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <ul className="mt-3 space-y-2 text-sm text-gesthorest-text">
                    {module.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-gesthorest-accent"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
              Objectifs pédagogiques
            </h2>
            <ul className="mt-4 space-y-2">
              {formation.objectifs.map((objectif) => (
                <li key={objectif} className="flex items-start gap-2 text-sm text-gesthorest-text">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                  {objectif}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                Public cible
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                {formation.publicCible}
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                Prérequis
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                {formation.prerequis}
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4 rounded bg-gesthorest-light p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gesthorest-primary font-heading text-lg font-bold text-white">
              {formation.formateur.nom
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-heading font-semibold text-gesthorest-primary">
                {formation.formateur.nom}
              </p>
              <p className="text-sm text-gesthorest-text-light">
                {formation.formateur.titre}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <FormationSidebar formation={formation} />
        </div>
      </div>
    </>
  );
}
