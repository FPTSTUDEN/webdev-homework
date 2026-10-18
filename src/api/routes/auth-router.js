import express from 'express';
import { body } from 'express-validator';
import { login, getMe } from '../controllers/auth-controller.js';
import { authentication } from '../../middlewares/authentication.js';
import { validationErrors } from '../../middlewares/validation.js';

const authRouter = express.Router();

const loginValidation = [
  body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('password').trim().isLength({ min: 8, max: 255 }),
  validationErrors,
];

authRouter.post('/login', loginValidation, login);
authRouter.get('/me', authentication, getMe);

export default authRouter;
