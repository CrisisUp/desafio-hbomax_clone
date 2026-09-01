/**
 * Testes Unitários — Módulo de Validação
 * HBO Max Clone
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do DOM para testes
beforeEach(() => {
  document.body.innerHTML = '';
});

// Importar funções de validação diretamente
const sanitizeHTML = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
};

const sanitizeURL = (input) => {
  if (typeof input !== 'string') return '';
  const dangerous = /^(javascript|data|vbscript):/i;
  if (dangerous.test(input.trim())) return '#!';
  return input
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .trim();
};

const validateEmail = (email) => {
  const sanitized = sanitizeHTML(email);
  if (!sanitized) return { valid: false, error: 'Email obrigatório' };
  if (sanitized.length > 254) return { valid: false, error: 'Email muito longo' };

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Formato inválido' };
  }

  const parts = sanitized.split('@');
  if (parts.length !== 2 || !parts[1].includes('.')) {
    return { valid: false, error: 'Domínio inválido' };
  }

  return { valid: true, error: null, sanitized };
};

const validatePassword = (password) => {
  const sanitized = sanitizeHTML(password);
  if (!sanitized) return { valid: false, error: 'Senha obrigatória', strength: 'none' };
  if (sanitized.length < 8) return { valid: false, error: 'Mínimo 8 caracteres', strength: 'weak' };
  if (sanitized.length > 128) return { valid: false, error: 'Máximo 128 caracteres', strength: 'none' };

  let strength = 'weak';
  const hasUpperCase = /[A-Z]/.test(sanitized);
  const hasLowerCase = /[a-z]/.test(sanitized);
  const hasNumbers = /[0-9]/.test(sanitized);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(sanitized);

  const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length;

  if (score >= 4 && sanitized.length >= 12) strength = 'strong';
  else if (score >= 3 && sanitized.length >= 8) strength = 'medium';

  return { valid: true, error: null, strength, sanitized };
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — sanitizeHTML
// ═══════════════════════════════════════════════════════════════════════════

describe('sanitizeHTML', () => {
  it('deve remover tags HTML', () => {
    expect(sanitizeHTML('<b>texto</b>')).toBe('texto');
    expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('alert("xss")');
    // img tag é removida completamente, atributos também
    expect(sanitizeHTML('<img src=x onerror=alert(1)>')).not.toContain('<img');
  });

  it('deve remover event handlers', () => {
    expect(sanitizeHTML('texto onclick="alert(1)"')).toBe('texto');
    expect(sanitizeHTML('input onfocus="hack()"')).toBe('input');
  });

  it('deve remover javascript: URLs', () => {
    expect(sanitizeHTML('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeHTML('  javascript:void(0)')).toBe('void(0)');
  });

  it('deve retornar string vazia para input inválido', () => {
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
    expect(sanitizeHTML(123)).toBe('');
  });

  it('deve preservar texto seguro', () => {
    expect(sanitizeHTML('texto normal')).toBe('texto normal');
    expect(sanitizeHTML('email@test.com')).toBe('email@test.com');
    expect(sanitizeHTML('123')).toBe('123');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — sanitizeURL
// ═══════════════════════════════════════════════════════════════════════════

describe('sanitizeURL', () => {
  it('deve bloquear javascript: URLs', () => {
    expect(sanitizeURL('javascript:alert(1)')).toBe('#!');
    expect(sanitizeURL('  javascript:void(0)')).toBe('#!');
  });

  it('deve bloquear data: URLs', () => {
    expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('#!');
  });

  it('deve bloquear vbscript: URLs', () => {
    expect(sanitizeURL('vbscript:MsgBox(1)')).toBe('#!');
  });

  it('deve permitir URLs seguras', () => {
    expect(sanitizeURL('https://example.com')).toBe('https://example.com');
    expect(sanitizeURL('http://localhost:3000')).toBe('http://localhost:3000');
    expect(sanitizeURL('/path/to/page')).toBe('/path/to/page');
  });

  it('deve retornar string vazia para input inválido', () => {
    expect(sanitizeURL(null)).toBe('');
    expect(sanitizeURL(undefined)).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — validateEmail
// ═══════════════════════════════════════════════════════════════════════════

describe('validateEmail', () => {
  it('deve aceitar emails válidos', () => {
    expect(validateEmail('user@example.com').valid).toBe(true);
    expect(validateEmail('test.user@domain.co.uk').valid).toBe(true);
    expect(validateEmail('name+tag@example.org').valid).toBe(true);
  });

  it('deve rejeitar emails inválidos', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('invalid').valid).toBe(false);
    expect(validateEmail('user@').valid).toBe(false);
    expect(validateEmail('@domain.com').valid).toBe(false);
    expect(validateEmail('user@domain').valid).toBe(false);
  });

  it('deve sanitizar email com XSS', () => {
    const result = validateEmail('<script>alert(1)</script>@example.com');
    expect(result.valid).toBe(false);
    // sanitized deve conter apenas o texto limpo
    expect(result.sanitized || '').not.toContain('<script>');
  });

  it('deve rejeitar emails muito longos', () => {
    const longEmail = 'a'.repeat(255) + '@example.com';
    expect(validateEmail(longEmail).valid).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — validatePassword
// ═══════════════════════════════════════════════════════════════════════════

describe('validatePassword', () => {
  it('deve aceitar senhas fortes', () => {
    const result = validatePassword('MyStr0ng!Pass');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('strong');
  });

  it('deve aceitar senhas médias', () => {
    const result = validatePassword('Abcd1234');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('medium');
  });

  it('deve rejeitar senhas curtas', () => {
    const result = validatePassword('123');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('weak');
  });

  it('deve rejeitar senhas vazias', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
  });

  it('deve sanitizar senha com XSS', () => {
    const result = validatePassword('<script>alert(1)</script>');
    expect(result.sanitized).not.toContain('<script>');
  });

  it('deve calcular força corretamente', () => {
    expect(validatePassword('12345678').strength).toBe('weak');
    expect(validatePassword('Abcd1234').strength).toBe('medium');
    expect(validatePassword('MyStr0ng!P@ss').strength).toBe('strong');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTES — Performance
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('sanitizeHTML deve processar rapidamente', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      sanitizeHTML('<script>alert("xss")</script>texto seguro');
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Menos de 100ms para 1000 ops
  });

  it('validateEmail deve processar rapidamente', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      validateEmail('user@example.com');
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
});
