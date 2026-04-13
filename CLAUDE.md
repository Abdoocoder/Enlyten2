# CLAUDE.md — Enlyten2 Laser Center

> This file provides complete context for AI assistants (Claude, Gemini, etc.) working on this codebase.
> Read this entire file before making any changes.

---

## 🏢 Project Overview

**Enlyten2 Laser Center** is a luxury bilingual (Arabic + English) web application for a premium laser and skincare clinic. The goal is to deliver a world-class digital experience that matches the clinic's high-end brand identity.

- **Version**: 1.0.0
- **Stack**: React 19 · Vite 8 · Vanilla CSS · Supabase · react-i18next
- **Design System**: "Luminous Canvas" — gold, ivory, blush palette
- **Languages**: Arabic (RTL, default for Arab clients) + English (LTR)
- **Supabase Project**: `enlyten2lasercenter` (org: `samasoftcode`, region: ap-southeast-1)

---

## 🧭 Architecture & File Map

```
src/
├── App.jsx                    # Root: BrowserRouter + AuthProvider + Layout + Routes
├── main.jsx                   # Entry: mounts React, imports i18n
├── i18n.js                    # i18next init: lng from localStorage, sets html[dir]
│
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx         # Shell: Header (Logo, Nav, LangSwitcher, UserMenu) + Footer
│   │   └── Layout.css
│   └── UI/
│       ├── Button/            # variants: 'primary' | 'secondary' | 'ghost'
│       ├── Card/              # variants: 'default' | 'white' | 'tonal'
│       ├── Input/             # standard form input with label + error state
│       └── LanguageSwitcher/  # pill button — toggles EN↔AR, writes to localStorage
│
├── contexts/
│   └── AuthContext.jsx        # useAuth() → { user, profile, isAuthenticated, loading }
│
├── hooks/
│   └── useDatabase.js         # useServices(), useUserBookings(id), useGallery(),
│                              # useExperiences(), useNotifications(id)
│
├── lib/
│   └── supabase.js            # createClient() singleton + all DB utility functions
│
├── locales/
│   ├── en.json                # English translations (keys: nav.*, home.*, footer.*)
│   └── ar.json                # Arabic translations (same key structure)
│
├── data/
│   └── mockData.json          # Fallback data (company, treatments, gallery, clinics)
│
├── pages/
│   ├── Home.jsx / .css        # Landing page — Hero, Philosophy, Treatments preview
│   ├── Services.jsx / .css    # Full treatment listing from Supabase
│   ├── Booking.jsx / .css     # Appointment booking form + Supabase insert
│   ├── Gallery.jsx / .css     # Before/After gallery from Supabase
│   ├── Auth.jsx / .css        # Sign in / Sign up (tabs)
│   ├── Dashboard.jsx / .css   # User booking history + status management
│   ├── Profile.jsx / .css     # Editable user profile (name, phone, bio, avatar)
│   ├── Notifications.jsx/.css # Notification center — mark as read
│   ├── Contact.jsx / .css     # Contact info, map placeholder, form
│   ├── Experience.jsx / .css  # Client reviews and testimonials
│   └── Admin.jsx / .css       # Admin panel — manage services & bookings
│
└── styles/
    ├── variables.css          # ALL design tokens (colors, fonts, spacing, radii)
    └── global.css             # Resets, body, RTL overrides, typography utilities
```

---

## 🎨 Design System — Luminous Canvas

### Color Tokens (`src/styles/variables.css`)

```css
--primary: #735c00;                    /* Dark gold — primary actions */
--primary-container: #d4af37;          /* Signature gold — accents, highlights */
--on-primary-container: #241a00;
--secondary-container: #f2dde1;        /* Soft blush / skin tone */
--on-secondary-container: #706064;
--background: #faf9f6;                 /* Warm ivory — page background */
--surface: #faf9f6;
--surface-container-low: #f4f3f1;
--surface-container-lowest: #ffffff;
--surface-container-highest: #e3e2e0;
--on-surface: #1a1c1a;                 /* Near-black text */
--on-surface-variant: #4d4635;
--outline: #7f7663;
--outline-variant: #d0c5af;
```

### Typography

| Context | Font | Variable |
|---|---|---|
| Display headings (EN) | Noto Serif | `--font-display` |
| Body text (EN) | Manrope | `--font-body` |
| All text (AR) | Cairo | `--font-display` / `--font-body` override |

**RTL override** in `global.css`:
```css
:root[dir="rtl"] {
  --font-display: var(--font-display-ar);
  --font-body: var(--font-body-ar);
}
```

### Typography Utility Classes

```css
.display-large     /* Hero headings */
.headline-medium   /* Section titles */
.headline-small    /* Card titles */
.body-large        /* Primary body copy */
.body-medium       /* Secondary body copy */
.label-medium      /* Eyebrow labels / tags */
```

### Spacing Scale

```css
--spacing-xs: 4px  --spacing-sm: 8px  --spacing-md: 16px
--spacing-lg: 24px  --spacing-xl: 32px  --spacing-xxl: 48px  --spacing-huge: 64px
```

### Border Radius

```css
--radius-sm: 4px  --radius-md: 8px  --radius-lg: 12px
--radius-xl: 24px  --radius-full: 9999px
```

---

## 🔐 Authentication

**Context**: `src/contexts/AuthContext.jsx`

```js
import { useAuth } from './contexts/AuthContext';
const { user, profile, isAuthenticated, loading } = useAuth();
```

**Supabase functions** (`src/lib/supabase.js`):
```js
signUp(email, password, fullName)
signIn(email, password)
signOut()
getCurrentUser()
getProfile(userId)
updateProfile(userId, updates)
getBookings(userId)
createBooking(bookingData)
updateBooking(bookingId, updates)
cancelBooking(bookingId)
```

**Protected routes**: `/dashboard`, `/profile`, `/notifications`, `/admin`
Redirect unauthenticated users to `/login`.

---

## 🌍 Internationalization (i18n)

**Setup**: `src/i18n.js` — uses `react-i18next`

### Rules

1. **Never hardcode UI strings** in JSX. Always use `t('key')`.
2. **Every page** must import `useTranslation` and use the `t` function.
3. **Both locale files must stay in sync** (`en.json` and `ar.json` must have identical key structures).
4. The `html` element `dir` attribute is set automatically by `i18n.js` on language change.

### Usage pattern

```jsx
import { useTranslation } from 'react-i18next';

const MyPage = () => {
  const { t } = useTranslation();
  return <h1>{t('page.title')}</h1>;
};
```

### Key Namespaces (flat, no namespacing)

```
nav.*           → Header navigation links, buttons, user menu
home.*          → Home page: hero, philosophy, treatments sections
footer.*        → Footer tagline, social label, copyright
services.*      → Services page
booking.*       → Booking form labels and messages
auth.*          → Sign in / sign up forms
dashboard.*     → Dashboard page
profile.*       → Profile page
notifications.* → Notifications page
contact.*       → Contact page
gallery.*       → Gallery page
```

---

## 🗄️ Database (Supabase)

**Project URL**: `https://duxppbunumxjxtatpvyu.supabase.co`

### Tables

| Table | Key Columns |
|---|---|
| `profiles` | `id`, `full_name`, `email`, `phone`, `avatar_url`, `bio` |
| `services` | `id`, `name`, `description`, `price`, `duration_minutes`, `category`, `is_active` |
| `bookings` | `id`, `user_id`, `service_id`, `booking_date`, `booking_time`, `status`, `notes` |
| `gallery` | `id`, `title`, `description`, `image_url`, `category`, `order_index` |
| `notifications` | `id`, `user_id`, `title`, `message`, `type`, `is_read` |
| `experiences` | `id`, `user_id`, `booking_id`, `rating`, `comment`, `image_url` |

### Custom Hooks

```js
import { useServices, useUserBookings, useGallery, useExperiences, useNotifications } from '../hooks/useDatabase';
```

Each hook returns `{ data, loading, error }`.

### RLS Policy — Important

All tables have **Row-Level Security enabled**. Users can only read/write their own rows. Always ensure the user is authenticated before database writes.

### Booking `status` field values
`pending` → `confirmed` → `completed` | `cancelled`

---

## 🚦 Routing

```
/               Home
/services       Treatments catalogue
/book           Booking form
/gallery        Before/After gallery
/login          Auth (sign in / sign up tabs)
/dashboard      Client dashboard (auth required)
/profile        User profile editor (auth required)
/notifications  Notification center (auth required)
/contact        Contact information
/experience     Client reviews
/admin          Admin panel (admin role required)
```

All routes are wrapped in `<Layout>` which includes the persistent Header and Footer.

---

## 🖊️ Coding Conventions

### General

- Use **functional components** exclusively (no class components).
- Use **hooks** for all state and side effects.
- Component files use **PascalCase**: `MyComponent.jsx`
- CSS files match component: `MyComponent.css`
- Utility functions live in `src/lib/` or `src/hooks/`.

### CSS

- **Always use design tokens** (`var(--spacing-md)`) — never hardcode pixel values directly in component CSS.
- **Never use Tailwind** or CSS-in-JS. This project uses **Vanilla CSS only**.
- For RTL support, prefer **logical CSS properties** where possible:
  - `margin-inline-start` instead of `margin-left`
  - `padding-inline-end` instead of `padding-right`
- Global utility classes (typography, bg-tonal, section-container, etc.) are defined in `global.css`.

### Imports

Preferred import order:
```js
// 1. React
import React, { useState, useEffect } from 'react';
// 2. Third-party
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// 3. Internal — contexts/hooks/lib
import { useAuth } from '../contexts/AuthContext';
// 4. Internal — components
import Button from '../components/UI/Button/Button';
// 5. CSS
import './MyPage.css';
```

### State Management

- Local state: `useState`
- Server state / async: custom hooks in `useDatabase.js`
- Global auth state: `AuthContext`
- No Redux or Zustand — keep it simple.

---

## 🧪 Testing & Validation

There is currently **no automated test suite**. Before shipping changes:

1. Run `npm run build` — must complete with **zero errors**.
2. Run `npm run dev` and manually verify:
   - [ ] English (LTR) layout renders correctly
   - [ ] Arabic (RTL) layout renders correctly after switching
   - [ ] Language preference persists after page reload
   - [ ] Auth flow (sign up → sign in → logout) works end to end
   - [ ] Booking form submits without errors (with authenticated user)
   - [ ] No console errors or warnings

---

## ⚠️ Critical Rules — Read Before Editing

1. **NEVER commit `.env.local`** — it contains Supabase credentials.
2. **NEVER hardcode UI text** in JSX — all strings go through `t('key')`.
3. **NEVER use Tailwind, Bootstrap, or MUI** — this project is Vanilla CSS only.
4. **NEVER break the RTL layout** — test in Arabic after any Layout or CSS change.
5. **NEVER remove `supabase.js` RLS logic** — it is the security boundary.
6. **ALL new pages** must follow the pattern: `PageName.jsx` + `PageName.css`, added to `App.jsx` routes.
7. **ALL new i18n keys** must be added to BOTH `en.json` and `ar.json`.
8. **Design tokens only** — do not add raw color hex values or pixel values directly in component CSS.

---

## 🔄 Adding a New Page — Checklist

```
[ ] Create src/pages/NewPage.jsx
[ ] Create src/pages/NewPage.css
[ ] Import and use useTranslation() from react-i18next
[ ] Import NewPage.css in NewPage.jsx
[ ] Add route in src/App.jsx
[ ] Add translation keys in src/locales/en.json AND src/locales/ar.json
[ ] Test in both English (LTR) and Arabic (RTL)
[ ] Run npm run build — no errors
```

---

## 🔄 Adding a New Translation Key — Checklist

```
[ ] Add key in src/locales/en.json
[ ] Add matching key in src/locales/ar.json (same dot-path, Arabic value)
[ ] Use t('your.key') in the component
[ ] Verify no missing key warnings in dev console
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.5 | UI framework |
| `react-dom` | ^19.2.5 | DOM renderer |
| `react-router-dom` | ^7.14.0 | Client-side routing |
| `@supabase/supabase-js` | ^2.103.0 | Backend database & auth |
| `i18next` | ^26.0.4 | i18n core engine |
| `react-i18next` | ^17.0.2 | React bindings for i18next |
| `vite` | ^8.0.4 | Build tool & dev server |
| `@vitejs/plugin-react-swc` | ^4.3.0 | React fast-refresh via SWC |

---

## 🗓️ Changelog

### v1.0.0 — 2026-04-13
- Initial production release
- Bilingual (AR + EN) full RTL/LTR support
- Supabase auth + database integration
- All 11 pages implemented
- Luminous Canvas design system
- Professional documentation (README.md, README.ar.md, CLAUDE.md)

---

*Last updated: 2026-04-13 | Version: 1.0.0*
