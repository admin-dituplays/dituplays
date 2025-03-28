import * as functions from './modules/functions.js';
import ColorSwatch from './plugins/colorSwatch.js';
import { convertCurrency } from './plugins/currencyConverter.js';
import initializeProductGallery from './modules/product-gallery.js';

document.addEventListener('DOMContentLoaded', () => {
  // WebP Checker
  functions.isWebp();
  
  // Smooth Scroll
  functions.smoothScroll();
  
  convertCurrency();

  new ColorSwatch();

  // Product Page Slider
  initializeProductGallery();

  // Read more toggle
  functions.initCollapsibleSections();
});

import { ProductCatalog } from './modules/catalog.js';

document.addEventListener('DOMContentLoaded', () => {
  const catalog = new ProductCatalog('.catalog__items-container', '/data/products.json');
  catalog.init();
});

// import { initCookieBanner } from './plugins/cookieBanner.js';

// document.addEventListener('DOMContentLoaded', () => {
//   initCookieBanner('.cookie-banner', 30);
// });