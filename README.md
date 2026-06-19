# SachMaroc

متجر مغربي أونلاين production-ready — Next.js 15 + SQLite + TypeScript + Tailwind CSS

## المميزات

- واجهة بالدارجة المغربية (RTL)
- قاعدة بيانات **SQLite** مع Drizzle ORM
- لوحة إدارة كاملة (`/admin`)
- رفع صور المنتجات
- إدارة الفئات، المخزون، المنتجات المميزة
- إدارة الطلبات مع تتبع الحالة
- بحث وفلترة المنتجات
- الدفع عند الاستلام + واتساب
- **Dark mode**
- SEO (sitemap, robots, Open Graph)

## التشغيل

```bash
npm install
cp .env.example .env.local
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

قاعدة البيانات كتتنشأ تلقائياً فـ `data/sachmaroc.db` مع بيانات أولية.

## الإعداد (`.env.local`)

```env
AUTH_SECRET=your-random-secret-key
ADMIN_PASSWORD=sachmaroc2026
DATABASE_PATH=./data/sachmaroc.db
NEXT_PUBLIC_WHATSAPP_NUMBER=212607674922
NEXT_PUBLIC_SITE_URL=https://sachmaroc.ma
```

## الإدارة

| الرابط | الوصف |
|--------|--------|
| `/admin/login` | تسجيل الدخول |
| `/admin` | إحصائيات |
| `/admin/products` | المنتجات + رفع صور |
| `/admin/categories` | الفئات |
| `/admin/orders` | الطلبات |

- **المستخدم:** `admin`
- **كلمة السر:** من `ADMIN_PASSWORD` (افتراضي: `sachmaroc2026`)

## الصفحات

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | `/` |
| المنتجات (بحث + فلترة) | `/products` |
| السلة | `/cart` |
| إتمام الطلب | `/checkout` |
| تتبع الطلبات | `/orders` |
| من نحن | `/about` |
| اتصل بنا | `/contact` |
| أسئلة شائعة | `/faq` |

## قاعدة البيانات

```bash
npm run db:seed    # إعادة البيانات الأولية
npm run db:migrate # تطبيق migrations
```

## الإنتاج

```bash
npm run build
npm start
```

**ملاحظة:** SQLite مع `better-sqlite3` يحتاج بيئة Node.js (ماشي مناسب لـ Vercel serverless). للنشر استعمل VPS، Railway، Docker، أو Render.

## الأمان

- JWT sessions (httpOnly cookies)
- bcrypt لكلمات السر
- Middleware لحماية `/admin` و API الإدارة
- رفع الصور محدود (5MB، أنواع مسموحة فقط)
