import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { inviteUsers } from '../../../../../prisma/services/workspace';
import { validateWorkspaceInvite } from '../../../../config/api-validation/index';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions);
    await validateWorkspaceInvite(req, res);
    const { members } = req.body;
    await inviteUsers(
      session.user.userId,
      session.user.email,
      members,
      req.query.workspaceSlug as string
    )
      .then((members) => res.status(200).json({ data: { members } }))
      .catch((error) =>
        res.status(404).json({ errors: { error: { msg: error.message } } })
      );
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
