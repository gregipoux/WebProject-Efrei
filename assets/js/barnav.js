// Indicateur de navigation actif
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

    requestAnimationFrame(() => {
      const ulRect = ul.getBoundingClientRect();
      const linkRect = targetLink.getBoundingClientRect();

      // On récupère la position actuelle de l'indicateur
      const currentLeft = parseFloat(indicator.style.left) || 0;
      const currentWidth = parseFloat(indicator.style.width) || 20;
      const currentTop = parseFloat(indicator.style.top) || 0;
      
      // Si l'indicateur n'a pas de position, on utilise celle du lien actif
      let startLeft = currentLeft;
      let startWidth = currentWidth;
      let startTop = currentTop;
      
      // Si l'indicateur est invisible, on trouve le lien actif
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

      // On définit la position de départ pour l'animation
      indicator.style.left = `${startLeft}px`;
      indicator.style.width = `${startWidth}px`;
      indicator.style.top = `${startTop}px`;
      indicator.style.opacity = '1';

      // On force un reflow pour être sûr que ça marche
      void indicator.offsetHeight;

      // On anime vers la position cible
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

    // On vérifie si on vient d'une navigation
    const savedPosition = sessionStorage.getItem('nav-indicator-position');
    const activeLink = getActiveLink(links);
    
    if (savedPosition && activeLink) {
      try {
        const pos = JSON.parse(savedPosition);
        // On applique directement la position sauvegardée
        indicator.style.left = `${pos.left}px`;
        indicator.style.width = `${pos.width}px`;
        indicator.style.top = `${pos.top}px`;
        indicator.style.opacity = '1';
        // On nettoie la position sauvegardée
        sessionStorage.removeItem('nav-indicator-position');
        // On vérifie si la position correspond au lien actif
        requestAnimationFrame(() => {
          const ulRect = ul.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          const padding = 10;
          const expectedLeft = (linkRect.left - ulRect.left) + padding;
          const expectedWidth = Math.max(8, linkRect.width - padding * 2);
          const gap = 6;
          const expectedTop = (linkRect.bottom - ulRect.top) - gap;
          
          // Si ça correspond pas, on ajuste sans transition
          if (Math.abs(parseFloat(indicator.style.left) - expectedLeft) > 1) {
            indicator.style.transition = 'none';
            indicator.style.left = `${expectedLeft}px`;
            indicator.style.width = `${expectedWidth}px`;
            indicator.style.top = `${expectedTop}px`;
            // On réactive les transitions après un petit délai
            setTimeout(() => {
              indicator.style.transition = '';
            }, 50);
          }
        });
      } catch (e) {
        // En cas d'erreur, on continue normalement
        setTimeout(() => {
          moveIndicator(ul, indicator, activeLink);
        }, 0);
      }
    } else {
      // Position initiale sur la page active
      setTimeout(() => {
        moveIndicator(ul, indicator, activeLink);
      }, 0);
    }

    links.forEach((a) => {
      a.addEventListener('click', (e) => {
        if (
          a.target === '_blank' ||
          a.href.startsWith('mailto:') ||
          a.href.startsWith('tel:') ||
          a.getAttribute('href').startsWith('#')
        ) {
          return;
        }
    
        // Navigation interne, on anime d'abord
        e.preventDefault();
    
        // Marquer le lien comme actif visuellement
        links.forEach(link => link.classList.remove('is-active'));
        a.classList.add('is-active');
    
        // On anime vers le nouveau lien
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
  
      // Accessibilité clavier
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

    // On recalcule la position au resize avec debounce
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
