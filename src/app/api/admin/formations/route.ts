import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createClient();

  const slug = body.titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("formations")
    .insert({
      slug,
      titre: body.titre,
      domaine: body.domaine,
      format: body.format,
      duree: body.duree,
      description: body.description || null,
      programme: body.programme || [],
      objectifs: body.objectifs || [],
      public_cible: body.public_cible || null,
      prerequis: body.prerequis || null,
      prix: body.prix ?? null,
      devise: body.devise || "FCFA",
      statut: body.statut || "brouillon",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await request.json();
  const supabase = createClient();

  const { error } = await supabase
    .from("formations")
    .update({
      titre: body.titre,
      domaine: body.domaine,
      format: body.format,
      duree: body.duree,
      description: body.description || null,
      programme: body.programme || [],
      objectifs: body.objectifs || [],
      public_cible: body.public_cible || null,
      prerequis: body.prerequis || null,
      prix: body.prix ?? null,
      devise: body.devise || "FCFA",
      statut: body.statut,
    })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
