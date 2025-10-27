
const appsDatabase = [
    {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: 'Lightweight but powerful source code editor',
        downloadUrl: 'https://code.visualstudio.com/download',
        iconUrl: 'https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_vscode_icon_130084.png',
        category: 'programming'
    },
    {
        id: 'nodejs', 
        name: 'Node.js',
        description: 'JavaScript runtime built on Chrome V8 engine',
        downloadUrl: 'https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi',
        iconUrl: 'https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png',
        category: 'programming'
    },
    {
        id: 'python',
        name: 'Python',
        description: 'Programming language that lets you work quickly',
        downloadUrl: 'https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe',
        iconUrl: 'https://cdn.icon-icons.com/icons2/112/PNG/512/python_18894.png',
        category: 'programming'
    },
    {
        id: 'git',
        name: 'Git',
        description: 'Distributed version control system',
        downloadUrl: 'https://github.com/git-for-windows/git/releases/download/v2.40.1.windows.1/Git-2.40.1-64-bit.exe',
        iconUrl: 'https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_git_icon_130581.png',
        category: 'programming'
    },
    {
        id: 'postman',
        name: 'Postman',
        description: 'API platform for building and using APIs',
        downloadUrl: 'https://dl.pstmn.io/download/latest/win64',
        iconUrl: 'https://cdn.icon-icons.com/icons2/3053/PNG/512/postman_alt_macos_bigsur_icon_189814.png',
        category: 'programming'
    },
    {
        id: 'discord',
        name: 'Discord',
        description: 'Voice, video and text communication platform',
        downloadUrl: 'https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x86',
        iconUrl: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/discord_icon_130958.png',
        category: 'default'
    },
    {
        id: 'chrome',
        name: 'Google Chrome',
        description: 'Fast and secure web browser',
        downloadUrl: 'https://dl.google.com/tag/s/appguid%3D%7B8A69D345-D564-463C-AFF1-A69D9E530F96%7D%26iid%3D%7B%7D%26lang%3Den%26browser%3D0%26usagestats%3D0%26appname%3DGoogle%2520Chrome%26needsadmin%3Dprefers%26ap%3Dx64-stable-statsdef_1%26installdataindex%3Dempty/update2/installers/ChromeSetup.exe',
        iconUrl: 'https://cdn.icon-icons.com/icons2/2642/PNG/512/google_chrome_browser_logo_icon_159346.png',
        category: 'default'
    },
    {
        id: 'telegram',
        name: 'Telegram',
        description: 'Fast and secure messaging app',
        downloadUrl: 'https://telegram.org/dl/desktop/win',
        iconUrl: 'https://cdn.icon-icons.com/icons2/555/PNG/512/telegram_icon_112131.png',
        category: 'default'
    },
    {
        id: 'spotify',
        name: 'Spotify',
        description: 'Music streaming service',
        downloadUrl: 'https://download.scdn.co/SpotifyFullSetup.exe',
        iconUrl: 'https://cdn.icon-icons.com/icons2/836/PNG/512/Spotify_icon-icons.com_66783.png',
        category: 'default'
    },
    {
        id: 'vlc',
        name: 'VLC Media Player',
        description: 'Free and open source multimedia player',
        downloadUrl: 'https://get.videolan.org/vlc/3.0.18/win64/vlc-3.0.18-win64.exe',
        iconUrl: 'https://cdn.icon-icons.com/icons2/558/PNG/512/VLC_icon-icons.com_54252.png',
        category: 'default'
    }
];

class AppManager {
    constructor() {
        this.currentCategory = 'programming';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupWindowControls();
        this.loadAppVersion();
        this.renderApps();
    }

    setupWindowControls() {
        document.getElementById('minimize-btn').addEventListener('click', () => {
            window.electronAPI.windowControls('minimize');
        });

        document.getElementById('maximize-btn').addEventListener('click', () => {
            window.electronAPI.windowControls('maximize');
        });

        document.getElementById('close-btn').addEventListener('click', () => {
            window.electronAPI.windowControls('close');
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.currentTarget.dataset.category);
            });
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderApps();
        });

        document.getElementById('login-btn').addEventListener('click', () => {
            this.showLoginModal();
        });

        document.getElementById('close-login-modal').addEventListener('click', () => {
            this.hideLoginModal();
        });

        document.getElementById('login-modal').addEventListener('click', (e) => {
            if (e.target.id === 'login-modal') {
                this.hideLoginModal();
            }
        });
    }

    async loadAppVersion() {
        try {
            const version = await window.electronAPI.getAppVersion();
            document.getElementById('version-display').textContent = `v${version}`;
            document.getElementById('settings-version').textContent = `v${version}`;
        } catch (error) {
            console.error('Failed to load app version:', error);
        }
    }

    switchCategory(category) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.currentCategory = category;
    
        if (category === 'settings') {
            // В НАСТРОЙКАХ - СКРЫВАЕМ ПОИСК И ПРИЛОЖЕНИЯ
            document.getElementById('apps-grid').classList.add('hidden');
            document.getElementById('settings-content').classList.remove('hidden');
            document.querySelector('.search-container').classList.add('hidden');
            this.updateSettingsHeader();
            this.renderSettings();
        } else {
            // В КАТЕГОРИЯХ - ПОКАЗЫВАЕМ ПОИСК И ПРИЛОЖЕНИЯ
            document.getElementById('apps-grid').classList.remove('hidden');
            document.getElementById('settings-content').classList.add('hidden');
            document.querySelector('.search-container').classList.remove('hidden');
            this.updateCategoryHeader();
            this.renderApps();
        }
    }

    updateCategoryHeader() {
        const titles = {
            programming: 'Programming Apps',
            default: 'Default Apps'
        };
        const descriptions = {
            programming: 'Development tools and programming environments',
            default: 'Essential applications for everyday use'
        };

        document.getElementById('category-title').textContent = titles[this.currentCategory];
        document.getElementById('category-description').textContent = descriptions[this.currentCategory];
    }

    updateSettingsHeader() {
        document.getElementById('category-title').textContent = 'Settings';
        document.getElementById('category-description').textContent = 'Configure your ResourceGO experience';
    }

    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
    }

    getFilteredApps() {
        // ЕСЛИ МЫ В НАСТРОЙКАХ - НЕ ФИЛЬТРУЕМ ПРИЛОЖЕНИЯ!
        if (this.currentCategory === 'settings') {
            return [];
        }
    
        let filteredApps = appsDatabase.filter(app => app.category === this.currentCategory);
    
        if (this.searchTerm) {
            filteredApps = filteredApps.filter(app => 
                app.name.toLowerCase().includes(this.searchTerm) ||
                app.description.toLowerCase().includes(this.searchTerm)
            );
        }
    
        return filteredApps;
    }   

    renderApps() {
        const appsGrid = document.getElementById('apps-grid');
        appsGrid.innerHTML = '';
        
        const filteredApps = this.getFilteredApps();
        
        if (filteredApps.length === 0) {
            appsGrid.innerHTML = `
                <div class="no-apps">
                    <h3>No applications found</h3>
                    <p>${this.searchTerm ? 'Try adjusting your search terms' : 'There are no applications in this category yet'}</p>
                </div>
            `;
            return;
        }
        
        filteredApps.forEach((app, index) => {
            const appCard = this.createAppCard(app, index);
            appsGrid.appendChild(appCard);
        });
    }

    createAppCard(app, index) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.style.animationDelay = `${index * 0.1}s`;
    
        card.innerHTML = `
            <div class="app-card-header">
                <img src="${app.iconUrl}" alt="${app.name}" class="app-icon" 
                    onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFhMWExYSIvPgo8cGF0aCBkPSJNMTQgMTJIMjZWMjhIMTRWMTJaIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTQgMTZIMjZWMjBIMTRWMTZaIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'">
                <h3 class="app-name">${app.name}</h3>
            </div>
            <p class="app-description">${app.description}</p>
            <button class="install-btn" data-app-id="${app.id}">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 16L12 4M12 16L8 12M12 16L16 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 20H20" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Install Package
            </button>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;

        const installBtn = card.querySelector('.install-btn');
        installBtn.addEventListener('click', () => this.installApp(app, installBtn));

        return card;
    }

    async installApp(app, button) {
        const progressBar = button.nextElementSibling;
        const progressFill = progressBar.querySelector('.progress-fill');
    
        const originalText = button.innerHTML;
    
        try {
            button.classList.add('loading');
            progressBar.style.display = 'block';
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2V6M12 18V22M4 12H8M16 12H20" stroke-width="2"/>
                </svg>
                Starting download...
            `;
        
            // Анимация прогресса
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 90) {
                    progress = 90;
                    clearInterval(progressInterval);
                }
                progressFill.style.width = `${progress}%`;
            }, 200);
        
            const result = await window.electronAPI.downloadApp(app);
            clearInterval(progressInterval);
        
            if (result.success) {
                button.classList.remove('loading');
                button.classList.add('success');
                progressFill.style.width = '100%';
                button.innerHTML = `
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 6L9 17L4 12" stroke-width="2"/>
                    </svg>
                    Download Complete!
                `;
            
                // Анимация успеха
                button.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    button.style.animation = '';
                    button.innerHTML = originalText;
                    button.classList.remove('success');
                    progressBar.style.display = 'none';
                    progressFill.style.width = '0%';
                }, 3000);
            }
        } catch (error) {
            console.error('Download error:', error);
            button.classList.remove('loading');
            button.classList.add('error');
            progressBar.style.display = 'none';
            button.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6L18 18" stroke-width="2"/>
                </svg>
                Download Failed!
            `;
        
            // Анимация ошибки
            button.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                button.style.animation = '';
                button.innerHTML = originalText;
                button.classList.remove('error');
            }, 3000);
        }
    }

    renderSettings() {
        const settingsContent = document.getElementById('settings-content');
        settingsContent.innerHTML = `
            <div class="settings-grid">
                <div class="settings-card">
                    <h3>Application Settings</h3>
                    <div class="setting-item">
                        <div class="setting-info">
                            <span class="setting-label">Auto-check for updates</span>
                            <span class="setting-description">Automatically check for new versions on startup</span>
                        </div>
                        <div class="setting-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="auto-update" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <span class="setting-label">Start with system</span>
                            <span class="setting-description">Launch ResourceGO when your computer starts</span>
                        </div>
                        <div class="setting-control">
                            <label class="toggle-switch">
                                <input type="checkbox" id="startup">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>About ResourceGO</h3>
                    <div class="setting-item">
                        <div class="setting-info">
                            <span class="setting-label">Version</span>
                            <span class="setting-description" id="settings-version">v1.2.0</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <span class="setting-label">Developer</span>
                            <span class="setting-description">ResourceGO Team</span>
                        </div>
                    </div>
                    <div class="settings-actions">
                        <button class="action-btn" id="check-updates-btn">Check for Updates</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('check-updates-btn').addEventListener('click', () => {
            this.checkForUpdates();
        });
    }

    checkForUpdates() {
        const btn = document.getElementById('check-updates-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Checking...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = 'No updates available';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AppManager();
});