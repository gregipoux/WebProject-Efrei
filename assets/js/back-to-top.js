// Bouton "Retour en haut" (Back to Top)
(function() {
  'use strict';

  function createBackToTopButton() {
    // Créer le bouton
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Retour en haut de la page');
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;

    // Ajouter le bouton au body
    document.body.appendChild(button);

    // Fonction pour scroller vers le haut
    function scrollToTop() {
      // Support pour le smooth scroll avec fallback
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback pour les navigateurs plus anciens
        const scrollStep = -window.scrollY / (500 / 15);
        const scrollInterval = setInterval(function() {
          if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
          } else {
            clearInterval(scrollInterval);
          }
        }, 15);
      }
    }

    // Fonction pour afficher/masquer le bouton selon le scroll
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const threshold = 300; // Afficher après 300px de scroll

      if (scrollY > threshold) {
        button.style.display = 'flex';
        // Animation d'apparition
        setTimeout(() => {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        }, 10);
      } else {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        // Masquer après l'animation
        setTimeout(() => {
          if (window.scrollY <= threshold) {
            button.style.display = 'none';
          }
        }, 300);
      }
    }

    // Événements
    button.addEventListener('click', scrollToTop);

    // Écouter le scroll (avec debounce pour optimiser les performances)
    let scrollTimer = null;
    const scrollOptions = { passive: true };
    
    // Vérifier si passive est supporté
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {
      // Passive non supporté
    }
    
    window.addEventListener('scroll', () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(handleScroll, 10);
    }, supportsPassive ? scrollOptions : false);

    // Vérifier la position initiale
    handleScroll();
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBackToTopButton);
  } else {
    createBackToTopButton();
  }
})();
