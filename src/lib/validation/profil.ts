import { z } from "zod";

export const profilSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  entreprise: z.string().optional(),
});

export type ProfilInput = z.infer<typeof profilSchema>;

export const passwordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type PasswordInput = z.infer<typeof passwordSchema>;
