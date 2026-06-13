/* ===================================================
   AKHILA GANGAPATNAM — PORTFOLIO JS
   Typing Effect · Particles · Scroll Reveals · Counter
=================================================== */

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
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

// ===== TYPING EFFECT (Continuous Loop) =====
const nameEl = document.getElementById('typingName');
const lines = ['Akhila', 'Gangapatnam'];
const PAUSE_AFTER_TYPE  = 2200; // ms to pause when fully typed
const PAUSE_AFTER_ERASE = 800;  // ms to pause before retyping
const TYPE_SPEED        = 130;  // ms per character while typing (slower)
const ERASE_SPEED       = 65;   // ms per character while erasing (slower)


let charIndex = 0;
let lineIndex = 0;
let isErasing = false;

function buildHTML() {
  let html = '';
  for (let l = 0; l < lines.length; l++) {
    if (l < lineIndex) {
      html += lines[l] + '<br>';
    } else if (l === lineIndex) {
      html += lines[l].slice(0, charIndex);
    }
  }
  nameEl.innerHTML = html;
}

function loopTypeWriter() {
  if (!isErasing) {
    // --- Typing forward ---
    if (lineIndex < lines.length) {
      if (charIndex < lines[lineIndex].length) {
        charIndex++;
        buildHTML();
        setTimeout(loopTypeWriter, TYPE_SPEED);
      } else {
        // Finished current line
        lineIndex++;
        charIndex = 0;
        if (lineIndex < lines.length) {
          // Move to next line
          buildHTML();
          setTimeout(loopTypeWriter, TYPE_SPEED + 150);
        } else {
          // All lines typed — NO cursor during pause → no 3rd line!
          buildHTML();
          setTimeout(() => { isErasing = true; loopTypeWriter(); }, PAUSE_AFTER_TYPE);
        }
      }
    }
  } else {
    // --- Erasing backward ---
    if (lineIndex > 0 || charIndex > 0) {
      if (charIndex === 0 && lineIndex > 0) {
        lineIndex--;
        charIndex = lines[lineIndex].length;
      }
      charIndex--;
      buildHTML();
      setTimeout(loopTypeWriter, ERASE_SPEED);
    } else {
      // Fully erased — no cursor during pause
      nameEl.innerHTML = '';
      isErasing = false;
      setTimeout(loopTypeWriter, PAUSE_AFTER_ERASE);
    }
  }
}

// Kick off after initial delay
setTimeout(loopTypeWriter, 600);

// ===== PARTICLE SYSTEM =====
(function initParticles() {
  const container = document.getElementById('particles');
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;
  const COUNT = 70;

  function resize() {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.5 - 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.gold = Math.random() < 0.35;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(201,169,110,${alpha})`
        : `rgba(255,255,255,${alpha * 0.4})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => {
      const p = new Particle();
      p.life = Math.random() * p.maxLife; // stagger starts
      return p;
    });
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines for nearby gold particles
    const golds = particles.filter(p => p.gold);
    for (let i = 0; i < golds.length; i++) {
      for (let j = i + 1; j < golds.length; j++) {
        const dx = golds[i].x - golds[j].x;
        const dy = golds[i].y - golds[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(golds[i].x, golds[i].y);
          ctx.lineTo(golds[j].x, golds[j].y);
          ctx.strokeStyle = `rgba(201,169,110,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
})();


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

// ===== HERO IMAGE PARALLAX =====
const heroWrap = document.querySelector('.home-image-wrap');
window.addEventListener('mousemove', (e) => {
  if (!heroWrap) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 12;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;
  heroWrap.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
});

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
        font-family:'Cormorant Garamond',serif;font-size:5rem;font-weight:700;
        color:rgba(201,169,110,0.4);letter-spacing:0.05em;user-select:none;
      `;
      overlay.textContent = 'AG';
      wrap.appendChild(overlay);
    }
  });
});
