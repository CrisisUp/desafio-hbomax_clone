/**
 * HBO Max Clone — Validação e Sanitização de Dados
 * Protege contra XSS e garante integridade dos dados
 */

// ── Sanitização Básica (sem dependências externas) ─────────────────────────

/**
 * Remove tags HTML perigosas de uma string
 * @param {string} input - String para sanitizar
 * @returns {string} String sanitizada
 */
function sanitizeHTML(input) {
  if (typeof input !== 'string') return '';

  // Remove tags HTML
  const tagless = input.replace(/<[^>]*>/g, '');

  // Remove scripts
  const scriptless = tagless.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  const eventless = scriptless.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: URLs
  const urless = eventless.replace(/javascript\s*:/gi, '');

  // Decodifica entidades HTML perigosas
  const decoded = urless
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

  return decoded.trim();
}

/**
 * Sanitiza entrada para uso em atributos HTML
 * @param {string} input - String para sanitizar
 * @returns {string} String segura para HTML
 */
function sanitizeForHTML(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitiza entrada para uso em URLs
 * @param {string} input - URL para sanitizar
 * @returns {string} URL segura
 */
function sanitizeURL(input) {
  if (typeof input !== 'string') return '';

  // Remove javascript: e data: URLs
  const dangerous = /^(javascript|data|vbscript):/i;

  if (dangerous.test(input.trim())) {
    return '#!';
  }

  // Remove protocolos perigosos
  return input
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .trim();
}

// ── Validação de Email ─────────────────────────────────────────────────────

/**
 * Valida formato de email
 * @param {string} email - Email para validar
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateEmail(email) {
  const sanitized = sanitizeHTML(email);

  if (!sanitized) {
    return { valid: false, error: 'Email é obrigatório' };
  }

  if (sanitized.length > 254) {
    return { valid: false, error: 'Email muito longo (máx. 254 caracteres)' };
  }

  // Regex RFC 5322 simplificado
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Formato de email inválido' };
  }

  // Verifica domínio com pelo menos um ponto
  const parts = sanitized.split('@');
  if (parts.length !== 2 || !parts[1].includes('.')) {
    return { valid: false, error: 'Domínio do email inválido' };
  }

  return { valid: true, error: null, sanitized };
}

// ── Validação de Senha ─────────────────────────────────────────────────────

/**
 * Valida força da senha
 * @param {string} password - Senha para validar
 * @returns {{ valid: boolean, error: string|null, strength: string }}
 */
function validatePassword(password) {
  const sanitized = sanitizeHTML(password);

  if (!sanitized) {
    return { valid: false, error: 'Senha é obrigatória', strength: 'none' };
  }

  if (sanitized.length < 8) {
    return { valid: false, error: 'Senha deve ter pelo menos 8 caracteres', strength: 'weak' };
  }

  if (sanitized.length > 128) {
    return { valid: false, error: 'Senha muito longa (máx. 128 caracteres)', strength: 'none' };
  }

  // Calcula força da senha
  let strength = 'weak';
  const hasUpperCase = /[A-Z]/.test(sanitized);
  const hasLowerCase = /[a-z]/.test(sanitized);
  const hasNumbers = /[0-9]/.test(sanitized);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(sanitized);

  const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length;

  if (score >= 4 && sanitized.length >= 12) {
    strength = 'strong';
  } else if (score >= 3 && sanitized.length >= 8) {
    strength = 'medium';
  }

  return { valid: true, error: null, strength, sanitized };
}

// ── Validação de Nome ──────────────────────────────────────────────────────

/**
 * Valida nome (se necessário para outros formulários)
 * @param {string} name - Nome para validar
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateName(name) {
  const sanitized = sanitizeHTML(name);

  if (!sanitized) {
    return { valid: false, error: 'Nome é obrigatório' };
  }

  if (sanitized.length < 2) {
    return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (sanitized.length > 100) {
    return { valid: false, error: 'Nome muito longo (máx. 100 caracteres)' };
  }

  // Apenas letras, espaços, hífens e apostrofos
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(sanitized)) {
    return { valid: false, error: 'Nome contém caracteres inválidos' };
  }

  return { valid: true, error: null, sanitized };
}

// ── Validação de Telefone ──────────────────────────────────────────────────

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone para validar
 * @returns {{ valid: boolean, error: string|null }}
 */
function validatePhone(phone) {
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '');

  if (!numbers) {
    return { valid: false, error: 'Telefone é obrigatório' };
  }

  // Formato: DDD + 8-9 dígitos
  if (numbers.length < 10 || numbers.length > 11) {
    return { valid: false, error: 'Telefone deve ter DDD + número (10-11 dígitos)' };
  }

  // Verifica DDD válido (11-99)
  const ddd = parseInt(numbers.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return { valid: false, error: 'DDD inválido' };
  }

  return { valid: true, error: null, sanitized: numbers };
}

// ── Exportar Funções ───────────────────────────────────────────────────────

// Disponibiliza globalmente para uso em main.js
window.HBOMaxValidation = {
  sanitizeHTML,
  sanitizeForHTML,
  sanitizeURL,
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
};

console.log('🛡️  HBO Max Validation — Módulo carregado com sucesso!');
