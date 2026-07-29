"use client";

import { useState } from "react";
import { Save, Settings } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

type SettingKey = { cle: string; label: string };

type Props = {
  defaultKeys: SettingKey[];
  initialValues: Record<string, string>;
};

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none";

export default function ParametresAdmin({ defaultKeys, initialValues }: Props) {
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
      const settings = defaultKeys.map((k) => ({
        cle: k.cle,
        valeur: values[k.cle] || "",
      }));
      const res = await fetch("/api/admin/parametres", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error();
      showToast("Paramètres enregistrés");
      router.refresh();
    } catch {
      showToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Settings size={22} className="text-gesthorest-primary" />
          <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
            Informations du cabinet
          </h3>
        </div>
        <p className="mb-6 text-sm text-gesthorest-text-light">
          Ces informations sont modifiables sans redéploiement du site.
        </p>

        <div className="space-y-4">
          {defaultKeys.map((key) => (
            <div key={key.cle}>
              <label className="mb-1 block text-sm font-medium text-gesthorest-text">
                {key.label}
              </label>
              <input
                className={INPUT}
                value={values[key.cle] || ""}
                onChange={(e) => handleChange(key.cle, e.target.value)}
              />
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
            {loading ? "Enregistrement…" : "Enregistrer les paramètres"}
          </button>
        </div>
      </div>
    </div>
  );
}
