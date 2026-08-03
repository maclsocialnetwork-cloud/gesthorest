import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/password";
import { APPRENANT_COOKIE } from "@/lib/apprenant-session";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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

  const { email, password } = parsed.data;
  const supabase = createAdminClient();

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id, statut, password_hash")
    .eq("email", email)
    .single();

  if (!apprenant || !apprenant.password_hash) {
    return NextResponse.json(
      { error: "Email ou mot de passe incorrect" },
      { status: 401 }
    );
  }

  if (apprenant.statut === "en_attente") {
    return NextResponse.json(
      {
        error: "Votre compte est en attente de validation par notre équipe.",
        code: "EN_ATTENTE",
      },
      { status: 403 }
    );
  }

  if (apprenant.statut === "bloque") {
    return NextResponse.json(
      {
        error: "Votre compte a été suspendu. Contactez-nous pour plus d'informations.",
        code: "BLOQUE",
      },
      { status: 403 }
    );
  }

  const valid = await verifyPassword(password, apprenant.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Email ou mot de passe incorrect" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(APPRENANT_COOKIE, apprenant.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
