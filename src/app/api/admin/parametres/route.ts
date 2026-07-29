import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createClient();
  const settings = body.settings as { cle: string; valeur: string }[];

  for (const s of settings) {
    const { error } = await supabase
      .from("settings")
      .upsert(
        { cle: s.cle, valeur: s.valeur, updated_at: new Date().toISOString() },
        { onConflict: "cle" }
      );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
