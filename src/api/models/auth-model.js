import promisePool from '../../utils/database.js';

const findUserByUsername = async (username) => {
  const [rows] = await promisePool.execute(
    `SELECT user_id, name, username, email, role, password
     FROM wsk_users
     WHERE username = ?`,
    [username],
  );
  return rows[0] ?? false;
};

export { findUserByUsername };
