// Contact Page JS

// Theme toggle
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// Contact form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const message = document.getElementById('contactMessage');
        let valid = true;

        if (!name.value.trim()) {
            showError(name, 'Name is required');
            valid = false;
        }

        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, 'Please enter a valid email');
            valid = false;
        }

        if (!message.value.trim()) {
            showErrorTextarea(message, 'Message is required');
            valid = false;
        }

        if (valid) {
            // TODO: connect to backend API
            console.log('Contact form submitted:', {
                name: name.value,
                email: email.value,
                message: message.value
            });
            contactForm.reset();
        }
    });
}

function showError(input, msg) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.add('error');
    const p = document.createElement('p');
    p.className = 'form-error';
    p.textContent = msg;
    wrapper.parentElement.appendChild(p);
}

function showErrorTextarea(textarea, msg) {
    const wrapper = textarea.closest('.textarea-wrapper');
    wrapper.classList.add('error');
    const p = document.createElement('p');
    p.className = 'form-error';
    p.textContent = msg;
    wrapper.parentElement.appendChild(p);
}

function clearErrors() {
    document.querySelectorAll('.input-wrapper.error, .textarea-wrapper.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error').forEach(el => el.remove());
}
