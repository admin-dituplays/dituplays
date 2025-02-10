import * as functions from './modules/functions.js';

// WebP Checker
functions.isWebp();

// Smooth Scroll
functions.smoothScroll()




import ColorSwatch from './plugins/colorSwatch.js';

// Initialize the plugin for all containers
document.addEventListener('DOMContentLoaded', () => {
  new ColorSwatch();
});



// app.js
import { initCookieBanner } from './plugins/cookieBanner.js';

document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner('.cookie-banner', 30); // Ініціалізуємо банер, ховаємо на 30 днів
});