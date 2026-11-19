import { z } from '@/shared/forms/schema'

export const passwordRules = [
  {
    label: 'Từ 8 đến 32 ký tự',
    test: (password: string) => password.length >= 8 && password.length <= 32,
  },
  {
    label: 'Có ít nhất một chữ hoa',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: 'Có ít nhất một chữ thường',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: 'Có ít nhất một chữ số',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: 'Có ít nhất một ký tự đặc biệt',
    test: (password: string) => /[^A-Za-z0-9\s]/.test(password),
  },
] as const

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Vui lòng nhập email')
  .email('Email chưa đúng định dạng')
  .max(255, 'Email không được vượt quá 255 ký tự')
  .transform((email) => email.toLowerCase())

const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .max(32, 'Mật khẩu không được vượt quá 32 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
  .regex(/[^A-Za-z0-9\s]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt')

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .max(32, 'Mật khẩu không được vượt quá 32 ký tự'),
})

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập họ và tên')
      .max(150, 'Họ và tên không được vượt quá 150 ký tự'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên')
    .max(150, 'Họ và tên không được vượt quá 150 ký tự'),
  phone: z
    .string()
    .trim()
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>
