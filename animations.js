
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 1. Hero entrance (on load) ---------- */
  const heroLeft = $$('#home .lg\\:col-span-7 > *');
  heroLeft.forEach((el, i) => {
    el.classList.add('hero-in');
    el.style.setProperty('--delay', (0.15 + i * 0.12) + 's');
  });
  const heroImg = $('#home .lg\\:col-span-5 .aspect-\\[2\\/3\\]');
  if (heroImg) heroImg.classList.add('hero-img-wrap');

  /* ---------- 2. Scroll reveal ---------- */
  // [selector, animation, stagger-by-sibling?]
  const targets = [
    ['#about .grid > div:first-child > *',               'up',    true],
    ['#about .grid > div:last-child.relative',           'scale', false],
    ['#about .lg\\:grid-cols-4 > div',                   'scale', true],
    ['#services .lg\\:sticky > *',                       'left',  true],
    ['#services .lg\\:col-span-8 > div',                 'scale', true],
    ['#process .lg\\:col-span-5 > *',                    'left',  true],
    ['#process .lg\\:col-span-7 > div',                  'up',    true],
    ['#work .mb-16 > *',                                 'up',    true],
    ['#work .sticky > div > *',                          'up',    true],
    ['#gallery .mb-12 > *',                              'up',    true],
    ['#gallery .video-card',                             'scale', true],
    ['#testimonials .text-center > *',                   'up',    true],
    ['#testimonials .grid > div',                        'scale', true],
    ['#faq .text-center > *',                            'up',    true],
    ['#faq .faq-item',                                   'up',    true],
    ['#contact .lg\\:col-span-5 > div > *',              'left',  true],
    ['#contact .space-y-6.pt-6',                         'up',    false],
    ['#contact form',                                    'scale', false],
    ['footer > div > *',                                 'up',    true],
  ];

  const seen = new Set();
  const revealEls = [];
  targets.forEach(([sel, anim, stagger]) => {
    $$(sel).forEach((el, i) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('reveal');
      el.dataset.anim = anim;
      if (stagger) el.style.setProperty('--delay', Math.min(i * 0.1, 0.5) + 's');
      revealEls.push(el);
    });
  });

  // Eyebrow lines (the little dashes next to section labels)
  $$('.w-8.h-px, .w-4.h-\\[1px\\], .w-8.h-\\[1px\\]').forEach(l => l.classList.add('eyebrow-line'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      // once finished, remove helper classes so Tailwind hover transitions work normally
      el.addEventListener('animationend', () => {
        el.classList.remove('reveal', 'is-visible');
        el.style.removeProperty('--delay');
      }, { once: true });
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => reduce ? el.classList.remove('reveal') : io.observe(el));

  /* ---------- 3. Scroll progress bar ---------- */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);

  /* ---------- 4. Navbar behaviour + parallax (one rAF-throttled handler) ---------- */
  const nav = $('#navbar-wrapper');
  const parallaxEls = [
    { el: $('#home .aspect-\\[2\\/3\\] img'), speed: 0.06 },
    { el: $('#about .aspect-video img'),      speed: 0.05 },
    { el: $('#process .aspect-\\[4\\/3\\] img'), speed: 0.05 },
  ].filter(p => p.el);

  let lastY = window.scrollY, ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (nav) {
      nav.classList.toggle('nav-scrolled', y > 20);
      if (y > lastY && y > 200) nav.classList.add('nav-hidden');
      else nav.classList.remove('nav-hidden');
    }
    lastY = y;

    if (!reduce) {
      parallaxEls.forEach(({ el, speed }) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;   
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- 5. Magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    $$('a[href="#contact"], a[download], #submitBtn').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.translate = `${x}px ${y}px`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.translate = '0 0'; });
    });

    /* ---------- 6. 3D tilt on service + case-study cards ---------- */
    $$('#services .group').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- 7. Case-study stack: dim the card underneath as the next one covers it ---------- */
  const stack = $$('#work .sticky');
  if (stack.length && !reduce) {
    const stackTick = () => {
      stack.forEach((card, i) => {
        const next = stack[i + 1];
        if (!next) return;
        const nextTop = next.getBoundingClientRect().top;
        const cardTop = card.getBoundingClientRect().top;
        const progress = Math.min(Math.max(1 - (nextTop - cardTop) / card.offsetHeight, 0), 1);
        card.style.filter = `brightness(${1 - progress * 0.35})`;
        card.style.scale = `${1 - progress * 0.04}`;
      });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(stackTick), { passive: true });
    stackTick();
  }

  /* ---------- 8. Cursor glow on hero (soft spotlight) ---------- */
  const hero = $('#home');
  if (hero && !reduce && window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText =
      'position:absolute;width:420px;height:420px;border-radius:50%;pointer-events:none;' +
      'background:radial-gradient(circle,rgba(37,46,61,.10),transparent 65%);' +
      'transform:translate(-50%,-50%);opacity:0;transition:opacity .4s;z-index:0;';
    hero.style.position = 'relative';
    hero.appendChild(glow);
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - r.left) + 'px';
      glow.style.top  = (e.clientY - r.top) + 'px';
      glow.style.opacity = 1;
    });
    hero.addEventListener('mouseleave', () => { glow.style.opacity = 0; });
  }
})();