// Joana Candeias — Website Scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBookingForm();
  initServiceVideos();
  initTestimonialsSlider();
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
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !menu) return;

  const setMenuOpen = (open) => {
    toggle.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (overlay) {
      overlay.classList.toggle('is-visible', open);
      overlay.hidden = !open;
    }
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setMenuOpen(!menu.classList.contains('open'));
  });

  overlay?.addEventListener('click', () => setMenuOpen(false));

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
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

// Testimonials carousel — 2 cards desktop, swipe + arrows
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonialsSlider');
  const track = slider?.querySelector('.testimonials-track');
  const viewport = slider?.querySelector('.testimonials-viewport');
  const prevBtn = slider?.querySelector('.testimonials-arrow--prev');
  const nextBtn = slider?.querySelector('.testimonials-arrow--next');
  const dotsContainer = document.getElementById('testimonialsDots');
  if (!slider || !track || !viewport || !prevBtn || !nextBtn) return;

  const cards = [...track.children];
  let index = 0;
  let dragStartX = 0;
  let dragDelta = 0;
  let isDragging = false;

  const getSlidesPerView = () => (window.innerWidth <= 640 ? 1 : 2);

  const getMaxIndex = () => Math.max(0, cards.length - getSlidesPerView());

  const getStep = () => {
    const card = cards[0];
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return card.offsetWidth + gap;
  };

  const goTo = (nextIndex, animate = true) => {
    index = Math.max(0, Math.min(nextIndex, getMaxIndex()));
    track.classList.toggle('no-transition', !animate);
    track.style.transform = `translateX(-${index * getStep()}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= getMaxIndex();
    dotsContainer?.querySelectorAll('.testimonials-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    if (!animate) {
      requestAnimationFrame(() => track.classList.remove('no-transition'));
    }
  };

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getMaxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonials-dot' + (i === index ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ir para testemunho ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  const onPointerDown = (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragDelta = 0;
    viewport.classList.add('is-dragging');
    track.classList.add('no-transition');
    viewport.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    dragDelta = e.clientX - dragStartX;
    track.style.transform = `translateX(${-index * getStep() + dragDelta}px)`;
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    track.classList.remove('no-transition');
    viewport.releasePointerCapture(e.pointerId);

    const threshold = getStep() * 0.2;
    if (dragDelta < -threshold) goTo(index + 1);
    else if (dragDelta > threshold) goTo(index - 1);
    else goTo(index);
  };

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);

  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(index, getMaxIndex()), false);
  });

  buildDots();
  goTo(0, false);
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

document.querySelectorAll('.hero-content, .section-header, .service-card, .highlight-card, .gallery-item, .professional-image, .professional-content, .testimonial-card, .booking-info, .booking-form, .footer-grid').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
