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

// Search functionality
const searchInput = document.getElementById('searchInput');
const filmCards = document.querySelectorAll('[class*="group cursor-pointer"]');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        filmCards.forEach(card => {
            const filmTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
            if (filmTitle.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Film card click handler
filmCards.forEach(card => {
    card.addEventListener('click', () => {
        const filmTitle = card.querySelector('h3')?.textContent;
        console.log('Film selected:', filmTitle);
        // TODO: Add navigation to film detail page
        // window.location.href = `film-detail.html?film=${filmTitle}`;
    });
});

// Smooth scrolling for mobile carousel
const carousels = document.querySelectorAll('[style*="scroll-behavior"]');
carousels.forEach(carousel => {
    let isScrolling = false;
    
    carousel.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        isScrolling = true;
        const scrollAmount = 300;
        
        if (e.deltaY > 0) {
            carousel.scrollLeft += scrollAmount;
        } else {
            carousel.scrollLeft -= scrollAmount;
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }, { passive: true });
});
