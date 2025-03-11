export class ProductCatalog {
  constructor(containerSelector, dataUrl) {
    this.container = document.querySelector(containerSelector);
    this.dataUrl = dataUrl;
    this.products = [];
    this.originalOrder = [];
    this.exchangeRate = 41;
    this.SORT_EXPIRATION_TIME = 30 * 60 * 1000;
  }

  async init() {
    if (!this.container) {
      console.warn('Контейнер для карток товарів не знайдено. Каталог не буде ініціалізовано.');
      return;
    }
    await this.loadProducts();
    this.applySavedSorting();
    this.renderProducts();
    this.initSorting();
  }

  async loadProducts() {
    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.products = await response.json();
      this.originalOrder = [...this.products];
    } catch (error) {
      console.error('Помилка завантаження продуктів:', error);
      this.products = [];
      this.originalOrder = [];
    }
  }

  formatPrice(price, currency) {
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, currency === 'USD' ? ',' : ' ');
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₴`;
  }

  getPriceInUAH(product) {
    const priceObj = product.price;
    return priceObj.currency === 'USD' ? priceObj.value * this.exchangeRate : priceObj.value;
  }

  createProductCard(product) {
    const { price, id, image, alt, title } = product;
    const hasDiscount = typeof price.discountedValue === 'number' && price.discountedValue !== null;
    const originalPrice = this.formatPrice(price.value, price.currency);
    const discountedPrice = hasDiscount ? this.formatPrice(price.discountedValue, price.currency) : null;

    return `
      <div class="catalog__item catalog-card">
        <a href="/${id}/" class="catalog-card__link">
          <div class="catalog-card__image-container">
            <img src="${image}" alt="${alt}" class="catalog-card__image" loading="lazy">
            ${hasDiscount ? `<div class="catalog-card__badge catalog-card__badge_price">${price.discountBadgeText}</div>` : ''}
          </div>
          <h3 class="catalog-card__title">${title}</h3>
        </a>
        <div class="catalog-card__price-container">
          ${hasDiscount
            ? `<span class="catalog-card__price_old">${originalPrice}</span><span class="catalog-card__price catalog-card__price_new">${discountedPrice}</span>`
            : `<span class="catalog-card__price">${originalPrice}</span>`}
        </div>
      </div>
    `.trim();
  }

  renderProducts(productsToRender = this.products) {
    this.container.innerHTML = productsToRender.map(product => this.createProductCard(product)).join('');
  }

  sortProducts(order) {
    const validOrders = ['default', 'asc', 'desc'];
    order = validOrders.includes(order) ? order : 'default';
    if (order === 'default') {
      this.products = [...this.originalOrder];
    } else {
      this.products = [...this.originalOrder].sort((a, b) => {
        const priceA = typeof a.price.discountedValue === 'number' ? a.price.discountedValue : this.getPriceInUAH(a);
        const priceB = typeof b.price.discountedValue === 'number' ? b.price.discountedValue : this.getPriceInUAH(b);
        return order === 'desc' ? priceB - priceA : priceA - priceB;
      });
    }
    this.renderProducts();
  }

  saveSorting(order) {
    const expiration = Date.now() + this.SORT_EXPIRATION_TIME;
    localStorage.setItem('catalogSort', JSON.stringify({
      order,
      expires: expiration
    }));
  }

  getSavedSorting() {
    const saved = localStorage.getItem('catalogSort');
    if (!saved) return 'default';

    const { order, expires } = JSON.parse(saved);
    if (Date.now() > expires) {
      localStorage.removeItem('catalogSort');
      return 'default';
    }
    return order;
  }

  applySavedSorting() {
    this.sortProducts(this.getSavedSorting());
  }

  initSorting() {
    const sortControl = document.querySelector('[data-sort-control]');
    if (!sortControl) {
      console.warn('Елемент сортування [data-sort-control] не знайдено');
      return;
    }

    const selected = sortControl.querySelector('[data-sort-selected]');
    const options = sortControl.querySelector('[data-sort-options]');
    const optionItems = [...options.querySelectorAll('[data-sort-order]')];

    if (!selected || !options) {
      console.warn('Не знайдено [data-sort-selected] або [data-sort-options]');
      return;
    }

    const savedOrder = this.getSavedSorting();
    const savedOption = optionItems.find(item => item.getAttribute('data-sort-order') === savedOrder);
    if (savedOption) {
      selected.textContent = savedOption.textContent;
    }

    const setSelectedOption = (order) => {
      optionItems.forEach(item => item.removeAttribute('data-selected'));
      const selectedOption = optionItems.find(item => item.getAttribute('data-sort-order') === order);
      if (selectedOption) selectedOption.setAttribute('data-selected', 'true');
    };

    setSelectedOption(savedOrder);

    selected.addEventListener('click', () => sortControl.classList.toggle('active'));
    optionItems.forEach(item => {
      item.addEventListener('click', () => {
        const order = item.getAttribute('data-sort-order');
        selected.textContent = item.textContent;
        sortControl.classList.remove('active');
        this.sortProducts(order);
        this.saveSorting(order);
        setSelectedOption(order);
      });
    });

    document.addEventListener('click', (e) => {
      if (!sortControl.contains(e.target)) sortControl.classList.remove('active');
    });
  }
}