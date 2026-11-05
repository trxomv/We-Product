# دليل استضافة WE Offers

عنوان Apps Script الحالي موجود مرة واحدة في `public/site-config.js`. لبناء موقع static مستقل:

```bash
npm ci
npm test
npm run build
```

يراجع البناء صحة عنوان `/exec`، ثم ينسخ كامل `public/` إلى `dist/`، بما في ذلك `index.html` وملفات `css/` و`js/` والصور والأيقونات وشعارات الدفع المحلية. ارفع **محتويات** `dist/` إلى جذر Netlify أو Vercel أو أي static host. إعدادا `netlify.toml` و`vercel.json` يستخدمان أمر `npm run build` ومجلد النشر `dist`. لا يتطلب الموقع قاعدة بيانات أو خادمًا دائمًا.

لتشغيل المعاينة المحلية بعد البناء:

```bash
npm run preview
```

للتطوير استخدم `npm run dev` على المنفذ 3000. بعد تعديل عنوان Apps Script، أو `site-config.js`، أو أي ملف مصدر: شغّل `npm test` ثم `npm run build` وارفع الناتج الجديد. كود الجسر المنفصل هو `apps-script/Code.gs` وبيان الصلاحيات `apps-script/appsscript.json`؛ بعد تعديل `Code.gs` احفظ ثم أعد نشر **New version** من Manage deployments. انشره كـWeb App مع **Execute as: Me** و**Who has access: Anyone** ليتمكن زوار الموقع من قراءته. لا تكرر عنوان `/exec` في الملفات الأخرى، ولا تضع بيانات سرية في أوراق Sheets المسموح بقراءتها أو في ملفات المصدر.

أسماء طرق الدفع الفعّالة تأتي من `Payment Methods` بعمودي `Payment Method` و`Enable` فقط؛ لا يحتاج الشيت عمودًا لمسار الشعار. لإظهار شعار محلي لطريقة جديدة، أضف الصورة إلى `public/assets/payment-methods/` باسم slug اسم الطريقة (مثال `Payment_Custom_Wallet` ← `custom-wallet.png`). يدعم الموقع `.webp` و`.png` و`.svg` و`.jpg` و`.jpeg` ويعرض شارة حروف إذا لم يجد ملفًا صالحًا. الإعلانات تُقرأ منفصلة من ورقة `Announcements` بأعمدة `No. | Value | Enable`.

لم يتم ربط حساب استضافة خارجي أو تعديل Google Sheet ضمن هذا المشروع. رابط المصنف وإرشادات تطوير بقية الملفات موضحة في `README.md`.
