import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Heart, ShieldCheck, Award, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire, la mission et l'équipe de Gesthorest International, cabinet de formation et de recrutement à Abidjan et Paris.",
};

const VALEURS = [
  {
    icon: Target,
    titre: "Mission",
    texte:
      "Accompagner les entreprises, institutions et professionnels vers l'excellence grâce à des solutions sur mesure, pratiques et orientées performance.",
  },
  {
    icon: Eye,
    titre: "Vision",
    texte:
      "Devenir la référence panafricaine de la formation professionnelle et du recrutement, reconnue pour l'impact durable de ses interventions.",
  },
  {
    icon: Heart,
    titre: "Valeurs",
    texte:
      "Exigence, proximité, intégrité et orientation résultats guident chacune de nos interventions auprès de nos clients et partenaires.",
  },
];

const EQUIPE = [
  {
    nom: "Koffi N'Guessan",
    titre: "Directeur Général",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    nom: "Marie-Ange Kouassi",
    titre: "Responsable Formation",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    nom: "Aminata Cissé",
    titre: "Consultante RH",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    nom: "Pierre Dubreuil",
    titre: "Chargé des Relations Internationales",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        title="À propos de Gesthorest International"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
      />

      <section className="section-padding container-gesthorest">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-gesthorest-primary">
            Notre histoire
          </h2>
          <p className="mt-6 leading-relaxed text-gesthorest-text">
            Fondé à Abidjan il y a plus de 12 ans, Gesthorest International est
            né de la volonté d&apos;offrir aux entreprises ivoiriennes des
            solutions de formation à la fois exigeantes et ancrées dans les
            réalités du terrain. Au fil des années, le cabinet a élargi son
            expertise au recrutement et à l&apos;accompagnement RH, avant
            d&apos;ouvrir un bureau à Paris pour accompagner ses clients dans
            leur développement entre l&apos;Afrique de l&apos;Ouest et
            l&apos;Europe. Aujourd&apos;hui, Gesthorest International a formé
            plus de 3 500 professionnels et accompagné des dizaines
            d&apos;entreprises dans leurs projets de recrutement et de
            transformation.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest grid grid-cols-1 gap-8 sm:grid-cols-3">
          {VALEURS.map((valeur) => {
            const Icon = valeur.icon;
            return (
              <div key={valeur.titre} className="rounded bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gesthorest-primary/10 text-gesthorest-primary">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
                  {valeur.titre}
                </h3>
                <p className="mt-2 text-sm text-gesthorest-text-light">{valeur.texte}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-padding container-gesthorest">
        <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary">
          Notre équipe
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPE.map((membre) => (
            <div key={membre.nom} className="text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={membre.photo}
                  alt={membre.nom}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <h3 className="mt-4 font-heading font-semibold text-gesthorest-primary">
                {membre.nom}
              </h3>
              <p className="text-sm text-gesthorest-text-light">{membre.titre}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gesthorest-primary py-14">
        <div className="container-gesthorest text-center">
          <h2 className="font-heading text-2xl font-bold text-white">
            Nos certifications
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 rounded border border-white/15 bg-white/5 px-6 py-4">
              <ShieldCheck size={24} className="text-gesthorest-accent" />
              <span className="text-white">Agréé FDFP</span>
            </div>
            <div className="flex items-center gap-3 rounded border border-white/15 bg-white/5 px-6 py-4">
              <Award size={24} className="text-gesthorest-accent" />
              <span className="text-white">Certifié ISO 9001:2015</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding container-gesthorest">
        <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary">
          Nos implantations
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded bg-gesthorest-light p-6">
            <MapPin size={28} className="mt-1 shrink-0 text-gesthorest-accent" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                Abidjan — Côte d&apos;Ivoire
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                Siège social et centre de formation principal.
              </p>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                contact@gesthorest.com · +225 07 47 12 33 21
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded bg-gesthorest-light p-6">
            <MapPin size={28} className="mt-1 shrink-0 text-gesthorest-accent" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                Paris — France
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                Bureau de représentation Europe.
              </p>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                contact@gesthorest.com · +33 6 71 97 11 59
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
