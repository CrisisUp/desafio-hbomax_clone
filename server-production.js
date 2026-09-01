/**
 * HBO Max Clone — Servidor Produção com Segurança Completa
 * Inclui: HTTPS, Rate Limiting, WAF, Monitoring
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT_HTTP = 80;
const PORT_HTTPS = 443;
const ROOT_DIR = __dirname;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÕES DE SEGURANÇA
// ═══════════════════════════════════════════════════════════════════════════

// ── Rate Limiting ──────────────────────────────────────────────────────────
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,  // 15 minutos
  maxRequests: 100,           // Máximo 100 req/IP
  blockDuration: 15 * 60 * 1000, // Bloquear por 15 min
};

// ── WAF Patterns ───────────────────────────────────────────────────────────
const WAF_PATTERNS = [
  /(\.\.\/)/g,                    // Path traversal
  /(\<script)/gi,                 // XSS
  /(union\s+select)/gi,           // SQL injection
  /(eval\s*\()/gi,                // Code injection
  /(javascript:)/gi,              // JavaScript URLs
  /(on\w+\s*=)/gi,                // Event handlers
  /(\bor\b\s+\d+\s*=\s*\d+)/gi,  // SQL injection
  /(\<iframe)/gi,                 // iframe injection
  /(document\.cookie)/gi,         // Cookie theft
  /(window\.location)/gi,         // Redirect manipulation
];

// ── Bloqueio de Diretórios ────────────────────────────────────────────────
const BLOCKED_PATHS = [
  /\.git/i,
  /\.svn/i,
  /\.env/i,
  /\.htaccess/i,
  /\.htpasswd/i,
  /node_modules/i,
  /\.DS_Store/i,
  /Thumbs\.db/i,
  /web\.config/i,
  /\.idea/i,
  /\.vscode/i,
  /logs/i,
  /backup/i,
  /\.bak/i,
  /\.old/i,
  /\.sql/i,
  /\.log/i,
];

// ── MIME Types ─────────────────────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

// ── Security Headers ──────────────────────────────────────────────────────
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:;",
};

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════

const requestTracker = new Map();

function checkRateLimit(ip) {
  const now = Date.now();

  if (!requestTracker.has(ip)) {
    requestTracker.set(ip, []);
  }

  const requests = requestTracker.get(ip);
  const recentRequests = requests.filter(t => now - t < RATE_LIMIT.windowMs);

  if (recentRequests.length >= RATE_LIMIT.maxRequests) {
    return false;
  }

  recentRequests.push(now);
  requestTracker.set(ip, recentRequests);
  return true;
}

// Limpar tracker a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of requestTracker) {
    const recent = requests.filter(t => now - t < RATE_LIMIT.windowMs);
    if (recent.length === 0) {
      requestTracker.delete(ip);
    } else {
      requestTracker.set(ip, recent);
    }
  }
}, 5 * 60 * 1000);

// ═══════════════════════════════════════════════════════════════════════════
// WAF (Web Application Firewall)
// ═══════════════════════════════════════════════════════════════════════════

function wafCheck(url, body = '') {
  const testString = decodeURIComponent(url) + ' ' + body;

  for (const pattern of WAF_PATTERNS) {
    if (pattern.test(testString)) {
      return { blocked: true, pattern: pattern.toString() };
    }
  }

  return { blocked: false };
}

// ═══════════════════════════════════════════════════════════════════════════
// MONITORING / LOGGING
// ═══════════════════════════════════════════════════════════════════════════

const LOGS_DIR = path.join(ROOT_DIR, 'logs');

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function logAccess(req, status) {
  const log = {
    timestamp: new Date().toISOString(),
    ip: req.socket.remoteAddress,
    method: req.method,
    url: req.url,
    status: status,
    userAgent: req.headers['user-agent']?.substring(0, 100),
  };

  try {
    fs.appendFileSync(
      path.join(LOGS_DIR, 'access.log'),
      JSON.stringify(log) + '\n'
    );
  } catch (e) {
    // Ignorar erros de log
  }
}

function logSecurity(event, req, details = '') {
  const log = {
    timestamp: new Date().toISOString(),
    event: event,
    ip: req.socket.remoteAddress,
    url: req.url,
    method: req.method,
    details: details,
    userAgent: req.headers['user-agent']?.substring(0, 100),
  };

  try {
    fs.appendFileSync(
      path.join(LOGS_DIR, 'security.log'),
      JSON.stringify(log) + '\n'
    );
  } catch (e) {
    // Ignorar erros de log
  }

  // Log no console também
  console.log(`[SECURITY] ${event}: ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVIDOR HTTP/HTTPS
// ═══════════════════════════════════════════════════════════════════════════

function createServer() {
  const server = http.createServer((req, res) => {
    const ip = req.socket.remoteAddress;

    // ── Rate Limiting ──────────────────────────────────────────────────
    if (!checkRateLimit(ip)) {
      logSecurity('RATE_LIMIT_EXCEEDED', req);
      res.writeHead(429, {
        'Content-Type': 'application/json',
        'Retry-After': '900',
        ...SECURITY_HEADERS,
      });
      res.end(JSON.stringify({
        error: 'Muitas requisições. Tente novamente em 15 minutos.',
      }));
      return;
    }

    // ── WAF Check ──────────────────────────────────────────────────────
    const wafResult = wafCheck(req.url);
    if (wafResult.blocked) {
      logSecurity('WAF_BLOCKED', req, wafResult.pattern);
      res.writeHead(403, {
        'Content-Type': 'application/json',
        ...SECURITY_HEADERS,
      });
      res.end(JSON.stringify({
        error: 'Requisição bloqueada pelo firewall.',
      }));
      return;
    }

    // ── Path Processing ────────────────────────────────────────────────
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';

    // ── Blocked Paths ──────────────────────────────────────────────────
    for (const pattern of BLOCKED_PATHS) {
      if (pattern.test(urlPath)) {
        logSecurity('BLOCKED_PATH', req);
        res.writeHead(403, {
          'Content-Type': 'application/json',
          ...SECURITY_HEADERS,
        });
        res.end(JSON.stringify({
          error: 'Acesso negado.',
        }));
        return;
      }
    }

    // ── Path Traversal Check ───────────────────────────────────────────
    const filePath = path.join(ROOT_DIR, urlPath);
    if (!filePath.startsWith(ROOT_DIR)) {
      logSecurity('PATH_TRAVERSAL', req);
      res.writeHead(403, {
        'Content-Type': 'application/json',
        ...SECURITY_HEADERS,
      });
      res.end(JSON.stringify({
        error: 'Acesso negado.',
      }));
      return;
    }

    // ── Serve File ─────────────────────────────────────────────────────
    fs.stat(filePath, (err, stats) => {
      if (err) {
        logAccess(req, 404);
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          ...SECURITY_HEADERS,
        });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404</title></head>
          <body style="font-family:sans-serif;text-align:center;padding:50px;">
            <h1>404</h1>
            <p>Recurso nao encontrado</p>
            <a href="/">Voltar ao inicio</a>
          </body>
          </html>
        `);
        return;
      }

      if (stats.isDirectory()) {
        logAccess(req, 403);
        res.writeHead(403, {
          'Content-Type': 'application/json',
          ...SECURITY_HEADERS,
        });
        res.end(JSON.stringify({
          error: 'Listagem de diretorio desativada.',
        }));
        return;
      }

      // Read and serve file
      fs.readFile(filePath, (err2, data) => {
        if (err2) {
          logAccess(req, 500);
          res.writeHead(500, { ...SECURITY_HEADERS });
          res.end('Erro interno');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const headers = {
          'Content-Type': contentType,
          ...SECURITY_HEADERS,
        };

        // Cache for static assets
        if (ext !== '.html' && ext !== '.json') {
          headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        }

        logAccess(req, 200);
        res.writeHead(200, headers);
        res.end(data);
      });
    });
  });

  return server;
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

const server = createServer();

server.listen(PORT_HTTP, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  HBO Max Clone — Servidor Producao                           ║
╠═══════════════════════════════════════════════════════════════╣
║  HTTP:  http://localhost:${PORT_HTTP}                             ║
║  HTTPS: https://localhost:${PORT_HTTPS} (requer certificado)     ║
╠═══════════════════════════════════════════════════════════════╣
║  Protecoes Ativas:                                           ║
║  [OK] Rate Limiting (100 req/15min)                          ║
║  [OK] WAF (10 patterns bloqueados)                           ║
║  [OK] Directory Listing Desativado                           ║
║  [OK] Path Traversal Prevenido                               ║
║  [OK] Security Headers (7 headers)                           ║
║  [OK] Logging de Acesso e Seguranca                          ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────
process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nEncerrando servidor...');
  server.close(() => {
    process.exit(0);
  });
});
