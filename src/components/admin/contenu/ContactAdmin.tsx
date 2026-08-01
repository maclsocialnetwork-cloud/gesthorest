"use client";

import { useState } from "react";
import { Save, Phone } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

type Props = { initialValues: Record<string, string> };

const CONTACT_KEYS = [
  { cle: "nom_cabinet", label: "Nom du cabinet" },
  { cle: "email_contact", label: "Email de contact" },
  { cle: "tel_1", label: "Téléphone 1 (Abidjan)" },
  { cle: "tel_2", label: "Téléphone 2 (Paris)" },
  { cle: "whatsapp_number", label: "Numéro WhatsApp" },
  { cle: "adresse_1", label: "Adresse Abidjan" },
  { cle: "adresse_2", label: "Adresse Paris" },
  { cle: "horaires", label: "Horaires d'ouverture" },
];

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none";

export default function ContactAdmin({ initialValues }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [loading, setLoading] = useState(false);

  function handleChange(cle: string, valeur: string) {
    setValues((prev) => ({ ...prev, [cle]: valeur }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const settings = CONTACT_KEYS.map((k) => ({ cle: k.cle, valeur: values[k.cle] || "" }));
      const res = await fetch("/api/admin/parametres", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error();
      showToast("Coordonnées enregistrées");
      router.refresh();
    } catch {
      showToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Phone size={22} className="text-gesthorest-primary" />
        <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
          Coordonnées & Contact
        </h3>
      </div>
      <p className="mb-6 text-sm text-gesthorest-text-light">
        Ces informations apparaissent dans le footer, la page contact et les emails automatiques.
      </p>

      <div className="space-y-4">
        {CONTACT_KEYS.map((key) => (
          <div key={key.cle}>
            <label className="mb-1 block text-sm font-medium text-gesthorest-text">{key.label}</label>
            {key.cle === "horaires" ? (
              <textarea
                rows={3}
                className={INPUT}
                value={values[key.cle] || ""}
                onChange={(e) => handleChange(key.cle, e.target.value)}
                placeholder="Lun–Ven : 8h–18h"
              />
            ) : (
              <input
                type="text"
                className={INPUT}
                value={values[key.cle] || ""}
                onChange={(e) => handleChange(key.cle, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60"
        >
          <Save size={16} />
          {loading ? "Enregistrement…" : "Enregistrer les coordonnées"}
        </button>
      </div>
    </div>
  );
}
