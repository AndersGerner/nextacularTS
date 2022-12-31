import formatDistance from 'date-fns/formatDistance'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getPayment } from '../../../prisma/services/customer'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import CardBody from '../../components/Card/CardBody'
import CardFooter from '../../components/Card/CardFooter'
import ContentContainer from '../../components/Content/ContentContainer'
import ContentDivider from '../../components/Content/ContentDivider'
import ContentEmpty from '../../components/Content/ContentEmpty'
import ContentTitle from '../../components/Content/ContentTitle'
import Meta from '../../components/Meta/Meta'
import Modal from '../../components/Modal/Modal'
import AccountLayout from '../../layouts/AccountLayout'
import { redirectToCheckout } from '../../lib/client/stripe'
import api from '../../lib/common/api'
import { getInvoices, getProducts } from '../../lib/server/stripe'

const Billing = ({ invoices, products }) => {
  const [isSubmitting, setSubmittingState] = useState(false)
  const [showModal, setModalVisibility] = useState(false)

  const subscribe = (priceId) => {
    setSubmittingState(true)
    api(`/api/payments/subscription/${priceId}`, {
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false)

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        ;(async () => redirectToCheckout(response.data.sessionId))()
      }
    })
  }

  const toggleModal = () => setModalVisibility(!showModal)

  return (
    <AccountLayout>
      <Meta title="Nextacular - Billing" />
      <ContentTitle
        title="Billing"
        subtitle="Manage your billing and preferences"
      />
      <ContentDivider />
      <ContentContainer>
        <Card>
          <CardBody
            title="Upgrade Plan"
            subtitle="You are currently under the&nbsp; FREE plan"
          >
            <p className="p-3 text-sm border rounded">
              Personal accounts cannot be upgraded and will remain free forever.
              In order to use the platform for professional purposes or work
              with a team, get started by creating a team or contacting sales.
            </p>
          </CardBody>
          <CardFooter>
            <small>You will be redirected to the payment page</small>
            <Button
              className="text-white bg-blue-600 hover:bg-blue-500"
              disabled={isSubmitting}
              onClick={toggleModal}
            >
              Upgrade
            </Button>
          </CardFooter>
        </Card>
        <Modal
          show={showModal}
          title="Upgrade Subscription"
          toggle={toggleModal}
        >
          <div className="space-y-0 text-sm text-gray-600">
            <p>You are currently under the FREE plan</p>
          </div>
          <div className="flex space-x-5">
            {products.map((product, index) => (
              <Card key={index}>
                <CardBody title={product.name} subtitle={product.description}>
                  <h3 className="text-4xl font-bold">
                    ${Number(product.prices.unit_amount / 100).toFixed(2)}
                  </h3>
                </CardBody>
                <CardFooter>
                  <Button
                    className="w-full text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={() => subscribe(product.prices.id)}
                  >
                    {isSubmitting
                      ? 'Redirecting...'
                      : `Upgrade to ${product.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Modal>
      </ContentContainer>
      <ContentDivider />
      <ContentTitle
        title="Invoices"
        subtitle="View and download invoices you may need"
      />
      <ContentDivider />
      {invoices.length > 0 ? (
        <ContentContainer>
          <table className="table-auto">
            <thead>
              <tr className="text-left">
                <th>Invoice Number</th>
                <th>Created</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} className="text-sm hover:bg-gray-100">
                  <td className="px-3 py-5">
                    <Link
                      href={invoice.hosted_invoice_url}
                      className="text-blue-600"
                      target="_blank"
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="py-5">
                    {formatDistance(
                      new Date(invoice.created * 1000),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </td>
                  <td className="py-5">{invoice.status}</td>
                  <td className="py-5">
                    <Link
                      href={invoice.hosted_invoice_url}
                      className="text-blue-600"
                      target="_blank"
                    >
                      &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ContentContainer>
      ) : (
        <ContentEmpty>
          Once you&apos;ve paid for something on Nextacular, invoices will show
          up here
        </ContentEmpty>
      )}
    </AccountLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const customerPayment = await getPayment(session.user?.email)
  const [invoices, products] = await Promise.all([
    getInvoices(customerPayment?.paymentId),
    getProducts(),
  ])
  return {
    props: {
      invoices,
      products,
    },
  }
}

export default Billing
