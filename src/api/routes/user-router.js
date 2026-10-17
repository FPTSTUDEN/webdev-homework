import express from 'express';
import { body, param } from 'express-validator';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import { validationErrors } from '../../middlewares/validation.js';

const userFields = {
  name: body('name').trim().isLength({ min: 1, max: 100 }),
  username: body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  email: body('email').trim().isEmail().normalizeEmail(),
  role: body('role').trim().isIn(['user', 'admin']),
  password: body('password').trim().isLength({ min: 8, max: 255 }),
};
const userId = param('id').isInt({ min: 1 }).toInt();

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(
  userFields.name,
  userFields.username,
  userFields.email,
  userFields.role,
  userFields.password,
  validationErrors,
  postUser,
);
userRouter.route('/:id').get(userId, validationErrors, getUserById)
  .put(
    userId,
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('username').optional().trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('role').optional().trim().isIn(['user', 'admin']),
    body('password').optional().trim().isLength({ min: 8, max: 255 }),
    validationErrors,
    putUser,
  )
  .delete(userId, validationErrors, deleteUser);

export default userRouter;
