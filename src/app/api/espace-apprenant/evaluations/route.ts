import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluationSchema } from "@/lib/validation/evaluation";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = evaluationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!apprenant) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const { data: inscription } = await supabase
    .from("inscriptions")
    .select("id")
    .eq("id", parsed.data.inscriptionId)
    .eq("apprenant_id", apprenant.id)
    .eq("statut", "confirme")
    .single();

  if (!inscription) {
    return NextResponse.json({ error: "Inscription non trouvée" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("evaluations")
    .select("id")
    .eq("inscription_id", parsed.data.inscriptionId)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà évalué cette formation" }, { status: 409 });
  }

  const { error } = await supabase.from("evaluations").insert({
    inscription_id: parsed.data.inscriptionId,
    note: parsed.data.note,
    commentaire: parsed.data.commentaire || null,
  });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
