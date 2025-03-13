import Swiper from 'swiper/bundle';
// import 'swiper/swiper-bundle.css';

const togglePaginationVisibility = (swiper, paginationEl) => {
  const activeSlide = swiper.slides[swiper.activeIndex];
  const isVideoSlide = activeSlide && activeSlide.querySelector('.product-gallery__main-video');

  if (isVideoSlide) {
    paginationEl.classList.add('hidden');
  } else {
    paginationEl.classList.remove('hidden');
  }
};

const initializeProductGallery = () => {
  document.querySelectorAll('.product-gallery').forEach(gallery => {
    const thumbsEl = gallery.querySelector('.product-gallery__thumbnails');
    const mainEl = gallery.querySelector('.product-gallery__main');
    const paginationEl = gallery.querySelector('.product-gallery__pagination');

    if (!thumbsEl || !mainEl) return;

    const isVertical = gallery.classList.contains('product-gallery_vertical');
    const thumbsDirection = isVertical ? 'vertical' : 'horizontal';

    const thumbsSlider = new Swiper(thumbsEl, {
      loop: true,
      direction: thumbsDirection,
      spaceBetween: 8,
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
    });

    const mainSlider = new Swiper(mainEl, {
      loop: true,
      spaceBetween: 4,
      navigation: {
        nextEl: gallery.querySelector('.product-gallery__button_next'),
        prevEl: gallery.querySelector('.product-gallery__button_prev'),
      },
      pagination: {
        el: paginationEl,
        clickable: false,
      },
      thumbs: { swiper: thumbsSlider },
    });

    mainSlider.on('slideChangeTransitionStart', () => {
      togglePaginationVisibility(mainSlider, paginationEl);

      mainEl.querySelectorAll('.swiper-slide video').forEach((video, index) => {
        const slideIndex = Array.from(mainEl.querySelectorAll('.swiper-slide')).indexOf(video.closest('.swiper-slide'));
        if (slideIndex !== mainSlider.activeIndex && !video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      });
    });

    togglePaginationVisibility(mainSlider, paginationEl);
  });
};

export default initializeProductGallery;