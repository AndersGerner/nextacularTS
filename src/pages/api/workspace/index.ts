import slugify from 'slugify'

import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { createWorkspace } from '../../../../prisma/services/workspace'
import { validateCreateWorkspace } from '../../../config/api-validation/index'
import { authOptions } from '../auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  if (method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions)
    await validateCreateWorkspace(req, res)
    const { name } = req.body
    const slug = slugify(name.toLowerCase())
    await createWorkspace(session.user.userId, session.user.email, name, slug)
    res.status(200).json({ data: { name, slug } })
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } })
  }
}

export default handler
