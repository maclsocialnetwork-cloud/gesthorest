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
    // Le middleware gère la redirection vers /admin/login pour toutes les routes protégées.
    // Ici on rend les enfants directement pour éviter une boucle infinie
    // quand le layout enveloppe /admin/login lui-même.
    return <>{children}</>
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
