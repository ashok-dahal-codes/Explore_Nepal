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

// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const subject = document.getElementById('contactSubject'); // Add if you have subject field
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
            try {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                // Prepare form data
                const formData = {
                    full_name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject ? subject.value.trim() : 'Contact Form Submission', // Default subject if no field
                    message: message.value.trim()
                };

                // Send to backend
                const response = await fetch('http://localhost:8000/api/users/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // Show success message
                    showSuccessMessage('Message sent successfully! ✓ We will get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Restore button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        hideSuccessMessage();
                    }, 5000);
                } else {
                    const errorData = await response.json();
                    showErrorMessage('Error sending message. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Network error. Please check your connection.');
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
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

// Success message function
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'successMessage';
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    // Insert before form
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Error message function
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'errorMessage';
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    
    // Insert before form
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide success message
function hideSuccessMessage() {
    const messageDiv = document.getElementById('successMessage');
    if (messageDiv) {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }
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