<div dir="rtl">

# Enlyten2 Laser Center — تطبيق الويب

[![الإصدار](https://img.shields.io/badge/الإصدار-1.0.0-gold?style=flat-square)](package.json)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![i18n](https://img.shields.io/badge/i18n-عربي%20%2F%20إنجليزي-orange?style=flat-square)](src/locales)

> **مركز الليزر والعناية بالبشرة الرائد** — تطبيق ويب فاخر ثنائي اللغة (عربي / إنجليزي) لمركز Enlyten2 للليزر. مبني بـ React و Vite و Vanilla CSS و Supabase.

---

## 📸 نظرة عامة

Enlyten2 Laser Center هو تطبيق ويب متكامل صُمِّم لتقديم تجربة رقمية فاخرة لعيادة عناية بالبشرة راقية. تدعم المنصة **العربية (RTL)** و **الإنجليزية (LTR)** بشكل سلس، مع نظام تصميم "Luminous Canvas" الفاخر وقاعدة بيانات Supabase الفورية.

---

## ✨ الميزات

| الميزة | الوصف |
|---|---|
| 🌍 **ثنائي اللغة (عربي / إنجليزي)** | دعم كامل للـ RTL عربي واللـ LTR إنجليزي عبر `react-i18next` |
| 🎨 **نظام التصميم Luminous Canvas** | نظام تصميم فاخر بلوحة ألوان ذهبية, عاجية ووردية |
| 🔐 **المصادقة** | Supabase Auth — تسجيل الحساب، الدخول، الخروج |
| 📅 **نظام الحجز** | يمكن للعملاء حجز مواعيد لأي خدمة |
| 🖼️ **المعرض** | معرض الصور قبل/بعد من Supabase |
| 👤 **ملف المستخدم** | ملف شخصي قابل للتعديل مع دعم الصورة الشخصية |
| 📊 **لوحة التحكم** | سجل حجوزات العميل وإدارة المواعيد |
| 🔔 **الإشعارات** | مركز إشعارات فوري |
| 🛡️ **لوحة الإدارة** | إدارة الخدمات والحجوزات لموظفي العيادة |
| 📱 **تصميم متجاوب** | محسَّن بالكامل للجوال والتابلت وسطح المكتب |

---

## 🛠️ التقنيات المستخدمة

- **الواجهة الأمامية**: React 19 + Vite 8
- **التنسيق**: Vanilla CSS مع CSS Custom Properties (رموز التصميم)
- **التوجيه**: React Router DOM v7
- **الخلفية والمصادقة**: Supabase (PostgreSQL + Auth + RLS)
- **الترجمة**: i18next + react-i18next
- **الخطوط**: Manrope, Noto Serif (إنجليزي) · Cairo (عربي) عبر Google Fonts

---

## 🚀 البدء السريع

### المتطلبات

- Node.js `v18+`
- npm `v9+`
- مشروع Supabase (راجع [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

### 1. نسخ المستودع

```bash
git clone https://github.com/your-org/enlyten2-laser-center.git
cd enlyten2-laser-center
```

### 2. تثبيت الاعتمادات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في المجلد الجذر:

```env
VITE_SUPABASE_URL=رابط_مشروع_supabase
VITE_SUPABASE_ANON_KEY=مفتاح_supabase_العام
```

> راجع [SUPABASE_SETUP.md](SUPABASE_SETUP.md) للإعداد الكامل لـ Supabase.

### 4. تشغيل خادم التطوير

```bash
npm run dev
```

افتح [http://localhost:5173](http://localhost:5173) في متصفحك.

---

## 📁 هيكل المشروع

```
enlyten2-laser-center/
├── public/                     # الأصول الثابتة
├── src/
│   ├── assets/                 # الصور والوسائط الثابتة
│   ├── components/
│   │   ├── Layout/             # الهيدر، الفوتر، التنقل
│   │   └── UI/                 # Button, Card, Input, LanguageSwitcher
│   ├── contexts/
│   │   └── AuthContext.jsx     # حالة المصادقة العالمية
│   ├── data/
│   │   └── mockData.json       # بيانات احتياطية / بذرة
│   ├── hooks/
│   │   └── useDatabase.js      # Supabase query hooks مخصصة
│   ├── lib/
│   │   └── supabase.js         # عميل Supabase + وظائف مساعدة
│   ├── locales/
│   │   ├── en.json             # الترجمات الإنجليزية
│   │   └── ar.json             # الترجمات العربية
│   ├── pages/                  # مكونات الصفحات على مستوى المسار
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
│   │   ├── variables.css       # رموز التصميم (ألوان، خطوط، مسافات)
│   │   └── global.css          # إعادة الضبط العالمية وتجاوزات RTL
│   ├── App.jsx                 # جذر التطبيق والتوجيه
│   ├── i18n.js                 # إعداد i18next
│   └── main.jsx                # نقطة دخول React
├── .env.local                  # متغيرات البيئة (لا تُرفع للـ Git)
├── .gitignore
├── SUPABASE_SETUP.md           # توثيق كامل لخلفية Supabase
├── CLAUDE.md                   # إرشادات المساعد الذكي
├── README.md                   # ملف التوثيق الإنجليزي
├── README.ar.md                # هذا الملف
├── package.json
└── vite.config.js
```

---

## 🌐 مسارات التطبيق

| المسار | الصفحة | مصادقة مطلوبة |
|---|---|---|
| `/` | الرئيسية / الصفحة التسويقية | لا |
| `/services` | العلاجات والخدمات | لا |
| `/gallery` | معرض قبل/بعد | لا |
| `/contact` | اتصل بنا | لا |
| `/book` | حجز موعد | لا* |
| `/login` | تسجيل الدخول / إنشاء حساب | لا |
| `/dashboard` | لوحة تحكم العميل | ✅ نعم |
| `/profile` | ملف المستخدم | ✅ نعم |
| `/notifications` | الإشعارات | ✅ نعم |
| `/experience` | التقييمات والشهادات | لا |
| `/admin` | لوحة الإدارة | ✅ مدير |

---

## 🌍 التدويل (i18n)

يدعم التطبيق العمل الكامل بلغتين:

- **الإنجليزية (LTR)**: اللغة الافتراضية — خطوط Manrope / Noto Serif
- **العربية (RTL)**: انعكاس كامل للتخطيط — خط Cairo

يتم **حفظ تفضيل اللغة في `localStorage`**. يتوفر مبدّل اللغة في الهيدر على كل صفحة.

لإضافة لغة جديدة:
1. أنشئ `src/locales/{lang}.json`
2. سجّلها في `src/i18n.js`

---

## 🗄️ مخطط قاعدة البيانات

| الجدول | الغرض |
|---|---|
| `profiles` | بيانات ملف المستخدم |
| `services` | كتالوج علاجات العيادة |
| `bookings` | سجلات مواعيد العملاء |
| `gallery` | وسائط قبل/بعد |
| `notifications` | سجلات إشعارات المستخدم |
| `experiences` | تقييمات ومراجعات العملاء |

> راجع [SUPABASE_SETUP.md](SUPABASE_SETUP.md) للمخطط الكامل وتعليمات الإعداد.

---

## 📦 الأوامر المتاحة

```bash
npm run dev       # تشغيل خادم التطوير
npm run build     # بناء نسخة الإنتاج
npm run preview   # معاينة نسخة الإنتاج محلياً
```

---

## 🔐 الأمان

- ✅ تفعيل أمان مستوى الصف (RLS) على جميع جداول Supabase
- ✅ متغيرات البيئة محفوظة خارج التحكم في المصدر
- ✅ إدارة الجلسات المبنية على JWT عبر Supabase Auth
- ✅ عزل بيانات المستخدم مفروض على مستوى قاعدة البيانات

---

## 📋 سجل التغييرات

### v1.0.0 — 2026-04-13
- 🎉 الإصدار الأولي للإنتاج
- 🌍 دعم ثنائي اللغة (العربية + الإنجليزية) مع تخطيط RTL
- 🎨 نظام التصميم Luminous Canvas
- 🔐 دمج مصادقة Supabase
- 📅 نظام الحجز (يواجه العميل)
- 🖼️ صفحات المعرض والملف الشخصي ولوحة التحكم والإشعارات
- 🛡️ لوحة الإدارة لإدارة العيادة

---

## 📄 الترخيص

هذا المشروع **ملكية خاصة** لـ **Enlyten2 Laser Center**. جميع الحقوق محفوظة.

---

*مبني بـ ❤️ لمركز Enlyten2 للليزر — تجربة فن الإشراق.*

</div>
