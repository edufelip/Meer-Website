import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_MIN_DELAY_MS,
  normalizeMinDelayMs,
  scheduleMinDelayReveal
} from "./minDelay";

test("normalizeMinDelayMs falls back to default when value is missing or invalid", () => {
  assert.equal(normalizeMinDelayMs(undefined), DEFAULT_MIN_DELAY_MS);
  assert.equal(normalizeMinDelayMs(Number.NaN), DEFAULT_MIN_DELAY_MS);
  assert.equal(normalizeMinDelayMs(Number.POSITIVE_INFINITY), DEFAULT_MIN_DELAY_MS);
});

test("normalizeMinDelayMs clamps to non-negative integer", () => {
  assert.equal(normalizeMinDelayMs(-10), 0);
  assert.equal(normalizeMinDelayMs(0), 0);
  assert.equal(normalizeMinDelayMs(250.8), 250);
});

test("scheduleMinDelayReveal uses 250ms by default and invokes callback after timer fires", () => {
  let capturedDelay = -1;
  let scheduledCallback: (() => void) | null = null;
  let readyCalls = 0;

  const setTimer = (callback: () => void, ms: number) => {
    capturedDelay = ms;
    scheduledCallback = callback;
    return 101 as ReturnType<typeof setTimeout>;
  };

  const cleanup = scheduleMinDelayReveal(() => {
    readyCalls += 1;
  }, undefined, setTimer, () => {});

  assert.equal(capturedDelay, DEFAULT_MIN_DELAY_MS);
  assert.equal(readyCalls, 0);

  scheduledCallback?.();
  assert.equal(readyCalls, 1);

  cleanup();
});

test("scheduleMinDelayReveal cleanup clears the same timeout id", () => {
  let clearedId: ReturnType<typeof setTimeout> | null = null;

  const setTimer = () => 202 as ReturnType<typeof setTimeout>;
  const clearTimer = (id: ReturnType<typeof setTimeout>) => {
    clearedId = id;
  };

  const cleanup = scheduleMinDelayReveal(() => {}, 250, setTimer, clearTimer);
  cleanup();

  assert.equal(clearedId, 202);
});
