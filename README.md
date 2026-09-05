# خان الجمر — المنيو الإلكتروني ولوحة الإدارة

تطبيق [vinext](https://github.com/cloudflare/vinext) (إعادة تنفيذ لواجهة Next.js على Vite) يعرض منيو مطعم "خان الجمر" للزبائن ولوحة إدارة لتعديل الأصناف والأسعار والعروض ومتابعة الشكاوى.

للتشغيل المحلي والنشر خطوة بخطوة، راجع [GUIDE-AR.md](GUIDE-AR.md).

## البنية

- **قاعدة البيانات:** PostgreSQL عبر `drizzle-orm` (متغير البيئة `DATABASE_URL`).
- **تخزين الصور:** القرص المحلي (متغير البيئة `UPLOADS_DIR`)، يُنصح بربط Volume عند النشر على استضافة مثل Railway.
- **المصادقة:** كلمة مرور مدير واحدة (`ADMIN_PASSWORD`) وكوكي جلسة موقّع بـ `ADMIN_SESSION_SECRET`.

## أهم الأوامر

- `npm install`: تثبيت الاعتماديات.
- `npm run dev`: تشغيل سيرفر التطوير (Vite).
- `npm run db:generate`: توليد ملفات migration جديدة بعد تعديل `db/schema.ts`.
- `npm run db:migrate`: تطبيق الـ migrations على قاعدة البيانات المحددة في `DATABASE_URL`.
- `npm run build`: بناء نسخة الإنتاج (`dist/`).
- `npm start`: تطبيق الـ migrations ثم تشغيل سيرفر الإنتاج (هذا ما تشغّله منصات مثل Railway تلقائياً).

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle ORM — PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
