import { InvitationStatus } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    await unstable_getServerSession(req, res, authOptions);
    const { memberId } = req.body;
    await updateStatus(memberId, InvitationStatus.ACCEPTED);
    res.status(200).json({ data: { updatedAt: new Date() } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
