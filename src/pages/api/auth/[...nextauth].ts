import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import prisma from '../../../../prisma/index';
import {
  createPaymentAccount,
  getPayment,
} from '../../../../prisma/services/customer';
import { html, text } from '../../../config/email-templates/signin';
import { log } from '../../../lib/server/logsnag';
import { emailConfig, sendMail } from '../../../lib/server/mail';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        const customerPayment = await getPayment(user.email);
        session.user.userId = user.id;

        if (customerPayment) {
          session.user.subscription = customerPayment.subscriptionType;
        }
      }

      return session;
    },
  },
  debug: !(process.env.NODE_ENV === 'production'),
  events: {
    signIn: async ({ user, isNewUser }) => {
      const customerPayment = await getPayment(user.email);

      if (isNewUser || customerPayment === null || user.createdAt === null) {
        await Promise.all([
          createPaymentAccount(user.email, user.id),
          log(
            'user-registration',
            'New User Signup',
            `A new user recently signed up. (${user.email})`
          ),
        ]);
      }
    },
  },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: emailConfig,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const { host } = new URL(url);
        await sendMail({
          html: html({ email, url }),
          subject: `[Nextacular] Sign in to ${host}`,
          text: text({ email, url }),
          from: process.env.EMAIL_FROM,
          to: email,
        });
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || null,
  session: {
    jwt: true,
  },
});
