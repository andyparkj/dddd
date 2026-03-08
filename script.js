// ===== Scroll Animations (Intersection Observer) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation for sibling elements
      const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
      const siblingIndex = Array.from(siblings).indexOf(entry.target);
      const delay = siblingIndex * 100;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
  observer.observe(el);
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';

    if (isOpen) {
      navLinks.style.display = '';
      navActions.style.display = '';
      mobileMenuBtn.classList.remove('active');
    } else {
      navLinks.style.cssText = `
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(9, 9, 11, 0.95);
        backdrop-filter: blur(20px);
        padding: 24px;
        gap: 16px;
        border-bottom: 1px solid var(--border);
      `;
      navActions.style.cssText = `
        display: flex;
        position: absolute;
        top: calc(100% + ${navLinks.offsetHeight}px);
        left: 0;
        right: 0;
        background: rgba(9, 9, 11, 0.95);
        backdrop-filter: blur(20px);
        padding: 0 24px 24px;
        gap: 16px;
        border-bottom: 1px solid var(--border);
      `;
      mobileMenuBtn.classList.add('active');
    }
  });
}

// ===== Pricing Toggle =====
const toggleSwitch = document.querySelector('.toggle-switch');
const toggleLabels = document.querySelectorAll('.toggle-label');
const prices = document.querySelectorAll('.price');

if (toggleSwitch) {
  toggleSwitch.addEventListener('click', () => {
    const currentPeriod = toggleSwitch.dataset.active;
    const newPeriod = currentPeriod === 'monthly' ? 'yearly' : 'monthly';

    toggleSwitch.dataset.active = newPeriod;

    toggleLabels.forEach((label) => {
      label.classList.toggle('active', label.dataset.period === newPeriod);
    });

    prices.forEach((priceEl) => {
      const targetPrice = priceEl.dataset[newPeriod];
      animatePrice(priceEl, parseInt(priceEl.textContent), parseInt(targetPrice));
    });
  });
}

function animatePrice(element, from, to) {
  const duration = 300;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(from + (to - from) * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        navLinks.style.display = '';
        navActions.style.display = '';
      }
    }
  });
});
