/** A source that does not answer in this time counts as failed, so the other sources can still show. */
export const REQUEST_TIMEOUT_MS = 12_000;

export const fetchWithTimeout = async (url: string, timeoutMs = REQUEST_TIMEOUT_MS): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};
