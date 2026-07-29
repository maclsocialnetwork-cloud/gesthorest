import type { Metadata } from "next";
import Link from "next/link";
import { Search, ClipboardCheck, Users, ArrowRightLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import RecrutementForm from "@/components/forms/RecrutementForm";

export const metadata: Metadata = {
  title: "Recrutement & RH",
  description:
    "Sourcing, évaluation, conseil RH et outplacement : Gesthorest International vous accompagne pour trouver les talents qui font la différence.",
};

const SERVICES = [
  { icon: Search, titre: "Sourcing & Chasse de têtes", texte: "Identification et approche directe des meilleurs profils du marché." },
  { icon: ClipboardCheck, titre: "Évaluation & Assessment", texte: "Tests et mises en situation pour valider l'adéquation au poste." },
  { icon: Users, titre: "Conseil RH", texte: "Accompagnement stratégique sur vos problématiques RH et organisationnelles." },
  { icon: ArrowRightLeft, titre: "Outplacement", texte: "Accompagnement des collaborateurs dans leur transition professionnelle." },
];

const ETAPES = [
  "Recueil du besoin",
  "Sourcing & sélection",
  "Évaluation des candidats",
  "Présentation des profils",
  "Intégration & suivi",
];

export default function RecrutementPage() {
  return (
    <>
      <PageHeader
        title="Trouvez les talents qui font la différence"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Recrutement" }]}
      />

      <section className="section-padding container-gesthorest">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.titre} className="rounded border-l-4 border-transparent bg-white p-6 shadow-sm transition-all hover:border-gesthorest-accent hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gesthorest-primary/5 text-gesthorest-primary">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-heading font-semibold text-gesthorest-primary">
                  {service.titre}
                </h3>
                <p className="mt-2 text-sm text-gesthorest-text-light">{service.texte}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest">
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary">
            Notre processus de recrutement
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-5">
            {ETAPES.map((etape, i) => (
              <div key={etape} className="relative rounded bg-white p-5 text-center shadow-sm">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gesthorest-accent font-heading font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-3 text-sm font-medium text-gesthorest-primary">{etape}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding container-gesthorest mx-auto max-w-2xl">
        <RecrutementForm />
      </section>

      <section className="bg-gesthorest-primary py-14 text-center">
        <div className="container-gesthorest">
          <h2 className="font-heading text-2xl font-bold text-white">
            Vous êtes candidat ?
          </h2>
          <p className="mt-3 text-white/70">
            Déposez votre CV et rejoignez les meilleures équipes en Afrique et en Europe.
          </p>
          <Link href="/candidats" className="btn-primary mt-6 inline-flex">
            Espace candidats
          </Link>
        </div>
      </section>
    </>
  );
}
