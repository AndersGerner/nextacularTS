import { unstable_getServerSession } from 'next-auth';
import { remove } from '../../../../../prisma/services/membership';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    await unstable_getServerSession(req, res, authOptions);
    const { memberId } = req.body;
    await remove(memberId);
    res.status(200).json({ data: { deletedAt: new Date() } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
