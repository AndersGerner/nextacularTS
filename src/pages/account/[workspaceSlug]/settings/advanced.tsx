import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { getSession } from 'next-auth/react'
import {
  getWorkspace,
  isWorkspaceCreator,
} from '../../../../../prisma/services/workspace'
import Button from '../../../../components/Button/Button'
import RedButton from '../../../../components/Button/RedButton'
import Card from '../../../../components/Card/Card'
import CardBody from '../../../../components/Card/CardBody'
import CardFooter from '../../../../components/Card/CardFooter'
import ContentContainer from '../../../../components/Content/ContentContainer'
import ContentDivider from '../../../../components/Content/ContentDivider'
import ContentTitle from '../../../../components/Content/ContentTitle'
import Meta from '../../../../components/Meta/Meta'
import Modal from '../../../../components/Modal/Modal'
import SuccessToast from '../../../../components/Toasts/SuccessToast'
import AccountLayout from '../../../../layouts/AccountLayout'
import api from '../../../../lib/common/api'
import { useWorkspace } from '../../../../providers/workspace'
import { GetServerSideProps } from 'next'
import { Workspace } from '@prisma/client'

const Advanced = ({ isCreator }) => {
  const { setWorkspace, workspace } = useWorkspace()
  const router = useRouter()
  const [isSubmitting, setSubmittingState] = useState(false)
  const [showModal, setModalState] = useState(false)
  const [verifyWorkspace, setVerifyWorkspace] = useState('')
  const verifiedWorkspace = verifyWorkspace === workspace?.slug

  const handleVerifyWorkspaceChange = (event) =>
    setVerifyWorkspace(event.target.value)

  const deleteWorkspace = () => {
    setSubmittingState(true)
    api(`/api/workspace/${workspace.slug}`, {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false)

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        toggleModal()
        setWorkspace(null)
        router.replace('/account')
        toast.custom(
          () => <SuccessToast text="Workspace has been deleted!" />,
          {
            position: 'top-right',
          }
        )
      }
    })
  }

  const toggleModal = () => {
    setVerifyWorkspace('')
    setModalState(!showModal)
  }

  return (
    <AccountLayout>
      <Meta title={`Nextacular - ${workspace?.name} | Advanced Settings`} />
      <ContentTitle
        title="Advanced Workspace Settings"
        subtitle="Manage your workspace settings"
      />
      <ContentDivider />
      <ContentContainer>
        <Card danger>
          <CardBody
            title="Delete Workspace"
            subtitle="The workspace will be permanently deleted, including its contents and domains. This action is irreversible and can not be undone."
          />
          <CardFooter>
            <small className={isCreator && 'text-red-600'}>
              {isCreator
                ? 'This action is not reversible. Please be certain.'
                : 'Please contact your team creator for the deletion of your workspace.'}
            </small>
            {isCreator && (
              <RedButton
                title={isSubmitting ? 'Deleting' : 'Delete'}
                onClick={toggleModal}
                disabled={isSubmitting}
              />
            )}
          </CardFooter>
          <Modal
            show={showModal}
            title="Deactivate Workspace"
            toggle={toggleModal}
          >
            <p className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-200">
                Your workspace will be deleted, along with all of its contents.
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-200">
                Data associated with this workspace can&apos;t be accessed by
                team members.
              </span>
            </p>
            <p className="px-3 py-2 text-sm text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong> This action is not reversible. Please be
              certain.
            </p>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-200 mb-2">
                Enter <strong>{workspace?.slug}</strong> to continue:
              </label>
              <input
                className="px-3 py-2 h-9 border rounded text-sm focus:outline-none focus:border-gray-800 dark:bg-black dark:border-gray-700 dark:focus:border-gray-400"
                disabled={isSubmitting}
                onChange={handleVerifyWorkspaceChange}
                type="email"
                value={verifyWorkspace}
              />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white text-sm bg-red-600 border border-red-500 hover:bg-transparent hover:text-red-500"
                disabled={!verifiedWorkspace || isSubmitting}
                onClick={deleteWorkspace}
              >
                <span>Delete Workspace</span>
              </Button>
            </div>
          </Modal>
        </Card>
      </ContentContainer>
    </AccountLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  isCreator: boolean
}> = async (context) => {
  const session = await getSession(context)
  let isCreator = false

  const { workspaceSlug } = context.params as {
    workspaceSlug: Workspace['slug']
  }

  if (session) {
    const workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      workspaceSlug
    )
    isCreator = isWorkspaceCreator(session.user.userId, workspace.creatorId)
  }

  return { props: { isCreator } }
}

export default Advanced
