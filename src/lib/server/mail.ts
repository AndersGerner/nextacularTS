import nodemailer from 'nodemailer'

export const emailConfig = {
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  service: process.env.EMAIL_SERVICE,
}
console.log('🚀 ~ file: mail.ts:12 ~ emailConfig', emailConfig)

const transporter = nodemailer.createTransport(emailConfig)

type MailProps = {
  from: string
  to: string
  subject: string
  text: string
  html: any
}

export const sendMail = async ({
  from,
  to,
  subject,
  html,
  text,
}: MailProps) => {
  const data = {
    from: from ?? process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(data)
  }
  await transporter.sendMail(data)
}

export default transporter
