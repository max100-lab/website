const memories = document.getElementById('memories'),
  photos = [...memories.querySelectorAll('.polaroid')],
  reduced = matchMedia('(prefers-reduced-motion: reduce)');
let queued = false;
function develop() {
  photos.forEach((photo) => {
    const local = Math.max(
        0,
        Math.min(1, (innerHeight * 0.95 - photo.getBoundingClientRect().top) / (innerHeight * 0.4)),
      ),
      ease = local * local * (3 - 2 * local),
      wiggle = Math.sin(local * Math.PI * 5) * (1 - local) * 3;
    photo.style.setProperty('--develop', reduced.matches ? 1 : ease);
    photo.style.setProperty('--wiggle', reduced.matches ? '0deg' : wiggle + 'deg');
    photo.style.setProperty(
      '--lift',
      reduced.matches ? '0px' : -Math.sin(local * Math.PI) * 9 + 'px',
    );
    photo.style.setProperty('--pitch', 3 + Math.sin(local * Math.PI) * 5 + 'deg');
    photo.style.setProperty('--blur', (1 - ease) * 4 + 'px');
    photo.style.setProperty('--saturation', ease);
  });
  queued = false;
}
window.addEventListener(
  'scroll',
  () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(develop);
    }
  },
  { passive: true },
);
window.addEventListener('resize', develop);
reduced.addEventListener('change', develop);
develop();
const band = document.querySelector('.visit-band'),
  toggle = document.getElementById('logos-motion');
toggle.addEventListener('click', () => {
  const paused = band.classList.toggle('paused');
  toggle.textContent = paused ? '▶' : 'Ⅱ';
  toggle.setAttribute('aria-label', paused ? 'Play logo animation' : 'Pause logo animation');
});
