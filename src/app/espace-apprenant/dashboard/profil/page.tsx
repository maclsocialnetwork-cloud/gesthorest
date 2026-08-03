import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import ProfilForm from "@/components/espace-apprenant/ProfilForm";

export default async function MonProfilPage() {
  const apprenantId = getApprenantId();
  if (!apprenantId) redirect("/espace-apprenant/connexion");

  const supabase = createAdminClient();
  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("nom, prenom, email, telephone, entreprise, statut")
    .eq("id", apprenantId)
    .single();

  if (!apprenant || apprenant.statut !== "actif") redirect("/espace-apprenant/connexion");

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mon profil
      </h2>
      <ProfilForm
        initialData={{
          nom: apprenant.nom || "",
          prenom: apprenant.prenom || "",
          email: apprenant.email || "",
          telephone: apprenant.telephone || "",
          entreprise: apprenant.entreprise || "",
        }}
      />
    </div>
  );
}
