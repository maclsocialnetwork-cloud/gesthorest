import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(8),
  entreprise: z.string().optional(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { nom, prenom, email, telephone, entreprise, password } = parsed.data;
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("apprenants")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email" },
      { status: 409 }
    );
  }

  const password_hash = await hashPassword(password);

  const { error } = await supabase.from("apprenants").insert({
    nom,
    prenom,
    email,
    telephone,
    entreprise: entreprise || null,
    password_hash,
    statut: "en_attente",
    role: "apprenant",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
