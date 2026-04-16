// About Page JS

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