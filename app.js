// ==========================================
// 1. COMPOSANTE LOGICIELLE : API MEDICAL DES PATHOLOGIES LOURDES
// ==========================================
const MEDICAL_DISEASES_DATA = [
  {
    id: "cancer",
    name: "Oncologie & Traitements Cancéreux Avancés",
    description: "Protocoles thérapeutiques de pointe basés sur les thérapies ciblées et l'immunothérapie cellulaire. Conçus pour détruire les cellules tumorales et stimuler le système immunitaire sans altérer les tissus sains.",
    symptoms: ["Tumeurs solides", "Leucémies & lymphomes", "Stades avancés résistants"],
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600",
    localImage: "./images/cancer.jpg"
  },
  {
    id: "diabetes",
    name: "Prise en Charge du Diabète Chronique & Sévère",
    description: "Un protocole clinique d'exception dédié à la régénération des cellules pancréatiques et au traitement de l'insulinorésistance critique. Ce traitement de rupture a permis la rémission totale de membres de notre propre famille.",
    symptoms: ["Diabète Type 1 & 2", "Complications du pied diabétique", "Neuropathies & troubles artériels"],
    imageUrl: "https://images.unsplash.com/photo-1611010344445-6a61111b11ae?w=600",
    localImage: "./images/diabetes.jpg"
  },
  {
    id: "kidney",
    name: "Insuffisance Rénale & Pathologies Hépatiques",
    description: "Programmes intégrés de restauration des fonctions vitales et d'optimisation de la filtration biologique. L'objectif est de stabiliser l'organisme et d'éviter autant que possible les protocoles lourds de dialyse continue.",
    symptoms: ["Insuffisance rénale aiguë/chronique", "Cirrhose & stéatose hépatique", "Syndromes métaboliques complexes"],
    imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600",
    localImage: "./images/kidney.jpg"
  },
  {
    id: "neurology",
    name: "Neurologie, Atrophies & Pathologies Rachidiennes",
    description: "Diagnostic de précision et protocoles de stimulation cellulaire pour les troubles neurologiques complexes, paralysies et atrophies musculaires, visant à restaurer la transmission des signaux nerveux centraux.",
    symptoms: ["Atrophies musculaires & nerveuses", "Discopathies & usure du rachis", "Réhabilitation post-AVC complexe"],
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600",
    localImage: "./images/neurology.jpg"
  }
];

// ==========================================
// 2. FONCTION DE RENDU DYNAMIQUE DE L'INTERFACE CLINIQUE
// ==========================================
function renderMedicalDiseases() {
  const gridContainer = document.getElementById('diseases-grid');
  if (!gridContainer) return;

  // Purge du loader temporaire
  gridContainer.innerHTML = '';

  // Génération des cartes médicales
  MEDICAL_DISEASES_DATA.forEach((disease) => {
    const card = document.createElement('div');
    card.className = "bg-white rounded-3xl overflow-hidden shadow-md shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-slate-100 flex flex-col text-left";
    
    card.innerHTML = `
      <div class="relative h-56 w-full bg-slate-100 overflow-hidden">
        <img src="${disease.localImage}" 
             onerror="this.onerror=null; this.src='${disease.imageUrl}';" 
             alt="${disease.name}" 
             class="w-full h-full object-cover transition duration-500 hover:scale-105">
        <div class="absolute top-4 left-4 bg-sky-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-sm">
          <i class="fa-solid fa-microscope mr-1"></i> Pôle Clinique
        </div>
      </div>
      
      <div class="p-6 flex-grow flex flex-col">
        <h4 class="text-xl font-extrabold text-slate-900 mb-3 leading-snug">${disease.name}</h4>
        <p class="text-slate-600 text-sm font-medium leading-relaxed mb-4">${disease.description}</p>
        
        <div class="mt-auto pt-4 border-t border-slate-50">
          <span class="text-xs font-bold text-slate-400 block mb-2">Cas cliniques pris en charge :</span>
          <div class="flex flex-wrap gap-1.5">
            ${disease.symptoms.map(symptom => `
              <span class="bg-slate-50 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-100">
                <i class="fa-solid fa-check text-emerald-500 mr-1"></i> ${symptom}
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
// 3. ENREGISTREMENT DU SERVICE WORKER MEDICAL
// ==========================================
function registerMedicalServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('🏥 [Doumdeli Medical] SW d\'accès hors-ligne activé avec succès !', reg.scope))
        .catch(err => console.error('⚠️ [Doumdeli Medical] Échec de l\'enregistrement du SW :', err));
    });
  }
}

// Initialisation dès chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  renderMedicalDiseases();
  registerMedicalServiceWorker();
});
