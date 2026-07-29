import { z } from "zod";

export const evaluationSchema = z.object({
  inscriptionId: z.string().min(1, "Inscription requise"),
  note: z.number().min(1, "Note minimale : 1").max(5, "Note maximale : 5"),
  commentaire: z.string().optional(),
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;
