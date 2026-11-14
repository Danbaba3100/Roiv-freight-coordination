document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealGroups = [
    ['.hero-premium .hero-content > *', 'rise'],
    ['.page-hero .container > *', 'rise'],
    ['.stat-grid > div', 'scale'],
    ['.trust-grid > div', 'scale'],
    ['.intro-photo-wrap', 'left'],
    ['.intro-text > *', 'right'],
    ['.fleet-card', 'scale'],
    ['.service-card', 'scale'],
    ['.feature-box', 'right'],
    ['.article-card', 'scale'],
    ['.testimonial-card', 'left'],
    ['.process-premium-grid > *', 'rise'],
    ['.process-steps article', 'rise'],
    ['.process-list > div', 'rise'],
    ['.values-grid article', 'scale'],
    ['.cta-premium-inner > *', 'rise'],
    ['.cta-inner > *', 'rise'],
    ['.content-section > .container > *', 'rise'],
    ['.content-section .container > .content-narrow > *', 'rise'],
    ['.service-detail > *', 'left'],
    ['.contact-grid > *', 'right'],
    ['.seo-faq-wrap > *', 'rise'],
    ['.seo-faq', 'left'],
    ['.article-detail-wrap > *', 'rise'],
    ['.wyoming-local-grid > *', 'rise'],
    ['.local-seo-note .container > *', 'rise'],
    ['.site-footer .footer-main > *', 'rise']
  ];

  const revealSet = new Map();
  revealGroups.forEach(([selector, motion]) => {
    document.querySelectorAll(selector).forEach(element => {
      if (!revealSet.has(element)) revealSet.set(element, motion);
    });
  });

  let index = 0;
  revealSet.forEach((motion, element) => {
    if (element.hasAttribute('data-reveal')) return;
    element.setAttribute('data-reveal', '');
    element.setAttribute('data-motion', motion);
    element.style.setProperty('--reveal-delay', Math.min(index % 5, 4) * 95 + 'ms');
    index += 1;
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(element => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    revealItems.forEach(element => observer.observe(element));
  }

  if (!reduceMotion) {
    // A slim reading-progress line gives long pages a subtle sense of movement.
    const progress = document.createElement('div');
    progress.id = 'roiv-scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    let ticking = false;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, amount)) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();

    // Gentle pointer tilt and a warm light-follow effect, desktop only.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const interactiveCards = document.querySelectorAll(
        '.service-card, .feature-box, .article-card, .testimonial-card'
      );
      interactiveCards.forEach(card => {
        card.addEventListener('pointermove', event => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          card.style.setProperty('--roiv-tilt-x', ((0.5 - y) * 3.2).toFixed(2) + 'deg');
          card.style.setProperty('--roiv-tilt-y', ((x - 0.5) * 3.2).toFixed(2) + 'deg');
          card.style.setProperty('--roiv-glow-x', (x * 100).toFixed(1) + '%');
          card.style.setProperty('--roiv-glow-y', (y * 100).toFixed(1) + '%');
        });
        card.addEventListener('pointerleave', () => {
          card.style.setProperty('--roiv-tilt-x', '0deg');
          card.style.setProperty('--roiv-tilt-y', '0deg');
        });
      });
    }
  }
});