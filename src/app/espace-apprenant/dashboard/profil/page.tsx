import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfilForm from "@/components/espace-apprenant/ProfilForm";

export default async function MonProfilPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/espace-apprenant/connexion");

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("nom, prenom, email, telephone, entreprise")
    .eq("user_id", user.id)
    .single();

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mon profil
      </h2>
      <ProfilForm
        initialData={{
          nom: apprenant?.nom || "",
          prenom: apprenant?.prenom || "",
          email: apprenant?.email || user.email || "",
          telephone: apprenant?.telephone || "",
          entreprise: apprenant?.entreprise || "",
        }}
      />
    </div>
  );
}
