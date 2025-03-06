export class ProductCatalog {
  constructor(containerSelector, dataUrl) {
    this.container = document.querySelector(containerSelector);
    this.dataUrl = dataUrl;
    this.products = [];
    this.originalOrder = [];
    this.exchangeRate = 41;
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
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, currency === 'USD' ? ',' : ' ');
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₴`;
  }

  getPriceInUAH(product) {
    const priceObj = product.price;
    return priceObj.currency === 'USD' ? priceObj.value * this.exchangeRate : priceObj.value;
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
    this.container.innerHTML = productsToRender.map(product => this.createProductCard(product)).join('');
  }

  sortProducts(order) {
    if (order === 'default') {
      this.products = [...this.originalOrder];
    } else {
      this.products = [...this.originalOrder].sort((a, b) => {
        const priceA = 'discountedValue' in a.price ? a.price.discountedValue : this.getPriceInUAH(a);
        const priceB = 'discountedValue' in b.price ? b.price.discountedValue : this.getPriceInUAH(b);
        return order === 'desc' ? priceB - priceA : priceA - priceB;
      });
    }
    this.renderProducts();
  }

  saveSorting(order) {
    const expiration = Date.now() + 30 * 60 * 1000;
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
    const savedOrder = this.getSavedSorting();
    this.sortProducts(savedOrder);
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
    const savedOption = Array.from(optionItems).find(
      item => item.getAttribute('data-sort-order') === savedOrder
    );
    selected.textContent = savedOption ? savedOption.textContent : 'Популярні моделі';

    selected.addEventListener('click', () => {
      sortControl.classList.toggle('active');
    });

    optionItems.forEach(item => {
      item.addEventListener('click', () => {
        const order = item.getAttribute('data-sort-order');
        selected.textContent = item.textContent;
        sortControl.classList.remove('active');
        this.sortProducts(order);
        this.saveSorting(order);
      });
    });

    document.addEventListener('click', (e) => {
      if (!sortControl.contains(e.target)) {
        sortControl.classList.remove('active');
      }
    });
  }
}