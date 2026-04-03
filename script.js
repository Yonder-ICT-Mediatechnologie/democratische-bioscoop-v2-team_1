const scheduleData = {
  today: [
    {
      title: "Aladdin",
      age: "6+",
      language: "NL gesproken",
      times: ["12:30", "15:15", "18:00", "21:30"],
    },
    {
      title: "Avatar: Fire and Ash",
      age: "12+",
      language: "NL ondertiteld",
      times: ["10:45", "13:00", "16:30", "20:00"],
    },
    {
      title: "Project Hail Mary",
      age: "12+",
      language: "NL ondertiteld",
      times: ["09:30", "12:15", "17:30", "22:30"],
    },
    {
      title: "Super Charlie",
      age: "6+",
      language: "NL gesproken",
      times: ["13:30", "14:45", "19:00", "21:00"],
    },
  ],
  tomorrow: [
    {
      title: "Aladdin",
      age: "6+",
      language: "NL gesproken",
      times: ["11:30", "14:00", "17:30", "20:15"],
    },
    {
      title: "Avatar: Fire and Ash",
      age: "12+",
      language: "NL ondertiteld",
      times: ["10:15", "12:45", "15:30", "19:45"],
    },
    {
      title: "Project Hail Mary",
      age: "12+",
      language: "NL ondertiteld",
      times: ["11:00", "14:20", "18:10", "22:10"],
    },
    {
      title: "Super Charlie",
      age: "6+",
      language: "NL gesproken",
      times: ["12:50", "16:10", "20:10", "22:45"],
    },
  ],
  saturday: [
    {
      title: "Aladdin",
      age: "6+",
      language: "NL gesproken",
      times: ["10:00", "12:30", "15:00", "18:00"],
    },
    {
      title: "Avatar: Fire and Ash",
      age: "12+",
      language: "NL ondertiteld",
      times: ["10:30", "13:15", "16:00", "19:00"],
    },
    {
      title: "Project Hail Mary",
      age: "12+",
      language: "NL ondertiteld",
      times: ["11:45", "15:10", "18:45", "22:20"],
    },
    {
      title: "Super Charlie",
      age: "6+",
      language: "NL gesproken",
      times: ["12:10", "14:40", "19:20", "21:50"],
    },
  ],
  sunday: [
    {
      title: "Aladdin",
      age: "6+",
      language: "NL gesproken",
      times: ["11:00", "13:30", "16:00", "18:45"],
    },
    {
      title: "Avatar: Fire and Ash",
      age: "12+",
      language: "NL ondertiteld",
      times: ["10:45", "13:00", "15:45", "18:30"],
    },
    {
      title: "Project Hail Mary",
      age: "12+",
      language: "NL ondertiteld",
      times: ["12:00", "15:20", "19:00", "22:00"],
    },
    {
      title: "Super Charlie",
      age: "6+",
      language: "NL gesproken",
      times: ["13:15", "16:15", "20:00", "22:30"],
    },
  ],
};

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".hero-dot"));
const prevButton = document.querySelector('[data-slide-action="prev"]');
const nextButton = document.querySelector('[data-slide-action="next"]');
const dayButtons = Array.from(document.querySelectorAll(".day-tab"));
const scheduleBody = document.querySelector("[data-schedule-body]");
const voteButtons = Array.from(document.querySelectorAll("[data-vote-button]"));

let currentSlide = 0;
let autoPlayId;

if (mobileMenuBtn && mobileNav) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.add("hidden");
    });
  });
}

function renderSchedule(dayKey) {
  if (!scheduleBody || dayButtons.length === 0) {
    return;
  }

  const rows = scheduleData[dayKey] || [];

  scheduleBody.innerHTML = rows
    .map(
      (row) => `
        <div class="schedule-row">
          <div class="schedule-cell" data-label="Film">
            <span class="schedule-film">${row.title}</span>
          </div>
          <div class="schedule-cell" data-label="Leeftijd">
            <span class="age-badge">${row.age}</span>
          </div>
          <div class="schedule-cell" data-label="Taal">
            <span class="lang-badge">${row.language}</span>
          </div>
          <div class="schedule-cell" data-label="Speeltijden">
            <div class="time-list">
              ${row.times.map((time) => `<span class="time-pill">${time}</span>`).join("")}
            </div>
          </div>
        </div>
      `
    )
    .join("");

  dayButtons.forEach((button) => {
    const isActive = button.dataset.day === dayKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function showSlide(nextIndex) {
  if (slides.length === 0 || dots.length === 0) {
    return;
  }

  currentSlide = (nextIndex + slides.length) % slides.length;

  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === currentSlide);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentSlide);
  });
}

function startAutoplay() {
  if (slides.length === 0) {
    return;
  }

  window.clearInterval(autoPlayId);
  autoPlayId = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 6000);
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startAutoplay();
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startAutoplay();
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slideIndex));
    startAutoplay();
  });
});

dayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderSchedule(button.dataset.day);
  });
});

voteButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const originalText = button.textContent;
    button.textContent = "\u2713 Gestemd!";
    button.classList.remove("bg-red-600", "hover:bg-red-700");
    button.classList.add("bg-green-600");

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("bg-green-600");
      button.classList.add("bg-red-600", "hover:bg-red-700");
    }, 2000);
  });
});

renderSchedule("today");
showSlide(0);
startAutoplay();
