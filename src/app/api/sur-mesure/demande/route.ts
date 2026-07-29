import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { surMesureSchema } from "@/lib/validation/sur-mesure";
import { sendAdminNotification } from "@/lib/email/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = surMesureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const values = parsed.data;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("sur_mesure_demandes").insert({
      entreprise: values.entreprise,
      secteur: values.secteur,
      effectif: values.effectif,
      thematique: values.thematique,
      delai: values.delai ?? null,
      message: values.message ?? null,
      email: values.email,
      telephone: values.telephone,
      statut: "nouvelle",
    });

    if (error) throw error;
  } catch (error) {
    console.error("[sur-mesure/demande] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre demande pour le moment." },
      { status: 500 }
    );
  }

  await sendAdminNotification(
    `Nouvelle demande sur mesure — ${values.entreprise}`,
    `<p>Entreprise : ${values.entreprise}</p><p>Secteur : ${values.secteur}</p><p>Effectif : ${values.effectif}</p><p>Thématique : ${values.thematique}</p><p>Délai : ${values.delai ?? "Non précisé"}</p><p>Message : ${values.message ?? "—"}</p><p>Contact : ${values.email} / ${values.telephone}</p>`
  );

  return NextResponse.json({ success: true });
}
