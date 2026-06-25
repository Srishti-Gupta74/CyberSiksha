// ============================================================
// CyberSiksha — Enhanced App Logic
// Auth, levels, categories, toasts, confetti, Supabase sync
// ============================================================

// ==================== STATE ====================
const S = {
  scamIQ: 0,
  xp: 0,
  streak: 0,
  completedLessons: new Set(),
  qCorrect: 0,
  qWrong: 0,
  qXP: 0,
  qIdx: 0,
  qOrder: [],
  qDone: false,
  familyMembers: [],
  familyGroupId: null,
  inviteCode: null,
  geminiKey: '',
  activePanel: 'home',
  activeCat: 'all',
  isGuest: false,
  userName: 'Cyber Learner'
};

// ==================== LEVELS ====================
const LEVELS = [
  { min: 0,  name: 'Cyber Newbie',    icon: '🌱', cls: 'lv1' },
  { min: 20, name: 'Cyber Aware',     icon: '🔍', cls: 'lv2' },
  { min: 40, name: 'Cyber Scout',     icon: '🛡️', cls: 'lv3' },
  { min: 60, name: 'Cyber Shield',    icon: '⚔️', cls: 'lv4' },
  { min: 80, name: 'Cyber Guardian',  icon: '👑', cls: 'lv5' },
];

function getLevel(iq) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (iq >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

// Category → color mapping for lesson card icons
const CAT_COLORS = {
  'SMS Scams': { bg: 'var(--cat-sms-dim)', color: 'var(--cat-sms)' },
  'UPI Scams': { bg: 'var(--cat-upi-dim)', color: 'var(--cat-upi)' },
  'Call Scams': { bg: 'var(--cat-call-dim)', color: 'var(--cat-call)' },
  'Job Scams': { bg: 'var(--cat-job-dim)', color: 'var(--cat-job)' },
  'Account Safety': { bg: 'var(--cat-account-dim)', color: 'var(--cat-account)' },
  'Shopping Scams': { bg: 'var(--cat-shopping-dim)', color: 'var(--cat-shopping)' },
  'QR Scams': { bg: 'var(--cat-qr-dim)', color: 'var(--cat-qr)' },
  'WhatsApp Scams': { bg: 'var(--cat-whatsapp-dim)', color: 'var(--cat-whatsapp)' },
  'Phone Scams': { bg: 'var(--cat-phone-dim)', color: 'var(--cat-phone)' },
  'Investment Scams': { bg: 'var(--cat-investment-dim)', color: 'var(--cat-investment)' },
  'Social Media Scams': { bg: 'var(--cat-social-dim)', color: 'var(--cat-social)' },
  'Identity Theft': { bg: 'var(--cat-identity-dim)', color: 'var(--cat-identity)' },
  'Loan Scams': { bg: 'var(--cat-loan-dim)', color: 'var(--cat-loan)' },
  'Romance Scams': { bg: 'var(--cat-romance-dim)', color: 'var(--cat-romance)' },
  'Network Safety': { bg: 'var(--cat-network-dim)', color: 'var(--cat-network)' },
};

function getCatStyle(category) {
  return CAT_COLORS[category] || { bg: 'var(--violet-dim)', color: 'var(--violet)' };
}

// ==================== PERSISTENCE ====================
function loadLocal() {
  try {
    const d = JSON.parse(localStorage.getItem('cs_state') || '{}');
    S.xp = d.xp || 0;
    S.completedLessons = new Set(d.completedLessons || []);
    S.familyMembers = d.familyMembers || [];
    S.streak = d.streak || 0;
    S.familyGroupId = d.familyGroupId || null;
    S.inviteCode = d.inviteCode || null;
    checkStreak(d);
    recalcIQ();
  } catch (e) {}
  S.geminiKey = localStorage.getItem('cs_gemini') || '';
}

function saveLocal() {
  localStorage.setItem('cs_state', JSON.stringify({
    xp: S.xp,
    completedLessons: Array.from(S.completedLessons),
    familyMembers: S.familyMembers,
    streak: S.streak,
    familyGroupId: S.familyGroupId,
    inviteCode: S.inviteCode,
    lastDate: new Date().toDateString()
  }));
}

function checkStreak(d) {
  if (d.lastDate) {
    const diff = Math.floor((new Date() - new Date(d.lastDate)) / 86400000);
    if (diff === 1) S.streak = (d.streak || 0) + 1;
    else if (diff > 1) S.streak = 0;
  }
}

function recalcIQ() {
  const totalLessons = typeof LESSONS !== 'undefined' ? LESSONS.length : 6;
  const ls = (S.completedLessons.size / totalLessons) * 60;
  const xs = Math.min(S.xp / 500, 1) * 40;
  S.scamIQ = Math.round(ls + xs);
}

// ==================== TOAST ====================
function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ==================== CONFETTI ====================
const confetti = {
  canvas: null, ctx: null, particles: [], active: false,
  init() {
    this.canvas = document.getElementById('confetti-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },
  resize() { this.canvas.width = innerWidth; this.canvas.height = innerHeight; },
  fire(n = 70) {
    const colors = ['#10b981','#8b5cf6','#f43f5e','#f59e0b','#38bdf8','#ec4899'];
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: innerWidth/2 + (Math.random()-0.5)*180,
        y: innerHeight/2,
        vx: (Math.random()-0.5)*11,
        vy: -Math.random()*13 - 4,
        w: Math.random()*7 + 3, h: Math.random()*5 + 2,
        c: colors[Math.floor(Math.random()*colors.length)],
        r: Math.random()*360, rs: (Math.random()-0.5)*9,
        g: 0.11 + Math.random()*0.07,
        o: 1, d: 0.007 + Math.random()*0.005
      });
    }
    if (!this.active) { this.active = true; this.loop(); }
  },
  loop() {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.particles = this.particles.filter(p => p.o > 0.01);
    for (const p of this.particles) {
      p.x += p.vx; p.vy += p.g; p.y += p.vy;
      p.vx *= 0.99; p.r += p.rs; p.o -= p.d;
      this.ctx.save();
      this.ctx.translate(p.x,p.y);
      this.ctx.rotate(p.r*Math.PI/180);
      this.ctx.globalAlpha = p.o;
      this.ctx.fillStyle = p.c;
      this.ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      this.ctx.restore();
    }
    if (this.particles.length) requestAnimationFrame(() => this.loop());
    else this.active = false;
  }
};

// ==================== ANIMATION HELPERS ====================
function animNum(el, to, dur = 700) {
  const start = parseInt(el.textContent) || 0;
  if (start === to) return;
  const t0 = performance.now();
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (to - start) * e);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setRing(val) {
  const r = document.getElementById('iq-ring');
  if (!r) return;
  const circ = 2 * Math.PI * 56;
  r.style.strokeDasharray = circ;
  r.style.strokeDashoffset = circ - (val / 100) * circ;
}

// ==================== NAV ====================
function initNav() {
  document.querySelectorAll('.nav-item').forEach(b => {
    b.addEventListener('click', () => switchPanel(b.dataset.panel));
  });
}

function switchPanel(id) {
  S.activePanel = id;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.panel === id));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) { panel.classList.add('active'); panel.style.animation = 'none'; panel.offsetHeight; panel.style.animation = ''; }
  if (id === 'learn') {
    document.getElementById('learn-list').style.display = '';
    document.getElementById('lesson-detail').classList.remove('show');
  }
}

// ==================== AUTH UI ====================
function initAuthUI() {
  const overlay = document.getElementById('auth-overlay');

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    // Auto-skip to guest mode
    overlay.classList.add('hidden');
    S.isGuest = true;
    return;
  }

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const form = tab.dataset.form;
      document.getElementById('form-signin').classList.toggle('hidden', form !== 'signin');
      document.getElementById('form-signup').classList.toggle('hidden', form !== 'signup');
      hideAuthMessages();
    });
  });

  // Sign In
  document.getElementById('form-signin').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthMessages();
    const btn = document.getElementById('signin-btn');
    btn.disabled = true; btn.textContent = 'Signing in...';
    try {
      await signIn(
        document.getElementById('si-email').value,
        document.getElementById('si-pass').value
      );
      overlay.classList.add('hidden');
      onAuthSuccess();
    } catch (err) {
      showAuthError(err.message);
    }
    btn.disabled = false; btn.textContent = 'Sign In';
  });

  // Sign Up
  document.getElementById('form-signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthMessages();
    const btn = document.getElementById('signup-btn');
    btn.disabled = true; btn.textContent = 'Creating...';
    try {
      const result = await signUp(
        document.getElementById('su-email').value,
        document.getElementById('su-pass').value,
        document.getElementById('su-name').value
      );
      if (result.session) {
        overlay.classList.add('hidden');
        onAuthSuccess();
      } else {
        showAuthSuccess('Account created! Check your email to confirm, then sign in.');
      }
    } catch (err) {
      showAuthError(err.message);
    }
    btn.disabled = false; btn.textContent = 'Create Account';
  });

  // Skip / Guest
  document.getElementById('skip-auth').addEventListener('click', () => {
    overlay.classList.add('hidden');
    S.isGuest = true;
  });

  // Check existing session
  checkSession(overlay);
}

async function checkSession(overlay) {
  try {
    const session = await getSession();
    if (session) {
      overlay.classList.add('hidden');
      onAuthSuccess();
      return;
    }
  } catch (e) {}

  // Check URL for invite code
  const params = new URLSearchParams(window.location.search);
  const invite = params.get('invite');
  if (invite) {
    localStorage.setItem('cybersiksha_pending_invite', invite);
    // Show signup tab
    document.getElementById('tab-signup').click();
  }
}

function onAuthSuccess() {
  S.isGuest = false;
  if (currentUser) {
    S.userName = userProfile?.display_name || currentUser.email.split('@')[0];
    document.getElementById('dash-name').textContent = S.userName;
    document.getElementById('user-name').textContent = S.userName;
    document.getElementById('user-avatar').textContent = S.userName.charAt(0).toUpperCase();
    document.getElementById('user-bar').classList.remove('hidden');

    // Sign out handler
    document.getElementById('signout-btn').onclick = async () => {
      await signOut();
      S.isGuest = true;
      document.getElementById('user-bar').classList.add('hidden');
      document.getElementById('auth-overlay').classList.remove('hidden');
    };

    // Load cloud progress
    loadCloudProgress();
    // Load family data
    loadFamilyData();
  }
  toast('Welcome back! 👋');
}

async function loadCloudProgress() {
  try {
    const cloud = await loadProgressFromCloud();
    if (cloud) {
      // Merge: take the higher value
      S.xp = Math.max(S.xp, cloud.xp);
      S.streak = Math.max(S.streak, cloud.streak);
      cloud.completedLessons.forEach(id => S.completedLessons.add(id));
      saveLocal();
      recalcIQ();
      updateDashboard();
    }
  } catch (e) { console.log('Cloud sync skipped:', e.message); }
}

async function syncToCloud() {
  if (S.isGuest || !currentUser) return;
  try {
    await syncProgressToCloud(S);
  } catch (e) { console.log('Cloud sync error:', e.message); }
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg; el.classList.add('show');
}
function showAuthSuccess(msg) {
  const el = document.getElementById('auth-success');
  el.textContent = msg; el.classList.add('show');
}
function hideAuthMessages() {
  document.getElementById('auth-error').classList.remove('show');
  document.getElementById('auth-success').classList.remove('show');
}

// ==================== DASHBOARD ====================
function updateDashboard() {
  recalcIQ();
  const lv = getLevel(S.scamIQ);

  // Topbar
  animNum(document.getElementById('topbar-iq-val'), S.scamIQ, 500);

  // Hero
  animNum(document.getElementById('hero-iq'), S.scamIQ, 800);
  setTimeout(() => setRing(S.scamIQ), 80);

  // Level badge
  const badge = document.getElementById('level-badge');
  badge.textContent = `${lv.icon} ${lv.name}`;
  badge.className = `level-badge ${lv.cls}`;

  // Stats
  animNum(document.getElementById('s-xp'), S.xp, 600);
  document.getElementById('s-streak').textContent = S.streak;
  const totalLessons = typeof LESSONS !== 'undefined' ? LESSONS.length : 6;
  document.getElementById('s-lessons').textContent = `${S.completedLessons.size}/${totalLessons}`;

  // Continue learning card
  const next = (typeof LESSONS !== 'undefined') ? LESSONS.find(l => !S.completedLessons.has(l.id)) : null;
  const cc = document.getElementById('continue-card');
  if (next) {
    cc.classList.remove('hidden');
    document.getElementById('cont-title').textContent = `${next.icon} ${next.title}`;
    document.getElementById('cont-meta').textContent = `${next.category} · ${next.difficulty} · ${next.duration}`;
    cc.onclick = () => { switchPanel('learn'); setTimeout(() => openLesson(next), 100); };
  } else {
    cc.classList.add('hidden');
  }

  // Badges
  renderBadges();

  // Progress list
  renderProgress();
}

function renderBadges() {
  const defs = [
    { icon:'🎓', name:'First Lesson', ok: () => S.completedLessons.size >= 1 },
    { icon:'📖', name:'Scholar', ok: () => S.completedLessons.size >= 5 },
    { icon:'🏆', name:'Master', ok: () => typeof LESSONS !== 'undefined' && S.completedLessons.size >= LESSONS.length },
    { icon:'⭐', name:'100 XP', ok: () => S.xp >= 100 },
    { icon:'💎', name:'300 XP', ok: () => S.xp >= 300 },
    { icon:'🔥', name:'3-Day Streak', ok: () => S.streak >= 3 },
    { icon:'🧠', name:'Quiz Pro', ok: () => S.xp >= 200 },
  ];
  document.getElementById('badges').innerHTML = defs.map(b => {
    const u = b.ok();
    return `<span class="badge-pill ${u ? 'unlocked' : 'locked'}">${b.icon} ${b.name}</span>`;
  }).join('');
}

function renderProgress() {
  if (typeof LESSONS === 'undefined') return;
  document.getElementById('prog-list').innerHTML = LESSONS.map(l => {
    const d = S.completedLessons.has(l.id);
    return `<div class="prog-item"><div class="p-left"><span class="p-icon">${l.icon}</span><span class="p-title">${l.title}</span></div><span class="status-pill ${d ? 'done' : 'todo'}">${d ? '✅ Done' : 'Pending'}</span></div>`;
  }).join('');
}

// ==================== LEARN ====================
function initLearn() {
  if (typeof LESSONS === 'undefined') return;

  // Category filter
  const cats = ['All', ...new Set(LESSONS.map(l => l.category))];
  const filterEl = document.getElementById('cat-filter');
  filterEl.innerHTML = cats.map(c => {
    const id = c === 'All' ? 'all' : c;
    return `<button class="cat-chip ${c === 'All' ? 'active' : ''}" data-cat="${id}">${c}</button>`;
  }).join('');

  filterEl.querySelectorAll('.cat-chip').forEach(ch => {
    ch.addEventListener('click', () => {
      filterEl.querySelectorAll('.cat-chip').forEach(x => x.classList.remove('active'));
      ch.classList.add('active');
      S.activeCat = ch.dataset.cat;
      renderLessons();
    });
  });

  renderLessons();

  document.getElementById('back-lessons').addEventListener('click', () => {
    document.getElementById('learn-list').style.display = '';
    document.getElementById('lesson-detail').classList.remove('show');
  });
}

function renderLessons() {
  if (typeof LESSONS === 'undefined') return;
  const filtered = S.activeCat === 'all' ? LESSONS : LESSONS.filter(l => l.category === S.activeCat);
  const grid = document.getElementById('lesson-grid');
  grid.innerHTML = filtered.map(l => {
    const done = S.completedLessons.has(l.id);
    const cs = getCatStyle(l.category);
    return `
      <div class="card lesson-card clickable" data-lid="${l.id}">
        <div class="lc-icon" style="background:${cs.bg}">${l.icon}</div>
        <div class="lc-body">
          <div class="lc-title">${l.title}</div>
          <div class="lc-meta">
            <span class="tag ${l.difficulty.toLowerCase()}">${l.difficulty}</span>
            <span class="tag time">${l.duration}</span>
            <span class="tag cat" style="background:${cs.bg};color:${cs.color}">${l.category}</span>
          </div>
        </div>
        <div class="lc-dot ${done ? 'done' : ''}"></div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.lesson-card').forEach(c => {
    c.addEventListener('click', () => {
      const lesson = LESSONS.find(l => l.id === parseInt(c.dataset.lid));
      if (lesson) openLesson(lesson);
    });
  });
}

function openLesson(lesson) {
  document.getElementById('learn-list').style.display = 'none';
  const det = document.getElementById('lesson-detail');
  det.classList.add('show');

  document.getElementById('det-title').textContent = `${lesson.icon} ${lesson.title}`;
  document.getElementById('det-meta').textContent = `${lesson.category} · ${lesson.difficulty} · ${lesson.duration}`;

  document.getElementById('det-content').innerHTML = lesson.content.map(b => {
    if (b.type === 'text') return `<div class="block text">${b.value}</div>`;
    if (b.type === 'example') return `<div class="block example">${b.value}</div>`;
    if (b.type === 'tip') return `<div class="block tip">💡 ${b.value}</div>`;
    return '';
  }).join('');

  document.getElementById('det-flags-ul').innerHTML = lesson.redFlags.map(f => `<li>${f}</li>`).join('');

  const btn = document.getElementById('det-complete');
  const done = S.completedLessons.has(lesson.id);
  btn.textContent = done ? '✅ Already Completed' : '✅ Complete — Earn 20 XP';
  btn.disabled = done;
  btn.onclick = () => {
    if (!S.completedLessons.has(lesson.id)) {
      S.completedLessons.add(lesson.id);
      S.xp += 20;
      saveLocal(); syncToCloud();
      updateDashboard();
      btn.textContent = '🎉 Done! +20 XP';
      btn.disabled = true;
      confetti.fire(50);
      toast('+20 XP — Lesson complete!');
      renderLessons();
    }
  };

  det.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== QUIZ ====================
function initQuiz() {
  if (typeof QUIZZES === 'undefined') return;
  S.qCorrect = 0; S.qWrong = 0; S.qXP = 0; S.qIdx = 0; S.qDone = false;

  S.qOrder = QUIZZES.map((_, i) => i);
  for (let i = S.qOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [S.qOrder[i], S.qOrder[j]] = [S.qOrder[j], S.qOrder[i]];
  }

  document.getElementById('quiz-summary').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('quiz-scores').classList.remove('hidden');
  document.getElementById('q-prog-text').classList.remove('hidden');
  document.querySelector('.q-prog-bar').classList.remove('hidden');
  updateQScores();
  renderQ();
}

function updateQScores() {
  if (typeof QUIZZES === 'undefined') return;
  document.getElementById('qc').textContent = S.qCorrect;
  document.getElementById('qw').textContent = S.qWrong;
  document.getElementById('qx').textContent = S.qXP;
  document.getElementById('q-prog-text').textContent = `Question ${Math.min(S.qIdx + 1, QUIZZES.length)} of ${QUIZZES.length}`;
  document.getElementById('q-fill').style.width = `${((S.qIdx + 1) / QUIZZES.length) * 100}%`;
}

function renderQ() {
  if (typeof QUIZZES === 'undefined') return;
  if (S.qIdx >= QUIZZES.length) { showQSummary(); return; }

  const q = QUIZZES[S.qOrder[S.qIdx]];
  S.qDone = false;

  document.getElementById('quiz-area').innerHTML = `
    <div class="card quiz-card" style="animation:panelIn 0.35s var(--ease)">
      <span class="q-type">${q.type}</span>
      <span class="tag ${q.difficulty === 'Easy' ? 'beginner' : q.difficulty === 'Medium' ? 'intermediate' : 'advanced'}" style="margin-left:6px">${q.difficulty}</span>
      <div class="q-scenario">${q.scenario}</div>
      <div class="q-actions">
        <button class="q-btn safe" id="b-safe">✅ SAFE</button>
        <button class="q-btn scam" id="b-scam">🚨 SCAM</button>
      </div>
      <div class="q-feedback" id="q-fb"></div>
      <button class="q-next" id="q-next">Next →</button>
    </div>`;

  document.getElementById('b-safe').addEventListener('click', () => answerQ(false, q));
  document.getElementById('b-scam').addEventListener('click', () => answerQ(true, q));
  document.getElementById('q-next').addEventListener('click', () => { S.qIdx++; updateQScores(); renderQ(); });
}

function answerQ(scam, q) {
  if (S.qDone) return;
  S.qDone = true;

  const ok = scam === q.isScam;
  const fb = document.getElementById('q-fb');
  const nx = document.getElementById('q-next');

  if (ok) {
    S.qCorrect++;
    const xp = q.difficulty === 'Easy' ? 10 : q.difficulty === 'Medium' ? 15 : 20;
    S.qXP += xp; S.xp += xp;
    fb.className = 'q-feedback ok show';
    fb.innerHTML = `<h4>✅ Correct! +${xp} XP</h4><p>${q.explanation}</p>`;
    confetti.fire(25);
  } else {
    S.qWrong++;
    fb.className = 'q-feedback nope show';
    fb.innerHTML = `<h4>❌ Wrong — ${q.isScam ? 'SCAM' : 'SAFE'}</h4><p>${q.explanation}</p>`;
    const card = fb.closest('.quiz-card');
    card.style.animation = 'shake 0.45s ease';
    setTimeout(() => card.style.animation = '', 500);
  }

  nx.classList.add('show');
  document.getElementById('b-safe').disabled = true;
  document.getElementById('b-scam').disabled = true;
  updateQScores(); saveLocal(); syncToCloud(); updateDashboard();
}

function showQSummary() {
  if (typeof QUIZZES === 'undefined') return;
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('quiz-scores').classList.add('hidden');
  document.getElementById('q-prog-text').classList.add('hidden');
  document.querySelector('.q-prog-bar').classList.add('hidden');

  const t = QUIZZES.length;
  const pct = Math.round((S.qCorrect / t) * 100);
  const el = document.getElementById('quiz-summary');
  el.classList.remove('hidden');

  let msg = pct >= 90 ? '🏆 Outstanding! Scam-spotting expert!' :
            pct >= 70 ? '👏 Great awareness!' :
            pct >= 50 ? '📚 Good start! Review lessons.' : '⚠️ Keep learning!';

  el.innerHTML = `
    <h2>Quiz Complete!</h2>
    <div class="big-score">${S.qCorrect}/${t}</div>
    <p class="msg">${msg}</p>
    <p class="details">Accuracy: ${pct}% · XP: ${S.qXP}</p>
    <button class="btn btn-brand" id="q-retry">🔄 Play Again</button>`;

  document.getElementById('q-retry').addEventListener('click', initQuiz);
  if (pct >= 70) confetti.fire(90);
}

// ==================== NEWS ====================
function initNews() {
  if (typeof NEWS_ARTICLES === 'undefined') return;
  const grid = document.getElementById('news-grid');
  grid.innerHTML = NEWS_ARTICLES.map(a => `
    <div class="card news-card clickable" data-nid="${a.id}">
      <div class="news-top">
        <div class="news-title">${a.title}</div>
        <span class="news-chevron">▼</span>
      </div>
      <div class="news-meta"><span>${a.date}</span><span>·</span><span class="news-source">${a.source}</span></div>
      <p class="news-summary">${a.summary}</p>
      <div class="news-body" id="nb-${a.id}">
        <p>${a.details}</p>
        <div class="protect-box">
          <h4>🛡️ Protect Yourself</h4>
          <ul>${a.protection.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.news-card').forEach(c => {
    c.addEventListener('click', () => {
      const id = c.dataset.nid;
      const body = document.getElementById('nb-' + id);
      const wasOpen = body.classList.contains('open');
      grid.querySelectorAll('.news-body').forEach(b => b.classList.remove('open'));
      grid.querySelectorAll('.news-card').forEach(x => x.classList.remove('open'));
      if (!wasOpen) { body.classList.add('open'); c.classList.add('open'); }
    });
  });
}

// ==================== CHAT ====================
function initChat() {
  if (S.geminiKey) document.getElementById('api-bar').style.display = 'none';

  document.getElementById('api-key-go').addEventListener('click', () => {
    const k = document.getElementById('api-key-in').value.trim();
    if (k) { S.geminiKey = k; localStorage.setItem('cs_gemini', k); document.getElementById('api-bar').style.display = 'none'; toast('API key saved!'); }
  });

  document.getElementById('chat-go').addEventListener('click', sendMsg);
  document.getElementById('chat-in').addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });

  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => { document.getElementById('chat-in').value = c.dataset.q; sendMsg(); });
  });
}

async function sendMsg() {
  const inp = document.getElementById('chat-in');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  addBubble(msg, 'user');
  document.getElementById('chat-chips').style.display = 'none';

  if (!S.geminiKey) { addBubble('Please add your Gemini API key first — it\'s free!', 'bot'); return; }

  const tid = addTypingBubble();
  try {
    const res = await callGemini(msg);
    removeBubble(tid);
    addBubble(res, 'bot');
  } catch (e) {
    removeBubble(tid);
    addBubble('Error: ' + e.message, 'bot');
  }
}

function addBubble(text, who) {
  const c = document.getElementById('chat-msgs');
  const id = 'm' + Date.now() + Math.random().toString(36).substr(2,4);
  const d = document.createElement('div');
  d.className = `chat-msg ${who}`;
  d.id = id;
  d.innerHTML = `<div class="chat-av">${who === 'bot' ? '🤖' : '👤'}</div><div class="chat-bbl">${esc(text)}</div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
  return id;
}

function addTypingBubble() {
  const c = document.getElementById('chat-msgs');
  const id = 'typ' + Date.now();
  const d = document.createElement('div');
  d.className = 'chat-msg bot'; d.id = id;
  d.innerHTML = `<div class="chat-av">🤖</div><div class="chat-bbl"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
  return id;
}

function removeBubble(id) { document.getElementById(id)?.remove(); }

function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

async function callGemini(msg) {
  const sys = `You are CyberSiksha AI Mentor — warm, patient cybersecurity educator for elderly Indians, parents, children.
Rules: Simple language, real-world analogies, Indian scam patterns (UPI, KYC, digital arrest, challan), encouraging tone, 2-3 paragraphs max, Hindi/Hinglish ok, end with safety tip.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${S.geminiKey}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: sys + '\n\nUser: ' + msg }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
    })
  });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error?.message || `API ${r.status}`); }
  const d = await r.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not generate response.';
}

// ==================== FAMILY ====================
function initFamily() {
  renderFamily();

  document.getElementById('fam-invite-btn').addEventListener('click', async () => {
    const email = document.getElementById('fam-email-in').value.trim();
    if (!email) return;

    if (!S.isGuest && currentUser && isSupabaseConfigured()) {
      // Real Supabase invite
      try {
        if (!S.familyGroupId) {
          const group = await createFamilyGroup('My Family');
          S.familyGroupId = group.id;
          S.inviteCode = group.invite_code;
          saveLocal();
        }
        const link = await sendFamilyInvite(S.familyGroupId, email);
        toast(`Invite sent to ${email}!`);
        showInviteCode();
        loadFamilyData();
      } catch (e) {
        toast('Error: ' + e.message, 'error');
      }
    } else {
      // Guest mode — simulated
      S.familyMembers.push({
        name: email.split('@')[0],
        email: email,
        scamIQ: Math.floor(Math.random() * 40),
        lessonsCompleted: Math.floor(Math.random() * 3),
        quizAccuracy: Math.floor(Math.random() * 60) + '%'
      });
      saveLocal();
      renderFamily();
      toast(`Invited ${email} (demo mode)`);
    }

    document.getElementById('fam-email-in').value = '';
  });
}

function showInviteCode() {
  if (S.inviteCode) {
    const box = document.getElementById('invite-code-box');
    box.classList.remove('hidden');
    document.getElementById('invite-code').textContent = S.inviteCode;
  }
}

async function loadFamilyData() {
  if (S.isGuest || !currentUser || !isSupabaseConfigured()) return;

  try {
    const membership = await getMyFamilyGroup();
    if (membership) {
      S.familyGroupId = membership.family_group_id;
      if (membership.family_groups) {
        S.inviteCode = membership.family_groups.invite_code;
        showInviteCode();
      }

      const members = await getFamilyMembers(S.familyGroupId);
      // Render real family data
      renderCloudFamily(members);
    }
  } catch (e) {
    console.log('Family load error:', e.message);
  }
}

function renderCloudFamily(members) {
  const list = document.getElementById('family-list');
  list.innerHTML = members.map(m => {
    const p = m.profiles;
    const isMe = currentUser && p.id === currentUser.id;
    return `
      <div class="card fam-member">
        <div class="mem-info">
          <div class="mem-av" style="background:${isMe ? 'var(--g-brand)' : 'var(--g-violet)'}">${p.avatar_initial || '?'}</div>
          <div>
            <div class="mem-name">${p.display_name || 'User'}</div>
            <div class="mem-stats">XP: ${p.xp || 0} · Streak: ${p.streak || 0}</div>
          </div>
        </div>
        ${isMe ? '<span class="active-tag">You</span>' : '<button class="nudge">📩 Nudge</button>'}
      </div>`;
  }).join('');

  // Nudge handlers
  list.querySelectorAll('.nudge').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      b.textContent = '✅ Sent!'; b.classList.add('sent'); b.disabled = true;
      setTimeout(() => { b.textContent = '📩 Nudge'; b.classList.remove('sent'); b.disabled = false; }, 2500);
    });
  });
}

function renderFamily() {
  const list = document.getElementById('family-list');

  // Current user
  let html = `
    <div class="card fam-member">
      <div class="mem-info">
        <div class="mem-av" style="background:var(--g-brand)">${S.userName.charAt(0).toUpperCase()}</div>
        <div>
          <div class="mem-name">${S.isGuest ? 'You (Guest)' : S.userName}</div>
          <div class="mem-stats">Scam IQ: ${S.scamIQ} · Lessons: ${S.completedLessons.size}/${typeof LESSONS !== 'undefined' ? LESSONS.length : '?'}</div>
        </div>
      </div>
      <span class="active-tag">You</span>
    </div>`;

  // Simulated members (guest mode)
  html += S.familyMembers.map((m, i) => `
    <div class="card fam-member">
      <div class="mem-info">
        <div class="mem-av" style="background:var(--g-violet)">${m.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="mem-name">${m.name}</div>
          <div class="mem-stats">Scam IQ: ${m.scamIQ} · Lessons: ${m.lessonsCompleted}/${typeof LESSONS !== 'undefined' ? LESSONS.length : '?'} · Quiz: ${m.quizAccuracy}</div>
        </div>
      </div>
      <button class="nudge" data-i="${i}">📩 Nudge</button>
    </div>`).join('');

  list.innerHTML = html;

  list.querySelectorAll('.nudge').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      b.textContent = '✅ Sent!'; b.classList.add('sent'); b.disabled = true;
      setTimeout(() => { b.textContent = '📩 Nudge'; b.classList.remove('sent'); b.disabled = false; }, 2500);
    });
  });
}

// ==================== INIT ====================
function init() {
  loadLocal();
  confetti.init();
  initNav();

  // Init Supabase (returns false if not configured)
  const sbReady = initSupabase();

  // Auth UI
  initAuthUI();

  // Modules
  initLearn();
  initQuiz();
  initNews();
  initChat();
  initFamily();
  updateDashboard();
}

document.addEventListener('DOMContentLoaded', init);
