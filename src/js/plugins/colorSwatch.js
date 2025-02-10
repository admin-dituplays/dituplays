class ColorSwatch {
  constructor() {
    this.colorButtons = document.querySelectorAll('[data-swatch-button]');
    this.activeItemClass = 'swatch-item-active';
    this.activeButtonClass = 'swatch-button-active';

    this.init();
  }

  init() {
    if (this.colorButtons.length === 0) {
      return;
    }

    // Set the first option as active by default
    const firstButton = this.colorButtons[0];
    const firstOption = firstButton.getAttribute('data-swatch-button');
    this.updateItems(firstOption); // Activate the first item
    this.updateActiveButton(firstButton); // Mark the first button as active

    // Add event listeners to color buttons
    this.colorButtons.forEach(button => {
      button.addEventListener('click', () => {
        const option = button.getAttribute('data-swatch-button');
        this.updateItems(option);
        this.updateActiveButton(button);
      });
    });
  }

  updateItems(option) {
    // Update visibility of items based on selected option
    const items = document.querySelectorAll('[data-swatch-item]');

    items.forEach(item => {
      const itemOption = item.getAttribute('data-swatch-item');
      if (itemOption === option) {
        item.classList.add(this.activeItemClass);
      } else {
        item.classList.remove(this.activeItemClass);
      }
    });
  }

  updateActiveButton(activeButton) {
    // Update the active state of the color button
    this.colorButtons.forEach(button => {
      button.classList.remove(this.activeButtonClass);
    });
    activeButton.classList.add(this.activeButtonClass);
  }
}

export default ColorSwatch;