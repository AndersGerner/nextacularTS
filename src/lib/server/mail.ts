import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'

export const emailConfig = {
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
    api_key: process.env.EMAIL_SERVER_API_KEY,
    domain: process.env.EMAIL_SERVER_DOMAIN,
  },
  host: 'api.eu.mailgun.net',
  //port: parseInt(process.env.EMAIL_SERVER_PORT),
  service: process.env.EMAIL_SERVICE,
}

const transporter = nodemailer.createTransport(mg(emailConfig))

type MailProps = {
  from: string
  to: string
  subject: string
  text: string
  html: string
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
