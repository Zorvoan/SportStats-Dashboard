/**
 * SportPulse - Autentikační logika
 */

const USERS_KEY = 'sportpulse_users';
const CURRENT_USER_KEY = 'sportpulse_current_user';

/**
 * Získání všech uživatelů z localStorage
 */
function getUsers() {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch {
        return [];
    }
}

/**
 * Uložení uživatelů do localStorage
 */
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Registrace nového uživatele
 */
function register(username, email, password) {
    const users = getUsers();

    // Kontrola, zda email již existuje
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Uživatel s tímto emailem již existuje.' };
    }

    // Kontrola, zda username již existuje
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: 'Uživatelské jméno je již obsazeno.' };
    }

    const newUser = {
        id: Date.now().toString(),
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: password, // V produkci by mělo být hashované
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Automatické přihlášení po registraci
    const userSession = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
    };
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));

    return { success: true, user: userSession };
}

/**
 * Přihlášení uživatele
 */
function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, error: 'Uživatel s tímto emailem neexistuje.' };
    }

    if (user.password !== password) {
        return { success: false, error: 'Nesprávné heslo.' };
    }

    const userSession = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));

    return { success: true, user: userSession };
}

/**
 * Odhlášení uživatele
 */
function logout() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

/**
 * Získání aktuálně přihlášeného uživatele
 */
function getCurrentUser() {
    try {
        const user = sessionStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

/**
 * Kontrola, zda je uživatel přihlášen
 * Pokud ne, přesměruje na login stránku
 */
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/**
 * Inicializace přihlašovacího formuláře
 */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');

        hideError(errorEl);

        // Validace
        if (!email || !password) {
            showError(errorEl, 'Vyplňte všechna pole.');
            return;
        }

        if (!isValidEmail(email)) {
            showError(errorEl, 'Zadejte platný email.');
            return;
        }

        const result = login(email, password);
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            showError(errorEl, result.error);
        }
    });
}

/**
 * Inicializace registračního formuláře
 */
function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const errorEl = document.getElementById('registerError');

        hideError(errorEl);

        // Validace
        if (!username || !email || !password || !confirmPassword) {
            showError(errorEl, 'Vyplňte všechna pole.');
            return;
        }

        if (username.length < 3) {
            showError(errorEl, 'Uživatelské jméno musí mít alespoň 3 znaky.');
            return;
        }

        if (!isValidEmail(email)) {
            showError(errorEl, 'Zadejte platný email.');
            return;
        }

        if (password.length < 6) {
            showError(errorEl, 'Heslo musí mít alespoň 6 znaků.');
            return;
        }

        if (password !== confirmPassword) {
            showError(errorEl, 'Hesla se neshodují.');
            return;
        }

        const result = register(username, email, password);
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            showError(errorEl, result.error);
        }
    });
}

/**
 * Validace emailu
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
