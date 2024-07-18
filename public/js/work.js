document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.card-title', direction: 'top' },
    { selector: '.main-head', direction: 'left' },
    { selector: '.art-card', direction: 'bottom' },
  ];

  // Add the .price-item elements with alternating directions initially
  document.querySelectorAll('.price-item').forEach((item, index) => {
    const direction = index % 2 === 0 ? 'left' : 'right';
    elementsToAnimate.push({
      selector: `.price-item:nth-child(${index + 1})`,
      direction,
    });
  });

  const generateConfig = (direction) => {
    let transform;
    switch (direction) {
      case 'left':
        transform = 'translateX(-100px)';
        break;
      case 'right':
        transform = 'translateX(100px)';
        break;
      case 'bottom':
        transform = 'translateY(100px)';
        break;
      case 'top':
        transform = 'translateY(-50px)';
        break;
      default:
        transform = 'translateX(0)';
    }

    return {
      initial: {
        transform,
        opacity: '0',
        transition:
          'transform 1.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      final: {
        transform: 'translateX(0)',
        opacity: '1',
        transition:
          'transform 1.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
    };
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.75],
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const config = JSON.parse(element.dataset.config);
      if (entry.isIntersecting) {
        element.style.transition = config.final.transition;
        element.style.transform = config.final.transform;
        element.style.opacity = config.final.opacity;
      } else if (entry.intersectionRatio < 0.75) {
        element.style.transition = config.initial.transition;
        element.style.transform = config.initial.transform;
        element.style.opacity = config.initial.opacity;
      }
    });
  }, observerOptions);

  function applyAnimations() {
    // Remove observers for all price-items before applying new configurations
    document
      .querySelectorAll('.price-item')
      .forEach((item) => observer.unobserve(item));

    // Apply new configurations based on viewport width
    const viewportWidth = window.innerWidth;
    document.querySelectorAll('.price-item').forEach((item, index) => {
      let direction;
      if (viewportWidth <= 990) {
        direction = 'top';
      } else {
        direction = index % 2 === 0 ? 'left' : 'right';
      }
      const config = generateConfig(direction);
      item.style.transform = config.initial.transform;
      item.style.opacity = config.initial.opacity;
      item.style.transition = config.initial.transition;
      item.dataset.config = JSON.stringify(config);
      observer.observe(item);
    });
  }

  elementsToAnimate.forEach(({ selector, direction }) => {
    const config = generateConfig(direction);
    document.querySelectorAll(selector).forEach((element) => {
      element.style.transform = config.initial.transform;
      element.style.opacity = config.initial.opacity;
      element.style.transition = config.initial.transition;
      element.dataset.config = JSON.stringify(config);
      observer.observe(element);
    });
  });

  function updateImageSources() {
    const images = [
      {
        id: 'price-sheet-0',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-0.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-0.png',
      },
      {
        id: 'price-sheet-1',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-1.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-1.png',
      },
      {
        id: 'price-sheet-2',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-2.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-2.png',
      },
      {
        id: 'price-sheet-3',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-3.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-3.png',
      },
      {
        id: 'price-sheet-4',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-4.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-4.png',
      },
      {
        id: 'price-sheet-5',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-5.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-5.png',
      },
      {
        id: 'price-sheet-6',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-6.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-6.png',
      },
      {
        id: 'price-sheet-7',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-7.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-7.png',
      },
      {
        id: 'price-sheet-8',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-8.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-8.png',
      },
    ];

    const viewportWidth = window.innerWidth;

    images.forEach((image) => {
      const imgElement = document.getElementById(image.id);
      if (viewportWidth <= 990) {
        imgElement.src = image.mobileSrc;
      } else {
        imgElement.src = image.desktopSrc;
      }
    });

    // Re-apply animations based on the updated viewport width
    applyAnimations();
  }

  window.addEventListener('resize', updateImageSources);
  window.addEventListener('load', updateImageSources);
});

var path = window.location.pathname;
if (path === '/work') {
  document.getElementById('pageTitle').innerText = 'Shin Arts - Work';
}
