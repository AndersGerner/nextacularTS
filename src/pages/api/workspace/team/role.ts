import { TeamRole } from '@prisma/client';

import { unstable_getServerSession } from 'next-auth';
import {
  getMember,
  toggleRole,
} from '../../../../../prisma/services/membership';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    await unstable_getServerSession(req, res, authOptions);
    const { memberId } = req.body;
    const member = getMember(memberId);
    await toggleRole(
      memberId,
      member.teamRole === TeamRole.MEMBER ? TeamRole.OWNER : TeamRole.MEMBER
    );
    res.status(200).json({ data: { updatedAt: new Date() } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
