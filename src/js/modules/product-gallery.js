import Swiper from 'swiper/bundle';
// import 'swiper/swiper-bundle.css';

function initializeProductGallery() {
  const productGalleries = document.querySelectorAll('.product-gallery');

  productGalleries.forEach(gallery => {
    const thumbsSliderElement = gallery.querySelector('.product-gallery__thumbnails');
    const mainSliderElement = gallery.querySelector('.product-gallery__main');

    if (!thumbsSliderElement || !mainSliderElement) {
      return;
    }

    const isVertical = gallery.classList.contains('product-gallery_vertical');
    const thumbsSliderDirection = isVertical ? 'vertical' : 'horizontal';

    const thumbsSlider = new Swiper(thumbsSliderElement, {
      loop: true,
      direction: thumbsSliderDirection,
      spaceBetween: 8,
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper(mainSliderElement, {
      loop: true,
      spaceBetween: 4,

      navigation: {
        nextEl: gallery.querySelector('.product-gallery__button_next'),
        prevEl: gallery.querySelector('.product-gallery__button_prev'),
      },

      pagination: {
        el: gallery.querySelector('.product-gallery__pagination'),
        clickable: true,
      },
      thumbs: {
        swiper: thumbsSlider,
      },
    });
  });
}

export default initializeProductGallery;