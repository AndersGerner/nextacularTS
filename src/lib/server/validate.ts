import { validationResult } from 'express-validator';
import type { NextApiRequest, NextApiResponse } from 'next';

const validate = (validations: any) => {
  return async (req: NextApiRequest, res: NextApiResponse, next) => {
    if (!validations) {
      return next();
    } else {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      const errorObject = {};
      errors.array().forEach((error) => (errorObject[error.param] = error));
      res.status(422).json({ errors: errorObject });
    }
  };
};

export default validate;
