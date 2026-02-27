#  Explore Nepal

> A smart travel planning web platform for tourists visiting Nepal — Plan smarter. Travel better.

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-In%20Development-orange)
![Backend](https://img.shields.io/badge/backend-Django%20%2B%20DRF-blue)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%2B%20Bootstrap%20%2B%20JS-yellow)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)

---

##  Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Team](#team)
- [Milestones](#milestones)
- [License](#license)

---

## 📖 About the Project

**Explore Nepal** is a full-stack web platform designed to help tourists plan their trips to Nepal efficiently. It provides destination discovery, budget planning, guide booking, and solo travel partner matching — all in one place.

Whether you're a first-time visitor or a seasoned traveler, Explore Nepal helps you:
-  Discover the best places to visit in Nepal
-  Plan your trip budget before you travel
-  Find and connect with verified local guides
-  Find safe travel partners for solo trips
-  Chat in real-time with guides and travel partners

---

##  Features

| Feature | Description |
|---|---|
|  User Authentication | Register/Login as Tourist or Guide with JWT |
|  Place Discovery | Browse and filter places by budget, category, region |
|  Interactive Map | View places on an interactive Leaflet.js map |
|  Expense Calculator | Estimate trip costs by destination, days, people & style |
|  Guide Directory | Find and contact verified local guides |
|  Partner Matching | Safely match with travel partners for solo trips |
|  Real-time Chat | Chat with guides and partners via WebSocket |
|  Admin Dashboard | Manage users, guides, reports and content |

---

##  Tech Stack

### Frontend
- **HTML5** + **CSS3**
- **Bootstrap 5** — Responsive UI framework
- **JavaScript** (React.js where required)
- **Leaflet.js** — Interactive maps

### Backend
- **Django** — Python web framework
- **Django REST Framework (DRF)** — REST API
- **Django Channels** — WebSocket / Real-time chat
- **JWT Authentication** — via `djangorestframework-simplejwt`

### Database
- **PostgreSQL** — Primary relational database

### Tools & Services
- **Cloudinary** — Image storage
- **Git + GitHub** — Version control
- **pgAdmin 4** — Database management
- **Figma** — UI/UX Design

---

##  Project Structure

```
Explore_Nepal/
│
├── frontend/                        ← HTML + CSS + JS Frontend
│   ├── assets/                      ← Images, icons, fonts
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── map.js
│   ├── pages/
│   │   ├── explore.html
│   │   ├── place-detail.html
│   │   ├── expense-calculator.html
│   │   ├── guides.html
│   │   ├── partner-match.html
│   │   ├── chat.html
│   │   ├── login.html
│   │   └── register.html
│   └── index.html
│
├── backend/                         ← Django Backend
│   ├── manage.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/
│   │   ├── places/
│   │   ├── guides/
│   │   ├── partners/
│   │   ├── expenses/
│   │   └── chat/
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

##  Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL 18
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ashok-dahal-codes/Explore_Nepal.git
cd Explore_Nepal
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside `backend/`:

```
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=explore_nepal_db
DB_USER=explore_user
DB_PASSWORD=nepal123
DB_HOST=localhost
DB_PORT=5432
```

### 4. Run Migrations & Start Server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### 5. Open Frontend

Open `frontend/index.html` in your browser or use VS Code Live Server.

---

##  Team

| Name | GitHub | Role |
|---|---|---|
| Ashok Dahal | [@ashok-dahal-codes](https://github.com/ashok-dahal-codes) | Project Lead + Full Stack |
| Basu | [@Basu-TheAsterisk](https://github.com/Basu-TheAsterisk) | Frontend Developer |
| Bigyan Basnyat | [@bigyansb](https://github.com/bigyansb) | Backend Developer |

---

##  Milestones

| Week | Goals | Due Date |
|---|---|---|
| Week 1 | Setup & Design | March 1, 2026 |
| Week 2 | Auth System | March 8, 2026 |
| Week 3 | Places & Map | March 15, 2026 |
| Week 4 | Expense & Hotels | March 22, 2026 |
| Week 5 | Guides System | March 29, 2026 |
| Week 6 | Partner Matching | April 5, 2026 |
| Week 7 | Chat & Admin | April 12, 2026 |
| Week 8 | Testing & Deploy | April 20, 2026 |

---

##  Branch Strategy

```
main                → stable, production-ready code
└── dev             → main development branch
    ├── feat/frontend-ui     → Frontend (HTML/CSS/JS)
    ├── feat/backend-api     → Backend (Django/DRF)
    └── feat/partner-chat    → Partner Matching + Chat
```

---

##  License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for Nepal 🏔️</p>
