import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { getPayment } from '../../../../../prisma/services/customer'
import stripe from '../../../../lib/server/stripe'
import { authOptions } from '../../auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  if (method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions)
    const { priceId } = req.query
    const [customerPayment, price] = await Promise.all([
      getPayment(session.user?.email),
      stripe.prices.retrieve(priceId.toString()),
    ])
    const product = await stripe.products.retrieve(price.product.toString())
    const lineItems = [
      {
        price: price.id,
        quantity: 1,
      },
    ]
    const paymentSession = await stripe.checkout.sessions.create({
      customer: customerPayment.paymentId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.APP_URL}/account/payment?status=success`,
      cancel_url: `${process.env.APP_URL}/account/payment?status=cancelled`,
      metadata: {
        customerId: customerPayment.customerId,
        type: product.metadata.type,
      },
    })
    res.status(200).json({ data: { sessionId: paymentSession.id } })
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } })
  }
}

export default handler
