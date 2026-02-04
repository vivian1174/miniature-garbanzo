/**
 * FPCC USA - Drilling Dashboard (Clean & Secure Version)
 * 移除所有 eval() 與字串型 setTimeout，避免 CSP 阻擋
 */

// 1. 使用更安全的監聽方式
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Dashboard...");
    
    // 檢查 wellsData 是否存在 (來自 daily-data.js)
    if (typeof wellsData !== 'undefined' && Array.isArray(wellsData)) {
        // 自動排序：Active 在最前
        const sortedData = [...wellsData].sort((a, b) => 
            (b.isActive === a.isActive) ? 0 : b.isActive ? -1 : 1
        );
        
        renderDashboard(sortedData);
    } else {
        // 如果資料讀取失敗，在畫面上直接提示
        const container = document.getElementById('wells-container');
        if (container) {
            container.innerHTML = `
                <div style="color: #fbbf24; text-align: center; padding: 50px; border: 1px dashed #444;">
                    <h3>Data Not Found</h3>
                    <p>請確認 daily-data.js 檔案已上傳且內容正確。</p>
                </div>`;
        }
    }
});

function renderDashboard(wells) {
    const container = document.getElementById('wells-container');
    if (!container) return;
    container.innerHTML = ''; 

    wells.forEach(well => {
        // 數值處理
        const vMD = well.currentMD || 0;
        const vTVD = well.currentTVD || 0;
        const vVertical = well.actualVertical || 0;
        const vHorizontal = well.actualHorizontal || 0;

        // SVG 比例計算
        const startX = 150, startY = 40, curveRadius = 80;
        const vLen = (vVertical / 15000) * 350;
        const hLen = (vHorizontal / 15000) * 500;

        const pathD = `M ${startX},${startY} L ${startX},${startY + vLen} Q ${startX},${startY + vLen + curveRadius} ${startX + curveRadius},${startY + vLen + curveRadius} L ${startX + curveRadius + hLen},${startY + vLen + curveRadius}`;

        const wellEl = document.createElement('div');
        wellEl.className = 'well-unit';
        wellEl.style.marginBottom = "60px";

        wellEl.innerHTML = `
            <div class="dashboard-header" style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <div>
                    <h1 style="color:#fbbf24; margin:0; font-size:1.8rem;">${well.wellName}</h1>
                    <div style="color:#888;">${well.location}</div>
                </div>
                <div style="text-align:right;">
                    <div style="color:#888; font-size:0.8rem;">${well.reportDate}</div>
                    <div style="border:1px solid ${well.isActive ? '#fbbf24' : '#555'}; color:${well.isActive ? '#fbbf24' : '#555'}; padding:2px 10px; display:inline-block; margin-top:5px;">
                        ${well.status}
                    </div>
                </div>
            </div>
            <div class="visual-stage" style="position:relative; height:600px; background:#1a1a1a; border-radius:8px; border:1px solid #333; overflow:hidden;">
                <div style="position:absolute; top:20px; left:20px; background:rgba(30,30,30,0.9); padding:15px; border-radius:5px; border:1px solid #444; z-index:5;">
                    <div style="color:#888; font-size:0.7rem;">CURRENT MD</div>
                    <div style="font-size:1.5rem; font-weight:bold; color:#fff;">${vMD.toLocaleString()} <small>ft</small></div>
                    <div style="color:#888; font-size:0.7rem; margin-top:10px;">CURRENT TVD</div>
                    <div style="font-size:1.5rem; font-weight:bold; color:#fff;">${vTVD.toLocaleString()} <small>ft</small></div>
                </div>
                <svg viewBox="0 0 800 600" style="width:100%; height:100%;">
                    <path d="${pathD}" stroke="${well.isActive ? '#fbbf24' : '#555'}" stroke-width="5" fill="none" stroke-linecap="round" />
                    <circle cx="${startX + curveRadius + hLen}" cy="${startY + vLen + curveRadius}" r="8" fill="${well.isActive ? '#fbbf24' : '#555'}" />
                </svg>
            </div>
            <div style="margin-top:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:5px;">
                <div style="color:#fbbf24; font-size:0.8rem; font-weight:bold; margin-bottom:5px;">DAILY NOTES</div>
                <div style="color:#ccc; font-size:0.9rem; line-height:1.5;">${well.dailyNotes}</div>
            </div>
        `;
        container.appendChild(wellEl);
    });
}
