(function() {
  'use strict';

  function createBackToTopButton() {
    // On crée le bouton
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Retour en haut de la page');
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;

    // On ajoute le bouton à la page
    document.body.appendChild(button);

    // Fonction pour scroller vers le haut
    function scrollToTop() {
      // On utilise le smooth scroll si disponible
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Sinon on fait un scroll manuel pour les vieux navigateurs
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

    // Fonction pour montrer/cacher le bouton selon le scroll
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const threshold = 300; // On affiche après 300px de scroll

      if (scrollY > threshold) {
        button.style.display = 'flex';
        // On anime l'apparition
        setTimeout(() => {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        }, 10);
      } else {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        // On cache après l'animation
        setTimeout(() => {
          if (window.scrollY <= threshold) {
            button.style.display = 'none';
          }
        }, 300);
      }
    }

    // On écoute les événements
    button.addEventListener('click', scrollToTop);

    // On écoute le scroll
    let scrollTimer = null;
    const scrollOptions = { passive: true };
    
    // On vérifie si passive est supporté
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
      // Passive pas supporté, pas grave
    }
    
    window.addEventListener('scroll', () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(handleScroll, 10);
    }, supportsPassive ? scrollOptions : false);

    // On vérifie la position au démarrage
    handleScroll();
  }

  // On démarre quand la page est prête
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBackToTopButton);
  } else {
    createBackToTopButton();
  }
})();
