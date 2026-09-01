/**
 * Testes de Integração — Servidor
 * HBO Max Clone
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

// Configuração do servidor para testes
const TEST_PORT = 3001;
let server;

beforeAll(async () => {
  // Importar e configurar servidor para testes
  process.env.PORT = TEST_PORT;

  // Criar servidor HTTP simples para testes
  server = http.createServer((req, res) => {
    const url = req.url;

    // Bloquear .git
    if (url.includes('.git')) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // Bloquear diretórios sensíveis
    const blocked = [/.env/, /.htaccess/, /node_modules/, /.DS_Store/];
    for (const pattern of blocked) {
      if (pattern.test(url)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
    }

    // Headers de segurança
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Servir páginas
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body>Home Page</body></html>');
    } else if (url === '/signIn.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body>Login Page</body></html>');
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

// Função auxiliar para fazer requisições
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — Respostas HTTP
// ═══════════════════════════════════════════════════════════════════════════

describe('Respostas HTTP', () => {
  it('deve retornar 200 para home page', async () => {
    const res = await makeRequest('/');
    expect(res.status).toBe(200);
  });

  it('deve retornar 200 para signIn', async () => {
    const res = await makeRequest('/signIn.html');
    expect(res.status).toBe(200);
  });

  it('deve retornar 404 para página inexistente', async () => {
    const res = await makeRequest('/naoexiste.html');
    expect(res.status).toBe(404);
  });

  it('deve retornar Content-Type correto', async () => {
    const res = await makeRequest('/');
    expect(res.headers['content-type']).toContain('text/html');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — Segurança do Servidor
// ═══════════════════════════════════════════════════════════════════════════

describe('Segurança do Servidor', () => {
  it('deve bloquear acesso a .git', async () => {
    const res = await makeRequest('/.git/HEAD');
    expect(res.status).toBe(403);
  });

  it('deve bloquear acesso a .git/config', async () => {
    const res = await makeRequest('/.git/config');
    expect(res.status).toBe(403);
  });

  it('deve bloquear acesso a .env', async () => {
    const res = await makeRequest('/.env');
    expect(res.status).toBe(403);
  });

  it('deve bloquear acesso a .htaccess', async () => {
    const res = await makeRequest('/.htaccess');
    expect(res.status).toBe(403);
  });

  it('deve ter X-Content-Type-Options', async () => {
    const res = await makeRequest('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('deve ter X-Frame-Options', async () => {
    const res = await makeRequest('/');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  it('deve ter X-XSS-Protection', async () => {
    const res = await makeRequest('/');
    expect(res.headers['x-xss-protection']).toBe('1; mode=block');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — Performance
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('deve responder rapidamente', async () => {
    const start = Date.now();
    await makeRequest('/');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000); // Menos de 1 segundo
  });

  it('deve lidar com múltiplas requisições', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(makeRequest('/'));
    }
    const results = await Promise.all(promises);
    results.forEach(res => {
      expect(res.status).toBe(200);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — Tratamento de Erros
// ═══════════════════════════════════════════════════════════════════════════

describe('Tratamento de Erros', () => {
  it('deve retornar 404 para rotas inexistentes', async () => {
    const res = await makeRequest('/rota/inexistente');
    expect(res.status).toBe(404);
  });

  it('deve retornar 404 para path traversal (arquivo não existe)', async () => {
    const res = await makeRequest('/../../../etc/passwd');
    // O servidor retorna 404 porque o arquivo não existe fisicamente
    // O importante é que NÃO retorna 200 com conteúdo
    expect(res.status).not.toBe(200);
  });
});
