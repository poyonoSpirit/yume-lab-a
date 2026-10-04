import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const loadModule = createRequire(import.meta.url);

function load(file, imports = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require: name => imports[name] ?? loadModule(name),
    process: { env: { GEMINI_API_KEY: 'test-placeholder' } },
    AbortSignal, Error, console: { warn() {} },
    fetch: (...args) => globalThis.fetch(...args),
  });
  return exports;
}
const errors = load('lib/dreamErrors.ts');
const { POST } = load('app/api/dream/route.ts', {
  '@/lib/dreamErrors': errors,
  'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
});
const request = message => new Request('http://localhost/api/dream', {
  method: 'POST', body: JSON.stringify({ message }),
});

// Real installed SDK, mocked HTTP only: no credentials or external requests.
test('Gemini retries temporary failures, preserves error categories, and rejects invalid input', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  let statuses = [];
  globalThis.fetch = async () => {
    calls++;
    const status = statuses.shift() ?? 200;
    return new Response(JSON.stringify(status === 200
      ? { candidates: [{ content: { parts: [{ text: 'hello' }], role: 'model' } }] }
      : { error: { code: status, message: 'mock error', status: 'UNAVAILABLE' } }),
    { status, headers: { 'content-type': 'application/json' } });
  };
  try {
    for (const message of ['', '  ', 42, null]) assert.equal((await POST(request(message))).status, 400);
    assert.equal(calls, 0);
    statuses = [503, 200];
    assert.equal((await POST(request('hello'))).body.reply, 'hello');
    assert.equal(calls, 2);
    for (const [status, code, expectedCalls] of [[503, 'UNAVAILABLE', 3], [429, 'RATE_LIMITED', 3], [403, 'CONFIGURATION', 1]]) {
      calls = 0; statuses = [status, status, status];
      assert.equal((await POST(request('hello'))).body.code, code);
      assert.equal(calls, expectedCalls);
    }
  } finally { globalThis.fetch = original; }
});

test('chat shows specific API errors and releases the sending lock', async () => {
  const original = globalThis.fetch;
  try {
    for (const code of ['RATE_LIMITED', 'UNAVAILABLE', 'TIMEOUT', 'EMPTY_RESPONSE']) {
      const state = [];
      const { useDreamChat: createChatHarness } = load('hooks/useDreamChat.ts', {
        '@/lib/dreamErrors': errors,
        react: {
          useRef: current => ({ current }),
          useState: value => { const i = state.length; state.push(value); return [value, next => { state[i] = next; }]; },
        },
      });
      globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({ code }) });
      const chat = createChatHarness();
      assert.equal(await chat.sendMessage('hello'), false);
      assert.equal(state[2], errors.dreamErrorMessages[code]);
      assert.equal(state[1], false);
      globalThis.fetch = async () => ({ ok: true, json: async () => ({ reply: 'recovered' }) });
      assert.equal(await chat.sendMessage('hello'), true);
      assert.equal(state[0].reply, 'recovered');
    }
  } finally { globalThis.fetch = original; }
});
