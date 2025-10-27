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

// Download button SVG icon
const downloadIconSVG = `
<svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 16L12 4M12 16L8 12M12 16L16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 20H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

class AppManager {
    constructor() {
        this.currentCategory = 'programming';
        this.searchTerm = '';
        this.appsGrid = document.getElementById('apps-grid');
        this.categoryTitle = document.getElementById('category-title');
        this.categoryDescription = document.getElementById('category-description');
        this.settingsContent = document.getElementById('settings-content');
        
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
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.currentTarget.dataset.category);
            });
        });

        // Search input
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderApps();
        });

        // Login modal
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showLoginModal();
        });

        document.getElementById('close-login-modal').addEventListener('click', () => {
            this.hideLoginModal();
        });

        // Settings
        document.getElementById('check-updates-btn').addEventListener('click', () => {
            this.checkForUpdates();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape') {
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
        // Update active button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Update category
        this.currentCategory = category;
        
        // Show/hide content based on category
        if (category === 'settings') {
            this.appsGrid.classList.add('hidden');
            this.settingsContent.classList.remove('hidden');
            this.updateSettingsHeader();
        } else {
            this.appsGrid.classList.remove('hidden');
            this.settingsContent.classList.add('hidden');
            this.updateCategoryHeader();
            this.renderApps();
        }
    }

    updateCategoryHeader() {
        const titles = {
            programming: {
                title: 'Programming Apps',
                description: 'Development tools and programming environments'
            },
            default: {
                title: 'Default Apps', 
                description: 'Essential applications for everyday use'
            }
        };

        const current = titles[this.currentCategory];
        this.categoryTitle.textContent = current.title;
        this.categoryDescription.textContent = current.description;
    }

    updateSettingsHeader() {
        this.categoryTitle.textContent = 'Settings';
        this.categoryDescription.textContent = 'Configure your ResourceGO experience';
    }

    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
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

    getFilteredApps() {
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
        this.appsGrid.innerHTML = '';
        
        const filteredApps = this.getFilteredApps();
        
        if (filteredApps.length === 0) {
            this.appsGrid.innerHTML = `
                <div class="no-apps">
                    <h3>No applications found</h3>
                    <p>${this.searchTerm ? 'Try adjusting your search terms' : 'There are no applications in this category yet'}</p>
                </div>
            `;
            return;
        }
        
        filteredApps.forEach((app, index) => {
            const appCard = this.createAppCard(app);
            this.appsGrid.appendChild(appCard);
        });
    }

    createAppCard(app) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-card-header">
                <img src="${app.iconUrl}" alt="${app.name}" class="app-icon" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9IiMzMzMzMzMiLz4KPHN2ZyB4PSIxMi41IiB5PSIxMi41IiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNMTQgMkg2QTIgMiAwIDAgMCA0IDR2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjhhNiA2IDAgMCAwLTYtNnoiLz4KPHBhdGggZD0iTTE0IDJ2Nmg0Ii8+Cjwvc3ZnPgo8L3N2Zz4K'">
                <h3 class="app-name">${app.name}</h3>
            </div>
            <p class="app-description">${app.description}</p>
            <button class="install-btn" data-app-id="${app.id}">
                ${downloadIconSVG}
                Install Package
            </button>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;

        const installBtn = card.querySelector('.install-btn');
        installBtn.addEventListener('click', () => this.installApp(app));

        return card;
    }

    async installApp(app) {
        const button = document.querySelector(`[data-app-id="${app.id}"]`);
        const progressBar = button.nextElementSibling;
        const progressFill = progressBar.querySelector('.progress-fill');
        
        const originalText = button.innerHTML;
        
        try {
            button.classList.add('loading');
            progressBar.style.display = 'block';
            button.innerHTML = `${downloadIconSVG} Starting download...`;
            
            // Simulate progress for better UX
            this.simulateProgress(progressFill);
            
            const result = await window.electronAPI.downloadApp(app);
            
            if (result.success) {
                button.classList.remove('loading');
                button.classList.add('success');
                progressFill.style.width = '100%';
                button.innerHTML = `${downloadIconSVG} Download Complete!`;
                
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
            button.innerHTML = `${downloadIconSVG} Download Failed!`;
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('error');
            }, 3000);
        }
    }

    simulateProgress(progressFill) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 90) {
                progress = 90;
                clearInterval(interval);
            }
            progressFill.style.width = `${progress}%`;
        }, 200);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppManager();
});