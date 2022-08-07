import { unstable_getServerSession } from 'next-auth/next';
import { getWorkspaces } from '../../../../prisma/services/workspace';
import { authOptions } from '../auth/[...nextauth]';
const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions);
    const workspaces = await getWorkspaces(
      session.user.userId,
      session.user.email
    );
    res.status(200).json({ data: { workspaces } });
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
