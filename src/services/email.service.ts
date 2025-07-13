import { Resend } from 'resend'
import envConfig from '~/config/evnConfig'

export class EmailService {
  private static resend = new Resend(envConfig.RESEND_API_KEY)

  static sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'Ecommerce <onboarding@resend.dev>',
      to: ['giahoa01giathieu@gmail.com'],
      subject: 'Mã OTP',
      html: `<strong>${payload.code}</strong>`
    })
  }
}
