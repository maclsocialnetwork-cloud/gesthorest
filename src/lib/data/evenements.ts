import { createClient } from "@/lib/supabase/server";
import { SEED_EVENEMENTS, type Evenement } from "./evenements-seed";

type EvenementRow = {
  id: string;
  titre: string;
  description: string;
  date_evenement: string;
  lieu: string;
  places: number;
  prix: number | null;
  devise: string | null;
};

function mapRow(row: EvenementRow): Evenement {
  return {
    id: row.id,
    titre: row.titre,
    description: row.description,
    dateEvenement: row.date_evenement,
    lieu: row.lieu,
    places: row.places,
    prix: row.prix,
    devise: row.devise ?? "FCFA",
    passe: new Date(row.date_evenement) < new Date(),
  };
}

export async function getEvenements(): Promise<Evenement[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("evenements")
      .select("*")
      .eq("statut", "publie");

    if (error || !data || data.length === 0) {
      return SEED_EVENEMENTS;
    }

    return (data as EvenementRow[]).map(mapRow);
  } catch {
    return SEED_EVENEMENTS;
  }
}
