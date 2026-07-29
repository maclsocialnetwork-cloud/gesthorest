import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { candidatureSchema } from "@/lib/validation/candidature";
import { sendAdminNotification } from "@/lib/email/resend";

const MAX_CV_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();

  const parsed = candidatureSchema.safeParse({
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    posteSouhaite: formData.get("posteSouhaite"),
    secteur: formData.get("secteur") || undefined,
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const cv = formData.get("cv");
  if (!(cv instanceof File) || cv.type !== "application/pdf") {
    return NextResponse.json({ error: "Merci de joindre votre CV au format PDF." }, { status: 400 });
  }
  if (cv.size > MAX_CV_SIZE) {
    return NextResponse.json({ error: "Le CV ne doit pas dépasser 5 Mo." }, { status: 400 });
  }

  const values = parsed.data;

  try {
    const supabase = createAdminClient();
    const filePath = `${Date.now()}-${cv.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { error: uploadError } = await supabase.storage
      .from("candidatures")
      .upload(filePath, cv, { contentType: "application/pdf" });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("candidatures")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("candidatures").insert({
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      telephone: values.telephone,
      poste_souhaite: values.posteSouhaite,
      secteur: values.secteur ?? null,
      message: values.message ?? null,
      cv_url: publicUrlData.publicUrl,
      statut: "recu",
    });

    if (insertError) throw insertError;
  } catch (error) {
    console.error("[candidatures/deposer] Échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre candidature pour le moment." },
      { status: 500 }
    );
  }

  await sendAdminNotification(
    `Nouvelle candidature — ${values.posteSouhaite}`,
    `<p>${values.prenom} ${values.nom} (${values.email}, ${values.telephone}) postule pour : ${values.posteSouhaite}</p><p>Secteur : ${values.secteur ?? "—"}</p><p>Message : ${values.message ?? "—"}</p>`
  );

  return NextResponse.json({ success: true });
}
