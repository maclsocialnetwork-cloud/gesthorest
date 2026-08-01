'use client'
import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed) {
      const daysDiff = (Date.now() - new Date(dismissed).getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff < 7) return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowBanner(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-dismissed', new Date().toISOString())
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl animate-slide-in-up md:left-auto md:right-24 md:w-96">
      <span className="text-2xl" aria-hidden>📱</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gesthorest-primary">Installer l&apos;app Gesthorest</p>
        <p className="text-xs text-gesthorest-muted">Accédez à nos formations depuis votre téléphone</p>
      </div>
      <button
        onClick={handleInstall}
        className="shrink-0 rounded-lg bg-gesthorest-accent px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-gesthorest-accent-hover"
      >
        Installer
      </button>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-lg leading-none text-gray-400 hover:text-gray-600"
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  )
}
