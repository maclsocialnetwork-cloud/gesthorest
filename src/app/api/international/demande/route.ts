import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { internationalDemandeSchema } from "@/lib/validation/international";
import { sendAdminNotification } from "@/lib/email/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = internationalDemandeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const v = parsed.data;
  const message = `Pays : ${v.pays}\nType de mission : ${v.typeMission}\n\n${v.description}`;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      objet: "International",
      nom: v.organisation,
      prenom: "—",
      email: v.email,
      telephone: v.telephone,
      entreprise: v.organisation,
      message,
      lu: false,
    });

    if (error) throw error;
  } catch (error) {
    console.error("[international/demande] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre demande pour le moment." },
      { status: 500 }
    );
  }

  await sendAdminNotification(`Nouvelle demande internationale — ${v.organisation}`, message.replace(/\n/g, "<br/>"));

  return NextResponse.json({ success: true });
}
