import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import { FileDown, FolderOpen } from "lucide-react";

type SupportFormation = {
  titre: string;
  domaine: string;
  files: { name: string; url: string }[];
};

type InscriptionWithFormation = {
  sessions: {
    formation_id: string;
    formations: {
      id: string;
      titre: string;
      domaine: string;
      slug: string;
    };
  };
};

type StorageFile = { name: string };

export default async function MesSupportsPage() {
  const apprenantId = getApprenantId();
  if (!apprenantId) redirect("/espace-apprenant/connexion");

  const supabase = createAdminClient();

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id")
    .eq("id", apprenantId)
    .eq("statut", "actif")
    .single();

  if (!apprenant) redirect("/espace-apprenant/connexion");

  const formations: SupportFormation[] = [];

  const { data: inscriptions } = await supabase
    .from("inscriptions")
    .select(`
      sessions (
        formation_id,
        formations (
          id,
          titre,
          domaine,
          slug
        )
      )
    `)
    .eq("apprenant_id", apprenant.id)
    .eq("statut", "confirme");

  if (inscriptions) {
    const seen = new Set<string>();
    for (const ins of inscriptions as unknown as InscriptionWithFormation[]) {
      const formation = ins.sessions?.formations;
      if (!formation || seen.has(formation.id)) continue;
      seen.add(formation.id);

      const { data: fileList } = await supabase.storage
        .from("supports")
        .list(`formations/${formation.slug}`, { limit: 50 });

      const files = (fileList || []).map((f: StorageFile) => ({
        name: f.name,
        url: supabase.storage
          .from("supports")
          .getPublicUrl(`formations/${formation.slug}/${f.name}`).data.publicUrl,
      }));

      formations.push({ titre: formation.titre, domaine: formation.domaine, files });
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mes supports de formation
      </h2>

      {formations.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <FolderOpen size={40} className="mx-auto mb-3 text-gesthorest-text-light" />
          <p className="text-gesthorest-text-light">
            Aucun support disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {formations.map((f) => (
            <div key={f.titre} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-semibold text-gesthorest-primary">
                  {f.titre}
                </h3>
                <span className="rounded bg-gesthorest-primary/10 px-2 py-0.5 text-xs font-medium text-gesthorest-primary">
                  {f.domaine}
                </span>
              </div>

              {f.files.length === 0 ? (
                <p className="mt-3 text-sm text-gesthorest-text-light">
                  Aucun document disponible.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-gray-100">
                  {f.files.map((file) => (
                    <li key={file.name} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gesthorest-text">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-1 text-sm font-medium text-gesthorest-accent hover:underline"
                      >
                        <FileDown size={16} />
                        Télécharger
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
