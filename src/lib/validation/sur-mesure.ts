import { z } from "zod";

export const surMesureSchema = z.object({
  entreprise: z.string().min(2, "Le nom de l'entreprise est requis"),
  secteur: z.string().min(2, "Le secteur d'activité est requis"),
  effectif: z.string().min(1, "L'effectif à former est requis"),
  thematique: z.string().min(2, "La thématique souhaitée est requise"),
  delai: z.string().optional(),
  message: z.string().optional(),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
});

export type SurMesureInput = z.infer<typeof surMesureSchema>;
