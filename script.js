// Navigation Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // Only update active state for on-page anchor links
        if (link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        }
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
const animateElements = document.querySelectorAll('.feature-card, .pathway-card, .program-card, .community-image');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(contactForm);

        // Send to FormSubmit.co via Fetch
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log('FormSubmit response status:', response.status);
                if (response.ok) {
                    // Hide form and show success message
                    contactForm.style.display = 'none';
                    const successMessage = document.getElementById('successMessage');
                    if (successMessage) {
                        successMessage.style.display = 'block';
                    }
                    contactForm.reset();
                } else {
                    console.error('FormSubmit error:', response);
                    alert('Oops! There was a problem submitting your form. Please try again.');
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Oops! There was a problem submitting your form. Please try again.');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter Animation for Stats
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Add hover effect to images
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('mouseenter', function () {
        this.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add floating animation to feature icons on hover
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        const icon = this.querySelector('.feature-icon');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
    });

    card.addEventListener('mouseleave', function () {
        const icon = this.querySelector('.feature-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Preload critical images
window.addEventListener('load', () => {
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/about.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

console.log('First Step Montessori - Website Loaded Successfully! 🎉');

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Show/Height button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Smooth scroll to top when clicked
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Rotating Text Animation
const rotatingTextElement = document.getElementById('heroRotatingText');
const rotatingTexts = [
    "<strong>Learning is</strong> a journey of academic acumen and self-discovery",
    "<strong>Learning is</strong> finding joy in every new discovery",
    "<strong>Learning is</strong> building confidence for a bright future",
    "<strong>Learning is</strong> growing together in a caring community",
    "<strong>Learning is</strong> exploring the world with wonder"
];

let currentTextIndex = 0;

function updateRotatingText() {
    if (!rotatingTextElement) return;

    // Fade out
    rotatingTextElement.style.opacity = '0';
    rotatingTextElement.style.transform = 'translateY(20px)';

    setTimeout(() => {
        // Change text
        rotatingTextElement.innerHTML = rotatingTexts[currentTextIndex];

        // Fade in
        rotatingTextElement.style.opacity = '1';
        rotatingTextElement.style.transform = 'translateY(0)';

        // Update index for next loop
        currentTextIndex = (currentTextIndex + 1) % rotatingTexts.length;
    }, 1000); // Wait for transition
}

if (rotatingTextElement) {
    // Initial call
    updateRotatingText();
    // Interval
    setInterval(updateRotatingText, 5000);
}

// Optimization: Pause video when not in view
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.playbackRate = 0.8; // Slow down video for better visual appeal
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(e => console.log("Video play failed:", e));
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.5 }); // 50% visibility threshold

    videoObserver.observe(heroVideo);
}


// ===== Lightbox Functionality =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const caption = document.getElementById('caption');

    // Event Delegation for Gallery Items (since they are dynamic)
    const galleryGridLightbox = document.getElementById('gallery-grid');
    if (galleryGridLightbox) {
        galleryGridLightbox.addEventListener('click', function (e) {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const img = item.querySelector('img');
                if (img) {
                    lightbox.style.display = 'flex';
                    lightboxImg.src = img.src;
                    if (caption) {
                        caption.textContent = img.alt || 'Gallery Image';
                    }
                }
            }
        });
    }

    // Close function
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Close when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display !== 'none') {
            closeLightbox();
        }
    });
}

// ===== Immersive Gallery Functionality =====
const immersiveBg = document.getElementById('immersive-bg-image');
const mainTitle = document.getElementById('gallery-main-title');
const mainDesc = document.getElementById('gallery-main-description');
const mainImage = document.getElementById('main-gallery-image');
let autoPlayInterval;
const categoryTag = document.getElementById('gallery-category-tag');
const reelContainer = document.getElementById('gallery-reel');
const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');

// Reuse the existing galleryImages array defined above or define it here if replacing the previous block entirely
// Since I textually replaced the block where galleryImages was defined, I must include it.

let galleryImages = [];

// Fetch filters config and then fetch images from GitHub repo
fetch('gallery-filters.json')
    .then(res => res.json())
    .then(config => {
        // Generate filter buttons dynamically
        const filtersContainer = document.getElementById('gallery-filters');
        if (filtersContainer) {
            filtersContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';
            config.filters.forEach(filter => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.setAttribute('data-filter', filter.prefix);
                btn.setAttribute('data-category-prefix', filter.prefix);
                btn.textContent = filter.name;
                filtersContainer.appendChild(btn);
            });

            // Bind filter button click handlers
            const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filterValue = btn.getAttribute('data-filter');
                    const prefix = btn.getAttribute('data-category-prefix') || filterValue;
                    renderReel(prefix);
                });
            });
        }

        return fetch("https://api.github.com/repos/RohithCZ1982/FSM-Mys/contents/images/gallery")
            .then(res => res.json())
            .then(data => ({ data, config }));
    })
    .then(({ data, config }) => {
        data.forEach(file => {
            if (file.type === "file" && file.name.match(/\.(jpeg|jpg|gif|png)$/i)) {
                // Determine category based on filename prefix and config
                let category = 'other';
                let altText = 'Gallery Image';

                const fileNameLower = file.name.toLowerCase();
                for (let i = 0; i < config.filters.length; i++) {
                    const filter = config.filters[i];
                    if (fileNameLower.startsWith(filter.prefix.toLowerCase()) || fileNameLower.includes(filter.prefix.toLowerCase())) {
                        category = filter.prefix;
                        altText = filter.name + ' Image';
                        break;
                    }
                }

                galleryImages.push({
                    src: `images/gallery/${file.name}`, // using local path for better performance instead of download_url
                    category: category,
                    alt: altText
                });
            }
        });

        // Initialize gallery and render reel AFTER images have been fetched
        if (reelContainer) {
            renderReel('all');
        }
    })
    .catch(error => {
        console.error('Error loading gallery config or images:', error);
        // Fallback: Use some defaults if API fails
        galleryImages = [
            { src: 'images/gallery/classroomImage1.jpg', category: 'classroom', alt: 'Montessori Activity' },
            { src: 'images/gallery/outdoorImage1.jpg', category: 'outdoor', alt: 'Outdoor Exploration' },
            { src: 'images/gallery/artsImage1.jpg', category: 'arts', alt: 'Creative Arts' },
            { src: 'images/gallery/activitiesImage1.jpg', category: 'activities', alt: 'Group Activities' }
        ];
        if (reelContainer) {
            renderReel('all');
        }
    });

// Mobile Filter Toggle
const mobileFilterIconBtn = document.getElementById('mobile-filter-icon-btn');
const galleryFilters = document.getElementById('gallery-filters');

if (mobileFilterIconBtn && galleryFilters) {
    mobileFilterIconBtn.addEventListener('click', () => {
        galleryFilters.classList.toggle('show');
        mobileFilterIconBtn.classList.toggle('active');

        // Update icon
        const icon = mobileFilterIconBtn.querySelector('i');
        if (galleryFilters.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-filter';
        }
    });
}

let currentGalleryImages = []; // Filtered list
let activeImageIndex = 0;

function updateMainView(index) {
    if (!currentGalleryImages.length) return;
    // Wrap around index
    if (index >= currentGalleryImages.length) index = 0;
    if (index < 0) index = currentGalleryImages.length - 1;

    const img = currentGalleryImages[index];

    // Update Background with fade
    if (immersiveBg) {
        // Simple opacity transition
        immersiveBg.style.opacity = '0';
        setTimeout(() => {
            immersiveBg.style.backgroundImage = `url('${img.src}')`;
            immersiveBg.style.opacity = '0.6';
        }, 300);
    }

    // Update Main Image
    if (mainImage) {
        mainImage.style.opacity = '0';
        mainImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            mainImage.src = img.src;
            mainImage.alt = img.alt;
            mainImage.style.opacity = '1';
            mainImage.style.transform = 'scale(1)';
        }, 300);
    }

    if (categoryTag) categoryTag.textContent = img.category;

    // Update Active Reel Item
    const reelItems = document.querySelectorAll('.reel-item');
    reelItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');

            // Custom scroll logic to keep page position stable
            const container = document.getElementById('gallery-reel');
            if (container) {
                const containerCenter = container.clientWidth / 2;
                const itemCenter = item.offsetLeft + item.clientWidth / 2;
                container.scrollTo({
                    left: itemCenter - containerCenter,
                    behavior: 'smooth'
                });
            }
        } else {
            item.classList.remove('active');
        }
    });

    activeImageIndex = index;
    resetAutoPlay();
}

function startAutoPlay() {
    stopAutoPlay(); // clear any existing
    autoPlayInterval = setInterval(() => {
        updateMainView(activeImageIndex + 1);
    }, 4000); // 4 seconds per slide
}

function stopAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

function renderReel(filterIndex) {
    if (!reelContainer) return;

    // Fade out reel momentarily
    reelContainer.style.opacity = '0';

    setTimeout(() => {
        reelContainer.innerHTML = '';
        const filterPrefix = filterIndex === 'all' ? null : filterIndex;

        currentGalleryImages = galleryImages.filter(img => {
            if (filterIndex === 'all') return true;
            const filename = img.src.split('/').pop().toLowerCase();
            return filename.startsWith(filterPrefix.toLowerCase()) || filename.includes(filterPrefix.toLowerCase());
        });

        if (currentGalleryImages.length === 0) {
            reelContainer.innerHTML = '<p style="color:white; width:100%; text-align:center;">No images found.</p>';
            reelContainer.style.opacity = '1';
            return;
        }

        currentGalleryImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'reel-item';
            item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;

            item.addEventListener('click', () => {
                updateMainView(index);
            });

            reelContainer.appendChild(item);
        });

        // Fade in
        reelContainer.style.opacity = '1';

        // Set first image as active initially
        updateMainView(0);
        startAutoPlay();
    }, 300);
}

// Controls
if (scrollLeftBtn && reelContainer) {
    scrollLeftBtn.addEventListener('click', () => {
        reelContainer.scrollBy({ left: -300, behavior: 'smooth' });
        resetAutoPlay();
    });
}

if (scrollRightBtn && reelContainer) {
    scrollRightBtn.addEventListener('click', () => {
        reelContainer.scrollBy({ left: 300, behavior: 'smooth' });
        resetAutoPlay();
    });
}

// Filter Button Click Handlers are now bound dynamically after loading config.

// Initialize
if (reelContainer) {
    // Check url hash for initial filter? Or just load all.
    // Initialization is now handled inside the fetch callback above.
    // renderReel('all');

    // Auto-advance slideshow? Optional.
    // setInterval(() => { updateMainView(activeImageIndex + 1); }, 5000);
}

// ===== Parse Parent Image Filenames in Testimonials =====
function parseParentImageFilenames() {
    // Get all parent images in testimonial section
    const parentImages = document.querySelectorAll('.testimonial-card .parent-image');

    parentImages.forEach(img => {
        // Get the filename from the src attribute
        const src = img.getAttribute('src');
        if (!src) return;

        // Extract filename from path (e.g., "images/parent-Dr Suman Girish-KG2 Parent.jpg")
        const filename = src.split('/').pop(); // "parent-Dr Suman Girish-KG2 Parent.jpg"

        // Remove file extension
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // "parent-Dr Suman Girish-KG2 Parent"

        // Split by delimiter '-'
        const parts = nameWithoutExt.split('-');

        // Format: parent-[ParentName]-[ChildClass]
        // parts[0] = "parent" (identifier, ignore)
        // parts[1] = "Dr Suman Girish" (parent name)
        // parts[2] = "KG2 Parent" (child class)

        if (parts.length >= 3) {
            const identifier = parts[0].trim(); // "parent"
            const parentName = parts[1].trim(); // "Dr Suman Girish"
            const childClass = parts[2].trim(); // "KG2 Parent"

            // Find the corresponding author info elements
            const testimonialCard = img.closest('.testimonial-card');
            if (testimonialCard) {
                const authorName = testimonialCard.querySelector('.author-name');
                const authorRole = testimonialCard.querySelector('.author-role');

                if (authorName && parentName) {
                    authorName.textContent = parentName;
                }

                if (authorRole && childClass) {
                    authorRole.textContent = childClass;
                }
            }
        }
    });
}

// Run the parser when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', parseParentImageFilenames);
} else {
    // DOM is already loaded
    parseParentImageFilenames();
}
