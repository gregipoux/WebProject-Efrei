// Active navbar indicator (smooth moving underline) - click only, hover handled by CSS
(function () {
  'use strict';

  function normalizePath(pathname) {
    let p = pathname.replace(/\/+$/, '');
    if (p === '') p = '/';
    return p;
  }

  function getActiveLink(links) {
    const currentPath = normalizePath(window.location.pathname);
    const currentFile = currentPath.split('/').pop();

    let active = null;

    links.forEach((a) => {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');

      const url = new URL(a.getAttribute('href'), window.location.href);
      const linkPath = normalizePath(url.pathname);
      const linkFile = linkPath.split('/').pop();

      const isMatch =
        (currentFile && linkFile === currentFile) ||
        (currentPath === '/' && (linkFile === '' || linkFile === 'index.html'));

      if (isMatch) active = a;
    });

    if (active) {
      active.classList.add('is-active');
      active.setAttribute('aria-current', 'page');
    }

    return active;
  }

  function ensureIndicator(ul) {
    let indicator = ul.querySelector('.nav-indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'nav-indicator';
      ul.appendChild(indicator);
    }
    return indicator;
  }

  function moveIndicator(ul, indicator, targetLink) {
    if (!targetLink) {
      indicator.style.opacity = '0';
      return;
    }

    // Utiliser requestAnimationFrame pour synchroniser avec le rendu
    requestAnimationFrame(() => {
      const ulRect = ul.getBoundingClientRect();
      const linkRect = targetLink.getBoundingClientRect();

      // Récupérer la position actuelle de l'indicateur pour partir de là
      const currentLeft = parseFloat(indicator.style.left) || 0;
      const currentWidth = parseFloat(indicator.style.width) || 20;
      const currentTop = parseFloat(indicator.style.top) || 0;
      
      // Si l'indicateur n'a pas encore de position, utiliser la position du lien actif
      let startLeft = currentLeft;
      let startWidth = currentWidth;
      let startTop = currentTop;
      
      // Si l'indicateur est invisible ou n'a pas de position, trouver le lien actif
      if (indicator.style.opacity === '0' || currentLeft === 0) {
        const activeLink = ul.querySelector('a.is-active');
        if (activeLink) {
          const activeRect = activeLink.getBoundingClientRect();
          const padding = 10;
          startLeft = (activeRect.left - ulRect.left) + padding;
          startWidth = Math.max(8, activeRect.width - padding * 2);
          const gap = 6;
          startTop = (activeRect.bottom - ulRect.top) - gap;
        }
      }

      const padding = 10;
      const targetLeft = (linkRect.left - ulRect.left) + padding;
      const targetWidth = Math.max(8, linkRect.width - padding * 2);
      const gap = 6;
      const targetTop = (linkRect.bottom - ulRect.top) - gap;

      // Définir la position de départ pour l'animation
      indicator.style.left = `${startLeft}px`;
      indicator.style.width = `${startWidth}px`;
      indicator.style.top = `${startTop}px`;
      indicator.style.opacity = '1';

      // Forcer un reflow pour s'assurer que la position de départ est appliquée
      void indicator.offsetHeight;

      // Animer vers la position cible
      requestAnimationFrame(() => {
        indicator.style.left = `${targetLeft}px`;
        indicator.style.width = `${targetWidth}px`;
        indicator.style.top = `${targetTop}px`;
      });
    });
  }

  function initNavIndicator() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    const ul = nav.querySelector('ul');
    if (!ul) return;

    const links = Array.from(ul.querySelectorAll('a[href]'));
    if (!links.length) return;

    const indicator = ensureIndicator(ul);

    // Vérifier si on vient d'une navigation (position sauvegardée)
    const savedPosition = sessionStorage.getItem('nav-indicator-position');
    const activeLink = getActiveLink(links);
    
    if (savedPosition && activeLink) {
      try {
        const pos = JSON.parse(savedPosition);
        // Appliquer directement la position sauvegardée sans animation
        indicator.style.left = `${pos.left}px`;
        indicator.style.width = `${pos.width}px`;
        indicator.style.top = `${pos.top}px`;
        indicator.style.opacity = '1';
        // Nettoyer la position sauvegardée
        sessionStorage.removeItem('nav-indicator-position');
        // Vérifier si la position correspond au lien actif, sinon ajuster sans animation
        requestAnimationFrame(() => {
          const ulRect = ul.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          const padding = 10;
          const expectedLeft = (linkRect.left - ulRect.left) + padding;
          const expectedWidth = Math.max(8, linkRect.width - padding * 2);
          const gap = 6;
          const expectedTop = (linkRect.bottom - ulRect.top) - gap;
          
          // Si la position ne correspond pas exactement, ajuster sans transition
          if (Math.abs(parseFloat(indicator.style.left) - expectedLeft) > 1) {
            indicator.style.transition = 'none';
            indicator.style.left = `${expectedLeft}px`;
            indicator.style.width = `${expectedWidth}px`;
            indicator.style.top = `${expectedTop}px`;
            // Réactiver les transitions après un court délai
            setTimeout(() => {
              indicator.style.transition = '';
            }, 50);
          }
        });
      } catch (e) {
        // En cas d'erreur, continuer avec la position normale
        setTimeout(() => {
          moveIndicator(ul, indicator, activeLink);
        }, 0);
      }
    } else {
      // Position initiale sur la page active (avec délai pour s'assurer que le DOM est rendu)
      setTimeout(() => {
        moveIndicator(ul, indicator, activeLink);
      }, 0);
    }

    links.forEach((a) => {
      a.addEventListener('click', (e) => {
        // liens externes ou ancres → on ne bloque pas
        if (
          a.target === '_blank' ||
          a.href.startsWith('mailto:') ||
          a.href.startsWith('tel:') ||
          a.getAttribute('href').startsWith('#')
        ) {
          return;
        }
    
        // navigation interne → on anime d'abord
        e.preventDefault();
    
        // Marquer le lien comme actif visuellement
        links.forEach(link => link.classList.remove('is-active'));
        a.classList.add('is-active');
    
        // animation vers le nouveau lien (double RAF pour s'assurer du rendu)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            moveIndicator(ul, indicator, a);
            
            // Sauvegarder la position finale avant la navigation
            const TRANSITION_DURATION = 300;
            setTimeout(() => {
              const finalLeft = parseFloat(indicator.style.left) || 0;
              const finalWidth = parseFloat(indicator.style.width) || 20;
              const finalTop = parseFloat(indicator.style.top) || 0;
              
              sessionStorage.setItem('nav-indicator-position', JSON.stringify({
                left: finalLeft,
                width: finalWidth,
                top: finalTop
              }));
              
              window.location.href = a.href;
            }, TRANSITION_DURATION);
          });
        });
      });
  
      // accessibilité clavier
      a.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          moveIndicator(ul, indicator, a);
          setTimeout(() => {
            window.location.href = a.href;
          }, 260);
        }
      });
    });

    // Quand on quitte la nav : retour au lien actif (page courante)
    nav.addEventListener('mouseleave', () => {
      moveIndicator(ul, indicator, ul.querySelector('a.is-active'));
    });

    // Resize/zoom : recalcul position (important) avec debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          moveIndicator(ul, indicator, ul.querySelector('a.is-active'));
        });
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavIndicator);
  } else {
    initNavIndicator();
  }
})();
