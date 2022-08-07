import { unstable_getServerSession } from 'next-auth';
import { joinWorkspace } from '../../../../../prisma/services/workspace';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions);
    const { workspaceCode } = req.body;
    joinWorkspace(workspaceCode, session.user.email)
      .then((joinedAt) => res.status(200).json({ data: { joinedAt } }))
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
