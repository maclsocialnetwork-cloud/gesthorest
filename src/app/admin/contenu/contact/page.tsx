import { createClient } from "@/lib/supabase/server";
import ContactAdmin from "@/components/admin/contenu/ContactAdmin";

export const metadata = { title: "Éditeur — Contact" };

const CONTACT_KEYS = ["nom_cabinet", "email_contact", "tel_1", "tel_2", "adresse_1", "adresse_2", "whatsapp_number", "horaires"];

export default async function AdminContactPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("settings")
    .select("cle, valeur")
    .in("cle", CONTACT_KEYS);

  const initialValues: Record<string, string> = {};
  for (const s of data ?? []) initialValues[s.cle] = s.valeur;

  return <ContactAdmin initialValues={initialValues} />;
}
