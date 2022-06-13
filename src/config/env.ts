import dotenv from 'dotenv';

dotenv.config();

const {
  PORT, NODE_ENV,
  DEV_DATABASE_URL,
  TOKEN_SECRET_KEY,
  TOKEN_EXPIRATION,
  PAYSTACK_SECRET_KEY

} = process.env


export {
  PORT,
  NODE_ENV,
  DEV_DATABASE_URL,
  TOKEN_SECRET_KEY,
  TOKEN_EXPIRATION,
  PAYSTACK_SECRET_KEY

}