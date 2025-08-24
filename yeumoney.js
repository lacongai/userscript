
(function() {
    'use strict';
    
    console.log("[Auto Việt Nam] Khởi động giao diện mới - Chào anh ae ! 🇻🇳");
    console.log(`[Auto] Thời gian hiện tại: 15/08/2025 - 11:55:47 (UTC)`);
    
    // ====== CẤU HÌNH 5 TRANG WEB + LƯU TRỮ + ƯU TIÊN NÚT ======
    let selectedSite = localStorage.getItem('vnAutoSelectedSite') || '188bet';
    let preferredButton = localStorage.getItem('vnAutoPreferredButton') || 'red'; // red hoặc green
    let searchCompleted = false;
    let clickCompleted = false;
    let autoSearchStarted = false;
    let isMenuMinimized = localStorage.getItem('vnMenuMinimized') === 'true';
    let isCasinoMinimized = localStorage.getItem('vnCasinoMinimized') === 'true';
    
    const siteConfigs = {
        'M88': {
            keyword: 'm88',
            exactDomain: 'm88.com',
            backupDomains: ['m88asia.com', 'm88mansion.com'],
            displayName: '🎰 M88',
            targetUrl: 'https://m88.com'
        },
        '188bet': {
            keyword: '188bet',
            exactDomain: '88bettp.com',
            backupDomains: ['188bet.com'],
            displayName: '🎲 188bet',
            targetUrl: 'https://88bettp.com'
        },
        'VN88': {
            keyword: 'vn88',
            exactDomain: 'vn88lu.com',
            backupDomains: ['vn88.com', 'vn88.net'],
            displayName: '🎮 VN88',
            targetUrl: 'https://vn88lu.com'
        },
        'V9bet': {
            keyword: 'v9bet',
            exactDomain: 'v9betgc.com',
            backupDomains: ['v9bet.com', 'v9bet.net'],
            displayName: '🚀 V9bet',
            targetUrl: 'https://v9betgc.com'
        },
        'FB88': {
            keyword: 'fb88',
            exactDomain: 'fb88eo.com',
            backupDomains: ['fb88.com', 'fb88.net'],
            displayName: '⚡ FB88',
            targetUrl: 'https://fb88eo.com/'
        }
    };
    
    const buttonPreference = {
        'red': {
            name: '🔴 Nút Đỏ',
            emoji: '🔴',
            description: 'Ưu tiên nút đỏ trước'
        },
        'green': {
            name: '🟢 Nút Xanh', 
            emoji: '🟢',
            description: 'Ưu tiên nút xanh trước'
        }
    };
    
    // ====== HÀM LƯU TRỮ CÀI ĐẶT NÂNG CẤP ======
    function saveSiteSelection(site) {
        localStorage.setItem('vnAutoSelectedSite', site);
        console.log(`[Lưu trữ] Đã lưu lựa chọn casino: ${site}`);
    }
    
    function saveButtonPreference(buttonType) {
        localStorage.setItem('vnAutoPreferredButton', buttonType);
        console.log(`[Lưu trữ] Đã lưu ưu tiên nút: ${buttonPreference[buttonType].name}`);
    }
    
    function saveMenuState(isMinimized) {
        localStorage.setItem('vnMenuMinimized', isMinimized.toString());
        console.log(`[Lưu trữ] Menu thu nhỏ: ${isMinimized}`);
    }
    
    function saveCasinoState(isMinimized) {
        localStorage.setItem('vnCasinoMinimized', isMinimized.toString());
        console.log(`[Lưu trữ] Casino thu nhỏ: ${isMinimized}`);
    }
    
    function loadLastSession() {
        const lastSite = localStorage.getItem('vnAutoSelectedSite');
        const lastButton = localStorage.getItem('vnAutoPreferredButton');
        const lastUsed = localStorage.getItem('vnLastUsedTime');
        
        if (lastSite && lastUsed) {
            const timeDiff = Date.now() - parseInt(lastUsed);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            console.log(`[Phiên] Lần cuối sử dụng: ${hoursDiff.toFixed(1)} giờ trước`);
            console.log(`[Phiên] Casino đã chọn: ${lastSite}`);
            console.log(`[Phiên] Nút ưu tiên: ${buttonPreference[lastButton || 'red'].name}`);
            
            return {
                site: lastSite,
                button: lastButton || 'red',
                timeDiff: hoursDiff
            };
        }
        
        return null;
    }
    
    function saveSession() {
        localStorage.setItem('vnLastUsedTime', Date.now().toString());
        console.log(`[Phiên] Đã lưu thời gian sử dụng`);
    }
    
    // ====== HÀM KÉO THẢ - TỐI ƯU ======
    function makeElementDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        let dragHandle = element.querySelector('.drag-handle');
        if (!dragHandle) {
            dragHandle = element;
        }
        
        dragHandle.style.cursor = 'move';
        dragHandle.style.userSelect = 'none';
        
        dragHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDragging = true;
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(window.getComputedStyle(element).left, 10) || 0;
            startTop = parseInt(window.getComputedStyle(element).top, 10) || 0;
            
            element.style.zIndex = '99999999';
            dragHandle.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            
            element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            element.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = 'move';
            }
        });
    }
    
    // ====== PHẦN GOOGLE - GIAO DIỆN MỚI + LƯU TRỮ ======
    let isGooglePage = window.location.hostname.includes('google.com');
    
    if (isGooglePage) {
        console.log("[Auto] Đang trên Google - tạo menu với lưu trữ cho anh doanhvipqq");
        
        // Load phiên cuối
        const lastSession = loadLastSession();
        if (lastSession) {
            selectedSite = lastSession.site;
            preferredButton = lastSession.button;
            console.log(`[Phiên] Khôi phục: ${selectedSite} + ${buttonPreference[preferredButton].name}`);
        }
        
        function createFiveSiteMenu() {
            if (document.getElementById('vn-five-sites-menu')) return;
            
            const menu = document.createElement('div');
            menu.id = 'vn-five-sites-menu';
            menu.style.cssText = `
                position: fixed;
                top: 70px;
                right: 40px;
                z-index: 9999999;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                color: #fff;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255,255,255,0.15);
                overflow: hidden;
                transition: all 0.3s ease;
                min-width: 340px;
                max-width: 340px;
            `;
            
            const currentTime = new Date().toLocaleString('vi-VN');
            const sessionInfo = lastSession ? 
                `Lần cuối: ${lastSession.timeDiff.toFixed(1)}h trước` : 
                'Phiên mới';
            
            menu.innerHTML = `
                <div class="drag-handle" style="
                    background: linear-gradient(135deg, #4a5568, #2d3748);
                    padding: 12px 18px;
                    text-align: center;
                    cursor: move;
                    user-select: none;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    position: relative;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1; text-align: center;">
                            <div id="five-menu-title" style="font-size: 16px; margin-bottom: 4px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                                🎯 Bóng X
                            </div>
                            <div id="five-menu-subtitle" style="font-size: 11px; opacity: 0.85; color: #FFD700;">
                                Kéo để di chuyển
                            </div>
                        </div>
                        <button id="five-minimize-btn" style="
                            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                            border: none;
                            color: #fff;
                            padding: 6px 10px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 11px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        ">
                            ${isMenuMinimized ? '🎯' : '➖'}
                        </button>
                    </div>
                </div>
                <div id="five-menu-content" style="padding: 16px; ${isMenuMinimized ? 'display: none;' : ''}">
                    <div style="text-align:center; margin-bottom:12px; font-size:13px; background:rgba(255,255,255,0.1); padding:10px; border-radius:8px; border: 1px solid rgba(255,255,255,0.2);">
                        Xin chào <strong style="color:#FFD700; font-size: 14px;">doanhvipqq</strong>! 👋<br>
                        <small>15/08/2025 - 11:55:47</small><br>
                        <small style="color:#90EE90;">💾 ${sessionInfo}</small>
                    </div>
                    
                    <div style="margin-bottom:15px;">
                        <div style="margin-bottom:8px; font-size:13px; color:#FFD700;">
                            📌 Chọn casino (đã lưu: <strong>${siteConfigs[selectedSite].displayName}</strong>):
                        </div>
                        <select id="five-site-picker" style="
                            width: 100%; 
                            padding: 12px; 
                            font-size: 14px; 
                            border: none; 
                            border-radius: 10px; 
                            background: #fff; 
                            color: #333;
                            font-weight: 600;
                            box-shadow: 0 3px 12px rgba(0,0,0,0.2);
                            cursor: pointer;
                        ">
                            <option value="M88">🎰 M88 → m88.com</option>
                            <option value="188bet">🎲 188bet → 88bettp.com</option>
                            <option value="VN88">🎮 VN88 → vn88lu.com</option>
                            <option value="V9bet">🚀 V9bet → v9betgc.com</option>
                            <option value="FB88">⚡ FB88 → fb88eo.com</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom:15px;">
                        <div style="margin-bottom:8px; font-size:13px; color:#FFD700;">
                            🎯 Ưu tiên nút (đã lưu: <strong>${buttonPreference[preferredButton].name}</strong>):
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="btn-prefer-red" style="
                                flex: 1;
                                padding: 10px;
                                font-size: 13px;
                                border: 2px solid ${preferredButton === 'red' ? '#FFD700' : 'rgba(255,255,255,0.3)'};
                                border-radius: 10px;
                                background: ${preferredButton === 'red' ? 'linear-gradient(45deg, #FF6B6B, #FF4757)' : 'rgba(255,255,255,0.1)'};
                                color: #fff;
                                font-weight: bold;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                            ">
                                🔴 Nút Đỏ<br>
                                <small style="font-size: 10px; opacity: 0.9;">Ưu tiên đỏ</small>
                            </button>
                            <button id="btn-prefer-green" style="
                                flex: 1;
                                padding: 10px;
                                font-size: 13px;
                                border: 2px solid ${preferredButton === 'green' ? '#FFD700' : 'rgba(255,255,255,0.3)'};
                                border-radius: 10px;
                                background: ${preferredButton === 'green' ? 'linear-gradient(45deg, #2ECC71, #27AE60)' : 'rgba(255,255,255,0.1)'};
                                color: #fff;
                                font-weight: bold;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                            ">
                                🟢 Nút Xanh<br>
                                <small style="font-size: 10px; opacity: 0.9;">Ưu tiên xanh</small>
                            </button>
                        </div>
                    </div>
                    
                    <div style="text-align:center; margin-bottom: 15px;">
                        <button id="five-search-btn" style="
                            background: linear-gradient(45deg, #FF6B6B, #4ECDC4); 
                            color: white; 
                            border: none; 
                            padding: 12px 20px; 
                            border-radius: 25px; 
                            font-size: 14px; 
                            font-weight: bold; 
                            cursor: pointer;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                            transition: all 0.3s ease;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            width: 100%;
                        ">
                            🚀 TÌM + TỰ ĐỘNG
                        </button>
                    </div>
                    <div id="five-status-info" style="
                        text-align: center; 
                        font-size: 12px; 
                        background: rgba(255,255,255,0.15); 
                        padding: 12px; 
                        border-radius: 10px;
                        min-height: 20px;
                        border: 1px solid rgba(255,255,255,0.2);
                    ">
                        ✅ Sẵn sàng: <strong>${siteConfigs[selectedSite].displayName}</strong> + <strong>${buttonPreference[preferredButton].name}</strong>!<br>
                        <small style="opacity:0.9; color:#FFD700;">💾 Cài đặt đã được lưu tự động</small>
                    </div>
                    <div style="text-align: center; margin-top: 12px; font-size: 10px; opacity: 0.7; background: rgba(255,255,255,0.08); padding: 6px; border-radius: 6px;">
                        💡 <strong>MỚI:</strong> Lựa chọn ưu tiên nút Đỏ/Xanh + Lưu trữ<br>
                        🚀 V9bet & FB88 | 💾 Auto lưu tất cả cài đặt
                    </div>
                </div>
            `;
            
            document.body.appendChild(menu);
            makeElementDraggable(menu);
            
            // Áp dụng trạng thái thu nhỏ đã lưu
            if (isMenuMinimized) {
                const menuContent = document.getElementById('five-menu-content');
                const menuTitle = document.getElementById('five-menu-title');
                const menuSubtitle = document.getElementById('five-menu-subtitle');
                
                menuContent.style.display = 'none';
                menuTitle.style.display = 'none';
                menuSubtitle.style.display = 'none';
                menu.style.minWidth = '45px';
                menu.style.maxWidth = '45px';
                menu.style.width = '45px';
                menu.style.height = '45px';
            }
            
            // Thu nhỏ menu - SIÊU GỌNG + LƯU TRỮ
            const fiveMinimizeBtn = document.getElementById('five-minimize-btn');
            const menuContent = document.getElementById('five-menu-content');
            const menuTitle = document.getElementById('five-menu-title');
            const menuSubtitle = document.getElementById('five-menu-subtitle');
            
            fiveMinimizeBtn.onclick = function(e) {
                e.stopPropagation();
                
                if (isMenuMinimized) {
                    // Mở rộng
                    menuContent.style.display = 'block';
                    menu.style.minWidth = '340px';
                    menu.style.maxWidth = '340px';
                    menu.style.width = '340px';
                    menu.style.height = 'auto';
                    menuTitle.style.display = 'block';
                    menuSubtitle.style.display = 'block';
                    fiveMinimizeBtn.innerHTML = '➖';
                    fiveMinimizeBtn.style.padding = '6px 10px';
                    fiveMinimizeBtn.style.fontSize = '11px';
                    isMenuMinimized = false;
                    saveMenuState(false);
                    console.log('[Thu nhỏ] Đã mở rộng menu + lưu trạng thái');
                } else {
                    // Thu nhỏ SIÊU GỌNG
                    menuContent.style.display = 'none';
                    menuTitle.style.display = 'none';
                    menuSubtitle.style.display = 'none';
                    menu.style.minWidth = '45px';
                    menu.style.maxWidth = '45px';
                    menu.style.width = '45px';
                    menu.style.height = '45px';
                    fiveMinimizeBtn.innerHTML = '🎯';
                    fiveMinimizeBtn.style.padding = '3px';
                    fiveMinimizeBtn.style.fontSize = '18px';
                    isMenuMinimized = true;
                    saveMenuState(true);
                    console.log('[Thu nhỏ] Đã thu siêu nhỏ menu + lưu trạng thái');
                }
            };
            
            // Hover effect cho nút thu nhỏ
            fiveMinimizeBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            
            fiveMinimizeBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Gán sự kiện với lưu trữ
            const sitePicker = document.getElementById('five-site-picker');
            const searchBtn = document.getElementById('five-search-btn');
            const btnPreferRed = document.getElementById('btn-prefer-red');
            const btnPreferGreen = document.getElementById('btn-prefer-green');
            
            sitePicker.value = selectedSite; // Khôi phục lựa chọn casino
            
            // Sự kiện chọn casino
            sitePicker.onchange = function() {
                selectedSite = this.value;
                saveSiteSelection(selectedSite); // Lưu ngay khi chọn
                
                const config = siteConfigs[selectedSite];
                updateFiveStatus(`📌 Đã chọn ${config.displayName}<br>🎯 Target: <strong>${config.targetUrl}</strong><br>💾 <small>Đã lưu tự động!</small>`);
                searchCompleted = false;
                clickCompleted = false;
                autoSearchStarted = false;
                
                console.log(`[Casino] Chuyển sang: ${config.displayName} - Đã lưu!`);
            };
            
            // Sự kiện chọn ưu tiên nút ĐỎ
            btnPreferRed.onclick = function() {
                preferredButton = 'red';
                saveButtonPreference('red');
                
                // Cập nhật giao diện
                this.style.border = '2px solid #FFD700';
                this.style.background = 'linear-gradient(45deg, #FF6B6B, #FF4757)';
                btnPreferGreen.style.border = '2px solid rgba(255,255,255,0.3)';
                btnPreferGreen.style.background = 'rgba(255,255,255,0.1)';
                
                updateFiveStatus(`🔴 Đã chọn ưu tiên Nút Đỏ!<br>💾 <small>Đã lưu tự động!</small>`);
                console.log(`[Nút] Chuyển sang ưu tiên: 🔴 Nút Đỏ - Đã lưu!`);
                
                // Effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
            };
            
            // Sự kiện chọn ưu tiên nút XANH
            btnPreferGreen.onclick = function() {
                preferredButton = 'green';
                saveButtonPreference('green');
                
                // Cập nhật giao diện
                this.style.border = '2px solid #FFD700';
                this.style.background = 'linear-gradient(45deg, #2ECC71, #27AE60)';
                btnPreferRed.style.border = '2px solid rgba(255,255,255,0.3)';
                btnPreferRed.style.background = 'rgba(255,255,255,0.1)';
                
                updateFiveStatus(`🟢 Đã chọn ưu tiên Nút Xanh!<br>💾 <small>Đã lưu tự động!</small>`);
                console.log(`[Nút] Chuyển sang ưu tiên: 🟢 Nút Xanh - Đã lưu!`);
                
                // Effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
            };
            
            // Hover effects cho nút ưu tiên
            [btnPreferRed, btnPreferGreen].forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = 'none';
                });
            });
            
            // Sự kiện nút TÌM + TỰ ĐỘNG
            searchBtn.onclick = function() {
                const config = siteConfigs[selectedSite];
                const buttonName = buttonPreference[preferredButton].name;
                updateFiveStatus(`🔍 Đang tìm...<br>🎯 <strong>${config.targetUrl}</strong><br>⚡ Ưu tiên: <strong>${buttonName}</strong>`);
                autoSearchStarted = true;
                searchCompleted = false;
                clickCompleted = false;
                saveSession(); // Lưu thời gian sử dụng
                setTimeout(startAutoSearch, 1000);
            };
        }
        
        function updateFiveStatus(text) {
            const statusDiv = document.getElementById('five-status-info');
            if (statusDiv) {
                statusDiv.innerHTML = text;
            }
            console.log(`[Trạng thái] ${text.replace(/<[^>]*>/g, '')}`);
        }
        
        function isValidResult(el) {
            if (!el) return false;
            if (el.closest('[data-text-ad]') || el.closest('.ads-ad')) return false;
            if (/quảng cáo|ad|sponsored/i.test(el.innerText || '')) return false;
            return true;
        }
        
        function autoSelectResult() {
            if (clickCompleted || !autoSearchStarted) return false;
            
            const config = siteConfigs[selectedSite];
            updateFiveStatus(`🔍 Đang quét...<br>🎯 Tìm: <strong>${config.exactDomain}</strong>`);
            
            console.log(`[Auto] Tự động quét tìm ${selectedSite} cho anh doanhvipqq`);
            
            let allLinks = document.querySelectorAll('a[href]');
            console.log(`[Auto] Quét ${allLinks.length} liên kết`);
            
            // BƯỚC 1: Ưu tiên domain chính xác
            for (let link of allLinks) {
                if (!link.href) continue;
                
                try {
                    let url = new URL(link.href);
                    let host = url.hostname.replace(/^www\./, '');
                    
                    if (host === config.exactDomain && isValidResult(link)) {
                        console.log(`[Auto] 🎯 TÌM THẤY! ${config.exactDomain}: ${link.href}`);
                        
                        clickCompleted = true;
                        updateFiveStatus(`✅ Tìm thấy!<br>🎯 <strong>${config.exactDomain}</strong><br>🚀 Chuyển hướng...`);
                        
                        setTimeout(() => {
                            console.log(`[Auto] 🚀 Chuyển đến: ${link.href}`);
                            window.location.href = link.href;
                        }, 1500);
                        
                        return true;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            // BƯỚC 2: Domain dự phòng
            for (let link of allLinks) {
                if (!link.href) continue;
                
                try {
                    let url = new URL(link.href);
                    let host = url.hostname.replace(/^www\./, '');
                    let text = (link.innerText || '').toLowerCase();
                    
                    const isBackupDomain = config.backupDomains.some(domain => host.includes(domain));
                    const hasKeyword = text.includes(config.keyword.toLowerCase());
                    
                    if ((isBackupDomain || hasKeyword) && isValidResult(link)) {
                        console.log(`[Auto] ✅ Domain dự phòng: ${host}: ${link.href}`);
                        
                        clickCompleted = true;
                        updateFiveStatus(`⚠️ Dự phòng:<br><strong>${host}</strong><br>🚀 Chuyển hướng...`);
                        
                        setTimeout(() => {
                            console.log(`[Auto] 🚀 Chuyển đến dự phòng: ${link.href}`);
                            window.location.href = link.href;
                        }, 1500);
                        
                        return true;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            updateFiveStatus(`❌ Chưa thấy ${config.displayName}<br>🔄 Tiếp tục...`);
            return false;
        }
        
        function startAutoSearch() {
            if (searchCompleted && clickCompleted) return;
            
            if (autoSelectResult()) {
                searchCompleted = true;
                return;
            }
            
            let searchBox = document.querySelector('textarea.gLFyf, input[name="q"]');
            if (searchBox && !searchCompleted) {
                const config = siteConfigs[selectedSite];
                
                console.log(`[Auto] Nhập từ khóa: "${config.keyword}"`);
                updateFiveStatus(`🔍 Nhập từ khóa...<br>"<strong>${config.keyword}</strong>"`);
                
                searchBox.value = config.keyword;
                searchBox.focus();
                
                searchBox.dispatchEvent(new Event('input', { bubbles: true }));
                searchBox.dispatchEvent(new Event('change', { bubbles: true }));
                
                setTimeout(() => {
                    if (searchBox.form) {
                        searchBox.form.dispatchEvent(new Event('submit', { bubbles: true }));
                    } else {
                        const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
                        if (submitBtn) {
                            submitBtn.click();
                        }
                    }
                    
                    searchCompleted = true;
                    updateFiveStatus(`⏳ Chờ kết quả...<br>🎯 <strong>${config.exactDomain}</strong>`);
                }, 1200);
                
                return true;
            }
            
            return false;
        }
        
        const googleObserver = new MutationObserver(() => {
            createFiveSiteMenu();
            
            if (autoSearchStarted && searchCompleted && !clickCompleted) {
                setTimeout(() => {
                    autoSelectResult();
                }, 2000);
            }
        });
        
        googleObserver.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(() => {
            createFiveSiteMenu();
        }, 1500);
        
        setInterval(() => {
            if (autoSearchStarted && searchCompleted && !clickCompleted) {
                const hasResults = document.querySelector('div.kb0PBd, .yuRUbf, .tF2Cxc, .g');
                if (hasResults) {
                    console.log("[Auto] Kiểm tra định kỳ - tự động chọn...");
                    autoSelectResult();
                }
            }
        }, 3000);
        
        return;
    }
    
    // ====== PHẦN CASINO - GIAO DIỆN MỚI + LƯU TRỮ + ƯU TIÊN NÚT ======
    
    console.log("[Auto] Đã vào casino - khởi động panel với ưu tiên nút cho anh doanhvipqq");
    
    const footerSelectors = [
        'footer a',
        '.footer a', 
        'div[class*="footer"] a',
        'section[class*="footer"] a',
        '[id*="footer"] a',
        '.site-footer a',
        '#footer a',
        '.bottom a',
        '.bottom-area a'
    ];
    
    const postSelectors = [
        'article a',
        '.post a',
        '.entry a',
        '.content a',
        'main a',
        'img.attachment-medium',
        '.wp-post-image',
        '.post-content a',
        '.entry-content a'
    ];
    
    const buttonSelectors = {
        red: 'span.ymn-btn.ymn-btn3, .red-btn, .btn-red, [class*="btn3"]',
        green: 'span.ymn-btn.ymn-btn4, .green-btn, .btn-green, [class*="btn4"]'
    };
    
    const messageText = 'Vui lòng click vào link trang bất kỳ để lấy mã';
    
    let step1Done = false;
    let step2Done = false;
    let autoLoopRunning = false;
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    function createFiveCasinoPanel() {
        if (document.getElementById('vn-five-casino-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'vn-five-casino-panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            left: 60px;
            z-index: 9999999;
            background: linear-gradient(135deg, #DC143C, #B22222);
            border-radius: 15px;
            color: #fff;
            font-weight: 600;
            font-size: 13px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255,255,255,0.1);
            overflow: hidden;
            transition: all 0.3s ease;
            min-width: 300px;
            max-width: 300px;
        `;
        
        const currentSite = siteConfigs[selectedSite] ? siteConfigs[selectedSite].displayName : 'Chưa chọn';
        const currentButton = buttonPreference[preferredButton].name;
        
        panel.innerHTML = `
            <div class="drag-handle" style="
                background: linear-gradient(135deg, #8B0000, #654321);
                padding: 10px 15px;
                text-align: center;
                cursor: move;
                user-select: none;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1; text-align: center;">
                        <div id="five-casino-title" style="font-size: 15px; margin-bottom: 3px;">
                            🔴 AUTO CLICK
                        </div>
                        <div id="five-casino-subtitle" style="font-size: 10px; opacity: 0.85; color: #FFD700;">
                            Kéo để di chuyển
                        </div>
                    </div>
                    <button id="five-casino-minimize-btn" style="
                        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                        border: none;
                        color: #fff;
                        padding: 5px 8px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 10px;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">
                        ${isCasinoMinimized ? '🔴' : '➖'}
                    </button>
                </div>
            </div>
            <div id="five-casino-content" style="padding: 15px; ${isCasinoMinimized ? 'display: none;' : ''}">
                <div style="font-size:12px; margin-bottom:8px; color:#FFD700; text-align: center;">
                    <strong>Casino:</strong> ${currentSite}<br>
                    <strong>Ưu tiên:</strong> ${currentButton} | <strong>doanhvipqq</strong>
                </div>
                <div id="five-casino-status" style="font-size:12px; padding:10px; background:rgba(255,255,255,0.2); border-radius:10px; border: 1px solid rgba(255,255,255,0.3); text-align: center;">
                    Đang khởi động auto click với ưu tiên ${currentButton}...
                </div>
                <div style="text-align: center; margin-top: 10px; font-size: 9px; opacity: 0.75; background: rgba(255,255,255,0.08); padding: 6px; border-radius: 6px;">
                    💡 <strong>MỚI:</strong> Ưu tiên nút ${buttonPreference[preferredButton].emoji} + Lưu trữ<br>
                    🚀 Hỗ trợ: M88, 188bet, VN88, V9bet, FB88<br>
                    💾 Cài đặt: <strong>${currentSite}</strong> + <strong>${currentButton}</strong>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        makeElementDraggable(panel);
        
        // Áp dụng trạng thái thu nhỏ đã lưu
        if (isCasinoMinimized) {
            const casinoContent = document.getElementById('five-casino-content');
            const casinoTitle = document.getElementById('five-casino-title');
            const casinoSubtitle = document.getElementById('five-casino-subtitle');
            
            casinoContent.style.display = 'none';
            casinoTitle.style.display = 'none';
            casinoSubtitle.style.display = 'none';
            panel.style.minWidth = '40px';
            panel.style.maxWidth = '40px';
            panel.style.width = '40px';
            panel.style.height = '40px';
        }
        
        // Thu nhỏ casino - SIÊU GỌNG + LƯU TRỮ
        const fiveCasinoMinimizeBtn = document.getElementById('five-casino-minimize-btn');
        const casinoContent = document.getElementById('five-casino-content');
        const casinoTitle = document.getElementById('five-casino-title');
        const casinoSubtitle = document.getElementById('five-casino-subtitle');
        
        fiveCasinoMinimizeBtn.onclick = function(e) {
            e.stopPropagation();
            
            if (isCasinoMinimized) {
                // Mở rộng
                casinoContent.style.display = 'block';
                panel.style.minWidth = '300px';
                panel.style.maxWidth = '300px';
                panel.style.width = '300px';
                panel.style.height = 'auto';
                casinoTitle.style.display = 'block';
                casinoSubtitle.style.display = 'block';
                fiveCasinoMinimizeBtn.innerHTML = '➖';
                fiveCasinoMinimizeBtn.style.padding = '5px 8px';
                fiveCasinoMinimizeBtn.style.fontSize = '10px';
                isCasinoMinimized = false;
                saveCasinoState(false);
                console.log('[Thu nhỏ] Đã mở rộng panel casino + lưu trạng thái');
            } else {
                // Thu nhỏ SIÊU GỌNG
                casinoContent.style.display = 'none';
                casinoTitle.style.display = 'none';
                casinoSubtitle.style.display = 'none';
                panel.style.minWidth = '40px';
                panel.style.maxWidth = '40px';
                panel.style.width = '40px';
                panel.style.height = '40px';
                fiveCasinoMinimizeBtn.innerHTML = '🔴';
                fiveCasinoMinimizeBtn.style.padding = '2px';
                fiveCasinoMinimizeBtn.style.fontSize = '16px';
                isCasinoMinimized = true;
                saveCasinoState(true);
                console.log('[Thu nhỏ] Đã thu siêu nhỏ panel casino + lưu trạng thái');
            }
        };
        
        // Hover effect
        fiveCasinoMinimizeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        fiveCasinoMinimizeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    function updateFiveCasinoStatus(text, color = '#fff') {
        const statusEl = document.getElementById('five-casino-status');
        if (statusEl) {
            statusEl.innerHTML = text;
            statusEl.style.color = color;
        }
        console.log(`[Auto Casino] ${text}`);
    }
    
    async function humanClick(element) {
        if (!element) return false;
        
        try {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(randomDelay(800, 1200));
            
            // Highlight để debug
            const originalBg = element.style.backgroundColor;
            element.style.backgroundColor = 'red';
            element.style.border = '2px solid yellow';
            
            console.log(`[Click] Đang click: ${element.tagName} - ${element.innerText?.substring(0, 30) || 'No text'}`);
            
            // Multiple click methods
            element.click();
            
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0
            });
            element.dispatchEvent(clickEvent);
            
            // Restore style
            setTimeout(() => {
                element.style.backgroundColor = originalBg;
                element.style.border = '';
            }, 1500);
            
            await sleep(randomDelay(500, 800));
            return true;
        } catch (error) {
            console.error('❌ Lỗi khi click:', error);
            return false;
        }
    }
    
    async function clickButtonWithPreference() {
        if (step1Done) return;
        
        const preferredType = preferredButton; // 'red' hoặc 'green'
        const alternativeType = preferredType === 'red' ? 'green' : 'red';
        
        updateFiveCasinoStatus(`🔍 Tìm nút ${buttonPreference[preferredType].name}...`);
        console.log(`[Ưu tiên] Tìm ${buttonPreference[preferredType].name} trước`);
        
        // BƯỚC 1: Tìm nút ưu tiên trước
        let preferredBtn = document.querySelector(buttonSelectors[preferredType]);
        if (preferredBtn) {
            step1Done = true;
            updateFiveCasinoStatus(`✅ Click ${buttonPreference[preferredType].name} OK!`, '#00ff00');
            console.log(`✅ Đã click nút ưu tiên: ${buttonPreference[preferredType].name}`);
            await humanClick(preferredBtn);
            return true;
        }
        
        // BƯỚC 2: Nếu không có nút ưu tiên, tìm nút còn lại
        let alternativeBtn = document.querySelector(buttonSelectors[alternativeType]);
        if (alternativeBtn) {
            step1Done = true;
            updateFiveCasinoStatus(`✅ Click ${buttonPreference[alternativeType].name} OK! (dự phòng)`, '#90EE90');
            console.log(`✅ Đã click nút dự phòng: ${buttonPreference[alternativeType].name}`);
            await humanClick(alternativeBtn);
            return true;
        }
        
        updateFiveCasinoStatus(`⏳ Chưa thấy nút nào...`, '#ffff00');
        return false;
    }
    
    async function clickFooterLinkFixed() {
        if (step2Done) return;
        
        updateFiveCasinoStatus('🔍 Tìm footer link...');
        console.log('[Footer] Bắt đầu tìm footer');
        
        // Scroll xuống để tìm footer
        for (let scroll = 0; scroll < 6; scroll++) {
            window.scrollBy(0, 600);
            await sleep(600);
            
            // Thử tất cả selector footer
            for (let selector of footerSelectors) {
                let footerLinks = document.querySelectorAll(selector);
                console.log(`[Footer] Tìm thấy ${footerLinks.length} link với selector: ${selector}`);
                
                for (let link of footerLinks) {
                    if (link.href && 
                        !link.href.includes('javascript:') && 
                        !link.href.includes('#') &&
                        !link.href.includes('mailto:') &&
                        link.href !== window.location.href) {
                        
                        console.log(`[Footer] ✅ Tìm thấy footer link: ${link.href}`);
                        
                        step2Done = true;
                        updateFiveCasinoStatus('✅ Click footer OK!', '#00ff00');
                        await humanClick(link);
                        return true;
                    }
                }
            }
            
            // Nếu không có footer, thử post links
            for (let selector of postSelectors) {
                let postLinks = document.querySelectorAll(selector);
                console.log(`[Post] Tìm thấy ${postLinks.length} link với selector: ${selector}`);
                
                for (let link of postLinks) {
                    if (link.href && 
                        !link.href.includes('javascript:') && 
                        !link.href.includes('#') &&
                        !link.href.includes('mailto:') &&
                        link.href !== window.location.href) {
                        
                        console.log(`[Post] ✅ Tìm thấy post link: ${link.href}`);
                        
                        step2Done = true;
                        updateFiveCasinoStatus('✅ Click post OK!', '#00ff00');
                        await humanClick(link);
                        return true;
                    }
                }
            }
        }
        
        // Fallback: click bất kỳ link hợp lệ nào
        const allLinks = document.querySelectorAll('a[href]');
        console.log(`[Fallback] Thử click trong ${allLinks.length} link tổng`);
        
        for (let link of allLinks) {
            if (link.href && 
                !link.href.includes('javascript:') && 
                !link.href.includes('#') &&
                !link.href.includes('mailto:') &&
                link.href !== window.location.href &&
                link.href.length > 10) {
                
                console.log(`[Fallback] ✅ Click link bất kỳ: ${link.href}`);
                
                step2Done = true;
                updateFiveCasinoStatus('✅ Click link OK!', '#00ff00');
                await humanClick(link);
                return true;
            }
        }
        
        updateFiveCasinoStatus('❌ Không tìm thấy link', '#ff0000');
        console.log('[Footer] ❌ Không tìm thấy link nào');
        return false;
    }
    
    function observePageChanges() {
        const observer = new MutationObserver(async () => {
            await sleep(randomDelay(500, 800));
            
            if (document.body.innerText.includes(messageText) && !step2Done) {
                console.log('[Observer] Phát hiện message text, sẽ click footer');
                setTimeout(clickFooterLinkFixed, randomDelay(1000, 2000));
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    async function mainAutoLoop() {
        if (autoLoopRunning) return;
        autoLoopRunning = true;
        
        let attempts = 0;
        const maxAttempts = 25;
        
        const currentButton = buttonPreference[preferredButton].name;
        updateFiveCasinoStatus(`🚀 Khởi động auto với ${currentButton}...`);
        
        while ((!step1Done || !step2Done) && attempts < maxAttempts) {
            console.log(`[Loop] Vòng ${attempts + 1}/${maxAttempts} - Ưu tiên: ${currentButton}`);
            
            if (!document.body.innerText.includes(messageText)) {
                console.log('[Loop] Đang tìm nút với ưu tiên...');
                await clickButtonWithPreference();
            } else {
                console.log('[Loop] Tìm footer...');
                await clickFooterLinkFixed();
            }
            
            await sleep(randomDelay(3000, 4000));
            attempts++;
        }
        
        if (step1Done && step2Done) {
            updateFiveCasinoStatus('🎉 HOÀN THÀNH!', '#00ff00');
            console.log('🎉 AUTO CASINO HOÀN THÀNH!');
        } else {
            updateFiveCasinoStatus('⚠️ Chưa hoàn thành', '#FFA500');
            console.log('⚠️ Chưa hoàn thành hết');
        }
        
        autoLoopRunning = false;
    }
    
    // Khởi chạy
    window.addEventListener('load', () => {
        setTimeout(() => {
            createFiveCasinoPanel();
            observePageChanges();
            mainAutoLoop();
        }, 3000);
    });
    
    // Debug helper
    window.debugFooter = function() {
        console.log('=== DEBUG FOOTER ===');
        footerSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`${selector}: ${elements.length} elements`);
            elements.forEach((el, i) => {
                console.log(`  ${i}: ${el.href} - "${el.innerText?.substring(0, 30)}"`);
            });
        });
    };
    
    // Debug lưu trữ nâng cấp
    window.debugStorage = function() {
        console.log('=== DEBUG STORAGE V22 ===');
        console.log('Selected Site:', localStorage.getItem('vnAutoSelectedSite'));
        console.log('Preferred Button:', localStorage.getItem('vnAutoPreferredButton'));
        console.log('Menu Minimized:', localStorage.getItem('vnMenuMinimized'));
        console.log('Casino Minimized:', localStorage.getItem('vnCasinoMinimized'));
        console.log('Last Used Time:', new Date(parseInt(localStorage.getItem('vnLastUsedTime') || '0')));
        console.log('Current Settings:');
        console.log(`  - Casino: ${siteConfigs[selectedSite].displayName}`);
        console.log(`  - Button: ${buttonPreference[preferredButton].name}`);
    };
    
    // Hàm reset cài đặt nâng cấp
    window.resetVnAutoSettings = function() {
        localStorage.removeItem('vnAutoSelectedSite');
        localStorage.removeItem('vnAutoPreferredButton');
        localStorage.removeItem('vnMenuMinimized');
        localStorage.removeItem('vnCasinoMinimized');
        localStorage.removeItem('vnLastUsedTime');
        console.log('✅ Đã reset tất cả cài đặt V22 - reload trang để áp dụng!');
        alert('✅ Đã reset tất cả cài đặt!\nBao gồm: Casino, Ưu tiên nút, Thu nhỏ\nReload trang để áp dụng.');
    };
    
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
    });
    
    console.log("[Auto Việt Nam] ✅ Script V22 hoàn chỉnh - ƯU TIÊN NÚT ĐỎ/XANH + LƯU TRỮ!");
    console.log("[Auto] Chào anh doanhvipqq - 15/08/2025 11:55:47 - Giao diện + Ưu tiên nút!");
    console.log("[Debug] Gõ debugStorage() để xem cài đặt | resetVnAutoSettings() để reset");
    console.log(`[Cài đặt] Casino: ${siteConfigs[selectedSite].displayName} | Nút: ${buttonPreference[preferredButton].name}`);
    
})();