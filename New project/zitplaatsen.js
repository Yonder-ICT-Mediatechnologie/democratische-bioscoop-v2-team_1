/* ═══════════════════════════════════════════════════
   ZITPLAATSEN — stoelen + film & tijdstip selectie
   ═══════════════════════════════════════════════════ */

// ── Storage sleutels ───────────────────────────────
const storageKey          = "pandaCinemaSelectedSeats";
const selectedFilmKey     = "pandaCinemaSelectedFilm";
const selectedShowtimeKey = "pandaCinemaSelectedShowtime";

// ── Film catalogus (naam per ID) ───────────────────
const filmSelectionCatalog = {
  aladdin:                   "Aladdin",
  "lion-king":               "The Lion King",
  "avatar-fire-ash":         "Avatar: Fire and Ash",
  "jurassic-world-rebirth":  "Jurassic World Rebirth",
  "mike-molly-vieren-feest": "Mike & Molly vieren feest",
  bershama:                  "Bershama",
  "krol-dopalaczy":          "Krol Dopalaczy",
  "project-hail-mary":       "Project Hail Mary",
  "super-charlie":           "Super Charlie",
  jumpers:                   "Jumpers",
  goat:                      "GOAT",
  "miss-moxy":               "Miss Moxy",
  "zootropolis-2":           "ZooTropolis 2",
  "spongebob-op-piratenpad": "Spongebob op piratenpad",
  "mario-galaxy":            "Mario Galaxy",
};

// ── Speeltijden per film (mockup) ──────────────────
const filmShowtimes = {
  aladdin: [
    { date: "Vr 3 apr",  time: "20:00", hall: "Zaal 2", format: "3D · NL ondertiteld" },
    { date: "Za 4 apr",  time: "14:00", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "17:30", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "15:30", hall: "Zaal 2", format: "3D · NL ondertiteld" },
  ],
  "lion-king": [
    { date: "Vr 3 apr",  time: "18:45", hall: "Zaal 2", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "16:00", hall: "Zaal 2", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "13:00", hall: "Zaal 3", format: "2D · NL gesproken" },
  ],
  "avatar-fire-ash": [
    { date: "Vr 3 apr",  time: "21:15", hall: "Zaal 1", format: "IMAX · NL ondertiteld" },
    { date: "Za 4 apr",  time: "16:45", hall: "Zaal 1", format: "IMAX · NL ondertiteld" },
    { date: "Za 4 apr",  time: "21:00", hall: "Zaal 1", format: "3D · NL ondertiteld" },
    { date: "Zo 5 apr",  time: "19:30", hall: "Zaal 1", format: "IMAX · NL ondertiteld" },
  ],
  "jurassic-world-rebirth": [
    { date: "Vr 3 apr",  time: "19:30", hall: "Zaal 5", format: "2D · NL ondertiteld" },
    { date: "Za 4 apr",  time: "20:15", hall: "Zaal 5", format: "2D · NL ondertiteld" },
    { date: "Zo 5 apr",  time: "17:00", hall: "Zaal 5", format: "2D · NL ondertiteld" },
  ],
  "mike-molly-vieren-feest": [
    { date: "Za 4 apr",  time: "11:00", hall: "Zaal 3", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "14:15", hall: "Zaal 3", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "11:00", hall: "Zaal 3", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "14:15", hall: "Zaal 3", format: "2D · NL gesproken" },
  ],
  bershama: [
    { date: "Vr 3 apr",  time: "20:15", hall: "Zaal 2", format: "2D · OV" },
    { date: "Za 4 apr",  time: "21:30", hall: "Zaal 6", format: "2D · OV" },
    { date: "Zo 5 apr",  time: "20:00", hall: "Zaal 6", format: "2D · OV" },
  ],
  "krol-dopalaczy": [
    { date: "Vr 3 apr",  time: "21:00", hall: "Zaal 6", format: "2D · OV" },
    { date: "Za 4 apr",  time: "22:00", hall: "Zaal 6", format: "2D · OV" },
    { date: "Zo 5 apr",  time: "21:15", hall: "Zaal 6", format: "2D · OV" },
  ],
  "project-hail-mary": [
    { date: "Vr 3 apr",  time: "20:45", hall: "Zaal 1", format: "3D · NL ondertiteld" },
    { date: "Za 4 apr",  time: "19:30", hall: "Zaal 1", format: "3D · NL ondertiteld" },
    { date: "Zo 5 apr",  time: "20:30", hall: "Zaal 1", format: "3D · NL ondertiteld" },
  ],
  "super-charlie": [
    { date: "Za 4 apr",  time: "10:30", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "13:30", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "10:30", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "13:30", hall: "Zaal 4", format: "2D · NL gesproken" },
  ],
  jumpers: [
    { date: "Za 4 apr",  time: "10:00", hall: "Zaal 3", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "12:15", hall: "Zaal 3", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "12:15", hall: "Zaal 3", format: "2D · NL gesproken" },
  ],
  goat: [
    { date: "Za 4 apr",  time: "11:30", hall: "Zaal 2", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "15:00", hall: "Zaal 2", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "14:00", hall: "Zaal 2", format: "2D · NL gesproken" },
  ],
  "miss-moxy": [
    { date: "Za 4 apr",  time: "10:15", hall: "Zaal 5", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "14:45", hall: "Zaal 5", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "13:30", hall: "Zaal 5", format: "2D · NL gesproken" },
  ],
  "zootropolis-2": [
    { date: "Za 4 apr",  time: "12:00", hall: "Zaal 1", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "16:10", hall: "Zaal 1", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "11:30", hall: "Zaal 1", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "15:45", hall: "Zaal 1", format: "2D · NL gesproken" },
  ],
  "spongebob-op-piratenpad": [
    { date: "Za 4 apr",  time: "10:00", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Za 4 apr",  time: "11:50", hall: "Zaal 4", format: "2D · NL gesproken" },
    { date: "Zo 5 apr",  time: "10:00", hall: "Zaal 4", format: "2D · NL gesproken" },
  ],
  "mario-galaxy": [
    { date: "Vr 3 apr",  time: "17:25", hall: "Zaal 6", format: "3D · NL gesproken" },
    { date: "Za 4 apr",  time: "15:00", hall: "Zaal 6", format: "3D · NL gesproken" },
    { date: "Za 4 apr",  time: "18:30", hall: "Zaal 6", format: "3D · NL gesproken" },
    { date: "Zo 5 apr",  time: "16:00", hall: "Zaal 6", format: "3D · NL gesproken" },
  ],
};

// ── Stoelen lay-out ────────────────────────────────
const seatLayout = {
  A: ["unavailable","unavailable","available","available","available","available","available","available","available","available"],
  B: ["available","available","available","occupied","occupied","available","available","available","available","available"],
  C: ["available","available","available","occupied","occupied","occupied","occupied","available","available","available"],
  D: ["available","occupied","occupied","occupied","occupied","occupied","available","occupied","occupied","available"],
  E: ["available","available","available","occupied","occupied","occupied","available","available","available","available"],
  F: ["available","available","available","available","occupied","occupied","occupied","available","available","available"],
};

const defaultSelectedSeats = ["B6","B7","B8"];

const seatMap     = document.querySelector("[data-seat-map]");
const seatSummary = document.querySelector("[data-seat-summary]");
const payButton   = document.querySelector("[data-pay-button]");

let selectedSeats = getStoredSelectedSeats();

// ── Stoelen opslaan / laden ────────────────────────
function getStoredSelectedSeats() {
  try {
    const raw    = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : defaultSelectedSeats;
    if (!Array.isArray(parsed)) return [...defaultSelectedSeats];
    return parsed.filter(seatId => {
      const row   = seatId.charAt(0);
      const index = Number(seatId.slice(1)) - 1;
      return seatLayout[row]?.[index] === "available";
    });
  } catch { return [...defaultSelectedSeats]; }
}

function saveSelectedSeats() {
  try { window.localStorage.setItem(storageKey, JSON.stringify(selectedSeats)); }
  catch {}
}

// ── Stoelen renderen ───────────────────────────────
function getSeatVisualState(rowLabel, seatNumber) {
  const baseState = seatLayout[rowLabel][seatNumber - 1];
  const seatId    = `${rowLabel}${seatNumber}`;
  if (baseState === "available" && selectedSeats.includes(seatId)) return "selected";
  return baseState;
}

function renderSeatMap() {
  const columnCount = seatLayout.A.length;
  const rows        = Object.keys(seatLayout);

  const numberCells = Array.from({ length: columnCount }, (_, i) =>
    `<div class="seat-map__number">${i + 1}</div>`
  ).join("");

  const rowCells = rows.map(rowLabel => {
    const seats = seatLayout[rowLabel].map((_, index) => {
      const seatNumber = index + 1;
      const seatId     = `${rowLabel}${seatNumber}`;
      const state      = getSeatVisualState(rowLabel, seatNumber);
      const isDisabled = state === "occupied" || state === "unavailable";
      const stateLabel = { available:"beschikbaar", selected:"geselecteerd", occupied:"bezet", unavailable:"niet beschikbaar" }[state];
      return `<button class="seat seat--${state}" type="button" data-seat-id="${seatId}"
                aria-label="Stoel ${seatId}, ${stateLabel}" aria-pressed="${state === 'selected'}"
                ${isDisabled ? "disabled" : ""}></button>`;
    }).join("");
    return `<div class="seat-map__row-label">${rowLabel}</div>${seats}`;
  }).join("");

  seatMap.innerHTML = `<div class="seat-map__corner" aria-hidden="true"></div>${numberCells}${rowCells}`;
}

function updateSummary() {
  if (selectedSeats.length === 0) {
    seatSummary.textContent = "Selecteer jouw stoelen voor de voorstelling.";
    payButton.disabled = true;
    return;
  }
  seatSummary.textContent = `${selectedSeats.length} stoel${selectedSeats.length === 1 ? "" : "en"} geselecteerd: ${selectedSeats.join(", ")}`;
  payButton.disabled = false;
}

seatMap.addEventListener("click", event => {
  const seatButton = event.target.closest("[data-seat-id]");
  if (!seatButton || seatButton.disabled) return;
  const seatId = seatButton.dataset.seatId;
  selectedSeats = selectedSeats.includes(seatId)
    ? selectedSeats.filter(item => item !== seatId)
    : [...selectedSeats, seatId].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  saveSelectedSeats();
  renderSeatMap();
  updateSummary();
});

payButton.addEventListener("click", () => {
  if (selectedSeats.length === 0) return;
  window.location.href = "bestellen.html";
});

// ── Film dropdown ──────────────────────────────────
const filmDropdown   = document.getElementById("film-dropdown");
const timesContainer = document.getElementById("show-picker-times");
const timesGroup     = document.getElementById("times-group");

// Vul dropdown
Object.entries(filmSelectionCatalog).forEach(([id, title]) => {
  const option = document.createElement("option");
  option.value       = id;
  option.textContent = title;
  filmDropdown.appendChild(option);
});

// Pre-selecteer vanuit URL param
const urlParams = new URLSearchParams(window.location.search);
const urlFilmId = urlParams.get("film");
if (urlFilmId && filmSelectionCatalog[urlFilmId]) {
  filmDropdown.value = urlFilmId;
  slaFilmOp(urlFilmId);
  renderShowtimes(urlFilmId);
}

filmDropdown.addEventListener("change", () => {
  const filmId = filmDropdown.value;
  if (!filmId) { timesGroup.style.display = "none"; return; }
  slaFilmOp(filmId);
  renderShowtimes(filmId);
});

function slaFilmOp(filmId) {
  try {
    window.localStorage.setItem(selectedFilmKey, JSON.stringify({
      id:    filmId,
      title: filmSelectionCatalog[filmId],
    }));
  } catch {}
}

// ── Speeltijden renderen ───────────────────────────
function renderShowtimes(filmId) {
  const times = filmShowtimes[filmId] || [];
  if (times.length === 0) { timesGroup.style.display = "none"; return; }

  timesGroup.style.display = "block";

  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(selectedShowtimeKey)); } catch {}

  timesContainer.innerHTML = times.map(st => {
    const isActive = stored && stored.time === st.time && stored.hall === st.hall && stored.date === st.date;
    return `
      <button type="button" class="time-slot-btn ${isActive ? "is-active" : ""}"
        data-date="${st.date}" data-time="${st.time}" data-hall="${st.hall}" data-format="${st.format}">
        <span class="time-slot-date">${st.date}</span>
        <span class="time-slot-time">${st.time}</span>
        <span class="time-slot-hall">${st.hall}</span>
        <span class="time-slot-format">${st.format}</span>
      </button>`;
  }).join("");

  timesContainer.querySelectorAll(".time-slot-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      timesContainer.querySelectorAll(".time-slot-btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      try {
        localStorage.setItem(selectedShowtimeKey, JSON.stringify({
          date:   btn.dataset.date,
          time:   btn.dataset.time,
          hall:   btn.dataset.hall,
          format: btn.dataset.format,
        }));
      } catch {}
    });
  });

  // Auto-selecteer de eerste als er niets is opgeslagen voor déze film
  const alreadySelected = stored && times.some(st => st.time === stored.time && st.hall === stored.hall && st.date === stored.date);
  if (!alreadySelected) {
    timesContainer.querySelector(".time-slot-btn")?.click();
  }
}

// ── Init ───────────────────────────────────────────
renderSeatMap();
updateSummary();
saveSelectedSeats();
