import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardEmpty from '../../components/Card/CardEmpty';
import CardFooter from '../../components/Card/CardFooter';
import ContentContainer from '../../components/Content/ContentContainer';
import ContentDivider from '../../components/Content/ContentDivider';
import ContentTitle from '../../components/Content/ContentTitle';
import Meta from '../../components/Meta/Meta';
import SuccessToast from '../../components/Toasts/SuccessToast';
import useInvitations from '../../hooks/data/useInvitations';
import useWorkspaces from '../../hooks/data/useWorkspaces';
import AccountLayout from '../../layouts/AccountLayout';
import api from '../../lib/common/api';
import { useWorkspace } from '../../providers/workspace';

const Welcome = () => {
  const router = useRouter();
  const { data: invitationsData, isLoading: isFetchingInvitations } =
    useInvitations();
  const { data: workspacesData, isLoading: isFetchingWorkspaces } =
    useWorkspaces();
  const { setWorkspace } = useWorkspace();
  const [isSubmitting, setSubmittingState] = useState(false);

  const accept = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/accept`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.custom(() => <SuccessToast text="Accepted invit=ation!" />, {
          position: 'top-right',
        });
      }
    });
  };

  const decline = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/decline`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.custom(() => <SuccessToast text="Declined invitation!" />, {
          position: 'top-right',
        });
      }
    });
  };

  const navigate = (workspace) => {
    setWorkspace(workspace);
    router.replace(`/account/${workspace.slug}`);
  };

  return (
    <AccountLayout>
      <Meta title="Nextacular - Dashboard" />
      <ContentTitle
        title="Nextacular Dashboard"
        subtitle="Start building SaaS platforms in a day"
      />
      <ContentDivider />
      <ContentContainer>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingWorkspaces ? (
            <Card>
              <CardBody />
              <CardFooter />
            </Card>
          ) : workspacesData?.workspaces.length > 0 ? (
            workspacesData.workspaces.map((workspace, index) => (
              <Card key={index}>
                <CardBody title={workspace.name} />
                <CardFooter>
                  <button
                    className="text-blue-600"
                    onClick={() => navigate(workspace)}
                  >
                    Select workspace &rarr;
                  </button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <CardEmpty>Start creating a workspace now</CardEmpty>
          )}
        </div>
      </ContentContainer>
      <ContentDivider />
      <ContentTitle
        title="Workspace Invitations"
        subtitle="Listed here are the invitations received by your account"
      />
      <ContentDivider />
      <ContentContainer>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingInvitations ? (
            <Card>
              <CardBody />
              <CardFooter />
            </Card>
          ) : invitationsData?.invitations.length > 0 ? (
            invitationsData.invitations.map((invitation, index) => (
              <Card key={index}>
                <CardBody
                  title={invitation.workspace.name}
                  subtitle={`You have been invited by ${
                    invitation.invitedBy.name || invitation.invitedBy.email
                  }`}
                />
                <CardFooter>
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={() => accept(invitation.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                    disabled={isSubmitting}
                    onClick={() => decline(invitation.id)}
                  >
                    Decline
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <CardEmpty>
              You haven&apos;t received any invitations to a workspace yet.
            </CardEmpty>
          )}
        </div>
      </ContentContainer>
    </AccountLayout>
  );
};

export default Welcome;
