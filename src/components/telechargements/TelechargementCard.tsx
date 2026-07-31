'use client'

import { useState, FormEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Download, X, CheckCircle2, FileText, Calendar, BookOpen, FolderOpen, BarChart2, Layers } from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  catalogue: Layers,
  calendrier: Calendar,
  brochure: BookOpen,
  guide: BarChart2,
  administratif: FolderOpen,
  fiche: FileText,
}

type Doc = {
  titre: string
  description: string
  type: string
}

export default function TelechargementCard({ doc }: { doc: Doc }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', entreprise: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const Icon = ICON_MAP[doc.type] ?? FileText

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/telechargements/demande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, document_titre: doc.titre, document_type: doc.type }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  function handleClose() {
    setOpen(false)
    setTimeout(() => {
      setStatus('idle')
      setForm({ nom: '', email: '', entreprise: '' })
    }, 300)
  }

  const inputCls =
    'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gesthorest-accent focus:outline-none focus:ring-2 focus:ring-gesthorest-accent/20 transition-all'

  return (
    <>
      <div className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gesthorest-primary/5 text-gesthorest-primary transition-colors group-hover:bg-gesthorest-accent/10 group-hover:text-gesthorest-accent">
          <Icon size={24} />
        </div>
        <h3 className="mt-4 font-heading font-semibold text-gesthorest-primary">{doc.titre}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gesthorest-text-light">
          {doc.description}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gesthorest-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gesthorest-accent"
        >
          <Download size={16} />
          Télécharger
        </button>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
            <Dialog.Title className="font-heading text-lg font-bold text-gesthorest-primary">
              Télécharger — {doc.titre}
            </Dialog.Title>

            {status === 'success' ? (
              <div className="mt-6 flex flex-col items-center gap-4 text-center">
                <CheckCircle2 size={48} className="text-green-500" />
                <div>
                  <p className="font-semibold text-gesthorest-primary">Document disponible !</p>
                  <p className="mt-1 text-sm text-gesthorest-text-light">
                    Vous recevrez le lien de téléchargement par email dans quelques instants.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-2 rounded-xl bg-gesthorest-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-gesthorest-accent-hover"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <p className="text-sm text-gesthorest-text-light">
                  Renseignez vos coordonnées pour recevoir ce document par email.
                </p>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gesthorest-text">Nom *</label>
                  <input name="nom" required value={form.nom} onChange={handleChange} className={inputCls} placeholder="Votre nom complet" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gesthorest-text">Email *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputCls} placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gesthorest-text">Entreprise</label>
                  <input name="entreprise" value={form.entreprise} onChange={handleChange} className={inputCls} placeholder="Nom de votre entreprise" />
                </div>
                {status === 'error' && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    Une erreur s&apos;est produite. Veuillez réessayer.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-gesthorest-accent px-6 py-3 font-bold text-white transition-colors hover:bg-gesthorest-accent-hover disabled:opacity-60"
                >
                  {status === 'loading' ? 'Envoi…' : 'Recevoir le document'}
                </button>
              </form>
            )}

            <Dialog.Close
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X size={18} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
