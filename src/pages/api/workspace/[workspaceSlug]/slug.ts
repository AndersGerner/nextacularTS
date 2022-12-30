import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { updateSlug } from '../../../../../prisma/services/workspace'
import { validateUpdateWorkspaceSlug } from '../../../../config/api-validation/index'
import { authOptions } from '../../auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  if (method === 'PUT') {
    const session = await unstable_getServerSession(req, res, authOptions)
    const { slug } = req.body
    await validateUpdateWorkspaceSlug(req, res)
    updateSlug(
      session.user.userId,
      session.user.email,
      slug,
      req.query.workspaceSlug as string
    )
      .then((slug) => res.status(200).json({ data: { slug } }))
      .catch((error) =>
        res.status(404).json({ errors: { error: { msg: error.message } } })
      )
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } })
  }
}

export default handler
