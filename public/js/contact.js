document.addEventListener('DOMContentLoaded', function () {
  const elementsToAnimate = [
    { selector: '.contact-hero-img', direction: 'right' },
    { selector: '.form-wrapper', direction: 'left' },
    { selector: '.contact-head', direction: 'right' },
    { selector: '.swipe-container', direction: 'bottom' },
    { selector: '.contact-slide-content h1', direction: 'left' },
    { selector: '.contact-slide-content p', direction: 'right' },
    { selector: '.contact-timeline', direction: 'top' },
    { selector: '.main-head', direction: 'left' },
    { selector: '.insta-feed-container', direction: 'top' },
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
        transform = 'translateY(100px)';
        break;
      case 'top':
        transform = 'translateY(-100px)';
        break;
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
        element.style.transform = config.final.transform;
        element.style.opacity = config.final.opacity;
        element.style.transition = config.initial.transition;
      } else if (entry.intersectionRatio < 0.75) {
        element.style.transform = config.initial.transform;
        element.style.opacity = config.initial.opacity;
        element.style.transition = config.initial.transition;
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

const inputs = document.querySelectorAll('.contact-input');
inputs.forEach((ipt) => {
  ipt.addEventListener('focus', () => {
    ipt.parentNode.classList.add('focus');
    ipt.parentNode.classList.add('not-empty');
  });
  ipt.addEventListener('blur', () => {
    if (ipt.value == '') {
      ipt.parentNode.classList.remove('not-empty');
    }
    ipt.parentNode.classList.remove('focus');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const firstNameInput = document.getElementById('fName');
  const lastNameInput = document.getElementById('lName');

  firstNameInput.addEventListener('input', capitalizeAndTrim);
  firstNameInput.addEventListener('blur', capitalizeAndTrim);

  lastNameInput.addEventListener('input', capitalizeAndTrim);
  lastNameInput.addEventListener('blur', capitalizeAndTrim);

  function capitalizeAndTrim(event) {
    const input = event.target;
    let value = input.value;

    // Split the value into words, capitalize each word, and join them back together
    value = value
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');

    // Remove trailing spaces
    value = value.replace(/\s+$/, '');

    input.value = value;
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  const emailInput = document.getElementById('email');
  const form = document.getElementById('contactForm');

  // Function to validate email with specific allowed domains
  function validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      return false;
    }

    // Split the email into username and domain
    const [username, domain] = email.split('@');

    // List of allowed domains
    const allowedDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'icloud.com', // Add more domains as needed
    ];

    // Check if the domain is in the list of allowed domains
    return allowedDomains.includes(domain);
  }

  // Function to update UI based on validation
  function updateUI(isValid) {
    const emailIcon = document
      .querySelector('#email')
      .parentNode.querySelector('.contact-icon');

    if (isValid) {
      emailInput.classList.remove('invalid');
      emailInput.style.borderColor = ''; // Reset to default
      emailInput.nextElementSibling.style.color = ''; // Reset label color
      emailIcon.style.color = ''; // Reset icon color
    } else {
      emailInput.classList.add('invalid');
      emailInput.style.borderColor = 'red';
      emailInput.nextElementSibling.style.color = 'red';
      emailIcon.style.color = 'red'; // Change icon color to red
    }
  }

  // Event listener for email input
  emailInput.addEventListener('input', () => {
    const isValid = validateEmail(emailInput.value);
    updateUI(isValid);
  });

  // Event listener for email input losing focus
  emailInput.addEventListener('blur', () => {
    if (emailInput.value === '') {
      updateUI(true); // Reset to default state if input is empty
    }
  });

  // Prevent form submission if email is invalid
  form.addEventListener('submit', (e) => {
    const isValid = validateEmail(emailInput.value);
    if (!isValid) {
      e.preventDefault(); // Stop form submission
      updateUI(false);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');

  fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
      uploadButton.classList.add('uploaded');
    } else {
      uploadButton.classList.remove('uploaded');
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  const formSubmitMessage = document.getElementById('formSubmitMessage');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    fetch('/contact/message', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showMessage(data.message, 'success');
        } else {
          showMessage(data.message, 'error');
        }
        contactForm.reset();
      })
      .catch((error) => {
        showMessage('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
      });
  });

  function showMessage(message, type) {
    const messageElement = formSubmitMessage.querySelector('p');
    messageElement.textContent = message;
    formSubmitMessage.classList.remove('hide');
    formSubmitMessage.classList.add('show');

    setTimeout(() => {
      formSubmitMessage.classList.remove('show');
      formSubmitMessage.classList.add('hide');
    }, 5000);
  }
});

var path = window.location.pathname;
if (path === '/contact') {
  document.getElementById('pageTitle').innerText = 'Shin Arts - Contact';
}
