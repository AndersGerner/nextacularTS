import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import api from '../../../../lib/common/api';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'GET') {
    await unstable_getServerSession(req, res, authOptions);
    const { domain } = req.query;
    const teamId = process.env.VERCEL_TEAM_ID;
    const response = await api(
      `${process.env.VERCEL_API_URL}/v6/domains/${domain}/config${
        teamId ? `?teamId=${teamId}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        },
        method: 'GET',
      }
    );
    const valid = response?.configuredBy ? true : false;
    res.status(200).json({ data: { valid } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
