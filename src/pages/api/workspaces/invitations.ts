import { getPendingInvitations } from '../../../../prisma/services/membership';
import { validateSession } from '../../../config/api-validation';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await validateSession(req, res);
    const invitations = await getPendingInvitations(session.user.email);
    res.status(200).json({ data: { invitations } });
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
