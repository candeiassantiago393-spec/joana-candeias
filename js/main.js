// Joana Candeias — Website Scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBookingForm();
  initServiceLinks();
  setMinDate();
});

// Header scroll effect
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile navigation
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

// Booking form → WhatsApp
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    let text = `Olá Joana! Gostava de marcar uma sessão.\n\n`;
    text += `*Nome:* ${nome}\n`;
    text += `*Serviço:* ${servico}\n`;
    if (data) text += `*Data preferida:* ${formatDate(data)}\n`;
    if (hora) text += `*Hora preferida:* ${hora}\n`;
    if (mensagem) text += `*Mensagem:* ${mensagem}\n`;

    const url = `https://wa.me/351919872745?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}

// Pre-select service from service cards
function initServiceLinks() {
  document.querySelectorAll('.service-link[data-service]').forEach(link => {
    link.addEventListener('click', (e) => {
      const service = link.dataset.service;
      const select = document.getElementById('servico');
      if (!select) return;

      const options = Array.from(select.options);
      const match = options.find(opt =>
        opt.value.toLowerCase().includes(service.toLowerCase().split(' ')[0])
      );
      if (match) select.value = match.value;
    });
  });
}

// Set minimum date to today
function setMinDate() {
  const dateInput = document.getElementById('data');
  if (!dateInput) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Smooth reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.service-card, .highlight-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
