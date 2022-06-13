import { Router } from 'express';
import auth from './api/auth.routes';
import user from './api/user.routes';
import webhook from './api/webhook.routes';

const apiRouter = Router();

apiRouter.use('/api/v1/auth', auth);
apiRouter.use('/api/v1/users', user);
apiRouter.use('/api/v1/webhooks', webhook)

export default apiRouter