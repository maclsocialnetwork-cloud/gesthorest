'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
type MonthlyRow = { mois: string; ca: number; inscriptions: number }
type TauxRow = { titre: string; taux: number; inscrits: number; places: number }

const COLORS = {
  primary: '#1B2A4A',
  accent: '#F5821F',
  accentLight: '#F5821F33',
  primaryLight: '#1B2A4A33',
}

export function CaAreaChart({ data }: { data: MonthlyRow[] }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-heading text-base font-semibold text-gesthorest-primary">
        CA mensuel — 6 derniers mois (FCFA)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.25} />
              <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(v) => [`${Number(v ?? 0).toLocaleString('fr-FR')} FCFA`, 'CA']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Area
            type="monotone"
            dataKey="ca"
            stroke={COLORS.accent}
            strokeWidth={2}
            fill="url(#caGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function InscriptionsBarChart({ data }: { data: MonthlyRow[] }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-heading text-base font-semibold text-gesthorest-primary">
        Inscriptions par mois
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            formatter={(v) => [Number(v ?? 0), 'Inscriptions']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="inscriptions" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TauxRemplissageChart({ data }: { data: TauxRow[] }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-heading text-base font-semibold text-gesthorest-primary">
        Taux de remplissage — sessions actives
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-gesthorest-text-light py-8 text-center">Aucune session active.</p>
      ) : (
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.titre}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gesthorest-text truncate max-w-[70%]">{row.titre}</span>
                <span className={`font-bold ${row.taux >= 80 ? 'text-green-600' : row.taux >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {row.taux}% ({row.inscrits}/{row.places})
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${row.taux >= 80 ? 'bg-green-500' : row.taux >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${Math.min(row.taux, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
