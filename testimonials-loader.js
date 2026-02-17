// ===== Hardcoded Testimonials Loader =====
// Creates scrolling testimonial cards from hardcoded data (image files + testimonials from Excel).
// Auto-scrolls from right to left, one card at a time, with seamless looping.

// Hardcoded testimonials data from testimonials.xlsx
const testimonials = [
    {
        image: 'parent1-Dr Suman Girish-KG2 Parent.jpg',
        name: 'Dr Suman Girish',
        role: 'KG2 Parent',
        text: 'First Step Montessori has been a blessing for our family. Our daughter has grown so much in confidence and independence. The teachers are incredibly caring and professional.'
    },
    {
        image: 'parent2-Dr Suma Manjunath-KG2 Parent.jpg',
        name: 'Dr Suma Manjunath',
        role: 'KG2 Parent',
        text: 'The school has a wonderful, nurturing environment. The teachers are very dedicated and pay attention to each child\'s needs. Highly recommended!'
    },
    {
        image: 'parent3-Dr Harish-Nursery Parent.jpg',
        name: 'Dr Harish',
        role: 'Nursery Parent',
        text: 'My son loves going to school every day. The activities are engaging and the learning approach is very effective. Great school!'
    },
    {
        image: 'parent4-Dr Lakshmi-Nursery Parent.jpg',
        name: 'Dr Lakshmi',
        role: 'Nursery Parent',
        text: 'The environment is welcoming and supports overall growth. Encourage social, emotional, and academic growth.'
    },
    {
        image: 'parent5-Harish Katakhdond-KG2 Parent.jpg',
        name: 'Harish Katakhdond',
        role: 'KG2 Parent',
        text: 'The balanced mix of play and learning makes learning enjoyable. My child shows good improvement in communication, reading, and basic math skills.'
    },
    {
        image: 'parent6-Koti Prabhu-KG2 Parent.jpg',
        name: 'Koti Prabhu',
        role: 'KG2 Parent',
        text: 'Regular communication from the school keeps us informed about activities and progress.'
    }
];

async function loadTestimonials() {
    try {
        const container = document.getElementById('testimonials-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        if (testimonials.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;">No testimonials found.</p>';
            return;
        }

        // Create testimonial cards from hardcoded data
        const cards = [];
        testimonials.forEach(testimonial => {
            const imagePath = `images/${testimonial.image}`;

            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <div class="testimonial-content">
                    <p class="testimonial-text">${testimonial.text}</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-image">
                        <img src="${imagePath}" alt="Parent testimonial" class="parent-image">
                    </div>
                    <div class="author-info">
                        <h4 class="author-name">${testimonial.name}</h4>
                        <p class="author-role">${testimonial.role}</p>
                    </div>
                </div>
            `;
            cards.push(card);
        });

        console.log('Testimonials loaded:', cards.length);

        // Add original cards
        cards.forEach(card => container.appendChild(card));

        // Duplicate cards for seamless infinite loop
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('cloned');
            container.appendChild(clone);
        });

        // Start auto-scroll (right-to-left, one card at a time)
        startAutoScroll(container);

    } catch (error) {
        console.error('Error loading testimonials:', error);
        const container = document.getElementById('testimonials-container');
        if (container) {
            container.innerHTML = '<p style="text-align:center;color:#999;">Unable to load testimonials.</p>';
        }
    }
}

function startAutoScroll(container) {
    if (!container) return;

    const intervalMs = 3000; // slide every 3 seconds
    let intervalId = null;
    let isPaused = false;

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', resume);
    container.addEventListener('pointerdown', pause, { passive: true });
    container.addEventListener('pointerup', resume);
    container.addEventListener('touchstart', pause, { passive: true });
    container.addEventListener('touchend', resume);

    container.scrollLeft = 0;

    const getCardStep = () => {
        const firstCard = container.querySelector('.testimonial-card');
        if (!firstCard) return 340;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const computed = getComputedStyle(container);
        let gap = 24;
        try { gap = parseInt(computed.gap || 24) || 24; } catch (e) { }
        return Math.round(cardWidth + gap);
    };

    const getHalfWidth = () => container.scrollWidth / 2;

    function advance() {
        if (isPaused) return;
        const step = getCardStep();
        container.scrollBy({ left: step, behavior: 'smooth' });

        // After smooth scroll completes, check if we need to loop
        setTimeout(() => {
            if (container.scrollLeft >= getHalfWidth()) {
                container.scrollLeft = container.scrollLeft - getHalfWidth();
            }
        }, 700);
    }

    // Start interval
    intervalId = setInterval(advance, intervalMs);

    // First slide after a short delay
    setTimeout(advance, 800);

    return () => {
        clearInterval(intervalId);
        container.removeEventListener('mouseenter', pause);
        container.removeEventListener('mouseleave', resume);
    };
}

// Run the testimonial loader when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestimonials);
} else {
    loadTestimonials();
}
