# Enlyten2 Laser Center — Web Application

[![Version](https://img.shields.io/badge/version-1.0.0-gold?style=flat-square)](package.json)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![i18n](https://img.shields.io/badge/i18n-AR%20%2F%20EN-orange?style=flat-square)](src/locales)

> **Premier Laser & Skincare Clinic** — A luxury bilingual (Arabic / English) web application for Enlyten2 Laser Center. Built with React, Vite, Vanilla CSS, and Supabase.

---

## 📸 Overview

Enlyten2 Laser Center is a full-stack web application designed to deliver a premium digital experience for a high-end skincare clinic. The platform supports both **Arabic (RTL)** and **English (LTR)** seamlessly, with a luxury "Luminous Canvas" design system and a real-time Supabase backend.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Bilingual (AR / EN)** | Full RTL Arabic & LTR English support via `react-i18next` |
| 🎨 **Luminous Canvas Design** | Premium design system with gold, ivory, and blush palette |
| 🔐 **Authentication** | Supabase Auth — Sign up, Sign in, Sign out |
| 📅 **Booking System** | Clients can book appointments for any service |
| 🖼️ **Gallery** | Before/After gallery fetched from Supabase |
| 👤 **User Profile** | Editable user profile with avatar support |
| 📊 **Dashboard** | Client booking history and appointment management |
| 🔔 **Notifications** | Real-time notification center |
| 🛡️ **Admin Panel** | Service and booking management for clinic staff |
| 📱 **Responsive Design** | Fully optimized for mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Vanilla CSS with CSS Custom Properties (Design Tokens)
- **Routing**: React Router DOM v7
- **Backend & Auth**: Supabase (PostgreSQL + Auth + RLS)
- **i18n**: i18next + react-i18next
- **Fonts**: Manrope, Noto Serif (EN) · Cairo (AR) via Google Fonts

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`
- A Supabase project (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

### 1. Clone the repository

```bash
git clone https://github.com/your-org/enlyten2-laser-center.git
cd enlyten2-laser-center
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for full Supabase configuration.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
enlyten2-laser-center/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images and static media
│   ├── components/
│   │   ├── Layout/             # Header, Footer, Navigation
│   │   └── UI/                 # Button, Card, Input, LanguageSwitcher
│   ├── contexts/
│   │   └── AuthContext.jsx     # Global authentication state
│   ├── data/
│   │   └── mockData.json       # Fallback / seed data
│   ├── hooks/
│   │   └── useDatabase.js      # Custom Supabase query hooks
│   ├── lib/
│   │   └── supabase.js         # Supabase client + utility functions
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── ar.json             # Arabic translations
│   ├── pages/                  # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Booking.jsx
│   │   ├── Gallery.jsx
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Notifications.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   └── Admin.jsx
│   ├── styles/
│   │   ├── variables.css       # Design tokens (colors, fonts, spacing)
│   │   └── global.css          # Global resets and RTL overrides
│   ├── App.jsx                 # Application root & routing
│   ├── i18n.js                 # i18next configuration
│   └── main.jsx                # React entry point
├── .env.local                  # Environment variables (not committed)
├── .gitignore
├── SUPABASE_SETUP.md           # Full Supabase backend documentation
├── CLAUDE.md                   # AI assistant guidelines
├── README.md                   # This file
├── README.ar.md                # Arabic README
├── package.json
└── vite.config.js
```

---

## 🌐 Application Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home / Landing | No |
| `/services` | Treatments & Services | No |
| `/gallery` | Before/After Gallery | No |
| `/contact` | Contact Us | No |
| `/book` | Book an Appointment | No* |
| `/login` | Sign In / Sign Up | No |
| `/dashboard` | Client Dashboard | ✅ Yes |
| `/profile` | User Profile | ✅ Yes |
| `/notifications` | Notifications | ✅ Yes |
| `/experience` | Reviews & Testimonials | No |
| `/admin` | Admin Panel | ✅ Admin |

---

## 🌍 Internationalization (i18n)

The application supports full bilingual operation:

- **English (LTR)**: Default language — Manrope / Noto Serif fonts
- **Arabic (RTL)**: Full layout mirroring — Cairo font

Language preference is **persisted in `localStorage`**. The language switcher is available in the header on every page.

To add a new language:
1. Create `src/locales/{lang}.json`
2. Register it in `src/i18n.js`

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profile data |
| `services` | Clinic treatment catalogue |
| `bookings` | Client appointment records |
| `gallery` | Before/after media |
| `notifications` | User notification records |
| `experiences` | Client reviews & testimonials |

> See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for full schema and setup instructions.

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
```

---

## 🔐 Security

- ✅ Row-Level Security (RLS) enabled on all Supabase tables
- ✅ Environment variables kept out of source control
- ✅ JWT-based session management via Supabase Auth
- ✅ User data isolation enforced at the database level

---

## 📋 Changelog

### v1.0.0 — 2026-04-13
- 🎉 Initial production release
- 🌍 Bilingual (Arabic + English) support with RTL layout
- 🎨 Luminous Canvas design system
- 🔐 Supabase authentication integration
- 📅 Booking system (client-facing)
- 🖼️ Gallery, Profile, Dashboard, Notifications pages
- 🛡️ Admin panel for clinic management

---

## 📄 License

This project is **proprietary** and owned by **Enlyten2 Laser Center**. All rights reserved.

---

*Built with ❤️ for Enlyten2 Laser Center — Experience the Art of Radiance.*
