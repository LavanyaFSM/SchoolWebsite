// ===== Dynamic Testimonials Loader =====
// This system automatically loads testimonials by:
// 1. Fetching testimonials.txt file
// 2. Scanning for all parent images in the images folder
// 3. Matching parent[N] with corresponding images and testimonials
// 4. Dynamically creating testimonial cards

async function loadTestimonials() {
    try {
        // Fetch the testimonials.xlsx file (actually tab-separated text format)
        const response = await fetch('testimonials.xlsx');
        const text = await response.text();

        // Parse testimonials from the tab-separated file
        // Format: filename\ttestimonial text
        const testimonials = {};
        const parentImages = [];
        const lines = text.split('\n');

        for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines

            // Split by tab character to get filename and testimonial
            const parts = line.split('\t');

            if (parts.length >= 2) {
                const filename = parts[0].trim();
                // Join all remaining parts in case testimonial contains tabs
                let testimonialText = parts.slice(1).join('\t').trim();

                // Remove surrounding quotes if present
                testimonialText = testimonialText.replace(/^["']|["']$/g, '');

                // Clean up multi-line testimonials (remove extra whitespace)
                testimonialText = testimonialText.replace(/\s+/g, ' ').trim();

                // Extract parent ID from filename (e.g., "parent1" from "parent1-Anita Desai-KG1 Parent")
                const parentIdMatch = filename.match(/^(parent\d+)/);

                if (parentIdMatch) {
                    const parentId = parentIdMatch[1];
                    testimonials[parentId] = testimonialText;

                    // Construct the image path
                    const imagePath = `images/${filename}.jpg`;
                    parentImages.push(imagePath);
                }
            }
        }

        // Get the testimonials container
        const container = document.getElementById('testimonials-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Create testimonial cards for each parent image
        const cards = [];
        parentImages.forEach(imagePath => {
            // Extract filename from path
            const filename = imagePath.split('/').pop(); // e.g., "parent1-Anita Desai-KG1 Parent.jpg"

            // Remove file extension
            const nameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // e.g., "parent1-Anita Desai-KG1 Parent"

            // Split by delimiter '-'
            const parts = nameWithoutExt.split('-');

            // Format: parent[N]-[ParentName]-[ChildClass]
            if (parts.length >= 2) {
                const parentId = parts[0].trim(); // e.g., "parent1"
                const parentName = parts[1].trim(); // e.g., "Anita Desai"
                const childClass = parts.length >= 3 ? parts.slice(2).join('-').trim() : ''; // e.g., "KG1 Parent"

                // Get the testimonial text for this parent
                const testimonialText = testimonials[parentId] || 'No testimonial available.';

                // Create the testimonial card
                const card = document.createElement('div');
                card.className = 'testimonial-card';

                card.innerHTML = `
                    <div class="testimonial-content">
                        <p class="testimonial-text">${testimonialText}</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-image">
                            <img src="${imagePath}" alt="Parent testimonial" class="parent-image">
                        </div>
                        <div class="author-info">
                            <h4 class="author-name">${parentName}</h4>
                            <p class="author-role">${childClass}</p>
                        </div>
                    </div>
                `;

                cards.push(card);
            }
        });

        // Add testimonial cards to the container
        cards.forEach(card => container.appendChild(card));

    } catch (error) {
        console.error('Error loading testimonials:', error);

        // Fallback: show a message
        const container = document.getElementById('testimonials-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Unable to load testimonials at this time.</p>';
        }
    }
}

// Run the testimonial loader when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestimonials);
} else {
    // DOM is already loaded
    loadTestimonials();
}
