import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { updateName } from '../../../../prisma/services/user';
import { validateUpdateName } from '../../../config/api-validation/index';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await unstable_getServerSession(req, res, authOptions);
    await validateUpdateName(req, res);
    const { name } = req.body;
    await updateName(session.user.userId, name);
    res.status(200).json({ data: { name } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
