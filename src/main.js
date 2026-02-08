const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const emailInput = document.getElementById('email');
const emailMaskText = document.getElementById('email-mask');

passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;
  let score = 0;

  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++; // Letra maiúscula
  if (/[0-9]/.test(value)) score++; // Número
  if (/[^A-Za-z0-9]/.test(value)) score++; // Caractere especial

  // Remove classes anteriores
  strengthBar.classList.remove('weak', 'medium', 'strong');

  if (value.length === 0) {
    strengthText.textContent = '';
  } else if (score <= 2) {
    strengthBar.classList.add('weak');
    strengthText.textContent = 'Senha Fraca ⚠️';
    strengthText.style.color = '#ff4d4d';
  } else if (score === 3) {
    strengthBar.classList.add('medium');
    strengthText.textContent = 'Senha Razoável 🆗';
    strengthText.style.color = '#ffd633';
  } else {
    strengthBar.classList.add('strong');
    strengthText.textContent = 'Senha Forte! 💪';
    strengthText.style.color = '#00ff88';
  }
});

emailInput.addEventListener('input', () => {
  const email = emailInput.value;
  
  if (email.includes('@')) {
    const [user, domain] = email.split('@');
    
    if (user.length > 2) {
      // Mantém os 2 primeiros caracteres e mascara o resto até o @
      const maskedUser = user.substring(0, 2) + "...";
      emailMaskText.textContent = `Logando como: ${maskedUser}@${domain}`;
    } else {
      emailMaskText.textContent = `Logando como: ${user}@${domain}`;
    }
  } else {
    emailMaskText.textContent = '';
  }
});

const fundos = [
  './assets/images/background-movies-series.png',
  './assets/images/DC_Default.webp',
  './assets/images/WB-Default.webp',
  './assets/images/DC-Hover.webp',
  './assets/images/CN-Default.webp',
  './assets/images/MAX-Default.webp'
];

let index = 0;

function alternarFundo() {
  index = (index + 1) % fundos.length;
  document.body.style.backgroundImage = `url(${fundos[index]})`;
}

// Troca a cada 10 segundos para dar um clima dinâmico
setInterval(alternarFundo, 6000);