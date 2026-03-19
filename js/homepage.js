// Homepage Specific Scripts

// Render Recent Research Achievements dynamically
document.addEventListener('DOMContentLoaded', function () {
    // Check if papers data is loaded
    if (typeof papers === 'undefined' || typeof tagColors === 'undefined') {
        console.warn('Paper data not loaded. Papers data:', typeof papers, 'Tag colors:', typeof tagColors);
        document.querySelector('[data-papers-container]') &&
            (document.querySelector('[data-papers-container]').innerHTML = '<div class="text-danger">Paper data not loaded.</div>');
    } else {
        renderPapers();
    }

    // Update year in footer
    updateYear();
});

// Render papers to the page
function renderPapers() {
    const container = document.querySelector('[data-papers-container]');
    if (!container) return;

    let html = '';
    papers.forEach((paper, index) => {
        const demoId = `demo-${index}`;
        html += `
            <div class='paper-achievement-card mb-5'>
                <div class='paper-achievement-row'>
                    <div class='paper-achievement-left'>
                        <h5 class='paper-title'>${paper.title}</h5>
                        <a href='${paper.url}' target='_blank' class='paper-learn-more-btn'>Learn More</a>
                    </div>
                    <div class='paper-achievement-right'>
                        <div class='paper-image-container' id='${demoId}--content' ${paper.video ? "style='display:none;'" : ''}> 
                            ${paper.img ? `<div class='paper-image-wrapper'><img src='${paper.img}' alt='${paper.title}' class='paper-architecture-img'></div>` : '<div class="paper-image-placeholder">No Image</div>'}
                        </div>
                        ${paper.video ? `<div class='paper-video-container' id='${demoId}--video'><video autoplay loop muted controls class='paper-demo-video'><source src='${paper.video}' type='video/mp4'>Your browser does not support the video tag.</video></div>` : ''}
                        <div class='paper-achievement-info'>
                            ${paper.date ? `<p class='paper-date'>${paper.date}</p>` : ''}
                            <div class='paper-tags'>
                                ${paper.tags.map(t => `<span class='badge' style='background:${tagColors[t] || '#888'};color:#fff;font-size:0.85em;padding:4px 8px;margin-right:6px;margin-bottom:6px;display:inline-block;'>${t}</span>`).join('')}
                            </div>
                            <p class='paper-authors'>${paper.authors}</p>
                            ${paper.video ? `<button class='paper-demo-btn' onclick="toggleDemo('${demoId}')">📐 Architecture</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Toggle between image and video demo
function toggleDemo(demoId) {
    const contentEl = document.getElementById(demoId + '--content');
    const videoEl = document.getElementById(demoId + '--video');
    const btn = event.target;

    if (videoEl.style.display === 'none') {
        contentEl.style.display = 'none';
        videoEl.style.display = 'block';
        btn.textContent = '📐 Architecture';
    } else {
        contentEl.style.display = 'block';
        videoEl.style.display = 'none';
        btn.textContent = '▶ View Demo';
    }
}

// Update current year in footer
function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
