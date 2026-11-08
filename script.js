// Theme toggle — default dark, saved in localStorage
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('rayhan-theme');
if (saved) root.setAttribute('data-theme', saved);
function syncThemeBtn(){ themeBtn.textContent = root.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️'; }
syncThemeBtn();
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('rayhan-theme', next);
  syncThemeBtn();
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Typing animation
const roles = ['Young Entrepreneur', 'Tech Enthusiast', 'Visual Creator'];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;
function type(){
  const word = roles[roleIndex];
  typedEl.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) { charIndex++; setTimeout(type, 75); }
  else if (!deleting) { deleting = true; setTimeout(type, 1600); }
  else if (charIndex > 0) { charIndex--; setTimeout(type, 35); }
  else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 300); }
}
type();

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Gallery slider
const slides = document.getElementById('slides');
const total = slides.children.length;
const dotsWrap = document.getElementById('dots');
let current = 0;
for (let i = 0; i < total; i++) {
  const d = document.createElement('button');
  d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
}
function goTo(i){
  current = (i + total) % total;
  slides.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', j === current));
}
document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
goTo(0);
setInterval(() => goTo(current + 1), 5000);

// Read More — expand article text inline
const articleFull = document.getElementById('articleFull');
document.querySelectorAll('.read-more').forEach(btn => {
  btn.addEventListener('click', () => {
    articleFull.textContent = btn.dataset.full;
    articleFull.hidden = false;
    articleFull.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// Contact form — opens the visitor's email app (no backend needed)
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent('Portfolio message from ' + data.get('name'));
  const body = encodeURIComponent(data.get('message') + '\n\n— ' + data.get('name') + ' (' + data.get('email') + ')');
  document.getElementById('formNote').hidden = false;
  window.location.href = `mailto:hello@rayhan.example?subject=${subject}&body=${body}`;
});
