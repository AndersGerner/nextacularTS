import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { GetServerSideProps } from 'next'
import { getSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import isEmail from 'validator/lib/isEmail'

import { getUser } from '../../../prisma/services/user'
import Button from '../../components/Button/Button'
import PrimaryButton from '../../components/Button/PrimaryButton'
import RedButton from '../../components/Button/RedButton'
import Card from '../../components/Card/Card'
import CardBody from '../../components/Card/CardBody'
import CardFooter from '../../components/Card/CardFooter'
import ContentContainer from '../../components/Content/ContentContainer'
import ContentDivider from '../../components/Content/ContentDivider'
import ContentTitle from '../../components/Content/ContentTitle'
import DefaultInput from '../../components/Input/DefaultInput'
import Meta from '../../components/Meta/Meta'
import Modal from '../../components/Modal/Modal'
import SuccessToast from '../../components/Toasts/SuccessToast'
import AccountLayout from '../../layouts/AccountLayout'
import api from '../../lib/common/api'

const Settings = ({ user }) => {
  const [email, setEmail] = useState(user.email || '')
  const [isSubmitting, setSubmittingState] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [showModal, setModalState] = useState(false)
  const [userCode] = useState(user.userCode)
  const [verifyEmail, setVerifyEmail] = useState('')
  //const validName = name.length > 0 && name.length <= 32;
  const validEmail = isEmail(email)
  const verifiedEmail = verifyEmail === email

  const copyToClipboard = () =>
    toast.custom(() => <SuccessToast text="Copied to clipboard!" />, {
      position: 'top-right',
    })

  const changeName = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setSubmittingState(true)
    api('/api/user/name', {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false)

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        toast.custom(() => <SuccessToast text="Name successfully updated!" />, {
          position: 'top-right',
        })
      }
    })
  }

  const changeEmail = (event) => {
    event.preventDefault()
    const result = confirm(
      'Are you sure you want to update your email address?'
    )

    if (result) {
      setSubmittingState(true)
      api('/api/user/email', {
        body: { email },
        method: 'PUT',
      }).then((response) => {
        setSubmittingState(false)

        if (response.errors) {
          Object.keys(response.errors).forEach((error) =>
            toast.error(response.errors[error].msg)
          )
        } else {
          toast.custom(
            () => (
              <SuccessToast text="Email successfully updated and signing you out!" />
            ),
            {
              position: 'top-right',
            }
          )
          setTimeout(() => signOut({ callbackUrl: '/auth/login' }), 2000)
        }
      })
    }
  }

  const deactivateAccount = (event) => {
    event.preventDefault()
    setSubmittingState(true)
    api('/api/user', {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false)
      toggleModal()

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        toast.custom(
          () => <SuccessToast text="Account has been deactivated!" />,
          {
            position: 'top-right',
          }
        )
      }
    })
  }

  const handleEmailChange = (event) => setEmail(event.target.value)

  const handleNameChange = (event) => setName(event.target.value)

  const handleVerifyEmailChange = (event) => setVerifyEmail(event.target.value)

  const toggleModal = () => {
    setVerifyEmail('')
    setModalState(!showModal)
  }

  return (
    <AccountLayout>
      <Meta title="Nextacular - Account Settings" />
      <ContentTitle
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account settings"
      />
      <ContentDivider />
      <ContentContainer>
        <Card>
          <form>
            <CardBody
              title="Your Name"
              subtitle="Please enter your full name, or a display name you are comfortable with"
            >
              <DefaultInput
                disabled={isSubmitting}
                onChange={handleNameChange}
                placeholder="Your Name"
                type="text"
                value={name}
              />
            </CardBody>
            <CardFooter>
              <small>Please use 32 characters at maximum</small>
              <PrimaryButton
                title="Save"
                action={changeName}
                disabled={!changeName || isSubmitting}
              />
            </CardFooter>
          </form>
        </Card>
        <Card>
          <form>
            <CardBody
              title="Email Address"
              subtitle="Please enter the email address you want to use to log in with
              Nextacular"
            >
              <DefaultInput
                disabled={isSubmitting}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                type="email"
                value={email}
              />
            </CardBody>
            <CardFooter>
              <small>We will email you to verify the change</small>
              <PrimaryButton
                title="Save"
                action={changeEmail}
                disabled={!validEmail || isSubmitting}
              />
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardBody
            title="Personal Account ID"
            subtitle="Used when interacting with APIs"
          >
            <div className="text-xs flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border dark:bg-black dark:border-gray-700 rounded md:w-1/2">
              <span className="overflow-x-auto">{userCode}</span>
              <CopyToClipboard onCopy={copyToClipboard} text={userCode}>
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </CopyToClipboard>
            </div>
          </CardBody>
        </Card>
        <Card danger>
          <CardBody
            title="Danger Zone"
            subtitle="Permanently remove your Personal Account and all of its contents
              from Nextacular platform"
          />
          <CardFooter>
            <small>
              This action is not reversible, so please continue with caution
            </small>
            <RedButton
              title="Deactivate Personal Account"
              onClick={toggleModal}
            />
          </CardFooter>
          <Modal
            show={showModal}
            title="Deactivate Personal Account"
            toggle={toggleModal}
          >
            <p>
              Your account will be deleted, along with all of its Workspace
              contents.
            </p>
            <p className="px-3 py-2 text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong> This action is not reversible. Please be
              certain.
            </p>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">
                Enter <strong>{user.email}</strong> to continue:
              </label>
              <input
                className="px-3 py-2 border rounded"
                disabled={isSubmitting}
                onChange={handleVerifyEmailChange}
                type="email"
                value={verifyEmail}
              />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!verifiedEmail || isSubmitting}
                onClick={deactivateAccount}
              >
                <span>Deactivate Personal Account</span>
              </Button>
            </div>
          </Modal>
        </Card>
      </ContentContainer>
    </AccountLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const { email, name, userCode } = await getUser(session.user?.userId)
  return {
    props: {
      user: {
        email,
        name,
        userCode,
      },
    },
  }
}

export default Settings
