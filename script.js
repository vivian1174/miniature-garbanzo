/**
 * FPCC USA - Drilling Dashboard Logic
 * 整合功能：自動排序、數據渲染、路徑繪製
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Checking for data...");

    // 1. 檢查資料是否讀入 (來自 daily-data.js)
    if (typeof wellsData !== 'undefined' && Array.isArray(wellsData)) {
        console.log("Data found, starting render.");
        
        // 2. 自動排序：isActive 為 true 的排在最前面
        wellsData.sort((a, b) => (b.isActive === a.isActive) ? 0 : b.isActive ? -1 : 1);
        
        // 3. 呼叫渲染函數
        renderDashboard(wellsData);
    } else {
        console.error("Critical Error: wellsData is missing or empty!");
        const container = document.getElementById('wells-container');
        if (container) {
            container.innerHTML = `
                <div style="color:white; text-align:center; padding: 50px;">
                    <h2 style="color:#ef4444;">Error: Data connection failed.</h2>
                    <p>請確認 daily-data.js 是否正確上傳且路徑無誤。</p>
                </div>`;
        }
    }
});

function renderDashboard(wells) {
    const container = document.getElementById('wells-container');
    if (!container) return;
    container.innerHTML = ''; 

    wells.forEach(well => {
        // 安全檢查與數值初始化
        const actualVertical = well.actualVertical || 0;
        const actualHorizontal = well.actualHorizontal || 0;

        // SVG 繪圖參數設定
        const startX = 150;
        const startY = 40;
        const curveRadius = 80;
        
        // 深度比例計算 (以 15000ft 為參考基準)
        let vLen = (actualVertical / 15000) * 350;
        let hLen = (actualHorizontal / 15000) * 500;

        // 繪製鑽井路徑 (Bezier Curve Q)
        const actualD = `
            M ${startX},${startY} 
            L ${startX},${startY + vLen} 
            Q ${startX},${startY + vLen + curveRadius} ${startX + curveRadius},${startY + vLen + curveRadius}
            L ${startX + curveRadius + hLen},${startY + vLen + curveRadius}
        `;

        const wellEl = document.createElement('div');
        wellEl.className = 'well-unit';
        wellEl.style.marginBottom = "80px"; // 增加井與井之間的間距

        wellEl.innerHTML = `
            <div class="dashboard-header">
                <div class="well-info">
                    <h1>${well.wellName}</h1>
                    <div style="color: #888; font-size: 0.9rem; margin-top: 5px;">${well.location}</div>
                </div>
                <div style="text-align:right">
                    <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">Report Date: ${well.reportDate}</div>
                    <div class="status-badge" style="border: 1px solid ${well.isActive ? '#fbbf24' : '#555'}; color: ${well.isActive ? '#fbbf24' : '#555'};">
                        ${well.status}
                    </div>
                </div>
            </div>

            <div class="visual-stage" style="position: relative; width: 100%; height: 600px; background: #1a1a1a; border-radius: 12px; border: 1px solid #333; overflow: hidden;">
                
                <div class="glass-frame pos-data-main" style="position: absolute; top: 40px; left: 40px; width: 220px; background: rgba(40,40,40,0.8); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); z-index: 10;">
                    <div style="color: #888; font-size: 0.75rem; text-transform: uppercase;">Current MD</div>
                    <div style="color: #fff; font-size: 1.8rem; font-weight: bold; margin-bottom: 15px;">${well.currentMD.toLocaleString()} <small style="font-size: 0.8rem; color: #888;">ft</small></div>
                    
                    <div style="color: #888; font-size: 0.75rem; text-transform: uppercase;">Current TVD</div>
                    <div style="color: #fff; font-size: 1.8rem; font-weight: bold;">${well.currentTVD.toLocaleString()} <small style="font-size: 0.8rem; color: #888;">ft</small></div>
                </div>

                <div class="glass-frame pos-cost-main" style="position: absolute; top: 40px; right: 40px; width: 220px; background: rgba(40,40,40,0.8); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: right; z-index: 10;">
                    <div style="color: #888; font-size: 0.75rem; text-transform: uppercase;">Cumulative Cost</div>
                    <div style="color: #fbbf24; font-size: 1.8rem; font-weight: bold; margin-bottom: 15px;">$ ${well.costIncurred.toLocaleString()}</div>
                    
                    <div style="color: #888; font-size: 0.75rem; text-transform: uppercase;">Estimated Total</div>
                    <div style="color: #fff; font-size: 1.2rem; font-weight: bold;">$ ${well.estimatedCost.toLocaleString()}</div>
                </div>

                <div class="glass-frame pos-rop-mw" style="position: absolute; bottom: 40px; right: 40px; display: flex; gap: 30px; background: rgba(40,40,40,0.8); padding: 15px 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); z-index: 10;">
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.75rem; text-transform: uppercase;">ROP</div>
                        <div style="color: #fff; font-size: 1.5rem; font-weight: bold;">${well.rop} <small style="font-size: 0.8rem; color: #888;">ft/hr</small></div>
                    </div>
                    <div style="width: 1px; background: rgba(255,255,255,0.2);"></div>
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.75rem; text-transform: uppercase;">MW</div>
                        <div style="color: #fff; font-size: 1.5rem; font-weight: bold;">${well.mudWeight} <small style="font-size: 0.8rem; color: #888;">ppg</small></div>
                    </div>
                </div>

                <svg class="well-bore-diagram" viewBox="0 0 800 600" style="width:100%; height:100%;">
                    <path d="M 150,0 L 150,600" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                    <path d="${actualD}" stroke="${well.isActive ? '#fbbf24' : '#555'}" stroke-width="6" fill="none" stroke-linecap="round" style="filter: drop-shadow(0 0 8px ${well.isActive ? 'rgba(251,191,36,0.4)' : 'transparent'});" />
                    <circle cx="${startX}" cy="${startY}" r="6" fill="#fbbf24" />
                    <circle cx="${startX + curveRadius + hLen}" cy="${startY + vLen + curveRadius}" r="8" fill="${well.isActive ? '#fbbf24' : '#555'}" />
                </svg>
            </div>

            <div class="notes-section" style="margin-top: 20px; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                <div style="color: #fbbf24; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Daily Engineer Notes</div>
                <div style="color: #ddd; line-height: 1.6; white-space: pre-wrap;">${well.dailyNotes}</div>
            </div>
        `;
        container.appendChild(wellEl);
    });
}
