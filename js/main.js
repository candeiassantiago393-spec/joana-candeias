// Joana Candeias — Website Scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBookingForm();
  initServiceVideos();
  initTestimonialsSlider();
  initInspirationAlbums();
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

const INSPIRATION_ALBUMS = {
  retiro: {
    title: 'Retiro',
    images: [
      { type: 'image', src: 'assets/gallery/retiros/retiro-01.jpg', alt: 'Retiro — foto 1' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-02.jpg', alt: 'Retiro — foto 2' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-03.jpg', alt: 'Retiro — foto 3' },
      { type: 'video', src: 'assets/gallery/retiros/retiro-01.mp4', alt: 'Retiro — vídeo 1' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-04.jpg', alt: 'Retiro — foto 4' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-05.jpg', alt: 'Retiro — foto 5' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-06.jpg', alt: 'Retiro — foto 6' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-07.jpg', alt: 'Retiro — foto 7' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-08.jpg', alt: 'Retiro — foto 8' },
      { type: 'video', src: 'assets/gallery/retiros/retiro-02.mp4', alt: 'Retiro — vídeo 2' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-09.jpg', alt: 'Retiro — foto 9' },
      { type: 'image', src: 'assets/gallery/retiros/retiro-10.jpg', alt: 'Retiro — foto 10' },
    ],
  },
  joana: {
    title: 'A profissional',
    images: [
      { type: 'image', src: 'assets/gallery/joana/joana-01.jpg', alt: 'Joana Candeias — foto 1' },
      { type: 'image', src: 'assets/gallery/joana/joana-02.jpg', alt: 'Joana Candeias — foto 2' },
      { type: 'image', src: 'assets/gallery/joana/joana-03.jpg', alt: 'Joana Candeias — foto 3' },
      { type: 'image', src: 'assets/gallery/joana/joana-04.jpg', alt: 'Joana Candeias — foto 4' },
      { type: 'image', src: 'assets/gallery/joana/joana-05.jpg', alt: 'Joana Candeias — foto 5' },
      { type: 'image', src: 'assets/gallery/joana/joana-06.jpg', alt: 'Joana Candeias — foto 6' },
      { type: 'image', src: 'assets/gallery/joana/joana-07.jpg', alt: 'Joana Candeias — foto 7' },
      { type: 'image', src: 'assets/gallery/joana/joana-08.jpg', alt: 'Joana Candeias — foto 8' },
      { type: 'image', src: 'assets/gallery/joana/joana-09.jpg', alt: 'Joana Candeias — foto 9' },
      { type: 'image', src: 'assets/gallery/joana/joana-10.jpg', alt: 'Joana Candeias — foto 10' },
      { type: 'image', src: 'assets/gallery/joana/joana-11.jpg', alt: 'Joana Candeias — foto 11' },
      { type: 'image', src: 'assets/gallery/joana/joana-12.jpg', alt: 'Joana Candeias — foto 12' },
      { type: 'image', src: 'assets/gallery/joana/joana-13.jpg', alt: 'Joana Candeias — foto 13' },
      { type: 'video', src: 'assets/gallery/joana/joana-01.mp4', alt: 'Joana Candeias — vídeo 1' },
    ],
  },
};

function initInspirationAlbums() {
  const modal = document.getElementById('albumModal');
  const backdrop = document.getElementById('albumModalBackdrop');
  const closeBtn = document.getElementById('albumModalClose');
  const titleEl = document.getElementById('albumModalTitle');
  const grid = document.getElementById('albumModalGrid');
  const emptyEl = document.getElementById('albumModalEmpty');
  if (!modal || !grid || !titleEl || !emptyEl) return;

  let lastFocus = null;

  const closeModal = () => {
    grid.querySelectorAll('video').forEach((video) => {
      video.pause();
    });
    modal.hidden = true;
    document.body.style.overflow = '';
    grid.innerHTML = '';
    lastFocus?.focus();
  };

  const openModal = (albumId) => {
    const album = INSPIRATION_ALBUMS[albumId];
    if (!album) return;

    lastFocus = document.activeElement;
    titleEl.textContent = album.title;
    grid.innerHTML = '';

    if (album.images.length) {
      emptyEl.hidden = true;
      album.images.forEach(({ src, alt, type = 'image' }) => {
        const item = document.createElement('div');
        item.className = 'album-modal-item';
        if (type === 'video') {
          item.classList.add('album-modal-item--video');
          item.innerHTML = `<video src="${src}" controls playsinline preload="metadata" aria-label="${alt}"></video>`;
        } else {
          item.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy">`;
        }
        grid.appendChild(item);
      });
    } else {
      emptyEl.hidden = false;
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  document.querySelectorAll('.inspiration-card[data-album]').forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.album));
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') closeModal();
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

document.querySelectorAll('.hero-content, .section-header, .service-card, .highlight-card, .inspiration-card, .professional-image, .professional-content, .testimonial-card, .booking-info, .booking-form, .footer-grid').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
