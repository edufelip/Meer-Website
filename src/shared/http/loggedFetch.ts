type LoggedFetchContext = {
  label?: string;
};

let requestSequence = 0;
const MAX_BODY_LOG_LENGTH = 4000;

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Date.now();
}

function asUrlString(input: string | URL | Request): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function resolveMethod(input: string | URL | Request, init?: RequestInit): string {
  if (typeof init?.method === "string" && init.method.trim()) {
    return init.method.toUpperCase();
  }

  if (input instanceof Request && input.method) {
    return input.method.toUpperCase();
  }

  return "GET";
}

function shouldLog(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logStart(id: number, method: string, url: string, context?: LoggedFetchContext) {
  const scope = context?.label ? ` ${context.label}` : "";
  console.info(`[http:${id}] ->${scope} ${method} ${url}`);
}

function logSuccess(
  id: number,
  status: number,
  durationMs: number,
  responseBodyPreview: string | null,
  context?: LoggedFetchContext
) {
  const scope = context?.label ? ` ${context.label}` : "";
  console.info(`[http:${id}] <-${scope} ${status} ${durationMs.toFixed(1)}ms`);
  if (responseBodyPreview !== null) {
    console.info(`[http:${id}] <<${scope} body ${responseBodyPreview}`);
  }
}

function logFailure(id: number, error: unknown, durationMs: number, context?: LoggedFetchContext) {
  const scope = context?.label ? ` ${context.label}` : "";
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[http:${id}] xx${scope} ${durationMs.toFixed(1)}ms ${message}`);
}

function truncateBody(value: string): string {
  if (value.length <= MAX_BODY_LOG_LENGTH) {
    return value;
  }

  return `${value.slice(0, MAX_BODY_LOG_LENGTH)}... [truncated ${value.length - MAX_BODY_LOG_LENGTH} chars]`;
}

async function readResponseBodyPreview(response: Response): Promise<string | null> {
  try {
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const isTextual =
      contentType.includes("application/json") ||
      contentType.includes("text/") ||
      contentType.includes("application/problem+json") ||
      contentType.includes("application/xml") ||
      contentType.includes("application/x-www-form-urlencoded");

    if (!isTextual) {
      return `[non-text body: ${contentType || "unknown content-type"}]`;
    }

    const raw = await response.clone().text();
    if (!raw.trim()) {
      return "[empty body]";
    }

    if (contentType.includes("application/json") || contentType.includes("application/problem+json")) {
      try {
        const parsed = JSON.parse(raw);
        return truncateBody(JSON.stringify(parsed));
      } catch {
        return truncateBody(raw);
      }
    }

    return truncateBody(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `[failed to read body: ${message}]`;
  }
}

export async function loggedFetch(
  input: string | URL | Request,
  init?: RequestInit,
  context?: LoggedFetchContext
): Promise<Response> {
  if (!shouldLog()) {
    return fetch(input, init);
  }

  const id = ++requestSequence;
  const startedAt = nowMs();
  const url = asUrlString(input);
  const method = resolveMethod(input, init);

  logStart(id, method, url, context);

  try {
    const response = await fetch(input, init);
    const responseBodyPreview = await readResponseBodyPreview(response);
    logSuccess(id, response.status, nowMs() - startedAt, responseBodyPreview, context);
    return response;
  } catch (error) {
    logFailure(id, error, nowMs() - startedAt, context);
    throw error;
  }
}
