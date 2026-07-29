import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profilSchema } from "@/lib/validation/profil";

export async function PUT(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
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

  const { error } = await supabase
    .from("apprenants")
    .update({
      nom: parsed.data.nom,
      prenom: parsed.data.prenom,
      telephone: parsed.data.telephone,
      entreprise: parsed.data.entreprise || null,
    })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.password || body.password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caractères" },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: body.password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
