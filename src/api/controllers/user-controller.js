import {
  addUser,
  deleteUser as deleteUserItem,
  findUserById,
  listAllUsers,
  updateUser,
} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({ message: 'New user added.', result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  const updated = updateUser(req.params.id, req.body);
  if (updated) {
    res.json({ message: 'User item updated.' });
  } else {
    res.sendStatus(404);
  }
};

const deleteUser = (req, res) => {
  const deleted = deleteUserItem(req.params.id);
  if (deleted) {
    res.json({ message: 'User item deleted.' });
  } else {
    res.sendStatus(404);
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser };
