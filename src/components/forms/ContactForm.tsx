"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { contactSchema, OBJETS_CONTACT, type ContactInput } from "@/lib/validation/contact";
import { INPUT_CLASS } from "@/lib/ui-classes";

export default function ContactForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      showToast("Votre message a bien été envoyé. Nous vous répondrons rapidement.");
      reset();
    } catch {
      showToast("Une erreur est survenue. Merci de réessayer.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-6 shadow-lg sm:p-8">
      <FormField label="Objet" required error={errors.objet?.message}>
        <select {...register("objet")} className={INPUT_CLASS} defaultValue="">
          <option value="" disabled>
            Choisissez un objet
          </option>
          {OBJETS_CONTACT.map((objet) => (
            <option key={objet} value={objet}>
              {objet}
            </option>
          ))}
        </select>
      </FormField>

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
        <FormField label="Téléphone" error={errors.telephone?.message}>
          <input {...register("telephone")} className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Entreprise" error={errors.entreprise?.message}>
        <input {...register("entreprise")} className={INPUT_CLASS} />
      </FormField>

      <FormField label="Message" required error={errors.message?.message}>
        <textarea {...register("message")} rows={5} className={INPUT_CLASS} />
      </FormField>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
