// ==========================================
// 1. المورد الطبي والـ FAKE MEDICAL API للأمراض المستعصية
// ==========================================
const MEDICAL_DISEASES_DATA = [
  {
    id: "cancer",
    name: "علاج الأورام والسرطانات بمختلف أنواعها",
    description: "بروتوكولات علاجية متطورة تعتمد على العلاج الموجه والمناعي لتدمير الخلايا السرطانية وتحفيز نظام المناعة الذاتي دون الإضرار بالخلايا السليمة.",
    symptoms: ["الأورام الصلبة", "سرطان الدم والأنسجة", "الحالات المتقدمة والمقاومة للعلاج التقليدي"],
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600", // صورة طبية مجهرية حقيقية لخلايا ومختبرات
    localImage: "./images/cancer.jpg" // المسار المحلي المستقبلي لصورة المستشفى
  },
  {
    id: "diabetes",
    name: "علاج مرض السكري المزمن والمضاعف",
    description: "البروتوكول الطبي الفريد الذي تخصص فيه أطباؤنا لإعادة تأهيل خلايا البنكرياس وعلاج المقاومة الشديدة، وهو نفس العلاج الفعال الذي تماثلت به جدة مؤسس الموقع للشفاء التام.",
    symptoms: ["السكري من النوع الأول والثاني", "مضاعفات القدم السكرية", "اعتلال الأعصاب وضغط الدم المزمن"],
    imageUrl: "https://images.unsplash.com/photo-1611010344445-6a61111b11ae?w=600", // صورة فحص دم ومستويات سكر دقيقة
    localImage: "./images/diabetes.jpg"
  },
  {
    id: "kidney",
    name: "قصور الكلى والفشل الكبدي المستعصي",
    description: "برامج متكاملة لتجديد وظائف الأعضاء الحيوية وتحسين الفلترة الطبيعية للجسم لتجنيب المرضى مغبة غسيل الكلى المستمر وإعادة التوازن البيولوجي.",
    symptoms: ["الفشل الكلوي الحاد والمزمن", "تليف وتضخم الكبد", "اضطرابات الإنزيمات والسموم المتراكمة"],
    imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600", // صورة فحص إشعاعي ومتابعة طبية حقيقية
    localImage: "./images/kidney.jpg"
  },
  {
    id: "neurology",
    name: "أمراض الجهاز العصبي والضمور والعمود الفقري",
    description: "تشخيص وعلاج الاضطرابات العصبية المعقدة وحالات الشلل والضمور العضلي باستخدام تقنيات تحفيز الخلايا وتنشيط الإشارات العصبية المركزية.",
    symptoms: ["ضمور العضلات والأعصاب", "آلام وتآكل غضاريف العمود الفقري", "تأهيل الجلطات الدماغية المقاومة"],
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600", // صورة تشريحية للدماغ والأعصاب
    localImage: "./images/neurology.jpg"
  }
];

// ==========================================
// 2. دالة رندرة وعرض البيانات ديناميكياً في الواجهة
// ==========================================
function renderMedicalDiseases() {
  const gridContainer = document.getElementById('diseases-grid');
  if (!gridContainer) return;

  // تنظيف اللودر المؤقت
  gridContainer.innerHTML = '';

  // توليد كروت الأمراض
  MEDICAL_DISEASES_DATA.forEach((disease) => {
    const card = document.createElement('div');
    card.className = "bg-white rounded-3xl overflow-hidden shadow-md shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-slate-100 flex flex-col text-right";
    
    card.innerHTML = `
      <div class="relative h-56 w-full bg-slate-100 overflow-hidden">
        <!-- يتم محاولة تحميل الصورة المحلية أولاً، وإذا لم توجد (onerror) يتم سحب الصورة الحقيقية الحية من الـ API مباشرة -->
        <img src="${disease.localImage}" 
             onerror="this.onerror=null; this.src='${disease.imageUrl}';" 
             alt="${disease.name}" 
             class="w-full h-full object-cover transition duration-500 hover:scale-105">
        <div class="absolute top-4 right-4 bg-sky-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-sm">
          <i class="fa-solid fa-microscope ml-1"></i> حالة مستهدفة
        </div>
      </div>
      
      <div class="p-6 flex-grow flex flex-col">
        <h4 class="text-xl font-extrabold text-slate-900 mb-3 leading-snug">${disease.name}</h4>
        <p class="text-slate-600 text-sm font-medium leading-relaxed mb-4">${disease.description}</p>
        
        <div class="mt-auto pt-4 border-t border-slate-50">
          <span class="text-xs font-bold text-slate-400 block mb-2">أبرز الحالات التي يتم علاجها:</span>
          <div class="flex flex-wrap gap-1.5">
            ${disease.symptoms.map(symptom => `
              <span class="bg-slate-50 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-100">
                <i class="fa-solid fa-check text-emerald-500 ml-1"></i> ${symptom}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    gridContainer.appendChild(card);
  });
}

// ==========================================
// 3. تسجيل الـ SERVICE WORKER الطبي
// ==========================================
function registerMedicalServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('🏥 [Doumdeli Medical] SW المسئول عن حماية المرضى والعمل Offline يعمل بنجاح!', reg.scope))
        .catch(err => console.error('⚠️ [Doumdeli Medical] فشل تسجيل الـ SW:', err));
    });
  }
}

// تشغيل النظام فور جاهزية وثيقة الـ DOM
document.addEventListener('DOMContentLoaded', () => {
  renderMedicalDiseases();
  registerMedicalServiceWorker();
});
