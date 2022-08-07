import type { NextApiRequest, NextApiResponse } from 'next';

const initMiddleware = (middleware) => {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) =>
        result instanceof Error ? reject(result) : resolve(result)
      );
    });
};

export default initMiddleware;
