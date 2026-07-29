"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { inscriptionSchema, type InscriptionInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { INPUT_CLASS } from "@/lib/ui-classes";
import { useToast } from "@/components/ui/ToastProvider";

export default function InscriptionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InscriptionInput>({
    resolver: zodResolver(inscriptionSchema),
  });

  async function onSubmit(data: InscriptionInput) {
    setLoading(true);
    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nom: data.nom,
            prenom: data.prenom,
            telephone: data.telephone,
            entreprise: data.entreprise || "",
          },
        },
      });

      if (authError) {
        showToast(authError.message, "error");
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("apprenants")
          .insert({
            user_id: authData.user.id,
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            telephone: data.telephone,
            entreprise: data.entreprise || null,
            role: "apprenant",
          });

        if (profileError) {
          console.error("Erreur création profil apprenant:", profileError);
        }
      }

      showToast("Compte créé avec succès ! Vérifiez votre email pour confirmer votre inscription.");
      router.push("/espace-apprenant/connexion");
    } catch {
      showToast("Une erreur est survenue", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gesthorest-light px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gesthorest-primary">
              <UserPlus size={26} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gesthorest-primary">
              Créer un compte
            </h1>
            <p className="mt-1 text-sm text-gesthorest-text-light">
              Rejoignez l&apos;espace apprenant Gesthorest
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nom" className="mb-1 block text-sm font-medium text-gesthorest-text">
                  Nom *
                </label>
                <input
                  id="nom"
                  type="text"
                  {...register("nom")}
                  className={INPUT_CLASS}
                  placeholder="Koné"
                />
                {errors.nom && (
                  <p className="mt-1 text-xs text-red-500">{errors.nom.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="prenom" className="mb-1 block text-sm font-medium text-gesthorest-text">
                  Prénom *
                </label>
                <input
                  id="prenom"
                  type="text"
                  {...register("prenom")}
                  className={INPUT_CLASS}
                  placeholder="Aminata"
                />
                {errors.prenom && (
                  <p className="mt-1 text-xs text-red-500">{errors.prenom.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Email *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={INPUT_CLASS}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="telephone" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Téléphone *
              </label>
              <input
                id="telephone"
                type="tel"
                {...register("telephone")}
                className={INPUT_CLASS}
                placeholder="+225 07 00 00 00 00"
              />
              {errors.telephone && (
                <p className="mt-1 text-xs text-red-500">{errors.telephone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="entreprise" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Entreprise
              </label>
              <input
                id="entreprise"
                type="text"
                {...register("entreprise")}
                className={INPUT_CLASS}
                placeholder="Votre entreprise (optionnel)"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={INPUT_CLASS}
                placeholder="Retapez le mot de passe"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gesthorest-text-light">
            Déjà un compte ?{" "}
            <Link
              href="/espace-apprenant/connexion"
              className="font-semibold text-gesthorest-accent hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
