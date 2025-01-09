export const gallerySwiper = new Swiper('.gallery__slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 2,
  slidesPerView: 2,

  autoplay: {
    delay: 3000,
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
});

export const reviewsSwiper = new Swiper('.reviews__slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 30,

  autoplay: {
    delay: 5000,
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
});