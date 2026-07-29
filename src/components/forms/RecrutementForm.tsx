"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { recrutementBesoinSchema, type RecrutementBesoinInput } from "@/lib/validation/recrutement";
import { INPUT_CLASS } from "@/lib/ui-classes";

export default function RecrutementForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecrutementBesoinInput>({ resolver: zodResolver(recrutementBesoinSchema) });

  const onSubmit = async (values: RecrutementBesoinInput) => {
    try {
      const res = await fetch("/api/recrutement/besoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      showToast("Votre besoin a bien été transmis à notre équipe recrutement.");
      reset();
    } catch {
      showToast("Une erreur est survenue. Merci de réessayer.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
        Déposer un besoin de recrutement
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Entreprise" required error={errors.entreprise?.message}>
          <input {...register("entreprise")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Poste" required error={errors.poste?.message}>
          <input {...register("poste")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Profil recherché" required error={errors.profil?.message}>
        <textarea {...register("profil")} rows={3} className={INPUT_CLASS} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Délai" error={errors.delai?.message}>
          <input {...register("delai")} className={INPUT_CLASS} placeholder="ex : sous 1 mois" />
        </FormField>
        <FormField label="Budget (optionnel)" error={errors.budget?.message}>
          <input {...register("budget")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" required error={errors.email?.message}>
          <input type="email" {...register("email")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Téléphone" required error={errors.telephone?.message}>
          <input {...register("telephone")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Message" error={errors.message?.message}>
        <textarea {...register("message")} rows={3} className={INPUT_CLASS} />
      </FormField>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
