"use client";

import { useState } from "react";
import { Clock, MapPin, CalendarDays, Users } from "lucide-react";
import type { Formation } from "@/lib/data/formations-seed";
import { formatDate, formatPrix } from "@/lib/format";
import ReservationModal from "./ReservationModal";
import PaymentModal from "./PaymentModal";

export default function FormationSidebar({ formation }: { formation: Formation }) {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const nextSession = [...formation.sessions].sort(
    (a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  )[0];

  return (
    <>
      <div className="rounded bg-white p-6 shadow-lg">
        <p className="font-heading text-3xl font-bold text-gesthorest-accent">
          {formatPrix(formation.prix, formation.devise)}
        </p>

        <div className="mt-4 space-y-2 text-sm text-gesthorest-text">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gesthorest-primary" />
            {formation.dureeLabel}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gesthorest-primary" />
            {formation.format}
            {nextSession ? ` — ${nextSession.lieu}` : ""}
          </div>
          {nextSession && (
            <>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-gesthorest-primary" />
                Prochaine session : {formatDate(nextSession.dateDebut)}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gesthorest-primary" />
                {nextSession.placesRestantes} places restantes sur{" "}
                {nextSession.placesTotal}
              </div>
            </>
          )}
        </div>

        <hr className="my-6 border-gray-100" />

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className="btn-primary w-full"
          >
            S&apos;inscrire &amp; payer en ligne
          </button>
          <button
            type="button"
            onClick={() => setReservationOpen(true)}
            className="btn-secondary w-full"
          >
            Réserver — Payer au cabinet
          </button>
        </div>
      </div>

      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        formation={formation}
      />
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  );
}
