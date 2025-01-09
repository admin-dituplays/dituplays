import * as skFunctions from './modules/functions.js';

// WebP Checker
skFunctions.isWebp();

// Smooth Scroll
skFunctions.smoothScroll()

// Telegram Bot
import { sendFormData } from './modules/telegramBot.js';
import sendToManager from './modules/orderManager.js';
const formsContainer = document.querySelector('.main');
formsContainer.addEventListener('submit', (e) => {
  e.preventDefault();

  if (e.target.matches('form')) {
    sendFormData(e.target);
    // sendToManager(e.target);
  }
});

// Timer
import { updateTimer } from './modules/timer.js';
updateTimer();