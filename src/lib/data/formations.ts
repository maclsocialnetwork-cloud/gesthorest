import { createClient } from "@/lib/supabase/server";
import {
  SEED_FORMATIONS,
  getFormationBySlug as getSeedFormationBySlug,
  type Formation,
  type Domaine,
  type FormatFormation,
} from "./formations-seed";

function parseDureeJours(duree: string): number {
  if (/semaine/i.test(duree)) {
    const match = duree.match(/(\d+)/);
    return match ? Number(match[1]) * 5 : 5;
  }
  const match = duree.match(/(\d+)/);
  return match ? Number(match[1]) : 1;
}

type FormationRow = {
  id: string;
  slug: string;
  titre: string;
  domaine: string;
  format: string;
  duree: string;
  description: string | null;
  programme: { titre: string; points: string[] }[] | null;
  objectifs: string[] | null;
  competences_acquises: string[] | null;
  public_cible: string | null;
  prerequis: string | null;
  prix: number | null;
  devise: string | null;
  financement_fdfp: boolean | null;
  gesthorest_sessions?: {
    id: string;
    date_debut: string;
    date_fin: string;
    lieu: string;
    places_total: number;
    places_restantes: number;
  }[];
  gesthorest_formateur?: { nom: string; titre: string } | null;
};

function mapRow(row: FormationRow): Formation {
  return {
    id: row.id,
    slug: row.slug,
    titre: row.titre,
    domaine: row.domaine as Domaine,
    format: row.format as FormatFormation,
    dureeJours: parseDureeJours(row.duree),
    dureeLabel: row.duree,
    description: row.description ?? "",
    programme: row.programme ?? [],
    objectifs: row.objectifs ?? [],
    competencesAcquises: row.competences_acquises ?? [],
    publicCible: row.public_cible ?? "",
    prerequis: row.prerequis ?? "",
    financementFdfp: row.financement_fdfp ?? false,
    prix: row.prix,
    devise: row.devise ?? "FCFA",
    formateur: row.gesthorest_formateur ?? { nom: "Formateur Gesthorest", titre: "Consultant" },
    sessions: (row.gesthorest_sessions ?? []).map((s) => ({
      id: s.id,
      dateDebut: s.date_debut,
      dateFin: s.date_fin,
      lieu: s.lieu,
      placesTotal: s.places_total,
      placesRestantes: s.places_restantes,
    })),
  };
}

export async function getFormations(): Promise<Formation[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("formations")
      .select(
        "*, gesthorest_sessions:sessions(id, date_debut, date_fin, lieu, places_total, places_restantes)"
      )
      .eq("statut", "publiee");

    if (error || !data || data.length === 0) {
      return SEED_FORMATIONS;
    }

    return (data as FormationRow[]).map(mapRow);
  } catch {
    return SEED_FORMATIONS;
  }
}

export async function getFormationBySlug(slug: string): Promise<Formation | undefined> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("formations")
      .select(
        "*, gesthorest_sessions:sessions(id, date_debut, date_fin, lieu, places_total, places_restantes)"
      )
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return getSeedFormationBySlug(slug);
    }

    return mapRow(data as FormationRow);
  } catch {
    return getSeedFormationBySlug(slug);
  }
}
