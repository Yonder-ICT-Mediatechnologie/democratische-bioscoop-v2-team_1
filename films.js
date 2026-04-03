const searchForm = document.querySelector("[data-film-search]");
const searchInput = document.querySelector("#film-search");
const searchCards = Array.from(document.querySelectorAll("[data-search-card]"));
const catalogSections = Array.from(document.querySelectorAll("[data-catalog-section]"));
const emptyState = document.querySelector("[data-empty-state]");

function filterCatalog(query) {
  let visibleCount = 0;

  searchCards.forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const category = (card.dataset.category || "").toLowerCase();
    const matches = !query || title.includes(query) || category.includes(query);

    card.hidden = !matches;

    if (matches) {
      visibleCount += 1;
    }
  });

  catalogSections.forEach((section) => {
    const sectionCards = Array.from(section.querySelectorAll("[data-search-card]"));
    const hasVisibleCards = sectionCards.some((card) => !card.hidden);
    section.hidden = !hasVisibleCards;
  });

  emptyState.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", () => {
  filterCatalog(searchInput.value.trim().toLowerCase());
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterCatalog(searchInput.value.trim().toLowerCase());
  searchInput.focus();
});

filterCatalog("");
