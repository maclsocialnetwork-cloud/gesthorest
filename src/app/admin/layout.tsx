import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Administration",
};

export default async function AdminLayout({
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
    .select("nom, prenom, role")
    .eq("user_id", user.id)
    .single();

  if (!apprenant || apprenant.role !== "admin") {
    redirect("/espace-apprenant/dashboard");
  }

  const displayName = `${apprenant.prenom} ${apprenant.nom}`;

  return (
    <AdminShell displayName={displayName}>
      {children}
    </AdminShell>
  );
}
