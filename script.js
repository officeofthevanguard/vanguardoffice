/* ===================================================
   USSR Mock Government — Interactive Script
   =================================================== */

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


// ===== SUPABASE AUTHENTICATION SYSTEM =====
(function initSupabaseAuth() {
  const supabaseUrl = 'https://ivrsryervygjmncwlgdn.supabase.co';
  const supabaseKey = 'sb_publishable_Rsh_coNUNyNTvfiQ-42yQA_tOVqOaLk';

  // Check if supabase object is available (loaded via script CDN)
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.warn('Supabase library is not loaded yet.');
    return;
  }

  const client = supabase.createClient(supabaseUrl, supabaseKey);

  const authContainer = document.getElementById('auth-nav-container');
  const loginBtn = document.getElementById('btn-login');
  
  const modal = document.getElementById('passport-modal');
  const closeBtn = document.getElementById('passport-close-btn');
  const signOutBtn = document.getElementById('btn-signout');

  const avatarImg = document.getElementById('passport-avatar');
  const lastNameVal = document.getElementById('passport-lastname');
  const firstNameVal = document.getElementById('passport-firstname');
  const passportNumVal = document.getElementById('passport-number');
  const originVal = document.getElementById('passport-origin');

  if (!authContainer) return;

  // Open / Close Passport modal helper functions
  function openModal() {
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Handle Login Click
  async function handleLogin() {
    try {
      if (window.location.protocol === 'file:') {
        alert('☭ OAuth Redirection Alert ☭\n\nDiscord OAuth login requires a web server to redirect back to. Please run this page via a local web server (e.g. using Python or Live Server at http://localhost:8000) rather than opening the file:// directly in your browser.');
        return;
      }
      const { error } = await client.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error logging in:', err.message);
      alert('Login failed. Please verify Supabase configuration.');
    }
  }

  // Handle Sign Out Click
  async function handleSignOut() {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      closeModal();
    } catch (err) {
      console.error('Error signing out:', err.message);
    }
  }

  const adminModal = document.getElementById('admin-dashboard-modal');
  const adminCloseBtn = document.getElementById('admin-close-btn');
  const adminAvatarImg = document.getElementById('admin-user-avatar');
  
  const editModal = document.getElementById('citizen-edit-modal');
  const editCloseBtn = document.getElementById('edit-close-btn');
  const editForm = document.getElementById('edit-citizen-form');
  
  const citizenTableBody = document.getElementById('citizen-table-body');
  const searchInput = document.getElementById('citizen-search-input');
  
  const decreeForm = document.getElementById('publish-decree-form');
  const decreesListContainer = document.querySelector('.decrees-list');

  // ===== CITIZEN DATABASE MANAGER =====
  function getCitizensList() {
    let list = localStorage.getItem('ussr_citizens');
    if (!list) {
      const defaultCitizens = [
        {
          id: '1370863094972026921', // Discord ID
          name: 'Lester',
          passportId: 'SU-9A5D1E23',
          ministry: 'Politburo',
          origin: 'General Secretary',
          medals: ['⭐', '🎖️', '🛠️'],
          avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23d4a843"><circle cx="50" cy="50" r="45" fill="none" stroke="%23d4a843" stroke-width="5"/><text x="50%" y="65%" text-anchor="middle" font-size="45">☭</text></svg>'
        },
        {
          id: 'mock_vladimir',
          name: 'Vladimir Ivanov',
          passportId: 'SU-A1B2C3D4',
          ministry: 'Supreme Soviet',
          origin: 'Deputy of the People',
          medals: ['⭐', '🎖️'],
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
        },
        {
          id: 'mock_elena',
          name: 'Elena Rostova',
          passportId: 'SU-E5F6A7B8',
          ministry: 'State Security (KGB)',
          origin: 'Commissar of Security',
          medals: ['🔥'],
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
        },
        {
          id: 'mock_nikita',
          name: 'Nikita Kozlov',
          passportId: 'SU-3F4A2C8D',
          ministry: 'Council of Ministers',
          origin: 'Minister of Digital Affairs',
          medals: ['🛠️'],
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
        },
        {
          id: 'mock_olga',
          name: 'Olga Fedorova',
          passportId: 'SU-8C7B6A5D',
          ministry: 'Proletariat',
          origin: 'Stakhanovite Worker',
          medals: [],
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
        }
      ];
      localStorage.setItem('ussr_citizens', JSON.stringify(defaultCitizens));
      return defaultCitizens;
    }
    return JSON.parse(list);
  }

  function saveCitizensList(list) {
    localStorage.setItem('ussr_citizens', JSON.stringify(list));
  }

  function registerOrUpdateCitizen(user) {
    const list = getCitizensList();
    const shortId = user.id.replace(/-/g, '').slice(0, 8).toUpperCase();
    const passportId = `SU-${shortId}`;
    const username = user.user_metadata.full_name || user.user_metadata.name || user.email || 'Comrade';
    const avatarUrl = user.user_metadata.avatar_url || '';

    let citizen = list.find(c => c.id === user.id || c.passportId === passportId || (user.user_metadata.sub && c.id === user.user_metadata.sub));
    
    if (!citizen) {
      // Bind Lester if his Discord sub matches
      if (shortId === '9A5D1E23' || (user.user_metadata.sub && user.user_metadata.sub === '1370863094972026921')) {
        const lesterIdx = list.findIndex(c => c.id === '1370863094972026921');
        if (lesterIdx !== -1) {
          list[lesterIdx].id = user.id; // Map UUID
          list[lesterIdx].avatar = avatarUrl || list[lesterIdx].avatar;
          citizen = list[lesterIdx];
        }
      }
    }

    if (!citizen) {
      const hash = user.id.charCodeAt(0) + (user.id.charCodeAt(1) || 0);
      const roles = ['PROLETARIAT', 'SUPREME SOVIET MEMBER', 'RED ARMY COMMISSAR', 'SOVNET ENGINEER', 'POLITBURO DEPUTY', 'STAKHANOVITE WORKER'];
      const defaultRole = roles[hash % roles.length];
      
      citizen = {
        id: user.id,
        name: username,
        passportId: passportId,
        ministry: 'Proletariat',
        origin: defaultRole,
        medals: [],
        avatar: avatarUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23d4a843"><circle cx="50" cy="50" r="45" fill="none" stroke="%23d4a843" stroke-width="5"/><text x="50%" y="65%" text-anchor="middle" font-size="45">☭</text></svg>'
      };
      list.push(citizen);
    } else {
      citizen.name = username;
      if (avatarUrl) citizen.avatar = avatarUrl;
    }
    
    saveCitizensList(list);
    return citizen;
  }

  // ===== DECREE DATA STATE MANAGER =====
  function getCustomDecrees() {
    const decs = localStorage.getItem('ussr_custom_decrees');
    return decs ? JSON.parse(decs) : [];
  }

  function saveCustomDecrees(decs) {
    localStorage.setItem('ussr_custom_decrees', JSON.stringify(decs));
  }

  function renderCustomDecreesOnLoad() {
    if (!decreesListContainer) return;
    const decs = getCustomDecrees();
    decs.forEach(d => {
      prependDecreeToDOM(d);
    });
  }

  function prependDecreeToDOM(decree) {
    const item = document.createElement('div');
    item.className = 'decree-item reveal revealed';
    
    const tagClass = decree.type === 'Announcement' ? 'decree-tag tag-gold' : 'decree-tag';
    
    const dateObj = new Date(decree.date);
    const day = dateObj.getDate();
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const monthYear = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    item.innerHTML = `
      <div class="decree-date">
        <div class="day">${day}</div>
        <div class="month">${monthYear}</div>
      </div>
      <div class="decree-content">
        <span class="${tagClass}">${decree.type}</span>
        <h3 class="decree-title">${decree.title}</h3>
        <p class="decree-excerpt">${decree.excerpt}</p>
      </div>
    `;
    
    decreesListContainer.insertBefore(item, decreesListContainer.firstChild);
  }

  // ===== ADMIN TABLE RENDERER =====
  function renderCitizenTable(filterText = '') {
    if (!citizenTableBody) return;
    citizenTableBody.innerHTML = '';
    const list = getCitizensList();
    const query = filterText.toLowerCase();

    const filtered = list.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.passportId.toLowerCase().includes(query) ||
      c.ministry.toLowerCase().includes(query)
    );

    filtered.forEach(c => {
      const row = document.createElement('tr');
      const medalsHtml = c.medals && c.medals.length > 0 
        ? c.medals.map(m => `<span style="font-size:1.1rem; margin-right:2px;" title="Medal">${m}</span>`).join('')
        : `<span style="color:var(--text-muted); font-size:0.75rem;">None</span>`;

      row.innerHTML = `
        <td><img src="${c.avatar}" alt="Avatar" class="table-avatar"></td>
        <td><span class="table-name">${c.name}</span></td>
        <td><span class="table-id">${c.passportId}</span></td>
        <td>
          <div class="table-ministry">${c.ministry}</div>
          <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">${c.origin}</div>
        </td>
        <td><div class="table-medals">${medalsHtml}</div></td>
        <td>
          <button class="btn btn-secondary table-action-btn" data-citizen-id="${c.id}">Reassign</button>
        </td>
      `;

      const reassignBtn = row.querySelector('.table-action-btn');
      reassignBtn.addEventListener('click', () => openEditCitizenModal(c.id));

      citizenTableBody.appendChild(row);
    });
  }

  function openEditCitizenModal(citizenId) {
    const list = getCitizensList();
    const citizen = list.find(c => c.id === citizenId);
    if (!citizen) return;

    document.getElementById('edit-citizen-id').value = citizen.id;
    document.getElementById('edit-citizen-name').value = citizen.name;
    document.getElementById('edit-citizen-ministry').value = citizen.ministry;

    const checkboxes = editModal.querySelectorAll('.medal-check');
    checkboxes.forEach(box => {
      box.checked = citizen.medals && citizen.medals.includes(box.value);
    });

    if (editModal) editModal.classList.add('active');
  }

  // ===== LISTENERS & HANDLERS =====
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', () => {
      if (adminModal) adminModal.classList.remove('active');
    });
  }
  
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) adminModal.classList.remove('active');
    });
  }

  if (editCloseBtn) {
    editCloseBtn.addEventListener('click', () => {
      if (editModal) editModal.classList.remove('active');
    });
  }

  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) editModal.classList.remove('active');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderCitizenTable(e.target.value);
    });
  }

  // Handle Tab switches
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-pane').forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const paneId = `pane-${tab.dataset.tab}`;
      const pane = document.getElementById(paneId);
      if (pane) pane.classList.add('active');
    });
  });

  // Handle edit citizen submit
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const citizenId = document.getElementById('edit-citizen-id').value;
      const newMinistry = document.getElementById('edit-citizen-ministry').value;
      
      const checkedMedals = [];
      editModal.querySelectorAll('.medal-check').forEach(box => {
        if (box.checked) checkedMedals.push(box.value);
      });

      const list = getCitizensList();
      const idx = list.findIndex(c => c.id === citizenId);
      if (idx !== -1) {
        list[idx].ministry = newMinistry;
        list[idx].medals = checkedMedals;
        saveCitizensList(list);

        // Force reload state if current user is edited
        client.auth.getSession().then(({ data: { session } }) => {
          if (session && session.user && session.user.id === citizenId) {
            renderAuthState(session);
          }
        });

        renderCitizenTable(searchInput ? searchInput.value : '');
        if (editModal) editModal.classList.remove('active');
      }
    });
  }

  // Handle publish decree submit
  if (decreeForm) {
    decreeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('decree-type').value;
      const title = document.getElementById('decree-title-input').value;
      const excerpt = document.getElementById('decree-excerpt-input').value;

      const newDecree = {
        type,
        title,
        excerpt,
        date: new Date().toISOString()
      };

      const decs = getCustomDecrees();
      decs.push(newDecree);
      saveCustomDecrees(decs);

      prependDecreeToDOM(newDecree);

      decreeForm.reset();
      alert('☭ Decree Published successfully to the State Gazette! ☭');
    });
  }

  // ===== UPDATE DOM BY SESSION =====
  function renderAuthState(session) {
    const existingBadge = authContainer.querySelector('.citizen-profile-badge');
    if (existingBadge) existingBadge.remove();
    const existingAdminBtn = authContainer.querySelector('.btn-admin-link');
    if (existingAdminBtn) existingAdminBtn.remove();

    if (session && session.user) {
      const user = session.user;
      
      const citizen = registerOrUpdateCitizen(user);
      
      if (loginBtn) loginBtn.style.display = 'none';

      // Admin role validator (by user UID prefix or Discord ID)
      const shortId = user.id.replace(/-/g, '').slice(0, 8).toUpperCase();
      const isOwner = shortId === '9A5D1E23' || (user.user_metadata.sub && user.user_metadata.sub === '1370863094972026921');

      if (isOwner) {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'btn-admin-panel';
        adminBtn.className = 'btn-admin-link';
        adminBtn.innerHTML = '☭ Admin Panel';
        adminBtn.addEventListener('click', () => {
          if (adminModal) adminModal.classList.add('active');
          if (adminAvatarImg) adminAvatarImg.src = citizen.avatar;
          renderCitizenTable();
        });
        authContainer.appendChild(adminBtn);
      }

      const badge = document.createElement('div');
      badge.className = 'citizen-profile-badge';
      
      badge.innerHTML = `
        <img src="${citizen.avatar}" alt="Avatar" class="citizen-avatar">
        <span class="citizen-name">☭ ${citizen.name.split(' ')[0]}</span>
      `;

      badge.addEventListener('click', openModal);
      authContainer.appendChild(badge);

      if (avatarImg) avatarImg.src = citizen.avatar;
      
      const nameParts = citizen.name.split(' ');
      if (lastNameVal) lastNameVal.textContent = (nameParts[1] || 'COMRADE').toUpperCase();
      if (firstNameVal) firstNameVal.textContent = nameParts[0].toUpperCase();
      if (passportNumVal) passportNumVal.textContent = citizen.passportId;
      if (originVal) originVal.textContent = citizen.origin.toUpperCase();

      const passportStatus = document.getElementById('passport-status');
      if (passportStatus) {
        const medalsText = citizen.medals && citizen.medals.length > 0 ? ` [${citizen.medals.join('')}]` : '';
        passportStatus.textContent = `${citizen.ministry.toUpperCase()}${medalsText}`;
      }

    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      
      if (avatarImg) avatarImg.src = '';
      if (lastNameVal) lastNameVal.textContent = 'COMRADE';
      if (firstNameVal) firstNameVal.textContent = 'DISCORD USER';
      if (passportNumVal) passportNumVal.textContent = 'SU-00000000';
      if (originVal) originVal.textContent = 'PROLETARIAT';
      
      const passportStatus = document.getElementById('passport-status');
      if (passportStatus) passportStatus.textContent = 'PROLETARIAT';
    }
  }

  // Subscribe to auth state changes
  client.auth.onAuthStateChange((event, session) => {
    console.log(`Auth event: ${event}`);
    renderAuthState(session);
  });

  // Initial check
  client.auth.getSession().then(({ data: { session } }) => {
    renderAuthState(session);
    renderCustomDecreesOnLoad();
  });

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
