import { paystack } from '../../controllers/WebhooksController';
import { Router } from 'express';

const webhook = Router();

webhook.post('/paystack', paystack);

export default webhook;