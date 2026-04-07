// 1) Hero slider
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
let idx = 0;
let timer = null;

function renderSlide(next) {
  slides[idx].classList.remove('active');
  dots[idx].classList.remove('active');
  idx = next;
  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
}

function startSlider() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => renderSlide((idx + 1) % slides.length), 3500);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    renderSlide(i);
    startSlider();
  });
});
startSlider();

// 2) Scroll reveal animation
const revealEls = [...document.querySelectorAll('.reveal')];
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach(el => observer.observe(el));

// 3) Contact form to backend API
const form = document.querySelector('#contactForm');
const statusEl = document.querySelector('#formStatus');

form?.addEventListener('submit', async e => {
  e.preventDefault();
  statusEl.textContent = '전송 중입니다...';

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name'),
    company: formData.get('company'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.message || '전송에 실패했습니다. 다시 시도해주세요.';
      return;
    }

    statusEl.textContent = '문의가 정상 접수되었습니다. 빠르게 연락드릴게요!';
    form.reset();
  } catch (error) {
    statusEl.textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
});
