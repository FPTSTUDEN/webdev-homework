import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import app from '../src/app.js';
import { closeDatabase } from '../src/utils/database.js';
import bcrypt from 'bcrypt';

let server;
let baseUrl;
let createdUserId;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
  if (createdUserId) {
    await fetch(`${baseUrl}/api/v1/users/${createdUserId}`, {
      method: 'DELETE',
    });
    createdUserId = undefined;
  }
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await closeDatabase();
});

test('rejects invalid user input before database access', async () => {
  const response = await fetch(`${baseUrl}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '  ',
      username: 'x',
      email: 'not-an-email',
      role: 'root',
      password: 'short',
    }),
  });
  const responseBody = await response.json();

  assert.equal(response.status, 400);
  assert.equal(responseBody.errors.length, 5);
});

test('rejects an empty user update', async () => {
  const response = await fetch(`${baseUrl}/api/v1/users/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const responseBody = await response.json();

  assert.equal(response.status, 400);
  assert.equal(responseBody.errors[0].msg, 'At least one field is required');
});

test('creates, updates, and deletes a user', async () => {
  const createdResponse = await fetch(`${baseUrl}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      password: 'password',
    }),
  });
  const created = await createdResponse.json();

  assert.equal(createdResponse.status, 201);
  assert.ok(created.result.user_id);

  const createdUserResponse = await fetch(
    `${baseUrl}/api/v1/users/${created.result.user_id}`,
  );
  const createdUser = await createdUserResponse.json();
  assert.notEqual(createdUser.password, 'password');
  assert.equal(bcrypt.compareSync('password', createdUser.password), true);

  const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testuser', password: 'password' }),
  });
  const login = await loginResponse.json();
  assert.equal(loginResponse.status, 200);
  assert.ok(login.token);
  assert.equal(login.user.password, undefined);

  const meResponse = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${login.token}` },
  });
  const me = await meResponse.json();
  assert.equal(me.username, 'testuser');
  assert.equal(me.password, undefined);

  const userId = created.result.user_id;
  createdUserId = userId;
  const updatedResponse = await fetch(`${baseUrl}/api/v1/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Updated User' }),
  });
  assert.equal(updatedResponse.status, 200);

  const userResponse = await fetch(`${baseUrl}/api/v1/users/${userId}`);
  const user = await userResponse.json();
  assert.equal(user.name, 'Updated User');

  const deletedResponse = await fetch(`${baseUrl}/api/v1/users/${userId}`, {
    method: 'DELETE',
  });
  assert.equal(deletedResponse.status, 200);

  const missingResponse = await fetch(`${baseUrl}/api/v1/users/${userId}`);
  assert.equal(missingResponse.status, 404);
});
