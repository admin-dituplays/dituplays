import Swiper from 'swiper/bundle';
// import Swiper, { Navigation, Pagination, Thumbs, Zoom } from 'swiper/bundle';
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
  const galleries = document.querySelectorAll('.product-gallery');

  galleries.forEach(gallery => {
    const thumbsEl = gallery.querySelector('.product-gallery__thumbnails');
    const mainEl = gallery.querySelector('.product-gallery__main');
    const paginationEl = gallery.querySelector('.product-gallery__pagination');

    if (!thumbsEl || !mainEl) return;

    // const isVertical = gallery.classList.contains('product-gallery_vertical');
    // const thumbsDirection = isVertical ? 'vertical' : 'horizontal';

    const thumbsSlider = new Swiper(thumbsEl, {
      loop: true,
      direction: 'vertical',
      spaceBetween: 8,
      // slidesPerView: 'auto',
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const mainSlider = new Swiper(mainEl, {
      loop: true,
      spaceBetween: 4,
      // modules: [Navigation, Pagination, Thumbs, Zoom],
      navigation: {
        nextEl: gallery.querySelector('.product-gallery__button_next'),
        prevEl: gallery.querySelector('.product-gallery__button_prev'),
      },
      pagination: {
        el: paginationEl,
        clickable: false,
      },
      thumbs: { swiper: thumbsSlider },
      zoom: {
        maxRatio: 3,
        minRatio: 1,
      },
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

  // Add MutationObserver to track changes to the active gallery
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        const gallery = mutation.target;
        const isActive = gallery.classList.contains('swatch-item-active');

        if (!isActive) {
          // Stop all videos in an inactive gallery
          const videos = gallery.querySelectorAll('.product-gallery__main-video');
          videos.forEach(video => {
            if (!video.paused) {
              video.pause();
              video.currentTime = 0; // Optional: reset to the beginning
            }
          });
        }
      }
    });
  });

  // Observe all galleries
  galleries.forEach(gallery => {
    observer.observe(gallery, { attributes: true, attributeFilter: ['class'] });
  });
};

export default initializeProductGallery;