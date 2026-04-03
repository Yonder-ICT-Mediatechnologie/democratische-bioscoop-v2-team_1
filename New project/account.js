// ── Login check ──────────────────────────────────────────────────────────────
const token = localStorage.getItem('pandaCinemaToken');
const opgeslagenGebruiker = JSON.parse(localStorage.getItem('pandaCinemaGebruiker') || 'null');

if (!token) {
  window.location.href = 'login.html';
}

// ── DOM elementen ─────────────────────────────────────────────────────────────
const profileStorageKey = 'pandaCinemaAccountProfile';

const form = document.querySelector('[data-account-form]');
const cancelButton = document.querySelector('[data-account-cancel]');
const greeting = document.querySelector('[data-account-greeting]');
const message = document.querySelector('[data-account-message]');
const purchaseList = document.querySelector('[data-purchase-list]');

// Uitlog-knop toevoegen aan de pagina
const accountActions = document.querySelector('.account-actions');
if (accountActions) {
  const uitlogKnop = document.createElement('button');
  uitlogKnop.className = 'account-action account-action--secondary';
  uitlogKnop.type = 'button';
  uitlogKnop.textContent = 'Uitloggen';
  uitlogKnop.style.marginLeft = 'auto';
  uitlogKnop.addEventListener('click', () => {
    localStorage.removeItem('pandaCinemaToken');
    localStorage.removeItem('pandaCinemaGebruiker');
    window.location.href = 'login.html';
  });
  accountActions.appendChild(uitlogKnop);
}

// ── Profiel (lokaal opgeslagen) ───────────────────────────────────────────────
const fallbackProfiel = {
  firstName: opgeslagenGebruiker ? opgeslagenGebruiker.username : 'Naam',
  lastName: '',
  email: opgeslagenGebruiker ? opgeslagenGebruiker.email : '',
  phone: '',
  birthDate: '',
};

const posterKlassePerFilm = {
  aladdin: 'purchase-card__poster--aladdin',
  'mike-molly-vieren-feest': 'purchase-card__poster--mike-molly',
  'lion-king': 'purchase-card__poster--lion',
  'avatar-fire-ash': 'purchase-card__poster--avatar',
  'jurassic-world-rebirth': 'purchase-card__poster--avatar',
  bershama: 'purchase-card__poster--bershama',
  'krol-dopalaczy': 'purchase-card__poster--krol',
  'project-hail-mary': 'purchase-card__poster--hail-mary',
  'super-charlie': 'purchase-card__poster--super-charlie',
  jumpers: 'purchase-card__poster--jumpers',
  goat: 'purchase-card__poster--goat',
  'miss-moxy': 'purchase-card__poster--miss-moxy',
  'zootropolis-2': 'purchase-card__poster--zootropolis',
  'spongebob-op-piratenpad': 'purchase-card__poster--spongebob',
  'mario-galaxy': 'purchase-card__poster--mario',
};

function getOpgeslagenProfiel() {
  try {
    const raw = localStorage.getItem(profileStorageKey);
    const parsed = raw ? JSON.parse(raw) : fallbackProfiel;
    return { ...fallbackProfiel, ...parsed };
  } catch {
    return { ...fallbackProfiel };
  }
}

function slaProfielOp(profiel) {
  try {
    localStorage.setItem(profileStorageKey, JSON.stringify(profiel));
  } catch {
    return;
  }
}

function vulFormulier(profiel) {
  form.elements.firstName.value = profiel.firstName || '';
  form.elements.lastName.value = profiel.lastName || '';
  form.elements.email.value = profiel.email || '';
  form.elements.phone.value = profiel.phone || '';
  form.elements.birthDate.value = profiel.birthDate || '';

  greeting.textContent = `Welkom, ${profiel.firstName || 'Naam'}`;
}

// ── Aankopen laden via API (per gebruiker) ────────────────────────────────────
function renderAankopen(aankopen) {
  if (!aankopen || aankopen.length === 0) {
    purchaseList.innerHTML = '<p style="color:var(--muted); font-style:italic;">Je hebt nog geen aankopen gedaan.</p>';
    return;
  }

  purchaseList.innerHTML = aankopen
    .map((aankoop) => {
      // Veld namen komen van de database (film_id, film_title, etc.)
      const filmId = aankoop.film_id || aankoop.filmId || 'aladdin';
      const titel = aankoop.film_title || aankoop.title || 'Onbekend';
      const hal = aankoop.film_hall || aankoop.hall || '';
      const tijd = aankoop.film_time || aankoop.time || '';
      const datum = aankoop.date_label || aankoop.dateLabel || '';
      const stoelen = Array.isArray(aankoop.seats) ? aankoop.seats : [];
      const totaal = aankoop.total || '';

      const posterKlasse = posterKlassePerFilm[filmId] || 'purchase-card__poster--aladdin';
      const stoelTags = stoelen.map((stoel) => `<span class="purchase-seat-pill">${stoel}</span>`).join('');

      return `
        <article class="purchase-card">
          <div class="purchase-card__poster ${posterKlasse}">
            <span class="purchase-card__poster-mark">${titel}</span>
          </div>
          <div class="purchase-card__content">
            <h3>${titel}</h3>
            <p>${datum}${datum && tijd ? ', ' : ''}${tijd}${hal ? ' - ' + hal : ''}</p>
            <div class="purchase-card__footer">
              <div class="purchase-seat-group">${stoelTags}</div>
              <span>${totaal}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

async function laadAankopen() {
  purchaseList.innerHTML = '<p style="color:var(--muted);">Aankopen laden...</p>';

  try {
    const response = await fetch('/api/aankopen', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 401) {
      localStorage.removeItem('pandaCinemaToken');
      window.location.href = 'login.html';
      return;
    }

    const aankopen = await response.json();
    renderAankopen(aankopen);
  } catch {
    purchaseList.innerHTML = '<p style="color:var(--muted); font-style:italic;">Aankopen konden niet worden geladen.</p>';
  }
}

// ── Formulier events ──────────────────────────────────────────────────────────
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const profiel = {
    firstName: form.elements.firstName.value.trim(),
    lastName: form.elements.lastName.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    birthDate: form.elements.birthDate.value.trim(),
  };

  slaProfielOp(profiel);
  vulFormulier({ ...fallbackProfiel, ...profiel });
  message.textContent = 'Accountgegevens opgeslagen.';
});

cancelButton.addEventListener('click', () => {
  vulFormulier(getOpgeslagenProfiel());
  message.textContent = 'Wijzigingen teruggezet.';
});

// ── Pagina initialiseren ──────────────────────────────────────────────────────
vulFormulier(getOpgeslagenProfiel());
laadAankopen();
