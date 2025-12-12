// Animation de compteur pour les chiffres clés
(function() {
  'use strict';

  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // ~60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Formater le nombre avec des espaces pour les milliers
      const formatted = Math.floor(current).toLocaleString('fr-FR');
      element.textContent = formatted;
    }, 16);
  }

  function extractNumber(text) {
    // Extraire les nombres du texte (gère les formats comme "≈ 4 600", "16 000+", "100 %", etc.)
    const cleaned = text.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
  }

  function formatNumber(number, originalText) {
    // Conserver le format original (≈, +, %, etc.)
    const formatted = number.toLocaleString('fr-FR');
    
    if (originalText.includes('≈')) {
      return `≈ ${formatted}`;
    }
    if (originalText.includes('+')) {
      return `${formatted}+`;
    }
    if (originalText.includes('%')) {
      return `${formatted} %`;
    }
    if (originalText.includes('Près de')) {
      return `Près de ${formatted}`;
    }
    
    return formatted;
  }

  function initCounters() {
    const chiffresSection = document.getElementById('chiffres-cles');
    
    if (!chiffresSection) {
      return; // La section n'existe pas sur cette page
    }

    const listItems = chiffresSection.querySelectorAll('li');
    
    if (listItems.length === 0) {
      return;
    }

    // Observer pour déclencher l'animation quand la section entre dans le viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animer tous les chiffres
          listItems.forEach((li, index) => {
            const strongElement = li.querySelector('strong');
            if (strongElement && !strongElement.dataset.animated) {
              const originalText = strongElement.textContent;
              const targetNumber = extractNumber(originalText);
              
              if (targetNumber > 0) {
                // Marquer comme animé
                strongElement.dataset.animated = 'true';
                
                // Démarrer l'animation avec un petit délai pour chaque élément
                setTimeout(() => {
                  let current = 0;
                  const duration = 2000;
                  const increment = targetNumber / (duration / 16);
                  
                  const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNumber) {
                      current = targetNumber;
                      clearInterval(timer);
                    }
                    
                    const formatted = formatNumber(Math.floor(current), originalText);
                    strongElement.textContent = formatted;
                  }, 16);
                }, index * 200); // Délai progressif pour chaque élément
              }
            }
          });
          
          // Arrêter d'observer une fois l'animation déclenchée
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3, // Déclencher quand 30% de la section est visible
      rootMargin: '0px 0px -50px 0px' // Déclencher un peu avant
    });

    observer.observe(chiffresSection);
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();
