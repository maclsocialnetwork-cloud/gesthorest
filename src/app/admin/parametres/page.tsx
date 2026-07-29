import { createClient } from "@/lib/supabase/server";
import ParametresAdmin from "@/components/admin/ParametresAdmin";

type SettingRow = {
  id: string;
  cle: string;
  valeur: string;
  updated_at: string;
};

const DEFAULT_KEYS = [
  { cle: "nom_cabinet", label: "Nom du cabinet" },
  { cle: "slogan", label: "Slogan" },
  { cle: "email_contact", label: "Email de contact" },
  { cle: "tel_1", label: "Téléphone 1" },
  { cle: "tel_2", label: "Téléphone 2" },
  { cle: "adresse_1", label: "Adresse 1 (Abidjan)" },
  { cle: "adresse_2", label: "Adresse 2 (Paris)" },
];

export default async function AdminParametresPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("settings")
    .select("id, cle, valeur, updated_at")
    .order("cle");

  const settings = (data ?? []) as SettingRow[];

  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.cle] = s.valeur;
  }

  return (
    <ParametresAdmin
      defaultKeys={DEFAULT_KEYS}
      initialValues={settingsMap}
    />
  );
}
