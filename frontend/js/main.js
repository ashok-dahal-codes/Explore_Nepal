const API_BASE = 'http://localhost:8000/api/users';

// ============================================
// Auth State - Update Navbar
// ============================================
function updateNavbar() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const accessToken = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (!accessToken || !user) return;
    if (navActions.querySelector('.nav-user-menu')) return;

    const userData = JSON.parse(user);
    const firstName = userData.full_name.split(' ')[0];

    navActions.querySelector('.btn-login')?.style.setProperty('display', 'none');
    navActions.querySelector('.btn-signup')?.style.setProperty('display', 'none');

    const userMenu = document.createElement('div');
    userMenu.className = 'nav-user-menu';
    userMenu.innerHTML = `
        <button class="nav-user-btn" id="userMenuBtn">
            <i class="fa-solid fa-user-circle"></i>
            <span>${firstName}</span>
            <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="nav-user-dropdown" id="userDropdown">
            <div class="dropdown-header">
                <strong>${userData.full_name}</strong>
                <small>${userData.email}</small>
            </div>
            <hr>
            <a href="profile.html" class="dropdown-item">
                <i class="fa-solid fa-user"></i> My Profile
            </a>
            <button class="dropdown-item logout-btn" id="logoutBtn">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
        </div>
    `;
    navActions.appendChild(userMenu);

    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => userDropdown.classList.remove('show'));

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            await fetch(`${API_BASE}/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ refresh: refreshToken })
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            ['access_token', 'refresh_token', 'user'].forEach(k => localStorage.removeItem(k));
            window.location.href = 'login.html';
        }
    });
}

updateNavbar();

// ============================================
// Theme Toggle
// ============================================
document.getElementById('themeToggle')?.addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

// ============================================
// Navbar Scroll Effect
// ============================================
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ============================================
// Hamburger Menu
// ============================================
document.getElementById('hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('active');
    document.querySelector('.nav-actions')?.classList.toggle('active');
});

// ============================================
// Hero Search → Redirect to Explore Page
// ============================================
const heroSearchBtn = document.getElementById('heroSearchBtn');
const heroSearchInput = document.getElementById('heroSearch');

if (heroSearchBtn && heroSearchInput) {
    const doSearch = () => {
        const query = heroSearchInput.value.trim();
        window.location.href = query
            ? `explore.html?search=${encodeURIComponent(query)}`
            : 'explore.html';
    };

    heroSearchBtn.addEventListener('click', doSearch);
    heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
    });
}

// ============================================
// Newsletter Subscription
// ============================================
document.getElementById('newsletterForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('newsletterEmail');
    const messageDiv = document.getElementById('newsletterMessage');

    const showMessage = (text, color) => {
        messageDiv.innerHTML = `<p style="color:${color}; font-weight:bold;">${text}</p>`;
    };

    try {
        const response = await fetch(`${API_BASE}/newsletter/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value.trim() })
        });

        if (response.ok) {
            showMessage('✓ Subscribed successfully!', '#4CAF50');
            e.target.reset();
            setTimeout(() => { messageDiv.innerHTML = ''; }, 3000);
        } else {
            const errorData = await response.json();
            const alreadySubscribed = errorData.email?.[0]?.includes('already exists');
            showMessage(
                alreadySubscribed ? 'You are already subscribed!' : 'Error subscribing. Try again.',
                alreadySubscribed ? '#2196F3' : '#f44336'
            );
        }
    } catch {
        showMessage('Network error.', '#f44336');
    }
});