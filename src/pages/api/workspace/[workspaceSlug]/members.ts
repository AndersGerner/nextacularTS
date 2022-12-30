import type { NextApiRequest, NextApiResponse } from 'next'

import { getMembers } from '../../../../../prisma/services/membership'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  if (method === 'GET') {
    //const session = await unstable_getServerSession(req, res, authOptions);
    const members = await getMembers(req.query.workspaceSlug as string)
    res.status(200).json({ data: { members } })
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } })
  }
}

export default handler
