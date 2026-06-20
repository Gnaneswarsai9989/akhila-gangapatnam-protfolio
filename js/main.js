/* ===================================================
   AKHILA GANGAPATNAM — PORTFOLIO JS
   Typing Effect · Particles · Scroll Reveals · Counter
=================================================== */

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const navInner = document.querySelector('.nav-inner');

function handleResponsiveNav() {
  if (window.innerWidth <= 900) {
    if (navLinks && navLinks.parentElement !== document.body) {
      document.body.appendChild(navLinks);
    }
  } else {
    if (navLinks && navInner && navLinks.parentElement !== navInner) {
      navInner.insertBefore(navLinks, hamburger);
    }
  }
}
window.addEventListener('resize', handleResponsiveNav);
handleResponsiveNav();


window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('hero-top');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('hero-top');
  }
  updateActiveNav();
});

// Set hero-top on page load
if (window.scrollY <= 60) navbar.classList.add('hero-top');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navbar.classList.toggle('menu-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

const navClose = document.getElementById('navClose');
if (navClose) {
  navClose.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
}

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}



// ===== VIDEO PARALLAX =====
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.25;
    heroVideo.style.transform = `translateY(${rate}px) scale(1.02)`;
  });
}



// ===== STAT COUNTER =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

// ===== TESTIMONIALS INFINITE SCROLL & DRAGGING =====
const track = document.getElementById('testimonialTrack');
if (track) {
  // 1. Clone each card to achieve a seamless loop
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Calculate the loop boundary width (the combined width of original cards + gaps)
  let originalWidth = 0;
  function measureTrack() {
    const totalCards = track.children.length;
    const originalCount = totalCards / 2;
    if (originalCount > 0) {
      const firstCard = track.children[0];
      const secondCard = track.children[1];
      const cardWidth = firstCard.offsetWidth;
      // Get the real gap from computed layout or fallback to 24px
      let gap = 24;
      if (secondCard) {
        gap = secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().right;
      }
      originalWidth = (cardWidth + gap) * originalCount;
    }
  }

  // Measure initial track width after layouts render
  setTimeout(measureTrack, 100);
  window.addEventListener('resize', measureTrack);

  let currentX = 0;
  let isDragging = false;
  let startX = 0;
  let dragX = 0;
  const speed = 0.6; // Speed of auto scroll in pixels per frame

  function animateMarquee() {
    if (!isDragging) {
      currentX += speed;
      // Infinite loop wrap
      if (originalWidth > 0) {
        currentX = currentX % originalWidth;
      }
      track.style.transform = `translateX(-${currentX}px)`;
    }
    requestAnimationFrame(animateMarquee);
  }

  // Start the animation loop
  setTimeout(() => {
    requestAnimationFrame(animateMarquee);
  }, 200);

  // Dragging event handlers
  const startDrag = (e) => {
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
    dragX = currentX;
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    const pageX = e.pageX || e.touches[0].pageX;
    const walk = pageX - startX;
    currentX = dragX - walk;

    // Wrap around boundaries mathematically using modulo
    if (originalWidth > 0) {
      currentX = ((currentX % originalWidth) + originalWidth) % originalWidth;
    }
    track.style.transform = `translateX(-${currentX}px)`;
  };

  const stopDrag = () => {
    isDragging = false;
  };

  // Bind mouse events
  track.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', stopDrag);

  // Bind touch events to support mobile dragging
  track.addEventListener('touchstart', startDrag);
  window.addEventListener('touchmove', moveDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
}

// ===== SCROLL REVEAL + COUNTER TRIGGER =====
const revealEls = document.querySelectorAll('.work-card, .stat-card, .testimonials-section, .contact-card, .skill-pill, .contact-form, .about-visual, .about-text');
revealEls.forEach(el => el.classList.add('reveal'));

const counterEls = document.querySelectorAll('.stat-num');
let countersTriggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      countersTriggered = true;
      counterEls.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
    }
  });
}, { threshold: 0.5 });

revealEls.forEach(el => observer.observe(el));
const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

// Testimonials scroll dots and auto-scroll logic removed in favor of infinite CSS marquee animation

// ===== CONTACT FORM → WHATSAPP =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('input[type="text"]').value;
    const phone = contactForm.querySelector('input[type="tel"]').value;
    const service = contactForm.querySelector('select').value;
    const msg = contactForm.querySelector('textarea').value;

    const text = `Hi Akhila! 👋\n\nName: ${name}\nPhone: ${phone}\nService: ${service || 'Not specified'}\n\n${msg}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919346159120?text=${encoded}`, '_blank');
  });
}

// ===== 3D TILT ON CARDS =====
document.querySelectorAll('.work-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== HERO VIDEO MOUSE SUBTLE TILT =====
const heroSection = document.querySelector('.home');
if (heroSection && heroVideo) {
  heroSection.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    heroVideo.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.06) translate(${x}px, ${y}px)`;
  });
}

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - 90;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ===== HANDLE MISSING IMAGE GRACEFULLY =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    // Create beautiful gradient placeholder
    const wrap = this.closest('.home-img-container, .about-img-wrap');
    if (wrap) {
      this.style.display = 'none';
      wrap.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #2d1b35 40%, #16213e 70%, #0f3460 100%)';
      // Add initials overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        font-family:'Plus Jakarta Sans',sans-serif;font-size:5rem;font-weight:700;
        color:rgba(201,169,110,0.4);letter-spacing:0.05em;user-select:none;
      `;
      overlay.textContent = 'AG';
      wrap.appendChild(overlay);
    }
  });
});

// ===== PORTFOLIO CARDS AUTOMATIC IMAGES ROTATION (SLIDESHOW) =====
const slideshowImages = [
  'images/images/work1.jpg',
  'images/images/work2.jpg',
  'images/images/work3.jpg',
  'images/images/work4.jpg',
  'images/images/work5.jpg',
  'images/images/work6.jpg'
];

// Preload all slideshow images to prevent loading jumps during rotation
slideshowImages.forEach(src => {
  const img = new Image();
  img.src = src;
});

const cards = document.querySelectorAll('.work-card');
if (cards.length > 0) {
  let globalOffset = 0;

  setInterval(() => {
    globalOffset = (globalOffset + 1) % slideshowImages.length;

    cards.forEach((card, index) => {
      const bg = card.querySelector('.work-thumb-bg');
      
      // Calculate a unique image index for this card based on the global offset
      const nextIndex = (index + globalOffset) % slideshowImages.length;
      const nextSrc = slideshowImages[nextIndex];

      // Create cross-fade overlay
      const fadeBg = document.createElement('div');
      fadeBg.className = 'work-thumb-bg-fade';
      fadeBg.style.backgroundImage = `url('${nextSrc}')`;

      // Insert overlay exactly after original background so it renders behind text/icons
      bg.insertAdjacentElement('afterend', fadeBg);

      // Fade overlay in
      setTimeout(() => {
        fadeBg.style.opacity = '1';
      }, 50);

      // Swap original background and cleanup after transition completes
      setTimeout(() => {
        bg.style.backgroundImage = `url('${nextSrc}')`;
        fadeBg.remove();
      }, 500);
    });
  }, 1700);
}
