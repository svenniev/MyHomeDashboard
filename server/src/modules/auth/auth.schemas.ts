import { z } from 'zod';

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    middleName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    nickname: z.string().optional().nullable(),
    heightCm: z.number().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});
