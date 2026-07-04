import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signSession, verifySessionToken } from '../lib/admin-auth-token.ts';

test('roundtrip: valid signature within expiry verifies', () => {
  const token = signSession(Date.now() + 10000, 's');
  assert.equal(verifySessionToken(token, 's'), true);
});

test('tampered signature fails', () => {
  const token = signSession(Date.now() + 10000, 's');
  const [exp] = token.split('.');
  const tampered = `${exp}.${'0'.repeat(64)}`;
  assert.equal(verifySessionToken(tampered, 's'), false);
});

test('expired token fails', () => {
  const token = signSession(Date.now() - 1000, 's');
  assert.equal(verifySessionToken(token, 's'), false);
});

test('malformed tokens fail', () => {
  assert.equal(verifySessionToken('x', 's'), false);
  assert.equal(verifySessionToken('', 's'), false);
  assert.equal(verifySessionToken('1.2.3', 's'), false);
  assert.equal(verifySessionToken('abc.def', 's'), false);
});

test('wrong secret fails', () => {
  const token = signSession(Date.now() + 10000, 's');
  assert.equal(verifySessionToken(token, 'other'), false);
});
