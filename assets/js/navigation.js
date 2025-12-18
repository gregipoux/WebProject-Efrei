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
    
    requestAnimationFrame(() => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
      
      // Nettoyer tous les styles inline du body
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      
      // S'assurer que le scroll est restauré
      if (window.innerWidth > 768) {
        window.scrollTo(0, 0);
      }
    });

    let scrollPosition = 0;

    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        // On ferme le menu
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
        // On permet le scroll du body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosition);
      } else {
        // On ouvre le menu
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        mainNav.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fermer le menu de navigation');
        // On empêche le scroll du body quand le menu est ouvert sur mobile
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

    // On ferme le menu quand on clique sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // On vérifie si c'est un lien interne
        const href = link.getAttribute('href');
        const isInternalLink = href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:');
        
        if (isInternalLink) {
          // On ferme immédiatement le menu et on restaure le body
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          
          // Si on est en mobile, on restaure aussi le scroll
          if (window.innerWidth <= 768) {
            document.body.style.top = '';
            window.scrollTo(0, 0);
          }
        }
      });
    });

    // On ferme le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        toggleMenu();
      }
    });

    // On ferme le menu si on clique en dehors
    document.addEventListener('click', (e) => {
      const isClickInsideNav = mainNav.contains(e.target);
      const isClickOnToggle = navToggle.contains(e.target);
      
      if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
        toggleMenu();
      }
    });

    // On gère le redimensionnement de la fenêtre
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
          // On réapplique le lock du scroll si on revient en mobile avec le menu ouvert
          scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.width = '100%';
        }
      }, 250);
    });
  }

  // Fonction pour nettoyer complètement l'état
  function cleanupState() {
    const mainNav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (mainNav && navToggle) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }
    
    // Toujours nettoyer les styles du body
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
  }

  // Nettoyer immédiatement au chargement de la page (avant même DOMContentLoaded)
  cleanupState();
  
  // Nettoyer aussi avant le changement de page
  window.addEventListener('beforeunload', cleanupState);
  
  // Nettoyer au chargement complet de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      cleanupState();
      initNavigation();
    });
  } else {
    cleanupState();
    initNavigation();
  }
  
  // Nettoyer aussi après le chargement complet (au cas où)
  window.addEventListener('load', cleanupState);
})();
