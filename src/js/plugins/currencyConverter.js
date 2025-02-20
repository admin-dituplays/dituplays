const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
const CACHE_KEY = 'usdToUahRate';
const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

function formatUAHPrice(price) {
  const formattedPrice = parseFloat(price).toFixed(2);
  // Use toLocaleString for number formatting with 'uk-UA' locale to potentially get space separators, and append ' ₴'
  return new Intl.NumberFormat('uk-UA').format(formattedPrice) + ' ₴';
}

async function getExchangeRate() {
  const cachedData = localStorage.getItem(CACHE_KEY);

  // Return the cached rate if it's still valid
  if (cachedData) {
    const { rate, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY_TIME) {
      return rate;
    }
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates.UAH;

    if (rate) {
      // Store the rate and timestamp in localStorage for caching
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
      return rate;
    } else {
      throw new Error('Failed to retrieve UAH exchange rate from API.');
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback logic can be added here, e.g., return an outdated rate or show an error message
    return null; // Return null in case of error
  }
}

export async function convertCurrency() {
  const rate = await getExchangeRate();

  if (rate === null) {
    console.warn('Failed to get current exchange rate. Currency conversion is not possible.');
    return;
  }

  // Select all elements with the data-usd-price attribute
  const priceElements = document.querySelectorAll('[data-usd-price]');
  if (priceElements.length === 0) {
    return; // Exit the function if no elements are found on the page
  }

  priceElements.forEach(element => {
    const usdPrice = parseFloat(element.dataset.usdPrice); // Get USD price from data-attribute
    if (!isNaN(usdPrice)) {
      const uahPrice = usdPrice * rate;
      // Format the UAH price and set it as the element's text content
      element.textContent = formatUAHPrice(uahPrice);
    } else {
      console.warn('Invalid USD price in data-usd-price attribute:', element);
    }
  });
}