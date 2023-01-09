import type { Workspace } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { getInvitation } from '../../../prisma/services/workspace'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import CardBody from '../../components/Card/CardBody'
import CardFooter from '../../components/Card/CardFooter'
import SuccessToast from '../../components/Toasts/SuccessToast'
import api from '../../lib/common/api'
import { JoinRequest } from '../api/workspace/team/join'

const Invite = ({ workspace }: { workspace: Workspace }) => {
  const { data } = useSession()
  const router = useRouter()
  const [isSubmitting, setSubmittingState] = useState(false)

  const join = () => {
    setSubmittingState(true)
    api<JoinRequest>(`/api/workspace/team/join`, {
      body: { workspaceCode: workspace.workspaceCode },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false)

      if (response.errors) {
        if (response.status === 422) {
          router.replace('/account')
        }

        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        toast.custom(() => <SuccessToast text="Accepted invitiation!" />, {
          position: 'top-right',
        })
      }
    })
  }

  return (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10">
      <Toaster position="bottom-center" toastOptions={{ duration: 5000 }} />
      <div className="w-full py-5">
        <div className="relative flex flex-col mx-auto space-y-5">
          <div className="flex flex-col items-center justify-center mx-auto">
            <Card>
              <CardBody
                title={workspace.name}
                subtitle="You are invited to join this workspace."
              />
              <CardFooter>
                {data ? (
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={join}
                  >
                    Join Workspace
                  </Button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500"
                  >
                    Create an account
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

type Invitations = Pick<Workspace, 'id' | 'name' | 'workspaceCode' | 'slug'>

export const getServerSideProps: GetServerSideProps<{
  workspace: Invitations
}> = async (context) => {
  const { code } = context.query as { code: Workspace['inviteCode'] }
  const workspace: Invitations = await getInvitation(code)
  return { props: { workspace } }
}

export default Invite
