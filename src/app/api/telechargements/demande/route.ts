import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  entreprise: z.string().optional(),
  document_titre: z.string(),
  document_type: z.string(),
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

      // Log la demande
      await supabase.from('telechargement_demandes').insert({
        nom: data.nom,
        email: data.email,
        entreprise: data.entreprise ?? null,
      })

      // Incrémenter le compteur si le document existe
      const { data: doc } = await supabase
        .from('telechargements')
        .select('id, nb_telechargements')
        .eq('type', data.document_type)
        .single()

      if (doc) {
        await supabase
          .from('telechargements')
          .update({ nb_telechargements: (doc.nb_telechargements ?? 0) + 1 })
          .eq('id', doc.id)
      }
    }

    // Envoi email si Resend configuré
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && !resendKey.includes('REMPLACER')) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Gesthorest <no-reply@gesthorest.com>',
        to: [data.email],
        subject: `Votre document Gesthorest : ${data.document_titre}`,
        html: `<p>Bonjour ${data.nom},</p>
               <p>Merci pour votre intérêt. Votre document <strong>${data.document_titre}</strong> sera disponible très prochainement.</p>
               <p>Notre équipe vous contactera sous 24h avec le lien de téléchargement.</p>
               <p>Cordialement,<br/>L'équipe Gesthorest International</p>`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('Telechargement demande error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
