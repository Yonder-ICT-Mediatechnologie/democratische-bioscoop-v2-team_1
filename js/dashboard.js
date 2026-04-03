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

// Carousel functionality (placeholder for future enhancement)
const prevBtn = document.querySelector('button[class*="left-4"]');
const nextBtn = document.querySelector('button[class*="right-4"]');

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        console.log('Previous slide clicked');
        // Add carousel logic here when needed
    });

    nextBtn.addEventListener('click', () => {
        console.log('Next slide clicked');
        // Add carousel logic here when needed
    });
}

// Filter buttons functionality
const filterButtons = document.querySelectorAll('button[class*="bg-red-600"], button[class*="bg-gray-700"]');
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active state from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-red-600');
            btn.classList.add('bg-gray-700');
        });
        // Add active state to clicked button
        e.target.classList.remove('bg-gray-700');
        e.target.classList.add('bg-red-600');
        
        console.log('Filter:', e.target.textContent);
        // Add filter logic here to update films
    });
});

// Time slot selection
const timeSlots = document.querySelectorAll('[class*="bg-gray-700"][class*="text-white"][class*="px-3"][class*="py-1"]');
timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        // Remove selection from all slots in the same row
        const row = slot.closest('div, td, tr');
        if (row) {
            const rowSlots = row.querySelectorAll('[class*="bg-gray-700"][class*="text-white"]');
            rowSlots.forEach(s => {
                s.classList.remove('bg-red-600');
                s.classList.add('bg-gray-700');
            });
        }
        // Highlight selected slot
        slot.classList.remove('bg-gray-700');
        slot.classList.add('bg-red-600');
        
        console.log('Selected time:', slot.textContent.trim());
        // Add booking logic here
    });
});

// Vote for film buttons
document.querySelectorAll('button').forEach(button => {
    if (!button.textContent.includes('Stem op deze film')) {
        return;
    }

    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const filmCard = this.closest('div[class*="group cursor-pointer"]');
        const filmTitle = filmCard?.querySelector('h3')?.textContent || 'Onbekende film';

        // Visual feedback
        const originalText = this.textContent;
        this.textContent = '✓ Gestemd!';
        this.classList.remove('hover:bg-red-700');
        this.classList.add('bg-green-600');

        setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove('bg-green-600');
            this.classList.add('hover:bg-red-700');
        }, 2000);

        console.log('Voted for:', filmTitle);
        // Add API call here to save vote
    });
});
