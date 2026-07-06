import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveStorageMode } from '../lib/dashboard-storage.ts';

test('all github creds present → github', () => {
  assert.equal(
    resolveStorageMode({ GITHUB_TOKEN: 't', GITHUB_REPO_OWNER: 'o', GITHUB_REPO_NAME: 'r' }),
    'github',
  );
});

test('token only → github via default repo target', () => {
  assert.equal(resolveStorageMode({ GITHUB_TOKEN: 't' }), 'github');
});

test('github creds + VERCEL → still github', () => {
  assert.equal(
    resolveStorageMode({ GITHUB_TOKEN: 't', GITHUB_REPO_OWNER: 'o', GITHUB_REPO_NAME: 'r', VERCEL: '1' }),
    'github',
  );
});

test('no env, no VERCEL → local', () => {
  assert.equal(resolveStorageMode({}), 'local');
});

test('VERCEL set, no github creds → readonly', () => {
  assert.equal(resolveStorageMode({ VERCEL: '1' }), 'readonly');
});

test('owner only, no token → local', () => {
  assert.equal(resolveStorageMode({ GITHUB_REPO_OWNER: 'o' }), 'local');
});
