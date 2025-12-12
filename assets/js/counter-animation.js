// Animation de compteur pour les chiffres clés
(function() {
  'use strict';

  // Fonction pour formater les nombres (ajouter des espaces pour les milliers)
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Fonction pour extraire le nombre d'un texte
  function extractNumber(text) {
    // Chercher les nombres dans le texte (supporte "≈ 4 600", "16 000+", "100 %", "Près de 90", etc.)
    const match = text.match(/[\d\s]+/);
    if (!match) return null;
    
    // Nettoyer le nombre (enlever les espaces)
    const cleanNumber = match[0].replace(/\s/g, '');
    const number = parseInt(cleanNumber, 10);
    
    // Si c'est "Près de", on retourne le nombre trouvé
    if (text.toLowerCase().includes('près de')) {
      return number;
    }
    
    return number;
  }

  // Fonction pour animer un nombre
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const originalText = element.textContent;
    const hasPlus = originalText.includes('+');
    const hasPercent = originalText.includes('%');
    const hasApprox = originalText.includes('≈');

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fonction d'easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      // Formater le nombre
      let formattedNumber = formatNumber(current);
      
      // Ajouter les symboles si nécessaire
      const hasPresDe = originalText.toLowerCase().includes('près de');
      if (hasPresDe) formattedNumber = 'Près de ' + formattedNumber;
      if (hasApprox) formattedNumber = '≈ ' + formattedNumber;
      if (hasPlus) formattedNumber = formattedNumber + '+';
      if (hasPercent) formattedNumber = formattedNumber + ' %';
      
      element.textContent = formattedNumber;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // S'assurer qu'on arrive exactement au nombre cible
        let finalNumber = formatNumber(target);
        const hasPresDe = originalText.toLowerCase().includes('près de');
        if (hasPresDe) finalNumber = 'Près de ' + finalNumber;
        if (hasApprox) finalNumber = '≈ ' + finalNumber;
        if (hasPlus) finalNumber = finalNumber + '+';
        if (hasPercent) finalNumber = finalNumber + ' %';
        element.textContent = finalNumber;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Fonction pour initialiser les compteurs
  function initCounters() {
    const chiffresSection = document.getElementById('chiffres-cles');
    
    if (!chiffresSection) {
      return; // La section n'existe pas sur cette page
    }

    const listItems = chiffresSection.querySelectorAll('li');
    const counters = [];

    listItems.forEach((li, index) => {
      const strongElement = li.querySelector('strong');
      if (!strongElement) return;

      const originalText = strongElement.textContent;
      const targetNumber = extractNumber(originalText);

      if (targetNumber !== null && targetNumber > 0) {
        // Stocker les informations du compteur
        counters.push({
          element: strongElement,
          target: targetNumber,
          originalText: originalText,
          animated: false
        });
      }
    });

    // Observer pour déclencher l'animation quand la section entre dans le viewport
    if (counters.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animer tous les compteurs avec un petit délai entre chacun
            counters.forEach((counter, index) => {
              if (!counter.animated) {
                setTimeout(() => {
                  animateCounter(counter.element, counter.target, 2000);
                  counter.animated = true;
                }, index * 200); // Délai de 200ms entre chaque compteur
              }
            });
            
            // Arrêter d'observer une fois l'animation déclenchée
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.3 // Déclencher quand 30% de la section est visible
      });

      observer.observe(chiffresSection);
    } else {
      // Fallback si IntersectionObserver n'est pas supporté
      // Animer immédiatement
      counters.forEach((counter, index) => {
        setTimeout(() => {
          animateCounter(counter.element, counter.target, 2000);
        }, index * 200);
      });
    }
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();
