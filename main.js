"use strict";
// Screens, input, saving and the frame loop.
const Save = {
  key: "just-hits-and-dodges-v1",
  data: { waves: {}, diff: "normal", music: 70, sfx: 80, calm: false, bestRun: 0, hue: 184, autoColor: false },
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object") return;
      if (d.waves && typeof d.waves === "object") this.data.waves = d.waves;
      if (DIFFS[d.diff]) this.data.diff = d.diff;
      if (typeof d.music === "number") this.data.music = d.music;
      if (typeof d.sfx === "number") this.data.sfx = d.sfx;
      if (typeof d.calm === "boolean") this.data.calm = d.calm;
      if (typeof d.bestRun === "number") this.data.bestRun = d.bestRun;
      if (typeof d.hue === "number") this.data.hue = d.hue;
      if (typeof d.autoColor === "boolean") this.data.autoColor = d.autoColor;
    } catch (e) { /* an unreadable save just means starting fresh */ }
  },
  write() {
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* private mode */ }
  },
};

const $ = (id) => document.getElementById(id);
const pad2 = (n) => String(n).padStart(2, "0");
const RANK_ORDER = { S: 4, A: 3, B: 2, C: 1 };
const fmtTime = (s) => `${Math.floor(s / 60)}:${pad2(Math.floor(s % 60))}`;

const App = {
  mode: "menu",      // menu | fight | paused | over
  screen: "title",
  selected: 1,
  runCount: 0,
  overShownAt: 0,
  overDone: false,
  menuT: 0,
};

const MENU_TRACK = { bpm: 112, root: 45, scale: "minor", flavor: "half", seed: 7 };
const SCREENS = ["title", "select", "help", "settings", "pause", "result", "dead"];

function show(name) {
  SCREENS.forEach((s) => { $(s).hidden = s !== name; });
  App.screen = name;
  const first = name && $(name).querySelector("button.primary, button");
  if (first && !isTouch()) first.focus({ preventScroll: true });
}
function hideAll() { SCREENS.forEach((s) => { $(s).hidden = true; }); App.screen = null; if (document.activeElement) document.activeElement.blur(); }
const isTouch = () => window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

function nextUncleared() {
  for (let n = 1; n <= WAVES.length; n++) if (!Save.data.waves[n]) return n;
  return WAVES.length;
}
function clearedCount() { return Object.keys(Save.data.waves).length; }

function refreshTitle() {
  const n = nextUncleared(), c = clearedCount();
  $("btn-play").textContent = c ? `CONTINUE  //  WAVE ${pad2(n)}` : "START  //  WAVE 01";
  $("title-progress").textContent = c ? `${c} of ${WAVES.length} waves cleared   //   best run ${Save.data.bestRun}` : "";
}

/* ---------- wave select ---------- */
function paintTileArt() {
  document.querySelectorAll(".tile canvas").forEach((art) => Render.preview(art, WAVES[+art.dataset.wave - 1].boss, 0.6, 0.3));
}
function buildWaveList() {
  const list = $("wave-list");
  list.innerHTML = "";
  WAVES.forEach((w) => {
    const b = document.createElement("button");
    b.className = "tile";
    b.dataset.wave = w.n;
    b.title = `Wave ${w.n}: ${w.boss.name}`;
    const art = document.createElement("canvas");
    art.width = art.height = 112;
    art.dataset.wave = w.n;
    const num = document.createElement("span"); num.className = "t-num"; num.textContent = pad2(w.n);
    const rank = document.createElement("span"); rank.className = "t-rank";
    const nm = document.createElement("span"); nm.className = "t-name"; nm.textContent = w.boss.name;
    b.append(art, num, rank, nm);
    b.addEventListener("click", () => selectWave(w.n));
    b.addEventListener("dblclick", () => beginRun(w.n));
    list.appendChild(b);
  });
  paintTileArt();
  refreshTiles();
}
function refreshTiles() {
  document.querySelectorAll(".tile").forEach((t) => {
    const n = +t.dataset.wave, rec = Save.data.waves[n];
    t.querySelector(".t-rank").textContent = rec ? rec.rank : "";
    t.className = "tile" + (rec ? ` cleared rank-${rec.rank}` : "") + (n === App.selected ? " active" : "");
  });
  $("select-count").textContent = `${clearedCount()} / ${WAVES.length} CLEARED`;
}
function selectWave(n) {
  App.selected = n;
  const w = WAVES[n - 1], d = w.boss, rec = Save.data.waves[n];
  $("d-wave").textContent = `WAVE ${pad2(n)}  //  ${w.label}`;
  $("d-name").textContent = d.name;
  $("d-title").textContent = d.title;
  $("d-tag").textContent = d.tag;
  const ul = $("d-moves");
  ul.innerHTML = "";
  w.moves.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m.name;
    ul.appendChild(li);
  });
  $("d-best").textContent = rec ? `BEST: RANK ${rec.rank}  //  ${fmtTime(rec.time)}` : "NOT CLEARED YET";
  $("d-fight").textContent = `FIGHT WAVE ${pad2(n)}`;
  refreshTiles();
}
function openSelect() {
  selectWave(App.selected);
  show("select");
  const t = document.querySelector(`.tile[data-wave="${App.selected}"]`);
  if (t) { t.scrollIntoView({ block: "center" }); if (!isTouch()) t.focus({ preventScroll: true }); }
}

/* ---------- fight flow ---------- */
function beginRun(n) { App.runCount = 0; launch(n); }
function launch(n) {
  Sound.init();
  Sound.resume();
  App.selected = n;
  if (Save.data.autoColor) Theme.set(n * 47 + Save.data.hue);
  startFight(n, Save.data.diff);
  Sound.setTrack(game.def.music);
  App.mode = "fight";
  App.overDone = false;
  resetInput();
  hideAll();
  $("touch").hidden = !isTouch();
}
function resetInput() {
  input.mx = input.my = 0;
  input.hitBuf = input.dashBuf = 0;
  input.hitHeld = false;
  keys.clear();
}
function toMenu(screen) {
  App.mode = "menu";
  game = null;
  if (Save.data.autoColor) Theme.set(Save.data.hue);
  $("touch").hidden = true;
  Sound.setTrack(MENU_TRACK);
  App.menuT = 0;
  refreshTitle();
  refreshTiles();
  if (screen === "select") openSelect(); else show(screen || "title");
}
function pauseGame() {
  if (App.mode !== "fight") return;
  App.mode = "paused";
  Sound.suspend();
  $("pause-info").textContent = `WAVE ${pad2(game.n)}  //  ${game.def.name}`;
  $("touch").hidden = true;
  show("pause");
}
function resumeGame() {
  if (App.mode !== "paused") return;
  App.mode = "fight";
  Sound.resume();
  resetInput();
  hideAll();
  $("touch").hidden = !isTouch();
}
function finishWin() {
  const g = game, n = g.n, s = g.stats, rank = rankFor(s.hits);
  const prev = Save.data.waves[n];
  Save.data.waves[n] = {
    rank: prev && RANK_ORDER[prev.rank] > RANK_ORDER[rank] ? prev.rank : rank,
    time: prev ? Math.min(prev.time, s.time) : s.time,
  };
  App.runCount++;
  Save.data.bestRun = Math.max(Save.data.bestRun, App.runCount);
  Save.write();
  $("r-wave").textContent = `WAVE ${pad2(n)}  //  ${g.wave.label}`;
  $("r-title").textContent = n === WAVES.length ? "SIGNAL RESTORED" : `${g.def.name} DOWN`;
  $("r-rank").textContent = rank;
  $("r-time").textContent = fmtTime(s.time);
  $("r-hits").textContent = s.hits;
  $("r-beat").textContent = s.perfects;
  $("r-dodge").textContent = s.dodges;
  $("r-run").textContent = n === WAVES.length
    ? `You beat the final wave. This run cleared ${App.runCount} in a row.`
    : `This run: ${App.runCount} wave${App.runCount === 1 ? "" : "s"} in a row`;
  const nx = $("btn-next");
  if (n < WAVES.length) {
    nx.textContent = `NEXT  //  WAVE ${pad2(n + 1)}`;
    nx.hidden = false;
  } else nx.hidden = true;
  App.mode = "over";
  App.overShownAt = performance.now();
  $("touch").hidden = true;
  show("result");
  if (n === WAVES.length) $("btn-replay").focus();
}
function finishDeath() {
  const g = game, left = Math.ceil((g.boss.hp / g.boss.maxHp) * 100);
  $("x-wave").textContent = `WAVE ${pad2(g.n)}  //  ${g.def.name}`;
  $("x-info").textContent = `It had ${left}% health left. Run ended after ${App.runCount} cleared.`;
  App.runCount = 0;
  App.mode = "over";
  App.overShownAt = performance.now();
  $("touch").hidden = true;
  show("dead");
}
const overReady = () => performance.now() - App.overShownAt > 450;

/* ---------- input ---------- */
const keys = new Set();
const MOVE_KEYS = {
  KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0],
};
const HIT_KEYS = new Set(["KeyJ", "KeyZ", "Enter"]);
const DASH_KEYS = new Set(["Space", "KeyK", "KeyX", "ShiftLeft", "ShiftRight"]);

function syncMove() {
  let x = 0, y = 0;
  keys.forEach((k) => { const m = MOVE_KEYS[k]; if (m) { x += m[0]; y += m[1]; } });
  input.mx = x; input.my = y;
}
window.addEventListener("keydown", (e) => {
  const inFight = App.mode === "fight";
  if (inFight) {
    if (MOVE_KEYS[e.code]) { keys.add(e.code); syncMove(); e.preventDefault(); return; }
    if (e.repeat) { if (HIT_KEYS.has(e.code) || DASH_KEYS.has(e.code)) e.preventDefault(); return; }
    if (HIT_KEYS.has(e.code)) { input.hitBuf = 0.12; input.hitHeld = true; keys.add(e.code); e.preventDefault(); return; }
    if (DASH_KEYS.has(e.code)) { input.dashBuf = 0.12; e.preventDefault(); return; }
    if (e.code === "Escape" || e.code === "KeyP") { pauseGame(); e.preventDefault(); return; }
    if (e.code === "KeyR") { launch(game.n); e.preventDefault(); }
    if (e.code === "KeyC") { nextNeon(); e.preventDefault(); }
    return;
  }
  if (e.repeat) return;
  if (App.mode === "paused") {
    if (e.code === "Escape" || e.code === "KeyP") { resumeGame(); e.preventDefault(); }
    return;
  }
  if (App.mode === "over") {
    if (!overReady()) { e.preventDefault(); return; }
    if (e.code === "KeyR") { launch(game.n); e.preventDefault(); return; }
    if (e.code === "Escape") { toMenu("select"); e.preventDefault(); }
    return;
  }
  if (App.mode === "menu") {
    if (e.code === "Escape" && App.screen && App.screen !== "title") { Sound.sfx("ui"); show("title"); e.preventDefault(); return; }
    if (App.screen === "select") waveKeys(e);
  }
});
window.addEventListener("keyup", (e) => {
  keys.delete(e.code);
  if (MOVE_KEYS[e.code]) syncMove();
  if (HIT_KEYS.has(e.code) && ![...keys].some((k) => HIT_KEYS.has(k))) input.hitHeld = false;
});
// Arrow keys walk the wave grid: left/right by wave, up/down by boss.
function waveKeys(e) {
  const tiles = [...document.querySelectorAll(".tile")];
  const cols = Math.max(1, tiles.filter((t) => t.offsetTop === tiles[0].offsetTop).length);
  const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols }[e.code];
  if (!d) return;
  e.preventDefault();
  const n = clamp(App.selected + d, 1, WAVES.length);
  selectWave(n);
  const t = document.querySelector(`.tile[data-wave="${n}"]`);
  if (t) { t.focus({ preventScroll: true }); t.scrollIntoView({ block: "nearest" }); }
}
const cvs = $("game");
cvs.addEventListener("mousedown", (e) => {
  if (App.mode !== "fight") return;
  if (e.button === 2) input.dashBuf = 0.12;
  else if (e.button === 0) { input.hitBuf = 0.12; input.hitHeld = true; }
});
window.addEventListener("mouseup", (e) => { if (e.button === 0 && ![...keys].some((k) => HIT_KEYS.has(k))) input.hitHeld = false; });
cvs.addEventListener("contextmenu", (e) => e.preventDefault());
window.addEventListener("blur", () => { if (App.mode === "fight") pauseGame(); keys.clear(); });
document.addEventListener("visibilitychange", () => { if (document.hidden && App.mode === "fight") pauseGame(); });

// Touch: the whole left half of the screen acts as the stick, so you never have to look for it.
(function touchControls() {
  const stick = $("stick"), nub = $("nub");
  let id = null, cx = 0, cy = 0;
  const R = 56;
  const moveTo = (x, y) => {
    const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy), m = Math.min(1, d / R);
    const nx = d ? dx / d : 0, ny = d ? dy / d : 0;
    input.mx = nx * m; input.my = ny * m;
    nub.style.transform = `translate(${nx * m * R}px,${ny * m * R}px)`;
  };
  window.addEventListener("touchstart", (e) => {
    if (App.mode !== "fight") return;
    for (const t of e.changedTouches) {
      if (id === null && t.clientX < window.innerWidth * 0.55 && !t.target.closest(".t-btn,.t-small")) {
        id = t.identifier; cx = t.clientX; cy = t.clientY;
        stick.style.left = cx - 62 + "px";
        stick.style.top = cy - 62 + "px";
        stick.style.bottom = "auto";
        moveTo(t.clientX, t.clientY);
      }
    }
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (App.mode === "fight") e.preventDefault();
    for (const t of e.changedTouches) if (t.identifier === id) moveTo(t.clientX, t.clientY);
  }, { passive: false });
  const end = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === id) {
        id = null;
        input.mx = input.my = 0;
        nub.style.transform = "";
      }
    }
  };
  window.addEventListener("touchend", end);
  window.addEventListener("touchcancel", end);
  const hold = (btn, down, up) => {
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); btn.classList.add("down"); down(); }, { passive: false });
    const off = (e) => { e.preventDefault(); btn.classList.remove("down"); if (up) up(); };
    btn.addEventListener("touchend", off, { passive: false });
    btn.addEventListener("touchcancel", off, { passive: false });
  };
  hold($("t-hit"), () => { input.hitBuf = 0.12; input.hitHeld = true; }, () => { input.hitHeld = false; });
  hold($("t-dodge"), () => { input.dashBuf = 0.12; });
  $("t-pause").addEventListener("click", pauseGame);
})();

/* ---------- menu wiring ---------- */
function wake() {
  Sound.init();
  Sound.resume();
}
document.addEventListener("pointerdown", wake);
document.addEventListener("keydown", wake);
document.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { wake(); Sound.sfx("ui"); }));
document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => show(b.dataset.go)));

$("btn-play").addEventListener("click", () => beginRun(nextUncleared()));
$("btn-waves").addEventListener("click", () => { App.selected = nextUncleared(); openSelect(); });
$("btn-help").addEventListener("click", () => show("help"));
$("btn-settings").addEventListener("click", () => { refreshSettings(); show("settings"); });
$("d-fight").addEventListener("click", () => beginRun(App.selected));
$("btn-resume").addEventListener("click", resumeGame);
$("btn-restart").addEventListener("click", () => { Sound.resume(); launch(game.n); });
$("btn-quit").addEventListener("click", () => { Sound.resume(); toMenu("select"); });
$("btn-next").addEventListener("click", () => { if (overReady()) launch(game.n + 1); });
$("btn-replay").addEventListener("click", () => { if (overReady()) launch(game.n); });
$("btn-r-quit").addEventListener("click", () => toMenu("select"));
$("btn-retry").addEventListener("click", () => { if (overReady()) launch(game.n); });
$("btn-x-quit").addEventListener("click", () => toMenu("select"));

function setNeon(hue) {
  Save.data.hue = ((hue % 360) + 360) % 360;
  Theme.set(Save.data.hue);
  Save.write();
  refreshSettings();
}
// The C key steps through the presets, starting from whichever is nearest the current colour.
function nextNeon() {
  const i = NEON_PRESETS.map((p) => p.hue).sort((a, b) => a - b).find((h) => h > Theme.hue);
  setNeon(i === undefined ? Math.min(...NEON_PRESETS.map((p) => p.hue)) : i);
}
function applyThemeToPage() {
  const root = document.documentElement.style;
  root.setProperty("--cyan", CY);
  root.setProperty("--ice", ICE);
  root.setProperty("--neon", NEON);
  const meta = document.querySelector("meta[name=theme-color]");
  if (meta) meta.setAttribute("content", DARK);
}
function refreshSettings() {
  document.querySelectorAll("#swatches button").forEach((b) => b.classList.toggle("on", +b.dataset.hue === Math.round(Save.data.hue)));
  $("hue").value = Math.round(Save.data.hue);
  $("auto-color").textContent = Save.data.autoColor ? "ON" : "OFF";
  $("auto-color").setAttribute("aria-pressed", String(Save.data.autoColor));
  document.querySelectorAll("#diff button").forEach((b) => b.classList.toggle("on", b.dataset.diff === Save.data.diff));
  $("vol-music").value = Save.data.music;
  $("vol-sfx").value = Save.data.sfx;
  $("calm").textContent = Save.data.calm ? "ON" : "OFF";
  $("calm").setAttribute("aria-pressed", String(Save.data.calm));
  resetArmed = false;
  $("reset").textContent = "ERASE ALL PROGRESS";
}
function applyAudioSettings() { Sound.setVolumes(Save.data.music / 100, Save.data.sfx / 100); }
document.querySelectorAll("#diff button").forEach((b) => b.addEventListener("click", () => {
  Save.data.diff = b.dataset.diff; Save.write(); refreshSettings();
}));
$("vol-music").addEventListener("input", (e) => { Save.data.music = +e.target.value; applyAudioSettings(); Save.write(); });
$("vol-sfx").addEventListener("input", (e) => { Save.data.sfx = +e.target.value; applyAudioSettings(); Save.write(); });
$("calm").addEventListener("click", () => {
  Save.data.calm = !Save.data.calm;
  Render.setCalm(Save.data.calm);
  Save.write();
  refreshSettings();
});
NEON_PRESETS.forEach((p) => {
  const b = document.createElement("button");
  b.dataset.hue = p.hue;
  b.title = p.name;
  b.setAttribute("aria-label", p.name);
  const swatch = toHex(hslToRgb(p.hue, 1, 0.5));
  b.style.background = swatch;
  b.style.boxShadow = `0 0 12px ${swatch}`;
  b.addEventListener("click", () => setNeon(p.hue));
  $("swatches").appendChild(b);
});
$("hue").addEventListener("input", (e) => setNeon(+e.target.value));
$("auto-color").addEventListener("click", () => {
  Save.data.autoColor = !Save.data.autoColor;
  Save.write();
  refreshSettings();
});
let resetArmed = false;
$("reset").addEventListener("click", () => {
  if (!resetArmed) { resetArmed = true; $("reset").textContent = "CLICK AGAIN TO ERASE EVERYTHING"; return; }
  Save.data.waves = {};
  Save.data.bestRun = 0;
  Save.write();
  refreshTitle();
  refreshTiles();
  refreshSettings();
});

/* ---------- frame loop ---------- */
let lastNow = 0, acc = 0, previewT = 0;
const previewBoss = { x: 0, y: 0, r: 56, flash: 0, parts: [], heading: 0 };

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - lastNow) / 1000 || 0);
  lastNow = now;
  if (App.mode === "fight") {
    acc += dt;
    while (acc >= STEP) { stepGame(STEP); acc -= STEP; }
    if (game.state === "win" && game.t - game.endT > 1.5) finishWin();
    else if (game.state === "dead" && game.t - game.endT > 1.1) finishDeath();
  } else if (App.mode === "over") {
    stepGame(dt);
  }
  if (game && App.mode !== "menu") {
    Sound.update(game.beat, musicLevel(), game.muted > 0 || App.mode === "paused");
    Render.frame(game);
  } else {
    App.menuT += dt;
    const beat = (App.menuT * MENU_TRACK.bpm) / 60;
    Sound.update(beat, 2, false);
    const def = App.screen === "select" ? WAVES[App.selected - 1].boss : ROSTER[Math.floor(App.menuT / 8) % ROSTER.length];
    previewBoss.r = def.r;
    Render.menu(App.menuT, beat, App.screen === "title" ? def : null, previewBoss);
    if (App.screen === "select") {
      previewT += dt;
      Render.preview($("detail-art"), def, previewT, Math.pow(1 - (beat % 1), 3));
    }
  }
}

Save.load();
Theme.listeners.push(applyThemeToPage);
Theme.set(Save.data.hue);
Render.setup(cvs);
Render.setCalm(Save.data.calm);
Sound.setVolumes(Save.data.music / 100, Save.data.sfx / 100);
Sound.setTrack(MENU_TRACK);
buildWaveList();
Theme.listeners.push(paintTileArt);
refreshTitle();
selectWave(nextUncleared());
show("title");
requestAnimationFrame((t) => { lastNow = t; loop(t); });
