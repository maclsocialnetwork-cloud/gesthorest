"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { surMesureSchema, type SurMesureInput } from "@/lib/validation/sur-mesure";
import { INPUT_CLASS } from "@/lib/ui-classes";

export default function SurMesureForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SurMesureInput>({ resolver: zodResolver(surMesureSchema) });

  const onSubmit = async (values: SurMesureInput) => {
    try {
      const res = await fetch("/api/sur-mesure/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      showToast("Votre demande a bien été envoyée. Notre équipe vous recontactera rapidement.");
      reset();
    } catch {
      showToast("Une erreur est survenue. Merci de réessayer.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
        Demande de formation intra-entreprise
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Entreprise" required error={errors.entreprise?.message}>
          <input {...register("entreprise")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Secteur d'activité" required error={errors.secteur?.message}>
          <input {...register("secteur")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Effectif à former" required error={errors.effectif?.message}>
          <input {...register("effectif")} className={INPUT_CLASS} placeholder="ex : 15 collaborateurs" />
        </FormField>
        <FormField label="Délai souhaité" error={errors.delai?.message}>
          <input {...register("delai")} className={INPUT_CLASS} placeholder="ex : sous 1 mois" />
        </FormField>
      </div>

      <FormField label="Thématique souhaitée" required error={errors.thematique?.message}>
        <input {...register("thematique")} className={INPUT_CLASS} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" required error={errors.email?.message}>
          <input type="email" {...register("email")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Téléphone" required error={errors.telephone?.message}>
          <input {...register("telephone")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Message" error={errors.message?.message}>
        <textarea {...register("message")} rows={4} className={INPUT_CLASS} />
      </FormField>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
