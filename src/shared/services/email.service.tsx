import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'
import * as React from 'react'
import { OTPEmail } from 'emails/otp'

@Injectable()
export class EmailService {
  private readonly resend: Resend

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'OTP Code'

    const data = await this.resend.emails.send({
      from: 'EcomNest <no-reply@ecomnest.id.vn>',
      to: [payload.email],
      subject,
      react: <OTPEmail title={subject} otpCode={payload.code} />
    })
    return data
  }
}
