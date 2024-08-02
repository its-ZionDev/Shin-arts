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

  document.querySelectorAll('.control-button').forEach((button) => {
    button.addEventListener('click', () => {
      const videoIndex = button.getAttribute('data-video-index');
      const video = document.querySelectorAll('.video-container')[videoIndex - 1];
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
