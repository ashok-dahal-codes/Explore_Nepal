// Auth Pages JS

// Toggle password visibility
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

// Login form validation
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('email');
        const password = document.getElementById('password');
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
            // TODO: connect to backend API
            console.log('Login submitted:', { email: email.value });
        }
    });
}

// Register form validation
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
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

        if (confirmPassword && password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            valid = false;
        }

        if (valid) {
            // TODO: connect to backend API
            console.log('Register submitted:', { fullName: fullName.value, email: email.value });
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.add('error');
    const errorEl = document.createElement('p');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    wrapper.parentElement.appendChild(errorEl);
}

function clearErrors() {
    document.querySelectorAll('.input-wrapper.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error').forEach(el => el.remove());
}
