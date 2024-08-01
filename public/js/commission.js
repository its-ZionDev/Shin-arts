document.addEventListener('DOMContentLoaded', () => {
  const elementsToAnimate = [
    { selector: '.card-title', direction: 'top' },
    { selector: '.main-head', direction: 'left' },
    { selector: '.art-card', direction: 'bottom' },
    { selector: '.price-item', direction: 'top' },
  ];

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

  const applyAnimations = () => {
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

    elementsToAnimate.forEach(({ selector, direction }) => {
      const config = generateConfig(direction);
      document.querySelectorAll(selector).forEach((element) => {
        Object.assign(element.style, config.initial);
        element.dataset.config = JSON.stringify(config);
        observer.observe(element);
      });
    });
  };

  applyAnimations();

  const updateMediaSources = () => {
    const viewportWidth = window.innerWidth;

    const mediaElements = {
      'price-sheet-9': {
        desktopSrc: '/assets/images/commission_sheet/desktop/Price_Sheet-9.mp4',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-9.mp4',
        type: 'video',
      },
      'price-sheet-10': {
        desktopSrc:
          '/assets/images/commission_sheet/desktop/Price_Sheet-10.mp4',
        mobileSrc: '/assets/images/commission_sheet/mobile/Price_Sheet-10.mp4',
        type: 'video',
      },
    };

    Object.keys(mediaElements).forEach((id) => {
      const media = mediaElements[id];
      const element = document.getElementById(id);
      if (!element) return;

      const newSrc = viewportWidth <= 990 ? media.mobileSrc : media.desktopSrc;

      if (media.type === 'video') {
        const sourceElement = element.querySelector('source');
        if (sourceElement) {
          sourceElement.src = newSrc;
          element.load(); // Reload the video with new source
        }
      }
    });
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  window.addEventListener('resize', debounce(updateMediaSources, 200));
  window.addEventListener('DOMContentLoaded', updateMediaSources);

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

  const path = window.location.pathname;
  if (path === '/work') {
    document.getElementById('pageTitle').innerText = 'Shin Arts - Work';
  }
});
