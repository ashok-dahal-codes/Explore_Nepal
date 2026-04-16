// Explore Page JS

// Cache DOM elements
const cards = document.querySelectorAll('.explore-card');
const tags = document.querySelectorAll('.tag');
const navSearch = document.getElementById('navSearch');
const resultCount = document.getElementById('resultCount');

// Build search index once for performance
const cardIndex = [...cards].map(card => ({
    el: card,
    category: card.dataset.category,
    title: card.querySelector('.card-title-row h3').textContent.toLowerCase(),
    location: card.querySelector('.card-location span').textContent.toLowerCase(),
    badge: (card.querySelector('.card-badge')?.textContent || '').toLowerCase()
}));

// State
let activeCategory = 'all';
let searchQuery = '';

// Category tag toggle (single-select with "All" option)
tags.forEach(tag => {
    tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        activeCategory = tag.dataset.category;
        applyFilters();
    });
});

// Debounced search
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

if (navSearch) {
    navSearch.addEventListener('input', debounce(() => {
        searchQuery = navSearch.value.toLowerCase().trim();
        applyFilters();
    }, 200));
}

// Combined filter + search
function applyFilters() {
    let visibleCount = 0;

    cardIndex.forEach(({ el, category, title, location, badge }) => {
        const categoryMatch = activeCategory === 'all' || category === activeCategory;
        const searchMatch = !searchQuery ||
            title.includes(searchQuery) ||
            location.includes(searchQuery) ||
            badge.includes(searchQuery);

        if (categoryMatch && searchMatch) {
            el.style.display = '';
            visibleCount++;
        } else {
            el.style.display = 'none';
        }
    });

    if (resultCount) {
        resultCount.textContent = `Showing ${visibleCount} destination${visibleCount !== 1 ? 's' : ''}`;
    }
}

// Read search query from URL if redirected from home page
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get('search') || '';
if (initialSearch && navSearch) {
    navSearch.value = initialSearch;
    searchQuery = initialSearch.toLowerCase();
}

// Run initial filter
applyFilters();

// Pagination
const pageButtons = document.querySelectorAll('.page-btn[data-page]');
pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        pageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const page = parseInt(btn.dataset.page);
        document.getElementById('prevPage').disabled = page === 1;
        document.getElementById('nextPage').disabled = page === 3;
    });
});

const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');

if (prevPage) {
    prevPage.addEventListener('click', () => {
        const active = document.querySelector('.page-btn.active[data-page]');
        const page = parseInt(active.dataset.page);
        if (page > 1) {
            document.querySelector(`.page-btn[data-page="${page - 1}"]`)?.click();
        }
    });
}

if (nextPage) {
    nextPage.addEventListener('click', () => {
        const active = document.querySelector('.page-btn.active[data-page]');
        const page = parseInt(active.dataset.page);
        if (page < 3) {
            document.querySelector(`.page-btn[data-page="${page + 1}"]`)?.click();
        }
    });
}

// Mobile filter sidebar toggle
const filterToggle = document.getElementById('filterToggle');
const filterSidebar = document.getElementById('filterSidebar');

if (filterToggle && filterSidebar) {
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    document.body.appendChild(overlay);

    filterToggle.addEventListener('click', () => {
        filterSidebar.classList.add('open');
        overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
        filterSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

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