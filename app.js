// ====================================================================
//  ПОДКЛЮЧЕНИЕ К SUPABASE
// ====================================================================
const SUPABASE_URL = 'https://oninodnelfzadiwchxxz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaW5vZG5lbGZ6YWRpd2NoeHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjU3MDUsImV4cCI6MjA5ODE0MTcwNX0.hWauqzJrKRzXRhlMJpvli3tS5_Mhm7n0O-EQtw8kwhI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ====================================================================
//  ЭЛЕМЕНТЫ ФОНА
// ====================================================================
const bgImage = document.getElementById('bgImage');
const bgColor = document.getElementById('bgColor');
let isCustomBgActive = false;

// ====================================================================
//  ФУНКЦИЯ ДЛЯ ПЛАВНОЙ СМЕНЫ ФОНА
// ====================================================================
function updateBackground(color) {
    if (color && color !== '#1a0b2e' && color !== '') {
        isCustomBgActive = true;
        bgImage.classList.add('hide');
        bgColor.style.background = color;
        bgColor.classList.add('show');
        localStorage.setItem('customBgColor', color);
        localStorage.setItem('bgImageHidden', 'true');
    } else {
        isCustomBgActive = false;
        bgImage.classList.remove('hide');
        bgColor.classList.remove('show');
        localStorage.removeItem('customBgColor');
        localStorage.removeItem('bgImageHidden');
    }
}

// ====================================================================
//  ПРОВЕРКА — ЕСЛИ УЖЕ ЗАЛОГИНЕН
// ====================================================================
async function checkUserAndRedirect() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log('👤 Пользователь уже залогинен:', user.email);
            window.location.href = 'profile.html';
        }
    } catch (error) {
        console.log('Ошибка проверки пользователя:', error.message);
    }
}

// ====================================================================
//  ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ЦВЕТА СТЕКЛА
// ====================================================================
function applyGlassStyles(color, opacity) {
    const wrapper = document.querySelector('.wrapper');
    const bottomLinks = document.querySelector('.bottom-links-outer');
    if (!wrapper) return;

    if (!color) {
        color = document.getElementById('glassColorPicker').value;
    }
    if (opacity === undefined) {
        opacity = parseFloat(document.getElementById('glassOpacity').value);
    }

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    wrapper.style.background = bgColor;
    wrapper.style.backdropFilter = 'blur(16px)';

    if (bottomLinks) {
        bottomLinks.style.background = bgColor;
        bottomLinks.style.backdropFilter = 'blur(16px)';
    }

    localStorage.setItem('customGlassColor', color);
    localStorage.setItem('customGlassOpacity', opacity);
}

// ====================================================================
//  ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ВСЕХ КНОПОК
// ====================================================================
function updateAllButtons(theme) {
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const loginBtn = document.getElementById('loginBtn');
    const regBtn = document.getElementById('regBtn');
    const isLoginActive = document.getElementById('loginForm').classList.contains('show');

    let activeStyle, inactiveStyle;

    if (theme === 'color') {
        activeStyle = {
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white'
        };
        inactiveStyle = {
            background: '#e5e7eb',
            color: '#333'
        };
    } else {
        activeStyle = {
            background: '#4f46e5',
            color: 'white'
        };
        inactiveStyle = {
            background: '#e5e7eb',
            color: '#333'
        };
    }

    if (isLoginActive) {
        Object.assign(showLoginBtn.style, activeStyle);
        Object.assign(showRegisterBtn.style, inactiveStyle);
    } else {
        Object.assign(showLoginBtn.style, inactiveStyle);
        Object.assign(showRegisterBtn.style, activeStyle);
    }

    if (isLoginActive) {
        Object.assign(loginBtn.style, activeStyle);
        Object.assign(regBtn.style, inactiveStyle);
    } else {
        Object.assign(loginBtn.style, inactiveStyle);
        Object.assign(regBtn.style, activeStyle);
    }
}

// ====================================================================
//  ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ЦВЕТА ССЫЛОК
// ====================================================================
function updateLinksColor(theme) {
    const forgotLink = document.getElementById('forgotPassword');
    const bottomLinks = document.querySelectorAll('.bottom-links-outer a');

    [forgotLink, ...bottomLinks].forEach(link => {
        if (link) {
            link.removeEventListener('mouseenter', link._enterHandler);
            link.removeEventListener('mouseleave', link._leaveHandler);

            const color = theme === 'color' ? '#a78bfa' : '#4f46e5';

            const enterHandler = function () {
                this.style.color = color;
            };
            const leaveHandler = function () {
                this.style.color = 'rgba(255, 255, 255, 0.8)';
            };

            link._enterHandler = enterHandler;
            link._leaveHandler = leaveHandler;

            link.addEventListener('mouseenter', enterHandler);
            link.addEventListener('mouseleave', leaveHandler);
        }
    });
}

// ====================================================================
//  ЕДИНАЯ СИСТЕМА ПЕРЕКЛЮЧЕНИЯ ТЕМ (С ПЛАВНОСТЬЮ)
// ====================================================================
window.setTheme = function (theme) {
    const body = document.body;
    const titleRegister = document.getElementById('titleRegister');

    body.classList.remove('dark-theme', 'light-theme', 'color-theme');

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        document.getElementById('themeDark').style.borderColor = '#4f46e5';
        document.getElementById('themeLight').style.borderColor = 'transparent';
        document.getElementById('themeColor').style.borderColor = 'transparent';
        titleRegister.style.color = '';
    } else if (theme === 'light') {
        body.classList.add('light-theme');
        document.getElementById('themeDark').style.borderColor = 'transparent';
        document.getElementById('themeLight').style.borderColor = '#4f46e5';
        document.getElementById('themeColor').style.borderColor = 'transparent';
        titleRegister.style.color = '';
    } else if (theme === 'color') {
        body.classList.add('color-theme');
        document.getElementById('themeDark').style.borderColor = 'transparent';
        document.getElementById('themeLight').style.borderColor = 'transparent';
        document.getElementById('themeColor').style.borderColor = '#4f46e5';
        titleRegister.style.color = '#a78bfa';
    }

    localStorage.setItem('appTheme', theme);

    setTimeout(() => {
        updateAllButtons(theme);
        updateLinksColor(theme);

        const savedGlass = localStorage.getItem('customGlassColor');
        const savedOpacity = localStorage.getItem('customGlassOpacity');
        if (savedGlass && savedOpacity) {
            applyGlassStyles(savedGlass, parseFloat(savedOpacity));
        } else {
            applyGlassStyles();
        }
    }, 80);
};

// Загружаем сохранённую тему
(function () {
    const savedTheme = localStorage.getItem('appTheme') || 'dark';
    window.setTheme(savedTheme);
})();

// ====================================================================
//  КАСТОМИЗАЦИЯ ЦВЕТОВ
// ====================================================================
let isCustomizeOpen = false;

window.toggleCustomize = function () {
    const panel = document.getElementById('customizePanel');
    isCustomizeOpen = !isCustomizeOpen;
    panel.style.display = isCustomizeOpen ? 'block' : 'none';
};

// --- Цвет фона ---
document.getElementById('bgColorPicker').addEventListener('input', function () {
    const color = this.value;
    document.getElementById('bgColorInput').value = color;
    updateBackground(color);
});

document.getElementById('bgColorInput').addEventListener('change', function () {
    const color = this.value;
    if (color.match(/^#[0-9a-fA-F]{6}$/)) {
        document.getElementById('bgColorPicker').value = color;
        updateBackground(color);
    }
});

// --- Цвет стекла ---
document.getElementById('glassColorPicker').addEventListener('input', function () {
    const color = this.value;
    document.getElementById('glassColorInput').value = color;
    applyGlassStyles(color);
});

document.getElementById('glassColorInput').addEventListener('change', function () {
    const color = this.value;
    if (color.match(/^#[0-9a-fA-F]{6}$/)) {
        document.getElementById('glassColorPicker').value = color;
        applyGlassStyles(color);
    }
});

// --- Прозрачность стекла ---
document.getElementById('glassOpacity').addEventListener('input', function () {
    const opacity = parseFloat(this.value);
    document.getElementById('glassOpacityValue').textContent = opacity.toFixed(2);
    applyGlassStyles(undefined, opacity);
});

// --- Сброс цветов ---
window.resetColors = function () {
    localStorage.removeItem('customBgColor');
    localStorage.removeItem('customGlassColor');
    localStorage.removeItem('customGlassOpacity');
    localStorage.removeItem('bgImageHidden');

    document.getElementById('bgColorPicker').value = '#1a0b2e';
    document.getElementById('bgColorInput').value = '#1a0b2e';
    document.getElementById('glassColorPicker').value = '#000000';
    document.getElementById('glassColorInput').value = '#000000';
    document.getElementById('glassOpacity').value = '0.45';
    document.getElementById('glassOpacityValue').textContent = '0.45';

    bgImage.classList.remove('hide');
    bgColor.classList.remove('show');
    isCustomBgActive = false;

    applyGlassStyles('#000000', 0.45);

    window.setTheme('color');
    setTimeout(() => window.setTheme('color'), 50);
};

// --- Загрузка сохранённых цветов ---
(function () {
    const savedBg = localStorage.getItem('customBgColor');
    const savedGlass = localStorage.getItem('customGlassColor');
    const savedOpacity = localStorage.getItem('customGlassOpacity');
    const bgHidden = localStorage.getItem('bgImageHidden');

    if (savedBg && bgHidden === 'true') {
        document.getElementById('bgColorPicker').value = savedBg;
        document.getElementById('bgColorInput').value = savedBg;
        bgImage.classList.add('hide');
        bgColor.style.background = savedBg;
        bgColor.classList.add('show');
        isCustomBgActive = true;
    } else {
        bgImage.classList.remove('hide');
        bgColor.classList.remove('show');
        isCustomBgActive = false;
    }

    if (savedGlass && savedOpacity) {
        document.getElementById('glassColorPicker').value = savedGlass;
        document.getElementById('glassColorInput').value = savedGlass;
        document.getElementById('glassOpacity').value = savedOpacity;
        document.getElementById('glassOpacityValue').textContent = parseFloat(savedOpacity).toFixed(2);
        applyGlassStyles(savedGlass, parseFloat(savedOpacity));
    } else {
        applyGlassStyles('#000000', 0.45);
    }
})();

// ====================================================================
//  ЭЛЕМЕНТЫ
// ====================================================================
const titleLogin = document.getElementById('titleLogin');
const titleRegister = document.getElementById('titleRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const linkToRegisterOuter = document.getElementById('linkToRegisterOuter');
const linkToLoginOuter = document.getElementById('linkToLoginOuter');
const loginBtn = document.getElementById('loginBtn');
const regBtn = document.getElementById('regBtn');

// ====================================================================
//  ПЕРЕКЛЮЧЕНИЕ ФОРМ
// ====================================================================
function switchToLogin() {
    titleLogin.className = 'slide-down';
    titleRegister.className = 'slide-up';
    loginForm.className = 'form-container show';
    registerForm.className = 'form-container hide';
    linkToRegisterOuter.className = 'visible-link';
    linkToLoginOuter.className = 'hidden-link';

    const body = document.body;
    let currentTheme = 'dark';
    if (body.classList.contains('light-theme')) currentTheme = 'light';
    else if (body.classList.contains('color-theme')) currentTheme = 'color';

    updateAllButtons(currentTheme);
    updateLinksColor(currentTheme);

    console.log('🔵 ВХОД');
}

function switchToRegister() {
    titleLogin.className = 'slide-up';
    titleRegister.className = 'slide-down';
    loginForm.className = 'form-container hide';
    registerForm.className = 'form-container show';
    linkToRegisterOuter.className = 'hidden-link';
    linkToLoginOuter.className = 'visible-link';

    const body = document.body;
    let currentTheme = 'dark';
    if (body.classList.contains('light-theme')) currentTheme = 'light';
    else if (body.classList.contains('color-theme')) currentTheme = 'color';

    updateAllButtons(currentTheme);
    updateLinksColor(currentTheme);

    console.log('🔴 РЕГИСТРАЦИЯ');
}

document.getElementById('showLoginBtn').addEventListener('click', function (e) {
    e.preventDefault();
    switchToLogin();
});

document.getElementById('showRegisterBtn').addEventListener('click', function (e) {
    e.preventDefault();
    switchToRegister();
});

document.getElementById('goToRegisterOuter').addEventListener('click', function (e) {
    e.preventDefault();
    switchToRegister();
});

document.getElementById('goToLoginOuter').addEventListener('click', function (e) {
    e.preventDefault();
    switchToLogin();
});

// ====================================================================
//  РЕГИСТРАЦИЯ
// ====================================================================
regBtn.addEventListener('click', async function () {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!email || !password) {
        alert('Заполните все поля!');
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert('Ошибка регистрации: ' + error.message);
    } else {
        alert('Регистрация успешна! Теперь войдите.');
        switchToLogin();
        document.getElementById('login-email').value = email;
        console.log(data);
    }
});

// ====================================================================
//  ВХОД
// ====================================================================
loginBtn.addEventListener('click', async function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Заполните все поля!');
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('Ошибка входа: ' + error.message);
    } else {
        alert('Добро пожаловать, ' + email + '!');
        window.location.href = 'profile.html';
        console.log(data);
    }
});

// ====================================================================
//  ЧЕКБОКС
// ====================================================================
document.getElementById('rememberMe').addEventListener('change', function () {
    const label = this.closest('.custom-checkbox');
    label.style.color = this.checked ? '#a5b4fc' : 'rgba(255, 255, 255, 0.85)';
});

// ====================================================================
//  ЗАПУСК ПРОВЕРКИ
// ====================================================================
checkUserAndRedirect();
let lang = 'ru';

window.toggleLang = function () {
    lang = lang === 'ru' ? 'en' : 'ru';
    updateLang();
};

function updateLang() {
    const texts = {
        ru: {
            title: 'Вход',
            register: 'Регистрация',
            email: 'Email',
            password: 'Пароль',
            remember: 'Запомнить меня',
            forgot: 'Забыли пароль?',
            login: 'Войти',
            signup: 'Зарегистрироваться',
            noAccount: 'Нет аккаунта?',
            hasAccount: 'Уже есть аккаунт?',
            langIcon: '🇷🇺',
            langText: 'RU'
        },
        en: {
            title: 'Login',
            register: 'Sign Up',
            email: 'Email',
            password: 'Password',
            remember: 'Remember me',
            forgot: 'Forgot password?',
            login: 'Login',
            signup: 'Sign Up',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            langIcon: '🇬🇧',
            langText: 'EN'
        }
    };

    const t = texts[lang];
    document.getElementById('titleLogin').textContent = t.title;
    document.getElementById('titleRegister').textContent = t.register;
    document.getElementById('login-email').placeholder = t.email;
    document.getElementById('login-password').placeholder = t.password;
    document.getElementById('reg-email').placeholder = t.email;
    document.getElementById('reg-password').placeholder = t.password;
    document.querySelector('.custom-checkbox').textContent = t.remember;
    document.getElementById('forgotPassword').textContent = t.forgot;
    document.getElementById('loginBtn').textContent = t.login;
    document.getElementById('regBtn').textContent = t.signup;
    document.getElementById('linkToRegisterOuter').innerHTML = t.noAccount + ' <a id="goToRegisterOuter">' + t.signup + '</a>';
    document.getElementById('linkToLoginOuter').innerHTML = t.hasAccount + ' <a id="goToLoginOuter">' + t.login + '</a>';
    document.getElementById('langIcon').textContent = t.langIcon;
    document.getElementById('langText').textContent = t.langText;
}
// ====================================================================
//  REGISTER (с подтверждением email)
// ====================================================================
document.getElementById('regBtn').addEventListener('click', async function () {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!email || !password) {
        showError('Заполните все поля!');
        return;
    }

    // Показываем процесс
    this.disabled = true;
    this.textContent = 'Отправка...';

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: window.location.origin + '/profile.html' // куда перенаправить после подтверждения
        }
    });

    this.disabled = false;
    this.textContent = 'Зарегистрироваться';

    if (error) {
        showError('Ошибка регистрации: ' + error.message);
        return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        showWarning('Пользователь уже существует! Попробуйте войти.');
        switchToLogin();
        document.getElementById('login-email').value = email;
        return;
    }

    if (data.user) {
        showSuccess('📧 На вашу почту отправлено письмо для подтверждения!');
        showInfo('Пожалуйста, подтвердите email, затем войдите.');
        switchToLogin();
        document.getElementById('login-email').value = email;
    }
});

// ====================================================================
//  LOGIN (с проверкой подтверждения)
// ====================================================================
document.getElementById('loginBtn').addEventListener('click', async function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showError('Заполните все поля!');
        return;
    }

    this.disabled = true;
    this.textContent = 'Вход...';

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    this.disabled = false;
    this.textContent = 'Войти';

    if (error) {
        // Специальное сообщение для неподтверждённого email
        if (error.message.includes('Email not confirmed')) {
            showError('❌ Email не подтверждён! Проверьте почту.');
            showInfo('📧 Отправить письмо повторно?', 5000);
            // Можно добавить кнопку для повторной отправки
        } else {
            showError('Ошибка входа: ' + error.message);
        }
        return;
    }

    if (data.user) {
        showSuccess('Добро пожаловать, ' + email + '! 🎉');
        window.location.href = 'profile.html';
    }
});

// ====================================================================
//  ПОВТОРНАЯ ОТПРАВКА ПОДТВЕРЖДЕНИЯ (опционально)
// ====================================================================
async function resendConfirmation(email) {
    if (!email) {
        const emailInput = document.getElementById('login-email').value;
        if (!emailInput) {
            showError('Введите email');
            return;
        }
        email = emailInput;
    }

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
            emailRedirectTo: window.location.origin + '/profile.html'
        }
    });

    if (error) {
        showError('Ошибка: ' + error.message);
    } else {
        showSuccess('📧 Письмо отправлено повторно! Проверьте почту.');
    }
}

// Добавляем кнопку для повторной отправки (можно разместить рядом с полем ввода)
// document.querySelector('.remember') - например, добавить ссылку "Отправить повторно"
console.log('✅ Всё загружено!');