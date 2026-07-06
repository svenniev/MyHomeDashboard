import { z } from 'zod';

export const GoalSchema = z.object({
  body: z.object({
    title: z.string(),
    shortDescription: z.string().optional().nullable(),
    longDescription: z.string().optional().nullable(),
    startDate: z.string(),
    targetFinishDate: z.string().optional().nullable(),
    valueType: z.string(),
    unit: z.string(),
    direction: z.enum(['increase', 'decrease']),
    startValue: z.number(),
    currentValue: z.number(),
    targetValue: z.number(),
  }),
});

export const UpdateGoalSchema = GoalSchema.deepPartial();

export const GoalValueUpdateSchema = z.object({
  body: z.object({
    value: z.number(),
    note: z.string().optional().nullable(),
  }),
});
