# 🛡️ Documentação de Segurança — HBO Max Clone

## Visão Geral

Este projeto implementa múltiplas camadas de proteção contra ameaças comuns na web.

---

## 🔒 Proteções Implementadas

### 1. Rate Limiting

**O que é:** Limita o número de requisições por IP em um período de tempo.

**Configuração atual:**
- Janela de tempo: 15 minutos
- Máximo de requisições: 100 por IP
- Bloqueio: 429 Too Many Requests

**Previne:**
- Ataques brute force
- DDoS básico
- Scraping excessivo

---

### 2. WAF (Web Application Firewall)

**O que é:** Filtra requisições maliciosas antes de chegarem ao servidor.

**Patterns bloqueados:**
- Path traversal (`../`)
- XSS (`<script>`)
- SQL injection (`UNION SELECT`)
- Code injection (`eval()`)
- Event handlers (`onclick=`)
- iframe injection
- Cookie theft
- Redirect manipulation

**Previne:**
- Injeção de código
- Cross-Site Scripting (XSS)
- SQL Injection
- Manipulação de URLs

---

### 3. Directory Listing Desativado

**O que é:** Impede a listagem de arquivos em diretórios.

**Comportamento:**
- Acesso a diretório sem index.html → 403 Forbidden
- Acesso a arquivo existente → 200 OK
- Acesso a arquivo inexistente → 404 Not Found

**Previne:**
- Enumeração de diretórios
- Exposição de estrutura do projeto
- Encontrar arquivos sensíveis

---

### 4. Path Traversal Prevenido

**O que é:** Impede acesso a arquivos fora do diretório raiz.

**Exemplo bloqueado:**
```
GET /../../../etc/passwd → 403 Forbidden
GET /..%2F..%2Fetc/passwd → 403 Forbidden
```

**Previne:**
- Acesso a arquivos do sistema
- Leitura de /etc/passwd
- Exposição de configurações sensíveis

---

### 5. Security Headers

| Header | Valor | Proteção |
|--------|-------|----------|
| `X-Content-Type-Options` | `nosniff` | Previne MIME sniffing |
| `X-Frame-Options` | `DENY` | Previne clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS filter do navegador |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controla referrer |
| `Permissions-Policy` | `camera=(), microphone=()` | Desabilita APIs perigosas |
| `Strict-Transport-Security` | `max-age=31536000` | Força HTTPS (1 ano) |
| `Content-Security-Policy` | `default-src 'self'` | Previne XSS avançado |

---

### 6. Git Repository Bloqueado

**O que é:** Impede acesso a qualquer arquivo `.git/`.

**Bloqueado:**
- `.git/`
- `.git/HEAD`
- `.git/config`
- `.git/objects/`
- Qualquer caminho contendo `.git`

**Previne:**
- Exposição de código-fonte
- Vazamento de histórico de commits
- Extração de credenciais

---

### 7. Arquivos Sensíveis Bloqueados

**Arquivos protegidos:**
- `.env`, `.env.local`, `.env.production`
- `.htaccess`, `.htpasswd`
- `.svn/`
- `.DS_Store`, `Thumbs.db`
- `web.config`
- `node_modules/`
- `logs/`
- `backup/`
- Arquivos `.sql`, `.log`, `.bak`, `.old`

---

### 8. Logging e Monitoring

**Logs de acesso:**
- Localização: `logs/access.log`
- Formato: JSON
- Conteúdo: timestamp, IP, método, URL, status, user-agent

**Logs de segurança:**
- Localização: `logs/security.log`
- Eventos: RATE_LIMIT_EXCEEDED, WAF_BLOCKED, BLOCKED_PATH, PATH_TRAVERSAL

---

## 🚀 Como Usar

### Servidor Desenvolvimento (HTTP)

```bash
# Iniciar servidor básico
node server.js

# Ou via npm
npm start
```

### Servidor Produção (HTTP + Rate Limiting + WAF)

```bash
# Iniciar servidor completo
node server-production.js

# Ou via npm
npm run production
```

### Testes de Segurança

```bash
# Rodar scan ffuf
npm run test:security

# Ou manualmente
ffuf -u http://localhost:3000/FUZZ -w wordlist.txt -mc 200,301,302,403
```

---

## 📊 Status das Proteções

| Proteção | Status | Configuração |
|----------|--------|--------------|
| Rate Limiting | ✅ Ativo | 100 req/15min |
| WAF | ✅ Ativo | 10 patterns |
| Directory Listing | ✅ Desativado | 403 em todos |
| Path Traversal | ✅ Prevenido | Validação de path |
| Security Headers | ✅ Ativo | 7 headers |
| Git Block | ✅ Ativo | Todos os .git/ |
| File Block | ✅ Ativo | 15+ padrões |
| Logging | ✅ Ativo | access.log + security.log |

---

## 🔍 Verificação de Segurança

### Testar Rate Limiting

```bash
# Enviar 100+ requisições rapidamente
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
done

# Após 100 requisições, deve retornar 429
```

### Testar WAF

```bash
# Tentar XSS
curl "http://localhost:3000/<script>alert(1)</script>"
# Deve retornar 403

# Tentar Path Traversal
curl "http://localhost:3000/../../../etc/passwd"
# Deve retornar 403
```

### Testar Git Block

```bash
# Tentar acessar .git
curl "http://localhost:3000/.git/HEAD"
# Deve retornar 403
```

### Verificar Logs

```bash
# Ver logs de acesso
tail -f logs/access.log

# Ver logs de segurança
tail -f logs/security.log
```

---

## 📋 Checklist de Segurança

- [x] Rate Limiting configurado
- [x] WAF implementado
- [x] Directory Listing desativado
- [x] Path Traversal prevenido
- [x] Security Headers habilitados
- [x] Git Repository bloqueado
- [x] Arquivos sensíveis protegidos
- [x] Logging ativo
- [ ] HTTPS (requer certificado)
- [ ] Monitoramento externo

---

## 🔐 Para Produção

### HTTPS

1. Obter certificado (Let's Encrypt recomendado)
2. Configurar no servidor:
```javascript
const https = require('https');
const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem'),
};
https.createServer(options, app).listen(443);
```

### Monitoramento Externo

- UptimeRobot (grátis)
- Pingdom
- Datadog
- New Relic

### WAF Externo (Opcional)

- Cloudflare (grátis para básico)
- AWS WAF
- Azure Front Door

---

## 📞 Contato

Em caso de vulnerabilidade encontrada, reporte responsavelmente.

---

*Última atualização: 2026-08-31*
