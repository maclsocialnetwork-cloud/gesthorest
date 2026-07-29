"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { reservationSchema, type ReservationInput } from "@/lib/validation/reservation";
import { formatDate } from "@/lib/format";
import type { Formation } from "@/lib/data/formations-seed";

export default function ReservationModal({
  isOpen,
  onClose,
  formation,
}: {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation;
}) {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      formationId: formation.id,
      formationTitre: formation.titre,
      montant: formation.prix,
      devise: formation.devise,
      sessionId: formation.sessions[0]?.id ?? "",
      sessionDate: formation.sessions[0]?.dateDebut ?? "",
      sessionLieu: formation.sessions[0]?.lieu ?? "",
    },
  });

  const onSubmit = async (values: ReservationInput) => {
    const session = formation.sessions.find((s) => s.id === values.sessionId);

    try {
      const res = await fetch("/api/reservations/creer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sessionDate: session?.dateDebut ?? values.sessionDate,
          sessionLieu: session?.lieu ?? values.sessionLieu,
        }),
      });

      if (!res.ok) {
        throw new Error("Échec de la réservation");
      }

      showToast(
        "Votre réservation est confirmée ! Vous recevrez votre bon de commande par email.",
        "success"
      );
      reset();
      onClose();
    } catch {
      showToast(
        "Une erreur est survenue lors de votre réservation. Merci de réessayer.",
        "error"
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réserver — Payer au cabinet">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gesthorest-text">
              Nom*
            </label>
            <input
              {...register("nom")}
              className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none"
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-500">{errors.nom.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gesthorest-text">
              Prénom*
            </label>
            <input
              {...register("prenom")}
              className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none"
            />
            {errors.prenom && (
              <p className="mt-1 text-xs text-red-500">{errors.prenom.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gesthorest-text">
            Email*
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gesthorest-text">
            Téléphone*
          </label>
          <input
            {...register("telephone")}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none"
          />
          {errors.telephone && (
            <p className="mt-1 text-xs text-red-500">{errors.telephone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gesthorest-text">
            Entreprise
          </label>
          <input
            {...register("entreprise")}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gesthorest-text">
            Session choisie*
          </label>
          <select
            {...register("sessionId")}
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none"
          >
            {formation.sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {formatDate(session.dateDebut)} — {session.lieu} (
                {session.placesRestantes} places restantes)
              </option>
            ))}
          </select>
          {errors.sessionId && (
            <p className="mt-1 text-xs text-red-500">{errors.sessionId.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Envoi en cours..." : "Confirmer ma réservation"}
        </button>
      </form>
    </Modal>
  );
}
