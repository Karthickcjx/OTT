/**
 * API Test Entry Point
 *
 * Run with:  node tests/api/index.js
 * Requires:  Node 18+, Spring Boot running on :8080, MySQL running
 */

import { report } from '../runner.js';
import { runAuthTests, tokens } from './auth.test.js';
import { runContentTests } from './content.test.js';
import { runWatchlistTests } from './watchlist.test.js';
import { runAdminTests } from './admin.test.js';
import { runErrorTests } from './errors.test.js';
import { BASE_URL, TIMEOUT_MS } from '../config.js';

const BOLD  = '\x1b[1m';
const CYA   = '\x1b[36m';
const RESET = '\x1b[0m';
const DIM   = '\x1b[2m';

async function checkBackendReachable() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    await fetch(`${BASE_URL}/auth/me`, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`\n${BOLD}${CYA}StreamVault — API Test Suite${RESET}`);
  console.log(`${DIM}Target: ${BASE_URL}${RESET}`);
  console.log(`${DIM}Date  : ${new Date().toISOString()}${RESET}`);

  const reachable = await checkBackendReachable();
  if (!reachable) {
    console.error('\n\x1b[31m✘ Backend is not reachable at ' + BASE_URL + '\x1b[0m');
    console.error('  Start Spring Boot with:  cd backend && mvn spring-boot:run\n');
    process.exit(1);
  }

  // 1. Auth tests first — they populate `tokens` shared object
  await runAuthTests();

  // Guard: if auth tests failed to produce tokens, abort early
  if (!tokens.admin || !tokens.user) {
    console.error('\n\x1b[31m✘ Auth tests failed to produce tokens. Aborting remaining suites.\x1b[0m\n');
    report();
    return;
  }

  // 2. Content (movies + series) — requires both tokens
  await runContentTests(tokens);

  // 3. Watchlist — requires both tokens + creates its own movie
  await runWatchlistTests(tokens);

  // 4. Admin-specific endpoints
  await runAdminTests(tokens);

  // 5. Error handling edge cases
  await runErrorTests(tokens);

  report();
}

main().catch((err) => {
  console.error('\n\x1b[31mUnhandled error in test runner:\x1b[0m', err);
  process.exit(1);
});
