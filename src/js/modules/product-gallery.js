import Swiper from 'swiper/bundle';

const togglePaginationVisibility = (swiper, paginationEl) => {
  const activeSlide = swiper.slides[swiper.activeIndex];
  const isVideoSlide = activeSlide && activeSlide.querySelector('.product-gallery__main-video');
  paginationEl.classList.toggle('hidden', !!isVideoSlide);
};

const initializeProductGallery = () => {
  const galleries = document.querySelectorAll('.product-gallery');

  galleries.forEach(gallery => {
    const thumbsEl = gallery.querySelector('.product-gallery__thumbnails');
    const mainEl = gallery.querySelector('.product-gallery__main');
    const paginationEl = gallery.querySelector('.product-gallery__pagination');

    if (!thumbsEl || !mainEl) return;

    const thumbsSlider = new Swiper(thumbsEl, {
      loop: true,
      direction: 'vertical',
      spaceBetween: 8,
      slidesPerView: 4,
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
      zoom: {
        maxRatio: 3,
        minRatio: 1,
      },
    });

    mainSlider.on('slideChangeTransitionStart', () => {
      togglePaginationVisibility(mainSlider, paginationEl);

      mainEl.querySelectorAll('.swiper-slide video').forEach(video => {
        const slide = video.closest('.swiper-slide');
        const slideIndex = Array.from(mainEl.querySelectorAll('.swiper-slide')).indexOf(slide);
        if (slideIndex !== mainSlider.activeIndex && !video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      });
    });

    togglePaginationVisibility(mainSlider, paginationEl);

    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isFullscreen) {
        setTimeout(() => {
          mainEl.querySelectorAll('video').forEach(video => {
            video.blur();
            video.controls = false;
            requestAnimationFrame(() => {
              video.controls = true;
            });
          });

          mainSlider.update();
          mainSlider.touchEventsData.isTouched = false;
          mainSlider.touchEventsData.isMoved = false;

          mainEl.focus({ preventScroll: true });
        }, 300);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        const gallery = mutation.target;
        if (!gallery.classList.contains('swatch-item-active')) {
          gallery.querySelectorAll('.product-gallery__main-video').forEach(video => {
            if (!video.paused) {
              video.pause();
              video.currentTime = 0;
            }
          });
        }
      }
    });
  });

  galleries.forEach(gallery => {
    observer.observe(gallery, { attributes: true, attributeFilter: ['class'] });
  });
};

export default initializeProductGallery;