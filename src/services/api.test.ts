// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { fetchWithTimeout } from './api';

// A real local server: /hang never answers, /ok answers at once.
let server: http.Server;
let base = '';
beforeAll(async () => {
  server = http.createServer((req, res) => {
    if (req.url === '/ok') res.end('{"ok":true}');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => {
  server.closeAllConnections();
  server.close();
});

describe('fetchWithTimeout', () => {
  it('gives up on a source that does not answer', async () => {
    const started = Date.now();
    const error = await fetchWithTimeout(`${base}/hang`, 300).catch((e: unknown) => e);
    expect((error as Error).name).toBe('AbortError');
    const waited = Date.now() - started;
    expect(waited).toBeGreaterThanOrEqual(290);
    expect(waited).toBeLessThan(2000);
  });

  it('returns the answer of a source that answers in time', async () => {
    const response = await fetchWithTimeout(`${base}/ok`, 2000);
    expect(await response.json()).toEqual({ ok: true });
  });

  it('fails cleanly when nothing listens at the address', async () => {
    await expect(fetchWithTimeout('http://127.0.0.1:9/', 2000)).rejects.toThrow();
  });
});
