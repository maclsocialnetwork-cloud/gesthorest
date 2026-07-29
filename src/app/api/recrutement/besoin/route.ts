import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { recrutementBesoinSchema } from "@/lib/validation/recrutement";
import { sendAdminNotification } from "@/lib/email/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = recrutementBesoinSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const v = parsed.data;
  const message = `Poste : ${v.poste}\nProfil recherché : ${v.profil}\nDélai : ${v.delai ?? "Non précisé"}\nBudget : ${v.budget ?? "Non précisé"}\n\n${v.message ?? ""}`;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      objet: "Recrutement",
      nom: v.entreprise,
      prenom: "—",
      email: v.email,
      telephone: v.telephone,
      entreprise: v.entreprise,
      message,
      lu: false,
    });

    if (error) throw error;
  } catch (error) {
    console.error("[recrutement/besoin] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre demande pour le moment." },
      { status: 500 }
    );
  }

  await sendAdminNotification(`Nouveau besoin de recrutement — ${v.entreprise}`, message.replace(/\n/g, "<br/>"));

  return NextResponse.json({ success: true });
}
