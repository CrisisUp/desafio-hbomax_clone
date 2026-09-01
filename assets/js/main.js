/**
 * HBO Max Clone — JavaScript Principal
 * Adiciona interatividade ao site estático
 */

// ── DOM Elements ───────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const navbarToggle = document.querySelector('.navbar__toggle');
const navbarActions = document.querySelector('.navbar__actions');
const loginForm = document.querySelector('.login-form');
const galleryCards = document.querySelectorAll('.gallery__card');

// ── Mobile Menu Toggle ─────────────────────────────────────────────────────
function initMobileMenu() {
  if (!navbarToggle || !navbarActions) return;

  navbarToggle.addEventListener('click', () => {
    navbarActions.classList.toggle('navbar__actions--open');
    navbarToggle.setAttribute(
      'aria-expanded',
      navbarActions.classList.contains('navbar__actions--open')
    );
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navbarActions.classList.contains('navbar__actions--open')) {
      navbarActions.classList.remove('navbar__actions--open');
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Smooth Scroll para Links Âncora ────────────────────────────────────────
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ── Formulário de Login (Validação + Sanitização) ──────────────────────────
function initLoginForm() {
  if (!loginForm) return;

  const emailField = loginForm.querySelector('#email');
  const passwordField = loginForm.querySelector('#password');
  const { validateEmail, validatePassword, sanitizeHTML } = window.HBOMaxValidation || {};

  // Validação em tempo real com sanitização
  emailField?.addEventListener('input', (e) => {
    const rawEmail = e.target.value;
    const sanitizedEmail = sanitizeHTML ? sanitizeHTML(rawEmail) : rawEmail;

    // Sanitizar em tempo real (remove caracteres perigosos)
    if (rawEmail !== sanitizedEmail) {
      e.target.value = sanitizedEmail;
      showNotification('Caracteres perigosos removidos do email', 'error');
    }

    // Validar formato
    if (validateEmail) {
      const { valid, error } = validateEmail(sanitizedEmail);
      e.target.setCustomValidity(valid ? '' : error);
    } else {
      // Fallback para validação básica
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail);
      e.target.setCustomValidity(isValid ? '' : 'Por favor, insira um e-mail válido');
    }
  });

  passwordField?.addEventListener('input', (e) => {
    const rawPassword = e.target.value;
    const sanitizedPassword = sanitizeHTML ? sanitizeHTML(rawPassword) : rawPassword;

    // Sanitizar em tempo real
    if (rawPassword !== sanitizedPassword) {
      e.target.value = sanitizedPassword;
      showNotification('Caracteres perigosos removidos da senha', 'error');
    }

    // Validar força e atualizar indicador visual
    const strengthIndicator = document.getElementById('password-strength');
    const strengthText = document.getElementById('password-strength-text');

    if (validatePassword) {
      const { valid, error, strength } = validatePassword(sanitizedPassword);
      e.target.setCustomValidity(valid ? '' : error);

      // Atualizar indicador visual de força
      if (strengthIndicator) {
        strengthIndicator.setAttribute('data-strength', strength);

        // Texto descritivo
        const strengthLabels = {
          weak: 'Fraca',
          medium: 'Média',
          strong: 'Forte',
          none: ''
        };

        if (strengthText) {
          strengthText.textContent = sanitizedPassword ? strengthLabels[strength] : '';
        }
      }
    } else {
      // Fallback para validação básica
      const isValid = sanitizedPassword.length >= 8;
      e.target.setCustomValidity(
        isValid ? '' : 'A senha deve ter pelo menos 8 caracteres'
      );
    }
  });

  // Submit handler com sanitização completa
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitButton = loginForm.querySelector('button[type="submit"]');
    const rawEmail = emailField?.value || '';
    const rawPassword = passwordField?.value || '';

    // Sanitizar TODOS os dados antes de enviar
    const email = sanitizeHTML ? sanitizeHTML(rawEmail) : rawEmail;
    const password = sanitizeHTML ? sanitizeHTML(rawPassword) : rawPassword;

    // Validar novamente no submit
    const emailValidation = validateEmail ? validateEmail(email) : { valid: email.includes('@') };
    const passwordValidation = validatePassword ? validatePassword(password) : { valid: password.length >= 8 };

    if (!emailValidation.valid) {
      showNotification(emailValidation.error, 'error');
      emailField?.focus();
      return;
    }

    if (!passwordValidation.valid) {
      showNotification(passwordValidation.error, 'error');
      passwordField?.focus();
      return;
    }

    // Mostrar estado de loading no botão
    if (submitButton) {
      submitButton.classList.add('button--loading');
      submitButton.disabled = true;
      submitButton.textContent = 'Entrando...';
    }

    // Log seguro (em produção, NÃO logar senhas!)
    console.log('📧 Email validado:', email);
    console.log('🔒 Força da senha:', passwordValidation.strength);

    // Simular chamada à API (em produção, seria fetch/axios)
    setTimeout(() => {
      // Esconder loading
      if (submitButton) {
        submitButton.classList.remove('button--loading');
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
      }

      // Sucesso
      showNotification('Login realizado com sucesso! 🎉', 'success');

      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }, 1500); // Simular delay de rede
  });
}

// ── Cards de Conteúdo (Hover + Skeleton Loading) ──────────────────────────
function initGalleryCards() {
  galleryCards.forEach((card) => {
    const image = card.querySelector('.gallery__image');

    // Skeleton loading para imagens
    if (image) {
      // Adicionar classe de loading enquanto a imagem não carrega
      image.classList.add('gallery__image--loading');

      image.addEventListener('load', () => {
        image.classList.remove('gallery__image--loading');
        image.classList.add('gallery__image--loaded');
      });

      image.addEventListener('error', () => {
        // Fallback para erro de carregamento
        image.classList.remove('gallery__image--loading');
        image.alt = 'Erro ao carregar imagem';
      });
    }

    // Hover effect
    card.addEventListener('mouseenter', () => {
      card.classList.add('gallery__card--hovered');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('gallery__card--hovered');
    });
  });
}

// ── Notificação Toast ──────────────────────────────────────────────────────
function showNotification(message, type = 'info') {
  // Remover notificação existente
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  // Criar notificação
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <span class="notification__message">${message}</span>
    <button class="notification__close" aria-label="Fechar">&times;</button>
  `;

  document.body.appendChild(notification);

  // Animação de entrada
  requestAnimationFrame(() => {
    notification.classList.add('notification--visible');
  });

  // Fechar notificação
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn?.addEventListener('click', () => {
    notification.classList.remove('notification--visible');
    setTimeout(() => notification.remove(), 300);
  });

  // Auto-close após 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('notification--visible');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ── Scroll Animations (Intersection Observer) ──────────────────────────────
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos que devem animar
  const animateElements = document.querySelectorAll(
    '.plans__card, .gallery__card, .hero__content'
  );
  animateElements.forEach((el) => observer.observe(el));
}

// ── Navbar Scroll Effect ───────────────────────────────────────────────────
function initNavbarScroll() {
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Adicionar sombra ao scroll
    if (currentScroll > 50) {
      navbar?.classList.add('navbar--scrolled');
    } else {
      navbar?.classList.remove('navbar--scrolled');
    }

    // Esconder/Mostrar navbar ao scrollar (opcional)
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar?.classList.add('navbar--hidden');
    } else {
      navbar?.classList.remove('navbar--hidden');
    }

    lastScroll = currentScroll;
  });
}

// ── Password Toggle (Mostrar/Ocultar Senha) ──────────────────────────────
function initPasswordToggle() {
  const toggleBtn = document.querySelector('.password-toggle');
  const passwordInput = document.querySelector('#password');

  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener('click', () => {
    const isVisible = toggleBtn.getAttribute('data-visible') === 'true';

    // Toggle password visibility
    passwordInput.type = isVisible ? 'password' : 'text';
    toggleBtn.setAttribute('data-visible', isVisible ? 'false' : 'true');
    toggleBtn.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Ocultar senha');

    // Manter foco no input
    passwordInput.focus();
  });
}

// ── Back to Top Button ────────────────────────────────────────────────────
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  // Mostrar/esconder botão baseado na posição do scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('back-to-top--visible');
    } else {
      backToTopBtn.classList.remove('back-to-top--visible');
    }
  });

  // Scroll para o topo ao clicar
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ── Scroll Progress Indicator ─────────────────────────────────────────────
function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    indicator.style.transform = `scaleX(${scrollPercent / 100})`;
  });
}

// ── Inicializar Tudo ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initLoginForm();
  initGalleryCards();
  initScrollAnimations();
  initNavbarScroll();
  initPasswordToggle();
  initBackToTop();
  initScrollIndicator();

  console.log('🎬 HBO Max Clone — JavaScript carregado com sucesso!');
});
