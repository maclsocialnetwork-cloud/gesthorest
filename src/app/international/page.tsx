import type { Metadata } from "next";
import { GraduationCap, Users, Landmark, Handshake, Globe2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import InternationalForm from "@/components/forms/InternationalForm";

export const metadata: Metadata = {
  title: "Offres internationales",
  description:
    "Gesthorest International déploie des formations et missions entre l'Afrique de l'Ouest et l'Europe : formations inter-pays, programmes diaspora, missions bailleurs de fonds.",
};

const MISSIONS = [
  { icon: GraduationCap, titre: "Formations inter-pays", texte: "Programmes déployés simultanément dans plusieurs pays d'Afrique de l'Ouest." },
  { icon: Users, titre: "Programmes diaspora", texte: "Accompagnement de la diaspora dans ses projets professionnels en Afrique." },
  { icon: Landmark, titre: "Missions bailleurs de fonds", texte: "Interventions pour le compte d'organisations internationales et bailleurs." },
  { icon: Handshake, titre: "Partenariats institutionnels", texte: "Collaborations avec institutions publiques et privées à l'échelle régionale." },
];

const ZONES = ["Afrique de l'Ouest", "Afrique Centrale", "Europe (France)"];

export default function InternationalPage() {
  return (
    <>
      <PageHeader
        title="Une expertise qui traverse les frontières"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "International" }]}
      />

      <section className="section-padding container-gesthorest">
        <div className="mx-auto max-w-3xl text-center">
          <Globe2 size={40} className="mx-auto text-gesthorest-accent" />
          <p className="mt-6 leading-relaxed text-gesthorest-text">
            Avec des bureaux à Abidjan et à Paris, Gesthorest International
            déploie son expertise en formation et en recrutement entre
            l&apos;Afrique de l&apos;Ouest et l&apos;Europe, au service des
            entreprises, institutions et organisations internationales.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest">
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary">
            Types de missions
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MISSIONS.map((mission) => {
              const Icon = mission.icon;
              return (
                <div key={mission.titre} className="rounded bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-gesthorest-primary/5 text-gesthorest-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-heading font-semibold text-gesthorest-primary">
                    {mission.titre}
                  </h3>
                  <p className="mt-2 text-sm text-gesthorest-text-light">{mission.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding container-gesthorest text-center">
        <h2 className="font-heading text-3xl font-bold text-gesthorest-primary">
          Zones géographiques
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {ZONES.map((zone) => (
            <span
              key={zone}
              className="rounded-full border border-gesthorest-primary/20 px-6 py-3 font-medium text-gesthorest-primary"
            >
              {zone}
            </span>
          ))}
        </div>
      </section>

      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest mx-auto max-w-2xl">
          <InternationalForm />
        </div>
      </section>
    </>
  );
}
