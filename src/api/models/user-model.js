const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3602,
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@metropolia.fi',
    role: 'admin',
    password: 'secret',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const { name, username, email, role, password } = user;
  const newId = Math.max(...userItems.map((item) => item.user_id)) + 1;

  userItems.unshift({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });

  return { user_id: newId };
};

const updateUser = (id, user) => {
  const index = userItems.findIndex((item) => item.user_id == id);
  if (index === -1) {
    return false;
  }

  userItems[index] = {
    ...userItems[index],
    ...user,
    user_id: userItems[index].user_id,
  };
  return true;
};

const deleteUser = (id) => {
  const index = userItems.findIndex((item) => item.user_id == id);
  if (index === -1) {
    return false;
  }

  userItems.splice(index, 1);
  return true;
};

export { listAllUsers, findUserById, addUser, updateUser, deleteUser };
