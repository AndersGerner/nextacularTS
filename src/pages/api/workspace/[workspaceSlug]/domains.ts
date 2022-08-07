import { unstable_getServerSession } from 'next-auth';
import { getDomains } from '../../../../../prisma/services/domain';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions);
    const domains = await getDomains(req.query.workspaceSlug);
    res.status(200).json({ data: { domains } });
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
