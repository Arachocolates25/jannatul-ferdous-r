// ===== RAYHAN PORTFOLIO — HIGH-END JS v2 =====
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;

// Preloader
window.addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('done'), 500));
setTimeout(() => $('#preloader').classList.add('done'), 2600); // safety

// Theme toggle — default dark, saved
const themeBtn = $('#themeToggle');
const saved = localStorage.getItem('rayhan-theme');
if (saved) root.setAttribute('data-theme', saved);
const syncTheme = () => themeBtn.textContent = root.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️';
syncTheme();
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('rayhan-theme', next);
  syncTheme();
  showToast(next === 'dark' ? 'Dark mode on 🌙' : 'Light mode on ☀️');
});

// Header shrink + scroll progress + back-to-top
const header = $('.site-header'), progress = $('#progressBar'), backBtn = $('#backToTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 10);
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  backBtn.classList.toggle('show', y > 600);
}, { passive: true });
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile menu
const menuBtn = $('#menuBtn'), nav = $('#nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
$$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Toast
let toastTimer;
function showToast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// Typing animation
const roles = ['Young Entrepreneur', 'Tech Enthusiast', 'Visual Creator', 'Colour Grader'];
const typedEl = $('#typed');
let roleIndex = 0, charIndex = 0, deleting = false;
(function type(){
  const word = roles[roleIndex];
  typedEl.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) { charIndex++; setTimeout(type, 75); }
  else if (!deleting) { deleting = true; setTimeout(type, 1700); }
  else if (charIndex > 0) { charIndex--; setTimeout(type, 32); }
  else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 320); }
})();

// Particle canvas in hero
const canvas = $('#particles'), ctx = canvas.getContext('2d');
let particles = [], W, H;
function resizeCanvas(){
  W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight;
  particles = Array.from({ length: Math.min(70, W / 18) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + .6, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
    gold: Math.random() > .75,
  }));
}
resizeCanvas(); window.addEventListener('resize', resizeCanvas);
(function drawParticles(){
  ctx.clearRect(0, 0, W, H);
  for (const p of particles){
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.gold ? 'rgba(245,197,66,.85)' : 'rgba(56,189,248,.75)'; ctx.fill();
  }
  requestAnimationFrame(drawParticles);
})();

// Custom cursor glow (desktop only)
const dot = $('#cursorDot'), ring = $('#cursorRing');
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function moveRing(){
  rx += (mx - rx) * .16; ry += (my - ry) * .16;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(moveRing);
})();
$$('a, button, input, textarea, .slides figure').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

// Magnetic buttons
$$('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .18}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// 3D tilt cards
$$('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// Scroll reveal + skill bars + counters
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    $$('.bar i', e.target).forEach(b => b.classList.add('filled'));
    $$('.count', e.target).forEach(runCounter);
    if (e.target.classList.contains('skills-grid') || e.target.closest('#skills')) $$('.bar i').forEach(b => b.classList.add('filled'));
    io.unobserve(e.target);
  });
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));
$$('.bar i').forEach(b => io.observe(b.closest('.card') || b));
function runCounter(el){
  if (el.dataset.done) return; el.dataset.done = '1';
  const target = +el.dataset.count, start = performance.now();
  (function tick(now){
    const p = Math.min((now - start) / 1200, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// Active nav highlighting
const sections = ['home', 'about', 'ventures', 'skills', 'gallery', 'contact'];
const navLinks = $$('#nav a');
const navIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(id => { const s = document.getElementById(id); if (s) navIO.observe(s); });

// Gallery slider + filter + lightbox
const slides = $('#slides'), total = slides.children.length, dotsWrap = $('#dots');
let current = 0, autoTimer;
for (let i = 0; i < total; i++){
  const d = document.createElement('button');
  d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  d.addEventListener('click', () => { goTo(i); restartAuto(); });
  dotsWrap.appendChild(d);
}
function goTo(i){
  current = (i + total) % total;
  slides.style.transform = `translateX(-${current * 100}%)`;
  $$('button', dotsWrap).forEach((b, j) => b.classList.toggle('active', j === current));
}
function restartAuto(){ clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5000); }
$('#prevBtn').addEventListener('click', () => { goTo(current - 1); restartAuto(); });
$('#nextBtn').addEventListener('click', () => { goTo(current + 1); restartAuto(); });
goTo(0); restartAuto();
// touch swipe
let touchX = null;
slides.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive: true });
slides.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  touchX = null; restartAuto();
}, { passive: true });

// Filter
$$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  const figs = $$('#slides figure');
  const visible = figs.filter(fig => f === 'all' || fig.dataset.cat === f);
  figs.forEach(fig => fig.style.display = (f === 'all' || fig.dataset.cat === f) ? '' : 'none');
  // jump to first visible slide
  const idx = figs.indexOf(visible[0]);
  if (idx >= 0) goTo(idx);
  showToast(f === 'all' ? 'Showing all work' : 'Filtered: ' + btn.textContent);
}));

// Lightbox
const lightbox = $('#lightbox'), lbImg = $('#lightboxImg'), lbCap = $('#lightboxCap');
$$('#slides figure').forEach(fig => fig.addEventListener('click', () => {
  const img = $('img', fig);
  lbImg.src = img.dataset.full || img.src;
  lbCap.textContent = $('figcaption', fig).textContent;
  lightbox.hidden = false;
}));
const closeLb = () => lightbox.hidden = true;
$('#lightboxClose').addEventListener('click', closeLb);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// Before / After compare — keep before image aligned to the full box width
const compareRange = $('#compareRange'), compareBefore = $('#compareBefore'), compareBox = $('#compareBox');
function syncCompareWidth(){
  const img = $('img', compareBefore);
  if (img) img.style.width = compareBox.offsetWidth + 'px';
}
syncCompareWidth(); window.addEventListener('resize', syncCompareWidth);
compareRange.addEventListener('input', () => compareBefore.style.width = compareRange.value + '%');

// Read More — expand article text inline
const articleFull = $('#articleFull');
$$('.read-more').forEach(btn => btn.addEventListener('click', () => {
  articleFull.textContent = btn.dataset.full;
  articleFull.hidden = false;
  articleFull.scrollIntoView({ behavior: 'smooth', block: 'center' });
}));

// Contact form — validate, then open email app
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target, err = $('#formError');
  const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
  const bad = [];
  if (name.length < 2) bad.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push('email');
  if (msg.length < 10) bad.push('message (at least 10 characters)');
  $$('input, textarea', form).forEach(i => i.classList.toggle('invalid', bad.some(b => b.startsWith(i.name))));
  if (bad.length){
    err.textContent = 'Please fix: ' + bad.join(', ') + '.';
    err.hidden = false; return;
  }
  err.hidden = true;
  $('#formNote').hidden = false;
  showToast('Thanks ' + name.split(' ')[0] + '! Opening your email app…');
  const subject = encodeURIComponent('Portfolio message from ' + name);
  const body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
  window.location.href = `mailto:hello@rayhan.example?subject=${subject}&body=${body}`;
});
