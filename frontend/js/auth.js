// Auth Pages JS
// Backend API base URL
const API_BASE = 'http://localhost:8000/api/users';

// ============================================
// Social Login Configuration
// ============================================
const GOOGLE_CLIENT_ID = '528492693130-ro8ctqjccu3m6d4v7m9036c8vnc1fo64.apps.googleusercontent.com';
const SOCIAL_CALLBACK_URI = 'http://127.0.0.1:5500/Explore_Nepal/frontend/pages/social-callback.html';

// Google OAuth redirect
document.querySelectorAll('.btn-social').forEach(btn => {
    const label = btn.getAttribute('aria-label') || '';

    if (label.includes('Google')) {
        btn.addEventListener('click', () => {
            const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
                + '?client_id=' + encodeURIComponent(GOOGLE_CLIENT_ID)
                + '&redirect_uri=' + encodeURIComponent(SOCIAL_CALLBACK_URI)
                + '&response_type=token'
                + '&scope=' + encodeURIComponent('email profile');
            window.location.href = googleAuthUrl;
        });
    }
});

// ============================================
// Toggle password visibility
// ============================================
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ============================================
// Login Form
// ============================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const submitBtn = loginForm.querySelector('.btn-auth-submit');
        let valid = true;

        if (!email.value.trim() || !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            valid = false;
        }

        if (!password.value || password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            valid = false;
        }

        if (valid) {
            // Disable button while loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

            try {
                const response = await fetch(`${API_BASE}/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.value.trim(),
                        password: password.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save tokens & user data to localStorage
                    localStorage.setItem('access_token', data.tokens.access);
                    localStorage.setItem('refresh_token', data.tokens.refresh);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Redirect to home page
                    window.location.href = 'index.html';
                } else {
                    // Show error from backend
                    const errorMsg = data.error || data.detail || 'Invalid email or password';
                    showError(password, errorMsg);
                }
            } catch (err) {
                showError(password, 'Network error. Make sure the server is running.');
                console.error('Login error:', err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In <i class="fa-solid fa-arrow-right"></i>';
            }
        }
    });
}

// ============================================
// Register Form
// ============================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');
        const submitBtn = registerForm.querySelector('.btn-auth-submit');
        let valid = true;

        if (!fullName.value.trim()) {
            showError(fullName, 'Full name is required');
            valid = false;
        }

        if (!email.value.trim() || !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            valid = false;
        }

        if (!password.value || password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            valid = false;
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            valid = false;
        }

        if (!terms.checked) {
            showError(terms, 'You must agree to the Terms of Service');
            valid = false;
        }

        if (valid) {
            // Disable button while loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

            try {
                const response = await fetch(`${API_BASE}/register/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        full_name: fullName.value.trim(),
                        email: email.value.trim(),
                        password: password.value,
                        password_confirm: confirmPassword.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save tokens & user data to localStorage
                    localStorage.setItem('access_token', data.tokens.access);
                    localStorage.setItem('refresh_token', data.tokens.refresh);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Redirect to home page
                    window.location.href = 'index.html';
                } else {
                    // Show backend validation errors
                    if (data.email) {
                        showError(email, data.email[0]);
                    } else if (data.password) {
                        showError(password, data.password[0]);
                    } else if (data.full_name) {
                        showError(fullName, data.full_name[0]);
                    } else {
                        const errorMsg = data.detail || 'Registration failed. Please try again.';
                        showError(email, errorMsg);
                    }
                }
            } catch (err) {
                showError(email, 'Network error. Make sure the server is running.');
                console.error('Register error:', err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account <i class="fa-solid fa-arrow-right"></i>';
            }
        }
    });
}

// ============================================
// Helper Functions
// ============================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const wrapper = input.closest('.input-wrapper') || input.closest('.form-group-inline');
    if (wrapper) {
        wrapper.classList.add('error');
    }
    const errorEl = document.createElement('p');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    const parent = input.closest('.form-group') || input.closest('.form-group-inline');
    if (parent) {
        parent.appendChild(errorEl);
    }
}

function clearErrors() {
    document.querySelectorAll('.input-wrapper.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-group-inline.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error').forEach(el => el.remove());
}

// ============================================
// Auth Utility Functions (used by other pages)
// ============================================

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('access_token') !== null;
}

// Get current user data
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout function
async function logout() {
    const accessToken = localStorage.getItem('access_token');
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

    // Always clear local storage and redirect
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}