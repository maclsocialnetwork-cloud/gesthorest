"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { candidatureSchema, type CandidatureInput } from "@/lib/validation/candidature";
import { INPUT_CLASS } from "@/lib/ui-classes";

type FormValues = CandidatureInput & { cv: FileList };

export default function CandidatureForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(candidatureSchema) as never,
  });

  const onSubmit = async (values: FormValues) => {
    const cvFile = values.cv?.[0];
    if (!cvFile) {
      showToast("Merci de joindre votre CV au format PDF.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("nom", values.nom);
    formData.append("prenom", values.prenom);
    formData.append("email", values.email);
    formData.append("telephone", values.telephone);
    formData.append("posteSouhaite", values.posteSouhaite);
    if (values.secteur) formData.append("secteur", values.secteur);
    if (values.message) formData.append("message", values.message);
    formData.append("cv", cvFile);

    try {
      const res = await fetch("/api/candidatures/deposer", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      showToast("Votre candidature a bien été transmise. Merci !");
      reset();
    } catch {
      showToast("Une erreur est survenue lors de l'envoi de votre candidature.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
        Déposer ma candidature
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Nom" required error={errors.nom?.message}>
          <input {...register("nom")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Prénom" required error={errors.prenom?.message}>
          <input {...register("prenom")} className={INPUT_CLASS} />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Poste souhaité" required error={errors.posteSouhaite?.message}>
          <input {...register("posteSouhaite")} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Secteur" error={errors.secteur?.message}>
          <input {...register("secteur")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Message de motivation" error={errors.message?.message}>
        <textarea {...register("message")} rows={4} className={INPUT_CLASS} />
      </FormField>

      <FormField label="CV (PDF)" required>
        <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-gray-300 px-3 py-3 text-sm text-gesthorest-text-light hover:border-gesthorest-accent">
          <Upload size={18} />
          <span>Choisir un fichier PDF</span>
          <input type="file" accept="application/pdf" {...register("cv")} className="hidden" />
        </label>
      </FormField>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
