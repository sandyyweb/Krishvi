(function(){
  const progress = document.getElementById('progress');
  const visual = document.getElementById('heroVisual');
  const stage = document.getElementById('stage');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navEl = document.querySelector('.nav');

  /* Scroll progress bar + shrink nav/logo past a small threshold */
  function scrollProgress(){
    const d = document.documentElement;
    const max = d.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', scrollProgress, { passive: true });
  scrollProgress();

  /* Hero 3D tilt on pointer move */
  if (!reduce && visual && stage) {
    visual.addEventListener('pointermove', function (e) {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = 'rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg)';
    });
    visual.addEventListener('pointerleave', function () {
      stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /* Scroll reveal animations */
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => io.observe(item));

  /* ===== Dark nav over light (cream) sections ===== */
  const lightSections = document.querySelectorAll('.light-section');
  if (navEl && lightSections.length) {
    const activeLight = new Set();
    const lightObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeLight.add(entry.target);
        else activeLight.delete(entry.target);
      });
      navEl.classList.toggle('on-light', activeLight.size > 0);
    }, { rootMargin: '-78px 0px -82% 0px', threshold: 0 });
    lightSections.forEach(section => lightObserver.observe(section));
  }

  /* ===== Nav menu overlay ===== */
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const overlay = document.getElementById('menuOverlay');
  const body = document.body;
  let lastFocused = null;

  function openMenu(){
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.classList.add('is-open');
    const firstLink = overlay.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('is-open');
    if (lastFocused) lastFocused.focus();
  }

  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', function(){
      overlay.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  overlay.querySelectorAll('a[data-close]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });

  /* Close overlay if the viewport is resized up past a point where it no longer makes sense */
  overlay.addEventListener('click', function(e){
    if (e.target === overlay) closeMenu();
  });

  /* ===== Active nav link on scroll (desktop inline links) ===== */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
