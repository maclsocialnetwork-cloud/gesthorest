import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createClient();

  const { error } = await supabase
    .from("candidatures")
    .update({ statut: body.statut })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
