import { z } from "zod";

export const internationalDemandeSchema = z.object({
  pays: z.string().min(2, "Le pays est requis"),
  organisation: z.string().min(2, "L'organisation est requise"),
  typeMission: z.string().min(2, "Le type de mission est requis"),
  description: z.string().min(10, "Merci de détailler votre besoin (10 caractères min.)"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
});

export type InternationalDemandeInput = z.infer<typeof internationalDemandeSchema>;
