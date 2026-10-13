import promisePool from '../../utils/database.js';

const userFields = ['name', 'username', 'email', 'role', 'password'];

const selectUserFields = userFields.join(', ');

const listAllUsers = async () => {
  const [rows] = await promisePool.query(
    `SELECT user_id, ${selectUserFields} FROM wsk_users`,
  );
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT user_id, ${selectUserFields} FROM wsk_users WHERE user_id = ?`,
    [id],
  );
  return rows[0] ?? false;
};

const addUser = async (user) => {
  const { name, username, email, role, password } = user;
  const [result] = await promisePool.execute(
    `INSERT INTO wsk_users (${userFields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
    [name, username, email, role, password],
  );

  return result.affectedRows === 0 ? false : { user_id: result.insertId };
};

// Update only the fields supplied by the client, while keeping the user ID unchanged.
const updateUser = async (id, user) => {
  // Keep updates limited to known user columns; this prevents arbitrary request
  // properties from becoming SQL columns.
  const values = Object.fromEntries(
    userFields
      .filter((field) => user[field] !== undefined)
      .map((field) => [field, user[field]]),
  );
  const fields = Object.keys(values);

  // An empty update cannot produce a useful SQL statement.
  if (fields.length === 0) {
    return false;
  }

  // Build one parameterized assignment for every field being changed.
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  const [result] = await promisePool.execute(
    `UPDATE wsk_users SET ${assignments} WHERE user_id = ?`,
    [...fields.map((field) => values[field]), id],
  );

  // MySQL may report zero changed rows when the submitted values are unchanged.
  // Confirm that the user exists so an unchanged valid update still succeeds.
  return result.affectedRows > 0 || Boolean(await findUserById(id));
};

// Delete a user and all cats owned by that user as one atomic operation.
const deleteUser = async (id) => {
  // Use one connection for every query so they all share the same transaction.
  const connection = await promisePool.getConnection();

  try {
    // Start the transaction before checking or deleting any related records.
    await connection.beginTransaction();

    // Lock the user row and verify it exists before changing dependent data.
    const [userRows] = await connection.execute(
      'SELECT user_id FROM wsk_users WHERE user_id = ? FOR UPDATE',
      [id],
    );
    if (userRows.length === 0) {
      await connection.rollback();
      return false;
    }

    // Remove dependent cats first; otherwise the foreign key can reject the user deletion.
    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id],
    );

    // If the user was not removed, undo the dependent-cat deletion as well.
    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    // Make both deletions permanent only after every query has succeeded.
    await connection.commit();
    return true;
  } catch (error) {
    // Any database error restores the user and cat records to their original state.
    await connection.rollback();
    throw error;
  } finally {
    // Always return the connection to the pool, whether the transaction succeeds or fails.
    connection.release();
  }
};

export { listAllUsers, findUserById, addUser, updateUser, deleteUser };
