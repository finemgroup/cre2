import { createServer } from 'node:http';

import { handleSandboxApiRequest } from '../src/lib/runtime/sandbox-api';

const PORT = Number(process.env.SOPHEX_SANDBOX_PORT ?? 8787);
const HOST = process.env.SOPHEX_SANDBOX_HOST ?? '127.0.0.1';

createServer((req, res) => {
  void handleRequest(req, res).catch(() => {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        error: {
          code: 'internal_error',
          safeMessage: 'Sandbox API request failed.',
          correlationId: 'corr_sandbox_server',
        },
      })
    );
  });
}).listen(PORT, HOST, () => {
  console.log(`Sophex sandbox API listening on http://${HOST}:${PORT}/sandbox/v0`);
});

async function handleRequest(
  req: import('node:http').IncomingMessage,
  res: import('node:http').ServerResponse
): Promise<void> {
  const url = req.url ?? '/';
  if (!url.startsWith('/sandbox/v0')) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: { code: 'not_found', safeMessage: 'Use /sandbox/v0 routes.' } }));
    return;
  }

  const body =
    req.method && !['GET', 'HEAD'].includes(req.method) ? await readBody(req) : undefined;
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === 'string') headers.set(key, value);
    if (Array.isArray(value)) value.forEach((entry) => headers.append(key, entry));
  });

  const response = await handleSandboxApiRequest(
    new Request(`http://${HOST}:${PORT}${url}`, {
      method: req.method,
      headers,
      body,
    })
  );

  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function readBody(req: import('node:http').IncomingMessage): Promise<Buffer | undefined> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(chunks.length > 0 ? Buffer.concat(chunks) : undefined));
    req.on('error', reject);
  });
}
