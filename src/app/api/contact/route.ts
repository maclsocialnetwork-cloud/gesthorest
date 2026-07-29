import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/contact";
import { sendAdminNotification, sendEmail } from "@/lib/email/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const values = parsed.data;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      objet: values.objet,
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      telephone: values.telephone ?? null,
      entreprise: values.entreprise ?? null,
      message: values.message,
      lu: false,
    });

    if (error) throw error;
  } catch (error) {
    console.error("[contact] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre message pour le moment." },
      { status: 500 }
    );
  }

  await sendAdminNotification(
    `Nouveau message de contact — ${values.objet}`,
    `<p>${values.prenom} ${values.nom} (${values.email}${values.telephone ? `, ${values.telephone}` : ""}) — ${values.entreprise ?? "particulier"}</p><p>${values.message}</p>`
  );

  await sendEmail({
    to: values.email,
    subject: "Nous avons bien reçu votre message — Gesthorest International",
    html: `<p>Bonjour ${values.prenom},</p><p>Merci de nous avoir contactés. Notre équipe reviendra vers vous dans les meilleurs délais.</p><p>L'équipe Gesthorest International</p>`,
  });

  return NextResponse.json({ success: true });
}
