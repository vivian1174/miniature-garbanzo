// 確保所有 DOM 載入後才執行，避免找不到 wells-container
document.addEventListener('DOMContentLoaded', () => {
    console.log("Checking for data...");

    // 1. 檢查資料是否讀入
    if (typeof wellsData !== 'undefined' && Array.isArray(wellsData)) {
        console.log("Data found, starting render.");
        
        // 2. 自動排序：進行中排前面
        wellsData.sort((a, b) => (b.isActive === a.isActive) ? 0 : b.isActive ? -1 : 1);
        
        // 3. 呼叫渲染
        renderDashboard(wellsData);
    } else {
        // 如果全黑，請按 F12 打開 Console，這行字會告訴我們為什麼
        console.error("Critical Error: wellsData is missing or empty!");
        const container = document.getElementById('wells-container');
        if (container) container.innerHTML = "<p style='color:red; text-align:center;'>Error: Data connection failed.</p>";
    }
});

function renderDashboard(wells) {
    const container = document.getElementById('wells-container');
    if (!container) return;
    container.innerHTML = ''; 

    wells.forEach(well => {
        // 安全檢查：確保數值存在
        const actualVertical = well.actualVertical || 0;
        const actualHorizontal = well.actualHorizontal || 0;

        const startX = 150;
        const startY = 40;
        const curveRadius = 80;
        let vLen = (actualVertical / 15000) * 350;
        let hLen = (actualHorizontal / 15000) * 500;

        const actualD = `M ${startX},${startY} L ${startX},${startY + vLen} Q ${startX},${startY + vLen + curveRadius} ${startX + curveRadius},${startY + vLen + curveRadius} L ${startX + curveRadius + hLen},${startY + vLen + curveRadius}`;

        const wellEl = document.createElement('div');
        wellEl.className = 'well-unit';
        wellEl.style.marginBottom = "50px"; // 確保兩口井之間有間距

        wellEl.innerHTML = `
            <div class="dashboard-header">
                <div class="well-info">
                    <h1>${well.wellName}</h1>
                    <div style="color: #888; font-size: 0.9rem;">${well.location}</div>
                </div>
                <div style="text-align:right">
                    <div style="color: #888; font-size: 0.8rem;">${well.reportDate}</div>
                    <div class="status-badge" style="border: 1px solid ${well.isActive ? '#fbbf24' : '#555'}; color: ${well.isActive ? '#fbbf24' : '#555'};">${well.status}</div>
                </div>
            </div>
            <div class="visual-stage">
                <div class="glass-frame pos-data-main">
                    <div class="label-sm">Current MD</div>
                    <div class="value-lg">${well.currentMD.toLocaleString()} <small>ft</small></div>
                </div>
                <div class="glass-frame pos-cost-main">
                    <div class="label-sm">Cumulative Cost</div>
                    <div class="value-gold">$ ${well.costIncurred.toLocaleString()}</div>
                </div>
                <svg class="well-bore-diagram" viewBox="0 0 800 600" style="width:100%; height:auto;">
                    <path d="${actualD}" stroke="${well.isActive ? '#fbbf24' : '#555'}" stroke-width="4" fill="none" />
                </svg>
            </div>
            <div style="margin-top: 20px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                <div class="label-sm">Daily Notes</div>
                <div style="color: #ddd;">${well.dailyNotes}</div>
            </div>
        `;
        container.appendChild(wellEl);
    });
}
