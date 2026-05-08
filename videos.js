// ===== Videos Page Loader =====
// Loads and displays all video files from the gallery folder

const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.querySelector('.close-modal');
const videosGrid = document.getElementById('videosGrid');

let allVideos = [];

// Close modal when clicking X
closeModalBtn.addEventListener('click', () => {
    videoModal.classList.remove('show');
    modalVideo.pause();
    modalVideo.src = '';
});

// Close modal when clicking outside the video
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('show');
        modalVideo.pause();
        modalVideo.src = '';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('show')) {
        videoModal.classList.remove('show');
        modalVideo.pause();
        modalVideo.src = '';
    }
});

// Function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Fetch videos from GitHub repo
fetch("https://api.github.com/repos/LavanyaFSM/SchoolWebsite/contents/images/gallery")
    .then(res => res.json())
    .then(data => {
        // Filter only video files
        data.forEach(file => {
            if (file.type === "file" && file.name.match(/\.(mp4|webm|mov)$/i)) {
                allVideos.push({
                    name: file.name,
                    src: `images/gallery/${file.name}`,
                    size: file.size,
                    type: 'video'
                });
            }
        });

        // Sort videos by name
        allVideos.sort((a, b) => a.name.localeCompare(b.name));

        // Render videos
        renderVideos();
    })
    .catch(error => {
        console.error('Error loading videos:', error);
        // Fallback: Show error message
        if (videosGrid) {
            videosGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load videos at this time. Please try again later.</p>
                </div>
            `;
        }
    });

function renderVideos() {
    if (!videosGrid) return;

    // Clear existing content
    videosGrid.innerHTML = '';

    if (allVideos.length === 0) {
        videosGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-film"></i>
                <p>No videos available at the moment.</p>
            </div>
        `;
        return;
    }

    // Create video cards
    allVideos.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        // Extract a nice title from filename
        const titleMatch = video.name.match(/^.*?_(?:\d{8}_\d{6}|20\d{6})|(.+?)(?:\.\w+)?$/);
        const displayTitle = video.name
            .replace(/\.[^/.]+$/, '') // Remove extension
            .replace(/_/g, ' ')
            .replace(/^\d{8}_\d{6}/, '') // Remove timestamp
            .replace(/^VID|^IMG|^InShot|^video_/i, '') // Remove prefixes
            .trim() || `Video ${index + 1}`;

        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <video preload="metadata">
                    <source src="${video.src}" type="video/mp4">
                </video>
                <div class="play-icon-overlay">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${displayTitle}</h3>
                <p class="video-size">${formatFileSize(video.size)}</p>
            </div>
        `;

        // Add click event to open video in modal
        videoCard.addEventListener('click', () => {
            modalVideo.src = video.src;
            modalTitle.textContent = displayTitle;
            videoModal.classList.add('show');
            modalVideo.play();
        });

        videosGrid.appendChild(videoCard);
    });
}

// Add some interactivity to video cards - show play button on hover
document.addEventListener('DOMContentLoaded', () => {
    console.log(`${allVideos.length} videos loaded`);
});
