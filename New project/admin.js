// ── Login & admin check ───────────────────────────────────────────────────────
const token = localStorage.getItem('pandaCinemaToken');
const gebruiker = JSON.parse(localStorage.getItem('pandaCinemaGebruiker') || 'null');

if (!token) {
  window.location.href = 'login.html';
} else if (!gebruiker || !gebruiker.is_admin) {
  alert('Je hebt geen toegang tot het admin-dashboard.');
  window.location.href = 'index.html';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ── Uitloggen ─────────────────────────────────────────────────────────────────
document.getElementById('uitlog-knop').addEventListener('click', () => {
  localStorage.removeItem('pandaCinemaToken');
  localStorage.removeItem('pandaCinemaGebruiker');
  window.location.href = 'login.html';
});

// ── Stemresultaten laden ──────────────────────────────────────────────────────
async function laadStemresultaten() {
  const lijst = document.getElementById('stemresultaat-lijst');
  const totaalTekst = document.getElementById('totaal-tekst');

  try {
    const response = await fetch('/api/stemresultaten', { headers: authHeaders() });

    if (response.status === 401 || response.status === 403) {
      lijst.innerHTML = '<p style="color:var(--accent)">Geen toegang.</p>';
      return;
    }

    const data = await response.json();
    const { resultaten, totaal } = data;

    totaalTekst.textContent = `Totaal uitgebrachte stemmen: ${totaal}`;

    if (resultaten.length === 0) {
      lijst.innerHTML = '<p class="leeg-tekst">Nog geen films of stemmen.</p>';
      return;
    }

    const maxStemmen = resultaten[0].stemmen || 1;

    lijst.innerHTML = resultaten.map((film, index) => {
      const isWinnaar = index === 0 && film.stemmen > 0;
      const percentage = totaal > 0 ? Math.round((film.stemmen / totaal) * 100) : 0;
      const balkBreedte = maxStemmen > 0 ? Math.round((film.stemmen / maxStemmen) * 100) : 0;

      return `
        <div class="stemresultaat-item${isWinnaar ? ' winnaar' : ''}">
          <div>
            <div class="stemresultaat-naam">${film.title}</div>
            <div class="stemresultaat-studio">${film.studio}</div>
          </div>
          <div class="stemresultaat-balk-wrapper">
            <div class="stemresultaat-balk" style="width: ${balkBreedte}%"></div>
          </div>
          <div class="stemresultaat-getal">${film.stemmen} stem${film.stemmen !== 1 ? 'men' : ''} (${percentage}%)</div>
          ${isWinnaar ? '<span class="winnaar-badge">Winnaar</span>' : ''}
        </div>
      `;
    }).join('');

  } catch {
    lijst.innerHTML = '<p style="color:var(--accent)">Fout bij laden. Controleer of de server draait.</p>';
  }
}

// ── Films laden ───────────────────────────────────────────────────────────────
async function laadFilms() {
  const lijst = document.getElementById('films-lijst');

  try {
    const response = await fetch('/api/films');
    const films = await response.json();

    if (films.length === 0) {
      lijst.innerHTML = '<p class="leeg-tekst">Geen films in de database.</p>';
      return;
    }

    lijst.innerHTML = films.map((film) => `
      <div class="film-rij" data-film-rij="${film.film_id}">
        <div class="film-rij__naam">${film.title}</div>
        <div class="film-rij__studio">${film.studio}</div>
        <div class="film-rij__id">${film.film_id}</div>
        <button class="verwijder-knop" data-verwijder="${film.film_id}">Verwijderen</button>
      </div>
    `).join('');

    // Verwijder-knoppen activeren
    lijst.querySelectorAll('[data-verwijder]').forEach((knop) => {
      knop.addEventListener('click', () => verwijderFilm(knop.dataset.verwijder));
    });

  } catch {
    lijst.innerHTML = '<p style="color:var(--accent)">Fout bij laden van films.</p>';
  }
}

// ── Film verwijderen ──────────────────────────────────────────────────────────
async function verwijderFilm(filmId) {
  const bevestiging = confirm(`Wil je de film "${filmId}" écht verwijderen? Ook alle stemmen op deze film worden verwijderd.`);
  if (!bevestiging) return;

  try {
    const response = await fetch(`/api/films/${filmId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (response.ok) {
      // Rij direct verwijderen uit de DOM
      const rij = document.querySelector(`[data-film-rij="${filmId}"]`);
      if (rij) rij.remove();
      // Stemresultaten herladen
      laadStemresultaten();
    } else {
      const data = await response.json();
      alert(data.error || 'Verwijderen mislukt.');
    }
  } catch {
    alert('Verbindingsfout. Controleer of de server draait.');
  }
}

// ── Film toevoegen ────────────────────────────────────────────────────────────
const toevoegForm = document.getElementById('toevoeg-form');
const toevoegMelding = document.getElementById('toevoeg-melding');

toevoegForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = toevoegForm.elements.title.value.trim();
  const studio = toevoegForm.elements.studio.value.trim();
  const film_id = toevoegForm.elements.film_id.value.trim();

  toevoegMelding.textContent = 'Bezig...';
  toevoegMelding.style.color = 'var(--muted)';

  try {
    const response = await fetch('/api/films', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ title, studio, film_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      toevoegMelding.textContent = data.error || 'Toevoegen mislukt.';
      toevoegMelding.style.color = 'var(--accent)';
      return;
    }

    toevoegMelding.textContent = `Film "${title}" succesvol toegevoegd!`;
    toevoegMelding.style.color = '#4caf50';
    toevoegForm.reset();

    // Lijsten herladen
    laadFilms();
    laadStemresultaten();

  } catch {
    toevoegMelding.textContent = 'Verbindingsfout. Controleer of de server draait.';
    toevoegMelding.style.color = 'var(--accent)';
  }
});

// ── Pagina initialiseren ──────────────────────────────────────────────────────
laadStemresultaten();
laadFilms();

// Resultaten elke 30 seconden automatisch verversen
setInterval(laadStemresultaten, 30000);
