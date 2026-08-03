import { createAdminClient } from "@/lib/supabase/server";
import AProposAdmin from "@/components/admin/contenu/AProposAdmin";

export const metadata = { title: "Éditeur — À propos" };

const TEXTE_KEYS = ["mission", "vision", "valeurs", "certifications_texte"];

export default async function AdminAProposPage() {
  const supabase = createAdminClient();

  const equipeResult = await supabase
    .from("equipe")
    .select("id, nom, prenom, titre, bio, photo_url, ordre, actif")
    .order("ordre", { ascending: true });

  const settingsResult = await supabase
    .from("settings")
    .select("cle, valeur")
    .in("cle", TEXTE_KEYS);

  const settingsMap: Record<string, string> = {};
  for (const s of settingsResult.data ?? []) settingsMap[s.cle] = s.valeur;

  return <AProposAdmin equipe={equipeResult.data ?? []} settings={settingsMap} />;
}
