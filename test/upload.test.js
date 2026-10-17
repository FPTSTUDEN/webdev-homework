import assert from 'node:assert/strict';
import { access, rm } from 'node:fs/promises';
import { after, afterEach, before, test } from 'node:test';
import { join } from 'node:path';
import sharp from 'sharp';
import app from '../src/app.js';
import { createThumbnail } from '../src/middlewares/upload.js';
import { closeDatabase } from '../src/utils/database.js';

let server;
let baseUrl;
let createdCatId;
let createdOwnerId;
let uploadedFilePath;
let thumbnailPath;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  if (createdCatId) {
    await fetch(`${baseUrl}/api/v1/cats/${createdCatId}`, {
      method: 'DELETE',
    });
  }
  if (createdOwnerId) {
    await fetch(`${baseUrl}/api/v1/users/${createdOwnerId}`, {
      method: 'DELETE',
    });
  }

  await Promise.all([
    uploadedFilePath && rm(uploadedFilePath, { force: true }),
    thumbnailPath && rm(thumbnailPath, { force: true }),
  ]);

  createdCatId = undefined;
  createdOwnerId = undefined;
  uploadedFilePath = undefined;
  thumbnailPath = undefined;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await closeDatabase();
});

test('rejects a cat upload without an image', async () => {
  const response = await fetch(`${baseUrl}/api/v1/cats`, {
    method: 'POST',
    body: new FormData(),
  });
  const responseBody = await response.json();

  assert.equal(response.status, 400);
  assert.ok(responseBody.errors.length > 0);
});

test('forwards thumbnail generation errors to the error handler', async () => {
  const error = await new Promise((resolve) => {
    createThumbnail(
      { file: { path: 'missing-image-for-thumbnail-test.png' } },
      {},
      resolve,
    );
  });

  assert.ok(error instanceof Error);
});

test('rejects invalid cat fields before creating a record', async () => {
  const form = new FormData();
  form.set('cat_name', ' ');
  form.set('weight', '-1');
  form.set('owner', 'not-a-user-id');
  form.set('birthdate', 'not-a-date');

  const response = await fetch(`${baseUrl}/api/v1/cats`, {
    method: 'POST',
    body: form,
  });
  const responseBody = await response.json();

  assert.equal(response.status, 400);
  assert.equal(responseBody.errors.length, 4);
});

test('rejects an empty cat update', async () => {
  const response = await fetch(`${baseUrl}/api/v1/cats/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const responseBody = await response.json();

  assert.equal(response.status, 400);
  assert.equal(responseBody.errors[0].msg, 'At least one field is required');
});

test('uploads an image and creates a cat record', async () => {
  const ownerResponse = await fetch(`${baseUrl}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Upload Test Owner',
      username: `up${Date.now()}`,
      email: `up${Date.now()}@example.com`,
      role: 'user',
      password: 'password123',
    }),
  });
  const owner = await ownerResponse.json();
  assert.equal(ownerResponse.status, 201);
  createdOwnerId = owner.result.user_id;

  const image = await sharp({
    create: {
      width: 1,
      height: 1,
      channels: 3,
      background: '#ff0000',
    },
  })
    .png()
    .toBuffer();
  const form = new FormData();
  form.set('cat_name', 'Upload test cat');
  form.set('weight', '5');
  form.set('owner', String(createdOwnerId));
  form.set('birthdate', '2024-01-01');
  form.set('image', new Blob([image], { type: 'image/png' }), 'cat.png');

  const response = await fetch(`${baseUrl}/api/v1/cats`, {
    method: 'POST',
    body: form,
  });
  const responseBody = await response.json();

  assert.equal(response.status, 201);
  assert.equal(responseBody.message, 'New cat added.');

  const catsResponse = await fetch(`${baseUrl}/api/v1/cats`);
  const cats = await catsResponse.json();
  const uploadedCat = cats.find(
    (cat) => cat.cat_id === responseBody.result.cat_id,
  );

  assert.ok(uploadedCat?.filename, 'saved cat should have an uploaded filename');
  createdCatId = responseBody.result.cat_id;
  uploadedFilePath = join('uploads', uploadedCat.filename);
  thumbnailPath = join('uploads', `_thumb_${uploadedCat.filename}.png`);
  await access(uploadedFilePath);
  await access(thumbnailPath);

  const thumbnailMetadata = await sharp(thumbnailPath).metadata();
  assert.equal(thumbnailMetadata.width, 160);
  assert.equal(thumbnailMetadata.height, 160);
});
