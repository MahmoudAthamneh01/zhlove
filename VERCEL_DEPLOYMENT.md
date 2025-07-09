# إرشادات رفع ZH-Love على Vercel

## المتطلبات المحققة ✅

- ✅ تم إصلاح جميع أخطاء البناء
- ✅ تم تحديث تكوين Tailwind CSS للتوافق مع Vercel
- ✅ تم إضافة تكوين next-intl المطلوب
- ✅ تم تحديث Next.js config
- ✅ تم إضافة ملفات vercel.json و .vercelignore

## خطوات الرفع على Vercel

### 1. متغيرات البيئة المطلوبة
في لوحة تحكم Vercel، أضف المتغيرات التالية:

```
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
DATABASE_URL=your-database-url-here
```

### 2. إعدادات قاعدة البيانات
- استخدم PostgreSQL كقاعدة بيانات production (بدلاً من SQLite)
- يمكنك استخدام Supabase أو PlanetScale أو Neon
- تأكد من تحديث `DATABASE_URL` في متغيرات البيئة

### 3. أوامر البناء على Vercel
Vercel سيستخدم تلقائياً:
- Build Command: `npm run build`
- Install Command: `npm install`

### 4. إعدادات إضافية للأمان
في ملف vercel.json تم إضافة:
- Security headers
- CORS protection
- XSS protection

## الملفات المحدثة 🔄

### tailwind.config.js
- تم تبسيط التكوين للتوافق مع Vercel
- تم إزالة المسارات المعقدة

### next.config.js
- تم إضافة next-intl plugin
- تم تحسين webpack للبناء

### src/i18n/request.ts
- ملف تكوين next-intl الجديد
- يحتوي على تحميل الرسائل للغات المختلفة

### package.json
- تم تحديث scripts للبناء
- تم إضافة postinstall script

## مشاكل محتملة وحلولها

### مشكلة: "Couldn't find next-intl config"
- ✅ تم حلها بإضافة src/i18n/request.ts

### مشكلة: Tailwind CSS build errors
- ✅ تم حلها بتحديث tailwind.config.js

### مشكلة: JSX syntax errors
- ✅ تم حلها بإصلاح WarRoomClient.tsx

## نصائح للنشر الناجح

1. **تأكد من قاعدة البيانات**:
   ```bash
   # قم بتشغيل migrations
   npx prisma db push
   ```

2. **اختبر البناء محلياً**:
   ```bash
   npm run build
   ```

3. **تحقق من ملفات البيئة**:
   - تأكد أن جميع المتغيرات محددة في Vercel
   - لا تنس NEXTAUTH_SECRET

4. **مراقبة اللوجز**:
   - تحقق من Function Logs في Vercel
   - راقب Build Logs للأخطاء

## إعدادات موصى بها في Vercel

### Node.js Version
- استخدم Node.js 18.x

### Environment Variables
```
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

### Custom Domains
بمجرد النجاح، يمكنك ربط دومين مخصص:
1. اذهب إلى Project Settings
2. أضف Custom Domain
3. اتبع إرشادات DNS

## حالة المشروع الحالية

- ✅ البناء يعمل بنجاح
- ⚠️ يوجد تحذيرات ESLint (ليست مشاكل حاسمة)
- ✅ Tailwind CSS يعمل
- ✅ Next-intl محدد بشكل صحيح
- ✅ جاهز للرفع على Vercel

## التحقق النهائي

قبل الرفع، تأكد من تشغيل:

```bash
# تنظيف وإعادة بناء
rm -rf .next
npm run build

# التحقق من عدم وجود أخطاء
npm run lint
```

إذا كان كل شيء يعمل بنجاح، يمكنك الآن رفع المشروع على Vercel! 🚀 