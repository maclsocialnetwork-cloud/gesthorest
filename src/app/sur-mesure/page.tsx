import type { Metadata } from "next";
import { Search, PenTool, Rocket, BarChart3, Users2, Clock, Award } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SurMesureForm from "@/components/forms/SurMesureForm";

export const metadata: Metadata = {
  title: "Formations sur mesure",
  description:
    "Des formations intra-entreprise conçues sur mesure selon vos besoins et objectifs spécifiques par Gesthorest International.",
};

const ETAPES = [
  { icon: Search, titre: "Diagnostic", texte: "Analyse de vos besoins et de vos enjeux spécifiques." },
  { icon: PenTool, titre: "Conception", texte: "Élaboration d'un programme pédagogique sur mesure." },
  { icon: Rocket, titre: "Déploiement", texte: "Animation de la formation par nos experts terrain." },
  { icon: BarChart3, titre: "Évaluation", texte: "Mesure des acquis et de l'impact sur la performance." },
];

const AVANTAGES = [
  { icon: Users2, titre: "Contenus adaptés", texte: "Des programmes construits autour de vos réalités métier." },
  { icon: Clock, titre: "Flexibilité", texte: "Des formats et calendriers adaptés aux contraintes de votre entreprise." },
  { icon: Award, titre: "Expertise reconnue", texte: "Des formateurs seniors certifiés et expérimentés." },
];

export default function SurMesurePage() {
  return (
    <>
      <PageHeader
        title="Formations sur mesure pour vos équipes"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Sur mesure" }]}
      />

      <section className="section-padding container-gesthorest">
        <p className="mx-auto max-w-3xl text-center leading-relaxed text-gesthorest-text">
          Chaque entreprise a ses propres enjeux. C&apos;est pourquoi Gesthorest
          International conçoit des programmes de formation intra-entreprise
          entièrement adaptés à votre secteur, vos équipes et vos objectifs de
          performance.
        </p>
      </section>

      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest">
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary">
            Notre processus en 4 étapes
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((etape, i) => {
              const Icon = etape.icon;
              return (
                <div key={etape.titre} className="rounded bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gesthorest-accent/10 text-gesthorest-accent">
                    <Icon size={24} />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-gesthorest-text-light">
                    Étape {i + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-gesthorest-primary">
                    {etape.titre}
                  </h3>
                  <p className="mt-2 text-sm text-gesthorest-text-light">{etape.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding container-gesthorest">
        <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary">
          Pourquoi choisir le sur mesure ?
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {AVANTAGES.map((avantage) => {
            const Icon = avantage.icon;
            return (
              <div key={avantage.titre} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gesthorest-primary/10 text-gesthorest-primary">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
                  {avantage.titre}
                </h3>
                <p className="mt-2 text-sm text-gesthorest-text-light">{avantage.texte}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest mx-auto max-w-2xl">
          <SurMesureForm />
        </div>
      </section>
    </>
  );
}
