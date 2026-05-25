import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SANDBOX_PREFIX = '/sandbox/v0';
const pluginDirectory = dirname(fileURLToPath(import.meta.url));
const sandboxApiModuleUrl = pathToFileURL(
  join(pluginDirectory, '../src/lib/runtime/sandbox-api.ts')
).href;

const STAGING_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

/** @returns {import('vite').Plugin} */
export function sandboxApiPlugin() {
  return {
    name: 'sophex-sandbox-api',
    configureServer(server) {
      attachStagingHeaders(server);
      attachSandboxMiddleware(server);
    },
    configurePreviewServer(server) {
      attachStagingHeaders(server);
      attachSandboxMiddleware(server);
    },
  };
}

/** @param {Pick<import('vite').ViteDevServer, 'middlewares'>} server */
function attachStagingHeaders(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url?.startsWith(SANDBOX_PREFIX)) {
      next();
      return;
    }
    Object.entries(STAGING_SECURITY_HEADERS).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
    next();
  });
}

/** @param {Pick<import('vite').ViteDevServer, 'middlewares'>} server */
function attachSandboxMiddleware(server) {
  server.middlewares.use((req, res, next) => {
    if (!req.url?.startsWith(SANDBOX_PREFIX)) {
      next();
      return;
    }

    void handleSandboxHttpRequest(req, res).catch(() => {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(
        JSON.stringify({
          error: {
            code: 'internal_error',
            safeMessage: 'Sandbox API request failed.',
            correlationId: 'corr_sandbox_middleware',
          },
        })
      );
    });
  });
}

/** @param {import('node:http').IncomingMessage} req @param {import('node:http').ServerResponse} res */
async function handleSandboxHttpRequest(req, res) {
  const host = req.headers.host ?? '127.0.0.1';
  const url = `http://${host}${req.url ?? SANDBOX_PREFIX}`;
  const bodyBuffer =
    req.method && !['GET', 'HEAD'].includes(req.method) ? await readIncomingBody(req) : undefined;
  const body = bodyBuffer ? new Uint8Array(bodyBuffer) : undefined;
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === 'string') headers.set(key, value);
    if (Array.isArray(value)) value.forEach((entry) => headers.append(key, entry));
  });

  const { handleSandboxApiRequest } = await import(sandboxApiModuleUrl);
  const response = await handleSandboxApiRequest(
    new Request(url, {
      method: req.method,
      headers,
      body,
    })
  );

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}

/** @param {import('node:http').IncomingMessage} req */
function readIncomingBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(chunks.length > 0 ? Buffer.concat(chunks) : undefined));
    req.on('error', reject);
  });
}
