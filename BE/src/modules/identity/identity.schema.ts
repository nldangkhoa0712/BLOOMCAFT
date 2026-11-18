import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(32, 'Mật khẩu không được vượt quá 32 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .regex(/[^A-Za-z0-9\s]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt');

export const registerSchema = z
    .object({
        email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
        password: passwordSchema,
        fullName: z.string().trim().min(1).max(150),
        phone: z.string().trim().min(1).max(20).optional(),
    })
    .strict();

export const loginSchema = z
    .object({
        email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
        password: z.string().min(1).max(32),
    })
    .strict();

export const updateProfileSchema = z
    .object({
        fullName: z.string().trim().min(1).max(150).optional(),
        phone: z.string().trim().min(1).max(20).nullable().optional(),
        avatarUrl: z.string().trim().url().nullable().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, 'Phải cung cấp ít nhất một trường cần cập nhật');

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
