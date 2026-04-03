const loginForm = document.querySelector('[data-login-form]');
const loginFeedback = document.querySelector('[data-login-feedback]');

// Als al ingelogd, direct doorsturen
const opgeslagenToken = localStorage.getItem('pandaCinemaToken');
if (opgeslagenToken) {
  window.location.href = 'account.html';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const identifier = loginForm.elements.identifier.value.trim();
  const password = loginForm.elements.password.value;

  loginFeedback.textContent = 'Bezig met inloggen...';
  loginFeedback.style.color = 'var(--muted)';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      loginFeedback.textContent = data.error || 'Inloggen mislukt.';
      loginFeedback.style.color = 'var(--accent)';
      return;
    }

    // Token en gebruikersinfo opslaan
    localStorage.setItem('pandaCinemaToken', data.token);
    localStorage.setItem('pandaCinemaGebruiker', JSON.stringify({
      username: data.username,
      email: data.email,
      is_admin: data.is_admin,
    }));

    loginFeedback.textContent = 'Succesvol ingelogd! Je wordt doorgestuurd...';
    loginFeedback.style.color = '#4caf50';

    setTimeout(() => {
      if (data.is_admin) {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'account.html';
      }
    }, 500);

  } catch (error) {
    loginFeedback.textContent = 'Verbindingsfout. Is de server gestart?';
    loginFeedback.style.color = 'var(--accent)';
  }
});
