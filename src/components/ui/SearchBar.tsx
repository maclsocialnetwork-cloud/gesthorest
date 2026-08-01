'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { SEED_FORMATIONS } from '@/lib/data/formations-seed'

interface Props {
  variant?: 'navbar' | 'catalogue'
  onClose?: () => void
  className?: string
}

export default function SearchBar({ variant = 'navbar', onClose, className = '' }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length >= 2
    ? SEED_FORMATIONS.filter((f) =>
        f.titre.toLowerCase().includes(query.toLowerCase()) ||
        f.domaine.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    if (variant === 'navbar' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [variant])

  useEffect(() => {
    setOpen(results.length > 0)
    setActiveIdx(-1)
  }, [results.length])

  // Fermer au clic extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navigate = useCallback((slug: string) => {
    router.push(`/catalogue/${slug}`)
    setQuery('')
    setOpen(false)
    onClose?.()
  }, [router, onClose])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        navigate(results[activeIdx].slug)
      } else if (results[0]) {
        navigate(results[0].slug)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      onClose?.()
    }
  }

  const isNavbar = variant === 'navbar'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`flex items-center gap-2 rounded-xl border transition-all ${
        isNavbar
          ? 'border-white/20 bg-white/10 px-3 py-2 text-white'
          : 'border-gray-200 bg-white px-4 py-3 text-gesthorest-text shadow-sm'
      }`}>
        <Search size={16} className={isNavbar ? 'text-white/60 shrink-0' : 'text-gesthorest-text-light shrink-0'} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isNavbar ? 'Rechercher une formation…' : 'Rechercher par titre, domaine…'}
          className={`bg-transparent outline-none ${
            isNavbar
              ? 'w-44 text-sm text-white placeholder-white/50'
              : 'w-full text-sm placeholder-gesthorest-text-light'
          }`}
          aria-label="Rechercher une formation"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setOpen(false); onClose?.() }}
            className={isNavbar ? 'text-white/60 hover:text-white' : 'text-gesthorest-text-light hover:text-gesthorest-text'}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown résultats */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-100">
          <ul role="listbox">
            {results.map((f, i) => (
              <li key={f.id} role="option" aria-selected={i === activeIdx}>
                <button
                  type="button"
                  onClick={() => navigate(f.slug)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    i === activeIdx
                      ? 'bg-gesthorest-light'
                      : 'hover:bg-gesthorest-light'
                  }`}
                >
                  <Search size={14} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                  <div>
                    <p className="text-sm font-medium text-gesthorest-primary">{f.titre}</p>
                    <p className="text-xs text-gesthorest-text-light capitalize">
                      {f.domaine.replace(/-/g, ' ')} · {f.dureeLabel}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 px-4 py-2">
            <button
              type="button"
              onClick={() => { router.push('/catalogue'); setQuery(''); setOpen(false); onClose?.() }}
              className="text-xs font-medium text-gesthorest-accent hover:underline"
            >
              Voir toutes les formations →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
