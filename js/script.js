// Toggle mobile nav
const toggleBtn = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggleBtn?.addEventListener('click', () => {
  const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  toggleBtn.setAttribute('aria-expanded', String(!expanded));
  nav.style.display = nav.style.display === 'block' ? '' : 'block';
});

const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links (modern browsers support)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile nav after click
      if(window.innerWidth < 640 && nav) nav.style.display = '';
    }
  })
});

const navLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveNav = (sectionId) => {
  if(!sectionId) return;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', isActive);
  });
};

if('IntersectionObserver' in window && observedSections.length){
  const io = new IntersectionObserver((entries) => {
    const best = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if(best?.target?.id) setActiveNav(best.target.id);
  }, {
    root: null,
    threshold: [0.15, 0.25, 0.4, 0.6],
    rootMargin: '-20% 0px -65% 0px'
  });

  observedSections.forEach((section) => io.observe(section));
}

// Initialize ScrollReveal if available
if(window.ScrollReveal && !prefersReducedMotion && !window.AOS){
  ScrollReveal().reveal('.hero__text, .hero__avatar, .section__title, .project-card', {
    distance: '40px',
    duration: 700,
    easing: 'ease-in-out',
    interval: 120,
    origin: 'bottom'
  });
}

// Simple contact form handler
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  // Simple validation example
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if(!name || !email || !message){
    if(formStatus) formStatus.textContent = 'Vui lòng điền đầy đủ thông tin.';
    return;
  }

  if(formStatus) formStatus.textContent = 'Cảm ơn bạn! Tin nhắn đã được gửi.';
  form.reset();
});

if(formStatus) formStatus.textContent = '';
if(window.Typed && !prefersReducedMotion){
  new Typed('#typed', {
      strings: ["Web Developer 💻", "UI/UX Enthusiast 🎨", "Người bị code đấm"],
      typeSpeed: 60,
      backSpeed: 30,
      loop: true
  });
}

if(window.AOS && !prefersReducedMotion){
  AOS.init({
      duration: 1000,
      once: true
  });
}

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const applyTheme = (mode) => {
  const isDark = mode === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  if(themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
};

const getInitialTheme = () => {
  const saved = window.localStorage.getItem('theme');
  if(saved === 'dark' || saved === 'light') return saved;
  const prefersDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return prefersDark ? 'dark' : 'light';
};

applyTheme(getInitialTheme());

themeToggle?.addEventListener('click', function () {
  const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  window.localStorage.setItem('theme', next);
  applyTheme(next);
});

const scrollProgressBar = document.getElementById('scrollProgressBar');
const backToTop = document.getElementById('backToTop');
const header = document.querySelector('.site-header');

let scheduled = false;
const updateOnScroll = () => {
  scheduled = false;

  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if(scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;

  const show = scrollTop > 420;
  if(backToTop) backToTop.classList.toggle('is-visible', show);
  if(header) header.classList.toggle('is-scrolled', scrollTop > 10);
};

window.addEventListener('scroll', () => {
  if(scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(updateOnScroll);
}, { passive: true });

updateOnScroll();

if(observedSections.length){
  const initial = observedSections.find((s) => s.getBoundingClientRect().top >= 0) || observedSections[0];
  if(initial?.id) setActiveNav(initial.id);
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const canTilt = !prefersReducedMotion;
const tiltTargets = canTilt ? document.querySelectorAll('.project-card, .skill-item') : [];

tiltTargets.forEach((el) => {
  let raf = 0;
  let lastX = 0;
  let lastY = 0;

  const apply = () => {
    raf = 0;
    const rect = el.getBoundingClientRect();
    const px = (lastX - rect.left) / rect.width;
    const py = (lastY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
  };

  el.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if(raf) return;
    raf = window.requestAnimationFrame(apply);
  });

  el.addEventListener('mouseleave', () => {
    if(raf){
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    el.style.transform = '';
  });
});

document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    item.classList.toggle('active');
  });
});
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Hand tracking demo (MediaPipe Hands)
const handStartBtn = document.getElementById('handStart');
const handStopBtn = document.getElementById('handStop');
const handStatus = document.getElementById('handStatus');
const handGesture = document.getElementById('handGesture');
const handVideo = document.getElementById('handVideo');
const handCanvas = document.getElementById('handCanvas');
const heartScreen = document.getElementById('heartScreen');

let mpHands = null;
let mpCamera = null;

let lastUiActionGesture = '';
let lastUiActionAt = 0;

let heartWasActive = false;
let heartToastTimer = 0;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const setGesture = (name) => {
  if(name) document.body.setAttribute('data-gesture', name);
  else document.body.removeAttribute('data-gesture');
  if(handGesture) handGesture.textContent = name ? `Gesture: ${name}` : '';
};

const setHandMotionVars = (x, y, rotDeg) => {
  document.body.style.setProperty('--hand-x', String(x));
  document.body.style.setProperty('--hand-y', String(y));
  document.body.style.setProperty('--hand-rot', rotDeg);
};

const hideHeartScreen = () => {
  if(!heartScreen) return;
  heartScreen.classList.remove('is-visible');
  heartScreen.setAttribute('hidden', '');
};

const showHeartScreen = () => {
  if(!heartScreen) return;

  if(heartToastTimer) window.clearTimeout(heartToastTimer);
  heartScreen.removeAttribute('hidden');
  window.requestAnimationFrame(() => heartScreen.classList.add('is-visible'));

  setGesture('Heart');

  heartToastTimer = window.setTimeout(() => {
    hideHeartScreen();
    if(document.body.getAttribute('data-gesture') === 'Heart') setGesture('');
    heartToastTimer = 0;
  }, 2200);
};

const fingerExtended = (lm, tip, pip) => lm?.[tip]?.y < lm?.[pip]?.y;
const thumbExtended = (lm, handednessLabel) => {
  const tip = lm?.[4];
  const ip = lm?.[3];
  if(!tip || !ip) return false;
  if(handednessLabel === 'Left') return tip.x > ip.x;
  return tip.x < ip.x;
};

const detectGesture = (lm, handednessLabel) => {
  if(!lm || lm.length < 21) return '';
  const thumb = thumbExtended(lm, handednessLabel);
  const index = fingerExtended(lm, 8, 6);
  const middle = fingerExtended(lm, 12, 10);
  const ring = fingerExtended(lm, 16, 14);
  const pinky = fingerExtended(lm, 20, 18);

  const allUp = thumb && index && middle && ring && pinky;
  const noneUp = !thumb && !index && !middle && !ring && !pinky;
  if(allUp) return 'Open Palm';
  if(noneUp) return 'Fist';
  if(index && !middle && !ring && !pinky) return 'Point';
  if(thumb && !index && !middle && !ring && !pinky) return 'Thumbs Up';
  return '';
};

const dist2D = (a, b) => {
  const dx = (a?.x ?? 0) - (b?.x ?? 0);
  const dy = (a?.y ?? 0) - (b?.y ?? 0);
  return Math.hypot(dx, dy);
};

const isHeartPose = (lm1, lm2) => {
  if(!lm1 || !lm2) return false;
  const i1 = lm1[8];
  const i2 = lm2[8];
  const t1 = lm1[4];
  const t2 = lm2[4];
  if(!i1 || !i2 || !t1 || !t2) return false;

  const indexClose = dist2D(i1, i2) < 0.085;
  const thumbClose = dist2D(t1, t2) < 0.11;
  const thumbsBelowIndex = ((t1.y + t2.y) / 2) > ((i1.y + i2.y) / 2);
  return indexClose && thumbClose && thumbsBelowIndex;
};

const runUiAction = (gestureName) => {
  const now = Date.now();
  const cooldownMs = 1200;
  if(!gestureName) return;
  if(gestureName === lastUiActionGesture && now - lastUiActionAt < cooldownMs) return;

  const mark = () => {
    lastUiActionGesture = gestureName;
    lastUiActionAt = now;
  };

  if(gestureName === 'Open Palm'){
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    window.localStorage.setItem('theme', next);
    applyTheme(next);
    mark();
    return;
  }

  if(gestureName === 'Thumbs Up'){
    const projects = document.getElementById('projects');
    projects?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    mark();
    return;
  }

  if(gestureName === 'Point'){
    const featuredCard = document.querySelector('.featured-card') || document.querySelector('.project-grid .project-card[data-featured="true"]');
    if(featuredCard && typeof openProjectModal === 'function') openProjectModal(featuredCard);
    mark();
    return;
  }

  if(gestureName === 'Fist'){
    if(typeof closeProjectModal === 'function' && typeof modal !== 'undefined' && modal?.style?.display === 'block'){
      closeProjectModal();
    }
    const hand = document.getElementById('hand');
    hand?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    mark();
  }
};

const resetHandUI = () => {
  setGesture('');
  setHandMotionVars(0, 0, '0deg');
  hideHeartScreen();
  if(handStatus) handStatus.textContent = 'Idle';
};

const stopHandTracking = () => {
  try{
    mpCamera?.stop?.();
  }catch{}
  mpCamera = null;

  if(handVideo?.srcObject){
    try{
      handVideo.srcObject.getTracks().forEach((t) => t.stop());
    }catch{}
    handVideo.srcObject = null;
  }

  const ctx = handCanvas?.getContext?.('2d');
  if(ctx && handCanvas){
    ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
  }

  if(handStartBtn) handStartBtn.disabled = false;
  if(handStopBtn) handStopBtn.disabled = true;
  resetHandUI();
};

const startHandTracking = () => {
  if(!handVideo || !handCanvas){
    if(handStatus) handStatus.textContent = 'Hand section not found';
    return;
  }
  if(!(window.Hands && window.Camera && window.drawConnectors && window.drawLandmarks)){
    if(handStatus) handStatus.textContent = 'MediaPipe not loaded';
    return;
  }

  if(handStartBtn) handStartBtn.disabled = true;
  if(handStopBtn) handStopBtn.disabled = false;
  if(handStatus) handStatus.textContent = 'Starting camera...';

  mpHands = mpHands || new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  mpHands.setOptions({
    selfieMode: true,
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5
  });

  mpHands.onResults((results) => {
    const ctx = handCanvas.getContext('2d');
    const w = handVideo.videoWidth || 1280;
    const h = handVideo.videoHeight || 720;
    if(handCanvas.width !== w) handCanvas.width = w;
    if(handCanvas.height !== h) handCanvas.height = h;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // mirror canvas to match mirrored video
    ctx.translate(w, 0);
    ctx.scale(-1, 1);

    const hands = results.multiHandLandmarks || [];
    if(hands.length){
      if(handStatus) handStatus.textContent = 'Tracking';

      const isHeart = hands.length >= 2 && isHeartPose(hands[0], hands[1]);
      if(isHeart){
        if(!heartWasActive) showHeartScreen();
        heartWasActive = true;
      }else{
        heartWasActive = false;

        const lm = hands[0];
        const handednessLabel = results.multiHandedness?.[0]?.label || '';
        const gesture = detectGesture(lm, handednessLabel);
        setGesture(gesture);
        runUiAction(gesture);

        const wrist = lm[0];
        const xVar = clamp((0.5 - wrist.x) * 2, -1, 1);
        const yVar = clamp((wrist.y - 0.5) * 2, -1, 1);
        const rot = `${(xVar * 12).toFixed(2)}deg`;
        setHandMotionVars(xVar.toFixed(3), yVar.toFixed(3), rot);
      }

      hands.forEach((lm) => {
        drawConnectors(ctx, lm, HAND_CONNECTIONS, { color: '#4facfe', lineWidth: 3 });
        drawLandmarks(ctx, lm, { color: '#a855f7', lineWidth: 2, radius: 3 });
      });
    }else{
      if(handStatus) handStatus.textContent = 'No hand';
      setGesture('');
      setHandMotionVars(0, 0, '0deg');
      heartWasActive = false;
      hideHeartScreen();
    }

    ctx.restore();
  });

  mpCamera = new Camera(handVideo, {
    onFrame: async () => {
      await mpHands.send({ image: handVideo });
    },
    width: 1280,
    height: 720
  });

  mpCamera.start().then(() => {
    if(handStatus) handStatus.textContent = 'Camera on';
  }).catch((err) => {
    if(handStatus) handStatus.textContent = 'Camera permission denied / error';
    stopHandTracking();
    console.error(err);
  });
};

handStartBtn?.addEventListener('click', startHandTracking);
handStopBtn?.addEventListener('click', stopHandTracking);

// stop camera on page hide
window.addEventListener('pagehide', stopHandTracking);

// Projects filter + search + modal quick view
const projectCards = Array.from(document.querySelectorAll('.project-grid .project-card'));
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const projectSearch = document.getElementById('projectSearch');
const projectsCount = document.getElementById('projectsCount');

const featuredRoot = document.getElementById('featuredProjects');

let activeFilter = 'all';
let activeQuery = '';

const normalizeText = (s) => (s || '').toString().toLowerCase();
const getTags = (card) => normalizeText(card.getAttribute('data-tags')).split(/\s+/).filter(Boolean);
const matchesFilter = (card) => {
  if(activeFilter === 'all') return true;
  const tags = getTags(card);
  return tags.includes(activeFilter);
};

const matchesQuery = (card) => {
  if(!activeQuery) return true;
  const title = normalizeText(card.getAttribute('data-title'));
  const desc = normalizeText(card.getAttribute('data-description'));
  const tags = normalizeText(card.getAttribute('data-tags'));
  return title.includes(activeQuery) || desc.includes(activeQuery) || tags.includes(activeQuery);
};

const renderProjects = () => {
  let visible = 0;
  projectCards.forEach((card) => {
    const show = matchesFilter(card) && matchesQuery(card);
    card.classList.toggle('is-hidden', !show);
    if(show) visible += 1;
  });
  if(projectsCount) projectsCount.textContent = `${visible}/${projectCards.length}`;
};

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeFilter = btn.getAttribute('data-filter') || 'all';
    filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    renderProjects();
  });
});

const renderFeaturedProjects = () => {
  if(!featuredRoot) return;
  const featuredSource = projectCards.filter((c) => c.getAttribute('data-featured') === 'true');
  featuredRoot.innerHTML = '';

  if(!featuredSource.length){
    featuredRoot.closest?.('.featured')?.setAttribute('hidden', '');
    return;
  }

  featuredRoot.closest?.('.featured')?.removeAttribute('hidden');

  featuredSource.forEach((card) => {
    const el = document.createElement('div');
    el.className = 'project-card featured-card';

    const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
    const imgAlt = card.querySelector('img')?.getAttribute('alt') || 'Project';
    const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent || 'Project';
    const description = card.getAttribute('data-description') || '';
    const github = card.getAttribute('data-github');
    const demo = card.getAttribute('data-demo');
    const role = card.getAttribute('data-role') || '';
    const stack = card.getAttribute('data-stack') || '';
    const tags = getTags(card);

    const metricsRaw = card.getAttribute('data-metrics') || '';
    const metrics = metricsRaw.split(';').map((s) => s.trim()).filter(Boolean);

    el.setAttribute('data-tags', tags.join(' '));
    el.setAttribute('data-title', title);
    el.setAttribute('data-description', description);
    if(github) el.setAttribute('data-github', github);
    if(demo) el.setAttribute('data-demo', demo);
    if(role) el.setAttribute('data-role', role);
    if(stack) el.setAttribute('data-stack', stack);
    if(card.getAttribute('data-highlights')) el.setAttribute('data-highlights', card.getAttribute('data-highlights'));

    el.innerHTML = `
      <div class="featured-card__media">
        ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}" loading="lazy" decoding="async" />` : ''}
      </div>
      <div class="featured-card__body">
        <div class="featured-card__badge">Featured</div>
        <h3 class="featured-card__title">${title}</h3>
        <p class="featured-card__desc">${description}</p>
        <div class="featured-card__meta">
          <span class="meta-chip">Role: ${role || '—'}</span>
          <span class="meta-chip">Stack: ${stack || '—'}</span>
        </div>
        <div class="featured-card__chips">
          ${metrics.map((m) => `<span class="chip">${m}</span>`).join('')}
        </div>
        <div class="project-links">
          ${github ? `<a href="${github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
          ${demo ? `<a href="${demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
          <button class="project-details" type="button">Details</button>
        </div>
      </div>
    `;

    featuredRoot.appendChild(el);
  });
};

renderFeaturedProjects();

projectSearch?.addEventListener('input', () => {
  activeQuery = normalizeText(projectSearch.value).trim();
  renderProjects();
});

renderProjects();

const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('projectModalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalActions = document.getElementById('modalActions');
const modalRole = document.getElementById('modalRole');
const modalStack = document.getElementById('modalStack');
const modalHighlights = document.getElementById('modalHighlights');
const modalHighlightsTitle = document.getElementById('modalHighlightsTitle');
let lastFocused = null;

const buildActionLink = (href, label, className) => {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = label;
  if(className) a.className = className;
  return a;
};

const openProjectModal = (card) => {
  if(!modal) return;
  lastFocused = document.activeElement;

  const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent || 'Project';
  const description = card.getAttribute('data-description') || card.querySelector('p')?.textContent || '';
  const github = card.getAttribute('data-github');
  const demo = card.getAttribute('data-demo');
  const tags = getTags(card);
  const role = card.getAttribute('data-role') || '';
  const stack = card.getAttribute('data-stack') || '';
  const highlightsRaw = card.getAttribute('data-highlights') || '';
  const highlights = highlightsRaw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  if(modalTitle) modalTitle.textContent = title;
  if(modalDescription) modalDescription.textContent = `${description}${tags.length ? `\n\nTags: ${tags.join(', ')}` : ''}`;

  if(modalRole) modalRole.textContent = role || '—';
  if(modalStack) modalStack.textContent = stack || '—';

  if(modalHighlights){
    modalHighlights.innerHTML = '';
    if(highlights.length){
      highlights.forEach((h) => {
        const li = document.createElement('li');
        li.textContent = h;
        modalHighlights.appendChild(li);
      });
    }
  }
  if(modalHighlightsTitle) modalHighlightsTitle.style.display = highlights.length ? '' : 'none';
  if(modalHighlights) modalHighlights.style.display = highlights.length ? '' : 'none';
  if(modalActions){
    modalActions.innerHTML = '';
    if(github) modalActions.appendChild(buildActionLink(github, 'GitHub'));
    if(demo) modalActions.appendChild(buildActionLink(demo, 'Live Demo'));
    modalActions.appendChild(buildActionLink('#projects', 'Back to Projects', 'secondary'));
  }

  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  modalClose?.focus();
};

const closeProjectModal = () => {
  if(!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  if(modalHighlights) modalHighlights.innerHTML = '';
  if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  lastFocused = null;
};

document.addEventListener('click', (e) => {
  const btn = e.target.closest?.('.project-details');
  if(btn){
    const card = btn.closest('.project-card');
    if(card) openProjectModal(card);
  }
});

modalClose?.addEventListener('click', closeProjectModal);
modal?.addEventListener('click', (e) => {
  if(e.target === modal) closeProjectModal();
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal?.style.display === 'block') closeProjectModal();
});
