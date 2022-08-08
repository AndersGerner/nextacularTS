import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { getInvitation } from '../../../prisma/services/workspace';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import api from '../../lib/common/api';

const Invite = ({ workspace }) => {
  const { data } = useSession();
  const router = useRouter();
  const [isSubmitting, setSubmittingState] = useState(false);

  const join = () => {
    setSubmittingState(true);
    api(`/api/workspace/team/join`, {
      body: { workspaceCode: workspace.workspaceCode },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        if (response.status === 422) {
          router.replace('/account');
        }

        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Accepted invitation!');
      }
    });
  };

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
                  <Link href="/auth/login">
                    <a className="flex items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500">
                      Create an account
                    </a>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps = async (context) => {
  const { code } = context.query;
  const workspace = await getInvitation(code);
  return { props: { workspace } };
};

export default Invite;
