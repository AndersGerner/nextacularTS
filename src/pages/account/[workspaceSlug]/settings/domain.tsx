import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Workspace } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
import isFQDN from 'validator/lib/isFQDN'
import {
  getWorkspace,
  isWorkspaceOwner,
} from '../../../../../prisma/services/workspace'

import PrimaryButton from '../../../../components/Button/PrimaryButton'
import Card from '../../../../components/Card/Card'
import CardBody from '../../../../components/Card/CardBody'
import CardFooter from '../../../../components/Card/CardFooter'
import DomainCard from '../../../../components/Card/domain'
import ContentContainer from '../../../../components/Content/ContentContainer'
import ContentDivider from '../../../../components/Content/ContentDivider'
import ContentEmpty from '../../../../components/Content/ContentEmpty'
import ContentTitle from '../../../../components/Content/ContentTitle'
import DefaultInput from '../../../../components/Input/DefaultInput'
import Meta from '../../../../components/Meta/Meta'
import SuccessToast from '../../../../components/Toasts/SuccessToast'
import useDomains from '../../../../hooks/data/useDomains'
import AccountLayout from '../../../../layouts/AccountLayout'
import api from '../../../../lib/common/api'

const Domain = ({ isTeamOwner, workspace }) => {
  const { data, isLoading } = useDomains(workspace.slug)
  const [domain, setDomain] = useState('')
  const [isSubmitting, setSubmittingState] = useState(false)
  const validDomainName = isFQDN(domain)

  const addDomain = (event) => {
    event.preventDefault()
    setSubmittingState(true)
    api(`/api/workspace/${workspace.slug}/domain`, {
      body: { domainName: domain },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false)

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        setDomain('')
        toast.custom(
          () => <SuccessToast text="Domain successfully added to workspace!" />,
          {
            position: 'top-right',
          }
        )
      }
    })
  }

  const handleDomainChange = (event) => setDomain(event.target.value)

  const refresh = (domain: string, verified: boolean) => {
    setSubmittingState(true)

    if (verified) {
      mutate(`/api/workspace/domain/check?domain=${domain}`).then(() =>
        setSubmittingState(false)
      )
    } else {
      api(`/api/workspace/${workspace.slug}/domain`, {
        body: { domainName: domain },
        method: 'PUT',
      }).then((response) => {
        setSubmittingState(false)

        if (response.errors) {
          Object.keys(response.errors).forEach((error) =>
            toast.error(response.errors[error].msg)
          )
        } else {
          toast.custom(
            () => <SuccessToast text="Domain successfully verified!" />,
            {
              position: 'top-right',
            }
          )
        }
      })
    }

    return verified
  }

  const remove = (domain: string) => {
    api(`/api/workspace/${workspace.slug}/domain`, {
      body: { domainName: domain },
      method: 'DELETE',
    }).then((response) => {
      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        )
      } else {
        toast.custom(
          () => (
            <SuccessToast text="Domain successfully deleted from workspace!" />
          ),
          {
            position: 'top-right',
          }
        )
      }
    })
  }

  return (
    <AccountLayout>
      <Meta title={`Nextacular - ${workspace.name} | Domains`} />
      <ContentTitle
        title="Subdomain Management"
        subtitle="Manage your subdomain"
      />
      <ContentDivider />
      <ContentContainer>
        <Card>
          <CardBody
            title="Subdomain"
            subtitle="Your subdomain depends on your workspace slug"
          >
            <div className="text-xs flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border dark:bg-black dark:border-gray-700 rounded md:w-1/2">
              <div>
                <strong>{workspace.slug}</strong>
                <span className="pr-3">.{workspace.host}</span>
              </div>
              <Link href={`http://${workspace.hostname}`} target="_blank">
                <ArrowTopRightOnSquareIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </Link>
            </div>
          </CardBody>
        </Card>
      </ContentContainer>
      {isTeamOwner && (
        <>
          <ContentDivider />
          <ContentTitle
            title="Domain Configuration"
            subtitle="Manage your subdomain and domain names"
          />
          <ContentDivider />
          <ContentContainer>
            <Card>
              <form>
                <CardBody
                  title="Add Your Domain"
                  subtitle="This domain is assigned to your current workspace"
                >
                  <DefaultInput
                    disabled={isSubmitting}
                    onChange={handleDomainChange}
                    placeholder="mydomain.com"
                    type="text"
                    value={domain}
                  />
                </CardBody>
                <CardFooter>
                  <span />
                  <PrimaryButton
                    title="Add"
                    action={addDomain}
                    disabled={!validDomainName || isSubmitting}
                  />
                </CardFooter>
              </form>
            </Card>
            {isLoading ? (
              <DomainCard isLoading />
            ) : data?.domains.length > 0 ? (
              data.domains.map((domain, index) => (
                <DomainCard
                  key={index}
                  apex={process.env.NEXT_PUBLIC_VERCEL_IP_ADDRESS}
                  cname={workspace.hostname}
                  isLoading={isSubmitting}
                  domain={domain}
                  refresh={refresh}
                  remove={remove}
                />
              ))
            ) : (
              <ContentEmpty>
                Once you&apos;ve added your domain on Nextacular, that domain
                will show up here
              </ContentEmpty>
            )}
          </ContentContainer>
        </>
      )}
    </AccountLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  isTeamOwner: boolean
  workspace: Workspace | null
}> = async (context) => {
  const session = await getSession(context)
  let isTeamOwner = false
  let workspace = null

  const { workspaceSlug } = context.params as {
    workspaceSlug: Workspace['slug']
  }

  if (session) {
    workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      workspaceSlug
    )

    if (workspace) {
      const { host } = new URL(process.env.APP_URL)
      isTeamOwner = isWorkspaceOwner(session.user.email, workspace)
      workspace.host = host
      workspace.hostname = `${workspace.slug}.${host}`
    }
  }

  return {
    props: {
      isTeamOwner,
      workspace,
    },
  }
}

export default Domain
