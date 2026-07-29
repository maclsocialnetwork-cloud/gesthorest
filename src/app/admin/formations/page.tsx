import { createClient } from "@/lib/supabase/server";
import { DOMAIN_LABELS } from "@/lib/data/formations-seed";
import FormationsAdmin from "@/components/admin/FormationsAdmin";

type FormationRow = {
  id: string;
  titre: string;
  domaine: string;
  format: string;
  duree: string;
  prix: number | null;
  devise: string;
  statut: string;
  description: string | null;
  programme: { titre: string; points: string[] }[] | null;
  objectifs: string[] | null;
  public_cible: string | null;
  prerequis: string | null;
};

export default async function AdminFormationsPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("formations")
    .select("id, titre, domaine, format, duree, prix, devise, statut, description, programme, objectifs, public_cible, prerequis")
    .order("created_at", { ascending: false });

  const formations = (data ?? []) as FormationRow[];

  return (
    <FormationsAdmin
      formations={formations}
      domainLabels={DOMAIN_LABELS}
    />
  );
}
