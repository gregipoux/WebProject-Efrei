// Scroll reveal animations - only for sections below the fold
(function() {
  'use strict';
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // If reduced motion, make all sections visible immediately
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('visible');
      });
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once visible for performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Only observe sections that are below the initial viewport
    document.querySelectorAll('section:not(#hero-accueil)').forEach(section => {
      const rect = section.getBoundingClientRect();
      // Only add scroll-reveal class if section is below viewport
      if (rect.top > window.innerHeight * 0.8) {
        section.classList.add('scroll-reveal');
        observer.observe(section);
      } else {
        // Sections already in viewport are immediately visible
        section.classList.add('visible');
      }
    });
  }

  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Responsive navigation (burger menu)
(function() {
  'use strict';

  function initNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!navToggle || !mainNav) return;

    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked (mobile UX)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

