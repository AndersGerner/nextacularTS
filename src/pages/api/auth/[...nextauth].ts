import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '../../../../prisma/index'
import {
  createPaymentAccount,
  getPayment,
} from '../../../../prisma/services/customer'
import { html, text } from '../../../config/email-templates/signin'
import { log } from '../../../lib/server/logsnag'
import { emailConfig, sendMail } from '../../../lib/server/mail'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        const customerPayment = await getPayment(user.email)
        session.user.userId = user.id

        if (customerPayment) {
          session.user.subscription = customerPayment.subscriptionType
        }
      }

      return session
    },
  },
  debug: !(process.env.NODE_ENV === 'production'),
  events: {
    signIn: async ({ user, isNewUser }) => {
      const customerPayment = await getPayment(user.email)

      if (isNewUser || customerPayment === null || user.createdAt === null) {
        await Promise.all([
          createPaymentAccount(user.email, user.id),
          log(
            'user-registration',
            'New User Signup',
            `A new user recently signed up. (${user.email})`,
            null
          ),
        ])
      }
    },
  },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: emailConfig,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const { host } = new URL(url)
        await sendMail({
          html: html({ email, url }),
          subject: `[Nextacular] Sign in to ${host}`,
          text: text({ email, url }),
          from: process.env.EMAIL_FROM,
          to: email,
        })
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || null,
}

export default NextAuth(authOptions)
