import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { updateEmail } from '../../../../prisma/services/user';
import { validateUpdateEmail } from '../../../config/api-validation/index';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await unstable_getServerSession(req, res, authOptions);
    await validateUpdateEmail(req, res);
    const { email } = req.body;
    await updateEmail(session.user.userId, email, session.user.email);
    res.status(200).json({ data: { email } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
