const COOKIE_BANNER_STORAGE_KEY = 'cookieConsentGiven';
const HIDE_CLASS = 'cookie-banner_hidden';
const TRACKING_ID = 'G-KXR9BLB1DG'

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const disableTrackingScripts = () => {
  // Google Analytics
  window[`ga-disable-${TRACKING_ID}`] = true;

  // Plerdy
  window._plrdy = window._plrdy || [];
  window._plrdy.push(['optout']);
};

const initCookieBanner = (bannerSelector, daysToHide = 30) => {
  const bannerElement = document.querySelector(bannerSelector);

  if (!bannerElement) {
    return;
  }

  if (getCookie(COOKIE_BANNER_STORAGE_KEY)) {
    bannerElement.classList.add(HIDE_CLASS);
    return;
  }

  const acceptButton = bannerElement.querySelector('.cookie-banner__button_accept');
  const denyButton = bannerElement.querySelector('.cookie-banner__button_deny');

  if (!acceptButton || !denyButton) {
    console.warn('Accept or Deny button not found. Ensure you have elements with class "cookie-banner__button_accept" and "cookie-banner__button_deny".');
    return;
  }

  const hideBanner = () => {
    bannerElement.classList.add(HIDE_CLASS);
  };

  acceptButton.addEventListener('click', () => {
    setCookie(COOKIE_BANNER_STORAGE_KEY, 'true', daysToHide);
    hideBanner();
    // Тут можна ініціалізувати скрипти трекінгу, якщо вони не були ініціалізовані раніше
    // Наприклад, якщо ви використовуєте lazy loading скриптів, то тут їх можна завантажити.
  });

  denyButton.addEventListener('click', () => {
    // Відхилення cookie:

    // 1. Заборона встановлення нових cookie
    disableTrackingScripts();

    setCookie(COOKIE_BANNER_STORAGE_KEY, 'false', daysToHide);
    hideBanner();
  });
};


export { initCookieBanner };