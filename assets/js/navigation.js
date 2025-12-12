// Gestion de la navigation mobile
(function() {
  'use strict';

  function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    if (!navToggle || !mainNav) {
      return; // Les éléments n'existent pas sur cette page
    }

    let scrollPosition = 0;

    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        // Fermer le menu
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
        // Permettre le scroll du body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosition);
      } else {
        // Ouvrir le menu
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        mainNav.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fermer le menu de navigation');
        // Empêcher le scroll du body quand le menu est ouvert sur mobile
        if (window.innerWidth <= 768) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.width = '100%';
        }
      }
    }

    // Écouter le clic sur le bouton toggle
    navToggle.addEventListener('click', toggleMenu);

    // Fermer le menu quand on clique sur un lien (navigation)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // On attend un peu avant de fermer pour que la navigation fonctionne
        setTimeout(() => {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          window.scrollTo(0, scrollPosition);
        }, 100);
      });
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        toggleMenu();
      }
    });

    // Fermer le menu si on clique en dehors (optionnel)
    document.addEventListener('click', (e) => {
      const isClickInsideNav = mainNav.contains(e.target);
      const isClickOnToggle = navToggle.contains(e.target);
      
      if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
        toggleMenu();
      }
    });

    // Gérer le redimensionnement de la fenêtre
    // Si on passe en mode desktop, on ferme le menu
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          window.scrollTo(0, scrollPosition);
        } else if (window.innerWidth <= 768 && mainNav.classList.contains('open')) {
          // Réappliquer le lock du scroll si on revient en mobile avec le menu ouvert
          scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.width = '100%';
        }
      }, 250);
    });
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
