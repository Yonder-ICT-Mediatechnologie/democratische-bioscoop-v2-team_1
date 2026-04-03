/* ═══════════════════════════════════════════════════
   BESTELLEN — bestellingspagina met gast-modus
   ═══════════════════════════════════════════════════ */

const selectedSeatsKey    = "pandaCinemaSelectedSeats";
const selectedFilmKey     = "pandaCinemaSelectedFilm";
const selectedShowtimeKey = "pandaCinemaSelectedShowtime";
const selectedVoteKey     = "pandaCinemaFridayVote";
const seatPrice           = 12;

// ── Auth (gast modus als geen token) ──────────────
const token    = localStorage.getItem("pandaCinemaToken");
const guestMode = !token;

function authHeaders() {
  return {
    "Content-Type":  "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// ── Film catalogus ─────────────────────────────────
const filmCatalog = {
  aladdin: {
    id: "aladdin", title: "Aladdin", genre: "Family", format: "3D",
    language: "NL ondertiteld", hall: "Zaal 2", time: "20:00", duration: "1u 30m",
    posterClass: "order-card__poster--aladdin", posterMark: "Aladdin", studio: "Disney",
  },
  "mike-molly-vieren-feest": {
    id: "mike-molly-vieren-feest", title: "Mike & Molly vieren feest", genre: "Family", format: "2D",
    language: "NL gesproken", hall: "Zaal 3", time: "14:15", duration: "1u 24m",
    posterClass: "order-card__poster--mike-molly", posterMark: "M&M", studio: "Family",
  },
  "lion-king": {
    id: "lion-king", title: "The Lion King", genre: "Family", format: "2D",
    language: "NL gesproken", hall: "Zaal 2", time: "18:45", duration: "1u 58m",
    posterClass: "order-card__poster--lion", posterMark: "Lion King", studio: "Disney",
  },
  "avatar-fire-ash": {
    id: "avatar-fire-ash", title: "Avatar: Fire and Ash", genre: "Sci-fi", format: "IMAX",
    language: "NL ondertiteld", hall: "Zaal 1", time: "21:15", duration: "2u 44m",
    posterClass: "order-card__poster--avatar", posterMark: "Avatar", studio: "Sci-fi event",
  },
  "jurassic-world-rebirth": {
    id: "jurassic-world-rebirth", title: "Jurassic World Rebirth", genre: "Action", format: "2D",
    language: "NL ondertiteld", hall: "Zaal 5", time: "19:30", duration: "2u 06m",
    posterClass: "order-card__poster--avatar", posterMark: "Jurassic", studio: "Universal",
  },
  bershama: {
    id: "bershama", title: "Bershama", genre: "Drama", format: "2D",
    language: "OV", hall: "Zaal 2", time: "20:15", duration: "1u 48m",
    posterClass: "order-card__poster--bershama", posterMark: "Bershama", studio: "Drama",
  },
  "krol-dopalaczy": {
    id: "krol-dopalaczy", title: "Krol Dopalaczy", genre: "Action", format: "2D",
    language: "OV", hall: "Zaal 6", time: "21:00", duration: "1u 42m",
    posterClass: "order-card__poster--krol", posterMark: "Krol", studio: "Action",
  },
  "project-hail-mary": {
    id: "project-hail-mary", title: "Project Hail Mary", genre: "Sci-fi", format: "3D",
    language: "NL ondertiteld", hall: "Zaal 1", time: "20:45", duration: "2u 12m",
    posterClass: "order-card__poster--hail-mary", posterMark: "Hail Mary", studio: "Sci-fi",
  },
  "super-charlie": {
    id: "super-charlie", title: "Super Charlie", genre: "Kids", format: "2D",
    language: "NL gesproken", hall: "Zaal 4", time: "13:30", duration: "1u 20m",
    posterClass: "order-card__poster--super-charlie", posterMark: "Charlie", studio: "Family fun",
  },
  jumpers: {
    id: "jumpers", title: "Jumpers", genre: "Kids", format: "2D",
    language: "NL gesproken", hall: "Zaal 3", time: "12:15", duration: "1u 28m",
    posterClass: "order-card__poster--jumpers", posterMark: "Jumpers", studio: "Animation",
  },
  goat: {
    id: "goat", title: "GOAT", genre: "Comedy", format: "2D",
    language: "NL gesproken", hall: "Zaal 2", time: "15:00", duration: "1u 18m",
    posterClass: "order-card__poster--goat", posterMark: "GOAT", studio: "Comedy",
  },
  "miss-moxy": {
    id: "miss-moxy", title: "Miss Moxy", genre: "Adventure", format: "2D",
    language: "NL gesproken", hall: "Zaal 5", time: "14:45", duration: "1u 26m",
    posterClass: "order-card__poster--miss-moxy", posterMark: "Moxy", studio: "Adventure",
  },
  "zootropolis-2": {
    id: "zootropolis-2", title: "ZooTropolis 2", genre: "Family", format: "2D",
    language: "NL gesproken", hall: "Zaal 1", time: "16:10", duration: "1u 39m",
    posterClass: "order-card__poster--zootropolis", posterMark: "Zoo 2", studio: "Family",
  },
  "spongebob-op-piratenpad": {
    id: "spongebob-op-piratenpad", title: "Spongebob op piratenpad", genre: "Comedy", format: "2D",
    language: "NL gesproken", hall: "Zaal 4", time: "11:50", duration: "1u 16m",
    posterClass: "order-card__poster--spongebob", posterMark: "Spongebob", studio: "Comedy",
  },
  "mario-galaxy": {
    id: "mario-galaxy", title: "Mario Galaxy", genre: "Adventure", format: "3D",
    language: "NL gesproken", hall: "Zaal 6", time: "17:25", duration: "1u 34m",
    posterClass: "order-card__poster--mario", posterMark: "Mario", studio: "Adventure",
  },
};

const defaultFilm  = filmCatalog.aladdin;
const defaultSeats = ["B6","B7","B8"];

// ── DOM elementen ──────────────────────────────────
const orderTitle    = document.querySelector("[data-order-title]");
const orderGenre    = document.querySelector("[data-order-genre]");
const orderFormat   = document.querySelector("[data-order-format]");
const orderLanguage = document.querySelector("[data-order-language]");
const orderDate     = document.querySelector("[data-order-date]");
const orderTime     = document.querySelector("[data-order-time]");
const orderHall     = document.querySelector("[data-order-hall]");
const orderDuration = document.querySelector("[data-order-duration]");
const orderSeats    = document.querySelector("[data-order-seats]");
const orderCount    = document.querySelector("[data-order-count]");
const orderSubtotal = document.querySelector("[data-order-subtotal]");
const orderTotal    = document.querySelector("[data-order-total]");
const orderPoster      = document.querySelector("[data-order-poster]");
const orderPosterMark  = document.querySelector("[data-order-poster-mark]");
const orderStudio      = document.querySelector(".order-card__studio");
const paymentButtons   = Array.from(document.querySelectorAll("[data-payment-method]"));
const payNowButton     = document.querySelector("[data-pay-now]");
const checkoutMessage  = document.querySelector("[data-checkout-message]");
const guestEmailBox    = document.getElementById("guest-email-box");
const guestEmailInput  = document.getElementById("guest-email-input");

let selectedPaymentMethod = "";

// ── Gast modus UI ─────────────────────────────────
if (guestMode && guestEmailBox) {
  guestEmailBox.style.display = "block";
}

// ── Laden uit localStorage ─────────────────────────
function getSelectedSeats() {
  try {
    const raw    = window.localStorage.getItem(selectedSeatsKey);
    const parsed = raw ? JSON.parse(raw) : defaultSeats;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultSeats;
  } catch { return defaultSeats; }
}

function getSelectedFilm() {
  try {
    const raw = window.localStorage.getItem(selectedFilmKey);
    if (!raw) {
      const fallbackId = window.localStorage.getItem(selectedVoteKey);
      return filmCatalog[fallbackId] || defaultFilm;
    }
    const parsed = JSON.parse(raw);
    return filmCatalog[parsed.id] || defaultFilm;
  } catch { return defaultFilm; }
}

function getSelectedShowtime() {
  try { return JSON.parse(localStorage.getItem(selectedShowtimeKey)) || null; }
  catch { return null; }
}

// ── Hulpfuncties ───────────────────────────────────
function formatCurrency(amount) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency", currency: "EUR", minimumFractionDigits: 2,
  }).format(amount).replace(/\s/g, "");
}

function getNextFriday() {
  const today   = new Date();
  const friday  = new Date(today);
  const diff    = (5 - friday.getDay() + 7) % 7 || 7;
  friday.setDate(friday.getDate() + diff);
  return friday.toLocaleDateString("nl-NL", { day:"2-digit", month:"2-digit", year:"numeric" });
}

// ── Bestellingsoverzicht renderen ──────────────────
function renderOrder() {
  const seats    = getSelectedSeats();
  const film     = getSelectedFilm();
  const showtime = getSelectedShowtime();
  const total    = seats.length * seatPrice;

  // Gebruik geselecteerde speeltijd als die beschikbaar is
  const displayTime = showtime?.time   || film.time;
  const displayHall = showtime?.hall   || film.hall;
  const displayDate = showtime?.date   || getNextFriday();
  const displayFmt  = showtime?.format || `${film.format} · ${film.language}`;

  orderTitle.textContent    = film.title;
  orderGenre.textContent    = film.genre;
  orderFormat.textContent   = displayFmt.split("·")[0].trim();
  orderLanguage.textContent = displayFmt.includes("·") ? displayFmt.split("·")[1].trim() : film.language;
  orderDate.textContent     = displayDate;
  orderTime.textContent     = displayTime;
  orderHall.textContent     = displayHall;
  orderDuration.textContent = film.duration;
  orderCount.textContent    = `${seats.length}x standaard stoel`;
  orderSubtotal.textContent = formatCurrency(total);
  orderTotal.textContent    = formatCurrency(total);
  orderPosterMark.textContent = film.posterMark;
  orderStudio.textContent   = film.studio;
  orderPoster.className     = `order-card__poster ${film.posterClass}`;

  orderSeats.innerHTML = seats
    .map(seat => `<span class="order-seat-pill">${seat} standaard</span>`)
    .join("");
}

// ── Aankoop opslaan (ingelogde gebruiker) ──────────
async function slaAankoopOp() {
  if (guestMode) return; // Gast: geen DB opslag
  const seats    = getSelectedSeats();
  const film     = getSelectedFilm();
  const showtime = getSelectedShowtime();
  const total    = formatCurrency(seats.length * seatPrice);

  try {
    const response = await fetch("/api/aankopen", {
      method:  "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        film_id:    film.id,
        film_title: film.title,
        film_hall:  (showtime?.hall || film.hall).replace("#",""),
        film_time:  showtime?.time || film.time,
        seats,
        total,
        date_label: showtime?.date || getNextFriday(),
      }),
    });
    if (response.status === 401) {
      localStorage.removeItem("pandaCinemaToken");
      window.location.href = "login.html";
    }
  } catch {
    console.warn("Aankoop kon niet worden opgeslagen in de database.");
  }
}

// ── Betaalmethode selectie ─────────────────────────
function updatePaymentState() {
  if (guestMode) {
    // Gast: ook e-mail verplicht
    const emailOk = guestEmailInput && guestEmailInput.value.trim().includes("@");
    payNowButton.disabled = !selectedPaymentMethod || !emailOk;
  } else {
    payNowButton.disabled = !selectedPaymentMethod;
  }
}

paymentButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedPaymentMethod = button.dataset.paymentMethod || "";
    paymentButtons.forEach(item => {
      const isSelected = item === button;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    checkoutMessage.textContent = `Betaalmethode gekozen: ${selectedPaymentMethod}.`;
    updatePaymentState();
  });
});

// Valideer gast e-mail live
if (guestEmailInput) {
  guestEmailInput.addEventListener("input", updatePaymentState);
}

// ── Betalen ────────────────────────────────────────
payNowButton.addEventListener("click", async () => {
  if (!selectedPaymentMethod) return;

  if (guestMode) {
    const email = guestEmailInput?.value?.trim();
    if (!email || !email.includes("@")) {
      guestEmailInput?.focus();
      checkoutMessage.textContent = "Vul een geldig e-mailadres in om je tickets te ontvangen.";
      checkoutMessage.style.color = "var(--accent)";
      return;
    }
  }

  payNowButton.disabled     = true;
  payNowButton.textContent  = "Verwerken...";

  await slaAankoopOp();

  const totalText = orderTotal.textContent;

  if (guestMode) {
    const email = guestEmailInput.value.trim();
    checkoutMessage.innerHTML = `
      Demo betaling gelukt via ${selectedPaymentMethod} voor ${totalText}.<br>
      <span style="opacity:.7; font-size:.9em;">✉ Tickets worden verstuurd naar <strong>${email}</strong></span>
    `;
  } else {
    checkoutMessage.textContent = `Demo betaling gestart via ${selectedPaymentMethod} voor ${totalText}.`;
  }

  payNowButton.textContent = "Betaald ✓";
});

// ── Init ───────────────────────────────────────────
renderOrder();
updatePaymentState();
