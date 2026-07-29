import { createClient } from "@/lib/supabase/server";
import InscriptionsAdmin from "@/components/admin/InscriptionsAdmin";

type InscriptionRow = {
  id: string;
  statut: string;
  type_paiement: string;
  montant: number | null;
  devise: string;
  numero_bon: string | null;
  created_at: string;
  confirmed_at: string | null;
  apprenants: { nom: string; prenom: string; email: string };
  sessions: { date_debut: string; formations: { titre: string } };
};

export default async function AdminInscriptionsPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("inscriptions")
    .select(`
      id, statut, type_paiement, montant, devise, numero_bon, created_at, confirmed_at,
      apprenants (nom, prenom, email),
      sessions (date_debut, formations (titre))
    `)
    .order("created_at", { ascending: false });

  const inscriptions = (data ?? []) as unknown as InscriptionRow[];

  return <InscriptionsAdmin inscriptions={inscriptions} />;
}
