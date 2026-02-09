import assert from "node:assert/strict";
import test from "node:test";
import { getSiteContentsServerToken } from "./serverAuth";

const ENV_KEY = "SITE_CONTENTS_API_TOKEN";

test("getSiteContentsServerToken returns undefined when missing", () => {
  delete process.env[ENV_KEY];
  assert.equal(getSiteContentsServerToken(), undefined);
});

test("getSiteContentsServerToken trims non-empty token", () => {
  process.env[ENV_KEY] = "  abc123  ";
  assert.equal(getSiteContentsServerToken(), "abc123");
  delete process.env[ENV_KEY];
});
