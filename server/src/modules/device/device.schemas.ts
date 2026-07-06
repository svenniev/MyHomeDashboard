import { z } from 'zod';

export const DeviceTrainingLogSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    trainingTypeId: z.string().uuid().optional(),
    trainingTypeSlug: z.string().optional(),
    startedAt: z.string(),
    endedAt: z.string().optional().nullable(),
    durationSeconds: z.number().optional().nullable(),
    caloriesConsumed: z.number().optional().nullable(),
    summaryJson: z.any(),
    externalDeviceSessionId: z.string().optional().nullable(),
  }),
});
