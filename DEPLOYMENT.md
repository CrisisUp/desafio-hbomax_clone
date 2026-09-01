# 🚀 Guia de Deploy — HBO Max Clone

Este documento explica como fazer deploy do projeto em diferentes ambientes.

---

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Deploy Local](#deploy-local)
- [Deploy em Produção](#deploy-em-produção)
- [GitHub Pages](#github-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Docker](#docker)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Checklist Pré-Deploy](#checklist-pré-deploy)
- [Monitoramento](#monitoramento)

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- Conta no serviço de deploy (GitHub, Vercel, etc.)

---

## Deploy Local

### Servidor de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Acessar
# http://localhost:3000
```

### Servidor de Produção (Local)

```bash
# Iniciar com todas as proteções
npm run production

# Acessar
# http://localhost:3000
```

---

## Deploy em Produção

### Opção 1: GitHub Pages (Grátis)

#### Configuração

1. Ir para Settings > Pages no repositório
2. Selecionar branch `main` ou `gh-pages`
3. Salvar

#### Deploy Automático

```bash
# Criar branch gh-pages
git checkout -b gh-pages

# Build (não necessário para projeto estático)
# Copiar arquivos necessários

# Push
git push origin gh-pages
```

#### Acessar

```
https://seu-usuario.github.io/desafio-hbomax_clone/
```

---

### Opção 2: Vercel (Recomendado)

#### Instalar CLI

```bash
npm install -g vercel
```

#### Login

```bash
vercel login
```

#### Deploy

```bash
# Deploy de preview
vercel

# Deploy em produção
vercel --prod
```

#### Configuração via GitHub

1. Ir para [vercel.com](https://vercel.com)
2. Importar repositório do GitHub
3. Configurações automáticas
4. Deploy automático a cada push

#### Domínio Personalizado

```bash
vercel --prod --domain hbomax-clone.seudominio.com
```

---

### Opção 3: Netlify

#### Deploy via CLI

```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Deploy via GitHub

1. Ir para [netlify.com](https://netlify.com)
2. "New site from Git"
3. Selecionar repositório
4. Configurações:
   - Build command: `echo "Static site"`
   - Publish directory: `.`
5. Deploy

---

### Opção 4: Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos
COPY package*.json ./
RUN npm ci --production

COPY . .

# Porta do servidor
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
```

#### Build

```bash
# Build da imagem
docker build -t hbomax-clone .

# Rodar container
docker run -p 3000:3000 hbomax-clone

# Acessar
# http://localhost:3000
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down
```

---

## Variáveis de Ambiente

### Servidor

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | 3000 | Porta do servidor |
| `NODE_ENV` | development | Ambiente (development/production) |

### Exemplo .env

```bash
# .env (não committar!)
PORT=3000
NODE_ENV=production
```

---

## Checklist Pré-Deploy

### Código

- [ ] Todos os testes passando (`npm test`)
- [ ] Sem erros de lint (`npm run lint:css`)
- [ ] Código revisado

### Segurança

- [ ] Rate limiting habilitado
- [ ] Security headers configurados
- [ ] Git repository bloqueado
- [ ] Directory listing desativado
- [ ] HTTPS configurado

### Performance

- [ ] Imagens otimizadas
- [ ] CSS/JS minificado
- [ ] Cache configurado
- [ ] Fontes otimizadas

### Documentação

- [ ] README atualizado
- [ ] CHANGELOG atualizado
- [ ] LICENSE presente

### Testes

- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Cobertura mínima atingida

---

## Monitoramento

### Health Check

```bash
# Verificar se o servidor está rodando
curl -I https://seu-site.com

# Headers esperados:
# HTTP/2 200
# content-type: text/html
# x-content-type-options: nosniff
# ...
```

### Uptime Monitoring

Serviços recomendados:

- [UptimeRobot](https://uptimerobot.com/) (Grátis)
- [Pingdom](https://www.pingdom.com/)
- [StatusPage](https://www.atlassian.com/software/statuspage)

### Error Tracking

- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)
- [Bugsnag](https://www.bugsnag.com/)

---

## Troubleshooting

### Problemas Comuns

#### "Port already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### "Permission denied"

```bash
# Usar porta diferente
PORT=3001 npm start
```

#### Build falhou no Vercel

Verificar:
- Versão do Node.js
- Comando de build
- Arquivos necessários

---

*Guia de deploy — HBO Max Clone*
