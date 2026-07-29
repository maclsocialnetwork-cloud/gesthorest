"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Eye, EyeOff, Lock } from "lucide-react";
import { profilSchema, type ProfilInput, passwordSchema, type PasswordInput } from "@/lib/validation/profil";
import { INPUT_CLASS } from "@/lib/ui-classes";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

type ProfilData = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
};

export default function ProfilForm({ initialData }: { initialData: ProfilData }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerProfil,
    handleSubmit: handleProfil,
    formState: { errors: profilErrors },
  } = useForm<ProfilInput>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      nom: initialData.nom,
      prenom: initialData.prenom,
      telephone: initialData.telephone,
      entreprise: initialData.entreprise,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  async function onProfilSubmit(data: ProfilInput) {
    setLoadingProfil(true);
    try {
      const res = await fetch("/api/espace-apprenant/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      showToast("Profil mis à jour !");
      router.refresh();
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    } finally {
      setLoadingProfil(false);
    }
  }

  async function onPasswordSubmit(data: PasswordInput) {
    setLoadingPassword(true);
    try {
      const res = await fetch("/api/espace-apprenant/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });
      if (!res.ok) throw new Error("Erreur");
      showToast("Mot de passe modifié !");
      resetPassword();
    } catch {
      showToast("Erreur lors de la modification", "error");
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-heading text-lg font-semibold text-gesthorest-primary">
          Informations personnelles
        </h3>
        <form onSubmit={handleProfil(onProfilSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profil-nom" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Nom
              </label>
              <input id="profil-nom" type="text" {...registerProfil("nom")} className={INPUT_CLASS} />
              {profilErrors.nom && <p className="mt-1 text-xs text-red-500">{profilErrors.nom.message}</p>}
            </div>
            <div>
              <label htmlFor="profil-prenom" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Prénom
              </label>
              <input id="profil-prenom" type="text" {...registerProfil("prenom")} className={INPUT_CLASS} />
              {profilErrors.prenom && <p className="mt-1 text-xs text-red-500">{profilErrors.prenom.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gesthorest-text">Email</label>
            <input type="email" value={initialData.email} disabled className={`${INPUT_CLASS} cursor-not-allowed bg-gray-50`} />
            <p className="mt-1 text-xs text-gesthorest-text-light">L&apos;email ne peut pas être modifié.</p>
          </div>

          <div>
            <label htmlFor="profil-telephone" className="mb-1 block text-sm font-medium text-gesthorest-text">
              Téléphone
            </label>
            <input id="profil-telephone" type="tel" {...registerProfil("telephone")} className={INPUT_CLASS} />
            {profilErrors.telephone && <p className="mt-1 text-xs text-red-500">{profilErrors.telephone.message}</p>}
          </div>

          <div>
            <label htmlFor="profil-entreprise" className="mb-1 block text-sm font-medium text-gesthorest-text">
              Entreprise
            </label>
            <input id="profil-entreprise" type="text" {...registerProfil("entreprise")} className={INPUT_CLASS} />
          </div>

          <button
            type="submit"
            disabled={loadingProfil}
            className="btn-primary flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {loadingProfil ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-gesthorest-primary">
          <Lock size={20} />
          Modifier le mot de passe
        </h3>
        <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gesthorest-text">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...registerPassword("password")}
                className={INPUT_CLASS}
                placeholder="Minimum 6 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gesthorest-text-light hover:text-gesthorest-text"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordErrors.password && <p className="mt-1 text-xs text-red-500">{passwordErrors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="mb-1 block text-sm font-medium text-gesthorest-text">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm-new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...registerPassword("confirmPassword")}
              className={INPUT_CLASS}
              placeholder="Retapez le mot de passe"
            />
            {passwordErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loadingPassword}
            className="btn-secondary flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock size={16} />
            {loadingPassword ? "Modification…" : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
