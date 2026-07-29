import { z } from "zod";

export const OBJETS_CONTACT = [
  "Formation",
  "Sur mesure",
  "Recrutement",
  "Partenariat",
  "International",
  "Autre",
] as const;

export const contactSchema = z.object({
  objet: z.enum(OBJETS_CONTACT),
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  message: z.string().min(10, "Merci de détailler votre message (10 caractères min.)"),
});

export type ContactInput = z.infer<typeof contactSchema>;
