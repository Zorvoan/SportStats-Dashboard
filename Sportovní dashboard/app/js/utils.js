/**
 * SportPulse - Pomocné funkce
 */

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123/';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minut

/**
 * Formátování data
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formátování času
 */
function formatTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formátování data a času
 */
function formatDateTime(dateString) {
    if (!dateString) return '-';
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

/**
 * Získání dnešního data ve formátu YYYY-MM-DD
 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Získání včerejšího data ve formátu YYYY-MM-DD
 */
function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

/**
 * Debounce funkce
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Získání query parametru z URL
 */
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Zobrazení chybové hlášky
 */
function showError(element, message) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.textContent = message;
        element.classList.add('visible');
    }
}

/**
 * Skrytí chybové hlášky
 */
function hideError(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.classList.remove('visible');
        element.textContent = '';
    }
}

/**
 * Uložení do cache
 */
function setCache(key, data) {
    const cacheData = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
}

/**
 * Získání z cache
 */
function getCache(key) {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(`cache_${key}`);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

/**
 * API fetch s caching
 */
async function fetchAPI(endpoint) {
    const cacheKey = endpoint.replace(/[^a-zA-Z0-9]/g, '_');
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setCache(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`API Error: ${endpoint}`, error);
        throw error;
    }
}

/**
 * Vytvoření loading spinner elementu
 */
function createLoadingSpinner() {
    const div = document.createElement('div');
    div.className = 'loading';
    div.innerHTML = '<div class="loading-spinner"></div> Načítání...';
    return div;
}

/**
 * Vytvoření empty state elementu
 */
function createEmptyState(message = 'Žádná data k zobrazení') {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = `<i class="fas fa-inbox"></i><p>${message}</p>`;
    return div;
}

/**
 * Vytvoření error state elementu
 */
function createErrorState(message = 'Chyba při načítání dat') {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = `<i class="fas fa-exclamation-circle" style="color: var(--error);"></i><p>${message}</p>`;
    return div;
}

/**
 * Bezpečné zobrazení textu (proti XSS)
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Zobrazení/skrytí dropdown menu
 */
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Zavřít dropdown při kliknutí mimo
document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.user-dropdown.active');
    dropdowns.forEach(dropdown => {
        if (!dropdown.closest('.navbar-user').contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});

/**
 * Inicializace vyhledávání v navbaru
 */
function initNavbarSearch() {
    const searchInput = document.getElementById('navbarSearch');
    if (!searchInput) return;

    const performSearch = debounce((query) => {
        if (query.length >= 2) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }, 500);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

/**
 * Inicializace navbar user menu
 */
function initNavbarUser() {
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('userDropdown');
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

/**
 * Aktualizace navbar user info
 */
function updateNavbarUser() {
    const user = getCurrentUser();
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');

    if (user) {
        if (nameEl) nameEl.textContent = user.username;
        if (avatarEl) avatarEl.textContent = user.username.charAt(0).toUpperCase();
    }
}
