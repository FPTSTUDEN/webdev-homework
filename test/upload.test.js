import assert from 'node:assert/strict';
import { access, rm } from 'node:fs/promises';
import { after, afterEach, before, test } from 'node:test';
import { join } from 'node:path';
import sharp from 'sharp';
import app from '../src/app.js';

let server;
let baseUrl;
let createdCatId;
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

  await Promise.all([
    uploadedFilePath && rm(uploadedFilePath, { force: true }),
    thumbnailPath && rm(thumbnailPath, { force: true }),
  ]);

  createdCatId = undefined;
  uploadedFilePath = undefined;
  thumbnailPath = undefined;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('uploads an image and creates a cat record', async () => {
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
  form.set('owner', '123');
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
