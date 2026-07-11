# 🏋️‍♂️ Ultimate Gym Management System - Buyer Guide / دليل المشتري

This guide contains the system prerequisites, installation steps, batch file (.bat) setup for quick launch, and detailed instructions to set up Gmail SMTP for the password recovery system (OTP).

---

## 🇬🇧 English Guide

### 📋 Prerequisites & System Requirements
To run this application successfully, you need the following installed on your machine or server:
1. **Node.js** (Recommended version: `18.x` or `20.x` LTS)
2. **MongoDB** (Local instance or **MongoDB Atlas** cloud database)
3. **NPM** (Comes bundled with Node.js)
4. A modern web browser (Chrome, Edge, Safari, Firefox)

---

### 🚀 Step-by-Step Installation

1. **Extract files:** Extract the source code zip archive into your preferred directory.
2. **Install dependencies:** Open your terminal in the project directory and run:
   ```bash
   npm install
   ```
3. **Environment Setup:**
   * Create a new file named `.env.local` in the root directory.
   * Add your MongoDB URI connection string:
     ```env
     MONGODB_URI=mongodb://localhost:27017/gym-management
     ```
     *(Or your MongoDB Atlas connection string)*

4. **Launch the Application:**
   * **Development Mode:**
     ```bash
     npm run dev
     ```
   * **Production Build:**
     ```bash
     npm run build
     npm start
     ```
5. **Initial Login:**
   * Open your browser and go to `http://localhost:3000`
   * On the first run, the system will automatically prompt you to register the first master administrator account. Fill out the registration form to create your admin account, and use it to log in.
   * **Mode:** Select `Mixed` (السيستم المختلط) to access all management tabs.

---

### ⚡ Quick Launch Shortcut (Windows .bat File)

You can create a double-clickable desktop shortcut (`.bat` file) to automatically start the local server and open the web app in your browser after 3 seconds:

1. Create a new text file on your Desktop and rename it to `start_gym.bat` (make sure the extension is `.bat` and not `.txt`).
2. Right-click the file and choose **Edit**.
3. Copy and paste the code below:
   ```bat
   @echo off
   title Start Gym Management System
   
   :: IMPORTANT: Change the directory path below to where you extracted the project files on your computer!
   cd /d "C:\path\to\your\extracted\Gym_Management_Sys"
   
   :: Start the Next.js local server in the background
   start "" npm run dev
   
   :: Wait for 3 seconds for the server to spin up
   timeout /t 3 /nobreak > nul
   
   :: Open the application in the default web browser
   start http://localhost:3000
   ```
4. Save and close the file. Double-click it anytime to boot the gym management system instantly.

---

### 📧 How to Enable Gmail SMTP for OTP Password Recovery

To allow admins to request an OTP (One-Time Password) code via email when they forget their password, follow these steps:

#### Step 1: Generate a Google App Password
Since Google has disabled "less secure apps", you must generate a 16-character App Password:
1. Log into your **Google Account**.
2. Go to **Security** from the left sidebar.
3. Ensure that **2-Step Verification** is enabled for your account (this is mandatory).
4. Search for **App Passwords** in the settings search bar, or navigate to it directly.
5. Enter a name for the application (e.g., `Gym Management GMS`).
6. Click **Create**.
7. Google will display a **16-character app password** inside a yellow box. Copy this password (without spaces).

#### Step 2: Configure Environment Variables
Open your `.env.local` file and add the following two variables:
```env
# The sender Gmail address
GMAIL_USER=your-email@gmail.com

# The 16-character App Password you generated in Step 1
GMAIL_PASS=xxxx yyyy zzzz wwww
```
*(If hosting on a platform like Vercel, add these as environment variables in your project settings dashboard)*

#### Step 3: Password Retrieval Flow
1. On the login screen, click **Forgot Password?** (نسيت كلمة المرور؟).
2. Enter the administrator's email address.
3. Click **Send Verification Code**.
4. The system will send the OTP to your Gmail inbox within seconds. Enter this code in the system to set your new password.

---
---

## 🇦🇪 دليل المستخدم باللغة العربية

### 📋 متطلبات النظام الأساسية
لتشغيل التطبيق بنجاح، يجب أن تتوفر البرمجيات التالية على جهازك أو سيرفر الاستضافة الخاص بك:
1. **Node.js** (الإصدار الموصى به: `18.x` أو `20.x` LTS)
2. **MongoDB** (نسخة محلية أو قاعدة بيانات سحابية من نوع **MongoDB Atlas**)
3. **NPM** (يأتي مدمجاً مع تثبيت Node.js)
4. متصفح إنترنت حديث (Chrome, Edge, Safari, Firefox)

---

### 🚀 خطوات التثبيت والتشغيل بالتفصيل

1. **فك الضغط:** قم بفك ضغط ملف المشروع في المجلد المختار.
2. **تثبيت الملحقات:** افتح شاشة Terminal (الموجه) في مجلد المشروع ونفذ الأمر التالي:
   ```bash
   npm install
   ```
3. **إعداد الإعدادات البيئية:**
   * قم بإنشاء ملف جديد في المجلد الرئيسي للمشروع باسم `.env.local`.
   * أضف رابط الاتصال بقاعدة بيانات MongoDB الخاصة بك كالتالي:
     ```env
     MONGODB_URI=mongodb://localhost:27017/gym-management
     ```
     *(أو رابط قاعدة البيانات السحابية MongoDB Atlas)*

4. **تشغيل النظام:**
   * **للتشغيل في بيئة التطوير:**
     ```bash
     npm run dev
     ```
   * **للتشغيل والإنتاج الفعلي:**
     ```bash
     npm run build
     npm start
     ```
5. **تسجيل الدخول الأول:**
   * افتح المتصفح واذهب إلى العنوان: `http://localhost:3000`
   * عند تشغيل النظام للمرة الأولى، سيطلب منك النظام تلقائيًا تسجيل حساب المدير الرئيسي الأول (Master Admin). قم بملء نموذج التسجيل لإنشاء حسابك والدخول به مباشرة.
   * **الوضع:** اختر **المختلط** (Mixed) للوصول لجميع تبويبات الإدارة الكاملة.

---

### ⚡ اختصار التشغيل السريع (ملف .bat لـ Windows)

يمكنك إنشاء اختصار تشغيل تلقائي على سطح المكتب لفتح النظام وتشغيله بضغطة زر واحدة خلال 3 ثوانٍ فقط:

1. قم بإنشاء ملف نصي جديد على سطح المكتب وأعد تسميته إلى `start_gym.bat` (تأكد من أن الامتداد هو `.bat` وليس `.txt`).
2. انقر بزر الماوس الأيمن على الملف واختر **تعديل (Edit)**.
3. انسخ الكود البرمجي أدناه وضعه داخل الملف:
   ```bat
   @echo off
   title Start Gym Management System
   
   :: هام جداً: قم بتغيير المسار أدناه إلى مسار مجلد المشروع الفعلي على جهازك!
   cd /d "C:\path\to\your\extracted\Gym_Management_Sys"
   
   :: تشغيل سيرفر النظام المحلي في الخلفية
   start "" npm run dev
   
   :: الانتظار لمدة 3 ثوانٍ حتى يستقر السيرفر ويقلع بالكامل
   timeout /t 3 /nobreak > nul
   
   :: فتح النظام مباشرة في متصفح الإنترنت الافتراضي الخاص بك
   start http://localhost:3000
   ```
4. احفظ الملف وأغلقه. الآن يمكنك تشغيل نظام الجيم في أي وقت بمجرد النقر المزدوج على هذا الملف!

---

### 📧 كيفية ربط النظام بالـ Gmail لتفعيل ميزة استعادة كلمة المرور (OTP)

لتفعيل إرسال أكواد التحقق (OTP) لاستعادة كلمة مرور المدير في حال نسيانها، يرجى اتباع الخطوات التالية بدقة:

#### الخطوة 1: تفعيل "كلمة مرور التطبيق" (App Password) لحساب Gmail
نظراً لأن جوجل تمنع استخدام كلمة المرور العادية لأسباب أمنية، يجب إنشاء "كلمة مرور خاصة بالتطبيق" كالتالي:
1. افتح حساب جوجل الخاص بك (Google Account).
2. اذهب إلى تبويب **الأمان (Security)** من القائمة الجانبية.
3. تأكد من تفعيل **"التحقق بخطوتين" (2-Step Verification)** في حسابك، حيث أن هذا الشرط إلزامي لإنشاء كلمات مرور التطبيقات.
4. ابحث في شريط البحث العلوي داخل إعدادات الحساب عن **"كلمات مرور التطبيقات" (App Passwords)**.
5. سيطلب منك كتابة اسم للتطبيق (مثلاً اكتب: `Gym GMS`).
6. اضغط على **إنشاء (Create)**.
7. سيظهر لك مربع يحتوي على كلمة مرور عشوائية مكونة من **16 حرفاً** (مكتوبة داخل مستطيل أصفر). قم بنسخها وحفظها جيداً.

#### الخطوة 2: إضافة البيانات لملف الإعدادات `.env.local`
افتح ملف الإعدادات البيئية الخاص بالنظام `.env.local` وأضف المتغيرين التاليين:

```env
# بريد جيميل الذي سيقوم بإرسال الرسائل والأكواد للمستخدمين
GMAIL_USER=your-email@gmail.com

# كلمة مرور التطبيق المكونة من 16 حرفاً (التي قمت بنسخها في الخطوة السابقة بدون مسافات)
GMAIL_PASS=xxxx yyyy zzzz wwww
```
*(إذا كنت تقوم برفع النظام على منصة سحابية مثل Vercel، قم بإضافة هذه البيانات في قسم Environment Variables في لوحة تحكم المنصة)*

#### الخطوة 3: طريقة الاسترداد
1. في شاشة تسجيل الدخول بالنظام، اضغط على **"نسيت كلمة المرور؟"**.
2. أدخل بريد المدير الإلكتروني.
3. اضغط على **"إرسال رمز التحقق"**.
4. سيقوم النظام تلقائياً بإنشاء رمز تحقق عشوائي (OTP) وإرساله إلى بريدك الإلكتروني في ثوانٍ.
5. أدخل الرمز الذي وصلك في الخانة المخصصة بالواجهة، ثم قم بتعيين كلمة مرورك الجديدة.
