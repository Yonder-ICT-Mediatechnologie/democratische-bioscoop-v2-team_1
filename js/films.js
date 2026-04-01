// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileNav.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
    });
});

// Carousel Navigation - Nu te zien
const nuTeZienCarousel = document.getElementById('nuTeZienCarousel');
const nuTeZienPrev = document.getElementById('nuTeZienPrev');
const nuTeZienNext = document.getElementById('nuTeZienNext');

if (nuTeZienCarousel && nuTeZienPrev && nuTeZienNext) {
    nuTeZienPrev.addEventListener('click', () => {
        const carousel = nuTeZienCarousel.querySelector('div');
        carousel.scrollLeft -= 300;
    });

    nuTeZienNext.addEventListener('click', () => {
        const carousel = nuTeZienCarousel.querySelector('div');
        carousel.scrollLeft += 300;
    });
}

// Carousel Navigation - Kids
const kidsCarousel = document.getElementById('kidsCarousel');
const kidsPrev = document.getElementById('kidsPrev');
const kidsNext = document.getElementById('kidsNext');

if (kidsCarousel && kidsPrev && kidsNext) {
    kidsPrev.addEventListener('click', () => {
        const carousel = kidsCarousel.querySelector('div');
        carousel.scrollLeft -= 300;
    });

    kidsNext.addEventListener('click', () => {
        const carousel = kidsCarousel.querySelector('div');
        carousel.scrollLeft += 300;
    });
}

// Search functionality
const searchInput = document.getElementById('searchInput');
const carouselNavButtons = [nuTeZienPrev, nuTeZienNext, kidsPrev, kidsNext].filter(Boolean);

const searchContainer = searchInput?.closest('.max-w-7xl');
const noResultsMessage = document.createElement('p');
noResultsMessage.id = 'noResultsMessage';
noResultsMessage.className = 'hidden mt-4 text-center text-red-400 font-semibold';
noResultsMessage.textContent = 'Geen resultaten gevonden voor je zoekopdracht.';

if (searchContainer) {
    searchContainer.appendChild(noResultsMessage);
}

function toggleCarouselArrows(showArrows) {
    carouselNavButtons.forEach(button => {
        button.style.display = showArrows ? '' : 'none';
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let visibleResults = 0;

        // Search in both carousels
        const allCarousels = document.querySelectorAll('[id$="Carousel"]');

        allCarousels.forEach(carousel => {
            const filmItems = carousel.querySelectorAll('.flex-shrink-0');
            filmItems.forEach(item => {
                const filmTitle = item.querySelector('p')?.textContent.toLowerCase() || '';
                if (filmTitle.includes(searchTerm) || searchTerm === '') {
                    item.style.display = 'block';
                    visibleResults += 1;
                } else {
                    item.style.display = 'none';
                }
            });
        });

        const hasNoResults = searchTerm !== '' && visibleResults === 0;
        noResultsMessage.classList.toggle('hidden', !hasNoResults);
        toggleCarouselArrows(!hasNoResults);
    });
}
