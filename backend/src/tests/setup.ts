/**
 * Test environment setup.
 *
 * Imported first by the suite. ES import bodies execute in declaration order,
 * so everything here runs before `config/env.ts` reads `process.env` — which
 * is the only way to redirect the suite at a throwaway database.
 */

process.env.NODE_ENV = "test";

// Derive a dedicated test database from the configured URI so a run can never
// touch development data. `nexora_destination` becomes `nexora_destination_test`.
const baseUri =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/nexora_destination";

process.env.MONGODB_URI = /_test(\?|$)/.test(baseUri)
  ? baseUri
  : baseUri.replace(/(\/[^/?]+)(\?|$)/, "$1_test$2");

// Keep email firmly off during tests.
process.env.EMAIL_ENABLED = "false";

export const TEST_MONGODB_URI = process.env.MONGODB_URI;
