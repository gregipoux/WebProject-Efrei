// Notre petit chatbot pour le département d'info EFREI
(function() {
  'use strict';

  let intents = [];
  let isOpen = false;
  let chatContainer = null;
  let chatButton = null;
  let chatWindow = null;
  let chatMessages = null;
  let chatInput = null;
  let chatSendButton = null;

  // On charge les réponses depuis le fichier JSON
  async function loadIntents() {
    try {
      const response = await fetch('intent.json');
      const data = await response.json();
      intents = data.intents;
    } catch (error) {
      console.error('Erreur lors du chargement des intents:', error);
      // Si ça plante, on met quelques réponses de base pour pas que ça crash
      intents = [
        {
          tag: "greeting",
          patterns: ["bonjour", "salut", "hello"],
          responses: ["Bonjour ! Je suis là pour vous aider concernant le département d'informatique de l'EFREI."]
        },
        {
          tag: "unknown",
          patterns: [],
          responses: ["Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?"]
        }
      ];
    }
  }

  // On calcule à quel point deux phrases se ressemblent
  function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return (longer.length - distance) / longer.length;
  }

  function levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  // On cherche la meilleure réponse à donner
  function findBestResponse(userMessage) {
    if (!intents || intents.length === 0) {
      return "Désolé, les intents ne sont pas encore chargés. Veuillez réessayer dans quelques instants.";
    }

    const normalizedMessage = userMessage.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;
    const threshold = 0.3; // Score minimum pour qu'on considère que c'est une bonne réponse

    // On parcourt tous les intents pour trouver le meilleur match
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const similarity = calculateSimilarity(normalizedMessage, pattern.toLowerCase());
        
        // On vérifie aussi si des mots-clés du pattern sont dans le message
        const patternWords = pattern.toLowerCase().split(/\s+/);
        const messageWords = normalizedMessage.split(/\s+/);
        let keywordMatch = 0;
        
        for (const word of patternWords) {
          if (word.length > 3 && messageWords.some(mw => mw.includes(word) || word.includes(mw))) {
            keywordMatch += 0.2;
          }
        }
        
        const totalScore = similarity + keywordMatch;
        
        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMatch = intent;
        }
      }
    }

    // Si on a rien trouvé de convaincant, on utilise la réponse "je sais pas"
    if (bestScore < threshold) {
      bestMatch = intents.find(intent => intent.tag === "unknown") || intents[0];
    }

    if (bestMatch && bestMatch.responses && bestMatch.responses.length > 0) {
      const randomResponse = bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
      return randomResponse;
    }

    return "Je ne suis pas sûr de comprendre votre question. Pouvez-vous la reformuler ?";
  }

  // On crée toute l'interface du chatbot
  function createChatbot() {
    // Le container principal
    chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot-container';
    chatContainer.className = 'chatbot-container';

    // Le bouton flottant pour ouvrir/fermer le chat
    chatButton = document.createElement('button');
    chatButton.id = 'chatbot-button';
    chatButton.className = 'chatbot-button';
    chatButton.setAttribute('aria-label', 'Ouvrir le chatbot');
    chatButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    chatButton.addEventListener('click', toggleChat);

    // La fenêtre de chat
    chatWindow = document.createElement('div');
    chatWindow.id = 'chatbot-window';
    chatWindow.className = 'chatbot-window';

    // L'en-tête avec le titre et le bouton pour fermer
    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.innerHTML = `
      <div class="chatbot-header-content">
        <h3>Assistant EFREI</h3>
        <p>Département d'informatique</p>
      </div>
      <button class="chatbot-close" aria-label="Fermer le chatbot">×</button>
    `;
    header.querySelector('.chatbot-close').addEventListener('click', toggleChat);

    // La zone où s'affichent les messages
    chatMessages = document.createElement('div');
    chatMessages.id = 'chatbot-messages';
    chatMessages.className = 'chatbot-messages';

    // Le message de bienvenue qu'on affiche au démarrage
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chatbot-message chatbot-message-bot';
    welcomeMessage.innerHTML = `
      <div class="chatbot-message-content">
        <p>Bonjour ! Je suis l'assistant du département d'informatique de l'EFREI. Je peux répondre à vos questions sur nos formations, l'équipe enseignante, les admissions, les débouchés et bien plus encore. Comment puis-je vous aider ?</p>
      </div>
    `;
    chatMessages.appendChild(welcomeMessage);

    // La zone où l'utilisateur tape son message
    const inputContainer = document.createElement('div');
    inputContainer.className = 'chatbot-input-container';

    chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.id = 'chatbot-input';
    chatInput.className = 'chatbot-input';
    chatInput.placeholder = 'Tapez votre message...';
    chatInput.setAttribute('aria-label', 'Message du chatbot');

    chatSendButton = document.createElement('button');
    chatSendButton.className = 'chatbot-send-button';
    chatSendButton.setAttribute('aria-label', 'Envoyer le message');
    chatSendButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

    // Fonction qui gère l'envoi d'un message
    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        addUserMessage(message);
        chatInput.value = '';
        
        // On attend un peu avant de répondre pour que ça fasse plus naturel
        setTimeout(() => {
          const response = findBestResponse(message);
          addBotMessage(response);
        }, 500);
      }
    }

    chatSendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    inputContainer.appendChild(chatInput);
    inputContainer.appendChild(chatSendButton);

    // On assemble tous les éléments ensemble
    chatWindow.appendChild(header);
    chatWindow.appendChild(chatMessages);
    chatWindow.appendChild(inputContainer);

    chatContainer.appendChild(chatButton);
    chatContainer.appendChild(chatWindow);

    document.body.appendChild(chatContainer);
  }

  // On ajoute un message de l'utilisateur dans le chat
  function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message chatbot-message-user';
    messageDiv.innerHTML = `
      <div class="chatbot-message-content">
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // On ajoute un message du bot dans le chat
  function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message chatbot-message-bot';
    messageDiv.innerHTML = `
      <div class="chatbot-message-content">
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // On scroll automatiquement vers le bas pour voir le dernier message
  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // On sécurise le texte pour éviter les injections HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // On ouvre ou ferme la fenêtre de chat
  function toggleChat() {
    isOpen = !isOpen;
    if (chatWindow && chatButton) {
      if (isOpen) {
        chatWindow.classList.add('chatbot-window-open');
        chatButton.classList.add('chatbot-button-open');
        chatButton.setAttribute('aria-label', 'Fermer le chatbot');
        chatInput.focus();
      } else {
        chatWindow.classList.remove('chatbot-window-open');
        chatButton.classList.remove('chatbot-button-open');
        chatButton.setAttribute('aria-label', 'Ouvrir le chatbot');
      }
    }
  }

  // Fonction d'initialisation qui démarre tout le chatbot
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loadIntents().then(() => {
          createChatbot();
        });
      });
    } else {
      loadIntents().then(() => {
        createChatbot();
      });
    }
  }

  init();
})();