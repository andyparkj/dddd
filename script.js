const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
let idx = 0;

function render(next) {
  slides[idx].classList.remove('active');
  dots[idx].classList.remove('active');
  idx = next;
  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => render(i));
});

setInterval(() => {
  render((idx + 1) % slides.length);
}, 3500);
