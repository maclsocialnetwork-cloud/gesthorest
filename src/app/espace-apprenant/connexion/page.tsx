"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { INPUT_CLASS } from "@/lib/ui-classes";
import { useToast } from "@/components/ui/ToastProvider";

export default function ConnexionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/espace-apprenant/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        showToast(json.error || "Une erreur est survenue", "error");
        return;
      }

      showToast("Connexion réussie !");
      router.push("/espace-apprenant/dashboard");
      router.refresh();
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
              <LogIn size={26} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gesthorest-primary">
              Espace Apprenant
            </h1>
            <p className="mt-1 text-sm text-gesthorest-text-light">
              Connectez-vous pour accéder à vos formations
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Email
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
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gesthorest-text">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={INPUT_CLASS}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gesthorest-text-light hover:text-gesthorest-text"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gesthorest-text-light">
            Pas encore de compte ?{" "}
            <Link
              href="/espace-apprenant/inscription"
              className="font-semibold text-gesthorest-accent hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
