import { z } from 'zod'
import { UserSchema } from './user.model'
import { TypeOfVerificationCode } from '~/constants/auth.constant'

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true
})
  .extend({
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResSchema = UserSchema.transform((user) => {
  // Remove sensitive fields
  const { password, totpSecret, ...safeUser } = user
  return safeUser
})

export type RegisterResType = z.output<typeof UserSchema>

export const VerificationCode = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
  expiresAt: z.date(),
  createdAt: z.date()
})

export type VerificationCodeType = z.infer<typeof VerificationCode>

export const SendOTPBodySchema = VerificationCode.pick({
  email: true,
  type: true
}).strict()

export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
