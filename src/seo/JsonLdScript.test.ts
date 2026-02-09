import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "./JsonLdScript";

test("serializeJsonLd escapes html-breaking characters", () => {
  const json = serializeJsonLd({
    headline: "</script><script>alert('xss')</script>"
  });

  assert.ok(!json.includes("</script>"));
  assert.ok(json.includes("\\u003c/script>"));
});
