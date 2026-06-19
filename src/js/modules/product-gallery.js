import Swiper from 'swiper/bundle';

const togglePaginationVisibility = (swiper, paginationEl) => {
  const activeSlide = swiper.slides[swiper.activeIndex];
  const isVideoSlide = activeSlide && activeSlide.querySelector('.product-gallery__main-video');
  paginationEl.classList.toggle('hidden', !!isVideoSlide);
};

const primeVideo = (video) => {
  if (video.dataset.primed) return;

  if (video.readyState < 1) {
    video.preload = 'metadata';
    video.load();
  }

  const onReady = () => {
    video.currentTime = 0.01;
    video.dataset.primed = 'true';
    video.removeEventListener('loadedmetadata', onReady);
  };

  if (video.readyState >= 1) {
    video.currentTime = 0.01;
    video.dataset.primed = 'true';
  } else {
    video.addEventListener('loadedmetadata', onReady);
  }
};

const handleFullscreenChange = (mainEl, mainSlider) => {
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
        requestAnimationFrame(() => { video.controls = true; });
      });

      mainSlider.update();
      mainSlider.touchEventsData.isTouched = false;
      mainSlider.touchEventsData.isMoved = false;
      mainEl.focus({ preventScroll: true });
    }, 300);
  }
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

    mainSlider.on('slideChangeTransitionEnd', () => {
      const activeSlide = mainSlider.slides[mainSlider.activeIndex];
      const video = activeSlide && activeSlide.querySelector('video');
      if (video) primeVideo(video);
    });

    const initialSlide = mainSlider.slides[mainSlider.activeIndex];
    const initialVideo = initialSlide && initialSlide.querySelector('video');
    if (initialVideo) primeVideo(initialVideo);

    mainEl.querySelectorAll('video').forEach(video => {
      video.addEventListener('play', () => {
        if (!video.dataset.primed) {
          video.dataset.primed = 'true';
        }
      }, { once: false });

      video.addEventListener('mouseenter', () => primeVideo(video), { once: true });
    });

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          primeVideo(entry.target);
          videoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    mainEl.querySelectorAll('video').forEach(video => videoObserver.observe(video));

    const onFullscreenChange = () => handleFullscreenChange(mainEl, mainSlider);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    togglePaginationVisibility(mainSlider, paginationEl);
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