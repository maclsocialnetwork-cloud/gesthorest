"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { internationalDemandeSchema, type InternationalDemandeInput } from "@/lib/validation/international";
import { INPUT_CLASS } from "@/lib/ui-classes";

export default function InternationalForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InternationalDemandeInput>({ resolver: zodResolver(internationalDemandeSchema) });

  const onSubmit = async (values: InternationalDemandeInput) => {
    try {
      const res = await fetch("/api/international/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      showToast("Votre demande a bien été transmise à notre équipe internationale.");
      reset();
    } catch {
      showToast("Une erreur est survenue. Merci de réessayer.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
        Contact — Offres internationales
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Pays" required error={errors.pays?.message}>
          <input {...register("pays")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Organisation" required error={errors.organisation?.message}>
          <input {...register("organisation")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Type de mission" required error={errors.typeMission?.message}>
        <input {...register("typeMission")} className={INPUT_CLASS} placeholder="ex : formation inter-pays, programme diaspora..." />
      </FormField>

      <FormField label="Description du besoin" required error={errors.description?.message}>
        <textarea {...register("description")} rows={4} className={INPUT_CLASS} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" required error={errors.email?.message}>
          <input type="email" {...register("email")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Téléphone" required error={errors.telephone?.message}>
          <input {...register("telephone")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
