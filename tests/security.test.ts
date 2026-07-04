import { test } from 'node:test';
import assert from 'node:assert/strict';
import { constantTimeEqual, isSafeLinkHref, isSafeEmbedUrl, renderRichText } from '../lib/security.ts';

test('constantTimeEqual', () => {
  assert.equal(constantTimeEqual('secret', 'secret'), true);
  assert.equal(constantTimeEqual('secret', 'Secret'), false);
  assert.equal(constantTimeEqual('secret', 'secret '), false);
  assert.equal(constantTimeEqual('', ''), true);
});

test('isSafeLinkHref allows site-relative, http(s), mailto', () => {
  assert.equal(isSafeLinkHref('/work/aurora'), true);
  assert.equal(isSafeLinkHref('#contact'), true);
  assert.equal(isSafeLinkHref('https://www.linkedin.com/in/cherry-phan-b03857395/'), true);
  assert.equal(isSafeLinkHref('mailto:hi@example.com'), true);
});

test('isSafeLinkHref rejects dangerous schemes', () => {
  assert.equal(isSafeLinkHref('javascript:alert(1)'), false);
  assert.equal(isSafeLinkHref('data:text/html,x'), false);
  assert.equal(isSafeLinkHref('//evil.com'), false);
  assert.equal(isSafeLinkHref('vbscript:x'), false);
});

test('isSafeEmbedUrl allowlist', () => {
  assert.equal(isSafeEmbedUrl('https://www.youtube.com/embed/abc123'), true);
  assert.equal(isSafeEmbedUrl('https://www.youtube-nocookie.com/embed/abc123'), true);
  assert.equal(isSafeEmbedUrl('https://player.vimeo.com/video/123'), true);
  assert.equal(isSafeEmbedUrl('https://www.figma.com/embed?embed_host=x'), true);
  assert.equal(isSafeEmbedUrl('http://www.youtube.com/embed/abc'), false);
  assert.equal(isSafeEmbedUrl('https://www.youtube.com/watch?v=abc'), false);
  assert.equal(isSafeEmbedUrl('https://evil.com/embed/abc'), false);
  assert.equal(isSafeEmbedUrl('not a url'), false);
});

test('renderRichText sanitizes scripts, keeps formatting', () => {
  const html = renderRichText('**bold** and *italic*\n\n<script>alert(1)</script><img src=x onerror=alert(1)>');
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /<em>italic<\/em>/);
  assert.doesNotMatch(html, /<script/);
  assert.doesNotMatch(html, /onerror/);
});
