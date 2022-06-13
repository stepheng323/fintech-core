import { Router } from 'express';
import { validateLogin, validateSignup } from '../../middlewares/authValidation';
import { signup, login } from '../../controllers/auth.controller'

const auth = Router();

auth.post('/signup', validateSignup, signup);
auth.post('/login', validateLogin, login);

export default auth;