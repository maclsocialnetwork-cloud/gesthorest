import { createClient } from "@/lib/supabase/server";
import ContenusAdmin from "@/components/admin/ContenusAdmin";

export default async function AdminContenusPage() {
  const supabase = createClient();

  const [
    { data: articles },
    { data: evenements },
    { data: temoignages },
    { data: equipe },
  ] = await Promise.all([
    supabase.from("articles").select("*").order("created_at", { ascending: false }),
    supabase.from("evenements").select("*").order("date_evenement", { ascending: false }),
    supabase.from("temoignages").select("*").order("created_at", { ascending: false }),
    supabase.from("equipe").select("*").order("ordre", { ascending: true }),
  ]);

  return (
    <ContenusAdmin
      articles={articles ?? []}
      evenements={evenements ?? []}
      temoignages={temoignages ?? []}
      equipe={equipe ?? []}
    />
  );
}
