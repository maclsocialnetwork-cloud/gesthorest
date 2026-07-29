import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/espace-apprenant/DashboardShell";

export const metadata = {
  title: "Mon espace apprenant",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/espace-apprenant/connexion");
  }

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("nom, prenom, email")
    .eq("user_id", user.id)
    .single();

  const displayName = apprenant
    ? `${apprenant.prenom} ${apprenant.nom}`
    : user.email ?? "Apprenant";

  return (
    <DashboardShell displayName={displayName}>
      {children}
    </DashboardShell>
  );
}
