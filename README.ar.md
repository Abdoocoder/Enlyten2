<div dir="rtl">

# Enlyten2 Laser Center — تطبيق الويب

[![الإصدار](https://img.shields.io/badge/الإصدار-1.2.0-gold?style=flat-square)](package.json)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Sentry](https://img.shields.io/badge/Sentry-monitoring-362D59?style=flat-square&logo=sentry)](https://sentry.io)
[![i18n](https://img.shields.io/badge/i18n-عربي%20%2F%20إنجليزي-orange?style=flat-square)](src/locales)
[![مباشر](https://img.shields.io/badge/مباشر-enlyten2.vercel.app-black?style=flat-square&logo=vercel)](https://enlyten2.vercel.app)

> **مركز الليزر والعناية بالبشرة الرائد** — تطبيق ويب فاخر ثنائي اللغة (عربي / إنجليزي) لمركز Enlyten2 للليزر. مبني بـ React 19، Vite 8، Vanilla CSS، Supabase، و Sentry.

---

## 📸 نظرة عامة

Enlyten2 Laser Center هو تطبيق ويب متكامل صُمِّم لتقديم تجربة رقمية فاخرة لعيادة عناية بالبشرة راقية. تدعم المنصة **العربية (RTL)** و **الإنجليزية (LTR)** بشكل سلس، مع نظام تصميم "Laser Glow" الفاخر، وقاعدة بيانات Supabase الفورية، ومراقبة الأخطاء عبر Sentry.

**رابط الموقع**: [https://enlyten2.vercel.app](https://enlyten2.vercel.app)

---

## ✨ الميزات

| الميزة | الوصف |
|---|---|
| 🌍 **ثنائي اللغة (عربي / إنجليزي)** | دعم كامل للـ RTL عربي واللـ LTR إنجليزي عبر `react-i18next` |
| 🎨 **نظام التصميم Laser Glow** | نظام تصميم فاخر مستوحى من Apple بألوان الشعار الوردي والبرتقالي والبنفسجي |
| 🔐 **المصادقة** | Supabase Auth — تسجيل الحساب، الدخول، الخروج |
| 📅 **نظام الحجز** | حجز المواعيد بثلاث خطوات لأي خدمة |
| 🖼️ **المعرض** | معرض الصور قبل/بعد من Supabase |
| 👤 **ملف المستخدم** | ملف شخصي قابل للتعديل (الاسم، الهاتف، نبذة) |
| 📊 **لوحة التحكم** | سجل الحجوزات، ملخص KPI، إدارة المواعيد |
| 🔔 **الإشعارات** | مركز الإشعارات الفوري |
| 🛡️ **لوحة الإدارة** | إدارة كاملة للخدمات (إضافة/تعديل/حذف) + تغيير حالة الحجوزات مع بحث وفلترة |
| ⚡ **الأداء** | تقسيم الكود (React.lazy)، تحميل الصور المؤجل، حفظ الحسابات |
| 🐛 **مراقبة الأخطاء** | Sentry — تتبع الأخطاء، تسجيل الجلسات، ErrorBoundary |
| 📱 **تصميم متجاوب** | محسّن بالكامل للجوال والتابلت وسطح المكتب |

---

## 🛠️ التقنيات المستخدمة

- **الواجهة الأمامية**: React 19 + Vite 8
- **التنسيق**: Vanilla CSS مع متغيرات CSS (Design Tokens)
- **التوجيه**: React Router DOM v7
- **الخلفية والمصادقة**: Supabase (PostgreSQL + Auth + RLS)
- **الترجمة**: i18next + react-i18next
- **مراقبة الأخطاء**: Sentry (`@sentry/react`)
- **النشر**: Vercel
- **الخطوط**: Inter (إنجليزي) · Cairo (عربي) عبر Google Fonts

---

## 🚀 البدء السريع

### المتطلبات

- Node.js `v18+`
- npm `v9+`
- مشروع Supabase

### 1. استنساخ المستودع

```bash
git clone https://github.com/Abdoocoder/Enlyten2.git
cd Enlyten2
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في المجلد الجذر:

```env
VITE_SUPABASE_URL=رابط_مشروع_supabase
VITE_SUPABASE_ANON_KEY=مفتاح_supabase_العام
VITE_SENTRY_DSN=رابط_sentry_dsn
```

### 4. تشغيل خادم التطوير

```bash
npm run dev
```

افتح [http://localhost:5173](http://localhost:5173) في المتصفح.

---

## 🌐 مسارات التطبيق

| المسار | الصفحة | يتطلب تسجيل دخول |
|---|---|---|
| `/` | الرئيسية | لا |
| `/services` | العلاجات والخدمات | لا |
| `/gallery` | معرض قبل/بعد | لا |
| `/contact` | تواصل معنا | لا |
| `/experience` | رحلة العميل والبروتوكول | لا |
| `/book` | حجز موعد | لا* |
| `/login` | تسجيل الدخول / إنشاء حساب | لا |
| `/dashboard` | لوحة تحكم العميل | ✅ نعم |
| `/profile` | الملف الشخصي | ✅ نعم |
| `/notifications` | الإشعارات | ✅ نعم |
| `/admin` | لوحة الإدارة | ✅ مشرف فقط |

---

## 🗄️ مخطط قاعدة البيانات

| الجدول | الغرض |
|---|---|
| `profiles` | بيانات الملف الشخصي (الاسم، الهاتف، النبذة، الدور) |
| `services` | كتالوج العلاجات (عربي + إنجليزي) |
| `bookings` | سجلات مواعيد العملاء |
| `gallery` | صور قبل/بعد (عربي + إنجليزي) |
| `notifications` | سجلات الإشعارات |
| `experiences` | تقييمات وتجارب العملاء |

جميع الجداول تستخدم **Row-Level Security (RLS)**.

---

## 📦 الأوامر المتاحة

```bash
npm run dev       # تشغيل خادم التطوير
npm run build     # بناء نسخة الإنتاج
npm run preview   # معاينة نسخة الإنتاج محلياً
```

---

## 🔐 الأمان

- ✅ Row-Level Security مفعّل على جميع جداول Supabase
- ✅ جميع الأسرار في متغيرات البيئة — لا شيء مُضمَّن في الكود
- ✅ إدارة الجلسات عبر JWT من Supabase Auth
- ✅ تحديثات الملف الشخصي محدودة الحقول (لا يمكن تعديل `role`)
- ✅ Sentry مع `sendDefaultPii: false` وإخفاء جميع المدخلات
- ✅ `.env.local` و `.claude/settings.json` مستثناة من git

---

## 📋 سجل التغييرات

### v1.2.0 — 2026-04-20

- لوحة الإدارة: إدارة كاملة للخدمات + تبويبات الحجوزات مع تغيير الحالة
- Sentry: تتبع الأخطاء، تسجيل الجلسات، ErrorBoundary
- الأمان: متغيرات البيئة لجميع الأسرار، تعطيل PII، تقييد حقول الملف الشخصي
- الأداء: تقسيم الكود بـ React.lazy()، تحميل الصور المؤجل
- SEO: Open Graph، Twitter Card، وسوم meta
- إصلاحات: تسجيل الخروج، مبدّل اللغة، race condition في المصادقة

### v1.0.0 — 2026-04-13

- الإصدار الأولي للإنتاج
- دعم ثنائي اللغة (عربي + إنجليزي) مع RTL/LTR كامل
- تكامل Supabase للمصادقة وقاعدة البيانات
- تنفيذ جميع الصفحات الـ 11
- نظام التصميم Luminous Canvas

---

## 📄 الترخيص

هذا المشروع **ملكية خاصة** لـ **مركز Enlyten2 للليزر**. جميع الحقوق محفوظة.

---

*مبني لمركز Enlyten2 للليزر — عِش تجربة فن التألق.*

</div>
