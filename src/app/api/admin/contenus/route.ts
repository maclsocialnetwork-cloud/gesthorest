import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createClient();
  const table = body._table as string;
  delete body._table;

  if (!["articles", "evenements", "temoignages", "equipe"].includes(table)) {
    return NextResponse.json({ error: "Table invalide" }, { status: 400 });
  }

  if (table === "articles" && body.titre && !body.slug) {
    body.slug = body.titre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const { error } = await supabase.from(table).insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createClient();
  const table = body._table as string;
  const id = body._id as string;
  delete body._table;
  delete body._id;

  if (!["articles", "evenements", "temoignages", "equipe"].includes(table)) {
    return NextResponse.json({ error: "Table invalide" }, { status: 400 });
  }

  const { error } = await supabase.from(table).update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const id = searchParams.get("id");

  if (!table || !id || !["articles", "evenements", "temoignages", "equipe"].includes(table)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
