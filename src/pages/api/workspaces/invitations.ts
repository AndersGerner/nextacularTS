import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getPendingInvitations } from '../../../../prisma/services/membership';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions);
    const invitations = await getPendingInvitations(session.user.email);
    res.status(200).json({ data: { invitations } });
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
