/* ===================================================
   USSR Mock Government — Interactive Script
   =================================================== */

// ===== SUPABASE AUTH =====
const SUPABASE_URL = 'https://ivrsryervygjmncwlgdn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Rsh_coNUNyNTvfiQ-42yQA_tOVqOaLk';

let supabase;
try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase client could not be initialized:', e.message);
}

// --- Auth DOM Elements ---
const authLoginBtn = document.getElementById('auth-login-btn');
const authUser = document.getElementById('auth-user');
const authUserBtn = document.getElementById('auth-user-btn');
const authAvatar = document.getElementById('auth-avatar');
const authUsername = document.getElementById('auth-username');
const authDropdown = document.getElementById('auth-dropdown');
const authDropdownAvatar = document.getElementById('auth-dropdown-avatar');
const authDropdownName = document.getElementById('auth-dropdown-name');
const authLogoutBtn = document.getElementById('auth-logout-btn');
const authModalOverlay = document.getElementById('auth-modal-overlay');
const authModalClose = document.getElementById('auth-modal-close');
const authDiscordBtn = document.getElementById('auth-discord-btn');
const authToast = document.getElementById('auth-toast');
const authToastTitle = document.getElementById('auth-toast-title');
const authToastMessage = document.getElementById('auth-toast-message');

// --- Toast Helper ---
function showToast(title, message, isError = false) {
  if (!authToast) return;
  authToastTitle.textContent = title;
  authToastMessage.textContent = message;
  authToast.classList.toggle('error', isError);
  authToast.classList.add('show');
  setTimeout(() => authToast.classList.remove('show'), 4000);
}

// --- Update UI based on auth state ---
function updateAuthUI(user) {
  if (user) {
    // User is logged in
    const meta = user.user_metadata || {};
    const avatarUrl = meta.avatar_url || meta.picture || '';
    const displayName = meta.full_name || meta.name || meta.preferred_username || user.email || 'Comrade';

    if (authLoginBtn) authLoginBtn.style.display = 'none';
    if (authUser) authUser.style.display = 'block';
    if (authAvatar) authAvatar.src = avatarUrl;
    if (authUsername) authUsername.textContent = displayName;
    if (authDropdownAvatar) authDropdownAvatar.src = avatarUrl;
    if (authDropdownName) authDropdownName.textContent = displayName;
  } else {
    // User is logged out
    if (authLoginBtn) authLoginBtn.style.display = 'inline-flex';
    if (authUser) authUser.style.display = 'none';
    // Close dropdown if open
    if (authDropdown) authDropdown.classList.remove('open');
    if (authUserBtn) authUserBtn.classList.remove('open');
  }
}

// --- Modal Controls ---
function openAuthModal() {
  if (authModalOverlay) authModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  if (authModalOverlay) authModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Open modal on login button click
if (authLoginBtn) {
  authLoginBtn.addEventListener('click', openAuthModal);
}

// Close modal on X or overlay click
if (authModalClose) {
  authModalClose.addEventListener('click', closeAuthModal);
}
if (authModalOverlay) {
  authModalOverlay.addEventListener('click', (e) => {
    if (e.target === authModalOverlay) closeAuthModal();
  });
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAuthModal();
    if (authDropdown) authDropdown.classList.remove('open');
    if (authUserBtn) authUserBtn.classList.remove('open');
  }
});

// --- Discord OAuth Login ---
if (authDiscordBtn) {
  authDiscordBtn.addEventListener('click', async () => {
    if (!supabase) {
      showToast('Connection Error', 'Could not connect to auth service.', true);
      return;
    }

    authDiscordBtn.classList.add('loading');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });

    if (error) {
      authDiscordBtn.classList.remove('loading');
      showToast('Authentication Failed', error.message, true);
      console.error('OAuth error:', error);
    }
    // If successful, the page will redirect to Discord
  });
}

// --- Profile Dropdown Toggle ---
if (authUserBtn) {
  authUserBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = authDropdown.classList.toggle('open');
    authUserBtn.classList.toggle('open', isOpen);
  });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (authDropdown && !authDropdown.contains(e.target) && !authUserBtn.contains(e.target)) {
    authDropdown.classList.remove('open');
    if (authUserBtn) authUserBtn.classList.remove('open');
  }
});

// --- Logout ---
if (authLogoutBtn) {
  authLogoutBtn.addEventListener('click', async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast('Sign Out Error', error.message, true);
    } else {
      updateAuthUI(null);
      showToast('Signed Out', 'Until next time, Comrade.');
      if (authDropdown) authDropdown.classList.remove('open');
      if (authUserBtn) authUserBtn.classList.remove('open');
    }
  });
}

// --- Listen for auth state changes ---
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    updateAuthUI(user);

    if (event === 'SIGNED_IN' && user) {
      closeAuthModal();
      const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Comrade';
      showToast(`Welcome, ${name}!`, 'Your citizenship has been verified.');
    }

    if (event === 'SIGNED_OUT') {
      updateAuthUI(null);
    }
  });

  // Check initial session on page load
  supabase.auth.getSession().then(({ data: { session } }) => {
    updateAuthUI(session?.user || null);
  });
}

// ===== PARTICLES BACKGROUND =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.7
        ? `rgba(212, 168, 67, ${Math.random() * 0.3 + 0.1})`
        : `rgba(196, 30, 58, ${Math.random() * 0.2 + 0.05})`,
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // Draw faint connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(196, 30, 58, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();


// ===== NAVBAR SCROLL EFFECT =====
(function initNavbar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ===== MOBILE NAV TOGGLE =====
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
})();


// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
})();


// ===== ANIMATED COUNTERS =====
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
})();


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('main-nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
})();


// ===== PARALLAX ON HERO STAR =====
(function initParallax() {
  const star = document.querySelector('.hero-star');
  if (!star) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        star.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.05}deg) scale(${1 + scrolled * 0.0003})`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


// ===== ACTIVE NAV LINK HIGHLIGHT =====
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--gold-primary)';
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
})();


// ===== CONSOLE EASTER EGG =====
console.log(
  '%c☭ WORKERS OF THE WORLD, UNITE! ☭',
  'color: #c41e3a; font-size: 24px; font-weight: bold; text-shadow: 1px 1px 0 #d4a843;'
);
console.log(
  '%cThe Union of Soviet Socialist Republics — Mock Government Portal',
  'color: #d4a843; font-size: 12px;'
);
