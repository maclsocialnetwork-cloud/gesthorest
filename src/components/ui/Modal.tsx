"use client";

import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="font-heading text-xl font-bold text-gesthorest-primary">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-gesthorest-text-light hover:text-gesthorest-text"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
