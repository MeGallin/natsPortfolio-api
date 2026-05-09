const test = require('node:test');
const assert = require('node:assert/strict');
const escapeHtml = require('../utils/EscapeHtml');

test('escapeHtml escapes HTML-sensitive characters', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script> & \'test\''),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;test&#39;',
  );
});

test('escapeHtml safely handles empty values', () => {
  assert.equal(escapeHtml(), '');
  assert.equal(escapeHtml(null), 'null');
});
