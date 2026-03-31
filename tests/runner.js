/**
 * Minimal test runner — no external dependencies.
 * Works with Node 18+ native fetch.
 *
 * Usage:
 *   import { suite, test, assert, report } from '../runner.js';
 */

const PASS  = '\x1b[32m✔\x1b[0m';
const FAIL  = '\x1b[31m✘\x1b[0m';
const SKIP  = '\x1b[33m–\x1b[0m';
const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';
const DIM   = '\x1b[2m';
const RED   = '\x1b[31m';
const YEL   = '\x1b[33m';
const CYA   = '\x1b[36m';

const results = { pass: 0, fail: 0, skip: 0, bugs: [] };

export function suite(name, fn) {
  console.log(`\n${BOLD}${CYA}▸ ${name}${RESET}`);
  return fn();
}

export async function test(name, fn) {
  try {
    await fn();
    results.pass++;
    console.log(`  ${PASS} ${name}`);
  } catch (err) {
    results.fail++;
    const msg = err.message || String(err);
    results.bugs.push({ test: name, reason: msg });
    console.log(`  ${FAIL} ${name}`);
    console.log(`      ${RED}${msg}${RESET}`);
  }
}

export function skip(name) {
  results.skip++;
  console.log(`  ${SKIP} ${DIM}${name} (skipped)${RESET}`);
}

// ─── Assertions ────────────────────────────────────────────────

export const assert = {
  ok(value, msg = 'Expected truthy') {
    if (!value) throw new Error(msg);
  },

  equal(actual, expected, msg) {
    if (actual !== expected)
      throw new Error(msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  },

  includes(arr, item, msg) {
    if (!arr.includes(item))
      throw new Error(msg || `Expected array to include ${JSON.stringify(item)}`);
  },

  isArray(val, msg = 'Expected array') {
    if (!Array.isArray(val)) throw new Error(`${msg} — got ${typeof val}`);
  },

  hasKeys(obj, keys, msg) {
    for (const k of keys) {
      if (!(k in obj)) throw new Error(msg || `Missing key: "${k}" in ${JSON.stringify(obj)}`);
    }
  },

  status(actual, expected, body) {
    if (actual !== expected)
      throw new Error(
        `HTTP ${actual} (expected ${expected}) — ${JSON.stringify(body).slice(0, 200)}`,
      );
  },

  defined(val, msg = 'Expected defined value') {
    if (val === undefined || val === null) throw new Error(msg);
  },
};

// ─── HTTP helpers ───────────────────────────────────────────────

export async function request(url, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  const ct = res.headers.get('content-type') || '';
  try {
    data = ct.includes('application/json') ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  return { status: res.status, data };
}

// ─── Report ─────────────────────────────────────────────────────

export function report() {
  const total = results.pass + results.fail + results.skip;
  console.log('\n' + '─'.repeat(52));
  console.log(`${BOLD}Results${RESET}  ${total} tests  |  ` +
    `${PASS} ${results.pass} passed  ` +
    `${FAIL} ${results.fail} failed  ` +
    `${SKIP} ${results.skip} skipped`);

  if (results.bugs.length > 0) {
    console.log(`\n${BOLD}${RED}Bug Report${RESET}`);
    results.bugs.forEach((bug, i) => {
      console.log(`\n  ${RED}[BUG ${i + 1}]${RESET} ${bug.test}`);
      console.log(`  ${DIM}${bug.reason}${RESET}`);
    });
  }

  console.log('─'.repeat(52) + '\n');

  if (results.fail > 0) process.exit(1);
}
