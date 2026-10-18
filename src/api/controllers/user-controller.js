import bcrypt from 'bcrypt';
import {
  addUser,
  deleteUser as deleteUserItem,
  findUserById,
  listAllUsers,
  updateUser,
} from '../models/user-model.js';

const getUser = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await addUser(req.body);
  if (result?.user_id) {
    res.status(201);
    res.json({ message: 'New user added.', result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  const updated = await updateUser(req.params.id, req.body);
  if (updated) {
    res.json({ message: 'User item updated.' });
  } else {
    res.sendStatus(404);
  }
};

const deleteUser = async (req, res) => {
  const deleted = await deleteUserItem(req.params.id);
  if (deleted) {
    res.json({ message: 'User item deleted.' });
  } else {
    res.sendStatus(404);
  }
};

const forwardErrors = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res)).catch(next);

const getUserHandler = forwardErrors(getUser);
const getUserByIdHandler = forwardErrors(getUserById);
const postUserHandler = forwardErrors(postUser);
const putUserHandler = forwardErrors(putUser);
const deleteUserHandler = forwardErrors(deleteUser);

export {
  getUserHandler as getUser,
  getUserByIdHandler as getUserById,
  postUserHandler as postUser,
  putUserHandler as putUser,
  deleteUserHandler as deleteUser,
};
