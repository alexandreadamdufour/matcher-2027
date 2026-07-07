import { z } from "zod";

export const CATEGORIES = [
  "Économie",
  "International",
  "Écologie",
  "Institutions",
  "Société",
  "Éducation",
] as const;

export const CategorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof CategorySchema>;

export const StanceSchema = z.union([
  z.literal(-2),
  z.literal(-1),
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);
export type Stance = z.infer<typeof StanceSchema>;

export const WeightSchema = z.union([z.literal(0), z.literal(1), z.literal(2)]);
export type Weight = z.infer<typeof WeightSchema>;

export const ThesisSchema = z.object({
  id: z.string(),
  category: CategorySchema,
  statement: z.string(),
  explanation: z.string(),
});
export type Thesis = z.infer<typeof ThesisSchema>;

export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  party: z.string(),
  portrait_url: z.string(),
  official_program_url: z.string(),
});
export type Candidate = z.infer<typeof CandidateSchema>;

export const SourceTypeSchema = z.enum(["programme", "vote", "interview"]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const PositionSchema = z.object({
  candidate_id: z.string(),
  thesis_id: z.string(),
  stance: StanceSchema,
  source_url: z.string(),
  source_type: SourceTypeSchema,
  source_quote: z.string(),
  source_date: z.string(),
});
export type Position = z.infer<typeof PositionSchema>;

export const UserAnswerSchema = z.object({
  thesis_id: z.string(),
  stance: StanceSchema,
  weight: WeightSchema,
});
export type UserAnswer = z.infer<typeof UserAnswerSchema>;
