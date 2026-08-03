import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

const VALID_TABLES = ["articles", "evenements", "temoignages", "equipe", "telechargements", "fdfp_demandes", "sessions"] as const;

function revalidateForTable(table: string) {
  if (table === "equipe") revalidatePath("/a-propos");
  if (table === "articles") revalidatePath("/actualites", "layout");
  if (table === "evenements") revalidatePath("/evenements");
  if (table === "temoignages") revalidatePath("/");
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createAdminClient();
  const table = body._table as string;
  delete body._table;

  if (!VALID_TABLES.includes(table as never)) {
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
  revalidateForTable(table);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createAdminClient();
  const table = body._table as string;
  const id = body._id as string;
  delete body._table;
  delete body._id;

  if (!VALID_TABLES.includes(table as never)) {
    return NextResponse.json({ error: "Table invalide" }, { status: 400 });
  }

  const { error } = await supabase.from(table).update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateForTable(table);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const id = searchParams.get("id");

  if (!table || !id || !VALID_TABLES.includes(table as never)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateForTable(table);
  return NextResponse.json({ success: true });
}
