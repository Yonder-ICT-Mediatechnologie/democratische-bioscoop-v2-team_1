const registerForm = document.querySelector('[data-register-form]');
const registerFeedback = document.querySelector('[data-register-feedback]');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = registerForm.elements.username.value.trim();
  const email = registerForm.elements.email.value.trim();
  const password = registerForm.elements.password.value;
  const passwordRepeat = registerForm.elements.passwordRepeat.value;

  if (password !== passwordRepeat) {
    registerFeedback.textContent = 'Wachtwoorden komen niet overeen.';
    registerFeedback.style.color = 'var(--accent)';
    return;
  }

  registerFeedback.textContent = 'Bezig met registreren...';
  registerFeedback.style.color = 'var(--muted)';

  try {
    const response = await fetch('/api/registreren', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      registerFeedback.textContent = data.error || 'Registreren mislukt.';
      registerFeedback.style.color = 'var(--accent)';
      return;
    }

    registerFeedback.textContent = 'Account aangemaakt! Je wordt doorgestuurd naar de loginpagina...';
    registerFeedback.style.color = '#4caf50';

    registerForm.elements.password.value = '';
    registerForm.elements.passwordRepeat.value = '';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);

  } catch (error) {
    registerFeedback.textContent = 'Verbindingsfout. Is de server gestart?';
    registerFeedback.style.color = 'var(--accent)';
  }
});
