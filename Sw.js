// ==========================================
// 1. CONFIGURATION DU NOYAU DE CACHE MEDICAL
// ==========================================
const CACHE_NAME = 'doumdeli-medical-v1';

// Actifs statiques assurant le fonctionnement offline pour la coordination internationale
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',

  // --- IMAGES MEDICALES & HÔPITAL (Trajectoires locales) ---
  './images/cancer.jpg',
  './images/diabetes.jpg',
  './images/kidney.jpg',
  './images/neurology.jpg'
];

// ==========================================
// 2. ÉVÉNEMENT 'INSTALL' : MISE EN CACHE DES RESSOURCES
// ==========================================
self.addEventListener('install', (e) => {
  console.log('🏥 [Service Worker] Installation du noyau médical et mise en cache...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Fluidité d'installation garantie même si les dossiers d'images sont vides initialement
      return cache.addAll(STATIC_ASSETS)
        .then(() => console.log('✅ [Service Worker] Tous les actifs médicaux sont sécurisés !'))
        .catch(err => console.log('⚠️ [Service Worker] Note: Ressources d\'images locales indisponibles pour le moment.', err));
    })
  );
  self.skipWaiting();
});

// ==========================================
// 3. ÉVÉNEMENT 'ACTIVATE' : NETTOYAGE DES ANCIENS CACHES
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
// 4. ÉVÉNEMENT 'FETCH' : STRATÉGIE DE REPLI HORS-LIGNE (OFFLINE)
// ==========================================
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Mise en cache dynamique des imageries et données cliniques réseau
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
        // Activation automatique du mode hors-ligne pour préserver l'accès du patient
        console.log(`📡 [Service Worker] Mode Hors-ligne médical activé pour : ${e.request.url}`);
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback : Image médicale alternative haut de gamme si la ressource est absente
          if (e.request.destination === 'image') {
            return caches.match('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600')
              .then(fallbackResponse => fallbackResponse || new Response('', { status: 404, statusText: 'Not Found' }));
          }
        });
      })
  );
});
