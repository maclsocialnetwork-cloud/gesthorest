import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("[inscription] SUPABASE_URL présente:", !!supabaseUrl, "longueur:", supabaseUrl?.length);
  console.log("[inscription] SERVICE_ROLE_KEY présente:", !!serviceKey, "longueur:", serviceKey?.length);

  const authAdmin = createClient(supabaseUrl!, serviceKey!);

  const { data: authData, error: authError } = await authAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nom, prenom, telephone, entreprise: entreprise || "" },
  });

  if (authError) {
    console.error("[inscription] authError complet:", JSON.stringify(authError, null, 2));
    return NextResponse.json({
      error: authError.message,
      code: authError.code ?? null,
      status: authError.status ?? null,
      details: JSON.stringify(authError),
    }, { status: 400 });
  }

  const db = createAdminClient();
  const { error: profileError } = await db.from("apprenants").insert({
    user_id: authData.user.id,
    nom,
    prenom,
    email,
    telephone,
    entreprise: entreprise || null,
    role: "apprenant",
  });

  if (profileError) {
    console.error("[inscription] profileError complet:", JSON.stringify(profileError, null, 2));
    return NextResponse.json({
      error: "Utilisateur créé mais erreur profil: " + profileError.message,
      details: JSON.stringify(profileError),
    }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
