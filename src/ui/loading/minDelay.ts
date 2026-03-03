export const DEFAULT_MIN_DELAY_MS = 250;

type SetTimer = (callback: () => void, ms: number) => ReturnType<typeof setTimeout>;
type ClearTimer = (id: ReturnType<typeof setTimeout>) => void;

export function normalizeMinDelayMs(value?: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_MIN_DELAY_MS;
  }

  return Math.max(0, Math.trunc(value ?? DEFAULT_MIN_DELAY_MS));
}

export function scheduleMinDelayReveal(
  onReady: () => void,
  minDelayMs?: number,
  setTimer: SetTimer = setTimeout,
  clearTimer: ClearTimer = clearTimeout
): () => void {
  const timeoutId = setTimer(onReady, normalizeMinDelayMs(minDelayMs));
  return () => clearTimer(timeoutId);
}
