import * as functions from './modules/functions.js';

// WebP Checker
functions.isWebp();

// Smooth Scroll
functions.smoothScroll();


import ColorSwatch from './plugins/colorSwatch.js';

// Initialize the plugin for all containers
document.addEventListener('DOMContentLoaded', () => {
  new ColorSwatch();
});



// import { initCookieBanner } from './plugins/cookieBanner.js';

// document.addEventListener('DOMContentLoaded', () => {
//   initCookieBanner('.cookie-banner', 30);
// });