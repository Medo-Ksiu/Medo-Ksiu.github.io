/* ============================================================
   كل محتوى البورتفوليو هنا — عدّل الملف ده بس.
   أي نص ليه نسختين: en (إنجليزي) و ar (عربي).
   ============================================================ */

window.PORTFOLIO = {
  defaultLang: "en", // "en" أو "ar" — اللغة اللي الموقع يفتح بيها

  profile: {
    name: { en: "Mohamed Mohey AL-Deen", ar: "محمد محي الدين" },
    fullName: { en: "Mohamed Mohey AL-Deen", ar: "محمد محي الدين" },
    initials: "MM",
    role: { en: "Full-stack & AI developer", ar: "مطوّر Full-stack وذكاء اصطناعي" },
    headline: {
      en: "I build business systems and machine-learning models, from a CRM running in production to a car-price model with 0.96 R².",
      ar: "ببني أنظمة للشركات ونماذج تعلم آلة، من CRM شغّال فعلياً في الإنتاج لحد نموذج تسعير عربيات دقته R² = 0.96."
    },
    location: { en: "Egypt", ar: "مصر" },
    email: "mohamed.ksiu2@gmail.com",
    available: true, // true = يظهر "متاح لمشاريع جديدة"
    status: {
      en: "Open to freelance & full-time work",
      ar: "متاح لشغل فريلانس أو دوام كامل"
    },
    // الجمل اللي بتتكتب وتتمسح تحت اسمك في أول الصفحة
    typedRoles: {
      en: ["Full-stack developer", "AI & ML engineer", "CRM systems builder", "Python & React developer"],
      ar: ["مطوّر Full-stack", "مهندس ذكاء اصطناعي", "باني أنظمة CRM", "مطوّر Python و React"]
    },
    heroStack: ["Python", "FastAPI", "React", "XGBoost"],
    currentlyBuilding: "field-force CRM",
    // سيب الـ url فاضي "" وهيتخفي اللينك تلقائياً
    socials: [
      { label: "GitHub", url: "" },
      { label: "LinkedIn", url: "" },
      { label: "WhatsApp", url: "" }
    ],
    cvUrl: "" // لينك السي ڤي (Google Drive مثلاً) — فاضي = الزرار مخفي
  },

  // الأرقام اللي بتعد لفوق تحت أول الصفحة — كلها من مشاريعك الحقيقية
  stats: [
    { value: 973, label: { en: "automated tests in the CRM", ar: "اختبار أوتوماتيك في الـ CRM" } },
    { value: 8, label: { en: "user roles in one system", ar: "أدوار مستخدمين في سيستم واحد" } },
    { value: 0.96, decimals: 2, prefix: "R² ", label: { en: "car-price model accuracy", ar: "دقة نموذج تسعير العربيات" } },
    { value: "projects", label: { en: "shipped projects", ar: "مشروع منفّذ" } } // "projects" = بيتحسب لوحده
  ],

  about: {
    en: [
      "I'm a developer who likes the whole path from a messy business process to a system people use every day. My biggest project is a CRM that runs a pharmaceutical field force: reps, visits, invoices, stock and analytics, with 973 automated tests behind it.",
      "On the AI side I work with scikit-learn, XGBoost and TensorFlow: price prediction, customer segmentation, image classification and face detection. I study computer science at KSIU, so a lot of my work starts in a course and keeps going after it."
    ],
    ar: [
      "أنا مطوّر بحب الرحلة كلها، من عملية شغل معقدة في شركة لحد سيستم الناس بتستخدمه كل يوم. أكبر مشروع عملته CRM بيدير فريق مندوبين شركة أدوية: المندوبين والزيارات والفواتير والمخزون والتحليلات، ووراه 973 اختبار أوتوماتيك.",
      "في الذكاء الاصطناعي بشتغل بـ scikit-learn وXGBoost وTensorFlow: توقع أسعار، تقسيم عملاء، تصنيف صور، واكتشاف وجوه. بدرس علوم حاسب في KSIU، وكتير من شغلي بيبدأ في مادة ويكمل بعدها."
    ]
  },

  skills: [
    { group: { en: "Backend", ar: "الباك إند" }, items: ["Python", "FastAPI", "Flask", "PHP", "SQLAlchemy", "Alembic", "REST APIs", "pytest"] },
    { group: { en: "Frontend", ar: "الواجهات" }, items: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "TanStack Query", "Recharts"] },
    { group: { en: "AI & data", ar: "الذكاء الاصطناعي والبيانات" }, items: ["scikit-learn", "XGBoost", "TensorFlow / Keras", "Pandas", "NumPy", "OpenCV", "Streamlit"] },
    { group: { en: "Databases & deployment", ar: "قواعد البيانات والنشر" }, items: ["PostgreSQL", "MySQL", "Docker", "Railway", "Git", "WhatsApp Cloud API"] }
  ],

  // الخبرات بالترتيب — الأحدث فوق
  experience: [
    {
      period: { en: "2026 – now", ar: "2026 – الآن" },
      title: { en: "Building a field-force CRM", ar: "بناء CRM لفريق المندوبين" },
      place: { en: "Pharmaceutical company · in production", ar: "شركة أدوية · شغّال في الإنتاج" },
      text: {
        en: "Designed, built and deployed the full system alone: FastAPI backend, React dashboard, PostgreSQL on Railway, backups and monitoring.",
        ar: "صممت وبنيت ونشرت السيستم كله لوحدي: باك إند FastAPI، داشبورد React، PostgreSQL على Railway، ونسخ احتياطي ومراقبة."
      }
    },
    {
      period: { en: "2026", ar: "2026" },
      title: { en: "AI & machine learning training", ar: "تدريب الذكاء الاصطناعي وتعلم الآلة" },
      place: { en: "Capstone: AutoWorth AI", ar: "مشروع التخرج: AutoWorth AI" },
      text: {
        en: "Supervised and unsupervised learning on real datasets, ending with a used-car price model and a Streamlit app.",
        ar: "تعلم بإشراف ومن غير إشراف على داتا حقيقية، وانتهى بنموذج تسعير عربيات مستعملة وتطبيق Streamlit."
      }
    },
    {
      period: { en: "Field training", ar: "تدريب ميداني" },
      title: { en: "Computer vision project", ar: "مشروع رؤية بالحاسب" },
      place: { en: "Face detection with a CNN", ar: "اكتشاف الوجوه بشبكة CNN" },
      text: {
        en: "Trained a convolutional network in TensorFlow to detect faces in real-world photos.",
        ar: "درّبت شبكة تلافيفية بـ TensorFlow تكتشف الوجوه في صور حقيقية."
      }
    },
    {
      period: { en: "Ongoing", ar: "مستمر" },
      title: { en: "Computer science student", ar: "طالب علوم حاسب" },
      place: { en: "KSIU", ar: "KSIU" },
      text: {
        en: "Machine learning, image processing, databases, algorithms, computer architecture and Flutter.",
        ar: "تعلم آلة، معالجة صور، قواعد بيانات، خوارزميات، معمارية حاسب، وFlutter."
      }
    }
  ],

  // التصنيفات اللي بتظهر في فلتر المشاريع
  categories: {
    web: { en: "Web systems", ar: "أنظمة ويب" },
    ml: { en: "AI & ML", ar: "ذكاء اصطناعي" },
    data: { en: "Data & databases", ar: "بيانات وقواعد بيانات" },
    desktop: { en: "Desktop apps", ar: "تطبيقات ديسكتوب" },
    "3d": { en: "3D & WebGL", ar: "3D و WebGL" }
  },

  /* ---------- المشاريع ----------
     image: ""  = فاضي يعمل غلاف تلقائي على شكل محرر كود. أو حط مسار صورة: "assets/projects/x.jpg"
     featured: true = كارت كبير بعرض الصف
  -------------------------------- */
  projects: [
    {
      id: "field-crm",
      file: "app/api/v1/visit_plans.py",
      title: { en: "Field-Force CRM", ar: "CRM لإدارة فريق المندوبين" },
      summary: {
        en: "A full CRM that runs a pharmaceutical sales team: visit plans with GPS check-in, invoices, warehouse stock, finance targets and analytics for 8 user roles.",
        ar: "CRM كامل بيدير فريق مبيعات شركة أدوية: خطط زيارات بتأكيد GPS، فواتير، مخزون مخازن، تارجتات مالية، وتحليلات لـ 8 أدوار مستخدمين."
      },
      details: {
        en: [
          "8 roles with a permission matrix: super admin, area manager, finance, medical rep, pharmacy rep, warehouse keeper, moderator leader and moderator. Each role sees only its own territory and data.",
          "Weekly visit plans with GPS-verified check-in, supervised visits, missed-visit rules and visit reports with custom questions.",
          "Invoice flow from entry to approval and dispatch, warehouse stock in/out, stock counts, and taking stock back from reps and pharmacies.",
          "Analytics, coverage and call-rate statistics, Excel imports and exports, audit log, trash and restore, in-app database backups.",
          "Security: JWT auth, rate limiting, idle-session timeout, idempotent writes and Sentry error monitoring.",
          "973 automated tests across 92 test files, run against a separate database. Deployed on Railway with Docker and Alembic migrations.",
          "Started as two Flask prototypes (MySQL with GPS distance checks, then a Medical CRM) before I rebuilt it on FastAPI and React."
        ],
        ar: [
          "8 أدوار بمصفوفة صلاحيات: سوبر أدمن، مدير منطقة، مالية، مندوب طبي، مندوب صيدليات، أمين مخزن، قائد مودريتورز، ومودريتور. كل دور بيشوف منطقته وبياناته بس.",
          "خطط زيارات أسبوعية بتأكيد حضور بالـ GPS، زيارات بإشراف، قواعد للزيارات الفايتة، وتقارير زيارة بأسئلة مخصصة.",
          "دورة الفاتورة من الإدخال للموافقة والتسليم، دخول وخروج المخزون، جرد، واسترجاع بضاعة من المندوبين والصيدليات.",
          "تحليلات، إحصائيات تغطية ونسبة زيارات، استيراد وتصدير Excel، سجل تعديلات، سلة محذوفات، ونسخ احتياطي من جوه السيستم.",
          "أمان: تسجيل دخول JWT، تحديد معدل الطلبات، خروج تلقائي عند الخمول، منع تكرار العمليات، ومراقبة أخطاء بـ Sentry.",
          "973 اختبار أوتوماتيك في 92 ملف، بيشتغلوا على قاعدة بيانات منفصلة. منشور على Railway بـ Docker وAlembic migrations.",
          "بدأ كنسختين تجريبيتين بـ Flask (MySQL مع حساب مسافة GPS، وبعدين Medical CRM) قبل ما أعيد بناءه بـ FastAPI وReact."
        ]
      },
      category: "web",
      stack: ["FastAPI", "PostgreSQL", "SQLAlchemy", "React", "TanStack Query", "Tailwind", "Docker", "Railway"],
      year: "2026",
      status: { en: "In production", ar: "شغّال في الإنتاج" },
      links: { live: "", code: "" }, // الكود private — لو عملته public حط اللينك هنا
      color: "#2F6E8A",
      image: "assets/projects/crm-dashboard.jpg",
      featured: true
    },
    {
      "id": "tour-horizon",
      "file": "horizon/index.html",
      "title": {
        "en": "Horizon Center — 3D Tour",
        "ar": "Horizon Center — جولة 3D"
      },
      "summary": {
        "en": "Walk a conference and expo venue in first person, right in the browser: lobby, main hall, gallery, tech expo, meeting room and café. Works on desktop and phone.",
        "ar": "اتمشى جوه مركز مؤتمرات ومعارض بكاميرا First Person من المتصفح: لوبي، مسرح رئيسي، جاليري، معرض تكنولوجيا، غرفة اجتماعات وكافيه. شغال على الكمبيوتر والموبايل."
      },
      "details": {
        "en": [
          "Part of a set of three tours: Horizon Center, Lumière Halls and Aurora Museum — all linked from the tours page.",
          "First-person camera: WASD and mouse on desktop, a virtual joystick and swipe-to-look on phones.",
          "Wall and furniture collisions, doors that open as you approach, smooth movement and a subtle head bob.",
          "Live minimap with your position and view direction, plus one-tap jumps to any room.",
          "Info cards appear when you walk up to an exhibit.",
          "Built entirely in code with Three.js on a shared tour engine: no heavy 3D files, so it loads fast on mobile data."
        ],
        "ar": [
          "جزء من 3 جولات: Horizon Center وLumière Halls وAurora Museum — كلهم في صفحة الجولات.",
          "كاميرا First Person: كيبورد وماوس على الكمبيوتر، وجويستيك وسحب للنظر على الموبايل.",
          "تصادم مع الحيطان والعفش، وأبواب بتتفتح لما تقرب، وحركة ناعمة.",
          "خريطة صغيرة بمكانك واتجاه نظرك، وزراير تنقلك لأي قاعة بضغطة.",
          "كروت معلومات بتظهر لما تقرب من أي معروض.",
          "معمول كله بالكود بـ Three.js على محرك جولات مشترك، من غير ملفات 3D تقيلة، فبيحمّل بسرعة على الموبايل."
        ]
      },
      "category": "3d",
      "stack": [
        "Three.js",
        "WebGL",
        "JavaScript",
        "Touch controls"
      ],
      "year": "2026",
      "status": {
        "en": "Live demo",
        "ar": "ديمو شغال"
      },
      "links": {
        "live": "https://medo-ksiu.github.io/virtual-tour/horizon/",
        "code": ""
      },
      "color": "#2E6B7A",
      "image": "",
      "featured": true
    },
    {
      "id": "tour-lumiere",
      "file": "lumiere/index.html",
      "title": {
        "en": "Lumière Halls — 3D Tour",
        "ar": "Lumière Halls — جولة 3D"
      },
      "summary": {
        "en": "An evening walkthrough of a wedding venue: ballroom with chandeliers, a stage and a moving-light dance floor, henna hall, bridal suite and a garden terrace.",
        "ar": "جولة مسائية في قاعة أفراح: بول روم بنجف وكوشة وساحة رقص بإضاءة متحركة، قاعة حنة، جناح العروسة، وجنينة بإضاءة معلّقة."
      },
      "details": {
        "en": [
          "18 round tables, a four-tier cake, a fountain and 140 twinkling string lights, all generated in code.",
          "First-person camera: WASD and mouse on desktop, a virtual joystick and swipe-to-look on phones.",
          "Wall and furniture collisions, doors that open as you approach, smooth movement and a subtle head bob.",
          "Live minimap with your position and view direction, plus one-tap jumps to any room.",
          "Info cards appear when you walk up to an exhibit.",
          "Built entirely in code with Three.js on a shared tour engine: no heavy 3D files, so it loads fast on mobile data."
        ],
        "ar": [
          "18 ترابيزة دايرية، تورتة 4 أدوار، نافورة، و140 لمبة بتنور وتطفي، كلهم معمولين بالكود.",
          "كاميرا First Person: كيبورد وماوس على الكمبيوتر، وجويستيك وسحب للنظر على الموبايل.",
          "تصادم مع الحيطان والعفش، وأبواب بتتفتح لما تقرب، وحركة ناعمة.",
          "خريطة صغيرة بمكانك واتجاه نظرك، وزراير تنقلك لأي قاعة بضغطة.",
          "كروت معلومات بتظهر لما تقرب من أي معروض.",
          "معمول كله بالكود بـ Three.js على محرك جولات مشترك، من غير ملفات 3D تقيلة، فبيحمّل بسرعة على الموبايل."
        ]
      },
      "category": "3d",
      "stack": [
        "Three.js",
        "WebGL",
        "JavaScript",
        "Touch controls"
      ],
      "year": "2026",
      "status": {
        "en": "Live demo",
        "ar": "ديمو شغال"
      },
      "links": {
        "live": "https://medo-ksiu.github.io/virtual-tour/lumiere/",
        "code": ""
      },
      "color": "#8A5A3C",
      "image": ""
    },
    {
      "id": "tour-aurora",
      "file": "aurora/index.html",
      "title": {
        "en": "Aurora Museum — 3D Tour",
        "ar": "Aurora Museum — جولة 3D"
      },
      "summary": {
        "en": "A night tour of a museum: an open-sky atrium with an orbiting solar system, Ancient Egypt, modern art, an ocean room and a planetarium.",
        "ar": "جولة ليلية في متحف: أتريوم مفتوح على السما فيه مجموعة شمسية بتلف، قاعة مصر القديمة، فن حديث، قاعة المحيط، وقبة سماوية."
      },
      "details": {
        "en": [
          "Pyramids of Giza model, golden mask and sarcophagus in glass cases, swimming fish, a suspended whale and a star projector.",
          "First-person camera: WASD and mouse on desktop, a virtual joystick and swipe-to-look on phones.",
          "Wall and furniture collisions, doors that open as you approach, smooth movement and a subtle head bob.",
          "Live minimap with your position and view direction, plus one-tap jumps to any room.",
          "Info cards appear when you walk up to an exhibit.",
          "Built entirely in code with Three.js on a shared tour engine: no heavy 3D files, so it loads fast on mobile data."
        ],
        "ar": [
          "مجسم أهرامات الجيزة، قناع ذهبي وتابوت في فتارين، سمك بيعوم، حوت معلّق، وجهاز عرض نجوم.",
          "كاميرا First Person: كيبورد وماوس على الكمبيوتر، وجويستيك وسحب للنظر على الموبايل.",
          "تصادم مع الحيطان والعفش، وأبواب بتتفتح لما تقرب، وحركة ناعمة.",
          "خريطة صغيرة بمكانك واتجاه نظرك، وزراير تنقلك لأي قاعة بضغطة.",
          "كروت معلومات بتظهر لما تقرب من أي معروض.",
          "معمول كله بالكود بـ Three.js على محرك جولات مشترك، من غير ملفات 3D تقيلة، فبيحمّل بسرعة على الموبايل."
        ]
      },
      "category": "3d",
      "stack": [
        "Three.js",
        "WebGL",
        "JavaScript",
        "Touch controls"
      ],
      "year": "2026",
      "status": {
        "en": "Live demo",
        "ar": "ديمو شغال"
      },
      "links": {
        "live": "https://medo-ksiu.github.io/virtual-tour/aurora/",
        "code": ""
      },
      "color": "#4B3F8F",
      "image": ""
    },
    {
      id: "skin-consult",
      file: "api/book.php",
      title: { en: "Skin Consultation Booking", ar: "منصة حجز الاستشارات الجلدية" },
      summary: {
        en: "A bilingual booking site for free dermatology consultations. Confirmations, reminders and follow-ups go out automatically on WhatsApp.",
        ar: "موقع حجز بلغتين لاستشارات جلدية مجانية. التأكيد والتذكير والمتابعة بيتبعتوا أوتوماتيك على واتساب."
      },
      details: {
        en: [
          "Built for The Only Charm skincare brand with a partner dermatology center.",
          "Customers pick a time from a shared slot pool. The booking only goes through if the WhatsApp confirmation is delivered, which also verifies the phone number.",
          "Hourly cron sends reminders one day and one hour before, then follow-ups after 3 days, 1 week, 3 weeks and 45 days.",
          "Meta webhook tracks delivered, failed and replied messages. Admin panel for bookings, follow-ups and opening or closing slots.",
          "Runs on ordinary shared hosting with no monthly subscriptions."
        ],
        ar: [
          "معمول لبراند The Only Charm بالشراكة مع مركز جلدية.",
          "العميل بيختار ميعاد من سلوتس مشتركة، والحجز مبيتمّش غير لو رسالة التأكيد على واتساب وصلت، وده بيتحقق من الرقم كمان.",
          "Cron كل ساعة بيبعت تذكير قبل يوم وقبل ساعة، ومتابعة بعد 3 أيام وأسبوع و3 أسابيع و45 يوم.",
          "Webhook من ميتا بيتابع الرسائل اللي وصلت أو فشلت أو اترد عليها. ولوحة تحكم للحجوزات والمتابعات وفتح وقفل المواعيد.",
          "شغال على استضافة عادية من غير أي اشتراكات شهرية."
        ]
      },
      category: "web",
      stack: ["PHP", "MySQL", "JavaScript", "WhatsApp Cloud API", "Cron"],
      year: "2026",
      status: { en: "Ready to launch", ar: "جاهز للإطلاق" },
      links: { live: "", code: "" },
      color: "#3F7F78",
      image: "assets/projects/skin-consult.jpg"
    },
    {
      id: "autoworth",
      file: "notebooks/AutoWorth_AI.ipynb",
      title: { en: "AutoWorth AI", ar: "AutoWorth AI" },
      summary: {
        en: "Predicts the fair price of a used car in the UK and tells you if the seller's price is a good deal. Test R² 0.960, average error £1,053.",
        ar: "بيتوقع السعر العادل لعربية مستعملة في بريطانيا ويقولك سعر البايع لقطة ولا غالي. دقة R² = 0.960 ومتوسط خطأ £1,053."
      },
      details: {
        en: [
          "Cleaned 99,187 listings from 9 makes down to 97,643, with a 70/15/15 split stratified by make.",
          "Compared 10 regression models with the same split and metrics. Tuned XGBoost won: 0.970 R² on validation, 0.960 on the untouched test set of 14,647 cars.",
          "80% of predictions land within ±10% of the real price. The final model file is only 7 MB.",
          "A Smart Deal Advisor rates each listing from Great Deal to Overpriced, served through a Streamlit app."
        ],
        ar: [
          "نضّفت 99,187 إعلان من 9 ماركات لحد 97,643، وقسمت الداتا 70/15/15 متوازنة حسب الماركة.",
          "قارنت 10 نماذج Regression بنفس التقسيم والمقاييس. XGBoost بعد الضبط كسب: R² = 0.970 على الـ validation و0.960 على 14,647 عربية في الـ test.",
          "80% من التوقعات في حدود ±10% من السعر الحقيقي، وملف النموذج 7 ميجا بس.",
          "مستشار صفقات بيقيّم كل إعلان من لقطة لحد غالي، من خلال تطبيق Streamlit."
        ]
      },
      category: "ml",
      stack: ["Python", "XGBoost", "scikit-learn", "Pandas", "Streamlit"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#4C6FA8",
      image: "assets/projects/autoworth.jpg"
    },
    {
      id: "face-detect",
      file: "train.py",
      title: { en: "Face Detection CNN", ar: "اكتشاف الوجوه بـ CNN" },
      summary: {
        en: "A convolutional neural network trained from scratch to find faces in real photos and video frames.",
        ar: "شبكة عصبية تلافيفية متدربة من الصفر عشان تلاقي الوجوه في صور وفريمات فيديو حقيقية."
      },
      details: {
        en: [
          "Field-training project built with TensorFlow / Keras and OpenCV.",
          "Three convolution blocks (32, 64, 128 filters) on 128×128 images, trained for 25 epochs.",
          "Dataset with separate train, validation and test splits, plus background images so the model learns what is not a face.",
          "Includes a test script that runs the saved model on any new photo."
        ],
        ar: [
          "مشروع تدريب ميداني بـ TensorFlow / Keras وOpenCV.",
          "3 طبقات Convolution (32 و64 و128 فلتر) على صور 128×128، واتدربت 25 epoch.",
          "داتا مقسومة train وvalidation وtest، ومعاها صور خلفيات عشان النموذج يتعلم إيه اللي مش وش.",
          "فيه سكربت اختبار بيشغل النموذج المحفوظ على أي صورة جديدة."
        ]
      },
      category: "ml",
      stack: ["TensorFlow", "Keras", "OpenCV", "NumPy"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#7A62B0",
      image: ""
    },
    {
      id: "photo-editor",
      file: "photoshop_app.py",
      title: { en: "Mini Photoshop", ar: "ميني فوتوشوب" },
      summary: {
        en: "A desktop image editor with crop, copy and paste, text, filters, effects and undo, built for an image-processing course.",
        ar: "برنامج تعديل صور ديسكتوب فيه قص ونسخ ولصق وكتابة وفلاتر وتأثيرات وتراجع، معمول لمادة معالجة الصور."
      },
      details: {
        en: [
          "Interactive crop, copy and paste of regions, and text placement directly on the canvas.",
          "Filters: grayscale, brightness, contrast, histogram equalization, edge detection, blur and sharpen.",
          "Effects: vintage, sepia, pencil sketch, warm and cool tones.",
          "Full undo history, load and save. Course project for CSE281."
        ],
        ar: [
          "قص تفاعلي، نسخ ولصق أجزاء من الصورة، وكتابة نص على الصورة مباشرة.",
          "فلاتر: أبيض وأسود، إضاءة، تباين، معادلة الهستوجرام، اكتشاف الحواف، تنعيم، وتحديد.",
          "تأثيرات: ڤينتاج، سيبيا، رسم بالقلم، ألوان دافية وباردة.",
          "سجل تراجع كامل، وفتح وحفظ الصور. مشروع مادة CSE281."
        ]
      },
      category: "desktop",
      stack: ["Python", "OpenCV", "Pillow", "Tkinter"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#8A6A4F",
      image: ""
    },
    {
      id: "customer-segments",
      file: "CreditCard_Clustering.ipynb",
      title: { en: "Credit Card Customer Segmentation", ar: "تقسيم عملاء الكريدت كارد" },
      summary: {
        en: "Groups about 9,000 credit-card holders into segments a bank can act on, using unsupervised learning.",
        ar: "بيقسم حوالي 9,000 عميل كريدت كارد لشرائح البنك يقدر يتعامل معاها، بالتعلم من غير إشراف."
      },
      details: {
        en: [
          "Real missing values handled (minimum payments and credit limit) and features scaled before clustering.",
          "Compared K-Means, DBSCAN, Agglomerative clustering and Gaussian Mixture, scored with silhouette.",
          "PCA and t-SNE to visualize the segments in 2D."
        ],
        ar: [
          "معالجة قيم ناقصة حقيقية (الحد الأدنى للسداد والحد الائتماني) وتوحيد مقياس البيانات قبل التقسيم.",
          "مقارنة K-Means وDBSCAN وAgglomerative وGaussian Mixture بمقياس silhouette.",
          "PCA وt-SNE لعرض الشرائح في رسم ثنائي الأبعاد."
        ]
      },
      category: "ml",
      stack: ["scikit-learn", "Pandas", "Seaborn", "PCA"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#3E8A72",
      image: ""
    },
    {
      id: "fashion-mnist",
      file: "main.ipynb",
      title: { en: "Fashion-MNIST Classifier Comparison", ar: "مقارنة مصنفات Fashion-MNIST" },
      summary: {
        en: "Compares classic models on clothing images. Logistic regression reached 83.3% accuracy across 10 classes.",
        ar: "مقارنة بين نماذج كلاسيكية على صور ملابس. الـ Logistic Regression وصل لدقة 83.3% على 10 أصناف."
      },
      details: {
        en: [
          "Images flattened from 28×28 to 784 features and normalized, on stratified train and test subsets.",
          "Results: Logistic Regression 83.3%, SVM 81.5%, Decision Tree 71.5%, and Linear Regression 35.5% as a baseline.",
          "Classification report per class to see which garments get confused."
        ],
        ar: [
          "الصور اتحولت من 28×28 لـ 784 خاصية واتعمل لها normalization، على عينات train وtest متوازنة.",
          "النتايج: Logistic Regression ‏83.3%، SVM ‏81.5%، Decision Tree ‏71.5%، وLinear Regression ‏35.5% كخط أساس.",
          "تقرير تصنيف لكل صنف عشان نعرف أنهي هدوم بتتلخبط في بعض."
        ]
      },
      category: "ml",
      stack: ["scikit-learn", "TensorFlow", "Matplotlib"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#9A6B8F",
      image: ""
    },
    {
      id: "web-scraping",
      file: "web_scraping_two_projects.ipynb",
      title: { en: "Web Scraping: Matches & Oscar Films", ar: "سحب بيانات من الويب: ماتشات وأفلام الأوسكار" },
      summary: {
        en: "Two scrapers: football matches from YallaKora with Requests and BeautifulSoup, and AJAX-loaded Oscar films with Selenium.",
        ar: "سكرابرين: ماتشات الكورة من يلا كورة بـ Requests وBeautifulSoup، وأفلام الأوسكار اللي بتتحمل بـ AJAX بـ Selenium."
      },
      details: {
        en: [
          "Static site: locate match data with CSS selectors, then clean and validate it.",
          "Dynamic site: drive a real browser with Selenium to wait for AJAX content before extracting it.",
          "Both projects save clean results to CSV files."
        ],
        ar: [
          "موقع ثابت: تحديد بيانات الماتشات بـ CSS selectors، وبعدين تنضيفها والتأكد منها.",
          "موقع ديناميكي: تشغيل متصفح حقيقي بـ Selenium يستنى محتوى الـ AJAX قبل ما يسحبه.",
          "المشروعين بيحفظوا النتايج نضيفة في ملفات CSV."
        ]
      },
      category: "data",
      stack: ["Python", "BeautifulSoup", "Selenium", "Requests"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#A0703C",
      image: ""
    },
    {
      id: "food-delivery-db",
      file: "food_delivery.sql",
      title: { en: "Food Delivery Database", ar: "قاعدة بيانات توصيل أكل" },
      summary: {
        en: "A relational database design for a food delivery app, with an ERD and 7 linked tables.",
        ar: "تصميم قاعدة بيانات علائقية لتطبيق توصيل أكل، فيها ERD و7 جداول مترابطة."
      },
      details: {
        en: [
          "Tables for customers, restaurants, menus, orders, order items, delivery addresses and payments.",
          "Primary and foreign keys model the full order path from menu to payment.",
          "Interactive ERD diagram included."
        ],
        ar: [
          "جداول للعملاء والمطاعم والمنيوهات والطلبات وعناصر الطلب وعناوين التوصيل والمدفوعات.",
          "المفاتيح الأساسية والأجنبية بتمثل رحلة الطلب كاملة من المنيو للدفع.",
          "معاه رسم ERD تفاعلي."
        ]
      },
      category: "data",
      stack: ["MySQL", "SQL", "ERD"],
      year: "2026",
      links: { live: "", code: "" },
      color: "#5F7F4A",
      image: ""
    }
  ]
};
