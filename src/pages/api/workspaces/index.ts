import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { getWorkspaces } from '../../../../prisma/services/workspace'
import { authOptions } from '../auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  if (method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions)
    console.log(session.user)

    const workspaces = await getWorkspaces(
      session.user.userId,
      session.user.email
    )
    res.status(200).json({ data: { workspaces } })
  } else {
    res.status(405).json({ error: `${method} method unsupported` })
  }
}

export default handler
