import { createCustomer } from '../../src/lib/server/stripe'
import prisma from '../index'
import { SubscriptionType } from '@prisma/client'

export const createPaymentAccount = async (
  email: string,
  customerId: string
) => {
  const paymentAccount = await createCustomer(email)
  await prisma.customerPayment.create({
    data: {
      customerId,
      email,
      paymentId: paymentAccount.id,
    },
  })
}

export const getPayment = async (email: string) =>
  await prisma.customerPayment.findUnique({ where: { email } })

export const updateSubscription = async (
  customerId: string,
  subscriptionType: SubscriptionType
) =>
  await prisma.customerPayment.update({
    data: { subscriptionType },
    where: { customerId },
  })
