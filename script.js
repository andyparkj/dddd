// ===== Scroll Animations (Intersection Observer) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
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
      if (navActions) navActions.style.display = '';
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
      if (navActions) {
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
      }
      mobileMenuBtn.classList.add('active');
    }
  });
}

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

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
        if (navActions) navActions.style.display = '';
      }
    }
  });
});

// ===== Subscribe Form =====
const subscribeBtn = document.getElementById('subscribe-btn');
const emailInput = document.getElementById('email-input');

if (subscribeBtn && emailInput) {
  subscribeBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailInput.style.borderColor = '#ef4444';
      emailInput.setAttribute('placeholder', '올바른 이메일 주소를 입력하세요');
      setTimeout(() => {
        emailInput.style.borderColor = '';
        emailInput.setAttribute('placeholder', '이메일 주소를 입력하세요');
      }, 2000);
      return;
    }

    // Success feedback
    subscribeBtn.textContent = '구독 완료!';
    subscribeBtn.style.background = '#22c55e';
    emailInput.value = '';
    setTimeout(() => {
      subscribeBtn.innerHTML = '무료로 구독하기 <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      subscribeBtn.style.background = '';
    }, 3000);
  });

  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      subscribeBtn.click();
    }
  });
}
