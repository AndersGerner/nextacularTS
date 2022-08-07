import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { deactivate } from '../../../../prisma/services/user';
import { authOptions } from '../auth/[...nextauth]';

const ALLOW_DEACTIVATION = false;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (ALLOW_DEACTIVATION) {
      await deactivate(session.user.userId);
    }
    res.status(200).json({ data: { email: session.user.email } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
