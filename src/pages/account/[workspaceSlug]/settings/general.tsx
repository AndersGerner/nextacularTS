import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import isSlug from 'validator/lib/isSlug';

import {
  getWorkspace,
  isWorkspaceOwner,
} from '../../../../../prisma/services/workspace';
import Button from '../../../../components/Button/Button';
import CardBody from '../../../../components/Card/CardBody';
import CardFooter from '../../../../components/Card/CardFooter';
import Card from '../../../../components/Card/Card';
import ContentContainer from '../../../../components/Content/ContentContainer';
import ContentDivider from '../../../../components/Content/ContentDivider';
import ContentTitle from '../../../../components/Content/ContentTitle';
import Meta from '../../../../components/Meta/Meta';
import { AccountLayout } from '../../../../layouts/index';
import api from '../../../../lib/common/api';
import { useWorkspace } from '../../../../providers/workspace';

const General = ({ isTeamOwner, workspace }) => {
  const router = useRouter();
  const { setWorkspace } = useWorkspace();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(workspace.name || '');
  const [slug, setSlug] = useState(workspace.slug || '');
  const validName = name.length > 0 && name.length <= 16;
  const validSlug =
    slug.length > 0 &&
    slug.length <= 16 &&
    isSlug(slug) &&
    isAlphanumeric(slug, undefined, { ignore: '-' });

  const changeName = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api(`/api/workspace/${workspace.slug}/name`, {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Workspace name successfully updated!');
      }
    });
  };

  const changeSlug = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api(`/api/workspace/${workspace.slug}/slug`, {
      body: { slug },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);
      const slug = response?.data?.slug;

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Workspace slug successfully updated!');
        router.replace(`/account/${slug}/settings/general`);
      }
    });
  };

  const copyToClipboard = () => toast.success('Copied to clipboard!');

  const handleNameChange = (event) => setName(event.target.value);

  const handleSlugChange = (event) => setSlug(event.target.value);

  useEffect(() => {
    setName(workspace.name);
    setSlug(workspace.slug);
    setWorkspace(workspace);
  }, [workspace, setWorkspace]);

  return (
    <AccountLayout>
      <Meta title={`Nextacular - ${workspace.name} | Settings`} />
      <ContentTitle
        title="Workspace Information"
        subtitle="Manage your workspace details and information"
      />
      <ContentDivider />
      <ContentContainer>
        <Card>
          <CardBody
            title="Workspace Name"
            subtitle="Used to identify your Workspace on the Dashboard"
          >
            <input
              className="px-3 py-2 border rounded md:w-1/2"
              disabled={isSubmitting || !isTeamOwner}
              onChange={handleNameChange}
              type="text"
              value={name}
            />
          </CardBody>
          <CardFooter>
            <small>Please use 16 characters at maximum</small>
            {isTeamOwner && (
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validName || isSubmitting}
                onClick={changeName}
              >
                Save
              </Button>
            )}
          </CardFooter>
        </Card>
        <Card>
          <CardBody
            title="Workspace Slug"
            subtitle="Used to identify your Workspace on the Dashboard"
          >
            <div className="flex items-center space-x-3">
              <input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting || !isTeamOwner}
                onChange={handleSlugChange}
                type="text"
                value={slug}
              />
              <span className={`text-sm ${slug.length > 16 && 'text-red-600'}`}>
                {slug.length} / 16
              </span>
            </div>
          </CardBody>
          <CardFooter>
            <small>
              Please use 16 characters at maximum. Hyphenated alphanumeric
              characters only.
            </small>
            {isTeamOwner && (
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validSlug || isSubmitting}
                onClick={changeSlug}
              >
                Save
              </Button>
            )}
          </CardFooter>
        </Card>
        <Card>
          <CardBody
            title="Workspace ID"
            subtitle="Used when interacting with APIs"
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className="overflow-x-auto">{workspace.workspaceCode}</span>
              <CopyToClipboard
                onCopy={copyToClipboard}
                text={workspace.workspaceCode}
              >
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </CopyToClipboard>
            </div>
          </CardBody>
        </Card>
      </ContentContainer>
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  let isTeamOwner = false;
  let workspace = null;

  if (session) {
    workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );

    if (workspace) {
      isTeamOwner = isWorkspaceOwner(session.user.email, workspace);
    }
  }

  return {
    props: {
      isTeamOwner,
      workspace,
    },
  };
};

export default General;
