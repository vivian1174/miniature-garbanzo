/**
 * FPCC USA - Drilling Dashboard (Clean & Direct Version)
 * 完全移除 eval() 隱患，直接操作 DOM
 */

const createDashboard = (wells) => {
    const container = document.getElementById('wells-container');
    if (!container) return;
    container.innerHTML = ''; 

    wells.forEach(well => {
        // 1. 數值與比例計算 (不使用字串 eval)
        const vVertical = well.actualVertical || 0;
        const vHorizontal = well.actualHorizontal || 0;
        const startX = 150, startY = 40, curveRadius = 80;
        const vLen = (vVertical / 15000) * 350;
        const hLen = (vHorizontal / 15000) * 500;

        const pathD = `M ${startX},${startY} L ${startX},${startY + vLen} Q ${startX},${startY + vLen + curveRadius} ${startX + curveRadius},${startY + vLen + curveRadius} L ${startX + curveRadius + hLen},${startY + vLen + curveRadius}`;

        // 2. 建立井位單元
        const wellEl = document.createElement('div');
        wellEl.className = 'well-unit';
        wellEl.style.marginBottom = "80px";

        // 3. 插入內容 (確保 ClassName 與 style.css 完美對應)
        wellEl.innerHTML = `
            <div class="dashboard-header">
                <div class="well-info">
                    <h1>${well.wellName}</h1>
                    <div style="color: #888; font-size: 0.9rem;">${well.location}</div>
                </div>
                <div style="text-align:right">
                    <div style="color: #888; font-size: 0.8rem; margin-bottom:8px;">${well.reportDate}</div>
                    <div class="status-badge" style="border-color: ${well.isActive ? '#fbbf24' : '#555'}; color: ${well.isActive ? '#fbbf24' : '#555'};">
                        ${well.status}
                    </div>
                </div>
            </div>

            <div class="visual-stage">
                <div class="glass-frame pos-data-main">
                    <div class="label-sm">Current MD</div>
                    <div class="value-lg">${(well.currentMD || 0).toLocaleString()} <small>ft</small></div>
                    <div class="label-sm" style="margin-top:15px;">Current TVD</div>
                    <div class="value-lg">${(well.currentTVD || 0).toLocaleString()} <small>ft</small></div>
                </div>

                <div class="glass-frame pos-cost-main">
                    <div class="label-sm">Cumulative Cost</div>
                    <div class="value-gold">$ ${(well.costIncurred || 0).toLocaleString()}</div>
                    <div class="label-sm" style="margin-top:10px;">Estimated Total</div>
                    <div style="font-weight:bold; font-size:1.1rem;">$ ${(well.estimatedCost || 0).toLocaleString()}</div>
                </div>

                <div class="glass-frame pos-rop-mw">
                    <div style="text-align:center;">
                        <div class="label-sm">ROP</div>
                        <div class="value-lg">${well.rop || 0} <small>ft/hr</small></div>
                    </div>
                    <div style="width:1px; background:rgba(255,255,255,0.2);"></div>
                    <div style="text-align:center;">
                        <div class="label-sm">MW</div>
                        <div class="value-lg">${well.mudWeight || 0} <small>ppg</small></div>
                    </div>
                </div>

                <svg class="well-bore-diagram" viewBox="0 0 800 600" style="width:100%; height:100%;">
                    <path d="${pathD}" style="stroke: ${well.isActive ? '#fbbf24' : '#555'}; stroke-width: 5; fill: none; stroke-linecap: round;" />
                    <circle cx="${startX}" cy="${startY}" r="6" fill="#fbbf24" />
                    <circle cx="${startX + curveRadius + hLen}" cy="${startY + vLen + curveRadius}" r="9" fill="${well.isActive ? '#fbbf24' : '#555'}" />
                </svg>
            </div>

            <div style="margin-top:20px; background:rgba(255,255,255,0.05); padding:20px; border-radius:8px; border:1px solid #333;">
                <div class="label-sm" style="color:#fbbf24; margin-bottom:8px;">Daily Engineer Notes</div>
                <div style="color:#ddd; line-height:1.6; white-space:pre-wrap;">${well.dailyNotes || ""}</div>
            </div>
        `;
        container.appendChild(wellEl);
    });
};

// 4. 強制執行邏輯 (避開 eval)
const initApp = () => {
    if (typeof wellsData !== 'undefined' && Array.isArray(wellsData)) {
        const sorted = [...wellsData].sort((a, b) => (b.isActive === a.isActive) ? 0 : b.isActive ? -1 : 1);
        createDashboard(sorted);
        console.log("Dashboard Rendered.");
    } else {
        console.error("Data missing.");
    }
};

// 5. 確保在所有情況下都能啟動
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
