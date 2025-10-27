// Apps database with fixed icons
const appsDatabase = [
    // Programming apps
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
        id: 'docker',
        name: 'Docker Desktop',
        description: 'Containerization platform for developers',
        downloadUrl: 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe',
        iconUrl: 'https://cdn.icon-icons.com/icons2/2415/PNG/512/docker_original_logo_icon_146557.png',
        category: 'programming'
    },
    
    // Default apps
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
    },
    {
        id: 'firefox',
        name: 'Mozilla Firefox',
        description: 'Free and open-source web browser',
        downloadUrl: 'https://download.mozilla.org/?product=firefox-latest&os=win64&lang=en-US',
        iconUrl: 'https://cdn.icon-icons.com/icons2/390/PNG/512/firefox_39297.png',
        category: 'default'
    }
];

class AppManager {
    constructor() {
        this.currentCategory = 'programming';
        this.searchTerm = '';
        this.currentTheme = 'dark';
        this.currentUser = null;
        this.stats = {
            totalDownloads: 0,
            installedApps: 0,
            availableApps: appsDatabase.length
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupWindowControls();
        this.loadAppVersion();
        this.loadTheme();
        this.loadUser();
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
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.currentTarget.dataset.category);
            });
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderApps();
        });

        // Auth modal
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

        // Footer buttons
        document.getElementById('github-btn').addEventListener('click', () => {
            this.openGitHub();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.switchCategory('settings');
        });

        // Auth tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchAuthTab(e.currentTarget.dataset.tab);
            });
        });

        // Auth forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
            if (e.key === 'Escape') {
                this.hideLoginModal();
            }
        });
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const btn = document.querySelector('#login-form .auth-submit-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Logging in...';
        btn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo - always succeed
        this.currentUser = {
            username: email.split('@')[0],
            email: email
        };
        this.saveUser();
        
        btn.textContent = 'Login Successful!';
        btn.classList.add('success');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('success');
            this.hideLoginModal();
            this.updateUserInterface();
        }, 2000);
    }

    async handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            this.showError('Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long!');
            return;
        }
        
        const btn = document.querySelector('#register-form .auth-submit-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Creating account...';
        btn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo - always succeed
        this.currentUser = {
            username: username,
            email: email
        };
        this.saveUser();
        
        btn.textContent = 'Registration Successful!';
        btn.classList.add('success');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('success');
            this.switchAuthTab('login');
        }, 2000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: var(--error-color);
            color: white;
            padding: 10px;
            border-radius: 6px;
            margin: 10px 0;
            text-align: center;
            animation: shake 0.5s ease-in-out;
        `;
        
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            const existingError = form.querySelector('.error-message');
            if (existingError) existingError.remove();
            form.prepend(errorDiv);
        });
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    openGitHub() {
        window.open('https://github.com/Dreamclip/ResourceGO', '_blank');
    }

    switchTheme(theme) {
        this.currentTheme = theme;
        document.body.className = theme + '-theme';
        localStorage.setItem('resourcego-theme', theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('resourcego-theme') || 'dark';
        this.switchTheme(savedTheme);
    }

    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('resourcego-user', JSON.stringify(this.currentUser));
        }
    }

    loadUser() {
        const savedUser = localStorage.getItem('resourcego-user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('resourcego-user');
        this.updateUserInterface();
    }

    updateUserInterface() {
        const loginBtn = document.getElementById('login-btn');
        if (this.currentUser) {
            loginBtn.innerHTML = `
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21V19C20 17.139 18.861 15.574 17 15.093V14.093C17.374 13.552 17.7 12.998 18 12.439C18.335 11.821 18.617 11.174 18.845 10.5C19.272 9.299 19.558 8.055 19.69 6.786C19.867 5.051 19.046 3.459 17.5 3.09V3.09H6.5V3.09C4.954 3.459 4.133 5.051 4.31 6.786C4.442 8.055 4.728 9.299 5.155 10.5C5.383 11.174 5.665 11.821 6 12.439C6.3 12.998 6.626 13.552 7 14.093V15.093C5.139 15.574 4 17.139 4 19V21"/>
                </svg>
                <span>${this.currentUser.username}</span>
            `;
            loginBtn.onclick = () => this.showUserMenu();
        } else {
            loginBtn.innerHTML = `
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21V19C20 17.139 18.861 15.574 17 15.093V14.093C17.374 13.552 17.7 12.998 18 12.439C18.335 11.821 18.617 11.174 18.845 10.5C19.272 9.299 19.558 8.055 19.69 6.786C19.867 5.051 19.046 3.459 17.5 3.09V3.09H6.5V3.09C4.954 3.459 4.133 5.051 4.31 6.786C4.442 8.055 4.728 9.299 5.155 10.5C5.383 11.174 5.665 11.821 6 12.439C6.3 12.998 6.626 13.552 7 14.093V15.093C5.139 15.574 4 17.139 4 19V21"/>
                </svg>
                <span>Login / Register</span>
            `;
            loginBtn.onclick = () => this.showLoginModal();
        }
    }

    showUserMenu() {
        // Simple logout for now
        if (confirm(`Logout from ${this.currentUser.username}?`)) {
            this.logout();
        }
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
        
        // Only update nav buttons if not settings (settings button is in footer)
        if (category !== 'settings') {
            document.querySelector(`[data-category="${category}"]`).classList.add('active');
        }

        this.currentCategory = category;
        
        if (category === 'settings') {
            document.getElementById('apps-grid').classList.add('hidden');
            document.getElementById('settings-content').classList.remove('hidden');
            document.querySelector('.search-container').classList.add('hidden');
            this.updateSettingsHeader();
            this.renderSettings();
        } else {
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
        // Reset forms
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
    }

    getFilteredApps() {
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
                
                // Update stats
                this.stats.totalDownloads++;
                
                setTimeout(() => {
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
            
            setTimeout(() => {
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
                    <h3>Theme Settings</h3>
                    <div class="theme-selector">
                        <div class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''} theme-dark" 
                             onclick="appManager.switchTheme('dark')">
                            <div class="theme-preview"></div>
                            <div>Dark</div>
                        </div>
                        <div class="theme-option ${this.currentTheme === 'transparent' ? 'active' : ''} theme-transparent" 
                             onclick="appManager.switchTheme('transparent')">
                            <div class="theme-preview"></div>
                            <div>Transparent</div>
                        </div>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>Application Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-card floating">
                            <div class="stat-number">${this.stats.totalDownloads}</div>
                            <div class="stat-label">Total Downloads</div>
                        </div>
                        <div class="stat-card floating" style="animation-delay: 0.2s">
                            <div class="stat-number">${this.stats.availableApps}</div>
                            <div class="stat-label">Available Apps</div>
                        </div>
                        <div class="stat-card floating" style="animation-delay: 0.4s">
                            <div class="stat-number">${this.stats.installedApps}</div>
                            <div class="stat-label">Installed Apps</div>
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
                            <span class="setting-description">Dreamclip</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <span class="setting-label">GitHub</span>
                            <span class="setting-description">github.com/Dreamclip/ResourceGO</span>
                        </div>
                    </div>
                    <div class="settings-actions">
                        <button class="action-btn" id="check-updates-btn">Check for Updates</button>
                        <button class="action-btn secondary" onclick="appManager.openGitHub()">Visit GitHub</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('check-updates-btn').addEventListener('click', () => {
            this.checkForUpdates();
        });

        // Setup toggle switches
        const autoUpdate = document.getElementById('auto-update');
        const startup = document.getElementById('startup');
        
        if (autoUpdate) {
            autoUpdate.checked = localStorage.getItem('auto-update') !== 'false';
            autoUpdate.addEventListener('change', (e) => {
                localStorage.setItem('auto-update', e.target.checked);
            });
        }
        
        if (startup) {
            startup.checked = localStorage.getItem('startup') === 'true';
            startup.addEventListener('change', (e) => {
                localStorage.setItem('startup', e.target.checked);
            });
        }
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

// Global app manager instance
let appManager;
document.addEventListener('DOMContentLoaded', () => {
    appManager = new AppManager();
});