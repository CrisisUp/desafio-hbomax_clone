# 🤝 Guia de Contribuição — HBO Max Clone

Obrigado por interessar em contribuir com este projeto! Este guia explica como participar.

---

## 📋 Sumário

- [🚀 Primeiros Passos](#-primeiros-passos)
- [📦 Preparação do Ambiente](#-preparação-do-ambiente)
- [🌿 Fluxo de Trabalho](#-fluxo-de-trabalho)
- [📝 Convenções de Commit](#-convenções-de-commit)
- [🎨 Guia de Estilo](#-guia-de-estilo)
- [🧪 Testes](#-testes)
- [🐛 Reportar Bugs](#-reportar-bugs)
- [💡 Sugerir Features](#-sugerir-features)
- [❓ Perguntas](#-perguntas)

---

## 🚀 Primeiros Passos

### 1. Fork o Repositório

```bash
# Clique no botão "Fork" no GitHub
# Ou via CLI:
gh repo fork CrisisUp/desafio-hbomax_clone
```

### 2. Clone seu Fork

```bash
git clone https://github.com/SEU-USUARIO/desafio-hbomax_clone.git
cd desafio-hbomax_clone
```

### 3. Adicione o Upstream

```bash
git remote add upstream https://github.com/CrisisUp/desafio-hbomax_clone.git
```

### 4. Crie uma Branch

```bash
git checkout -b feature/nome-da-feature
```

---

## 📦 Preparação do Ambiente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- Editor de código (VS Code recomendado)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Executar testes
npm test
```

### Extensões Recomendadas (VS Code)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

---

## 🌿 Fluxo de Trabalho

### 1. Mantenha seu Fork Atualizado

```bash
# Fetch upstream
git fetch upstream

# Rebase na branch principal
git rebase upstream/master

# Push para seu fork
git push origin master --force
```

### 2. Crie uma Feature Branch

```bash
# Sempre comece da branch master atualizada
git checkout master
git pull upstream master

# Crie sua branch
git checkout -b feature/nome-da-feature
```

### 3. Desenvolva

```bash
# Faça suas alterações
# ...

# Execute os testes
npm test

# Verifique o CSS
npm run lint:css

# Commit suas alterações
git add .
git commit -m "feat: adiciona nova feature"
```

### 4. Envie seu PR

```bash
# Push para seu fork
git push origin feature/nome-da-feature

# Crie o Pull Request via GitHub
gh pr create --title "feat: Nova Feature" --body "Descrição..."
```

---

## 📝 Convenções de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit.

### Formato

```
<tipo>(escopo): descrição

[corpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona toggle senha` |
| `fix` | Correção de bug | `fix: corrige validação email` |
| `docs` | Documentação | `docs: atualiza README` |
| `style` | Formatação (não afeta lógica) | `style: corrige indentação` |
| `refactor` | Refatoração sem mudança de comportamento | `refactor: extrai função de validação` |
| `test` | Adiciona/corrigir testes | `test: adiciona teste de XSS` |
| `chore` | Tarefas de manutenção | `chore: atualiza dependências` |
| `perf` | Melhoria de performance | `perf: otimiza imagens` |
| `ci` | Integração contínua | `ci: adiciona GitHub Actions` |
| `revert` | Reverte commit anterior | `revert: reverte feat X` |

### Exemplos

```bash
# Feature
git commit -m "feat(auth): adiciona validação de senha forte"

# Fix
git commit -m "fix(ui): corrige overflow no menu mobile"

# Docs
git commit -m "docs: adiciona guia de instalação"

# Breaking change
git commit -m "feat(api)!: altera formato de resposta

BREAKING CHANGE: formato de JSON mudou"
```

---

## 🎨 Guia de Estilo

### HTML

- Use 2 espaços de indentação
- Prefira elementos semânticos (`<nav>`, `<main>`, `<section>`)
- Adicione `alt` em todas as imagens
- Use `aria-label` onde apropriado
- Mantenha BEM naming para classes

```html
<!-- ✅ Bom -->
<nav class="navbar" aria-label="Menu principal">
  <a href="/" class="navbar__logo">
    <img src="logo.svg" alt="Logo do site" />
  </a>
</nav>

<!-- ❌ Ruim -->
<div class="menu">
  <a href="/">
    <img src="logo.svg" />
  </a>
</div>
```

### CSS

- Use 2 espaços de indentação
- Siga BEM naming convention
- Use variáveis CSS para valores repetidos
- Organize por componente
- Comente seções importantes

```css
/* ✅ Bom */
.navbar {
  display: flex;
  padding: var(--space-4);
}

.navbar__link {
  color: var(--text-color);
  font-size: var(--font-size-sm);
}

/* ❌ Ruim */
.menu {
  display: flex;
  padding: 16px;
}

.menu-item {
  color: #fff;
  font-size: 0.875rem;
}
```

### JavaScript

- Use ES6+ features
- Prefira `const` e `let` sobre `var`
- Use descriptive function names
- Adicione JSDoc para funções públicas
- Trate erros adequadamente

```javascript
// ✅ Bom
/**
 * Valida formato de email
 * @param {string} email - Email para validar
 * @returns {boolean} True se válido
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ❌ Ruim
function v(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Em modo watch (desenvolvimento)
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Adicionar Testes

1. Crie arquivo em `tests/unit/` ou `tests/integration/`
2. Siga o padrão `*.test.js`
3. Use `describe` para agrupar
4. Use `it` para cada caso de teste
5. Use `expect` para assertions

```javascript
import { describe, it, expect } from 'vitest';

describe('validateEmail', () => {
  it('deve aceitar email válido', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('deve rejeitar email inválido', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Teste na última versão
3. reproduza o problema

### Como Reportar

1. Abra uma [Issue](https://github.com/CrisisUp/desafio-hbomax_clone/issues/new)
2. Use o template de bug report
3. Forneça:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável
   - Informações do ambiente (SO, navegador, versão)

---

## 💡 Sugerir Features

1. Abra uma [Issue](https://github.com/CrisisUp/desafio-hbomax_clone/issues/new)
2. Use o template de feature request
3. Descreva:
   - Problema que a feature resolve
   - Solução proposta
   - Alternativas consideradas
   - Contexto adicional

---

## ❓ Perguntas

- Abra uma [Discussion](https://github.com/CrisisUp/desafio-hbomax_clone/discussions)
- Entre em contato pela DIO

---

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta da DIO](https://dio.me/codigo-de-conduta). Ao contribuir, você concorda em seguir suas diretrizes.

---

Obrigado por contribuir! 🎉
