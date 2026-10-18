import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../models/auth-model.js';

const publicUser = ({ password, ...user }) => user;

const login = async (req, res) => {
  const user = await findUserByUsername(req.body.username);
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    res.status(401).json({ message: 'Invalid username or password.' });
    return;
  }

  const userWithoutPassword = publicUser(user);
  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({ token, user: userWithoutPassword });
};

const getMe = (req, res) => {
  res.json(req.user);
};

const forwardErrors = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const loginHandler = forwardErrors(login);
const getMeHandler = forwardErrors(getMe);

export { loginHandler as login, getMeHandler as getMe };
