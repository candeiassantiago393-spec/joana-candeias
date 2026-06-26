// Joana Candeias — Website Scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBookingForm();
  initServiceVideos();
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

    const url = buildWhatsAppUrl(text);
    window.open(url, '_blank');
  });
}

const WHATSAPP_NUMBER = '351919872745';

function buildWhatsAppUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
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

// Lazy-load service videos when visible
function initServiceVideos() {
  document.querySelectorAll('.service-video--active').forEach((video) => {
    video.play().catch(() => {});
  });

  const videos = document.querySelectorAll('.service-video[data-src]');
  if (!videos.length) return;

  const loadAndPlay = (video) => {
    if (video.dataset.loaded) return;
    const src = video.dataset.src;
    if (!src) return;

    video.src = src;
    video.dataset.loaded = 'true';
    video.load();
    video.play().catch(() => {});
  };

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          loadAndPlay(video);
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.35 }
  );

  videos.forEach((video) => videoObserver.observe(video));
}

// Smooth reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.hero-content, .section-header, .service-card, .highlight-card, .gallery-item, .professional-image, .professional-content, .booking-info, .booking-form, .footer-grid').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
