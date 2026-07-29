"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

export default function EvaluationForm({ inscriptionId }: { inscriptionId: string }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (note === 0) {
      showToast("Veuillez attribuer une note", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/espace-apprenant/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inscriptionId, note, commentaire }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      showToast("Merci pour votre évaluation !");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <p className="mb-1 text-sm font-medium text-gesthorest-text">Votre note</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setNote(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
            >
              <Star
                size={28}
                className={
                  star <= (hover || note)
                    ? "fill-gesthorest-accent text-gesthorest-accent"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          {note > 0 && (
            <span className="ml-2 text-sm font-medium text-gesthorest-text">
              {note}/5
            </span>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`commentaire-${inscriptionId}`} className="mb-1 block text-sm font-medium text-gesthorest-text">
          Commentaire (optionnel)
        </label>
        <textarea
          id={`commentaire-${inscriptionId}`}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none"
          placeholder="Partagez votre expérience…"
        />
      </div>

      <button
        type="submit"
        disabled={loading || note === 0}
        className="btn-primary flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />
        {loading ? "Envoi…" : "Envoyer mon évaluation"}
      </button>
    </form>
  );
}
