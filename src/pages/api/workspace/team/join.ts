import { Workspace } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { joinWorkspace } from '../../../../../prisma/services/workspace'
import isRequestBodyValid from '../../../../lib/common/guards'
import { authOptions } from '../../auth/[...nextauth]'

export interface JoinRequest {
  workspaceCode: Workspace['workspaceCode']
}

type JoinResponse =
  | {
      data: { joinedAt: Date }
    }
  | { errors: { error: { msg: string } } }

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<JoinResponse>
) => {
  const { method } = req

  if (method === 'POST') {
    try {
      if (isRequestBodyValid<JoinRequest>(req.body)) {
        const session = await unstable_getServerSession(req, res, authOptions)
        const { workspaceCode } = req.body
        joinWorkspace(workspaceCode, session.user.email)
          .then((joinedAt) => res.status(200).json({ data: { joinedAt } }))
          .catch((error) =>
            res.status(404).json({ errors: { error: { msg: error.message } } })
          )
      }
    } catch (error) {
      res.status(404).json({ errors: { error: { msg: error.message } } })
    }
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } })
  }
}

export default handler
