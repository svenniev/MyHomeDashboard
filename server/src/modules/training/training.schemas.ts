import { z } from 'zod';

export const TrainingTypeSchema = z.object({
  body: z.object({
    name: z.string(),
    slug: z.string(),
    thumbnailPath: z.string().optional().nullable(),
    summarySchemaJson: z.any().optional().nullable(),
  }),
});

export const UpdateTrainingTypeSchema = TrainingTypeSchema.deepPartial();
