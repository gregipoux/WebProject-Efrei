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

    const ulRect = ul.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const padding = 10;
    const left = (linkRect.left - ulRect.left) + padding;
    const width = Math.max(8, linkRect.width - padding * 2);

    const gap = 6;
    const top = (linkRect.bottom - ulRect.top) - gap;

    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
    indicator.style.top = `${top}px`;
    indicator.style.opacity = '1';
  }

  function initNavIndicator() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    const ul = nav.querySelector('ul');
    if (!ul) return;

    const links = Array.from(ul.querySelectorAll('a[href]'));
    if (!links.length) return;

    const indicator = ensureIndicator(ul);

    // Position initiale sur la page active
    const activeLink = getActiveLink(links);
    moveIndicator(ul, indicator, activeLink);

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
    
        // animation vers le nouveau lien
        moveIndicator(ul, indicator, a);
    
        // délai = durée de la transition CSS
        const TRANSITION_DURATION = 260;
    
        setTimeout(() => {
          window.location.href = a.href;
        }, TRANSITION_DURATION);
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

    // Resize/zoom : recalcul position (important)
    window.addEventListener('resize', () => {
      moveIndicator(ul, indicator, ul.querySelector('a.is-active'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavIndicator);
  } else {
    initNavIndicator();
  }
})();
