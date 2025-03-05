export class ProductCatalog {
  constructor(containerSelector, dataUrl) {
    this.container = document.querySelector(containerSelector);
    this.dataUrl = dataUrl;
    this.products = [];
    this.originalOrder = [];
    this.exchangeRate = 41; // Фіксований курс
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
      this.products = await response.json();
      this.originalOrder = [...this.products];
    } catch (error) {
      console.error('Помилка завантаження продуктів:', error);
    }
  }

  formatPrice(price, currency) {
    // Перетворюємо число в рядок із роздільниками
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, currency === 'USD' ? ',' : ' ');
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₴`;
  }

  getPriceInUAH(product) {
    const priceObj = product.price;
    return priceObj.currency === 'USD'
      ? priceObj.value * this.exchangeRate
      : priceObj.value;
  }

  createProductCard(product) {
    const priceObj = product.price;
    const hasDiscount = 'discountedValue' in priceObj;
    const originalPrice = this.formatPrice(priceObj.value, priceObj.currency);
    const discountedPrice = hasDiscount ? this.formatPrice(priceObj.discountedValue, priceObj.currency) : null;

    return `
      <div class="catalog__item catalog-card">
        <a href="/${product.id}/" class="catalog-card__link">
          <div class="catalog-card__image-container">
            <img src="${product.image}" alt="${product.alt}" class="catalog-card__image" loading="lazy">
            ${hasDiscount ? `<div class="catalog-card__badge catalog-card__badge_price">${priceObj.discountBadgeText}</div>` : ''}
          </div>
          <h3 class="catalog-card__title">${product.title}</h3>
        </a>
        <div class="catalog-card__price-container">
          ${hasDiscount
            ? `<span class="catalog-card__price-new">${discountedPrice}</span>
               <span class="catalog-card__price catalog-card__price_old">${originalPrice}</span>`
            : `<span class="catalog-card__price">${originalPrice}</span>`}
        </div>
      </div>
    `;
  }

  renderProducts(productsToRender = this.products) {
    this.container.innerHTML = productsToRender
      .map(product => this.createProductCard(product))
      .join('');
  }

  sortProducts(order) {
    this.products = [...this.originalOrder];
    if (order && order !== 'default') {
      this.products.sort((a, b) => {
        const priceA = 'discountedValue' in a.price ? a.price.discountedValue : this.getPriceInUAH(a);
        const priceB = 'discountedValue' in b.price ? b.price.discountedValue : this.getPriceInUAH(b);
        return order === 'desc' ? priceB - priceA : priceA - priceB;
      });
    }
    this.renderProducts();
  }

  saveSorting(order) {
    const expiration = Date.now() + 30 * 60 * 1000; // 30 хвилин
    localStorage.setItem('catalogSort', JSON.stringify({
      order,
      expires: expiration
    }));
  }

  getSavedSorting() {
    const saved = localStorage.getItem('catalogSort');
    if (!saved) return null;

    const { order, expires } = JSON.parse(saved);
    if (Date.now() > expires) {
      localStorage.removeItem('catalogSort');
      return null;
    }
    return order;
  }

  applySavedSorting() {
    const savedOrder = this.getSavedSorting();
    if (savedOrder) {
      this.sortProducts(savedOrder);
    }
  }

  initSorting() {
    const sortControl = document.querySelector('[data-sort-control]');
    if (!sortControl) {
      console.warn('Елемент сортування [data-sort-control] не знайдено');
      return;
    }

    const selected = sortControl.querySelector('[data-sort-selected]');
    const options = sortControl.querySelector('[data-sort-options]');
    const optionItems = options.querySelectorAll('[data-sort-order]');

    if (!selected || !options) {
      console.warn('Не знайдено [data-sort-selected] або [data-sort-options]');
      return;
    }

    const savedOrder = this.getSavedSorting();
    if (savedOrder) {
      const savedOption = Array.from(optionItems).find(item => item.getAttribute('data-sort-order') === savedOrder);
      if (savedOption) selected.textContent = savedOption.textContent;
    }

    selected.addEventListener('click', () => {
      options.classList.toggle('active');
    });

    optionItems.forEach(item => {
      item.addEventListener('click', () => {
        const order = item.getAttribute('data-sort-order');
        selected.textContent = item.textContent;
        options.classList.remove('active');
        this.sortProducts(order);
        this.saveSorting(order);
      });
    });
  }
}