import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { updateName } from '../../../../../prisma/services/workspace';
import { validateUpdateWorkspaceName } from '../../../../config/api-validation/index';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await unstable_getServerSession(req, res, authOptions);
    await validateUpdateWorkspaceName(req, res);
    const { name } = req.body;
    updateName(
      session.user.userId,
      session.user.email,
      name,
      req.query.workspaceSlug as string
    )
      .then((name) => res.status(200).json({ data: { name } }))
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
