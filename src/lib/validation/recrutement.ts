import { z } from "zod";

export const recrutementBesoinSchema = z.object({
  entreprise: z.string().min(2, "Le nom de l'entreprise est requis"),
  poste: z.string().min(2, "L'intitulé du poste est requis"),
  profil: z.string().min(2, "Le profil recherché est requis"),
  delai: z.string().optional(),
  budget: z.string().optional(),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  message: z.string().optional(),
});

export type RecrutementBesoinInput = z.infer<typeof recrutementBesoinSchema>;
