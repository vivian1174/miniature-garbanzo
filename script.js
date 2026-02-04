/**
 * FPCC USA - Drilling Dashboard (Secure Edition)
 * 此版本完全符合 style.css 結構，且移除所有 eval/字串操作以繞過 CSP 限制
 */

// 1. 核心渲染函式：完全對應你的 CSS class 名稱
function renderDashboard(wells) {
    const container = document.getElementById('wells-container');
    if (!container) return;
    container.innerHTML = ''; 

    wells.forEach(well => {
        // SVG 路徑比例計算
        const startX = 150;
        const startY = 40;
        const curveRadius = 80;
        const vLen = ((well.actualVertical || 0) / 15000) * 350;
        const hLen = ((well.actualHorizontal || 0) / 15000) * 500;

        const actualD = `M ${startX},${startY} L ${startX},${startY + vLen} Q ${startX},${startY + vLen + curveRadius} ${startX + curveRadius},${startY + vLen + curveRadius} L ${startX + curveRadius + hLen},${startY + vLen + curveRadius}`;

        const wellEl = document.createElement('div');
        wellEl.className = 'well-unit';
        wellEl.style.marginBottom = "80px";

        wellEl.innerHTML = `
            <div class="dashboard-header">
                <div class="well-info">
                    <h1>${well.wellName}</h1>
                    <div style="color: #888; font-size: 0.9rem; margin-top:5px;">${well.location}</div>
                </div>
                <div style="text-align:right">
                    <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">${well.reportDate}</div>
                    <div class="status-badge" style="border: 1px solid ${well.isActive ? '#fbbf24' : '#555'}; color: ${well.isActive ? '#fbbf24' : '#555'};">
                        ${well.status}
                    </div>
                </div>
            </div>

            <div class="visual-stage">
                <div class="glass-frame pos-data-main">
                    <div class="label-sm">Current MD</div>
                    <div class="value-lg">${(well.currentMD || 0).toLocaleString()} <small>ft</small></div>
                    <div style="margin-top:15px;" class="label-sm">Current TVD</div>
                    <div class="value-lg">${(well.currentTVD || 0).toLocaleString()} <small>ft</small></div>
                </div>

                <div class="glass-frame pos-cost-main">
                    <div class="label-sm">Cumulative Cost</div>
                    <div class="value-gold">$ ${(well.costIncurred || 0).toLocaleString()}</div>
                    <div style="margin-top:10px;" class="label-sm">Estimated Total</div>
                    <div style="font-size:1.1rem; font-weight:bold;">$ ${(well.estimatedCost || 0).toLocaleString()}</div>
                </div>

                <div class="glass-frame pos-rop-mw">
                    <div style="text-align: center;">
                        <div class="label-sm">ROP</div>
                        <div class="value-lg">${well.rop || 0} <small>ft/hr</small></div>
                    </div>
                    <div style="width: 1px; background: rgba(255,255,255,0.2);"></div>
                    <div style="text-align: center;">
                        <div class="label-sm">MW</div>
                        <div class="value-lg">${well.mudWeight || 0} <small>ppg</small></div>
                    </div>
                </div>

                <svg class="well-bore-diagram" viewBox="0 0 800 600" style="width:100%; height:100%;">
                    <path d="${actualD}" style="stroke: ${well.isActive ? '#fbbf24' : '#555'}; stroke-width: 4; fill: none; stroke-linecap: round;" />
                    <circle cx="${startX}" cy="${startY}" r="6" fill="#fbbf24" />
                    <circle cx="${startX + curveRadius + hLen}" cy="${startY + vLen + curveRadius}" r="8" fill="${well.isActive ? '#fbbf24' : '#555'}" />
                </svg>
            </div>

            <div style="margin-top: 20px; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid #333;">
                <div class="label-sm" style="color:#fbbf24; margin-bottom:10px;">Daily Engineer Notes</div>
                <div style="color: #ddd; line-height: 1.6; white-space: pre-wrap;">${well.dailyNotes || ''}</div>
            </div>
        `;
        container.appendChild(wellEl);
    });
}

// 2. 系統初始化：不使用 window.onload，改用更安全的監聽
(function() {
    const startApp = () => {
        console.log("App starting...");
        if (typeof wellsData !== 'undefined') {
            // 自動排序
            const sorted = [...wellsData].sort((a, b) => (b.isActive === a.isActive) ? 0 : b.isActive ? -1 : 1);
            renderDashboard(sorted);
        } else {
            console.error("Critical: wellsData not found!");
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startApp();
    } else {
        document.addEventListener('DOMContentLoaded', startApp);
    }
})();
