// ============================================
// Auth State - Update Navbar
// ============================================
const API_BASE = 'http://localhost:8000/api/users';

function updateNavbar() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const accessToken = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (accessToken && user) {
        const userData = JSON.parse(user);
        const firstName = userData.full_name.split(' ')[0];

        // Find and hide Login & Sign Up buttons
        const loginBtn = navActions.querySelector('.btn-login');
        const signupBtn = navActions.querySelector('.btn-signup');
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';

        // Check if user menu already exists (avoid duplicates)
        if (navActions.querySelector('.nav-user-menu')) return;

        // Create user menu
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

        // Toggle dropdown
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });

        // Logout
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
            }
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
}

// Run on page load
updateNavbar();

// ============================================
// Theme Toggle
// ============================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');
    });
}

// ============================================
// Navbar scroll effect
// ============================================
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// Hamburger menu
// ============================================
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        if (navLinks) navLinks.classList.toggle('active');
        if (navActions) navActions.classList.toggle('active');
    });
}

// ============================================
// Hero search → redirect to explore page
// ============================================
const heroSearchBtn = document.getElementById('heroSearchBtn');
const heroSearchInput = document.getElementById('heroSearch');
if (heroSearchBtn && heroSearchInput) {
    const doSearch = () => {
        const query = heroSearchInput.value.trim();
        if (query) {
            window.location.href = `explore.html?search=${encodeURIComponent(query)}`;
        } else {
            window.location.href = 'explore.html';
        }
    };
    heroSearchBtn.addEventListener('click', doSearch);
    heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
    });
}
// Newsletter subscription
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('newsletterEmail');
        const messageDiv = document.getElementById('newsletterMessage');

        try {
            const response = await fetch('http://localhost:8000/api/users/newsletter/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value.trim()
                })
            });

            if (response.ok) {
                messageDiv.innerHTML = '<p style="color: #4CAF50; font-weight: bold;">✓ Subscribed successfully!</p>';
                newsletterForm.reset();
                
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 3000);
            } else {
                const errorData = await response.json();
                if (errorData.email && errorData.email[0].includes('already exists')) {
                    messageDiv.innerHTML = '<p style="color: #2196F3; font-weight: bold;">You are already subscribed!</p>';
                } else {
                    messageDiv.innerHTML = '<p style="color: #f44336; font-weight: bold;">Error subscribing. Try again.</p>';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.innerHTML = '<p style="color: #f44336; font-weight: bold;">Network error.</p>';
        }
    });
}