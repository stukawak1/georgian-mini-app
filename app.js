/* Georgian Language Learning App — Main Logic */

// ── TTS ──
const TTS = {
  _current: null,
  _activeBtn: null,

  play(key, btn = null) {
    if (!localStorage.getItem('gla_audio_warned')) {
      this._pendingKey = key;
      this._pendingBtn = btn;
      document.getElementById('audio-modal').classList.add('show');
      return;
    }
    this._doPlay(key, btn);
  },

  _doPlay(key, btn) {
    // Stop previous
    if (this._current) {
      this._current.pause();
      this._current.currentTime = 0;
    }
    if (this._activeBtn) {
      this._activeBtn.classList.remove('speaking');
      this._activeBtn = null;
    }

    const audio = new Audio(`audio/${key}.mp3`);
    this._current = audio;

    if (btn) {
      btn.classList.add('speaking');
      this._activeBtn = btn;
    }

    audio.onended = () => {
      if (btn) btn.classList.remove('speaking');
      if (this._activeBtn === btn) this._activeBtn = null;
    };
    audio.onerror = () => {
      if (btn) btn.classList.remove('speaking');
      if (this._activeBtn === btn) this._activeBtn = null;
    };

    audio.play().catch(() => {
      if (btn) btn.classList.remove('speaking');
    });
  },
};

function confirmAudioModal() {
  localStorage.setItem('gla_audio_warned', '1');
  document.getElementById('audio-modal').classList.remove('show');
  if (TTS._pendingKey) {
    TTS._doPlay(TTS._pendingKey, TTS._pendingBtn);
    TTS._pendingKey = null;
    TTS._pendingBtn = null;
  }
}

function closeAudioModal(e) {
  if (e && e.target !== document.getElementById('audio-modal')) return;
  localStorage.setItem('gla_audio_warned', '1');
  document.getElementById('audio-modal').classList.remove('show');
  TTS._pendingKey = null;
  TTS._pendingBtn = null;
}

const PHRASE_PREFIX = {
  greeting: 'g', polite: 'p', food: 'f',
  navigation: 'n', shopping: 's', emergency: 'e',
};

// ── STATE ──
const State = {
  currentSection: 'alphabet',
  alphabet: {
    mode: 'browse',   // 'browse' | 'quiz'
    currentIdx: 0,
    learned: new Set(JSON.parse(localStorage.getItem('gla_learned') || '[]')),
  },
  quiz: {
    score: 0,
    wrong: 0,
    streak: 0,
    total: 0,
    answered: false,
  },
  flashcards: {
    deck: [],
    idx: 0,
    filter: 'all',
    seen: new Set(),
  },
  phrases: {},
};

// ── WRITING TRAINER ──
const Drawing = {
  canvas: null, ctx: null,
  refCanvas: null, refCtx: null,
  isDrawing: false,
  lastX: 0, lastY: 0,
  hasStrokes: false,
  letterIdx: 0,
  _dpr: 1, _size: 300,

  init() {
    this.canvas    = document.getElementById('draw-canvas');
    this.ctx       = this.canvas.getContext('2d');
    this.refCanvas = document.getElementById('ref-canvas');
    this.refCtx    = this.refCanvas.getContext('2d');
    this._setupSize();
    this._setupEvents();
  },

  _setupSize() {
    const wrap = document.getElementById('draw-canvas-wrap');
    const size = Math.min(wrap.offsetWidth || 320, 340);
    const dpr  = window.devicePixelRatio || 1;
    this._size = size;
    this._dpr  = dpr;
    [this.canvas, this.refCanvas].forEach(c => {
      c.width  = size * dpr;
      c.height = size * dpr;
      c.style.width  = size + 'px';
      c.style.height = size + 'px';
    });
    this.ctx.scale(dpr, dpr);
    this.refCtx.scale(dpr, dpr);
  },

  _setupEvents() {
    const c = this.canvas;
    c.addEventListener('touchstart', e => { e.preventDefault(); this._start(e.touches[0]); }, { passive: false });
    c.addEventListener('touchmove',  e => { e.preventDefault(); this._move(e.touches[0]);  }, { passive: false });
    c.addEventListener('touchend',   () => { this.isDrawing = false; });
    c.addEventListener('mousedown',  e => this._start(e));
    c.addEventListener('mousemove',  e => { if (this.isDrawing) this._move(e); });
    c.addEventListener('mouseup',    () => { this.isDrawing = false; });
    c.addEventListener('mouseleave', () => { this.isDrawing = false; });
  },

  _pos(e) {
    const r  = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (this._size / r.width),
      y: (e.clientY - r.top)  * (this._size / r.height),
    };
  },

  _start(e) {
    this.isDrawing = true;
    this.hasStrokes = true;
    document.getElementById('canvas-hint-overlay').style.display = 'none';
    document.getElementById('write-score').innerHTML = '';
    const p = this._pos(e);
    this.lastX = p.x; this.lastY = p.y;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255,107,44,0.92)';
    this.ctx.fill();
  },

  _move(e) {
    if (!this.isDrawing) return;
    const p = this._pos(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(p.x, p.y);
    this.ctx.strokeStyle = 'rgba(255,107,44,0.92)';
    this.ctx.lineWidth   = 7;
    this.ctx.lineCap     = 'round';
    this.ctx.lineJoin    = 'round';
    this.ctx.stroke();
    this.lastX = p.x; this.lastY = p.y;
  },

  loadLetter(idx) {
    this.letterIdx  = idx;
    this.hasStrokes = false;
    const letter = ALPHABET[idx];
    const s = this._size;
    const fontSize = Math.round(s * 0.62);

    // Update meta
    document.getElementById('write-letter-display').textContent = letter.letter;
    document.getElementById('write-meta').innerHTML =
      `<span class="wm-rom">${letter.roman}</span>` +
      `<span class="wm-hint">${letter.hint}</span>`;
    document.getElementById('write-score').innerHTML = '';
    document.getElementById('canvas-hint-overlay').style.display = 'flex';

    const speakBtn = document.getElementById('write-speak-btn');
    speakBtn.onclick = () => TTS.play(`letter_${idx}`, speakBtn);

    // Draw ghost on user canvas
    this.ctx.clearRect(0, 0, s, s);
    this.ctx.font          = `${fontSize}px serif`;
    this.ctx.textAlign     = 'center';
    this.ctx.textBaseline  = 'middle';
    this.ctx.fillStyle     = 'rgba(255,255,255,0.10)';
    this.ctx.fillText(letter.letter, s / 2, s / 2);

    // Draw reference on hidden canvas (for scoring)
    this.refCtx.clearRect(0, 0, s, s);
    this.refCtx.font         = `${fontSize}px serif`;
    this.refCtx.textAlign    = 'center';
    this.refCtx.textBaseline = 'middle';
    this.refCtx.fillStyle    = '#ffffff';
    this.refCtx.fillText(letter.letter, s / 2, s / 2);
  },

  clear() {
    this.hasStrokes = false;
    const s = this._size;
    const letter = ALPHABET[this.letterIdx];
    const fontSize = Math.round(s * 0.62);
    this.ctx.clearRect(0, 0, s, s);
    this.ctx.font         = `${fontSize}px serif`;
    this.ctx.textAlign    = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle    = 'rgba(255,255,255,0.10)';
    this.ctx.fillText(letter.letter, s / 2, s / 2);
    document.getElementById('write-score').innerHTML = '';
    document.getElementById('canvas-hint-overlay').style.display = 'flex';
  },

  check() {
    if (!this.hasStrokes) { showToast('Сначала нарисуйте букву!'); return; }
    const s   = this._size;
    const dpr = this._dpr;
    const W   = s * dpr, H = s * dpr;

    const userPx = this.ctx.getImageData(0, 0, W, H).data;
    const refPx  = this.refCtx.getImageData(0, 0, W, H).data;

    const R = 10 * dpr;  // tolerance radius in raw pixels
    let refTotal = 0, hit = 0;

    for (let i = 0; i < refPx.length; i += 4) {
      if (refPx[i + 3] < 40) continue;
      refTotal++;
      const x = (i >> 2) % W, y = (i >> 2) / W | 0;
      outer: for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          if (dx * dx + dy * dy > R * R) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          if (userPx[((ny * W + nx) << 2) + 3] > 40) { hit++; break outer; }
        }
      }
    }

    const score = refTotal ? Math.round((hit / refTotal) * 100) : 0;
    this._showScore(score);
  },

  _showScore(score) {
    let emoji, msg, color;
    if      (score >= 75) { emoji = '🎉'; msg = 'Отлично!';      color = 'var(--green)'; }
    else if (score >= 45) { emoji = '👍'; msg = 'Хорошо!';       color = 'var(--a2)'; }
    else if (score >= 20) { emoji = '💪'; msg = 'Ещё раз!';      color = 'var(--red)'; }
    else                  { emoji = '✏️'; msg = 'Попробуй снова'; color = 'var(--text3)'; }

    document.getElementById('write-score').innerHTML = `
      <div class="score-num" style="color:${color}">${emoji} ${score}%</div>
      <div class="score-msg">${msg}</div>
    `;

    if (score >= 75) {
      State.alphabet.learned.add(this.letterIdx);
      saveProgress();
      renderAlphabetGrid();
    }
  },
};

function writingPrev() {
  const idx = (Drawing.letterIdx - 1 + ALPHABET.length) % ALPHABET.length;
  Drawing.loadLetter(idx);
}

function writingNext() {
  const idx = (Drawing.letterIdx + 1) % ALPHABET.length;
  Drawing.loadLetter(idx);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderAlphabet();
  renderPhrases();
  renderFlashcards();
  renderTips();
  showSection('alphabet');
  updateProgress();

  // Telegram Web App init
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    document.documentElement.style.setProperty('--tg-header', tg.colorScheme === 'light' ? '#fff' : '#1A1D27');
  }
});

// ── NAVIGATION ──
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });
}

function showSection(name) {
  State.currentSection = name;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`sec-${name}`).classList.add('active');
  document.querySelector(`.nav-btn[data-section="${name}"]`).classList.add('active');
}

// ── PROGRESS ──
function updateProgress() {
  const total = ALPHABET.length;
  const learned = State.alphabet.learned.size;
  const pct = Math.round((learned / total) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = `${learned}/${total} букв`;
}

function saveProgress() {
  localStorage.setItem('gla_learned', JSON.stringify([...State.alphabet.learned]));
  updateProgress();
}

// ── ALPHABET SECTION ──
function renderAlphabet() {
  renderAlphabetGrid();
  renderLetterDetail(State.alphabet.currentIdx);
  setupAlphabetNav();
  setupModeToggle();
}

function renderAlphabetGrid() {
  const grid = document.getElementById('alphabet-grid');
  grid.innerHTML = '';
  ALPHABET.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn' +
      (State.alphabet.learned.has(i) ? ' learned' : '') +
      (i === State.alphabet.currentIdx ? ' current' : '');
    btn.innerHTML = `<span class="letter-ka">${item.letter}</span><span class="letter-rom">${item.roman}</span>`;
    btn.addEventListener('click', () => {
      State.alphabet.currentIdx = i;
      renderAlphabetGrid();
      renderLetterDetail(i);
    });
    grid.appendChild(btn);
  });
}

function renderLetterDetail(idx) {
  const item = ALPHABET[idx];
  const el = document.getElementById('letter-detail');
  const isLearned = State.alphabet.learned.has(idx);
  el.innerHTML = `
    <div class="letter-big">${item.letter}</div>
    <button class="speak-btn speak-btn-lg" id="speak-letter-${idx}"
      onclick="TTS.play('letter_${idx}', this)">🔊</button>
    <div class="letter-detail-rom">${item.roman}</div>
    <div class="letter-detail-ru">${item.ru}</div>
    <div class="letter-detail-hint">💡 ${item.hint}</div>
    <div class="letter-detail-example">✦ ${item.example}</div>
    <div style="margin-top:8px; display:flex; gap:8px;">
      <button class="btn ${isLearned ? 'btn-secondary' : 'btn-success'}" style="padding:8px 20px;flex:0 0 auto;"
        onclick="toggleLearned(${idx})">
        ${isLearned ? '✓ Выучена' : '+ Выучил!'}
      </button>
    </div>
  `;
}

function toggleLearned(idx) {
  if (State.alphabet.learned.has(idx)) {
    State.alphabet.learned.delete(idx);
  } else {
    State.alphabet.learned.add(idx);
    showToast('Буква запомнена! 🎉');
  }
  saveProgress();
  renderAlphabetGrid();
  renderLetterDetail(idx);
}

function setupAlphabetNav() {
  document.getElementById('btn-prev').addEventListener('click', () => {
    State.alphabet.currentIdx = (State.alphabet.currentIdx - 1 + ALPHABET.length) % ALPHABET.length;
    renderAlphabetGrid();
    renderLetterDetail(State.alphabet.currentIdx);
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    State.alphabet.currentIdx = (State.alphabet.currentIdx + 1) % ALPHABET.length;
    renderAlphabetGrid();
    renderLetterDetail(State.alphabet.currentIdx);
  });
}

function setupModeToggle() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      document.getElementById('browse-panel').style.display  = mode === 'browse'  ? 'block' : 'none';
      document.getElementById('quiz-panel').style.display    = mode === 'quiz'    ? 'block' : 'none';
      document.getElementById('writing-panel').style.display = mode === 'writing' ? 'block' : 'none';
      if (mode === 'quiz')    startQuiz();
      if (mode === 'writing') { Drawing.init(); Drawing.loadLetter(State.alphabet.currentIdx); }
    });
  });
}

// ── QUIZ ──
function startQuiz() {
  State.quiz = { score: 0, wrong: 0, streak: 0, total: 0, answered: false };
  renderQuizStats();
  nextQuestion();
}

function nextQuestion() {
  State.quiz.answered = false;
  const qWrap = document.getElementById('quiz-wrap');

  // Pick random letter
  const correctIdx = Math.floor(Math.random() * ALPHABET.length);
  const correct = ALPHABET[correctIdx];

  // Generate 3 wrong options
  const wrongOptions = [];
  const usedIndices = new Set([correctIdx]);
  while (wrongOptions.length < 3) {
    const r = Math.floor(Math.random() * ALPHABET.length);
    if (!usedIndices.has(r)) {
      usedIndices.add(r);
      wrongOptions.push(ALPHABET[r]);
    }
  }

  const allOptions = [...wrongOptions, correct].sort(() => Math.random() - 0.5);

  qWrap.innerHTML = `
    <div class="quiz-question">
      <div class="quiz-letter">${correct.letter}</div>
      <button class="speak-btn speak-btn-quiz"
        onclick="TTS.play('letter_${correctIdx}', this)">🔊 Слушать</button>
      <div class="quiz-prompt">Как читается эта буква?</div>
    </div>
    <div class="quiz-options">
      ${allOptions.map(opt => `
        <button class="quiz-option" data-rom="${opt.roman}" data-correct="${opt.roman === correct.roman}">
          ${opt.roman}<br><small style="font-size:10px;color:var(--text3);font-weight:400">${opt.ru}</small>
        </button>
      `).join('')}
    </div>
  `;

  qWrap.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleQuizAnswer(btn, correct));
  });
}

function handleQuizAnswer(btn, correct) {
  if (State.quiz.answered) return;
  State.quiz.answered = true;
  State.quiz.total++;

  const isCorrect = btn.dataset.correct === 'true';

  if (isCorrect) {
    btn.classList.add('correct');
    State.quiz.score++;
    State.quiz.streak++;
    if (!State.alphabet.learned.has(ALPHABET.indexOf(correct))) {
      // Optionally auto-mark as learned after quiz
    }
    if (State.quiz.streak > 0 && State.quiz.streak % 5 === 0) {
      showToast(`🔥 ${State.quiz.streak} подряд! Огонь!`);
    }
  } else {
    btn.classList.add('wrong');
    State.quiz.wrong++;
    State.quiz.streak = 0;
    // Show correct answer
    document.querySelectorAll('.quiz-option').forEach(b => {
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
  }

  renderQuizStats();

  setTimeout(() => {
    if (State.quiz.answered) nextQuestion();
  }, 1200);
}

function renderQuizStats() {
  const el = document.getElementById('quiz-stats');
  const acc = State.quiz.total > 0
    ? Math.round((State.quiz.score / State.quiz.total) * 100)
    : 0;
  el.innerHTML = `
    <div class="quiz-stat">
      <div class="quiz-stat-num green">${State.quiz.score}</div>
      <div class="quiz-stat-label">Верно</div>
    </div>
    <div class="quiz-stat">
      <div class="quiz-stat-num red">${State.quiz.wrong}</div>
      <div class="quiz-stat-label">Ошибки</div>
    </div>
    <div class="quiz-stat">
      <div class="quiz-stat-num blue">${State.quiz.streak}</div>
      <div class="quiz-stat-label">Серия</div>
    </div>
    <div class="quiz-stat">
      <div class="quiz-stat-num" style="color:var(--gold)">${acc}%</div>
      <div class="quiz-stat-label">Точность</div>
    </div>
  `;
}

// ── PHRASES ──
function renderPhrases() {
  const container = document.getElementById('phrases-container');
  container.innerHTML = '';

  Object.entries(PHRASES).forEach(([key, category]) => {
    const prefix = PHRASE_PREFIX[key] || key[0];
    const div = document.createElement('div');
    div.className = 'phrase-category';
    div.innerHTML = `
      <div class="phrase-category-header">
        <span class="phrase-category-icon">${category.icon}</span>
        <span class="phrase-category-title">${category.title}</span>
        <span class="phrase-category-count">${category.items.length} фраз</span>
        <span class="phrase-chevron">▼</span>
      </div>
      <div class="phrase-list">
        ${category.items.map((item, i) => `
          <div class="phrase-item">
            <div class="phrase-ka">${item.ka}</div>
            <div class="phrase-rom">${item.rom}</div>
            <div class="phrase-ru">${item.ru}</div>
            ${item.note ? `<div class="phrase-note">ℹ️ ${item.note}</div>` : ''}
            <div class="phrase-actions">
              <button class="speak-btn speak-btn-phrase"
                onclick="TTS.play('phrase_${prefix}${i}', this)">🔊 Слушать</button>
              <button class="phrase-copy-btn"
                onclick="copyPhrase(this, '${escHtml(item.ka)}')">📋</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    div.querySelector('.phrase-category-header').addEventListener('click', () => {
      div.classList.toggle('open');
    });
    container.appendChild(div);
  });

  // Open first category by default
  container.querySelector('.phrase-category').classList.add('open');
}

function copyPhrase(btn, text) {
  const item = btn.closest('.phrase-item');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓';
      showToast('Скопировано в буфер 📋');
      setTimeout(() => { btn.textContent = '📋'; }, 2000);
    });
  }
}

// ── FLASHCARDS ──
function renderFlashcards() {
  buildDeck('all');
  renderFilterBtns();
  renderFC();

  document.getElementById('fc-flip').addEventListener('click', flipCard);
  document.getElementById('fc-next').addEventListener('click', nextCard);
  document.getElementById('fc-prev').addEventListener('click', prevCard);
  document.getElementById('fc-card-wrap').addEventListener('click', flipCard);
}

function buildDeck(filter) {
  State.flashcards.filter = filter;
  const indexed = FLASHCARDS.map((card, i) => ({ ...card, _idx: i }));
  State.flashcards.deck = filter === 'all'
    ? shuffle([...indexed])
    : shuffle(indexed.filter(c => c.category === filter));
  State.flashcards.idx = 0;
  State.flashcards.seen = new Set();
}

function renderFilterBtns() {
  const container = document.getElementById('fc-filters');
  const categories = ['all', ...new Set(FLASHCARDS.map(c => c.category))];
  container.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'all' ? 'active' : ''}"
      data-cat="${cat}">${cat === 'all' ? 'Все' : cat}</button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildDeck(btn.dataset.cat);
      renderFC();
    });
  });
}

function renderFC() {
  const { deck, idx } = State.flashcards;
  if (!deck.length) return;

  const card = deck[idx];
  const cardEl = document.getElementById('fc-card');
  cardEl.classList.remove('flipped');

  cardEl.querySelector('.fc-front').innerHTML = `
    <div class="fc-category-badge">${card.category}</div>
    <div class="fc-word-ka">${card.ka}</div>
    <button class="speak-btn speak-btn-fc"
      onclick="event.stopPropagation(); TTS.play('word_${card._idx}', this)">🔊</button>
    <div class="fc-hint">нажмите чтобы перевернуть</div>
  `;

  cardEl.querySelector('.fc-back').innerHTML = `
    <div class="fc-category-badge">${card.category}</div>
    <div class="fc-word-ru">${card.ru}</div>
    <div class="fc-word-rom">${card.rom}</div>
  `;

  document.getElementById('fc-counter').textContent =
    `${idx + 1} / ${deck.length}`;
}

function flipCard() {
  document.getElementById('fc-card').classList.toggle('flipped');
}

function nextCard() {
  const { deck } = State.flashcards;
  State.flashcards.seen.add(State.flashcards.idx);
  State.flashcards.idx = (State.flashcards.idx + 1) % deck.length;
  if (State.flashcards.seen.size === deck.length) {
    State.flashcards.seen.clear();
    showToast('Колода пройдена! 🎓 Начинаем снова');
    buildDeck(State.flashcards.filter);
  }
  renderFC();
}

function prevCard() {
  const { deck } = State.flashcards;
  State.flashcards.idx = (State.flashcards.idx - 1 + deck.length) % deck.length;
  renderFC();
}

// ── TIPS ──
function renderTips() {
  const container = document.getElementById('tips-container');
  container.innerHTML = TIPS.map(tip => `
    <div class="tip-card" style="background: linear-gradient(135deg, var(--card), var(--card2)); --tip-color: ${tip.color};">
      <div class="tip-header">
        <span class="tip-icon">${tip.icon}</span>
        <span class="tip-title">${tip.title}</span>
      </div>
      <div class="tip-text">${tip.text}</div>
    </div>
  `).join('');
}

// ── UTILITIES ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escHtml(str) {
  return str.replace(/'/g, "\\'");
}
