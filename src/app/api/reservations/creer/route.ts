import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { reservationSchema } from "@/lib/validation/reservation";
import { generateNumeroBon } from "@/lib/numero-bon";
import { generateBonCommandePdf } from "@/lib/pdf/bon-commande";
import { sendEmail, sendAdminNotification } from "@/lib/email/resend";
import { formatDate, formatPrix } from "@/lib/format";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const values = parsed.data;
  const numeroBon = generateNumeroBon();

  try {
    const supabase = createAdminClient();

    const { data: existingApprenant } = await supabase
      .from("apprenants")
      .select("id")
      .eq("email", values.email)
      .maybeSingle();

    let apprenantId = existingApprenant?.id as string | undefined;

    if (!apprenantId) {
      const { data: newApprenant, error: apprenantError } = await supabase
        .from("apprenants")
        .insert({
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          telephone: values.telephone,
          entreprise: values.entreprise ?? null,
          role: "apprenant",
        })
        .select("id")
        .single();

      if (apprenantError || !newApprenant) throw apprenantError;
      apprenantId = newApprenant.id;
    }

    const { error: inscriptionError } = await supabase.from("inscriptions").insert({
      session_id: values.sessionId,
      apprenant_id: apprenantId,
      type_paiement: "cabinet",
      statut: "en_attente",
      montant: values.montant,
      devise: values.devise,
      numero_bon: numeroBon,
    });

    if (inscriptionError) throw inscriptionError;
  } catch (error) {
    console.error("[reservations/creer] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la réservation pour le moment." },
      { status: 500 }
    );
  }

  try {
    const pdfBytes = await generateBonCommandePdf({
      numeroBon,
      formationTitre: values.formationTitre,
      sessionDate: formatDate(values.sessionDate),
      sessionLieu: values.sessionLieu,
      montant: values.montant,
      devise: values.devise,
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      telephone: values.telephone,
      entreprise: values.entreprise,
    });
    const pdfBuffer = Buffer.from(pdfBytes);

    await sendEmail({
      to: values.email,
      subject: `Votre bon de commande ${numeroBon} — ${values.formationTitre}`,
      html: `<p>Bonjour ${values.prenom},</p><p>Votre réservation pour la formation <strong>${values.formationTitre}</strong> est bien enregistrée. Vous trouverez votre bon de commande en pièce jointe.</p><p>Montant : ${formatPrix(values.montant, values.devise)}</p>`,
      attachments: [{ filename: `${numeroBon}.pdf`, content: pdfBuffer }],
    });

    await sendAdminNotification(
      `Nouvelle réservation — ${numeroBon}`,
      `<p>${values.prenom} ${values.nom} (${values.email}) a réservé la formation <strong>${values.formationTitre}</strong>.</p>`
    );
  } catch (error) {
    console.error("[reservations/creer] Échec de l'envoi email/PDF :", error);
  }

  return NextResponse.json({ success: true, numeroBon });
}
