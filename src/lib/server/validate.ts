import { ValidationChain, validationResult } from 'express-validator'
import type { NextApiRequest, NextApiResponse } from 'next'

const validate = (validations: ValidationChain[]) => {
  return async (req: NextApiRequest, res: NextApiResponse, next) => {
    if (!validations) {
      return next()
    } else {
      await Promise.all(validations.map((validation) => validation.run(req)))
      const errors = validationResult(req)

      if (errors.isEmpty()) {
        return next()
      }

      const errorObject = {}
      errors.array().forEach((error) => (errorObject[error.param] = error))
      res.status(422).json({ errors: errorObject })
    }
  }
}

export default validate
