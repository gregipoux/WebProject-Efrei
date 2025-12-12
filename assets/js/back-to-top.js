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
    button.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      background: var(--efrei-blue, #0055a4);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
      z-index: 1000;
      opacity: 0;
      transform: translateY(20px);
    `;

    // Ajouter le bouton au body
    document.body.appendChild(button);

    // Fonction pour scroller vers le haut
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
    
    // Effet hover
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'var(--efrei-blue-dark, #00366f)';
      button.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'var(--efrei-blue, #0055a4)';
      button.style.transform = 'translateY(0)';
    });

    // Écouter le scroll (avec debounce pour optimiser les performances)
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(handleScroll, 10);
    }, { passive: true });

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
