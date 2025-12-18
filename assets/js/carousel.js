// Carrousel d'images pour la section campus
(function() {
  'use strict';

  // Configuration du carrousel
  const config = {
    autoPlay: true,
    autoPlayInterval: 5000, // 5 secondes
    transitionDuration: 800, // millisecondes
    pauseOnHover: true
  };

  function createCarousel() {
    const carouselSection = document.getElementById('carrousel-campus');
    
    if (!carouselSection) {
      return; // La section n'existe pas sur cette page
    }

    // Structure HTML du carrousel
    const carouselHTML = `
      <div class="carousel-container">
        <div class="carousel-wrapper">
          <div class="carousel-track">
            <!-- Les images seront ajoutées ici -->
          </div>
        </div>
        <button class="carousel-btn carousel-btn-prev" aria-label="Image précédente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="carousel-btn carousel-btn-next" aria-label="Image suivante">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <div class="carousel-indicators">
          <!-- Les indicateurs seront ajoutés ici -->
        </div>
      </div>
    `;

    // Liste des images du carrousel
    const images = [
      {
        src: 'assets/img/img1.png',
        alt: 'Vue du campus EFREI - Bâtiment principal'
      },
      {
        src: 'assets/img/img2.png',
        alt: 'Salle informatique du département'
      },
      {
        src: 'assets/img/img3.png',
        alt: 'Espace de vie étudiante'
      },
      {
        src: 'assets/img/img4.png',
        alt: 'Événement hackathon'
      },
      {
        src: 'assets/img/img5.png',
        alt: 'Projets étudiants'
      },
      {
        src: 'assets/img/img6.png',
        alt: 'Campus de Villejuif'
      }
    ];

    // On remplace le contenu de la section
    carouselSection.innerHTML = carouselHTML;

    const carouselTrack = carouselSection.querySelector('.carousel-track');
    const prevBtn = carouselSection.querySelector('.carousel-btn-prev');
    const nextBtn = carouselSection.querySelector('.carousel-btn-next');
    const indicators = carouselSection.querySelector('.carousel-indicators');

    let currentIndex = 0;
    let autoPlayTimer = null;

    // On crée les slides et les indicateurs
    images.forEach((image, index) => {
      // On crée le slide
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      if (index === 0) slide.classList.add('active');
      
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = 'lazy';
      
      slide.appendChild(img);
      carouselTrack.appendChild(slide);

      // On crée l'indicateur
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      if (index === 0) indicator.classList.add('active');
      indicator.setAttribute('aria-label', `Aller à l'image ${index + 1}`);
      indicator.addEventListener('click', () => goToSlide(index));
      indicators.appendChild(indicator);
    });

    // Fonction pour aller à un slide spécifique
    function goToSlide(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;

      const slides = carouselTrack.querySelectorAll('.carousel-slide');
      const indicatorsList = indicators.querySelectorAll('.carousel-indicator');

      // On retire la classe active de tous les slides et indicateurs
      slides.forEach(slide => slide.classList.remove('active'));
      indicatorsList.forEach(ind => ind.classList.remove('active'));

      // On ajoute la classe active au slide et indicateur actuel
      slides[index].classList.add('active');
      indicatorsList[index].classList.add('active');

      currentIndex = index;
      resetAutoPlay();
    }

    // Fonction pour aller au slide suivant
    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    // Fonction pour aller au slide précédent
    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Fonction pour démarrer l'auto-play
    function startAutoPlay() {
      if (config.autoPlay) {
        autoPlayTimer = setInterval(nextSlide, config.autoPlayInterval);
      }
    }

    // Fonction pour arrêter l'auto-play
    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Fonction pour réinitialiser l'auto-play
    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // On écoute les événements des boutons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // On met en pause au survol si configuré
    if (config.pauseOnHover) {
      const carouselContainer = carouselSection.querySelector('.carousel-container');
      carouselContainer.addEventListener('mouseenter', stopAutoPlay);
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Navigation au clavier
    carouselSection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // On démarre l'auto-play
    startAutoPlay();
  }

  // On démarre quand la page est prête
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCarousel);
  } else {
    createCarousel();
  }
})();
