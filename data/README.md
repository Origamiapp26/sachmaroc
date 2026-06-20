# 📦 SachMaroc — دليل تعديل المنتجات

## الملف الرئيسي: `data/products.json`

**كل المتجر كيتحكم من هاد الملف.** ما تحتاجش تبدل الكود.

### كيفاش تزيد منتج جديد؟

زيد كائن جديد فالقائمة `[...]`:

```json
{
  "id": "13",
  "name": "سمية المنتج بالدارجة",
  "description": "وصف المنتج هنا...",
  "price": 299,
  "oldPrice": 399,
  "category": "تقليدي",
  "image": "https://example.com/image.jpg",
  "gallery": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "featured": true,
  "inStock": true,
  "whatsappNumber": "212607674922"
}
```

### شرح الحقول

| الحقل | الوصف |
|-------|--------|
| `id` | رقم فريد — كيخدم فالرابط `/products/13` |
| `name` | اسم المنتج |
| `description` | وصف كامل |
| `price` | الثمن بالدرهم (MAD) |
| `oldPrice` | الثمن القديم (اختياري) |
| `category` | الفئة |
| `image` | الصورة الرئيسية |
| `gallery` | صور إضافية |
| `featured` | `true` = يبان فالصفحة الرئيسية |
| `inStock` | `true` = متوفر |
| `whatsappNumber` | رقم واتساب بدون + |
