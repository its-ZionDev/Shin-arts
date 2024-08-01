document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.card-title', direction: 'top' },
    { selector: '.main-head', direction: 'left' },
    { selector: '.art-card', direction: 'bottom' },
  ];

  document.querySelectorAll('.price-item').forEach((item, index) => {
    const direction = index % 2 === 0 ? 'left' : 'right';
    elementsToAnimate.push({
      selector: `.price-item:nth-child(${index + 1})`,
      direction,
    });
  });

  const generateConfig = (direction) => {
    const transformMap = {
      left: 'translateX(-100px)',
      right: 'translateX(100px)',
      bottom: 'translateY(50px)',
      top: 'translateY(-50px)',
    };

    return {
      initial: {
        transform: transformMap[direction] || 'translateX(0)',
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
        Object.assign(element.style, config.final);
      } else if (entry.intersectionRatio < 0.75) {
        Object.assign(element.style, config.initial);
      }
    });
  }, observerOptions);

  function applyAnimations() {
    document
      .querySelectorAll('.price-item')
      .forEach((item) => observer.unobserve(item));

    const viewportWidth = window.innerWidth;
    document.querySelectorAll('.price-item').forEach((item, index) => {
      const direction =
        viewportWidth <= 990 ? 'top' : index % 2 === 0 ? 'left' : 'right';
      const config = generateConfig(direction);
      Object.assign(item.style, config.initial);
      item.dataset.config = JSON.stringify(config);
      observer.observe(item);
    });
  }

  elementsToAnimate.forEach(({ selector, direction }) => {
    const config = generateConfig(direction);
    document.querySelectorAll(selector).forEach((element) => {
      Object.assign(element.style, config.initial);
      element.dataset.config = JSON.stringify(config);
      observer.observe(element);
    });
  });

  function updateMediaSources() {
    const mediaElements = [
      {
        id: 'price-sheet-0',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-0.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-0.png',
        type: 'img',
      },
      {
        id: 'price-sheet-1',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-1.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-1.png',
        type: 'img',
      },
      {
        id: 'price-sheet-2',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-2.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-2.png',
        type: 'img',
      },
      {
        id: 'price-sheet-3',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-3.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-3.png',
        type: 'img',
      },
      {
        id: 'price-sheet-4',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-4.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-4.png',
        type: 'img',
      },
      {
        id: 'price-sheet-5',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-5.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-5.png',
        type: 'img',
      },
      {
        id: 'price-sheet-6',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-6.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-6.png',
        type: 'img',
      },
      {
        id: 'price-sheet-7',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-7.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-7.png',
        type: 'img',
      },
      {
        id: 'price-sheet-8',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-8.png',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-8.png',
        type: 'img',
      },
      {
        id: 'price-sheet-9',
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-9.mp4',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-9.mp4',
        type: 'video',
      },
      {
        id: 'price-sheet-10',
        desktopSrc:
          '/assets/images/commission_sheet/desktop/Price_Sheet-10.mp4',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-10.mp4',
        type: 'video',
      },
    ];

    const viewportWidth = window.innerWidth;

    mediaElements.forEach((media) => {
      const element = document.getElementById(media.id);
      if (!element) return;

      const newSrc = viewportWidth <= 990 ? media.mobileSrc : media.desktopSrc;

      if (media.type === 'img') {
        element.src = newSrc;
      } else if (
        media.type === 'video' &&
        element.tagName.toLowerCase() === 'video'
      ) {
        const sourceElement = element.querySelector('source');
        if (sourceElement) {
          sourceElement.src = newSrc;
          element.load();
        }
      }
    });
  }

  window.addEventListener('resize', updateMediaSources);
  window.addEventListener('resize', applyAnimations);
  window.addEventListener('DOMContentLoaded', () => {
    updateMediaSources();
    applyAnimations();
  });
});

document.querySelectorAll('.control-button').forEach((button) => {
  button.addEventListener('click', () => {
    const videoIndex = button.getAttribute('data-video-index');
    const video = document.querySelectorAll('.myVideo')[videoIndex - 1];
    const muteIcon = button.querySelector('.muteIcon');
    const unmuteIcon = button.querySelector('.unmuteIcon');

    if (video.muted) {
      video.muted = false;
      muteIcon.style.display = 'none';
      unmuteIcon.style.display = 'inline';
    } else {
      video.muted = true;
      muteIcon.style.display = 'inline';
      unmuteIcon.style.display = 'none';
    }
  });
});

var path = window.location.pathname;
if (path === '/work') {
  document.getElementById('pageTitle').innerText = 'Shin Arts - Work';
}
