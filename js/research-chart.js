// 动态统计各方向论文数量和百分比，依赖 papers-data.js 和 tag-colors.js
// 方向与canvas id映射
const directionMap = [
    { id: 'chart-perception', tag: 'Low-altitude Perception', name: 'Low-altitude Perception' },
    { id: 'chart-maneuver', tag: 'Low-altitude Maneuvering', name: 'Low-altitude Maneuvering' },
    { id: 'chart-control', tag: 'Low-altitude Operation', name: 'Low-altitude Operation' },
    { id: 'chart-coordination', tag: 'Low-altitude Coordination', name: 'Low-altitude Coordination' }
];

// 统计每个方向的论文数（去重），百分比分母为总论文数
function getDirectionStats() {
    const stats = {};
    directionMap.forEach(d => {
        stats[d.tag] = papers.filter(paper => paper.tags.includes(d.tag)).length;
    });
    const total = papers.length;
    const percent = {};
    directionMap.forEach(d => {
        percent[d.tag] = total > 0 ? Math.round(stats[d.tag] * 100 / total) : 0;
    });
    return { stats, percent, total };
}

// Initialize all research direction charts
document.addEventListener('DOMContentLoaded', function () {
    // 确保 papers 和 tagColors 已加载
    if (typeof papers === 'undefined' || typeof tagColors === 'undefined') {
        console.error('papers 或 tagColors 未加载');
        return;
    }

    // 获取统计数据
    const { stats, percent } = getDirectionStats();

    // Get or create the shared dropdown container
    let dropdownContainer = document.getElementById('researchDropdownContainer');
    if (!dropdownContainer) {
        dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'researchDropdownContainer';
        dropdownContainer.className = 'research-dropdown-container';
        const chartsWrapper = document.querySelector('.research-charts-wrapper');
        if (chartsWrapper) {
            chartsWrapper.appendChild(dropdownContainer);
        } else {
            document.body.appendChild(dropdownContainer);
        }
    }

    directionMap.forEach(function (d) {
        const element = document.getElementById(d.id);
        if (!element) {
            console.error('未找到canvas元素，id:', d.id);
        }
        if (element) {
            const ctx = element.getContext('2d');
            const color = tagColors[d.tag] || '#888';
            try {
                const chartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Research Focus', 'Other'],
                        datasets: [{
                            data: [percent[d.tag], 100 - percent[d.tag]],
                            backgroundColor: [color, '#e8e8e8'],
                            borderColor: [color, '#e8e8e8'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        if (context.dataIndex === 0) {
                                            return d.name + ': ' + percent[d.tag] + '%';
                                        }
                                        return 'Other: ' + (100 - percent[d.tag]) + '%';
                                    }
                                }
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('Chart error:', e);
            }
            // 设置百分比文本
            var percentId = '';
            if (d.id === 'chart-perception') percentId = 'percent-perception';
            if (d.id === 'chart-maneuver') percentId = 'percent-maneuver';
            if (d.id === 'chart-control') percentId = 'percent-control';
            if (d.id === 'chart-coordination') percentId = 'percent-coordination';
            if (percentId) {
                var percentDiv = document.getElementById(percentId);
                if (percentDiv) {
                    percentDiv.textContent = percent[d.tag] + '%';
                }
            }
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.research-chart-item') && !e.target.closest('.research-dropdown-container')) {
            clearDropdown(dropdownContainer);
        }
    });
});

// Show research dropdown in shared container
function showResearchDropdown(data, container, chartItem) {
    // Clear previous content
    container.innerHTML = '';

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'research-dropdown show';
    dropdown.style.borderTopColor = data.color;

    // Calculate position based on chart item's location
    if (chartItem) {
        const chartRect = chartItem.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Horizontal: center under the chart
        const chartCenterX = chartRect.left - containerRect.left + chartRect.width / 2;
        dropdown.style.left = chartCenterX + 'px';
        dropdown.style.transform = 'translateX(-50%)';

        // Vertical: align with bottom of chart with small gap
        const topPosition = chartRect.bottom - containerRect.top + 5;
        dropdown.style.top = topPosition + 'px';
    }
    dropdown.innerHTML = `
        <div class="research-dropdown-item" data-type="profiles">
            <div class="research-dropdown-icon" style="background-color: ${data.color}">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="research-dropdown-text">
                <div class="research-dropdown-label">Profiles</div>
                <div class="research-dropdown-value">${data.profiles}</div>
            </div>
        </div>
        <div class="research-dropdown-item" data-type="units">
            <div class="research-dropdown-icon" style="background-color: ${data.color}">
                <i class="fas fa-building"></i>
            </div>
            <div class="research-dropdown-text">
                <div class="research-dropdown-label">Research units</div>
                <div class="research-dropdown-value">${data.units}</div>
            </div>
        </div>
        <div class="research-dropdown-item" data-type="output">
            <div class="research-dropdown-icon" style="background-color: ${data.color}">
                <i class="fas fa-book"></i>
            </div>
            <div class="research-dropdown-text">
                <div class="research-dropdown-label">Research output</div>
                <div class="research-dropdown-value">${data.output}</div>
            </div>
        </div>
        <div class="research-dropdown-item" data-type="projects">
            <div class="research-dropdown-icon" style="background-color: ${data.color}">
                <i class="fas fa-project-diagram"></i>
            </div>
            <div class="research-dropdown-text">
                <div class="research-dropdown-label">Projects</div>
                <div class="research-dropdown-value">${data.projects}</div>
            </div>
        </div>
    `;

    container.appendChild(dropdown);

    // Add click handlers to dropdown items
    dropdown.querySelectorAll('.research-dropdown-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            const type = item.getAttribute('data-type');
            handleDropdownItemClick(type, data);
        });
    });
}

// Clear dropdown
function clearDropdown(container) {
    if (container) {
        container.innerHTML = '';
    }
}

// Handle dropdown item click (prepare for future hyperlink feature)
function handleDropdownItemClick(type, data) {
    // This function is ready for future enhancement with actual hyperlinks
    console.log('Clicked:', type, 'for', data.name);
    // Future: navigate to related page or filter results
}
