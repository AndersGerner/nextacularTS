import { unstable_getServerSession } from 'next-auth';
import { getMembers } from '../../../../../prisma/services/membership';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions);
    const members = await getMembers(req.query.workspaceSlug);
    res.status(200).json({ data: { members } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
