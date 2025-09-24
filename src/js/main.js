
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const header = $('#site-header');
const nav = $('.nav');
const links = $$('.menu a');
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);


function onScroll() {
  const y = window.scrollY || window.pageYOffset;

  
  header.classList.toggle('shrink', y > 10);

  
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
  nav.style.setProperty('--progress', `${progress * 100}%`);

  
  highlightActive();
}

function highlightActive() {
  const navBottom = nav.getBoundingClientRect().bottom + 1;
  let activeId = sections[0]?.id;

  for (const sec of sections) {
    if (sec.getBoundingClientRect().top <= navBottom) {
      activeId = sec.id;
    }
  }

  
  if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
    activeId = sections.at(-1)?.id;
  }

  links.forEach(a => {
    const isActive = a.dataset.nav === activeId;
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
document.addEventListener('DOMContentLoaded', onScroll);


links.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    const headerH = nav.getBoundingClientRect().height;
    const top = window.scrollY + target.getBoundingClientRect().top - headerH + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});



function initCarousel(root) {
    const track  = root.querySelector('.track');
    const slides = [...root.querySelectorAll('.slide')];
    const prev   = root.querySelector('.prev');
    const next   = root.querySelector('.next');
  
    let index = 0;
  
    function goTo(i) {
      index = (i + slides.length) % slides.length; 
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, idx) => s.setAttribute('aria-hidden', idx !== index));
    }
  
    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));
  
    
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });
  
    
    let isDown = false, startX = 0, dx = 0;
    root.addEventListener('pointerdown', (e) => {
      isDown = true; startX = e.clientX; dx = 0; root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      dx = e.clientX - startX;
    });
    root.addEventListener('pointerup', () => {
      if (!isDown) return;
      isDown = false;
      if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    });
  
    goTo(0);
  }
  
  
  document.querySelectorAll('.carousel').forEach(initCarousel);
  


const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
let lastFocusEl = null;

function openModal() {
  lastFocusEl = document.activeElement;
  modal.hidden = false;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; 
  
  const first = modal.querySelector('[data-close]') || modal;
  setTimeout(() => first.focus(), 0);
}

function closeModal() {
  modal.classList.remove('show');
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusEl) lastFocusEl.focus();
}

openModalBtn?.addEventListener('click', openModal);

modal?.addEventListener('click', (e) => {
  if (e.target.matches('[data-close], .modal-backdrop')) closeModal();
});


document.addEventListener('keydown', (e) => {
  if (!modal.hidden && e.key === 'Escape') closeModal();
});


modal?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const FOCUSABLE = 'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const nodes = [...modal.querySelectorAll(FOCUSABLE)].filter(el => !el.hasAttribute('disabled'));
  if (!nodes.length) return;
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});


const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    const email = (fd.get('email') || '').trim();
    const message = (fd.get('message') || '').trim();

    
    let ok = true;
    ['name','email','message'].forEach(n => form[n].removeAttribute('aria-invalid'));

    if (name.length < 2) { form.name.setAttribute('aria-invalid','true'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.setAttribute('aria-invalid','true'); ok = false; }
    if (message.length < 2) { form.message.setAttribute('aria-invalid','true'); ok = false; }

    if (!ok) return;

    
    const status = document.getElementById('form-status');
    status.hidden = false;
    status.textContent = 'Thanks! Your message is ready in your mail app.';

    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;

    form.reset();
  });
}