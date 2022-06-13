import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { respondWithSuccess, respondWithWarning } from './helpers/responseHandler';
import apiRouter from './routes/';
import helmet from 'helmet';
import { onEmittReversal } from './events/reversal';


const app = express();

const whitelist = [
  'http://localhost:4000',
];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} Not allowed by CORS`));
    }
  },
  credentials: true,
};
app.use(helmet());
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use(apiRouter);
app.get('/', (_req, res) => respondWithSuccess(res, 200, 'Welcome to fintech-core', {}));

interface Error {
  status?: number;
  message: string;
}


// event listeners
onEmittReversal();

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error('Not found') as Error;
  error.status = 404;
  next(error);
});

if (process.env.NODE_ENV === 'development') {
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    return respondWithWarning(res, error.status || 500, error.message, error);
  });
} else {
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    respondWithWarning(res, error.status || 500, 'something bad happened, please try again', null);
  });
}


export default app;
