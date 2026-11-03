/* ═══════════════════════════════════════════════════════
   PRIYANSHU MONDAL · ULTRA-PREMIUM PORTFOLIO
   Vanilla JS · No frameworks
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ─── 1. THEME + ACCENT ─── */
  const root = document.documentElement;
  const themeBtn = $('#themeBtn');
  const accentBtn = $('#accentBtn');
  const accentPicker = $('#accentPicker');

  const savedTheme  = localStorage.getItem('pm-theme')  || 'dark';
  const savedAccent = localStorage.getItem('pm-accent') || 'cyan';

  root.setAttribute('data-theme', savedTheme);
  root.setAttribute('data-accent', savedAccent);

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('pm-theme', next);
    showToast(next === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
  });

  accentBtn?.addEventListener('click', () => accentPicker?.classList.toggle('open'));

  $$('.accent-dot').forEach(dot => {
    if (dot.dataset.accent === savedAccent) dot.classList.add('active');
    dot.addEventListener('click', () => {
      const accent = dot.dataset.accent;
      root.setAttribute('data-accent', accent);
      localStorage.setItem('pm-accent', accent);
      $$('.accent-dot').forEach(d => d.classList.toggle('active', d === dot));
      showToast(`🎨 Accent: ${accent}`);
    });
  });

  document.addEventListener('click', (e) => {
    if (accentPicker && !accentPicker.contains(e.target) && !accentBtn?.contains(e.target)) {
      accentPicker.classList.remove('open');
    }
  });

  /* ─── 2. LOADER ─── */
  const loader = $('#loader');
  document.body.classList.add('loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader?.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 700);
  });
  setTimeout(() => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }
  }, 3000);

  /* ─── 3. TOAST ─── */
  const toast = $('#toast');
  const toastMsg = $('#toastMsg');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  window.showToast = showToast;

  /* ─── 4. CUSTOM CURSOR ─── */
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!isTouch && !prefersReduced && dot && ring) {
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('cursor-active');
    });
    window.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    function loop() {
      dx += (mx - dx) * 0.9; dy += (my - dy) * 0.9;
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      dot.style.transform  = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    const hoverEls = 'a,button,.project-card,.social-pill,.btn,.icon-btn,.contact-card,.filter-btn,.accent-dot,.orbit-center,.timeline-card,.why-card,.exp-card,.skill-cat,.cert-card,.connect-card,.whatsapp-float';
    $$(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ─── 5. BG GLOW follows mouse ─── */
  const bgGlow = $('#bgGlow');
  if (bgGlow && !isTouch && !prefersReduced) {
    let gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    function loopGlow() {
      gx += (tx - gx) * 0.06;
      gy += (ty - gy) * 0.06;
      bgGlow.style.left = gx + 'px';
      bgGlow.style.top  = gy + 'px';
      requestAnimationFrame(loopGlow);
    }
    loopGlow();
  }

  /* ─── 6. PARTICLES ─── */
  const particles = $('#particles');
  if (particles && !prefersReduced) {
    const count = window.innerWidth < 640 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (12 + Math.random() * 18) + 's';
      p.style.animationDelay = (-Math.random() * 20) + 's';
      p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
      p.style.background = Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent-2)';
      p.style.opacity = 0.3 + Math.random() * 0.4;
      particles.appendChild(p);
    }
  }

  /* ─── 7. NAV scroll + active link + mobile menu ─── */
  const nav = $('#nav');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => sectionObs.observe(s));

  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }));

  /* ─── 8. SMOOTH SCROLL with offset ─── */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', id);
  });

  /* ─── 9. SCROLL PROGRESS + BACK TO TOP ─── */
  const progress = $('#scrollProgress');
  const backToTop = $('#backToTop');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    backToTop?.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── 10. REVEAL ON SCROLL ─── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll(':scope > .reveal')) : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx > 0 ? Math.min(idx * 70, 350) : 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* ─── 11. MAGNETIC BUTTONS ─── */
  if (!isTouch && !prefersReduced) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px,${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ─── 12. 3D TILT on dev card ─── */
  const devCard = $('#devCard');
  if (devCard && !isTouch && !prefersReduced) {
    devCard.addEventListener('mousemove', (e) => {
      const r = devCard.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      devCard.style.transform = `perspective(1200px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    devCard.addEventListener('mouseleave', () => {
      devCard.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
    });
  }

  /* ─── 13. TYPEWRITER (terminal mini) ─── */
  const typer = $('#typer');
  if (typer && !prefersReduced) {
    const lines = ['python developer.py', '> learning AI & ML...', '> building the future ✨'];
    let li = 0, ci = 0, deleting = false;
    function type() {
      const line = lines[li];
      if (!deleting) {
        typer.textContent = line.slice(0, ++ci);
        if (ci === line.length) { deleting = true; return setTimeout(type, 1600); }
        setTimeout(type, 55);
      } else {
        typer.textContent = line.slice(0, --ci);
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length; return setTimeout(type, 300); }
        setTimeout(type, 25);
      }
    }
    setTimeout(type, 1400);
  }

  /* ─── 14. PROJECT FILTER ─── */
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      $$('.project-card').forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        card.classList.toggle('hide', !show);
      });
    });
  });

  /* ─── 15. PROJECT MODAL ─── */
  const modal = $('#projectModal');
  const PROJECTS = {
    'maa-tara': {
      title: 'Maa Tara Enterprises',
      category: 'Web Development',
      desc: 'Responsive business website for a rice supplier with product showcase, contact section and professional branding.',
      features: [
        'Product showcase with clean grid layout',
        'Responsive across all devices',
        'Contact section with business information',
        'Professional color palette and typography'
      ],
      tags: ['HTML', 'CSS', 'JavaScript'],
      challenges: 'Designing a professional business presence with clear product presentation and mobile-first responsiveness.',
      github: '#', demo: '#',
      thumbClass: 'thumb-web', icon: '🏢'
    },
    'personal-portfolio': {
      title: 'My Personal Portfolio',
      category: 'Web Development',
      desc: 'Responsive personal portfolio website showcasing education, skills, projects and contact information.',
      features: [
        'Modern futuristic design with glassmorphism',
        'Dark/Light mode toggle with localStorage',
        'Animated scroll reveals & micro-interactions',
        'Fully responsive mobile-first layout'
      ],
      tags: ['HTML', 'CSS', 'JavaScript'],
      challenges: 'Balancing premium visual effects with performance and accessibility across devices.',
      github: '#', demo: '#',
      thumbClass: 'thumb-portfolio', icon: '</>'
    }
  };

  function openModal(key) {
    const p = PROJECTS[key];
    if (!p || !modal) return;
    $('#modalTitle').textContent = p.title;
    $('#modalCategory').textContent = p.category;
    $('#modalDesc').textContent = p.desc;
    const feat = $('#modalFeatures'); feat.innerHTML = '';
    p.features.forEach(f => { const li = document.createElement('li'); li.textContent = f; feat.appendChild(li); });
    const tags = $('#modalTags'); tags.innerHTML = '';
    p.tags.forEach(t => { const s = document.createElement('span'); s.textContent = t; tags.appendChild(s); });
    $('#modalChallenges').textContent = p.challenges;
    $('#modalGithub').href = p.github;
    $('#modalDemo').href = p.demo;
    const th = $('#modalThumb');
    th.className = 'modal-thumb ' + p.thumbClass;
    th.textContent = p.icon;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  }
  $$('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
  });
  $$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

  /* ─── 16. COMMAND PALETTE ─── */
  const cmdk = $('#cmdk');
  const cmdkInput = $('#cmdkInput');
  const cmdkList = $('#cmdkList');
  const cmdBtn = $('#cmdBtn');

  function openCmdk() {
    cmdk?.classList.add('open');
    if (cmdkInput) cmdkInput.value = '';
    setTimeout(() => cmdkInput?.focus(), 50);
  }
  function closeCmdk() { cmdk?.classList.remove('open'); }

  cmdBtn?.addEventListener('click', openCmdk);
  $$('[data-close-cmdk]').forEach(el => el.addEventListener('click', closeCmdk));

  const commands = {
    home:      () => scrollToSection('#hero'),
    about:     () => scrollToSection('#about'),
    skills:    () => scrollToSection('#skills'),
    projects:  () => scrollToSection('#projects'),
    education: () => scrollToSection('#education'),
    resume:    () => scrollToSection('#resume'),
    contact:   () => scrollToSection('#contact'),
    theme:     () => themeBtn?.click()
  };

  function scrollToSection(sel) {
    const el = document.querySelector(sel);
    if (!el) return;
    closeCmdk();
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  cmdkList?.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    commands[li.dataset.cmd]?.();
  });
  cmdkInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    $$('#cmdkList li').forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdk?.classList.contains('open') ? closeCmdk() : openCmdk();
    }
    if (e.key === 'Escape') {
      closeCmdk();
      closeModal();
      accentPicker?.classList.remove('open');
    }
  });

  /* ─── 17. CONTACT FORM validation ─── */
  const form = $('#contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const data = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };
    const errs = {
      name:    data.name.length < 2 ? 'Please enter your name.' : '',
      email:   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'Please enter a valid email.' : '',
      subject: data.subject.length < 3 ? 'Please enter a subject.' : '',
      message: data.message.length < 10 ? 'Message must be at least 10 characters.' : ''
    };
    Object.keys(errs).forEach(k => {
      const el = form[k];
      const err = form.querySelector(`[data-err="${k}"]`);
      if (err) err.textContent = errs[k];
      el.classList.toggle('invalid', !!errs[k]);
      if (errs[k]) valid = false;
    });
    if (!valid) { showToast('⚠️ Please fix the highlighted fields.'); return; }
    showToast('✅ Demo: form validated! Connect a backend to send.');
    form.reset();
  });

  /* ─── 18. CERTIFICATE PLACEHOLDERS ─── */
  $$('[data-placeholder]').forEach(btn => {
    btn.addEventListener('click', () => showToast('📜 Placeholder — replace with real certificate link.'));
  });

  /* ─── 19. KEYBOARD ACCESSIBILITY for project cards ─── */
  $$('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.project);
      }
    });
  });

  /* ─── 20. CONSOLE SIGNATURE ─── */
  console.log(
    '%c Priyanshu Mondal ',
    'background:linear-gradient(135deg,#00e5ff,#a855f7,#ec4899);color:#05050a;font-weight:800;font-size:15px;padding:8px 16px;border-radius:10px;'
  );
  console.log(
    '%c Aspiring Software Developer · West Bengal, India ',
    'color:#a8a8b8;font-size:12px;padding:4px 0;'
  );
  console.log('👋 Thanks for visiting! Press Ctrl+K for command palette.');

})();