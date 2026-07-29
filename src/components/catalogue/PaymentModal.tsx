"use client";

import { AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";

const CINETPAY_CONFIGURED =
  !!process.env.NEXT_PUBLIC_CINETPAY_SITE_ID &&
  !process.env.NEXT_PUBLIC_CINETPAY_SITE_ID.startsWith("PLACEHOLDER");

export default function PaymentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="S'inscrire & payer en ligne">
      {CINETPAY_CONFIGURED ? (
        <p className="text-sm text-gesthorest-text">
          Redirection vers le paiement sécurisé CinetPay...
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <AlertCircle size={40} className="text-gesthorest-accent" />
          <p className="text-sm text-gesthorest-text">
            Le paiement en ligne sera bientôt disponible. En attendant, vous
            pouvez réserver votre place et régler directement au cabinet.
          </p>
          <button type="button" onClick={onClose} className="btn-secondary">
            Fermer
          </button>
        </div>
      )}
    </Modal>
  );
}
