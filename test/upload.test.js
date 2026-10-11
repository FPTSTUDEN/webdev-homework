import assert from 'node:assert/strict';
import { access, unlink } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { resolve } from 'node:path';
import app from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('uploads an image and creates a cat record', async () => {
  let uploadedFilePath;

  try {
    const form = new FormData();
    form.set('cat_name', 'Upload test cat');
    form.set('weight', '5');
    form.set('owner', '123');
    form.set('birthdate', '2024-01-01');
    form.set(
      'image',
      new Blob(['test image contents'], { type: 'image/png' }),
      'cat.png',
    );

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
    uploadedFilePath = resolve('uploads', uploadedCat.filename);
    await access(uploadedFilePath);
  } finally {
    if (uploadedFilePath) {
      await unlink(uploadedFilePath);
    }
  }
});
