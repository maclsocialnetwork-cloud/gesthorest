import { createClient } from "@/lib/supabase/server";
import CandidaturesAdmin from "@/components/admin/CandidaturesAdmin";

type CandidatureRow = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste_souhaite: string;
  secteur: string | null;
  cv_url: string | null;
  statut: string;
  created_at: string;
};

export default async function AdminCandidaturesPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("candidatures")
    .select("id, nom, prenom, email, telephone, poste_souhaite, secteur, cv_url, statut, created_at")
    .order("created_at", { ascending: false });

  const candidatures = (data ?? []) as CandidatureRow[];

  return <CandidaturesAdmin candidatures={candidatures} />;
}
