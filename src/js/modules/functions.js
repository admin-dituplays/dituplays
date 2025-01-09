// WebP Checker
export function isWebp() {
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

  testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}


// Smooth Scroll

// ! Цей варіант не працює, якщо в посиланні на сторонні ресурси теж є хештег
// export function smoothScroll() {
//   const anchors = document.querySelectorAll('a[href*="#"]')

//   const baseUrl = window.location.origin;
  
//   for (let anchor of anchors) {
//     anchor.addEventListener('click', function (e) {
//       e.preventDefault()
      
//       const blockID = anchor.getAttribute('href').substr(1)
      
//       document.getElementById(blockID).scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       })
//     })
//   }
// }

export function smoothScroll() {
  const anchors = document.querySelectorAll('a[href*="#"]');

  const baseUrl = window.location.origin;

  for (let anchor of anchors) {
    if (
      anchor.hostname === window.location.hostname &&
      (anchor.pathname === window.location.pathname || anchor.pathname === "")
    ) {
      anchor.addEventListener('click', function (e) {
        if (anchor.getAttribute('href').startsWith('#')) {
          e.preventDefault();

          const blockID = anchor.getAttribute('href').substr(1);

          if (document.getElementById(blockID)) {
            document.getElementById(blockID).scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    }
  }
}


// Show more comments button
