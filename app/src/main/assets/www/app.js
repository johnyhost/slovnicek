/* Slovníček – game logic. Plain ES2015, no libraries, works offline in an Android WebView. */
(function () {
  'use strict';

  var APP_VERSION = '1.0';
  var DATA = window.SLOVNICEK_DATA;
  var DAILY_GOAL = 50;

  /* ===================== helpers ===================== */
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[rnd(a.length)]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayDiff(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5); }
  function deacc(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function normKey(s) {
    return deacc(String(s).toLowerCase()).replace(/[’‘`´]/g, "'").replace(/[-–—_/]/g, ' ')
      .replace(/[^a-z0-9' ]/g, '').replace(/\s+/g, ' ').trim();
  }
  function cleanAns(s) { return normKey(s).replace(/^(a|an|the|to) /, '').replace(/'/g, ''); }
  // optimal string alignment distance (typos incl. swapped letters)
  function osa(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      var c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[m][n];
  }

  /* ===================== word model ===================== */
  var GRADES = {}, UNITS = {}, GW = {}, SKIDX = {}, KEYS = {}, SYN = {};
  (DATA.synonyms || []).forEach(function (grp, gi) { grp.forEach(function (x) { SYN[cleanAns(x)] = gi; }); });
  function senseTokens(sk) {
    return String(sk).toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[,;\/]/)
      .map(function (t) { return t.replace(/[.!?…"„“]/g, '').replace(/\s+/g, ' ').trim(); }).filter(Boolean);
  }
  function synGroups(w) { var g = []; w.enAlts.forEach(function (a) { var k = SYN[cleanAns(a)]; if (k != null && g.indexOf(k) < 0) g.push(k); }); return g; }
  // two words that a kid could reasonably confuse -> never offer them against each other
  function confusable(a, b) {
    if (a.key === b.key || a.skKey === b.skKey) return true;
    if (a.senses.some(function (t) { return b.senses.indexOf(t) >= 0; })) return true;
    return a.syn.some(function (g) { return b.syn.indexOf(g) >= 0; });
  }
  DATA.grades.forEach(function (g) {
    GRADES[g.grade] = g; GW[g.grade] = []; SKIDX[g.grade] = {}; KEYS[g.grade] = {};
    var seen = {};
    (g.units || []).forEach(function (u, ui) {
      u.grade = g.grade; u.idx = ui; UNITS[u.id] = u;
      u.W = u.words.map(function (pair) {
        var alts = pair[0].split('|').map(function (s) { return s.trim(); });
        var w = { en: alts[0], enAlts: alts, sk: pair[1], unit: u.id, grade: g.grade };
        w.key = normKey(w.en); w.id = g.grade + ':' + w.key; w.skKey = normKey(w.sk);
        w.senses = senseTokens(w.sk); w.syn = synGroups(w);
        w.phrase = /\.\.\.|…/.test(w.en);
        w.multi = w.en.indexOf(' ') >= 0 || /[?!.]$/.test(w.en);
        w.typable = !w.phrase && w.en.split(' ').length <= 4 && w.en.length <= 26;
        w.scramble = /^[A-Za-z]{3,10}$/.test(w.en);
        if (!seen[w.id]) { seen[w.id] = 1; GW[g.grade].push(w); }
        var arr = SKIDX[g.grade][w.skKey] || (SKIDX[g.grade][w.skKey] = []);
        alts.forEach(function (a) { if (arr.indexOf(a) < 0) arr.push(a); });
        alts.forEach(function (a) { KEYS[g.grade][cleanAns(a)] = 1; });
        return w;
      });
    });
  });
  function gradeHasWords(g) { return GW[g] && GW[g].length > 0; }
  function firstGrade() { for (var g = 1; g <= 9; g++) if (gradeHasWords(g)) return g; return 1; }

  /* ===================== storage ===================== */
  var Store = {
    load: function () {
      try {
        var raw = (window.Native && Native.load) ? Native.load() : window.localStorage.getItem('slovnicek');
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    save: function (st) {
      var raw = JSON.stringify(st);
      try { if (window.Native && Native.save) Native.save(raw); else window.localStorage.setItem('slovnicek', raw); } catch (e) { }
    }
  };
  var S = Store.load() || { v: 1, cur: null, profiles: {} };
  function P() { return S.cur ? S.profiles[S.cur] : null; }
  function save() { Store.save(S); }

  function makeProfile(name, avatar, grade) {
    var id = 'p' + Date.now().toString(36) + rnd(1000);
    S.profiles[id] = {
      id: id, name: name, avatar: avatar, grade: grade, created: Date.now(), used: Date.now(),
      xp: 0, hearts: 0, heartsTotal: 0, streak: 0, bestStreak: 0, lastDay: null, dayXp: {},
      words: {}, units: {}, badges: {}, owned: { themes: ['night', 'day'], avatars: [] }, theme: 'night', speedBest: {},
      stats: { lessons: 0, correct: 0, wrong: 0, typedExact: 0, bestCombo: 0, perfect: 0, comeback: 0, bought: 0, night: 0, early: 0 },
      settings: { sound: true, voice: true }
    };
    S.cur = id; save(); return S.profiles[id];
  }
  function wrec(w) { var p = P(); return p.words[w.id]; }
  function strength(w) { var r = wrec(w); return r ? r.s : 0; }
  function recWord(w, ok) {
    var p = P(), r = p.words[w.id] || (p.words[w.id] = { s: 0, n: 0, ok: 0, t: 0 });
    r.n++; r.t = Date.now();
    if (ok) { r.ok++; r.s = Math.min(5, r.s + 1); } else { r.s = Math.max(0, r.s - 2); }
  }
  function learnedCount(p) { var n = 0; for (var k in p.words) if (p.words[k].s >= 3) n++; return n; }
  function unitPct(u) { var p = P(), t = 0; u.W.forEach(function (w) { var r = p.words[w.id]; t += r ? r.s : 0; }); return u.W.length ? Math.round(t / (u.W.length * 5) * 100) : 0; }
  function todayXp(p) { return p.dayXp[dayKey()] || 0; }
  function streakNow(p) { if (!p.lastDay) return 0; return dayDiff(p.lastDay, dayKey()) <= 1 ? p.streak : 0; }
  function addXp(xp) {
    var p = P(), t = dayKey(); p.xp += xp; p.dayXp[t] = (p.dayXp[t] || 0) + xp;
    var keys = Object.keys(p.dayXp).sort(); while (keys.length > 14) delete p.dayXp[keys.shift()];
  }
  function activity() {
    var p = P(), t = dayKey(), now = new Date(), h = now.getHours() + now.getMinutes() / 60;
    if (p.lastDay !== t) { p.streak = (p.lastDay && dayDiff(p.lastDay, t) === 1) ? p.streak + 1 : 1; p.lastDay = t; }
    if (p.streak > p.bestStreak) p.bestStreak = p.streak;
    if (h >= 21) p.stats.night++;
    if (h < 7.5) p.stats.early++;
  }
  function levelOf(xp) { return Math.floor(Math.sqrt(xp / 40)) + 1; }
  function levelXp(l) { return 40 * (l - 1) * (l - 1); }
  var RANKS = ['Nováčik', 'Učeň', 'Objaviteľ', 'Lovec slov', 'Bojovník', 'Majster slov', 'Expert', 'Šampión', 'Legenda', 'Slovný mág'];
  function rankOf(xp) { return RANKS[Math.min(RANKS.length - 1, levelOf(xp) - 1)]; }

  /* ===================== catalogue: avatars, themes, badges ===================== */
  var AV_FREE = ['🦊', '🐼', '🐸', '🐯', '🐨', '🐵', '🐧', '🐙'];
  var AV_SHOP = [['😎', 4], ['🦁', 5], ['🐺', 5], ['🦄', 6], ['🐳', 6], ['🤖', 7], ['👽', 7], ['🦅', 8], ['🐲', 9], ['🦖', 9], ['🧙', 10], ['👾', 12]];
  var THEMES = [
    { id: 'night', n: 'Noc', price: 0, c: ['#1b1446', '#3b1f7a', '#8b5cf6', '#38bdf8'] },
    { id: 'day', n: 'Deň', price: 0, c: ['#eef2ff', '#fdf2f8', '#7c3aed', '#0284c7'] },
    { id: 'ocean', n: 'Oceán', price: 8, c: ['#04263a', '#0b5e7c', '#06b6d4', '#34d399'] },
    { id: 'forest', n: 'Les', price: 10, c: ['#0a2615', '#1d5b34', '#22c55e', '#a3e635'] },
    { id: 'lava', n: 'Láva', price: 12, c: ['#2a0909', '#7a200c', '#f97316', '#facc15'] },
    { id: 'candy', n: 'Cukrík', price: 15, c: ['#3a0b39', '#7c1f6c', '#ec4899', '#c084fc'] },
    { id: 'galaxy', n: 'Galaxia', price: 20, c: ['#05030f', '#1e1b4b', '#d946ef', '#22d3ee'] }
  ];
  function maxSpeed(p) { var m = 0; for (var k in p.speedBest) m = Math.max(m, p.speedBest[k]); return m; }
  function anyUnit3(p) { for (var k in p.units) if (p.units[k].stars >= 3) return true; return false; }
  function gradeMaster(p) {
    for (var g = 1; g <= 9; g++) {
      var us = GRADES[g] ? GRADES[g].units : []; if (!us.length) continue;
      if (us.every(function (u) { return p.units[u.id] && p.units[u.id].stars >= 3; })) return true;
    }
    return false;
  }
  var BADGES = [
    { id: 'first', i: '🎉', n: 'Prvá lekcia', d: 'Dokonči prvú lekciu', t: function (p) { return p.stats.lessons >= 1; } },
    { id: 'combo5', i: '🔥', n: 'V ohni', d: '5 správnych za sebou', t: function (p) { return p.stats.bestCombo >= 5; } },
    { id: 'combo10', i: '☄️', n: 'Nezastaviteľný', d: '10 správnych za sebou', t: function (p) { return p.stats.bestCombo >= 10; } },
    { id: 'combo25', i: '🌋', n: 'Sopka', d: '25 správnych za sebou', t: function (p) { return p.stats.bestCombo >= 25; } },
    { id: 'perfect', i: '✨', n: 'Bez chyby', d: 'Lekcia bez jedinej chyby', t: function (p) { return p.stats.perfect >= 1; } },
    { id: 'perfect5', i: '💎', n: 'Diamant', d: '5 lekcií bez chyby', t: function (p) { return p.stats.perfect >= 5; } },
    { id: 'w25', i: '📚', n: 'Knihomoľ', d: 'Nauč sa 25 slov', t: function (p) { return learnedCount(p) >= 25; } },
    { id: 'w100', i: '🧠', n: 'Mozgáč', d: 'Nauč sa 100 slov', t: function (p) { return learnedCount(p) >= 100; } },
    { id: 'w300', i: '🎓', n: 'Profesor', d: 'Nauč sa 300 slov', t: function (p) { return learnedCount(p) >= 300; } },
    { id: 's3', i: '📅', n: 'Tri dni', d: 'Uč sa 3 dni po sebe', t: function (p) { return p.bestStreak >= 3; } },
    { id: 's7', i: '🗓️', n: 'Celý týždeň', d: '7 dní po sebe', t: function (p) { return p.bestStreak >= 7; } },
    { id: 's30', i: '🏅', n: 'Mesiac v kuse', d: '30 dní po sebe', t: function (p) { return p.bestStreak >= 30; } },
    { id: 'night', i: '🦉', n: 'Nočná sova', d: 'Uč sa po 21:00', t: function (p) { return p.stats.night >= 1; } },
    { id: 'early', i: '🐓', n: 'Ranné vtáča', d: 'Uč sa pred 7:30', t: function (p) { return p.stats.early >= 1; } },
    { id: 'rocket', i: '🚀', n: 'Raketa', d: '15 bodov vo výzve 60 s', t: function (p) { return maxSpeed(p) >= 15; } },
    { id: 'typer', i: '⌨️', n: 'Pisár', d: '20 slov napísaných bez chyby', t: function (p) { return p.stats.typedExact >= 20; } },
    { id: 'king', i: '👑', n: 'Kráľ lekcie', d: '3 hviezdy v lekcii', t: anyUnit3 },
    { id: 'grade', i: '🏆', n: 'Majster ročníka', d: '3 hviezdy vo všetkých lekciách ročníka', t: gradeMaster },
    { id: 'hearts10', i: '💖', n: 'Zberateľ sŕdc', d: 'Získaj spolu 10 sŕdc', t: function (p) { return p.heartsTotal >= 10; } },
    { id: 'hearts50', i: '💘', n: 'Srdciar', d: 'Získaj spolu 50 sŕdc', t: function (p) { return p.heartsTotal >= 50; } },
    { id: 'shop', i: '🛍️', n: 'Nákupca', d: 'Kúp si niečo v obchode', t: function (p) { return p.stats.bought >= 1; } },
    { id: 'comeback', i: '💪', n: 'Nevzdávam sa', d: 'Dokonči lekciu aj s 3+ chybami', t: function (p) { return p.stats.comeback >= 1; } },
    { id: 'xp1000', i: '⚡', n: 'Tisícka', d: 'Získaj 1000 XP', t: function (p) { return p.xp >= 1000; } }
  ];
  function checkBadges(silent) {
    var p = P(), got = [];
    BADGES.forEach(function (b) {
      if (!p.badges[b.id] && b.t(p)) { p.badges[b.id] = Date.now(); p.hearts += 2; p.heartsTotal += 2; got.push(b); }
    });
    if (got.length) {
      save();
      if (!silent) got.forEach(function (b, i) { setTimeout(function () { Sfx.badge(); toast(b.i, 'Nový odznak! +2 ❤️', b.n); }, 500 + i * 900); });
    }
    return got;
  }

  /* ===================== sound, voice, haptics ===================== */
  var Sfx = (function () {
    var ctx = null;
    function C() {
      try {
        if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) { return null; }
      return ctx;
    }
    function on() { var p = P(); return !p || p.settings.sound; }
    function tone(f, t0, dur, type, vol, slide) {
      var c = C(); if (!c) return;
      var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
    }
    function seq(notes, gap, dur, type, vol) { notes.forEach(function (f, i) { tone(f, i * gap, dur, type, vol); }); }
    return {
      unlock: function () { C(); },
      tap: function () { if (on()) tone(540, 0, 0.05, 'sine', 0.08, 720); },
      correct: function () { if (on()) { tone(784, 0, 0.12, 'triangle', 0.22); tone(1175, 0.09, 0.24, 'triangle', 0.22); } },
      almost: function () { if (on()) { tone(660, 0, 0.12, 'triangle', 0.2); tone(830, 0.1, 0.22, 'triangle', 0.16); } },
      wrong: function () { if (on()) { tone(240, 0, 0.22, 'sawtooth', 0.09, 150); tone(180, 0.1, 0.28, 'square', 0.05, 110); } },
      match: function () { if (on()) tone(660, 0, 0.09, 'sine', 0.16, 990); },
      heart: function () { if (on()) seq([1047, 1319, 1568, 2093], 0.07, 0.25, 'sine', 0.16); },
      badge: function () { if (on()) seq([880, 1109, 1319, 1760, 2217], 0.05, 0.3, 'sine', 0.11); },
      fanfare: function () { if (on()) { seq([523, 659, 784, 1047], 0.12, 0.28, 'triangle', 0.2); tone(1047, 0.5, 0.7, 'triangle', 0.18); tone(1319, 0.5, 0.7, 'sine', 0.1); } },
      tick: function () { if (on()) tone(1200, 0, 0.03, 'square', 0.03); }
    };
  })();
  function buzz(ms) {
    try { if (window.Native && Native.vibrate) Native.vibrate(ms); else if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { }
  }
  var Voice = {
    ok: function () {
      var p = P(); if (p && !p.settings.voice) return false;
      if (window.Native && Native.hasTts) { try { return !!Native.hasTts(); } catch (e) { return false; } }
      return 'speechSynthesis' in window;
    },
    speak: function (text, lang, slow) {
      if (!Voice.ok()) return;
      text = String(text).replace(/\.\.\./g, ' … ');
      if (window.Native && Native.speak) { try { Native.speak(text, lang || 'en', !!slow); } catch (e) { } return; }
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'sk' ? 'sk-SK' : 'en-GB'; u.rate = slow ? 0.55 : 0.9;
        var vs = speechSynthesis.getVoices().filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(lang === 'sk' ? 'sk' : 'en') === 0; });
        if (vs.length) u.voice = vs.filter(function (v) { return /en-GB/i.test(v.lang); })[0] || vs[0];
        speechSynthesis.speak(u);
      } catch (e) { }
    }
  };

  /* ===================== visuals ===================== */
  function mascot(mood, size, cls) {
    size = size || 90;
    var mouths = {
      happy: '<path d="M46 66 Q60 79 74 66" stroke="#14213d" stroke-width="5" fill="none" stroke-linecap="round"/>',
      cheer: '<path d="M43 62 Q60 90 77 62 Z" fill="#14213d"/><path d="M50 72 Q60 81 70 72 Q60 76 50 72" fill="#ff7a90"/>',
      sad: '<path d="M47 74 Q60 63 73 74" stroke="#14213d" stroke-width="5" fill="none" stroke-linecap="round"/>',
      wow: '<ellipse cx="60" cy="70" rx="7" ry="8.5" fill="#14213d"/>',
      think: '<path d="M49 70 Q56 66 71 69" stroke="#14213d" stroke-width="5" fill="none" stroke-linecap="round"/>'
    };
    var eyeY = mood === 'sad' ? 46 : 44, pupil = mood === 'think' ? 'translate(3,-3)' : 'translate(1,2)';
    var brows = mood === 'sad' ? '<path d="M32 30 L50 34 M88 30 L70 34" stroke="#14213d" stroke-width="4" stroke-linecap="round"/>'
      : mood === 'cheer' ? '<path d="M32 30 Q41 24 50 29 M70 29 Q79 24 88 30" stroke="#14213d" stroke-width="4" fill="none" stroke-linecap="round"/>' : '';
    return '<svg class="mascot ' + (cls || '') + '" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" aria-hidden="true">' +
      '<defs><linearGradient id="kg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ef5a8"/><stop offset="1" stop-color="#22c9b7"/></linearGradient></defs>' +
      '<path d="M24 10 H96 A16 16 0 0 1 112 26 V74 A16 16 0 0 1 96 90 H54 L30 111 L34 90 H24 A16 16 0 0 1 8 74 V26 A16 16 0 0 1 24 10 Z" fill="url(#kg)" stroke="#0e4f49" stroke-width="3"/>' +
      '<path d="M22 20 H50" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="27" cy="60" rx="7" ry="4" fill="#ff7a90" opacity=".55"/><ellipse cx="93" cy="60" rx="7" ry="4" fill="#ff7a90" opacity=".55"/>' +
      '<circle cx="42" cy="' + eyeY + '" r="13" fill="#fff"/><circle cx="78" cy="' + eyeY + '" r="13" fill="#fff"/>' +
      '<g transform="' + pupil + '"><circle cx="42" cy="' + eyeY + '" r="6.5" fill="#14213d"/><circle cx="78" cy="' + eyeY + '" r="6.5" fill="#14213d"/>' +
      '<circle cx="44.5" cy="' + (eyeY - 2.5) + '" r="2.2" fill="#fff"/><circle cx="80.5" cy="' + (eyeY - 2.5) + '" r="2.2" fill="#fff"/></g>' +
      brows + (mouths[mood] || mouths.happy) + '</svg>';
  }
  function toast(icon, title, text) {
    var el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = '<span class="ti">' + icon + '</span><div><b>' + esc(title) + '</b>' + esc(text) + '</div>';
    $('#toasts').appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .4s'; el.style.opacity = '0'; }, 2600);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3100);
  }
  function burst(icon, text) {
    var d = document.createElement('div'); d.className = 'burst';
    d.innerHTML = '<div class="bh">' + icon + '</div><div class="bt">' + esc(text) + '</div>';
    document.body.appendChild(d); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 1700);
  }
  function confetti() {
    var cv = $('#confetti'), c = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
    var cols = ['#f472b6', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#fb923c', '#ffffff'], ps = [], t = 0;
    for (var i = 0; i < 140; i++) ps.push({ x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: 6 + Math.random() * 7, c: pick(cols), r: Math.random() * 6, vr: (Math.random() - .5) * .3 });
    (function f() {
      c.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(function (p) { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); });
      if (++t < 170) requestAnimationFrame(f); else c.clearRect(0, 0, cv.width, cv.height);
    })();
  }
  function ring(val, max) {
    var r = 26, c = 2 * Math.PI * r, f = Math.min(1, val / max);
    return '<div class="ring"><svg width="64" height="64"><circle cx="32" cy="32" r="' + r + '" stroke="rgba(128,128,128,.25)" stroke-width="7" fill="none"/>' +
      '<circle cx="32" cy="32" r="' + r + '" stroke="' + (f >= 1 ? '#ffcd3c' : '#2ed47a') + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - f)).toFixed(1) + '"/></svg>' +
      '<div class="rv">' + (f >= 1 ? '🎯' : val) + '<small>' + (f >= 1 ? 'hotovo' : '/' + max + ' XP') + '</small></div></div>';
  }
  function starsHtml(n) { var s = ''; for (var i = 0; i < 3; i++) s += '<span class="' + (i < n ? '' : 'off') + '">⭐</span>'; return s; }
  function applyTheme() {
    var p = P(), id = p ? p.theme : 'night', th = THEMES.filter(function (t) { return t.id === id; })[0] || THEMES[0];
    document.documentElement.setAttribute('data-theme', id);
    var meta = $('meta[name=theme-color]'); if (meta) meta.setAttribute('content', th.c[0]);
    try { if (window.Native && Native.setBarColor) Native.setBarColor(th.c[0], id === 'day'); } catch (e) { }
  }
  function modal(html) { $('#modal-root').innerHTML = '<div class="back" data-a="modalBack"><div class="dlg">' + html + '</div></div>'; }
  function closeModal() { $('#modal-root').innerHTML = ''; }

  var PRAISE = [['Výborne!', 'Great!'], ['Super!', 'Awesome!'], ['Paráda!', 'Nice one!'], ['Presne tak!', 'Exactly!'], ['Si borec!', 'You rock!'], ['Skvelé!', 'Brilliant!'], ['Bomba!', 'Boom!'], ['Tak sa to robí!', "That's how it's done!"]];
  var ALMOST = [['Takmer! Malá chybička 😉', 'Almost! Just a small mistake.'], ['Skoro! Len jedno písmenko', 'So close! Just a letter off.']];
  var WRONG = [['Nevadí, nabudúce!', 'No worries, next time!'], ['Toto ešte potrénujeme', "We'll practise this one"], ['Ups! Nie celkom', 'Oops! Not quite']];

  /* ===================== UI state & router ===================== */
  var app = $('#app');
  var ui = { screen: 'profiles', tab: 'learn', np: null, L: null, SP: null, R: null, open: {} };

  function go(screen) { ui.screen = screen; closeModal(); render(); }
  function render() {
    applyTheme();
    var s = ui.screen;
    if (s === 'profiles') app.innerHTML = vProfiles();
    else if (s === 'new') app.innerHTML = vNew();
    else if (s === 'home') app.innerHTML = vHome();
    else if (s === 'settings') app.innerHTML = vSettings();
    else if (s === 'lesson') { app.innerHTML = vLesson(); afterLessonRender(); }
    else if (s === 'speed') app.innerHTML = vSpeed();
    else if (s === 'result') app.innerHTML = vResult();
    if (s === 'new') { var f = $('#nameIn'); if (f) setTimeout(function () { f.focus(); }, 80); }
  }

  /* ---------- profiles ---------- */
  function vProfiles() {
    var list = Object.keys(S.profiles).map(function (k) { return S.profiles[k]; }).sort(function (a, b) { return (b.used || 0) - (a.used || 0); });
    var h = '<div class="screen"><div class="scroll center">' + '<div style="display:flex;justify-content:center;margin-top:18px">' + mascot('happy', 118, 'bob') + '</div>' +
      '<h1 class="logo">Slovníč<span>ek</span></h1><p class="tagline">Angličtina hrou · English for fun</p>' +
      '<p class="step-sub" style="margin-bottom:10px">Kto sa ide učiť? · Who\'s playing?</p><div class="plist">';
    list.forEach(function (p) {
      h += '<button class="pcard" data-a="pickProfile" data-id="' + p.id + '"><span class="ava">' + p.avatar + '</span><div><b>' + esc(p.name) + '</b>' +
        '<span class="meta">⚡ ' + p.xp + ' XP · 🔥 ' + streakNow(p) + ' · ❤️ ' + p.hearts + ' · ' + p.grade + '. ročník</span></div></button>';
    });
    h += '<button class="pcard add" data-a="newProfile">＋ Nový hráč · New player</button></div></div></div>';
    return h;
  }
  function vNew() {
    var np = ui.np, hasP = Object.keys(S.profiles).length > 0, h = '<div class="screen"><div class="scroll">';
    h += '<div style="display:flex;align-items:center">' + ((hasP || np.step > 1) ? '<button class="iconbtn" data-a="npBack">←</button>' : '') +
      '<div class="pbar" style="margin-left:8px"><i style="width:' + (np.step / 3 * 100) + '%"></i></div></div>';
    if (np.step === 1) {
      h += '<div style="display:flex;justify-content:center;margin:26px 0 6px">' + mascot('wow', 110, 'bob') + '</div>' +
        '<div class="step-title center">Ako sa voláš?</div><p class="step-sub center">What\'s your name?</p>' +
        '<input id="nameIn" class="field" maxlength="16" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Tvoje meno" value="' + esc(np.name) + '">' +
        '<p class="small muted center" style="margin-top:10px">Postup sa ukladá len v tomto telefóne. · Progress stays on this phone.</p>' +
        '<div style="margin-top:22px"><button class="btn" data-a="npNext">Ďalej · Next</button></div>';
    } else if (np.step === 2) {
      h += '<div class="step-title">Vyber si avatara</div><p class="step-sub">Pick your avatar – ďalšie si kúpiš za ❤️</p><div class="avagrid">';
      AV_FREE.forEach(function (a) { h += '<button class="' + (a === np.avatar ? 'sel' : '') + '" data-a="npAva" data-v="' + a + '">' + a + '</button>'; });
      h += '</div><div style="margin-top:26px"><button class="btn" data-a="npNext">Ďalej · Next</button></div>';
    } else {
      h += '<div class="step-title">Ktorý ročník?</div><p class="step-sub">Which school year? Dá sa neskôr zmeniť.</p><div class="gradegrid">';
      for (var g = 1; g <= 9; g++) {
        var ok = gradeHasWords(g);
        h += '<button class="' + (g === np.grade ? 'sel' : '') + '" data-a="npGrade" data-v="' + g + '"' + (ok ? '' : ' disabled') + '>' + g + '.<small>' + (ok ? 'ročník' : 'čoskoro') + '</small></button>';
      }
      h += '</div><div style="margin-top:26px"><button class="btn ok" data-a="npDone">Poďme na to! · Let\'s go!</button></div>';
    }
    return h + '</div></div>';
  }

  /* ---------- home ---------- */
  function vHome() {
    var p = P(), st = streakNow(p), lv = levelOf(p.xp);
    var h = '<div class="screen"><div class="topbar"><button class="me" data-a="settings">' + p.avatar + '<span class="lvl">' + lv + '</span></button>' +
      '<div class="chips"><span class="chip streak ' + (st ? 'on' : 'off') + '"><span class="e">🔥</span>' + st + '</span>' +
      '<span class="chip"><span class="e">❤️</span>' + p.hearts + '</span><span class="chip"><span class="e">⚡</span>' + p.xp + '</span></div></div>';
    h += '<div class="scroll" id="homeScroll">';
    if (ui.tab === 'learn') h += vLearn(p);
    else if (ui.tab === 'words') h += vWords(p);
    else if (ui.tab === 'badges') h += vBadges(p);
    else if (ui.tab === 'shop') h += vShop(p);
    h += '</div><nav class="tabbar">' +
      tabBtn('learn', '🗺️', 'Učiť sa') + tabBtn('words', '📖', 'Slovník') + tabBtn('badges', '🏆', 'Odznaky') + tabBtn('shop', '🛍️', 'Obchod') + '</nav></div>';
    return h;
  }
  function tabBtn(id, icon, label) { return '<button class="' + (ui.tab === id ? 'on' : '') + '" data-a="tab" data-v="' + id + '"><span class="ti">' + icon + '</span>' + label + '</button>'; }
  function gradeBar(p) {
    var h = '<div class="gradebar">';
    for (var g = 1; g <= 9; g++) h += '<button class="gchip ' + (g === p.grade ? 'on' : '') + (gradeHasWords(g) ? '' : ' lock') + '" data-a="grade" data-v="' + g + '">' + (gradeHasWords(g) ? '' : '🔒 ') + g + '. ročník</button>';
    return h + '</div>';
  }
  function vLearn(p) {
    var lv = levelOf(p.xp), h = '';
    var hour = new Date().getHours(), greet = hour < 10 ? 'Dobré ráno' : hour < 18 ? 'Ahoj' : 'Dobrý večer';
    h += '<div class="hello">' + mascot(todayXp(p) >= DAILY_GOAL ? 'cheer' : 'happy', 56) + '<div class="txt"><h2>' + greet + ', ' + esc(p.name) + '!</h2>' +
      '<p>Úroveň ' + lv + ' · ' + rankOf(p.xp) + '<br>' + (todayXp(p) >= DAILY_GOAL ? 'Denný cieľ splnený! 🎉' : 'Denný cieľ · Daily goal') + '</p></div>' + ring(todayXp(p), DAILY_GOAL) + '</div>';
    h += gradeBar(p);
    var G = GRADES[p.grade];
    if (!gradeHasWords(p.grade)) {
      return h + '<div class="locked-grade"><div class="big">🔒</div><h2>Čoskoro! · Coming soon</h2><p class="muted">Pre ' + p.grade + '. ročník zatiaľ nemáme slovíčka.</p></div>';
    }
    var best = p.speedBest[p.grade] || 0;
    h += '<div class="quick"><button class="qbtn" data-a="review"><span class="qi">💪</span><b>Opakovanie</b><span>Slabé slová · Review</span></button>' +
      '<button class="qbtn" data-a="speed"><span class="qi">⚡</span><b>Výzva 60 s</b><span>Rekord: ' + best + '</span></button></div>';
    var nextId = null;
    G.units.forEach(function (u) { if (!nextId && !(p.units[u.id] && p.units[u.id].plays)) nextId = u.id; });
    var offs = [0, 56, 78, 56, 0, -56, -78, -56], chap = null, k = 0;
    h += '<div class="path">';
    G.units.forEach(function (u) {
      if (u.chapter && u.chapter !== chap) {
        chap = u.chapter; k = 0;
        var cu = G.units.filter(function (x) { return x.chapter === chap; });
        var cs = cu.reduce(function (a, x) { return a + ((p.units[x.id] && p.units[x.id].stars) || 0); }, 0);
        h += '<div class="chapter">📘 ' + esc(chap) + '<small>' + cs + '/' + (cu.length * 3) + ' ⭐</small></div>';
      }
      var ur = p.units[u.id] || { stars: 0, plays: 0 }, pct = unitPct(u);
      var cls = ur.stars >= 3 ? 'gold' : ur.plays ? '' : 'fresh';
      if (u.id === nextId) cls += ' next';
      h += '<div class="unit" style="transform:translateX(' + offs[k % offs.length] + 'px)">' +
        (u.id === nextId ? '<div class="startbubble">ZAČNI · START</div>' : '') +
        '<div class="nodewrap" style="background:conic-gradient(var(--ok) ' + pct + '%, var(--card2) 0)">' +
        '<button class="node ' + cls + '" data-a="unit" data-u="' + u.id + '">' + u.icon + '</button></div>' +
        '<div class="ulabel"><span class="tag">' + esc(u.tag || '') + '</span><br>' + esc(u.title) + '<small>' + esc(u.en) + '</small>' +
        '<div class="stars">' + starsHtml(ur.stars) + '</div></div></div>';
      k++;
    });
    return h + '</div>';
  }
  function vWords(p) {
    var h = gradeBar(p);
    if (!gradeHasWords(p.grade)) return h + '<div class="locked-grade"><div class="big">🔒</div><h2>Čoskoro!</h2></div>';
    h += '<p class="small muted" style="margin:0 0 12px">Zelené bodky = ako dobre slovo vieš. Ťukni na 🔊 a vypočuj si výslovnosť.</p>';
    GRADES[p.grade].units.forEach(function (u) {
      var open = !!ui.open[u.id];
      h += '<div class="wunit" id="wu-' + u.id + '"><h3 data-a="toggleUnit" data-u="' + u.id + '">' + u.icon + '&nbsp; ' + esc((u.tag ? u.tag + ' · ' : '') + u.title) +
        '<small>' + unitPct(u) + '% ' + (open ? '▲' : '▼') + '</small></h3>';
      if (open) u.W.forEach(function (w, i) {
        var s = strength(w), dots = '';
        for (var d = 0; d < 5; d++) dots += '<i class="' + (d < s ? 'on' : '') + '"></i>';
        h += '<div class="wrow"><div class="w"><b>' + esc(w.enAlts.join(' / ')) + '</b><span>' + esc(w.sk) + '</span></div><div class="dots">' + dots + '</div>' +
          '<button class="spk" data-a="say" data-u="' + u.id + '" data-i="' + i + '">🔊</button></div>';
      });
      h += '</div>';
    });
    return h;
  }
  function vBadges(p) {
    var lv = levelOf(p.xp), a = levelXp(lv), b = levelXp(lv + 1), f = Math.round((p.xp - a) / (b - a) * 100);
    var tot = p.stats.correct + p.stats.wrong, acc = tot ? Math.round(p.stats.correct / tot * 100) : 0;
    var h = '<div class="hero"><div class="ava">' + p.avatar + '</div><h2>' + esc(p.name) + '</h2><div class="rank">Úroveň ' + lv + ' · ' + rankOf(p.xp) + '</div>' +
      '<div class="xpbar"><i style="width:' + f + '%"></i></div><div class="small muted">' + (b - p.xp) + ' XP do ďalšej úrovne</div></div>';
    h += '<div class="statgrid"><div class="stat"><b>📚 ' + learnedCount(p) + '</b><span>naučené slová</span></div><div class="stat"><b>🎯 ' + acc + '%</b><span>presnosť</span></div>' +
      '<div class="stat"><b>🔥 ' + p.bestStreak + '</b><span>najdlhšia séria dní</span></div><div class="stat"><b>☄️ ' + p.stats.bestCombo + '</b><span>najviac správne za sebou</span></div></div>';
    var n = BADGES.filter(function (b) { return p.badges[b.id]; }).length;
    h += '<div class="sec-title">Odznaky ' + n + '/' + BADGES.length + '</div><div class="bgrid">';
    BADGES.forEach(function (b) { var on = !!p.badges[b.id]; h += '<div class="badge ' + (on ? 'on' : 'off') + '"><span class="bi">' + b.i + '</span><b>' + b.n + '</b><span>' + b.d + '</span></div>'; });
    return h + '</div><p class="small muted center" style="margin-top:14px">Každý odznak = +2 ❤️</p>';
  }
  function vShop(p) {
    var h = '<div class="wallet"><span style="font-size:34px">❤️</span><span class="big">' + p.hearts + '</span><p>Srdiečka získaš za 5 správnych odpovedí za sebou, lekciu bez chyby a odznaky.</p></div>';
    h += '<div class="sec-title">Farby · Themes</div><div class="tgrid">';
    THEMES.forEach(function (t) {
      var own = p.owned.themes.indexOf(t.id) >= 0, cur = p.theme === t.id;
      h += '<button class="theme ' + (cur ? 'cur' : '') + '" data-a="theme" data-v="' + t.id + '"><div class="sw" style="background:linear-gradient(135deg,' + t.c[0] + ',' + t.c[1] + ')">' +
        '<i style="left:10px;background:' + t.c[2] + '"></i><i style="left:36px;background:' + t.c[3] + '"></i></div>' +
        '<div class="tn">' + t.n + '<small>' + (cur ? '✓ máš' : own ? 'použiť' : '❤️ ' + t.price) + '</small></div></button>';
    });
    h += '</div><div class="sec-title">Avatari</div><div class="avagrid">';
    AV_FREE.concat(AV_SHOP.map(function (x) { return x[0]; })).forEach(function (a) {
      var price = 0; AV_SHOP.forEach(function (x) { if (x[0] === a) price = x[1]; });
      var own = !price || p.owned.avatars.indexOf(a) >= 0;
      h += '<button class="' + (p.avatar === a ? 'sel' : '') + (own ? '' : ' locked') + '" data-a="avatar" data-v="' + a + '">' + a + (own ? '' : '<span class="price">❤️' + price + '</span>') + '</button>';
    });
    return h + '</div>';
  }

  /* ---------- settings ---------- */
  function vSettings() {
    var p = P();
    var h = '<div class="screen"><div class="topbar"><button class="iconbtn" data-a="home">←</button><b style="font-size:18px;margin-left:6px">Profil a nastavenia</b></div><div class="scroll">';
    h += '<div class="hero"><div class="ava">' + p.avatar + '</div><h2>' + esc(p.name) + '</h2><div class="rank">' + p.grade + '. ročník · Úroveň ' + levelOf(p.xp) + '</div></div>';
    h += '<div class="setrow"><span class="si">🔊</span>Zvuky · Sounds<button class="toggle ' + (p.settings.sound ? 'on' : '') + '" data-a="set" data-v="sound"></button></div>';
    h += '<div class="setrow"><span class="si">🗣️</span>Výslovnosť · Voice<button class="toggle ' + (p.settings.voice ? 'on' : '') + '" data-a="set" data-v="voice"></button></div>';
    h += '<button class="btn" data-a="switch" style="margin-top:16px">👥 Prepnúť hráča · Switch player</button>';
    h += '<button class="btn ghost" data-a="delProfile">🗑️ Zmazať hráča</button>';
    h += '<p class="small muted center" style="margin-top:22px">Slovníček ' + APP_VERSION + ' · všetko sa ukladá len v tomto zariadení</p>';
    return h + '</div></div>';
  }

  /* ===================== lessons ===================== */
  var DIFF = { choiceES: 0, choiceSE: 1, listen: 1.6, scramble: 2.3, type: 3 };
  function canDo(t, w) {
    if (t === 'listen') return Voice.ok() && !w.phrase;
    if (t === 'type') return w.typable;
    if (t === 'scramble') return w.scramble;
    return true;
  }
  function typesFor(w) {
    var s = strength(w), plan;
    if (s <= 0) plan = [['choiceES', 'choiceSE'], ['listen', 'choiceSE']];
    else if (s === 1) plan = [['choiceSE', 'listen'], ['scramble', 'choiceES']];
    else if (s <= 3) plan = [['scramble', 'listen', 'choiceSE'], ['type']];
    else plan = [['type', 'scramble']];
    return plan.map(function (opts) { var ok = opts.filter(function (t) { return canDo(t, w); }); return ok.length ? pick(ok) : 'choiceSE'; });
  }
  function dedupe(ws) { var seen = {}; return ws.filter(function (w) { if (seen[w.id]) return false; seen[w.id] = 1; return true; }); }
  // ~3 new words (in textbook order) + words already in progress (weakest / longest unseen first)
  function selectWords(pool, n) {
    var p = P(), seen = [], fresh = [];
    dedupe(pool).forEach(function (w) { (p.words[w.id] ? seen : fresh).push(w); });
    seen = seen.map(function (w) { var r = p.words[w.id], ageH = (Date.now() - r.t) / 36e5; return { w: w, sc: r.s * 3 - Math.min(ageH, 72) / 24 + Math.random() * 3 }; })
      .sort(function (a, b) { return a.sc - b.sc; }).map(function (x) { return x.w; });
    var learning = seen.filter(function (w) { return p.words[w.id].s < 5; });
    var nFresh = Math.max(0, Math.min(fresh.length, learning.length >= 4 ? 3 : n - learning.length));
    var out = fresh.slice(0, nFresh);
    function fill(list) { list.forEach(function (w) { if (out.length < n && out.indexOf(w) < 0) out.push(w); }); }
    fill(learning); fill(fresh); fill(seen);
    return shuffle(out);
  }
  function distractors(w, n) {
    var out = [], wantMulti = w.multi;
    function add(list, strictKind) {
      for (var i = 0; i < list.length && out.length < n; i++) {
        var c = list[i];
        if (strictKind && c.multi !== wantMulti) continue;
        if (confusable(c, w) || out.some(function (o) { return confusable(o, c); })) continue;
        out.push(c);
      }
    }
    var unitW = shuffle(UNITS[w.unit].W), gw = shuffle(GW[w.grade]);
    add(unitW, true); add(gw, true); add(unitW, false); add(gw, false);
    return out;
  }
  function makeEx(t, w) {
    var ex = { t: t, w: w };
    if (t === 'choiceSE' || t === 'choiceES' || t === 'listen') { ex.opts = shuffle([w].concat(distractors(w, 3))); ex.sel = null; }
    if (t === 'scramble') {
      var letters = w.en.toLowerCase().split('');
      if (letters.length >= 4) { var abc = 'aeioulnrstdmpbcgkhy'; for (var i = 0; i < (letters.length >= 7 ? 2 : 1); i++) letters.push(pick(abc.split(''))); }
      var sh = shuffle(letters), guard = 0;
      while (sh.slice(0, w.en.length).join('') === w.en.toLowerCase() && guard++ < 5) sh = shuffle(letters);
      ex.letters = sh; ex.built = [];
    }
    return ex;
  }
  function makeMatch(words) {
    var picked = [];
    words.forEach(function (w) { if (picked.length < 5 && !picked.some(function (o) { return confusable(o, w); })) picked.push(w); });
    return { t: 'match', words: picked, L: shuffle(picked.map(function (_, i) { return i; })), R: shuffle(picked.map(function (_, i) { return i; })), sel: null, done: {}, miss: {}, mist: 0 };
  }
  function buildLesson(words) {
    var first = [], second = [];
    words.forEach(function (w) { var ts = typesFor(w); first.push({ t: ts[0], w: w }); if (ts[1]) second.push({ t: ts[1], w: w }); });
    var plan = first.concat(shuffle(second)).slice(0, Math.max(first.length, 11));
    plan.forEach(function (x) { x.d = DIFF[x.t] + Math.random() * 1.4; });
    plan.sort(function (a, b) { return a.d - b.d; });
    var q = plan.map(function (x) { return makeEx(x.t, x.w); });
    var mt = makeMatch(shuffle(words));
    if (mt.words.length >= 3) q.splice(Math.min(2, q.length), 0, mt);
    // introduce brand-new words (max 3) right before their first exercise
    var intros = 0, p = P();
    words.forEach(function (w) {
      if (intros >= 3 || p.words[w.id]) return;
      for (var i = 0; i < q.length; i++) {
        if (q[i].w === w || (q[i].t === 'match' && q[i].words.indexOf(w) >= 0)) { q.splice(i, 0, { t: 'intro', w: w }); intros++; break; }
      }
    });
    return q;
  }
  function startLesson(kind, unitId) {
    var p = P(), pool;
    if (kind === 'unit') pool = UNITS[unitId].W;
    else {
      pool = GW[p.grade].filter(function (w) { var r = p.words[w.id]; return r && r.s < 4; });
      if (pool.length < 6) pool = pool.concat(shuffle(GW[p.grade].filter(function (w) { return p.words[w.id]; })).slice(0, 8));
      if (pool.length < 6) pool = pool.concat(shuffle(GW[p.grade]).slice(0, 8));
    }
    var words = selectWords(pool, 7);
    ui.L = { kind: kind, unit: unitId || null, queue: buildLesson(words), i: 0, phase: 'answer', correct: 0, wrong: 0, almost: 0, combo: 0, best: 0, xp: 0, hearts: 0, rq: 0, start: Date.now() };
    Sfx.unlock(); go('lesson');
  }
  function curEx() { return ui.L.queue[ui.L.i]; }

  function vLesson() {
    var L = ui.L, ex = curEx(), pct = Math.round(L.i / L.queue.length * 100);
    return '<div class="screen"><div class="lbar"><button class="iconbtn" data-a="quit">✕</button><div class="pbar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="combo" id="combo">' + (L.combo >= 2 ? '🔥' + L.combo : '') + '</div></div>' +
      '<div class="ex" id="ex">' + exHtml(ex) + '</div><div id="foot">' + footHtml(ex) + '</div></div>';
  }
  function bubble(text, speak) {
    var long = String(text).length > 26 ? ' long' : '';
    return '<div class="qrow">' + mascot('think', 64) + '<div class="qbubble' + long + '"><span>' + esc(text) + '</span>' +
      (speak ? '<button class="spk" data-a="sayCur">🔊</button>' : '') + '</div></div>';
  }
  function optsHtml(ex, field) {
    var h = '<div class="opts">';
    ex.opts.forEach(function (o, i) { h += '<button class="opt" data-a="opt" data-i="' + i + '"><span class="k">' + (i + 1) + '</span><span>' + esc(field === 'en' ? o.en : o.sk) + '</span></button>'; });
    return h + '</div>';
  }
  function exHtml(ex) {
    var w = ex.w;
    switch (ex.t) {
      case 'intro':
        return '<div class="prompt-label">Nové slovo</div><div class="prompt-sub">New word – zapamätaj si ho!</div>' +
          '<div class="intro-card"><span class="newtag">NOVÉ · NEW</span><div class="en">' + esc(w.enAlts.join(' / ')) + '</div><div class="sk">' + esc(w.sk) + '</div>' +
          '<div style="margin-top:16px"><button class="spk" style="width:56px;height:56px;font-size:26px" data-a="sayCur">🔊</button></div></div>' +
          '<div style="display:flex;justify-content:center;margin-top:8px">' + mascot('wow', 80, 'bob') + '</div>';
      case 'choiceSE':
        return '<div class="prompt-label">Ako sa to povie po anglicky?</div><div class="prompt-sub">How do you say it in English?</div>' + bubble(w.sk) + optsHtml(ex, 'en');
      case 'choiceES':
        return '<div class="prompt-label">Čo to znamená?</div><div class="prompt-sub">What does it mean?</div>' + bubble(w.en, Voice.ok()) + optsHtml(ex, 'sk');
      case 'listen':
        return '<div class="prompt-label">Čo počuješ?</div><div class="prompt-sub">What do you hear?</div>' +
          '<div class="listen-box"><button class="bigspk" data-a="sayCur">🔊</button><button class="slowspk" data-a="saySlow">🐢</button></div>' + optsHtml(ex, 'en');
      case 'type':
        return '<div class="prompt-label">Napíš po anglicky</div><div class="prompt-sub">Type it in English</div>' + bubble(w.sk) +
          '<div class="typebox"><input id="typein" class="field" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="po anglicky…"></div>' +
          '<button class="skip" data-a="dunno">Neviem · I don\'t know</button>';
      case 'scramble':
        return '<div class="prompt-label">Poskladaj slovo</div><div class="prompt-sub">Build the English word</div>' + bubble(w.sk) +
          '<div class="answer-line" id="aline"></div><div class="tiles" id="tiles"></div><button class="skip" data-a="dunno">Neviem · I don\'t know</button>';
      case 'match':
        var h = '<div class="prompt-label">Spoj dvojice</div><div class="prompt-sub">Match the pairs</div><div class="match" id="mgrid">';
        for (var r = 0; r < ex.words.length; r++) {
          h += mtBtn(ex, 'L', ex.L[r], ex.words[ex.L[r]].en) + mtBtn(ex, 'R', ex.R[r], ex.words[ex.R[r]].sk);
        }
        return h + '</div>';
    }
    return '';
  }
  function mtBtn(ex, side, i, text) {
    var c = ex.done[i] ? 'gone' : (ex.sel && ex.sel.side === side && ex.sel.i === i ? 'sel' : '');
    return '<button class="mt ' + c + '" data-a="mt" data-side="' + side + '" data-i="' + i + '">' + esc(text) + '</button>';
  }
  function footHtml(ex) {
    if (ex.t === 'intro') return '<div class="lfoot"><button class="btn" data-a="next">Pokračovať · Continue</button></div>';
    if (ex.t === 'match') return '';
    return '<div class="lfoot"><button class="btn ok" data-a="check" id="checkBtn" disabled>Skontrolovať · Check</button></div>';
  }
  function afterLessonRender() {
    var ex = curEx();
    if (ex.t === 'intro' || ex.t === 'listen' || ex.t === 'choiceES') setTimeout(function () { Voice.speak(ex.w.en, 'en'); }, 250);
    if (ex.t === 'type') { var f = $('#typein'); setTimeout(function () { f.focus(); }, 120); }
    if (ex.t === 'scramble') drawTiles();
  }
  function drawTiles() {
    var ex = curEx(), a = '', t = '';
    ex.built.forEach(function (li, k) { a += '<button class="tile" data-a="untile" data-k="' + k + '">' + esc(ex.letters[li]) + '</button>'; });
    ex.letters.forEach(function (c, i) { t += '<button class="tile ' + (ex.built.indexOf(i) >= 0 ? 'used' : '') + '" data-a="tile" data-i="' + i + '">' + esc(c) + '</button>'; });
    $('#aline').innerHTML = a; $('#tiles').innerHTML = t;
    var cb = $('#checkBtn'); if (cb) cb.disabled = ex.built.length === 0;
  }
  function acceptableEn(w) {
    var set = w.enAlts.slice();
    function add(a) { if (set.indexOf(a) < 0) set.push(a); }
    (SKIDX[w.grade][w.skKey] || []).forEach(add);
    w.syn.forEach(function (g) { DATA.synonyms[g].forEach(add); });
    return set;
  }
  function gradeTyped(input, alts, grade) {
    var a = cleanAns(input); if (!a) return { r: 'wrong', alt: alts[0] };
    var best = 99, bestAlt = alts[0];
    for (var i = 0; i < alts.length; i++) {
      var t = cleanAns(alts[i]);
      if (a === t || a.replace(/ /g, '') === t.replace(/ /g, '')) return { r: 'correct', alt: alts[i] };
      var d = osa(a, t); if (d < best) { best = d; bestAlt = alts[i]; }
    }
    if (grade && KEYS[grade][a]) return { r: 'wrong', alt: bestAlt }; // it's a different real word
    var L = cleanAns(bestAlt).length, allow = L <= 3 ? 0 : L <= 7 ? 1 : 2;
    return { r: best <= allow ? 'almost' : 'wrong', alt: bestAlt };
  }
  function doCheck() {
    var L = ui.L, ex = curEx(); if (L.phase !== 'answer') return;
    var res, extra = {};
    if (ex.opts) {
      if (ex.sel == null) return;
      res = ex.opts[ex.sel] === ex.w ? 'correct' : 'wrong';
      var btns = document.querySelectorAll('.opt');
      for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = true;
        if (ex.opts[i] === ex.w) btns[i].className = 'opt right';
        else if (i === ex.sel) btns[i].className = 'opt wrongsel';
      }
    } else if (ex.t === 'type') {
      var f = $('#typein'), v = f.value; if (!v.trim()) return;
      var g = gradeTyped(v, acceptableEn(ex.w), ex.w.grade); res = g.r; extra = { input: v.trim(), alt: g.alt };
      f.className = 'field ' + (res === 'wrong' ? 'bad' : 'ok'); f.readOnly = true;
    } else if (ex.t === 'scramble') {
      var built = ex.built.map(function (k) { return ex.letters[k]; }).join('');
      res = built === ex.w.en.toLowerCase() ? 'correct' : 'wrong'; extra = { input: built };
    }
    submit(res, extra);
  }
  function submit(res, extra) {
    var L = ui.L, ex = curEx(), p = P(), ok = res !== 'wrong';
    L.phase = 'fb';
    recWord(ex.w, ok);
    if (ok) {
      L.correct++; p.stats.correct++; if (res === 'almost') L.almost++;
      L.xp += res === 'correct' ? 10 : 6;
      if (ex.t === 'type' && res === 'correct') p.stats.typedExact++;
      comboUp();
    } else {
      L.wrong++; p.stats.wrong++; L.combo = 0; updateCombo();
      if (L.rq < 4) { L.queue.push(makeEx(ex.t, ex.w)); L.rq++; }
    }
    save();
    if (res === 'correct') Sfx.correct(); else if (res === 'almost') Sfx.almost(); else { Sfx.wrong(); buzz(120); }
    if (ex.t !== 'listen' && !(ex.t === 'choiceES' && ok)) setTimeout(function () { Voice.speak(ex.w.en, 'en'); }, 350);
    showSheet(res, ex, extra);
    checkBadges();
  }
  function comboUp() {
    var L = ui.L, p = P(); L.combo++;
    if (L.combo > L.best) L.best = L.combo;
    if (L.combo > p.stats.bestCombo) p.stats.bestCombo = L.combo;
    updateCombo(true);
    if (L.combo % 5 === 0) {
      p.hearts++; p.heartsTotal++; L.hearts++; L.xp += 5;
      setTimeout(function () { Sfx.heart(); burst('❤️', '+1 · ' + L.combo + ' v rade!'); }, 280);
    }
  }
  function updateCombo(hot) {
    var el = $('#combo'); if (!el) return;
    el.textContent = ui.L.combo >= 2 ? '🔥' + ui.L.combo : '';
    if (hot) { el.className = 'combo'; void el.offsetWidth; el.className = 'combo hot'; }
  }
  function showSheet(res, ex, extra) {
    var w = ex.w, msg = res === 'correct' ? pick(PRAISE) : res === 'almost' ? pick(ALMOST) : pick(WRONG);
    var body = '';
    if (res === 'almost') {
      body = '<div><span class="muted">Ty · You:</span> <span class="diff">' + esc(extra.input) + '</span><br><span class="muted">Správne · Correct:</span> <b>' + esc(extra.alt) + '</b> = ' + esc(w.sk) + '</div>';
    } else if (res === 'wrong') {
      body = '<div><span class="muted">Správne · Correct:</span><br><b>' + esc(w.enAlts.join(' / ')) + '</b> = ' + esc(w.sk) + '</div>';
    } else {
      var other = extra.alt && w.enAlts.indexOf(extra.alt) < 0;
      body = '<div><b>' + esc(other ? extra.alt : w.en) + '</b> = ' + esc(w.sk) + (other ? '<br><span class="muted">V učebnici · In the book:</span> <b>' + esc(w.en) + '</b>' : '') + '</div>';
    }
    body += '<button class="spk" data-a="sayCur">🔊</button>';
    var btn = res === 'wrong' ? 'bad' : res === 'almost' ? 'warn' : 'ok';
    $('#foot').innerHTML = '<div class="sheet ' + res + '"><div class="fh"><div class="fi">' + (res === 'wrong' ? '✗' : res === 'almost' ? '≈' : '✓') + '</div>' +
      '<div class="ft">' + msg[0] + '<small>' + msg[1] + '</small></div></div><div class="fb">' + body + '</div>' +
      '<button class="btn ' + btn + '" data-a="next" id="nextBtn">Pokračovať · Continue</button></div>';
    var exEl = $('#ex'); if (exEl) exEl.style.pointerEvents = 'none';
  }
  function nextEx() {
    var L = ui.L;
    L.i++; L.phase = 'answer';
    if (L.i >= L.queue.length) return finishLesson();
    render();
  }
  function onMatchTap(side, i) {
    var L = ui.L, ex = curEx(); if (ex.done[i] && true) return;
    var w = ex.words[i];
    if (side === 'L') Voice.speak(w.en, 'en');
    if (!ex.sel || ex.sel.side === side) { ex.sel = { side: side, i: i }; Sfx.tap(); return redrawMatch(); }
    var a = ex.sel; ex.sel = null;
    if (a.i === i) {
      ex.done[i] = 1; Sfx.match(); L.correct++; P().stats.correct++; L.xp += 4; comboUp();
      if (!ex.miss[i]) recWord(w, true);
      flashMatch(side, i, a.side, 'good');
      if (Object.keys(ex.done).length === ex.words.length) {
        save(); checkBadges();
        setTimeout(function () {
          L.phase = 'fb'; Sfx.correct();
          var msg = ex.mist ? ['Hotovo!', 'All pairs matched!'] : ['Bez chyby! 🎯', 'Perfect matching!'];
          $('#foot').innerHTML = '<div class="sheet correct"><div class="fh"><div class="fi">✓</div><div class="ft">' + msg[0] + '<small>' + msg[1] + '</small></div></div>' +
            '<button class="btn ok" data-a="next" id="nextBtn">Pokračovať · Continue</button></div>';
        }, 450);
      }
    } else {
      ex.mist++; ex.miss[i] = 1; ex.miss[a.i] = 1; L.wrong++; P().stats.wrong++; L.combo = 0; updateCombo();
      Sfx.wrong(); buzz(80); flashMatch(side, i, a.side, 'badm', a.i);
    }
    save();
  }
  function flashMatch(s1, i1, s2, cls, i2) {
    if (i2 == null) i2 = i1;
    var b1 = document.querySelector('.mt[data-side="' + s1 + '"][data-i="' + i1 + '"]'), b2 = document.querySelector('.mt[data-side="' + s2 + '"][data-i="' + i2 + '"]');
    [b1, b2].forEach(function (b) { if (b) b.className = 'mt ' + cls; });
    setTimeout(redrawMatch, cls === 'good' ? 380 : 520);
  }
  function redrawMatch() {
    var ex = curEx(); if (ex.t !== 'match') return;
    var h = '';
    for (var r = 0; r < ex.words.length; r++) h += mtBtn(ex, 'L', ex.L[r], ex.words[ex.L[r]].en) + mtBtn(ex, 'R', ex.R[r], ex.words[ex.R[r]].sk);
    var g = $('#mgrid'); if (g) g.innerHTML = h;
  }
  function finishLesson() {
    var L = ui.L, p = P(), tot = L.correct + L.wrong, acc = tot ? L.correct / tot : 1;
    var stars = acc >= 0.95 ? 3 : acc >= 0.8 ? 2 : 1, xp = L.xp + 15, lv0 = levelOf(p.xp), bonus = 0;
    if (L.wrong === 0 && L.correct >= 5) { xp += 10; p.stats.perfect++; p.hearts++; p.heartsTotal++; bonus = 1; }
    if (L.wrong >= 3) p.stats.comeback++;
    addXp(xp); activity(); p.stats.lessons++;
    if (L.unit) { var u = p.units[L.unit] || (p.units[L.unit] = { stars: 0, plays: 0 }); u.plays++; if (stars > u.stars) u.stars = stars; }
    var nb = checkBadges(true); save();
    ui.R = { kind: 'lesson', stars: stars, xp: xp, acc: Math.round(acc * 100), best: L.best, hearts: L.hearts + bonus, perfect: !!bonus, badges: nb,
      levelUp: levelOf(p.xp) > lv0 ? levelOf(p.xp) : 0, title: L.unit ? UNITS[L.unit].title : 'Opakovanie', secs: Math.round((Date.now() - L.start) / 1000) };
    ui.L = null; go('result'); Sfx.fanfare(); confetti();
  }

  /* ===================== speed challenge ===================== */
  function startSpeed() {
    var p = P(); if (GW[p.grade].length < 4) return;
    ui.SP = { score: 0, end: Date.now() + 60000, lock: false, best: p.speedBest[p.grade] || 0, last: null, wrongs: 0 };
    newSpeedQ(); Sfx.unlock(); go('speed');
    ui.SP.timer = setInterval(speedTick, 100);
  }
  function newSpeedQ() {
    var SP = ui.SP, pool = GW[P().grade], w;
    do { w = pick(pool); } while (SP.last && w === SP.last && pool.length > 1);
    SP.last = w; SP.q = { w: w, dir: Math.random() < 0.5 ? 'se' : 'es', opts: shuffle([w].concat(distractors(w, 3))) };
  }
  function speedQHtml() {
    var q = ui.SP.q, h = '<div class="prompt-label">' + (q.dir === 'se' ? 'Po anglicky?' : 'Čo to znamená?') + '</div>' +
      '<div class="qbubble' + (String(q.dir === 'se' ? q.w.sk : q.w.en).length > 26 ? ' long' : '') + '" style="margin:10px 0 18px;flex:none">' + esc(q.dir === 'se' ? q.w.sk : q.w.en) + '</div><div class="opts">';
    q.opts.forEach(function (o, i) { h += '<button class="opt" data-a="sopt" data-i="' + i + '"><span class="k">' + (i + 1) + '</span><span>' + esc(q.dir === 'se' ? o.en : o.sk) + '</span></button>'; });
    return h + '</div>';
  }
  function vSpeed() {
    var SP = ui.SP, left = Math.max(0, SP.end - Date.now());
    return '<div class="screen"><div class="lbar"><button class="iconbtn" data-a="quit">✕</button><div class="timer"><i id="tbar" style="width:' + (left / 600) + '%"></i></div>' +
      '<div class="score" id="sscore">' + SP.score + '</div></div><div class="ex" id="sq">' + speedQHtml() + '</div>' +
      '<div class="lfoot center small muted">⚡ Rekord: ' + SP.best + ' · Ťukni na správnu odpoveď čo najrýchlejšie!</div></div>';
  }
  function speedTick() {
    var SP = ui.SP; if (!SP) return;
    var left = SP.end - Date.now(), bar = $('#tbar');
    if (bar) bar.style.width = Math.max(0, left / 600) + '%';
    if (left <= 0) finishSpeed();
  }
  function onSpeedOpt(i) {
    var SP = ui.SP; if (!SP || SP.lock) return;
    SP.lock = true;
    var q = SP.q, ok = q.opts[i] === q.w, btns = document.querySelectorAll('#sq .opt');
    for (var k = 0; k < btns.length; k++) { if (q.opts[k] === q.w) btns[k].className = 'opt right'; else if (k === i) btns[k].className = 'opt wrongsel'; }
    if (ok) { SP.score++; Sfx.correct(); var s = $('#sscore'); if (s) { s.textContent = SP.score; s.className = 'score flash-ok'; } }
    else { SP.wrongs++; Sfx.wrong(); buzz(80); recWord(q.w, false); }
    setTimeout(function () {
      if (!ui.SP) return;
      newSpeedQ(); SP.lock = false;
      var sq = $('#sq'); if (sq) sq.innerHTML = speedQHtml();
      var s2 = $('#sscore'); if (s2) s2.className = 'score';
    }, ok ? 260 : 800);
  }
  function stopSpeed() { if (ui.SP && ui.SP.timer) clearInterval(ui.SP.timer); }
  function finishSpeed() {
    var SP = ui.SP, p = P(); stopSpeed(); ui.SP = null;
    var lv0 = levelOf(p.xp), rec = SP.score > (p.speedBest[p.grade] || 0), xp = SP.score * 3;
    if (rec) p.speedBest[p.grade] = SP.score;
    if (SP.score > 0) { addXp(xp); activity(); }
    var nb = checkBadges(true); save();
    ui.R = { kind: 'speed', score: SP.score, record: rec, prev: SP.best, xp: xp, wrongs: SP.wrongs, badges: nb, levelUp: levelOf(p.xp) > lv0 ? levelOf(p.xp) : 0 };
    go('result'); Sfx.fanfare(); if (rec && SP.score > 0) confetti();
  }

  /* ===================== result ===================== */
  function vResult() {
    var R = ui.R, h = '<div class="screen"><div class="scroll result">';
    if (R.kind === 'lesson') {
      h += '<div style="display:flex;justify-content:center">' + mascot('cheer', 120, 'bob') + '</div>' +
        '<h1>' + (R.perfect ? 'Bez chyby! 🎯' : R.stars === 3 ? 'Úžasné!' : R.stars === 2 ? 'Dobrá práca!' : 'Lekcia hotová!') + '</h1>' +
        '<p class="sub">' + esc(R.title) + ' · ' + (R.perfect ? 'Perfect lesson!' : 'Lesson complete!') + '</p>' +
        '<div class="bigstars">' + starsHtml(R.stars) + '</div>';
      if (R.levelUp) h += '<div class="levelup">⬆️ Úroveň ' + R.levelUp + ' · ' + RANKS[Math.min(RANKS.length - 1, R.levelUp - 1)] + '</div>';
      h += '<div class="rstats"><div class="rstat"><span>XP</span><b>⚡ +' + R.xp + '</b></div><div class="rstat"><span>Presnosť</span><b>🎯 ' + R.acc + '%</b></div>' +
        '<div class="rstat"><span>Najdlhšia séria</span><b>🔥 ' + R.best + '</b></div><div class="rstat"><span>Srdiečka</span><b>❤️ +' + R.hearts + '</b></div></div>';
    } else {
      h += '<div style="display:flex;justify-content:center">' + mascot(R.score > 0 ? 'cheer' : 'sad', 120, 'bob') + '</div>' +
        '<h1>' + (R.record && R.score > 0 ? 'Nový rekord! 🚀' : 'Čas vypršal!') + '</h1><p class="sub">Výzva 60 sekúnd · Time\'s up!</p>' +
        '<div style="font-size:64px;font-weight:900;margin:6px 0">' + R.score + '</div>';
      if (R.levelUp) h += '<div class="levelup">⬆️ Úroveň ' + R.levelUp + '</div>';
      h += '<div class="rstats"><div class="rstat"><span>XP</span><b>⚡ +' + R.xp + '</b></div><div class="rstat"><span>Rekord</span><b>🏆 ' + Math.max(R.prev, R.score) + '</b></div></div>';
    }
    if (R.badges && R.badges.length) {
      h += '<div class="newbadges">';
      R.badges.forEach(function (b, i) { h += '<div class="nb" style="animation-delay:' + (0.4 + i * 0.2) + 's"><span class="bi">' + b.i + '</span><div><b>Nový odznak: ' + b.n + '</b><br><span class="small muted">' + b.d + ' · +2 ❤️</span></div></div>'; });
      h += '</div>';
    }
    h += '<button class="btn ok" data-a="home">Pokračovať · Continue</button>';
    if (R.kind === 'speed') h += '<button class="btn ghost" data-a="speed">Skúsiť znova · Try again</button>';
    return h + '</div></div>';
  }

  /* ===================== actions ===================== */
  var A = {
    pickProfile: function (t) { S.cur = t.getAttribute('data-id'); P().used = Date.now(); save(); ui.tab = 'learn'; go('home'); },
    newProfile: function () { ui.np = { step: 1, name: '', avatar: pick(AV_FREE), grade: firstGrade() }; go('new'); },
    npBack: function () { if (ui.np.step > 1) { ui.np.step--; render(); } else go('profiles'); },
    npAva: function (t) { ui.np.avatar = t.getAttribute('data-v'); render(); },
    npGrade: function (t) { ui.np.grade = +t.getAttribute('data-v'); render(); },
    npNext: function () {
      var np = ui.np;
      if (np.step === 1) {
        var name = ($('#nameIn').value || '').trim().replace(/\s+/g, ' ');
        if (!name) { var f = $('#nameIn'); f.style.animation = 'shake .4s'; setTimeout(function () { f.style.animation = ''; }, 450); buzz(60); return; }
        np.name = name;
        var ex = null; Object.keys(S.profiles).forEach(function (k) { if (S.profiles[k].name.toLowerCase() === name.toLowerCase()) ex = S.profiles[k]; });
        if (ex) { S.cur = ex.id; ex.used = Date.now(); save(); toast(ex.avatar, 'Vitaj späť!', ex.name + ', tvoj postup je uložený.'); ui.tab = 'learn'; return go('home'); }
      }
      np.step++; render();
    },
    npDone: function () { var np = ui.np; makeProfile(np.name, np.avatar, np.grade); ui.tab = 'learn'; go('home'); Sfx.badge(); toast(np.avatar, 'Vitaj, ' + np.name + '!', 'Za každých 5 správnych v rade dostaneš ❤️'); },
    tab: function (t) { ui.tab = t.getAttribute('data-v'); render(); var sc = $('#homeScroll'); if (sc) sc.scrollTop = 0; },
    grade: function (t) {
      var g = +t.getAttribute('data-v');
      if (!gradeHasWords(g)) { toast('🔒', 'Čoskoro · Coming soon', g + '. ročník ešte nemá slovíčka.'); return; }
      P().grade = g; save(); render();
    },
    unit: function (t) {
      var u = UNITS[t.getAttribute('data-u')], ur = P().units[u.id] || { stars: 0, plays: 0 };
      modal('<div class="center"><div style="font-size:54px">' + u.icon + '</div><h3>' + esc((u.tag ? u.tag + ' · ' : '') + u.title) + '</h3>' +
        '<p>' + esc(u.en) + ' · ' + u.W.length + ' slov · zvládnuté ' + unitPct(u) + '%<br>' + starsHtml(ur.stars) + '</p></div>' +
        '<button class="btn ok" data-a="startUnit" data-u="' + u.id + '">▶ Štart lekcie</button>' +
        '<button class="btn ghost" data-a="unitWords" data-u="' + u.id + '">📖 Pozrieť slovíčka</button>');
    },
    startUnit: function (t) { startLesson('unit', t.getAttribute('data-u')); },
    unitWords: function (t) {
      var id = t.getAttribute('data-u'); ui.open = {}; ui.open[id] = 1; ui.tab = 'words'; go('home');
      var el = document.getElementById('wu-' + id); if (el) el.scrollIntoView();
    },
    toggleUnit: function (t) { var id = t.getAttribute('data-u'); ui.open[id] = !ui.open[id]; var sc = $('#homeScroll'), y = sc ? sc.scrollTop : 0; render(); sc = $('#homeScroll'); if (sc) sc.scrollTop = y; },
    say: function (t) { var w = UNITS[t.getAttribute('data-u')].W[+t.getAttribute('data-i')]; Voice.speak(w.en, 'en'); },
    sayCur: function () { var ex = curEx(); if (ex && ex.w) Voice.speak(ex.w.en, 'en'); },
    saySlow: function () { var ex = curEx(); if (ex && ex.w) Voice.speak(ex.w.en, 'en', true); },
    review: function () { startLesson('review'); },
    speed: function () { if (GW[P().grade].length >= 4) startSpeed(); },
    opt: function (t) {
      var ex = curEx(); if (ui.L.phase !== 'answer') return;
      ex.sel = +t.getAttribute('data-i');
      var btns = document.querySelectorAll('.opt');
      for (var i = 0; i < btns.length; i++) btns[i].className = 'opt' + (i === ex.sel ? ' sel' : '');
      if (ex.t === 'choiceSE') Voice.speak(ex.opts[ex.sel].en, 'en');
      $('#checkBtn').disabled = false;
    },
    check: function () { doCheck(); },
    dunno: function () { if (ui.L.phase !== 'answer') return; var f = $('#typein'); if (f) f.readOnly = true; submit('wrong', { skipped: 1 }); },
    tile: function (t) { var ex = curEx(), i = +t.getAttribute('data-i'); if (ui.L.phase !== 'answer' || ex.built.indexOf(i) >= 0) return; ex.built.push(i); drawTiles(); },
    untile: function (t) { var ex = curEx(); if (ui.L.phase !== 'answer') return; ex.built.splice(+t.getAttribute('data-k'), 1); drawTiles(); },
    mt: function (t) { if (ui.L.phase !== 'answer') return; onMatchTap(t.getAttribute('data-side'), +t.getAttribute('data-i')); },
    next: function () { nextEx(); },
    sopt: function (t) { onSpeedOpt(+t.getAttribute('data-i')); },
    quit: function () {
      modal('<h3>Naozaj skončiť? 😢</h3><p>Postup v tejto lekcii sa stratí. · Quit? You\'ll lose this round.</p>' +
        '<button class="btn ok" data-a="modalClose">Pokračovať v hre</button><button class="btn ghost" data-a="quitYes">Skončiť · Quit</button>');
    },
    quitYes: function () { stopSpeed(); ui.SP = null; ui.L = null; go('home'); },
    home: function () { stopSpeed(); ui.SP = null; go('home'); },
    settings: function () { go('settings'); },
    set: function (t) { var k = t.getAttribute('data-v'), p = P(); p.settings[k] = !p.settings[k]; save(); render(); if (k === 'voice' && p.settings.voice) Voice.speak('Hello!', 'en'); },
    switch: function () { S.cur = null; save(); go('profiles'); },
    delProfile: function () {
      var p = P();
      modal('<h3>Zmazať hráča ' + esc(p.name) + '?</h3><p>Všetky body, srdiečka a odznaky sa navždy stratia.</p>' +
        '<button class="btn bad" data-a="delYes">Áno, zmazať</button><button class="btn ghost" data-a="modalClose">Zrušiť</button>');
    },
    delYes: function () { delete S.profiles[S.cur]; S.cur = null; save(); if (Object.keys(S.profiles).length) go('profiles'); else A.newProfile(); },
    theme: function (t) {
      var id = t.getAttribute('data-v'), p = P(), th = THEMES.filter(function (x) { return x.id === id; })[0];
      if (p.owned.themes.indexOf(id) < 0) {
        if (p.hearts < th.price) { toast('💔', 'Málo srdiečok', 'Potrebuješ ' + th.price + ' ❤️, máš ' + p.hearts + '.'); return; }
        return modal('<h3>Kúpiť farbu „' + th.n + '“?</h3><p>Stojí ' + th.price + ' ❤️. Máš ' + p.hearts + ' ❤️.</p><button class="btn ok" data-a="buyTheme" data-v="' + id + '">Kúpiť · Buy</button><button class="btn ghost" data-a="modalClose">Zrušiť</button>');
      }
      p.theme = id; save(); render();
    },
    buyTheme: function (t) { var id = t.getAttribute('data-v'), p = P(), th = THEMES.filter(function (x) { return x.id === id; })[0]; p.hearts -= th.price; p.owned.themes.push(id); p.theme = id; p.stats.bought++; save(); closeModal(); render(); Sfx.badge(); confetti(); checkBadges(); },
    avatar: function (t) {
      var a = t.getAttribute('data-v'), p = P(), price = 0; AV_SHOP.forEach(function (x) { if (x[0] === a) price = x[1]; });
      if (price && p.owned.avatars.indexOf(a) < 0) {
        if (p.hearts < price) { toast('💔', 'Málo srdiečok', 'Potrebuješ ' + price + ' ❤️, máš ' + p.hearts + '.'); return; }
        return modal('<div class="center" style="font-size:64px">' + a + '</div><h3 class="center">Kúpiť avatara?</h3><p class="center">Stojí ' + price + ' ❤️. Máš ' + p.hearts + ' ❤️.</p><button class="btn ok" data-a="buyAva" data-v="' + a + '">Kúpiť · Buy</button><button class="btn ghost" data-a="modalClose">Zrušiť</button>');
      }
      p.avatar = a; save(); render();
    },
    buyAva: function (t) { var a = t.getAttribute('data-v'), p = P(), price = 0; AV_SHOP.forEach(function (x) { if (x[0] === a) price = x[1]; }); p.hearts -= price; p.owned.avatars.push(a); p.avatar = a; p.stats.bought++; save(); closeModal(); render(); Sfx.badge(); confetti(); checkBadges(); },
    modalClose: function () { closeModal(); },
    modalBack: function (t, e) { if (e.target === t) closeModal(); }
  };
  var QUIET = { opt: 1, check: 1, next: 1, tile: 1, untile: 1, mt: 1, sopt: 1, say: 1, sayCur: 1, saySlow: 1, modalBack: 1 };
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-a]') : null; if (!t || t.disabled) return;
    var a = t.getAttribute('data-a'); if (!A[a]) return;
    if (!QUIET[a]) Sfx.tap();
    A[a](t, e);
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'typein') { var cb = $('#checkBtn'); if (cb) cb.disabled = !e.target.value.trim(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.keyCode !== 13) return;
    if (ui.screen === 'new' && ui.np && ui.np.step === 1) { e.preventDefault(); return A.npNext(); }
    if (ui.screen === 'lesson' && ui.L) {
      e.preventDefault();
      if (ui.L.phase === 'answer') doCheck(); else if ($('#nextBtn')) nextEx();
    }
  });

  /* Android back button (called from MainActivity). Return true when handled. */
  window.App = {
    onBack: function () {
      if ($('#modal-root').innerHTML) { closeModal(); return true; }
      if (ui.screen === 'lesson' || ui.screen === 'speed') { A.quit(); return true; }
      if (ui.screen === 'settings' || ui.screen === 'result') { go('home'); return true; }
      if (ui.screen === 'new') { A.npBack(); return true; }
      if (ui.screen === 'home' && ui.tab !== 'learn') { ui.tab = 'learn'; render(); return true; }
      return false;
    },
    // test hooks
    _state: function () { return S; }, _ui: function () { return ui; }, _grade: gradeTyped, _acc: acceptableEn, _dis: distractors, _confusable: confusable, _units: UNITS
  };

  /* ===================== boot ===================== */
  if (S.cur && S.profiles[S.cur]) { P().used = Date.now(); ui.screen = 'home'; }
  else if (Object.keys(S.profiles).length) ui.screen = 'profiles';
  else { ui.np = { step: 1, name: '', avatar: pick(AV_FREE), grade: firstGrade() }; ui.screen = 'new'; }
  render();
  if ('speechSynthesis' in window && !(window.Native && Native.speak)) { try { speechSynthesis.getVoices(); } catch (e) { } }
})();
