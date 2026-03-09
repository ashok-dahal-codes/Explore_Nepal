// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');
    });
}

// Navbar scroll effect
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

// Hamburger menu
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        if (navLinks) navLinks.classList.toggle('active');
        if (navActions) navActions.classList.toggle('active');
    });
}

// Hero search → redirect to explore page with query
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