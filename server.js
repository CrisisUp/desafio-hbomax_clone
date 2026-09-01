/**
 * HBO Max Clone — Servidor com Segurança
 * Node.js server com proteções contra exposição de dados sensíveis
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ROOT_DIR = __dirname;

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

// ── Bloqueio de Diretórios Sensíveis ──────────────────────────────────────
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
];

// ── Rate Limiting (dev) ───────────────────────────────────────────────────
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,  // 15 minutos
  maxRequests: 100,           // Máximo 100 req/IP
};

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

// ── Security Headers ──────────────────────────────────────────────────────
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  // Headers de segurança adicionais
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';",
};

// ── Função para servir arquivos ────────────────────────────────────────────
function serveFile(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Arquivo não existe — retornar 404 (NÃO servir index.html)
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Não Encontrado</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>404</h1>
          <p>Recurso não encontrado</p>
          <a href="/">Voltar ao início</a>
        </body>
        </html>
      `);
      return;
    }

    // Adicionar headers de segurança
    const headers = {
      'Content-Type': contentType,
      ...SECURITY_HEADERS,
    };

    // Cache para assets estáticos
    if (ext !== '.html' && ext !== '.json') {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    res.writeHead(statusCode, headers);
    res.end(data);
  });
}

// ── Função para listar diretório (APENAS para debug) ───────────────────────
function serveDirectoryIndex(res, dirPath, urlPath) {
  // SEMPRE bloquear listagem de diretório em produção
  res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>403 Acesso Negado</title></head>
    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>403</h1>
      <p>Listagem de diretório desativada por segurança</p>
      <a href="/">Voltar ao início</a>
    </body>
    </html>
  `);
}

// ── Criar Servidor ─────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;

  // ── Rate Limiting ──────────────────────────────────────────────────────
  if (!checkRateLimit(ip)) {
    console.log(`🚫 RATE LIMIT: ${req.method} ${req.url} (${ip})`);
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

  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Normalizar path
  if (urlPath === '/') urlPath = '/index.html';

  // ── Verificar caminhos bloqueados ──────────────────────────────────────
  for (const pattern of BLOCKED_PATHS) {
    if (pattern.test(urlPath)) {
      console.log(`🚫 BLOQUEADO: ${req.method} ${urlPath} (${req.socket.remoteAddress})`);

      // Retornar 403 em vez de 404 (não revelar existência)
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>403 Acesso Negado</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>403</h1>
          <p>Acesso negado</p>
          <a href="/">Voltar ao início</a>
        </body>
        </html>
      `);
      return;
    }
  }

  // ── Construir path do arquivo ─────────────────────────────────────────
  const filePath = path.join(ROOT_DIR, urlPath);

  // Verificar se tentou sair do diretório raiz (Path Traversal)
  if (!filePath.startsWith(ROOT_DIR)) {
    console.log(`🚫 PATH TRAVERSAL: ${req.method} ${urlPath} (${req.socket.remoteAddress})`);
    res.writeHead(403);
    res.end('Acesso negado');
    return;
  }

  // ── Verificar se é arquivo ou diretório ───────────────────────────────
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Arquivo não existe — retornar 404
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Não Encontrado</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>404</h1>
          <p>Recurso não encontrado</p>
          <a href="/">Voltar ao início</a>
        </body>
        </html>
      `);
      return;
    }

    if (stats.isDirectory()) {
      // Tentar servir index.html do diretório
      const indexPath = path.join(filePath, 'index.html');
      fs.stat(indexPath, (err2, stats2) => {
        if (!err2 && stats2.isFile()) {
          serveFile(res, indexPath);
        } else {
          // Bloquear listagem de diretório
          serveDirectoryIndex(res, filePath, urlPath);
        }
      });
      return;
    }

    // Servir o arquivo
    serveFile(res, filePath);
  });
});

// ── Iniciar Servidor ──────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎬 HBO Max Clone — Servidor com Segurança                  ║
╠═══════════════════════════════════════════════════════════════╣
║  🌐 URL: http://localhost:${PORT}                              ║
║  🛡️  Proteções:                                              ║
║     • Git directory bloqueado                                ║
║     • Directory listing desativado                           ║
║     • Path traversal prevenido                               ║
║     • Security headers habilitados                           ║
║     • Logs de acesso                                         ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// ── Tratar erros ──────────────────────────────────────────────────────────
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já em uso. Tentando outra porta...`);
    server.listen(PORT + 1);
  } else {
    console.error('❌ Erro no servidor:', err);
  }
});

// ── Graceful shutdown ─────────────────────────────────────────────────────
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});
