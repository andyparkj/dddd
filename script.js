const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
let idx = 0;
let timer;

function moveSlide(next) {
  slides[idx].classList.remove('active');
  dots[idx].classList.remove('active');
  idx = next;
  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
}

function startSlider() {
  clearInterval(timer);
  timer = setInterval(() => moveSlide((idx + 1) % slides.length), 3400);
}

dots.forEach((dot, i) => dot.addEventListener('click', () => {
  moveSlide(i);
  startSlider();
}));
startSlider();

const revealEls = [...document.querySelectorAll('.reveal')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => observer.observe(el));

const countEls = [...document.querySelectorAll('.count')];
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 28));
    const tick = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(tick);
      }
      el.textContent = current;
    }, 28);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
countEls.forEach((el) => countObserver.observe(el));

const form = document.querySelector('#contactForm');
const statusEl = document.querySelector('#formStatus');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '전송 중입니다...';

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      statusEl.textContent = data.message || '전송 실패. 다시 시도해주세요.';
      return;
    }

    statusEl.textContent = '문의가 접수되었습니다. 빠르게 연락드릴게요!';
    form.reset();
  } catch (error) {
    statusEl.textContent = '네트워크 오류가 발생했습니다.';
  }
});
