# 🏗️ Arquitetura do Projeto — HBO Max Clone

Este documento descreve a arquitetura técnica do projeto, incluindo decisões de design, padrões utilizados e organização do código.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Diagrama de Componentes](#diagrama-de-componentes)
- [Fluxo de Dados](#fluxo-de-dados)
- [Padrões de Design](#padrões-de-design)
- [Organização do Código](#organização-do-código)
- [Decisões de Arquitetura](#decisões-de-arquitetura)
- [Performance](#performance)
- [Segurança](#segurança)
- [Escalabilidade](#escalabilidade)

---

## Visão Geral

O HBO Max Clone é uma aplicação **estática** (HTML/CSS/JS) com servidor Node.js para desenvolvimento e produção. A arquitura segue o princípio de **Separação de Responsabilidades** (Separation of Concerns).

### Características

- **Tipo**: Aplicação web estática
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **Backend**: Node.js (apenas para servir arquivos)
- **Testes**: Vitest + Testing Library
- **Build**: Sem build step (arquivos servidos diretamente)

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NAVEGADOR                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │   HTML        │  │   CSS         │  │   JavaScript  │      │
│  │   (Estrutura) │  │   (Estilo)    │  │   (Lógica)    │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVIDOR NODE.JS                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │   HTTP        │  │   Security    │  │   File        │      │
│  │   Handler     │  │   Middleware  │  │   Server      │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE STACK                       │   │
│  │  1. Rate Limiter → 2. WAF → 3. Path Validator → 4. FS   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SISTEMA DE ARQUIVOS                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │   HTML        │  │   CSS         │  │   JS          │      │
│  │   Files       │  │   Files       │  │   Files       │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │   Images      │  │   Fonts       │  │   Config      │      │
│  │   (WebP/PNG)  │  │   (Google)    │  │   Files       │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados

### 1. Requisição HTTP

```
Cliente → Servidor
  │
  ├─ 1. Rate Limit Check
  │     └─ Se excedido → 429 Too Many Requests
  │
  ├─ 2. WAF Filter
  │     └─ Se bloqueado → 403 Forbidden
  │
  ├─ 3. Path Validation
  │     ├─ Bloqueado (.git, .env) → 403 Forbidden
  │     ├─ Path Traversal → 403 Forbidden
  │     └─ Não existe → 404 Not Found
  │
  └─ 4. Serve File
        ├─ Adicionar Security Headers
        ├─ Determinar Content-Type
        └─ Retornar arquivo (200 OK)
```

### 2. JavaScript (Client-Side)

```
Usuário interage → Event Listener
  │
  ├─ Input Event → Validação em tempo real
  │     ├─ Sanitizar entrada
  │     ├─ Validar formato
  │     └─ Atualizar UI (borda verde/vermelha)
  │
  ├─ Click Event → Ação
  │     ├─ Menu Toggle → Abrir/fechar menu
  │     ├─ Password Toggle → Mostrar/ocultar senha
  │     ├─ Back to Top → Scroll para topo
  │     └─ Submit → Validar + enviar
  │
  └─ Scroll Event → Animação
        ├─ Navbar → Adicionar sombra
        ├─ Cards → Fade-in (Intersection Observer)
        └─ Progress → Atualizar barra
```

---

## Padrões de Design

### 1. BEM (Block Element Modifier)

```css
/* Block */
.navbar { }

/* Element */
.navbar__logo { }
.navbar__link { }

/* Modifier */
.navbar__link--button { }
.navbar--relative { }
```

### 2. CSS Custom Properties (Design Tokens)

```css
:root {
  /* Espaçamento */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  
  /* Tipografia */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  
  /* Cores */
  --primary-color: #020228;
  --secondary-color: #ff00e5;
}
```

### 3. Mobile First

```css
/* Base: Mobile */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 4. Componentização CSS

```
components/
├── buttons.css      # Componente botão
├── navbar.css       # Componente navbar
├── footer.css       # Componente footer
└── ...
```

---

## Organização do Código

### Estrutura de Diretórios

```
├── assets/              # Recursos estáticos
│   ├── css/             # Folhas de estilo
│   ├── js/              # Scripts JavaScript
│   └── images/          # Imagens
├── tests/               # Testes
│   ├── unit/            # Testes unitários
│   └── integration/     # Testes de integração
├── logs/                # Logs (gitignorado)
└── *.html               # Páginas HTML
```

### Hierarquia de CSS

```
variables.css
    ↓
reset.css
    ↓
base.css
    ↓
components.css (buttons, navbar, footer, etc.)
    ↓
page-specific.css (landing.css, login.css)
    ↓
global.css (agregador)
```

### Fluxo de Importação CSS

```css
/* landing.css */
@import url("./global.css");

/* global.css */
@import url("./variables.css");
@import url("./reset.css");
@import url("./base.css");
@import url("./buttons.css");
@import url("./navbar.css");
@import url("./footer.css");
/* ... */
```

---

## Decisões de Arquitetura

### 1. Por que Estático (não React/Vue)?

| Critério | Estático | Framework |
|----------|----------|-----------|
| **Complexidade** | Baixa | Média/Alta |
| **Performance** | Excelente | Boa |
| **SEO** | Bom | Bom (SSR) |
| **Manutenção** | Fácil | Média |
| **Aprendizado** | HTML/CSS/JS puro | Framework específico |

**Decisão**: Como é um clone educacional, optamos por HTML/CSS/JS puro para focar nos fundamentos.

### 2. Por que Node.js no Servidor?

- Servir arquivos estáticos
- Implementar segurança (rate limiting, WAF)
- Logging de acesso
- Flexibilidade para futuro backend

### 3. Por que Vitest para Testes?

- Rápido (baseado em Vite)
- Compatível com Jest API
- Suporte nativo a ESM
- JSX/TSX support

### 4. Por que BEM para Nomenclatura?

- Clareza na estrutura CSS
- Evita conflitos de nomes
- Fácil de manter
- Padrão amplamente adotado

---

## Performance

### Estratégias

| Estratégia | Implementação |
|------------|---------------|
| **Lazy Loading** | `loading="lazy"` em imagens |
| **Font Optimization** | `font-display: swap` + preload |
| **Image Optimization** | `srcset` + `sizes` + WebP |
| **Caching** | `Cache-Control` para assets |
| **Minification** | CSS/JS minificado em produção |

### Métricas Alvo

| Métrica | Meta | Ferramenta |
|---------|------|------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Chrome UX Report |
| CLS | < 0.1 | Lighthouse |
| TTFB | < 200ms | WebPageTest |

---

## Segurança

### Camadas de Proteção

```
┌─────────────────────────────────────────┐
│           CAMADA 1: NETWORK             │
│  ┌─────────────────────────────────┐   │
│  │  HTTPS (HSTS)                   │   │
│  │  Rate Limiting                  │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│           CAMADA 2: APPLICATION         │
│  ┌─────────────────────────────────┐   │
│  │  WAF (Web Application Firewall) │   │
│  │  Input Validation               │   │
│  │  Output Encoding                │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│           CAMADA 3: DATA                │
│  ┌─────────────────────────────────┐   │
│  │  Path Validation                │   │
│  │  File Blocking                  │   │
│  │  Directory Listing Disabled     │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│           CAMADA 4: RESPONSE            │
│  ┌─────────────────────────────────┐   │
│  │  Security Headers               │   │
│  │  CSP (Content Security Policy)  │   │
│  │  X-Frame-Options                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Headers de Segurança

| Header | Propósito |
|--------|-----------|
| `Strict-Transport-Security` | Força HTTPS |
| `Content-Security-Policy` | Previne XSS |
| `X-Content-Type-Options` | Previne MIME sniffing |
| `X-Frame-Options` | Previne clickjacking |
| `X-XSS-Protection` | XSS filter |
| `Referrer-Policy` | Controla referrer |
| `Permissions-Policy` | Desabilita APIs |

---

## Escalabilidade

### Pontos de Expansão

| Área | Como Expandir |
|------|---------------|
| **Backend** | Adicionar API REST/GraphQL |
| **Banco de Dados** | Integrar PostgreSQL/MongoDB |
| **Autenticação** | JWT + OAuth |
| **Cache** | Redis para sessões |
| **CDN** | CloudFlare/AWS CloudFront |
| **Monitoramento** | APM (New Relic, Datadog) |

### Migração para Framework

Se necessário, o projeto pode ser migrado para:

1. **Next.js** - SSR/SSG + API Routes
2. **React** - SPA com componentização
3. **Astro** - Static site com islands

---

## Referências

- [BEM Methodology](https://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Web Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Performance Best Practices](https://web.dev/performance/)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Documento de arquitetura — HBO Max Clone*
