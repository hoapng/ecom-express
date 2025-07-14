import { Resend } from 'resend'
import envConfig from '~/config/evnConfig'
import * as React from 'react'
import { OTPEmail } from '~/view/otp'

export class EmailService {
  private static resend = new Resend(envConfig.RESEND_API_KEY)

  static sendOTP(payload: { email: string; code: string }) {
    const subject = 'Mã OTP'
    return this.resend.emails.send({
      from: 'Ecommerce <onboarding@resend.dev>',
      to: ['giahoa01giathieu@gmail.com'],
      subject,
      react: <OTPEmail otpCode={payload.code} title={subject} />
    })
  }
}
