import { unstable_getServerSession } from 'next-auth';
import { deleteWorkspace } from '../../../../../prisma/services/workspace';
import { authOptions } from '../../auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await unstable_getServerSession(req, res, authOptions);
    deleteWorkspace(
      session.user.userId,
      session.user.email,
      req.query.workspaceSlug as string
    )
      .then((slug) => res.status(200).json({ data: { slug } }))
      .catch((error) =>
        res.status(404).json({ errors: { error: { msg: error.message } } })
      );
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
