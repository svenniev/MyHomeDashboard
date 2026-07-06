import { z } from 'zod';

export const BodyCompositionSchema = z.object({
  body: z.object({
    measuredAt: z.string(),
    weightKg: z.number().optional().nullable(),
    bodyFatPercent: z.number().optional().nullable(),
    musclePercent: z.number().optional().nullable(),
    visceralFatPercent: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const UpdateBodyCompositionSchema = BodyCompositionSchema.deepPartial();
