'use client'

import { useState } from 'react'
import { Clock, MapPin, CalendarDays, Users, Phone, MessageCircle, CreditCard } from 'lucide-react'
import type { Formation } from '@/lib/data/formations-seed'
import { formatDate, formatPrix } from '@/lib/format'
import ReservationModal from './ReservationModal'
import PaymentModal from './PaymentModal'

export default function FormationSidebar({ formation }: { formation: Formation }) {
  const [reservationOpen, setReservationOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  const nextSession = [...formation.sessions].sort(
    (a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  )[0]

  const whatsappText = encodeURIComponent(
    `Bonjour Gesthorest, je suis intéressé(e) par la formation "${formation.titre}". Pouvez-vous me donner plus d'informations ?`
  )

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
        {/* Prix */}
        <div className="bg-gesthorest-primary px-6 py-5">
          <p className="font-heading text-3xl font-bold text-gesthorest-accent">
            {formatPrix(formation.prix, formation.devise)}
          </p>
          {formation.financementFdfp && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
              ✓ Financement FDFP possible
            </span>
          )}
        </div>

        {/* Infos session */}
        <div className="px-6 py-5 space-y-3 text-sm text-gesthorest-text border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock size={15} className="shrink-0 text-gesthorest-accent" />
            <span>Durée : <strong>{formation.dureeLabel}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-gesthorest-accent" />
            <span>Format : <strong>{formation.format}</strong></span>
          </div>
          {nextSession && (
            <>
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="shrink-0 text-gesthorest-accent" />
                <span>Prochaine session : <strong>{formatDate(nextSession.dateDebut)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={15} className="shrink-0 text-gesthorest-accent" />
                <span>
                  Places restantes :{' '}
                  <strong className={nextSession.placesRestantes <= 5 ? 'text-red-500' : 'text-gesthorest-primary'}>
                    {nextSession.placesRestantes}
                  </strong>
                  {' '}/ {nextSession.placesTotal}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Boutons CTA */}
        <div className="px-6 py-5 space-y-3 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gesthorest-accent px-5 py-3.5 font-bold text-white transition-colors hover:bg-gesthorest-accent-hover"
          >
            <CreditCard size={18} />
            Payer en ligne — CinetPay
          </button>
          <button
            type="button"
            onClick={() => setReservationOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gesthorest-primary px-5 py-3.5 font-semibold text-gesthorest-primary transition-colors hover:bg-gesthorest-primary hover:text-white"
          >
            Réserver — Payer au cabinet
          </button>
        </div>

        {/* Contact */}
        <div className="px-6 py-5 space-y-3">
          <a
            href="tel:+2250747123321"
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gesthorest-primary transition-colors hover:border-gesthorest-accent hover:text-gesthorest-accent"
          >
            <Phone size={16} className="shrink-0" />
            📞 Nous appeler
          </a>
          <a
            href={`https://wa.me/2250747123321?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gesthorest-primary transition-colors hover:border-[#25D366] hover:text-[#25D366]"
          >
            <MessageCircle size={16} className="shrink-0" />
            💬 WhatsApp
          </a>
        </div>
      </div>

      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        formation={formation}
      />
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  )
}
