/* ============================================
   NAVIGATION — scroll state & mobile menu
   ============================================ */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

// Scrolled state
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile burger toggle
navBurger.addEventListener('click', () => {
  const isOpen = navBurger.classList.toggle('is-open');
  navMobile.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
navMobile.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navBurger.classList.remove('is-open');
    navMobile.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

/* ============================================
   REVEAL ON SCROLL — IntersectionObserver
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Observe all .reveal elements; stagger siblings within the same parent
document.querySelectorAll('.reveal').forEach((el, i) => {
  // Compute sibling index within parent for stagger
  const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
  const siblingIndex = siblings.indexOf(el);
  el.style.transitionDelay = `${siblingIndex * 0.08}s`;

  revealObserver.observe(el);
});

/* ============================================
   HERO ROTATING TEXT
   ============================================ */
const phrases = [
  'clear customer value',
  'revenue-driving narratives',
  'sales-ready pipelines',
  'AI-powered execution',
  'strategic GTM launches',
];

const rotatingEl = document.getElementById('rotatingText');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeEffect() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing
    rotatingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      // Pause before deleting
      typingTimeout = setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 2400);
      return;
    }
  } else {
    // Deleting
    rotatingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 45 : 75;
  typingTimeout = setTimeout(typeEffect, speed);
}

// Start after a short delay so the hero has loaded
setTimeout(typeEffect, 1200);

/* ============================================
   SMOOTH SCROLL for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================
   ACTIVE NAV LINK — highlight section in view
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.style.color = href === `#${id}` && !link.classList.contains('nav__link--cta')
          ? 'var(--color-text)'
          : '';
      });
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(s => sectionObserver.observe(s));

/* ============================================
   SKILL CARD — subtle tilt on hover (desktop)
   ============================================ */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.25s cubic-bezier(0.4,0,0.2,1)';
    });
  });
}

/* ============================================
   STATS — count-up animation
   ============================================ */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);

    const el = entry.target;
    const raw = el.dataset.count;
    if (!raw) return;

    const isFloat = raw.includes('.');
    const end = parseFloat(raw);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = isFloat
        ? (eased * end).toFixed(1)
        : Math.round(eased * end);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number[data-count]').forEach(el => {
  statsObserver.observe(el);
});

/* ============================================
   COPY EMAIL TO CLIPBOARD
   ============================================ */
document.querySelectorAll('.js-copy-email').forEach(btn => {
  btn.addEventListener('click', () => {
    const email = btn.dataset.email;
    navigator.clipboard.writeText(email).then(() => {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('is-copied');
      }, 2000);
    });
  });
});
