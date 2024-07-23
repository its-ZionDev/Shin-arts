document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.card-title', direction: 'top' },
    { selector: '.grid-item', direction: 'bottom' },
    { selector: '.pagination-links', direction: 'top' },
  ];

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
        transform = 'translateY(50px)';
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
});
