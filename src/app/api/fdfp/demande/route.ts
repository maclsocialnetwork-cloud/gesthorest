import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  entreprise: z.string().min(1),
  nom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().optional(),
  formation_souhaitee: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceKey && !supabaseUrl.includes('REMPLACER') && !serviceKey.includes('REMPLACER')) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, serviceKey, { db: { schema: 'web_gesthorest' } })
      await supabase.from('fdfp_demandes').insert({
        entreprise: data.entreprise,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone ?? null,
        formation_souhaitee: data.formation_souhaitee ?? null,
        statut: 'nouveau',
      })
    }

    // Envoi email si Resend configuré
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && !resendKey.includes('REMPLACER')) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Gesthorest <no-reply@gesthorest.com>',
        to: ['contact@gesthorest.com'],
        subject: `Nouvelle demande FDFP — ${data.entreprise}`,
        html: `<p><strong>Entreprise:</strong> ${data.entreprise}</p>
               <p><strong>Nom:</strong> ${data.nom}</p>
               <p><strong>Email:</strong> ${data.email}</p>
               <p><strong>Téléphone:</strong> ${data.telephone ?? 'Non renseigné'}</p>
               <p><strong>Formation souhaitée:</strong> ${data.formation_souhaitee ?? 'Non précisée'}</p>`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('FDFP demande error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
