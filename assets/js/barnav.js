// Active navbar indicator (smooth moving underline) - click only, hover handled by CSS
(function () {
  'use strict';

  function normalizePath(pathname) {
    let p = pathname.replace(/\/+$/, '');
    if (p === '') p = '/';
    return p;
  }

  function getActiveLink(nav, links) {
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

  function ensureIndicator(nav) {
    let indicator = nav.querySelector('.nav-indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'nav-indicator';
      nav.appendChild(indicator);
    }
    return indicator;
  }

  function moveIndicator(nav, indicator, targetLink) {
    if (!targetLink) {
      indicator.style.opacity = '0';
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const padding = 10;
    const left = (linkRect.left - navRect.left) + padding;
    const width = Math.max(8, linkRect.width - padding * 2);

    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';
  }

  function initNavIndicator() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a[href]'));
    if (!links.length) return;

    const indicator = ensureIndicator(nav);

    // Position initiale sur la page active
    const activeLink = getActiveLink(nav, links);
    moveIndicator(nav, indicator, activeLink);

    // CLICK: la barre glisse vers le lien cliqué
    links.forEach((a) => {
      a.addEventListener('click', () => moveIndicator(nav, indicator, a));

      // Bonus accessibilité : si navigation clavier + Enter/Espace
      a.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          moveIndicator(nav, indicator, a);
        }
      });
    });

    // Quand on quitte la nav : retour au lien actif (page courante)
    nav.addEventListener('mouseleave', () => {
      const currentActive = nav.querySelector('a.is-active');
      moveIndicator(nav, indicator, currentActive);
    });

    // Resize/zoom : recalcul position (important)
    window.addEventListener('resize', () => {
      const currentActive = nav.querySelector('a.is-active');
      moveIndicator(nav, indicator, currentActive);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavIndicator);
  } else {
    initNavIndicator();
  }
})();