import { z } from 'zod';

export const UpdateUserSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    nickname: z.string().optional().nullable(),
    heightCm: z.number().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    profilePicturePath: z.string().optional().nullable(),
  }),
});
