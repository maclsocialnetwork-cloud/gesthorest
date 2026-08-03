import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Heart, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { createAdminClient } from "@/lib/supabase/server";
import { ICON_MAP } from "@/lib/icon-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire, la mission et l'équipe de Gesthorest International, cabinet de formation et de recrutement à Abidjan et Paris.",
};

type MembreDB = {
  id: string;
  prenom: string;
  nom: string;
  titre: string | null;
  photo_url: string | null;
};

type CertificationDB = {
  id: string;
  nom: string;
  icone: string | null;
};

const FALLBACK_EQUIPE: MembreDB[] = [
  { id: "1", prenom: "Koffi", nom: "N'Guessan", titre: "Directeur Général", photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80" },
  { id: "2", prenom: "Marie-Ange", nom: "Kouassi", titre: "Responsable Formation", photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80" },
  { id: "3", prenom: "Aminata", nom: "Cissé", titre: "Consultante RH", photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80" },
  { id: "4", prenom: "Pierre", nom: "Dubreuil", titre: "Chargé des Relations Internationales", photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80" },
];

const FALLBACK_CERTIFICATIONS: CertificationDB[] = [
  { id: "1", nom: "Agréé FDFP", icone: "ShieldCheck" },
  { id: "2", nom: "Certifié ISO 9001:2015", icone: "Award" },
];

export default async function AProposPage() {
  let equipe: MembreDB[] = FALLBACK_EQUIPE;
  let mission =
    "Accompagner les entreprises, institutions et professionnels vers l'excellence grâce à des solutions sur mesure, pratiques et orientées performance.";
  let vision =
    "Devenir la référence panafricaine de la formation professionnelle et du recrutement, reconnue pour l'impact durable de ses interventions.";
  let valeursTexte =
    "Exigence, proximité, intégrité et orientation résultats guident chacune de nos interventions auprès de nos clients et partenaires.";
  let certifications: CertificationDB[] = FALLBACK_CERTIFICATIONS;
  let emailContact = "contact@gesthorest.com";
  let telCi = "+225 07 47 12 33 21";
  let telFr = "+33 6 71 97 11 59";
  let adresseCi = "Abidjan — Côte d'Ivoire";
  let adresseFr = "Paris — France";

  try {
    const supabase = createAdminClient();

    const [equipeRes, settingsRes, certRes, paramsRes] = await Promise.all([
      supabase
        .from("equipe")
        .select("id, prenom, nom, titre, photo_url")
        .eq("actif", true)
        .order("ordre"),
      supabase
        .from("settings")
        .select("cle, valeur")
        .in("cle", ["mission", "vision", "valeurs"]),
      supabase
        .from("certifications")
        .select("id, nom, icone")
        .eq("visible", true)
        .order("ordre"),
      supabase
        .from("parametres_site")
        .select("cle, valeur")
        .in("cle", ["email_contact", "telephone_ci", "telephone_fr", "adresse_ci", "adresse_fr"]),
    ]);

    if (equipeRes.data && equipeRes.data.length > 0) equipe = equipeRes.data;

    const settingsMap: Record<string, string> = {};
    for (const s of settingsRes.data ?? []) settingsMap[s.cle] = s.valeur;
    if (settingsMap.mission) mission = settingsMap.mission;
    if (settingsMap.vision) vision = settingsMap.vision;
    if (settingsMap.valeurs) valeursTexte = settingsMap.valeurs;

    if (certRes.data && certRes.data.length > 0) certifications = certRes.data;

    const paramsMap: Record<string, string> = {};
    for (const p of paramsRes.data ?? []) paramsMap[p.cle] = p.valeur;
    if (paramsMap.email_contact) emailContact = paramsMap.email_contact;
    if (paramsMap.telephone_ci) telCi = paramsMap.telephone_ci;
    if (paramsMap.telephone_fr) telFr = paramsMap.telephone_fr;
    if (paramsMap.adresse_ci) adresseCi = paramsMap.adresse_ci;
    if (paramsMap.adresse_fr) adresseFr = paramsMap.adresse_fr;
  } catch {
    // Supabase indisponible — fallbacks déjà définis
  }

  const valeurs = [
    { icon: Target, titre: "Mission", texte: mission },
    { icon: Eye, titre: "Vision", texte: vision },
    { icon: Heart, titre: "Valeurs", texte: valeursTexte },
  ];

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
          {valeurs.map((valeur) => {
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
          {equipe.map((membre) => (
            <div key={membre.id} className="text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full">
                {membre.photo_url ? (
                  <Image
                    src={membre.photo_url}
                    alt={`${membre.prenom} ${membre.nom}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gesthorest-light text-2xl font-bold text-gesthorest-primary">
                    {membre.prenom[0]}{membre.nom[0]}
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-heading font-semibold text-gesthorest-primary">
                {membre.prenom} {membre.nom}
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
            {certifications.map((cert) => {
              const Icon = ICON_MAP[cert.icone ?? ""] ?? ICON_MAP.ShieldCheck;
              return (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 rounded border border-white/15 bg-white/5 px-6 py-4"
                >
                  <Icon size={24} className="text-gesthorest-accent" />
                  <span className="text-white">{cert.nom}</span>
                </div>
              );
            })}
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
                {adresseCi}
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                Siège social et centre de formation principal.
              </p>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                {emailContact} · {telCi}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded bg-gesthorest-light p-6">
            <MapPin size={28} className="mt-1 shrink-0 text-gesthorest-accent" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                {adresseFr}
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                Bureau de représentation Europe.
              </p>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                {emailContact} · {telFr}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
