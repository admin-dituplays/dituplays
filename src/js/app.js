import * as functions from './modules/functions.js';
import ColorSwatch from './plugins/colorSwatch.js';
import { convertCurrency } from './plugins/currencyConverter.js';

document.addEventListener('DOMContentLoaded', () => {
  // WebP Checker
  functions.isWebp();

  // Smooth Scroll
  functions.smoothScroll();

  new ColorSwatch();

  convertCurrency();
});



// import { initCookieBanner } from './plugins/cookieBanner.js';

// document.addEventListener('DOMContentLoaded', () => {
//   initCookieBanner('.cookie-banner', 30);
// });