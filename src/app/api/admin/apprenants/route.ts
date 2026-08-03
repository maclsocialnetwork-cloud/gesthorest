import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

const VALID_STATUTS = ["actif", "en_attente", "bloque"] as const;

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const statut = searchParams.get("statut");

  const supabase = createAdminClient();
  let query = supabase
    .from("apprenants")
    .select("id, nom, prenom, email, telephone, entreprise, statut, created_at")
    .order("created_at", { ascending: false });

  if (statut && VALID_STATUTS.includes(statut as never)) {
    query = query.eq("statut", statut);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const { id, statut } = body as { id: string; statut: string };

  if (!id || !VALID_STATUTS.includes(statut as never)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("apprenants").update({ statut }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("apprenants").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
