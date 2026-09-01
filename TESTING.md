# 🧪 Guia de Testes — HBO Max Clone

Este documento explica como escrever, rodar e manter os testes do projeto.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Tipos de Teste](#tipos-de-teste)
- [Rodando Testes](#rodando-testes)
- [Escrevendo Testes](#escrevendo-testes)
- [Mocks e Stubs](#mocks-e-stubs)
- [Cobertura de Código](#cobertura-de-código)
- [CI/CD](#cicd)
- [Melhores Práticas](#melhores-práticas)

---

## Visão Geral

### Ferramentas

| Ferramenta | Versão | Uso |
|------------|--------|-----|
| **Vitest** | v4.x | Framework de testes |
| **Testing Library** | v10.x | Testes de DOM |
| **jsdom** | v30.x | Ambiente browser-like |
| **axe-core** | v4.x | Testes de acessibilidade |

### Estrutura de Testes

```
tests/
├── unit/
│   ├── validation.test.js    # Funções de validação
│   ├── main.test.js          # Manipulação DOM
│   ├── accessibility.test.js # Acessibilidade
│   └── security.test.js      # Segurança
├── integration/
│   └── server.test.js        # Servidor HTTP
└── fixtures/
    └── html/
        └── index.html        # HTML para testes
```

---

## Configuração

### vitest.config.js

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',    // Simula navegador
    globals: true,            // describe, it, expect globais
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['assets/js/**/*.js'],
    },
  },
});
```

### package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration"
  }
}
```

---

## Tipos de Teste

### 1. Testes Unitários

Testam funções isoladas sem dependências externas.

```javascript
// tests/unit/validation.test.js
import { describe, it, expect } from 'vitest';

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

describe('validateEmail', () => {
  it('deve aceitar email válido', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('deve rejeitar email inválido', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### 2. Testes de Integração

Testam componentes trabalhando juntos.

```javascript
// tests/integration/server.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

let server;

beforeAll(async () => {
  // Iniciar servidor para testes
  server = http.createServer(handler);
  await server.listen(3001);
});

afterAll(async () => {
  await server.close();
});

describe('Servidor HTTP', () => {
  it('deve retornar 200 para home', async () => {
    const res = await fetch('http://localhost:3001/');
    expect(res.status).toBe(200);
  });
});
```

### 3. Testes de Acessibilidade

Verificam conformidade com WCAG.

```javascript
// tests/unit/accessibility.test.js
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Acessibilidade', () => {
  it('imagens devem ter alt text', () => {
    const dom = new JSDOM(html);
    const images = dom.window.document.querySelectorAll('img');
    
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });
});
```

### 4. Testes de Segurança

Verificam proteções contra vulnerabilidades.

```javascript
// tests/unit/security.test.js
import { describe, it, expect } from 'vitest';

describe('Proteção contra XSS', () => {
  const sanitizeHTML = (input) => {
    return input.replace(/<[^>]*>/g, '');
  };

  it('deve remover script tags', () => {
    expect(sanitizeHTML('<script>alert(1)</script>')).toBe('');
  });
});
```

---

## Rodando Testes

### Comandos

```bash
# Todos os testes
npm test

# Em modo watch (re-executa ao salvar)
npm run test:watch

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Com cobertura de código
npm run test:coverage

# Teste específico
npx vitest run tests/unit/validation.test.js
```

### Modo Watch

```bash
npm run test:watch

# Opções úteis no terminal:
# a - Executar todos
# f - Filtrar por nome
# q - Sair
```

---

## Escrevendo Testes

### Estrutura Básica

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Nome do Componente/Função', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  it('deve fazer X quando Y', () => {
    // Arrange (preparar)
    const input = 'valor';
    
    // Act (agir)
    const result = funcao(input);
    
    // Assert (verificar)
    expect(result).toBe('esperado');
  });
});
```

### Patterns Comuns

#### Testar Função pura

```javascript
it('deve somar dois números', () => {
  expect(sum(2, 3)).toBe(5);
});
```

#### Testar Promise

```javascript
it('deve buscar dados', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

#### Testar DOM

```javascript
it('deve renderizar elemento', () => {
  document.body.innerHTML = '<div class="card"></div>';
  const card = document.querySelector('.card');
  expect(card).toBeTruthy();
});
```

#### Testar Evento

```javascript
it('deve chamar callback ao clicar', () => {
  const callback = vi.fn();
  const button = document.createElement('button');
  button.addEventListener('click', callback);
  
  button.click();
  
  expect(callback).toHaveBeenCalledOnce();
});
```

#### Testar Rede

```javascript
it('deve fazer requisição', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: 'test' })
  });
  
  const result = await fetchData();
  
  expect(result.data).toBe('test');
  expect(fetch).toHaveBeenCalledWith('/api/data');
});
```

---

## Mocks e Stubs

### Mock de Função

```javascript
const mockFn = vi.fn();
mockFn('arg');
expect(mockFn).toHaveBeenCalledWith('arg');
```

### Mock de Módulo

```javascript
vi.mock('./module.js', () => ({
  export: vi.fn()
}));
```

### Mock de Fetch

```javascript
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('deve buscar dados', async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1 })
  });
  
  const data = await fetchData();
  expect(data.id).toBe(1);
});
```

### Mock de Timer

```javascript
vi.useFakeTimers();

it('deve executar após delay', () => {
  const callback = vi.fn();
  setTimeout(callback, 1000);
  
  vi.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalled();
});

vi.useRealTimers();
```

---

## Cobertura de Código

### Rodar com Cobertura

```bash
npm run test:coverage
```

### Relatório

O relatório é gerado em `coverage/`:

```
coverage/
├── index.html          # Relatório visual
├── lcov.info           # Formato LCOV
├── coverage-final.json # Dados JSON
└── text-summary.txt    # Resumo em texto
```

### Cobertura Mínima

Configure no `vitest.config.js`:

```javascript
coverage: {
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

---

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Melhores Práticas

### ✅ Faça

- **Teste um conceito por teste** - cada `it` deve verificar uma coisa
- **Nomes descritivos** - "deve retornar erro quando email é inválido"
- **Arrange-Act-Assert** - prepare, acesse, verifique
- **Teste comportamento, não implementação** - foque no "quê", não no "como"
- **Use beforeEach para setup** - mantenha testes independentes
- **Mock externamente** - APIs, filesystem, tempo

### ❌ Não Faça

- **Testes frágeis** - que quebram com mudanças internas
- **Testes acoplados** - que dependem de outros testes
- **Testes lentos** - que demoram para rodar
- **Mocks excessivos** - que escondem bugs
- **Testes óbvios** - que não adicionam valor

### 📝 Exemplos

#### ❌ Ruim

```javascript
it('função retorna string', () => {
  expect(typeof validateEmail('a')).toBe('boolean');
});
```

#### ✅ Bom

```javascript
it('deve rejeitar email sem @', () => {
  expect(validateEmail('invalido')).toBe(false);
});

it('deve aceitar email com domínio válido', () => {
  expect(validateEmail('user@domain.com')).toBe(true);
});
```

---

## Troubleshooting

### Erros Comuns

#### "Cannot find module"

```bash
npm install
```

#### "jsdom is not defined"

Verifique se `environment: 'jsdom'` está no config.

#### Teste falha intermitentemente

Pode ser problema com timers ou estado global. Use `vi.useFakeTimers()`.

#### Coverage baixo

Adicione mais testes para os caminhos não cobertos.

---

*Guia de testes — HBO Max Clone*
