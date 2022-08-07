import initMiddleware from '../../lib/server/init-middleware';
import validate from '../../lib/server/validate';

const validateSession = initMiddleware(validate());

export default validateSession;
