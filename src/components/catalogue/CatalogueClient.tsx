"use client";

import { useMemo, useState } from "react";
import { DOMAIN_LABELS, type Formation, type Domaine } from "@/lib/data/formations-seed";
import FormationCard from "./FormationCard";

type DureeBucket = "toutes" | "1-2" | "3-5" | "1semaine+";
type FormatFilter = "Tous" | "Présentiel" | "Distanciel" | "Blended";

function matchesDuree(dureeJours: number, bucket: DureeBucket): boolean {
  if (bucket === "toutes") return true;
  if (bucket === "1-2") return dureeJours <= 2;
  if (bucket === "3-5") return dureeJours >= 3 && dureeJours <= 4;
  return dureeJours >= 5;
}

export default function CatalogueClient({
  formations,
  initialDomaine,
}: {
  formations: Formation[];
  initialDomaine?: string;
}) {
  const [domaine, setDomaine] = useState<string>(initialDomaine ?? "tous");
  const [format, setFormat] = useState<FormatFilter>("Tous");
  const [duree, setDuree] = useState<DureeBucket>("toutes");

  const filtered = useMemo(() => {
    return formations.filter((f) => {
      if (domaine !== "tous" && f.domaine !== domaine) return false;
      if (format !== "Tous" && f.format !== format) return false;
      if (!matchesDuree(f.dureeJours, duree)) return false;
      return true;
    });
  }, [formations, domaine, format, duree]);

  const resetFilters = () => {
    setDomaine("tous");
    setFormat("Tous");
    setDuree("toutes");
  };

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-4 border-b border-gray-100 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded">
        <div className="container-gesthorest flex flex-wrap items-end gap-4 !px-0">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gesthorest-text-light">
              Domaine
            </label>
            <select
              value={domaine}
              onChange={(e) => setDomaine(e.target.value)}
              className="rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none"
            >
              <option value="tous">Tous les domaines</option>
              {(Object.entries(DOMAIN_LABELS) as [Domaine, string][]).map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gesthorest-text-light">
              Format
            </label>
            <div className="flex gap-3 rounded border border-gray-200 px-3 py-2 text-sm">
              {(["Tous", "Présentiel", "Distanciel", "Blended"] as FormatFilter[]).map((f) => (
                <label key={f} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="format"
                    checked={format === f}
                    onChange={() => setFormat(f)}
                    className="accent-gesthorest-accent"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gesthorest-text-light">
              Durée
            </label>
            <select
              value={duree}
              onChange={(e) => setDuree(e.target.value as DureeBucket)}
              className="rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none"
            >
              <option value="toutes">Toutes les durées</option>
              <option value="1-2">1-2 jours</option>
              <option value="3-5">3-5 jours</option>
              <option value="1semaine+">1 semaine+</option>
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded border-2 border-gesthorest-primary px-4 py-2 text-sm font-semibold text-gesthorest-primary transition-colors hover:bg-gesthorest-primary hover:text-white"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="container-gesthorest section-padding !pt-10">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-gesthorest-text-light">
            Aucune formation ne correspond à ces critères.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
