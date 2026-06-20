# SachMaroc — متجر مغربي أونلاين

## إدارة المتجر

**كل المنتجات كتتحكم من ملف واحد:**

```
data/products.json
```

عدّل الأسماء، الأثمنة، الصور، الوصف، الفئات — والموقع كيتحدّث تلقائياً.

راجع `data/README.md` للشرح الكامل.

## التشغيل

```bash
npm install
cp .env.example .env.local
npm run dev
```

## الإعداد

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=212607674922
NEXT_PUBLIC_SITE_URL=https://sachmaroc.ma
```

## الصفحات

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | `/` |
| المنتجات | `/products` |
| تفاصيل منتج | `/products/[id]` |
| السلة | `/cart` |
| إتمام الطلب | `/checkout` |

## الإنتاج

```bash
npm run build
npm start
```
