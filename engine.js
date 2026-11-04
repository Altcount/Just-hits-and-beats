"use strict";
// The fight simulation. No drawing or DOM in here, so it can be stepped by tests as well as the page.
const W = 1280, H = 720, TAU = Math.PI * 2, STEP = 1 / 120;
const PLAYER_R = 7, SPEED = 340, DASH_SPEED = 1150, DASH_T = 0.14, DASH_I = 0.24, DASH_CD = 0.6;
const HIT_I = 1.4, STRIKE_R = 110, STRIKE_CD = 0.45, PERFECT_WIN = 0.085, MAX_CHARGE = 3, INTRO_BEATS = 8;

const DIFFS = {
  chill: { hp: 8, sp: 0.88, label: "CHILL" },
  normal: { hp: 5, sp: 1, label: "NORMAL" },
  brutal: { hp: 3, sp: 1.08, label: "BRUTAL" },
};

const WEAPONS = {
  pulse: { id: "pulse", name: "PULSE", cd: STRIKE_CD, dmg: 1, windup: 0, ring: 5, desc: "A quick ring around you. Get close and keep swinging." },
  quick: { id: "quick", name: "QUICK PULSE", cd: STRIKE_CD * 0.5, dmg: 0.5, windup: 0, ring: 3, desc: "The same ring at half the damage, in half the time. Land hits twice as often." },
  orb: { id: "orb", name: "ORB SHOOTER", cd: STRIKE_CD, dmg: 0.5, windup: 0, ranged: true, desc: "Every attack fires an orb that hits the boss by itself, from anywhere. Small damage." },
  slam: { id: "slam", name: "HEAVY SLAM", cd: 1.15, dmg: 2.5, windup: 0.3, ring: 13, desc: "The same ring, but it takes longer to land and recover and hits far harder." },
};
const WEAPON_ORDER = ["pulse", "quick", "orb", "slam"];

const input = { mx: 0, my: 0, hitBuf: 0, dashBuf: 0, hitHeld: false };
let game = null;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, u) => a + (b - a) * u;
const smooth = (u) => u * u * (3 - 2 * u);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const B2S = (beats) => (beats * 60) / game.bpm;

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = (a = 1, b) => (b === undefined ? game.rng() * a : a + game.rng() * (b - a));

function startFight(n, diffKey, weaponId) {
  const w = WAVES[n - 1], def = w.boss, diff = DIFFS[diffKey] || DIFFS.normal;
  game = {
    n, wave: w, def, diff, bpm: w.music.bpm, state: "intro", t: 0, beat: 0, fightStart: 0,
    hz: [], tl: [], move: null, moveBase: 0, moveEnd: INTRO_BEATS, bag: [], lastMove: null,
    phase: 0, phaseIdx: 0, L: 0, spMul: 1, dnMul: 1,
    player: {
      x: W / 2, y: 590, hp: diff.hp, maxHp: diff.hp, inv: 0, dashT: 0, dashI: 0, dashCd: 0,
      dirX: 0, dirY: -1, hitCd: 0, charge: 0, dodged: false, slowT: 0, alive: true, tilt: 0, weapon: WEAPONS[weaponId] ? weaponId : "pulse", windup: 0,
    },
    boss: {
      x: W / 2, y: -140, bx: W / 2, by: -140, r: def.r, hp: w.hp, maxHp: w.hp, flash: 0, armor: 0,
      tw: null, parts: [], heading: Math.PI / 2, wobble: 1, alive: true,
    },
    rng: makeRng(n * 7919 + 13),
    parts: [], rings: [], floats: [], orbs: [], shake: 0, flash: 0, dark: 0, muted: 0,
    gravity: null, moveFlash: 0, phaseFlash: 0, endT: 0,
    stats: { hits: 0, perfects: 0, dodges: 0, strikes: 0, landed: 0, surges: 0, time: 0, maxHit: 0, fullSurge: false },
  };
  const b = game.boss;
  b.parts.push({ x: b.x, y: b.y, r: def.r, main: true });
  if (def.init) def.init(b);
  applyLevel();
  go(W / 2, def.home || 210, INTRO_BEATS - 2);
  return game;
}

function applyLevel() {
  const g = (game.n - 1) / (WAVES.length - 1);
  game.L = Math.min(5, game.wave.tier + game.phase);
  game.spMul = (1 + 0.04 * game.L + 0.22 * g) * game.diff.sp;
  game.dnMul = 1 + 0.1 * game.L + 0.35 * g;
}

/* ---------- scheduling and boss movement, used by every move ---------- */
function at(b, fn) { game.tl.push({ beat: game.moveBase + b, fn }); }
function every(from, to, stp, fn) {
  let i = 0;
  for (let b = from; b < to - 1e-6; b += stp, i++) {
    const ii = i, bb = b;
    at(b, () => fn(ii, bb));
  }
}
function go(x, y, beats, ease) {
  const b = game.boss;
  b.tw = {
    sx: b.bx, sy: b.by,
    ex: clamp(x, 80, W - 80), ey: clamp(y, 80, H - 80),
    t: 0, dur: Math.max(0.01, B2S(beats)), ease: ease || "smooth",
  };
}

/* ---------- hazards ---------- */
function spawn(h) {
  h.age = 0;
  if (game.hz.length < 1500) game.hz.push(h);
  return h;
}
function bullet(x, y, a, speed, o) {
  const h = { k: "b", x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r: 9, life: 9 };
  return spawn(Object.assign(h, o));
}
function burst(x, y, n, speed, o = {}) {
  const off = o.off || 0;
  for (let i = 0; i < n; i++) bullet(x, y, off + (i / n) * TAU, speed, o);
}
function fan(x, y, a, n, spread, speed, o = {}) {
  for (let i = 0; i < n; i++) {
    bullet(x, y, a + (n > 1 ? (i / (n - 1) - 0.5) * spread : 0), speed, o);
  }
}
function timed(h, o, teleBeats, liveBeats) {
  h.tele = B2S(teleBeats); h.live = B2S(liveBeats); h.on = false;
  return spawn(Object.assign(h, o));
}
function beam(x, y, a, o = {}) {
  const { tele = 2, live = 0.5 } = o;
  const h = { k: "l", x, y, a, w: o.w || 26, len: o.len || 1700, spin: (o.spin || 0) * game.bpm / 60, vx: 0, vy: 0 };
  return timed(h, stripTiming(o), tele, live);
}
function warnLine(x, y, a, tele = 2, w = 10) { return beam(x, y, a, { tele, live: 0, w, ghost: true }); }
function wall(x, y, w, h, o = {}) {
  const { tele = 2, live = 0.5 } = o;
  return timed({ k: "w", x, y, w, h, vx: 0, vy: 0 }, stripTiming(o), tele, live);
}
function blast(x, y, r, o = {}) {
  const { tele = 2, live = 0.4 } = o;
  return timed({ k: "c", x, y, r, vx: 0, vy: 0 }, stripTiming(o), tele, live);
}
function ring(x, y, o = {}) {
  return spawn({ k: "r", x, y, r: o.r === undefined ? 10 : o.r, speed: o.speed || 200, th: o.th || 14, gaps: o.gaps || [], spin: o.spin || 0, life: o.life || 9 });
}
function safeZone(x, y, r, o = {}) {
  const { tele = 3, live = 4 } = o;
  return timed({ k: "s", x, y, r, vx: 0, vy: 0 }, stripTiming(o), tele, live);
}
function slowZone(x, y, r, life) { return timed({ k: "z", x, y, r, vx: 0, vy: 0 }, {}, 0, life); }
function stripTiming(o) { const c = Object.assign({}, o); delete c.tele; delete c.live; delete c.spin; return c; }
const aim = (x, y) => { const p = game.player; return Math.atan2(p.y - y, p.x - x); };

function updateHazards(dt) {
  const hz = game.hz;
  let zapped = false;
  for (let i = hz.length - 1; i >= 0; i--) {
    const h = hz[i];
    h.age += dt;
    let dead = false;
    if (h.fn) h.fn(h, dt);
    if (h.k === "b") {
      if (h.wait > 0) h.wait -= dt;
      else {
        if (h.home && h.age < (h.homeT || 3)) {
          const want = aim(h.x, h.y), cur = Math.atan2(h.vy, h.vx);
          const d = Math.atan2(Math.sin(want - cur), Math.cos(want - cur));
          const a = cur + clamp(d, -h.home * dt, h.home * dt), s = Math.hypot(h.vx, h.vy);
          h.vx = Math.cos(a) * s; h.vy = Math.sin(a) * s;
        }
        if (h.curve) {
          const c = Math.cos(h.curve * dt), s = Math.sin(h.curve * dt), vx = h.vx;
          h.vx = vx * c - h.vy * s; h.vy = vx * s + h.vy * c;
        }
        if (h.ax) h.vx += h.ax * dt;
        if (h.ay) h.vy += h.ay * dt;
        if (h.drag) { const d = Math.max(0, 1 - h.drag * dt); h.vx *= d; h.vy *= d; }
        let m = 1;
        if (h.stepping) { const f = game.beat % 1; m = 2.4 * (1 - f) * (1 - f); }
        h.x += h.vx * dt * m; h.y += h.vy * dt * m;
      }
      if (h.bounce > 0) {
        if (h.x < h.r || h.x > W - h.r) { h.vx *= -1; h.x = clamp(h.x, h.r, W - h.r); h.bounce--; }
        if (h.y < h.r || h.y > H - h.r) { h.vy *= -1; h.y = clamp(h.y, h.r, H - h.r); h.bounce--; }
      } else if (h.x < -60 || h.x > W + 60 || h.y < -60 || h.y > H + 60) dead = true;
      if (h.splitAt && h.age >= h.splitAt) {
        const s = h.split;
        burst(h.x, h.y, s.n, s.speed, { r: s.r || 7, off: s.off || 0 });
        dead = true;
      }
      if (h.age > h.life) dead = true;
    } else if (h.k === "r") {
      h.r += h.speed * dt;
      if (h.spin) h.gaps.forEach((g) => (g.a += h.spin * dt));
      if (h.r > 1600 || h.r <= 0 || h.age > h.life) dead = true;
    } else {
      if (!h.on && h.age >= h.tele) {
        h.on = true;
        if (!h.ghost) zapped = true;
        if (h.onFire) h.onFire(h);
      }
      if (h.on) { h.x += h.vx * dt; h.y += h.vy * dt; }
      if (h.k === "l" && (h.on || h.spinTele)) h.a += h.spin * dt;
      if (h.age >= h.tele + h.live) dead = true;
    }
    if (dead) { hz[i] = hz[hz.length - 1]; hz.pop(); }
  }
  if (zapped) { Sound.sfx("zap"); game.shake = Math.max(game.shake, 3); }
}

function touching(h, x, y, pr) {
  switch (h.k) {
    case "b": return (x - h.x) ** 2 + (y - h.y) ** 2 < (h.r + pr) ** 2;
    case "l": {
      if (!h.on || h.ghost) return false;
      const cx = Math.cos(h.a), cy = Math.sin(h.a), dx = x - h.x, dy = y - h.y;
      const along = clamp(dx * cx + dy * cy, 0, h.len);
      return Math.hypot(dx - cx * along, dy - cy * along) < h.w / 2 + pr;
    }
    case "w":
      return h.on && !h.ghost && x > h.x - pr && x < h.x + h.w + pr && y > h.y - pr && y < h.y + h.h + pr;
    case "c":
      return h.on && !h.ghost && (x - h.x) ** 2 + (y - h.y) ** 2 < (h.r + pr) ** 2;
    case "r": {
      const d = Math.hypot(x - h.x, y - h.y);
      if (Math.abs(d - h.r) > h.th / 2 + pr) return false;
      const a = Math.atan2(y - h.y, x - h.x);
      for (const g of h.gaps) {
        if (Math.abs(Math.atan2(Math.sin(a - g.a), Math.cos(a - g.a))) < g.w / 2) return false;
      }
      return true;
    }
    case "s":
      return h.on && Math.hypot(x - h.x, y - h.y) > h.r - pr;
    default:
      return false;
  }
}

/* ---------- director: picks the next named move ---------- */
function nextMove() {
  const list = game.wave.moves;
  if (!game.bag.length) {
    game.bag = list.slice();
    for (let i = game.bag.length - 1; i > 0; i--) {
      const j = Math.floor(game.rng() * (i + 1));
      [game.bag[i], game.bag[j]] = [game.bag[j], game.bag[i]];
    }
    if (game.bag.length > 1 && game.bag[game.bag.length - 1] === game.lastMove) {
      [game.bag[0], game.bag[game.bag.length - 1]] = [game.bag[game.bag.length - 1], game.bag[0]];
    }
  }
  const m = game.bag.pop();
  game.lastMove = m;
  game.move = m;
  game.moveFlash = 1;
  game.moveBase = game.moveEnd;
  game.moveEnd = game.moveBase + m.beats;
  game.gravity = null;
  game.dark = 0;
  m.run(game.L);
}

/* ---------- player actions ---------- */
function onBeatNow() {
  return (Math.abs(game.beat - Math.round(game.beat)) * 60) / game.bpm < PERFECT_WIN;
}
function hittablePart(reach) {
  const p = game.player;
  let best = null, bestD = Infinity;
  for (const part of game.boss.parts) {
    const d = Math.hypot(part.x - p.x, part.y - p.y) - part.r;
    if (part.hit !== false && d < reach && d < bestD) { best = part; bestD = d; }
  }
  return best;
}
const fightOpen = () => game.state === "fight" && game.boss.armor <= game.t;

// Pressing attack: the weapon decides whether that means a shot, a wind-up or an instant ring.
function attack() {
  const p = game.player, w = WEAPONS[p.weapon];
  p.hitCd = w.cd;
  game.stats.strikes++;
  if (w.ranged) fireOrb(w);
  else if (w.windup) { p.windup = w.windup; Sound.sfx("dash"); }
  else strike();
}

function fireOrb(w) {
  const p = game.player, target = hittablePart(Infinity);
  Sound.sfx("whiff");
  if (!target || game.state !== "fight") return;
  const perfect = onBeatNow(), open = fightOpen();
  const surge = open ? p.charge : 0;
  if (surge) p.charge = 0;
  game.orbs.push({ x: p.x, y: p.y, target, dmg: w.dmg * (perfect ? 2 : 1) + surge * 2, perfect, surge });
}

function updateOrbs(dt) {
  for (let i = game.orbs.length - 1; i >= 0; i--) {
    const o = game.orbs[i], dx = o.target.x - o.x, dy = o.target.y - o.y, d = Math.hypot(dx, dy), s = 1050 * dt;
    if (d <= o.target.r || d <= s) {
      game.orbs.splice(i, 1);
      if (fightOpen()) landHit(o.target, o.dmg, o.perfect, o.surge);
      else addFloat(o.target.x, o.target.y - game.boss.r, "ARMORED", 0.6);
      if (game.state !== "fight") return;
    } else {
      o.x += (dx / d) * s;
      o.y += (dy / d) * s;
    }
  }
}

// The ring landing, for Pulse straight away and for Heavy Slam at the end of its wind-up.
function strike() {
  const p = game.player, b = game.boss, w = WEAPONS[p.weapon];
  game.rings.push({ x: p.x, y: p.y, r: 14, to: STRIKE_R, life: 0.2, age: 0, w: w.ring });
  if (w.windup) game.shake = Math.max(game.shake, 7);
  const target = hittablePart(STRIKE_R);
  if (!target) { Sound.sfx("whiff"); return; }
  if (!fightOpen()) {
    addFloat(target.x, target.y - b.r, "ARMORED", 0.6);
    Sound.sfx("whiff");
    return;
  }
  const perfect = onBeatNow(), surge = p.charge;
  p.charge = 0;
  landHit(target, w.dmg * (perfect ? 2 : 1) + surge * 2, perfect, surge);
}

function landHit(target, dmg, perfect, surge) {
  const b = game.boss, st = game.stats;
  b.hp -= dmg;
  b.flash = 1;
  st.landed++;
  st.maxHit = Math.max(st.maxHit, dmg);
  if (perfect) st.perfects++;
  if (surge) st.surges++;
  if (surge >= MAX_CHARGE) st.fullSurge = true;
  const heavy = dmg >= 2.5;
  sparks(target.x, target.y, surge ? 34 : perfect || heavy ? 18 : 8, surge ? 420 : 260);
  game.rings.push({ x: target.x, y: target.y, r: b.r * 0.6, to: b.r * 1.8, life: 0.22, age: 0, w: 3 });
  const shown = Number.isInteger(dmg) ? String(dmg) : dmg.toFixed(1);
  addFloat(target.x, target.y - b.r - 6, surge ? "SURGE  " + shown : perfect ? "ON BEAT  " + shown : shown, surge || perfect ? 0.9 : 0.5);
  game.shake = Math.max(game.shake, surge ? 12 : perfect ? 6 : heavy ? 5 : 2);
  Sound.sfx(surge ? "surge" : perfect ? "perfect" : "hit");
  if (b.hp <= 0) bossDown();
  else if (game.phaseIdx < game.wave.phases.length && b.hp <= b.maxHp * game.wave.phases[game.phaseIdx]) phaseBreak();
}

// Weapon switching mid-fight keeps the current cooldown, so swapping can't skip Heavy Slam's recovery.
function switchWeapon(id) {
  const p = game.player;
  if (!WEAPONS[id] || p.weapon === id) return;
  p.weapon = id;
  p.windup = 0;
  addFloat(p.x, p.y - 34, WEAPONS[id].name, 0.5);
}

function clearHazards() {
  for (const h of game.hz) if (h.k === "b") sparks(h.x, h.y, 1, 120);
  game.hz.length = 0;
  game.tl.length = 0;
  game.orbs.length = 0;
  game.gravity = null;
  game.dark = 0;
  game.muted = 0;
}

function phaseBreak() {
  clearHazards();
  if (game.move) game.bag.unshift(game.move); // comes back after the moves not yet seen
  game.phaseIdx++;
  game.phase++;
  applyLevel();
  const b = game.boss, p = game.player;
  b.armor = game.t + B2S(3);
  p.hp = Math.min(p.maxHp, p.hp + 1);
  p.inv = Math.max(p.inv, 1);
  game.move = null;
  game.phaseFlash = 1;
  game.moveEnd = (Math.ceil(game.beat / 4 + 1e-6) + 1) * 4;
  game.rings.push({ x: b.x, y: b.y, r: 20, to: 1500, life: 0.8, age: 0, w: 10 });
  sparks(b.x, b.y, 70, 560);
  game.shake = 20;
  game.flash = 0.8;
  go(W / 2, game.def.home || 210, 2);
  Sound.sfx("phase");
}

function bossDown() {
  clearHazards();
  const b = game.boss;
  b.hp = 0;
  b.alive = false;
  game.state = "win";
  game.endT = game.t;
  game.stats.time = game.t - game.fightStart;
  for (const part of b.parts) {
    sparks(part.x, part.y, Math.round(170 * part.r / b.r), 720);
    game.rings.push({ x: part.x, y: part.y, r: 20, to: 1500, life: 1, age: 0, w: 14 });
  }
  game.shake = 34;
  game.flash = 1;
  Sound.sfx("win");
}

function hurtPlayer() {
  const p = game.player;
  p.hp--;
  p.inv = HIT_I;
  p.charge = 0;
  p.windup = 0;
  game.stats.hits++;
  game.shake = 18;
  game.flash = 0.55;
  sparks(p.x, p.y, 26, 420);
  if (p.hp <= 0) {
    p.alive = false;
    game.state = "dead";
    game.endT = game.t;
    game.tl.length = 0;
    sparks(p.x, p.y, 90, 640);
    game.rings.push({ x: p.x, y: p.y, r: 10, to: 900, life: 0.8, age: 0, w: 8 });
    Sound.sfx("die");
  } else Sound.sfx("hurt");
}

function dodgeCredit() {
  const p = game.player;
  if (p.dodged) return;
  p.dodged = true;
  game.stats.dodges++;
  p.charge = Math.min(MAX_CHARGE, p.charge + 1);
  addFloat(p.x, p.y - 26, "DODGE", 0.6);
  game.rings.push({ x: p.x, y: p.y, r: 8, to: 62, life: 0.26, age: 0, w: 3 });
  Sound.sfx("dodge");
}

function updatePlayer(dt) {
  const p = game.player;
  if (!p.alive) return;
  p.inv = Math.max(0, p.inv - dt);
  p.dashI = Math.max(0, p.dashI - dt);
  p.dashCd = Math.max(0, p.dashCd - dt);
  p.hitCd = Math.max(0, p.hitCd - dt);
  p.slowT = Math.max(0, p.slowT - dt);
  input.hitBuf = Math.max(0, input.hitBuf - dt);
  input.dashBuf = Math.max(0, input.dashBuf - dt);

  let mx = input.mx, my = input.my;
  const m = Math.hypot(mx, my);
  if (m > 1) { mx /= m; my /= m; }
  if (m > 0.05) { const l = Math.hypot(mx, my); p.dirX = mx / l; p.dirY = my / l; }

  if (input.dashBuf > 0 && p.dashCd <= 0) {
    input.dashBuf = 0;
    p.dashT = DASH_T;
    p.dashI = DASH_I;
    p.dashCd = DASH_CD;
    p.dodged = false;
    Sound.sfx("dash");
  }
  if (p.dashT > 0) {
    p.dashT -= dt;
    p.x += p.dirX * DASH_SPEED * dt;
    p.y += p.dirY * DASH_SPEED * dt;
    if (Math.random() < 0.6) game.parts.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.28, age: 0, s: 5 });
  } else {
    const sp = SPEED * (p.slowT > 0 ? 0.55 : 1);
    p.x += mx * sp * dt;
    p.y += my * sp * dt;
  }
  if (game.gravity) {
    const g = game.gravity, dx = g.x - p.x, dy = g.y - p.y, d = Math.max(30, Math.hypot(dx, dy));
    p.x += (dx / d) * g.str * dt;
    p.y += (dy / d) * g.str * dt;
  }
  p.x = clamp(p.x, 12, W - 12);
  p.y = clamp(p.y, 12, H - 12);
  p.tilt += (mx * 0.5 - p.tilt) * Math.min(1, dt * 12);

  if (p.windup > 0) {
    p.windup -= dt;
    if (p.windup <= 0) { p.windup = 0; strike(); }
  } else if ((input.hitBuf > 0 || input.hitHeld) && p.hitCd <= 0) { input.hitBuf = 0; attack(); }
}

function updateBoss(dt) {
  const b = game.boss;
  if (!b.alive) return;
  b.flash = Math.max(0, b.flash - dt * 6);
  if (b.tw) {
    const tw = b.tw;
    tw.t += dt;
    const u = Math.min(1, tw.t / tw.dur);
    const e = tw.ease === "in" ? u * u : tw.ease === "out" ? 1 - (1 - u) * (1 - u) : smooth(u);
    const nx = lerp(tw.sx, tw.ex, e), ny = lerp(tw.sy, tw.ey, e);
    if (Math.hypot(nx - b.bx, ny - b.by) > 0.3) b.heading = Math.atan2(ny - b.by, nx - b.bx);
    b.bx = nx; b.by = ny;
    if (u >= 1) b.tw = null;
  }
  b.x = b.bx + Math.sin(game.t * 1.3) * 8 * b.wobble;
  b.y = b.by + Math.cos(game.t * 1.7) * 6 * b.wobble;
  b.parts[0].x = b.x;
  b.parts[0].y = b.y;
  if (game.def.update) game.def.update(b, dt);
}

function collide() {
  const p = game.player;
  if (!p.alive) return;
  const dashing = p.dashI > 0;
  const blocked = p.inv > 0;
  for (const h of game.hz) {
    if (h.k === "z") {
      if (Math.hypot(p.x - h.x, p.y - h.y) < h.r) p.slowT = 0.1;
      continue;
    }
    if (touching(h, p.x, p.y, PLAYER_R)) {
      if (dashing) dodgeCredit();
      else if (!blocked) { hurtPlayer(); return; }
    }
  }
  const b = game.boss;
  if (b.alive && game.state === "fight") {
    for (const part of b.parts) {
      if (Math.hypot(part.x - p.x, part.y - p.y) < part.r * 0.7 + PLAYER_R) {
        if (dashing) dodgeCredit();
        else if (!blocked) { hurtPlayer(); return; }
      }
    }
  }
}

/* ---------- effects ---------- */
function sparks(x, y, n, speed) {
  if (game.parts.length > 500) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, s = speed * (0.25 + Math.random() * 0.75);
    game.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.3 + Math.random() * 0.5, age: 0, s: 2 + Math.random() * 3 });
  }
}
function addFloat(x, y, text, size) { game.floats.push({ x, y, text, size, age: 0, life: 0.8 }); }
function updateFx(dt) {
  for (let i = game.parts.length - 1; i >= 0; i--) {
    const q = game.parts[i];
    q.age += dt;
    if (q.age >= q.life) { game.parts[i] = game.parts[game.parts.length - 1]; game.parts.pop(); continue; }
    q.x += q.vx * dt; q.y += q.vy * dt;
    q.vx *= 1 - 2.5 * dt; q.vy *= 1 - 2.5 * dt;
  }
  game.rings = game.rings.filter((r) => (r.age += dt) < r.life);
  game.floats = game.floats.filter((f) => (f.age += dt) < f.life);
  game.shake = Math.max(0, game.shake - dt * 60);
  game.flash = Math.max(0, game.flash - dt * 2.6);
  game.moveFlash = Math.max(0, game.moveFlash - dt * 0.9);
  game.phaseFlash = Math.max(0, game.phaseFlash - dt * 0.6);
}

function stepGame(dt) {
  game.t += dt;
  game.beat = (game.t * game.bpm) / 60;

  if (game.state === "intro" && game.beat >= INTRO_BEATS) {
    game.state = "fight";
    game.fightStart = game.t;
    Sound.sfx("go");
  }
  if (game.state === "fight") {
    if (game.beat >= game.moveEnd) nextMove();
    const tl = game.tl;
    let due = null;
    for (let i = tl.length - 1; i >= 0; i--) {
      if (tl[i].beat <= game.beat) {
        (due || (due = [])).push(tl[i]);
        tl[i] = tl[tl.length - 1];
        tl.pop();
      }
    }
    if (due) due.forEach((e) => e.fn());
    if (game.state === "fight") {
      game.dark = Math.max(0, game.dark - dt);
      game.muted = Math.max(0, game.muted - dt);
    }
  }
  updateBoss(dt);
  updateHazards(dt);
  updatePlayer(dt);
  if (game.state === "fight") updateOrbs(dt);
  collide();
  updateFx(dt);
}

// Which layers of the song play right now: stripped back in the countdown, fuller with each phase and boss form.
function musicLevel() {
  if (!game) return 2;
  if (game.state === "intro") return 1;
  return clamp(3 + game.phase + game.wave.form, 3, 5);
}

function rankFor(hits) { return hits === 0 ? "S" : hits <= 1 ? "A" : hits <= 3 ? "B" : "C"; }
