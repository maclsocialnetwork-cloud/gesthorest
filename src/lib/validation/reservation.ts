import { z } from "zod";

export const reservationSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  entreprise: z.string().optional(),
  sessionId: z.string().min(1, "Veuillez choisir une session"),
  sessionDate: z.string(),
  sessionLieu: z.string(),
  formationId: z.string(),
  formationTitre: z.string(),
  montant: z.number().nullable(),
  devise: z.string(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
