# 🎬 HBO Max Clone

![HBO Max Cover](assets/images/readme-images/cover.png)

Clone do site [HBO Max](https://www.hbomax.com/br/pt) desenvolvido como desafio final da Trilha de CSS da [Digital Innovation One (DIO)](https://dio.me). O projeto reproduz a interface do site original com melhorias de acessibilidade, performance e segurança.

[![HBO Max Preview](assets/images/readme-images/cover-2.png)](https://micheleambrosio.github.io/hbomax/)

---

## 📋 Sumário

- [✨ Features](#-features)
- [📦 Temas Abordados](#-temas-abordados)
- [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
- [🚀 Como Rodar](#-como-rodar)
- [🧪 Testes](#-testes)
- [🔒 Segurança](#-segurança)
- [♿ Acessibilidade](#-acessibilidade)
- [📱 Responsividade](#-responsividade)
- [📊 Performance](#-performance)
- [🛠️ Tecnologias](#️-tecnologias)
- [📁 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🔧 Configuração](#-configuração)
- [📝 Changelog](#-changelog)
- [🤝 Contribuindo](#-contribuindo)
- [🏆 Desafio](#-desafio)
- [🌈 Demonstração](#-demonstração)
- [💻 Autora](#-autora)
- [📄 Licença](#-licença)

---

## ✨ Features

### 🎨 Interface
- Menu de navegação responsivo com toggle mobile
- Cabeçalho com animação gradiente
- Cards com planos de assinatura animados (efeito 3D)
- Lista de filmes e séries disponíveis na plataforma
- Formulário de login com validação
- Rodapé com links e redes sociais
- Indicador de scroll progress

### 📱 Responsividade
- Layout adaptivo para mobile, tablet e desktop
- Scroll-snap horizontal no mobile
- Touch targets ≥ 48px (acessibilidade)
- Navbar colapsável em telas pequenas

### ♿ Acessibilidade
- Navegação por teclado completa
- Labels em todos os campos de formulário
- `aria-label` e `aria-current` onde aplicável
- Hierarquia semântica de headings
- Contraste de cores adequado
- Indicador de foco visível (`:focus-visible`)

### 🔒 Segurança
- Rate limiting (100 req/15min)
- WAF básico com 10 patterns de proteção
- Security headers completos (9 headers)
- Git repository bloqueado
- Directory listing desativado
- Validação e sanitização de entrada

### ⚡ Performance
- Imagens responsivas com `srcset`
- Lazy loading em imagens
- Skeleton loading para feedback visual
- Fontes otimizadas com `font-display: swap`
- Cache de assets estáticos

### 🎭 Interação (JavaScript)
- Menu mobile toggle (hamburger → X)
- Validação de formulário em tempo real
- Indicador de força da senha
- Toggle mostrar/ocultar senha
- Toast notifications
- Animações ao scroll (Intersection Observer)
- Botão "voltar ao topo"
- Smooth scroll

*As features são visuais, não possuindo integração com API. O intuito é reproduzir a interface do site original com melhorias.*

---

## 📦 Temas Abordados

### CSS
- Fundamentos do CSS
- Grid Layout e Flexbox
- Responsividade e Media Queries
- Pseudo-elementos e pseudo-classes
- Transformações 2D e 3D
- Transições e animações (`@keyframes`)
- CSS Custom Properties (Design Tokens)
- Seletor parental `:has()`
- Scroll snap para carrossel
- Scrollbar customizada (WebKit + Firefox)
- `:focus-visible` para navegação por teclado
- BEM naming convention

### JavaScript
- Manipulação do DOM
- Event listeners
- Validação de formulários
- Intersection Observer API
- Template literals
- Local Storage (opcional)
- ES Modules

### Segurança
- Sanitização de entrada
- Validação de dados
- Rate limiting
- Security headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)

### Acessibilidade (a11y)
- ARIA labels e roles
- Semântica HTML5
- Navegação por teclado
- Contraste de cores
- Labels de formulário

---

## 🏗️ Arquitetura do Projeto

### Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     camada de Apresentação                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  index.html  │  │ signIn.html │  │   assets/           │ │
│  │  (Home)      │  │ (Login)     │  │   ├── css/          │ │
│  └─────────────┘  └─────────────┘  │   ├── js/           │ │
│                                     │   └── images/       │ │
│                                     └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     camada de Lógica                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  assets/js/main.js       (Interações)               │   │
│  │  assets/js/validation.js (Validação/Sanitização)    │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                     camada de Estilo                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  assets/css/                                          │   │
│  │  ├── variables.css  (Design Tokens)                  │   │
│  │  ├── base.css       (Tipografia, Reset)              │   │
│  │  ├── components.css (Componentes reutilizáveis)      │   │
│  │  ├── landing.css    (Estilos da Home)                │   │
│  │  ├── login.css      (Estilos do Login)               │   │
│  │  └── global.css     (Agregador de imports)           │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                     camada de Servidor                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  server.js            (Desenvolvimento)              │   │
│  │  server-production.js (Produção com WAF)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Padrões de Design

| Padrão | Implementação |
|--------|---------------|
| **BEM** | Nomenclatura de classes CSS |
| **CSS Custom Properties** | Design tokens em `variables.css` |
| **Mobile First** | Media queries ascendentes |
| **Componentização** | Arquivos CSS separados por componente |
| **Separation of Concerns** | HTML, CSS e JS organizados |

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/CrisisUp/desafio-hbomax_clone.git

# Entrar no diretório
cd desafio-hbomax_clone

# Instalar dependências
npm install
```

### Execução

```bash
# Servidor de desenvolvimento (HTTP)
npm start

# Servidor com todas as proteções
npm run production

# Acessar no navegador
# http://localhost:3000
```

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia servidor de desenvolvimento |
| `npm run production` | Inicia servidor com proteções de segurança |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Gera relatório de cobertura |
| `npm run lint:css` | Verifica erros de lint no CSS |
| `npm run lint:css:fix` | Corrige erros de lint automaticamente |

---

## 🧪 Testes

### Tipos de Teste

| Tipo | Ferramenta | Descrição |
|------|------------|-----------|
| **Unitários** | Vitest | Funções de validação, DOM, segurança |
| **Integração** | Vitest | Servidor HTTP, headers, rotas |
| **Acessibilidade** | Axe-core | Verificação de a11y |
| **Segurança** | ffuf | Scan de vulnerabilidades |
| **Lint** | Stylelint | Qualidade do CSS |

### Rodar Testes

```bash
# Todos os testes
npm test

# Apenas unitários
npm run test:unit

# Apenas integração
npm run test:integration

# Com cobertura de código
npm run test:coverage

# Verificar CSS
npm run lint:css
```

### Cobertura de Código

```bash
npm run test:coverage
# Relatório gerado em coverage/index.html
```

---

## 🔒 Segurança

### Proteções Implementadas

| Proteção | Status | Configuração |
|----------|--------|--------------|
| Rate Limiting | ✅ | 100 req/15min |
| WAF Básico | ✅ | 10 patterns |
| HSTS | ✅ | max-age=31536000 |
| CSP | ✅ | default-src 'self' |
| Git Block | ✅ | Todos os .git/ |
| Directory Listing | ✅ | Desativado |
| Path Traversal | ✅ | Prevenido |

### Headers de Segurança

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
```

### Testes de Segurança

```bash
# Scan completo com ffuf
ffuf -u http://localhost:3000/FUZZ -w wordlist.txt -mc all

# Verificar headers
curl -I http://localhost:3000/

# Testar Git block
curl -I http://localhost:3000/.git/HEAD
```

Para mais detalhes, veja [SECURITY.md](SECURITY.md).

---

## ♿ Acessibilidade

### Recursos Implementados

- **HTML Semântico**: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`
- **ARIA Labels**: `aria-label`, `aria-current`, `aria-expanded`, `aria-describedby`
- **Formulários**: Labels associados, validação, feedback visual
- **Navegação por Teclado**: Focus visible, tab order lógico
- **Contraste**: Cores com ratio adequado (WCAG AA)
- **Touch Targets**: Mínimo 48px para elementos interativos

### Verificação

```bash
# Usando axe-core
npx axe-core-cli http://localhost:3000

# Ou usar extensão do navegador:
# - axe DevTools
# - WAVE
# - Lighthouse
```

---

## 📱 Responsividade

### Breakpoints

| Breakpoint | Largura | Layout |
|------------|---------|--------|
| Desktop Large | > 1200px | Grid 3 colunas |
| Desktop | 800-1200px | Grid 2-3 colunas |
| Tablet | 480-800px | Grid 2 colunas |
| Mobile | < 480px | Coluna única + scroll-snap |

### Teste em Diferentes Dispositivos

```bash
# Usando Chrome DevTools
# F12 → Toggle Device Toolbar (Ctrl+Shift+M)

# Ou usar ferramentas online:
# - BrowserStack
# - Sauce Labs
# - Responsively App (desktop)
```

---

## 📊 Performance

### Métricas

| Métrica | Meta | Status |
|---------|------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ |
| **FID** (First Input Delay) | < 100ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ |
| **TTFB** (Time to First Byte) | < 200ms | ✅ |

### Otimizações

- **Imagens**: `srcset` + `sizes` para diferentes resoluções
- **Fontes**: `font-display: swap` + preload
- **CSS**: Critical CSS inline, resto defer
- **JS**: `defer` no script tags
- **Cache**: Assets estáticos com cache imutável

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **HTML5** | - | Estrutura semântica |
| **CSS3** | - | Estilos, animações, layout |
| **JavaScript** | ES2022+ | Interações, validação |
| **Node.js** | v18+ | Servidor |
| **Vitest** | v4.x | Testes unitários |
| **Stylelint** | v17.x | Lint CSS |
| **ffuf** | v2.x | Security scanning |

---

## 📁 Estrutura de Arquivos

```
desafio-hbomax_clone/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens
│   │   ├── reset.css          # Reset básico
│   │   ├── base.css           # Tipografia, body
│   │   ├── buttons.css        # Componente botão
│   │   ├── scrollbar.css      # Scroll customizada
│   │   ├── helpers.css        # Utilitários
│   │   ├── animations.css     # @keyframes
│   │   ├── container.css      # Container utility
│   │   ├── navbar.css         # Navegação
│   │   ├── footer.css         # Rodapé
│   │   ├── components.css     # Notificações, skeleton
│   │   ├── password-strength.css # Indicador senha
│   │   ├── ux-improvements.css   # Toggle, badge, back-to-top
│   │   ├── landing.css        # Estilos da Home
│   │   ├── login.css          # Estilos do Login
│   │   └── global.css         # Agregador de imports
│   ├── images/
│   │   ├── *.webp             # Imagens do projeto
│   │   ├── *.png              # Ícones e logos
│   │   ├── *.svg              # Vetores
│   │   └── responsive/        # Imagens otimizadas
│   └── js/
│       ├── main.js            # JavaScript principal
│       └── validation.js      # Validação e sanitização
├── tests/
│   ├── unit/
│   │   ├── validation.test.js # Testes de validação
│   │   ├── main.test.js       # Testes de DOM
│   │   ├── accessibility.test.js # Testes de a11y
│   │   └── security.test.js   # Testes de segurança
│   └── integration/
│       └── server.test.js     # Testes do servidor
├── logs/                      # Logs de acesso (gitignorado)
├── index.html                 # Página principal
├── signIn.html                # Página de login
├── server.js                  # Servidor desenvolvimento
├── server-production.js       # Servidor produção
├── manifest.json              # PWA manifest
├── package.json               # Dependências e scripts
├── vitest.config.js           # Configuração de testes
├── .stylelintrc.json          # Configuração CSS lint
├── .htmlvalidate.json         # Configuração HTML lint
├── .gitignore                 # Arquivos ignorados
├── SECURITY.md                # Documentação de segurança
├── CONTRIBUTING.md            # Guia de contribuição
├── CHANGELOG.md               # Histórico de versões
└── README.md                  # Este arquivo
```

---

## 🔧 Configuração

### Variáveis de Ambiente

O projeto não requer variáveis de ambiente para funcionar.

### Configuração do Servidor

Edite `server.js` ou `server-production.js` para alterar:

```javascript
const PORT = 3000;           // Porta do servidor
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // Janela de tempo
  maxRequests: 100,          // Máximo de requisições
};
```

### Configuração de Segurança

Edite `SECURITY_HEADERS` em `server.js` para personalizar headers.

---

## 📝 Changelog

Veja [CHANGELOG.md](CHANGELOG.md) para histórico completo de versões.

### Última Versão (v2.0.0)

- ✅ Suite de testes completa (122 testes)
- ✅ Headers de segurança (HSTS, CSP)
- ✅ Rate limiting implementado
- ✅ WAF básico
- ✅ Documentação completa
- ✅ Clean Code refactoring

---

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para guia completo de contribuição.

### Resumo Rápido

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 🏆 Desafio

Como parte do desafio final da Trilha de CSS da DIO, o desenvolvedor deve reproduzir [esse projeto](https://micheleambrosio.github.io/hbomax/), sem consultar o código final presente na branch `master`.

Para auxiliar, use a branch `template-desafio` e faça um fork do projeto.

---

## 🌈 Demonstração

Acesse a demonstração online: [HBO Max Clone](https://micheleambrosio.github.io/hbomax/)

---

## 💻 Autora

![Michele Ambrosio](https://avatars.githubusercontent.com/u/55519539?v=4)

[Michele Queiroz Ambrosio](https://github.com/micheleambrosio)

[Instagram](http://instagram.com/programi_) · [GitHub](https://github.com/micheleambrosio) · [LinkedIn](https://www.linkedin.com/in/michele-ambrosio-a4899661/) · [Twitch](https://www.twitch.tv/michele_ambrosio)

---

## 📄 Licença

Este projeto é um desafio educacional da DIO. Veja o [repositório original](https://github.com/micheleambrosio/hbomax) para mais detalhes.

---

⌨️ com ❤️ por [Michele Ambrosio](https://github.com/micheleambrosio) 😊
