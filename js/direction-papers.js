
// 动态聚合 papers-data.js 中所有带有该标签的论文
function getDirectionPapers(direction) {
    if (typeof papers === 'undefined') {
        console.error('papers 未加载');
        return [];
    }
    return papers.filter(paper => paper.tags.includes(direction));
}

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function renderPapers(direction) {
    const list = document.getElementById('direction-papers-list');
    document.getElementById('direction-title').textContent = direction;
    const directionPapers = getDirectionPapers(direction);
    if (directionPapers.length === 0) {
        list.innerHTML = '<div class="text-center text-muted">No papers for this direction yet.</div>';
        return;
    }
    let html = '<div class="row">';
    directionPapers.forEach(paper => {
        html += `<div class="col-md-12 mb-3">
            <div class="card h-100 shadow-sm">
                ${paper.img ? `<img class="card-img-top" src="${paper.img}" alt="${paper.title}" style="height: 350px; object-fit: cover;">` : ''}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title"><a href="${paper.url}" target="_blank">${paper.title}</a></h5>
                    <span class="badge" style="background:${typeof tagColors !== 'undefined' && tagColors[direction] ? tagColors[direction] : '#888'};color:#fff;font-size:1em;margin-bottom:8px;">${direction}</span>
                    <p class="card-text small text-muted mb-0">${paper.authors}</p>
                </div>
            </div>
        </div>`;
    });
    html += '</div>';
    list.innerHTML = html;
}

window.onload = function () {
    const direction = getQueryParam('direction') || 'Low-altitude Coordination';
    renderPapers(direction);
};
