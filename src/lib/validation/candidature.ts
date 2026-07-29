import { z } from "zod";

export const candidatureSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  posteSouhaite: z.string().min(2, "Le poste souhaité est requis"),
  secteur: z.string().optional(),
  message: z.string().optional(),
});

export type CandidatureInput = z.infer<typeof candidatureSchema>;
