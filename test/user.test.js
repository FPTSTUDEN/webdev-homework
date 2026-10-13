import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import app from '../src/app.js';

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

after(() => server.close());

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
