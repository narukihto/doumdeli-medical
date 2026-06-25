// ==========================================
// 1. CONFIGURATION DU NOYAU DE CACHE MEDICAL
// ==========================================
const CACHE_NAME = 'doumdeli-medical-v1';

// مصفوفة الأصول الطبية لضمان عمل منصة العلاج والوساطة بالكامل Offline للمرضى
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',

  // --- IMAGES MEDICALES & CLINIC (مسارات الصور الطبية والمستشفى) ---
  './images/cancer.jpg',
  './images/diabetes.jpg',
  './images/kidney.jpg',
  './images/neurology.jpg'
];

// ==========================================
// 2. ÉVÉNEMENT 'INSTALL' : CAPTURE DES DIMENSIONS MEDICALES
// ==========================================
self.addEventListener('install', (e) => {
  console.log('🏥 [Service Worker] Installation du noyau médical et mise en cache...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // إجبار التثبيت المائع حتى لو لم تكن صور المستشفى الحقيقية مرفوعة بعد في المجلدات
      return cache.addAll(STATIC_ASSETS)
        .then(() => console.log('✅ [Service Worker] Tous les actifs médicaux sont sécurisés !'))
        .catch(err => console.log('⚠️ [Service Worker] Note: Les dossiers d\'images sont vides actuellement. Fluidité d\'installation maintenue.', err));
    })
  );
  self.skipWaiting();
});

// ==========================================
// 3. ÉVÉNEMENT 'ACTIVATE' : NETTOYAGE DES ANCIENS CODES
// ==========================================
self.addEventListener('activate', (e) => {
  console.log('⚡ [Service Worker] Activation et purge des anciens caches médicaux...');
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`🗑️ [Service Worker] Suppression de l'ancien cache : ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// ==========================================
// 4. ÉVÉNEMENT 'FETCH' : STRATÉGIE HORS-LIGNE POUR LES PATIENTS
// ==========================================
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // تحديث وتخزين البيانات الطبية المستدعاة ديناميكياً عند وجود اتصال بالشبكة
        if (response.status === 200) {
          const isMedicalRequest = e.request.url.includes('images') || e.request.destination === 'image';
          const isUnsplashApi = e.request.url.includes('unsplash.com');

          if (isMedicalRequest || isUnsplashApi) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseClone);
              console.log(`📥 [Service Worker] Image médicale mise à jour : ${e.request.url}`);
            });
          }
        }
        return response;
      })
      .catch((error) => {
        // في حال انقطاع التغطية تماماً عند المريض، يتم سحب البيانات فوراً من الكاش
        console.log(`📡 [Service Worker] Mode Hors-ligne médical activé pour : ${e.request.url}`);
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // إذا كانت صورة مفقودة ولم يتم كاشها، نعرض صورة طبيب بديلة واحترافية حية من الإنترنت كـ Fallback
          if (e.request.destination === 'image') {
            return caches.match('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600')
              .then(fallbackResponse => fallbackResponse || new Response('', { status: 404, statusText: 'Not Found' }));
          }
        });
      })
  );
});
