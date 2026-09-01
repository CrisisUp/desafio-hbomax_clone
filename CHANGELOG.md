# 📝 Changelog — HBO Max Clone

Todas as mudanças significativas neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/) e o projeto adere a [Semantic Versioning](https://semver.org/).

---

## [2.0.0] - 2026-09-01

### 🛡️ Segurança

- **ADICIONADO** Rate limiting (100 req/15min)
- **ADICIONADO** WAF básico com 10 patterns de proteção
- **ADICIONADO** Header `Strict-Transport-Security` (HSTS)
- **ADICIONADO** Header `Content-Security-Policy` (CSP)
- **ADICIONADO** Bloqueio de Git repository (`.git/`)
- **ADICIONADO** Bloqueio de directory listing
- **ADICIONADO** Bloqueio de arquivos sensíveis (`.env`, `.htaccess`, etc)
- **ADICIONADO** Validação e sanitização de entrada
- **ADICIONADO** Security headers completos (9 headers)
- **ADICIONADO** Servidor seguro (`server.js`)
- **ADICIONADO** Servidor produção (`server-production.js`)

### 🧪 Testes

- **ADICIONADO** Suite de testes completa (122 testes)
- **ADICIONADO** Testes unitários de validação
- **ADICIONADO** Testes unitários de DOM
- **ADICIONADO** Testes de acessibilidade
- **ADICIONADO** Testes de segurança
- **ADICIONADO** Testes de integração com servidor
- **ADICIONADO** Configuração Vitest
- **ADICIONADO** Configuração Stylelint
- **ADICIONADO** Configuração HTML Validate

### 📚 Documentação

- **ADICIONADO** README.md completo e detalhado
- **ADICIONADO** CONTRIBUTING.md (guia de contribuição)
- **ADICIONADO** CHANGELOG.md (este arquivo)
- **ADICIONADO** SECURITY.md (documentação de segurança)
- **ADICIONADO** SECURITY.md (relatório de auditoria)

### ♿ Acessibilidade

- **ADICIONADO** `aria-label` em navegação e rodapé
- **ADICIONADO** `aria-current` para página ativa
- **ADICIONADO** `aria-expanded` para menu toggle
- **ADICIONADO** `aria-describedby` para campos de senha
- **ADICIONADO** Labels associados a todos os campos
- **ADICIONADO** Touch targets ≥ 48px
- **ADICIONADO** Focus visible para navegação por teclado

### 🎨 UX/UI

- **ADICIONADO** Indicador de força da senha
- **ADICIONADO** Toggle mostrar/ocultar senha
- **ADICIONADO** Skeleton loading para imagens
- **ADICIONADO** Button loading state (spinner)
- **ADICIONADO** Toast notifications
- **ADICIONADO** Back to top button
- **ADICIONADO** Scroll progress indicator
- **ADICIONADO** Badge "Mais Popular" nos planos
- **ADICIONADO** Hero entrance animation (fade-in)
- **ADICIONADO** Card press effect
- **ADICIONADO** Link underline animation
- **ADICIONADO** Social link hover (escala + brilho)

### 📱 Responsividade

- **ADICIONADO** `srcset` + `sizes` para imagens responsivas
- **ADICIONADO** Meta `theme-color` para PWA
- **ADICIONADO** Meta `mobile-web-app-capable`
- **ADICIONADO** `manifest.json` para PWA

### ⚡ Performance

- **ADICIONADO** Lazy loading em imagens
- **ADICIONADO** `font-display: swap` para fontes
- **ADICIONADO** Cache de assets estáticos
- **ADICIONADO** Otimização de imagens com Sharp

### 🧹 Clean Code

- **MUDADO** Estrutura CSS modular (15 arquivos)
- **MUDADO** Nomes de classes para BEM consistente
- **MUDADO** Design tokens (40+ variáveis CSS)
- **REMOVIDO** `!important` desnecessário
- **REMOVIDO** `font-family` redundante
- **REMOVIDO** Magic numbers
- **REMOVIDO** Dead markup

### 🐛 Correções

- **CORRIGIDO** Background `background-subscription.png` (404)
- **CORRIGIDO** Meta `apple-mobile-web-app-capable` (deprecated)
- **CORRIGIDO** Font preload incorreto
- **CORRIGIDO** `.contents__card:hover` definido 2×
- **CORRIGIDO** `body` declarado 2× em global.css
- **CORRIGIDO** Background redundante em `.subscription`
- **CORRIGIDO** `aspect-ratio: auto` (no-op)
- **CORRIGIDO** `javascript:void(0)` → `href="#!"`
- **CORRIGIDO** Label ausente para campo password
- **CORRIGIDO** Formatação inconsistente do link "Séries"

---

## [1.1.0] - 2026-08-31

### 📱 Responsividade

- **ADICIONADO** `srcset` + `sizes` nos cards de conteúdo
- **ADICIONADO** Tap targets ≥ 48px
- **ADICIONADO** `font-display: swap` para fontes
- **ADICIONADO** Meta `theme-color` + PWA

### 🐛 Correções

- **CORRIGIDO** Background `background-subscription.png` (404)
- **CORRIGIDO** Meta `apple-mobile-web-app-capable` (deprecated)
- **CORRIGIDO** Font preload incorreto

---

## [1.0.0] - 2026-08-31

### 🎨 Features Iniciais

- **ADICIONADO** Menu de navegação
- **ADICIONADO** Cabeçalho com animação gradiente
- **ADICIONADO** Cards com planos de assinatura animados
- **ADICIONADO** Lista de filmes e séries
- **ADICIONADO** Formulário de login
- **ADICIONADO** Rodapé com links e redes sociais
- **ADICIONADO** UI responsiva

### 📦 Dependências

- **ADICIONADO** Sharp (otimização de imagens)

---

## [0.1.0] - 2026-08-30

### 🚀 Início do Projeto

- **ADICIONADO** Estrutura inicial do projeto
- **ADICIONADO** Template HTML
- **ADICIONADO** Estilos CSS básicos
- **ADICIONADO** README inicial

---

## Links Úteis

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
