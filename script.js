function renderDashboard(wells) {
    const container = document.getElementById('wells-container');
    container.innerHTML = ''; 

    wells.forEach(well => {
        // 繪圖計算 (以 800x600 的 SVG 空間為準)
        const startX = 150;
        const startY = 40;
        const curveRadius = 80;
        
        // 垂直深度比例 (假設最大 15000ft 對應 300px)
        let vLen = (well.actualVertical / 15000) * 350;
        // 水平長度比例 (假設最大 15000ft 對應 450px)
        let hLen = (well.actualHorizontal / 15000) * 500;

        // 構建路徑：起點 -> 垂直下鑽 -> 圓角曲線 -> 水平延伸
        const actualD = `
            M ${startX},${startY} 
            L ${startX},${startY + vLen} 
            Q ${startX},${startY + vLen + curveRadius} ${startX + curveRadius},${startY + vLen + curveRadius}
            L ${startX + curveRadius + hLen},${startY + vLen + curveRadius}
        `;

        const wellEl = document.createElement('div');
        wellEl.className = 'well-unit';
        wellEl.innerHTML = `
            <div class="dashboard-header">
                <div class="well-info">
                    <h1>${well.wellName}</h1>
                    <div style="color: #888; font-size: 0.9rem; margin-top:5px;">${well.location}</div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end;">
                    <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">${well.reportDate}</div>
                    <div class="status-badge">${well.status}</div>
                </div>
            </div>

            <div class="visual-stage">
                <div class="glass-frame pos-data-main">
                    <div class="label-sm">Current MD</div>
                    <div class="value-lg">${well.currentMD.toLocaleString()} <small>ft</small></div>
                    <div style="margin-top:15px;" class="label-sm">Current TVD</div>
                    <div class="value-lg">${well.currentTVD.toLocaleString()} <small>ft</small></div>
                    <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:15px 0;">
                    <div style="display:flex; justify-content: space-between;">
                        <div><div class="label-sm">Actual Vertical</div><div style="font-size:0.9rem;">${well.actualVertical.toLocaleString()} ft</div></div>
                        <div><div class="label-sm">Actual Horiz</div><div style="font-size:0.9rem;">${well.actualHorizontal.toLocaleString()} ft</div></div>
                    </div>
                </div>

                <div class="glass-frame pos-cost-main">
                    <div class="label-sm">Cumulative Cost</div>
                    <div class="value-gold">$ ${well.costIncurred.toLocaleString()}</div>
                    <div style="margin-top:10px;" class="label-sm">Estimated Total</div>
                    <div style="font-size:1.1rem; font-weight:bold;">$ ${well.estimatedCost.toLocaleString()}</div>
                </div>

                <div class="glass-frame pos-rop-mw">
                    <div style="text-align: center;">
                        <div class="label-sm">ROP</div>
                        <div class="value-lg">${well.rop} <small>ft/hr</small></div>
                    </div>
                    <div style="width: 1px; background: rgba(255,255,255,0.2);"></div>
                    <div style="text-align: center;">
                        <div class="label-sm">MW</div>
                        <div class="value-lg">${well.mudWeight} <small>ppg</small></div>
                    </div>
                </div>

                <svg class="well-bore-diagram" viewBox="0 0 800 600">
                    <path d="${actualD}" class="path-actual" />
                    <circle cx="${startX}" cy="${startY}" r="8" fill="#555" />
                    <circle cx="${startX + curveRadius + hLen}" cy="${startY + vLen + curveRadius}" r="8" fill="#555" />
                </svg>
            </div>
        `;
        container.appendChild(wellEl);
    });
}
window.onload = function() {
    if (typeof wellsData !== 'undefined') {
        // 自動排序
        wellsData.sort((a, b) => (b.isActive === a.isActive) ? 0 : b.isActive ? -1 : 1);
        // 直接執行渲染，不需密碼
        renderDashboard(wellsData);
    }
};

