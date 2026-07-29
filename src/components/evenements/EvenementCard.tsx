"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, MapPin, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { INPUT_CLASS } from "@/lib/ui-classes";
import { formatDate, formatPrix } from "@/lib/format";
import type { Evenement } from "@/lib/data/evenements-seed";

type InscriptionValues = { nom: string; email: string; telephone: string };

export default function EvenementCard({ evenement }: { evenement: Evenement }) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InscriptionValues>();

  const onSubmit = async (values: InscriptionValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objet: "Autre",
          nom: values.nom,
          prenom: "—",
          email: values.email,
          telephone: values.telephone,
          message: `Inscription à l'événement : ${evenement.titre} (${formatDate(evenement.dateEvenement)})`,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Votre inscription est enregistrée. À très bientôt !");
      reset();
      setOpen(false);
    } catch {
      showToast("Une erreur est survenue. Merci de réessayer.", "error");
    }
  };

  return (
    <>
      <div className="rounded bg-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
          {evenement.titre}
        </h3>
        <p className="mt-2 text-sm text-gesthorest-text-light">{evenement.description}</p>
        <div className="mt-4 space-y-2 text-sm text-gesthorest-text-light">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gesthorest-accent" />
            {formatDate(evenement.dateEvenement)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gesthorest-accent" />
            {evenement.lieu}
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gesthorest-accent" />
            {evenement.places} places
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-heading text-lg font-bold text-gesthorest-accent">
            {formatPrix(evenement.prix, evenement.devise)}
          </span>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary">
            S&apos;inscrire
          </button>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Inscription — ${evenement.titre}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nom complet" required error={errors.nom?.message}>
            <input {...register("nom", { required: true })} className={INPUT_CLASS} />
          </FormField>
          <FormField label="Email" required error={errors.email?.message}>
            <input type="email" {...register("email", { required: true })} className={INPUT_CLASS} />
          </FormField>
          <FormField label="Téléphone" required error={errors.telephone?.message}>
            <input {...register("telephone", { required: true })} className={INPUT_CLASS} />
          </FormField>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Envoi en cours..." : "Confirmer mon inscription"}
          </button>
        </form>
      </Modal>
    </>
  );
}
