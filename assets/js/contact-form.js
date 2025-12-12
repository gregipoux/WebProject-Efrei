// Gestion du formulaire de contact
(function() {
  'use strict';

  // Fonction pour créer et afficher la popup de confirmation
  function showSuccessPopup() {
    // Créer l'overlay (fond sombre)
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.id = 'popup-overlay';

    // Créer la popup
    const popup = document.createElement('div');
    popup.className = 'popup-container';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-icon">✓</div>
        <h3>Message envoyé avec succès !</h3>
        <p>Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
        <button class="popup-close-btn" id="popup-close-btn">Fermer</button>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Animation d'apparition
    setTimeout(() => {
      overlay.classList.add('popup-show');
    }, 10);

    // Fermer la popup quand on clique sur le bouton
    const closeBtn = document.getElementById('popup-close-btn');
    closeBtn.addEventListener('click', () => {
      closePopup(overlay);
    });

    // Fermer la popup quand on clique sur l'overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closePopup(overlay);
      }
    });

    // Fermer avec la touche Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closePopup(overlay);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Fonction pour fermer la popup
  function closePopup(overlay) {
    overlay.classList.remove('popup-show');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  }

  // Fonction pour simuler l'envoi des données
  function simulateSendForm(formData) {
    return new Promise((resolve) => {
      // Simuler un délai d'envoi (comme une requête API)
      setTimeout(() => {
        // Ici, on pourrait normalement envoyer les données à un serveur
        // Pour la simulation, on simule juste un succès
        console.log('Données du formulaire:', {
          nom: formData.get('nom'),
          email: formData.get('email'),
          sujet: formData.get('sujet'),
          message: formData.get('message')
        });
        resolve(true);
      }, 1000); // 1 seconde de simulation
    });
  }

  // Fonction d'initialisation
  function init() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) {
      return; // Le formulaire n'existe pas sur cette page
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Empêcher l'envoi par défaut

      // Récupérer les données du formulaire
      const formData = new FormData(contactForm);

      // Désactiver le bouton de soumission pendant l'envoi
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours...';

      try {
        // Simuler l'envoi des données
        await simulateSendForm(formData);

        // Réinitialiser le formulaire
        contactForm.reset();

        // Afficher la popup de succès
        showSuccessPopup();
      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
