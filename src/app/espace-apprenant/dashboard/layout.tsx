import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import DashboardShell from "@/components/espace-apprenant/DashboardShell";

export const metadata = {
  title: "Mon espace apprenant",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apprenantId = getApprenantId();
  if (!apprenantId) redirect("/espace-apprenant/connexion");

  const supabase = createAdminClient();
  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("nom, prenom, statut")
    .eq("id", apprenantId)
    .single();

  if (!apprenant || apprenant.statut !== "actif") {
    redirect("/espace-apprenant/connexion");
  }

  const displayName = `${apprenant.prenom} ${apprenant.nom}`;

  return (
    <DashboardShell displayName={displayName}>
      {children}
    </DashboardShell>
  );
}
