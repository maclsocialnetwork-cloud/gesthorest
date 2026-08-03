import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import { hashPassword } from "@/lib/password";
import { profilSchema } from "@/lib/validation/profil";

export async function PUT(request: Request) {
  const apprenantId = getApprenantId();
  if (!apprenantId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profilSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("apprenants")
    .update({
      nom: parsed.data.nom,
      prenom: parsed.data.prenom,
      telephone: parsed.data.telephone,
      entreprise: parsed.data.entreprise || null,
    })
    .eq("id", apprenantId);

  if (error) {
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const apprenantId = getApprenantId();
  if (!apprenantId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.password || body.password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caractères" },
      { status: 400 }
    );
  }

  const password_hash = await hashPassword(body.password);
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("apprenants")
    .update({ password_hash })
    .eq("id", apprenantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
