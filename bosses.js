"use strict";
// The roster. Each boss has a look, a song and four named moves; wave list is built at the bottom.
// A move schedules its attacks in beats, so a telegraph of 2 started on beat 2 lands exactly on beat 4.
const CY = "#00f0ff", ICE = "#d8ffff";
const PI = Math.PI;
const Pl = () => game.player, Bo = () => game.boss;
const sp = (v) => v * game.spMul;
const dn = (n) => Math.max(1, Math.round(n * game.dnMul));
const bodies = () => Bo().parts.filter((q) => q.main);

// Telegraphs a line at the player, then the boss rams along it.
function lunge(b0, tele = 2, dur = 1) {
  at(b0, () => {
    const b = Bo(), a = aim(b.x, b.y);
    const tx = clamp(b.x + Math.cos(a) * 1500, 80, W - 80), ty = clamp(b.y + Math.sin(a) * 1500, 80, H - 80);
    warnLine(b.x, b.y, Math.atan2(ty - b.y, tx - b.x), tele, Bo().r * 1.3).len = Math.hypot(tx - b.x, ty - b.y);
    at(b0 + tele, () => go(tx, ty, dur, "in"));
  });
}
// A safe warning band followed by something actually moving through it.
function warnBand(x, y, w, h, tele) { wall(x, y, w, h, { tele, live: 0, ghost: true }); }

function pg(c, n, r, rot = 0) {
  c.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * TAU;
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.closePath();
}
function ink(c, b, lw = 3) {
  c.lineWidth = lw;
  c.strokeStyle = b.flash > 0 ? ICE : CY;
  c.fillStyle = b.flash > 0 ? ICE : "#001114";
}
const solid = (c, b) => { c.fillStyle = b.flash > 0.4 ? "#ffffff" : CY; };
const dark = (c, b) => { c.fillStyle = b.flash > 0 ? ICE : "#001114"; };

const VOLT = {
  id: "volt", name: "VOLT WARDEN", title: "Gatekeeper of the First Grid",
  tag: "It has guarded this door for ten thousand cycles. Nobody ever got this far to ask why.",
  r: 54, music: { bpm: 118, root: 45, scale: "minor", flavor: "four", seed: 11 },
  moves: [
    { name: "RING CIRCUIT", beats: 16, run(L) {
      go(640, 240, 2);
      every(2, 15, 2, (i) => {
        const b = Bo();
        burst(b.x, b.y, dn(13), sp(180), { off: i * 0.17 });
        if (L >= 2 && i % 2) burst(b.x, b.y, dn(9), sp(110), { off: i * 0.31, r: 7 });
      });
    } },
    { name: "WARDLINE", beats: 16, run(L) {
      go(640, 150, 2);
      const n = 8, cw = W / n;
      for (let i = 0; i < n; i++) {
        at(i * 0.75, () => beam(cw * (i + 0.5), 0, PI / 2, { tele: 2, live: 0.5, w: 74, len: H }));
        at(7 + i * 0.75, () => beam(W - cw * (i + 0.5), 0, PI / 2, { tele: 2, live: 0.5, w: 74, len: H }));
      }
      if (L >= 2) every(1, 14, 3, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), 3, 0.4, sp(230)); });
    } },
    { name: "ARC SNAP", beats: 12, run(L) {
      every(0, 10, L >= 3 ? 1 : 2, () => {
        const p = Pl();
        blast(p.x, p.y, 74, { tele: 2, live: 0.4 });
        if (L >= 2) blast(p.x + rnd(-190, 190), p.y + rnd(-130, 130), 58, { tele: 2, live: 0.4 });
      });
      at(10, () => { const b = Bo(); burst(b.x, b.y, dn(18), sp(170)); });
    } },
    { name: "LOCKDOWN", beats: 20, run(L) {
      go(640, 360, 2);
      const dir = rnd() < 0.5 ? -1 : 1;
      at(1, () => { for (let i = 0; i < 4; i++) beam(640, 360, (i * PI) / 2 + 0.3, { tele: 3, live: 15, w: 22, spin: dir * sp(0.13) }); });
      every(5, 18, L >= 3 ? 2 : 4, (i) => burst(640, 360, dn(10), sp(150), { off: i * 0.4 }));
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    pg(c, 6, s, t * 0.5); c.fill(); c.stroke();
    pg(c, 6, s * (0.52 + pu * 0.12), -t); solid(c, b); c.fill();
    c.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const a = t * 0.5 + (i / 6) * TAU;
      c.beginPath();
      c.moveTo(Math.cos(a) * s * 1.1, Math.sin(a) * s * 1.1);
      c.lineTo(Math.cos(a) * s * (1.3 + pu * 0.25), Math.sin(a) * s * (1.3 + pu * 0.25));
      c.stroke();
    }
  },
};

const SERPENT = {
  id: "serpent", name: "GLASS SERPENT", title: "The Fracture That Learned to Hunt",
  tag: "Every piece you break off keeps slithering.",
  r: 36, home: 200, music: { bpm: 128, root: 41, scale: "phryg", flavor: "break", seed: 23 },
  init(b) {
    for (let i = 0; i < 8; i++) b.parts.push({ x: b.x, y: b.y - i * 34, r: 25 - i * 1.4 });
  },
  update(b) {
    for (let i = 1; i < b.parts.length; i++) {
      const a = b.parts[i - 1], q = b.parts[i], d = Math.max(1, Math.hypot(a.x - q.x, a.y - q.y)), gap = 34;
      if (d > gap) { q.x = a.x + ((q.x - a.x) / d) * gap; q.y = a.y + ((q.y - a.y) / d) * gap; }
    }
  },
  moves: [
    { name: "COIL STRIKE", beats: 16, run(L) {
      const gap = L >= 3 ? 3 : 4;
      for (let k = 0; k * gap < 13; k++) lunge(k * gap, 2, 1);
      if (L >= 1) every(3, 15, gap, () => { const b = Bo(); burst(b.x, b.y, dn(8), sp(150)); });
    } },
    { name: "VENOM ARC", beats: 12, run(L) {
      every(0, 10, 2, (i) => {
        const b = Bo(), s = i % 2 ? 1 : -1;
        fan(b.x, b.y, aim(b.x, b.y) - s * 0.7, dn(6), 1.1, sp(230), { curve: s * 0.75, life: 6 });
        if (L >= 3) fan(b.x, b.y, aim(b.x, b.y) + s * 0.7, dn(4), 0.8, sp(200), { curve: -s * 0.6, life: 6 });
      });
    } },
    { name: "MOLT", beats: 16, run(L) {
      go(200, 170, 2);
      at(2, () => go(1080, 170, 3));
      at(5, () => go(1080, 540, 3));
      at(8, () => go(200, 540, 3));
      at(11, () => go(640, 210, 3));
      every(2, 12, 1, (i) => {
        const b = Bo(), q = b.parts[b.parts.length - 1];
        const stay = B2S(5);
        bullet(q.x, q.y, 0, 0, { r: 15, wait: 99, life: stay, splitAt: stay, split: { n: dn(6), speed: sp(150), off: i * 0.5 } });
      });
    } },
    { name: "OUROBOROS", beats: 20, run(L) {
      let a0 = 0;
      every(0, 16, 1, (i) => {
        const a = a0 + i * 0.95, u = Math.min(1, i / 16);
        go(640 + Math.cos(a) * lerp(540, 320, u), 360 + Math.sin(a) * lerp(280, 180, u), 1);
      });
      every(1, 17, 4, (i) => {
        ring(640, 360, { r: 800, speed: -sp(150), th: 16, gaps: [{ a: rnd(TAU), w: 1 - Math.min(L, 4) * 0.05 }, { a: rnd(TAU), w: 0.75 }], life: 7 });
      });
    } },
  ],
  draw(c, b, t, pu) {
    ink(c, b, 3);
    for (let i = b.parts.length - 1; i >= 1; i--) {
      const q = b.parts[i];
      c.save();
      c.translate(q.x - b.x, q.y - b.y);
      pg(c, 4, q.r * (1 + pu * 0.08), t * 0.8 + i * 0.5);
      c.fill(); c.stroke();
      c.restore();
    }
    c.rotate(b.heading);
    c.beginPath();
    c.moveTo(b.r * 1.2, 0); c.lineTo(-b.r * 0.7, b.r * 0.85); c.lineTo(-b.r * 0.3, 0); c.lineTo(-b.r * 0.7, -b.r * 0.85);
    c.closePath();
    solid(c, b); c.fill(); c.stroke();
    dark(c, b);
    c.beginPath(); c.arc(b.r * 0.35, -b.r * 0.2, 4, 0, TAU); c.arc(b.r * 0.35, b.r * 0.2, 4, 0, TAU); c.fill();
  },
};

const METRO = {
  id: "metro", name: "THE METRONOME", title: "Keeper of Perfect Time",
  tag: "It doesn't hate you. You're just off-beat.",
  r: 56, home: 110, music: { bpm: 100, root: 43, scale: "harm", flavor: "march", seed: 37 },
  moves: [
    { name: "TICK TOCK", beats: 20, run(L) {
      go(640, 90, 2);
      const start = game.moveBase;
      const angle = () => PI / 2 + Math.sin((game.beat - start) * PI / 2) * 1.12;
      at(1, () => {
        beam(640, 40, angle(), { tele: 2, live: 16, w: 28, len: 560, fn(h) { h.a = angle(); } });
        const bob = (h) => { const a = angle(); h.x = 640 + Math.cos(a) * 580; h.y = 40 + Math.sin(a) * 580; };
        const h = blast(640, 620, 44, { tele: 2, live: 16, fn: bob });
        bob(h);
      });
      every(3, 19, L >= 2 ? 1 : 2, () => {
        const a = angle(), x = 640 + Math.cos(a) * 580, y = 40 + Math.sin(a) * 580;
        fan(x, y, -PI / 2, dn(3), 1.2, sp(150), { ay: 150, life: 5 });
      });
    } },
    { name: "DOWNBEAT", beats: 16, run(L) {
      const n = 8, cw = W / n, gap = L >= 4 ? 1.5 : 2;
      every(0, 13, gap, (k) => {
        for (let i = k % 2; i < n; i += 2) wall(i * cw, 0, cw, H, { tele: 2, live: 0.35 });
      });
    } },
    { name: "STOP-GO", beats: 16, run(L) {
      every(0, 14, 2, (i) => {
        const b = Bo();
        burst(b.x, b.y, dn(16), sp(120), { off: i * 0.13, stepping: true, life: 12, r: 10 });
      });
    } },
    { name: "TIME SIGNATURE", beats: 24, run(L) {
      go(640, 90, 2);
      const rows = 6, rh = H / rows;
      const bar = [0, 3, 1, 4, 2, 5, 0, 2, 4, 1, 3, 5];
      bar.forEach((row, i) => at(i * 1.5, () => {
        wall(0, row * rh, W, rh, { tele: 2, live: 0.6 });
        if (L >= 4 && i % 3 === 0) wall(0, ((row + 3) % rows) * rh, W, rh, { tele: 2, live: 0.6 });
      }));
      every(2, 20, 4, (i) => burst(640, 90, dn(12), sp(120), { off: i * 0.22, stepping: true, life: 12 }));
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath();
    c.moveTo(-s * 0.42, -s); c.lineTo(s * 0.42, -s); c.lineTo(s * 0.86, s); c.lineTo(-s * 0.86, s);
    c.closePath(); c.fill(); c.stroke();
    const a = Math.sin((game ? game.beat : t * 2) * PI / 2) * 0.75;
    c.save();
    c.translate(0, s * 0.72);
    c.rotate(a);
    c.lineWidth = 5;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -s * 1.32); c.stroke();
    solid(c, b);
    c.fillRect(-11, -s * 1.05, 22, 15);
    c.restore();
    for (let i = 0; i < 4; i++) { solid(c, b); c.fillRect(-s * 0.56 + i * s * 0.32, s * 0.82, s * 0.2, 4 + (i % 2) * 3 + pu * 4); }
  },
};

const QUEEN = {
  id: "queen", name: "QUEEN HALCYON", title: "Sovereign of the Comb",
  tag: "Every one of them would die for her. Every one of them is about to.",
  r: 58, home: 190, music: { bpm: 136, root: 40, scale: "dorian", flavor: "four", seed: 53 },
  moves: [
    { name: "DRONE SWARM", beats: 16, run(L) {
      every(0, 13, 3, () => {
        const b = Bo(), k = dn(5);
        for (let i = 0; i < k; i++) {
          const a = (i / k) * TAU + rnd(0.5);
          bullet(b.x, b.y, a, sp(170), { home: 1.7 + L * 0.1, homeT: 2.6, r: 8, life: 7, drone: true });
        }
      });
    } },
    { name: "HONEYCOMB", beats: 16, run(L) {
      go(640, 120, 2);
      const R = 92, cells = [];
      for (let r = 0; r < 6; r++) {
        for (let q = 0; q < 10; q++) {
          cells.push({ x: 60 + q * R * 1.5, y: 40 + r * R * 1.72 + (q % 2 ? R * 0.86 : 0), set: (q + (r * 2 + (q % 2))) % 3 });
        }
      }
      const gap = L >= 3 ? 1.5 : 2;
      for (let k = 0; k * gap < 12; k++) {
        at(k * gap, () => cells.forEach((cl) => { if (cl.set === k % 3) blast(cl.x, cl.y, R * 0.97, { tele: 2, live: 0.5 }); }));
      }
    } },
    { name: "ROYAL DECREE", beats: 12, run(L) {
      every(0, 10, 2, () => {
        const b = Bo(), a = aim(b.x, b.y), n = L >= 3 ? 5 : 3;
        for (let i = 0; i < n; i++) beam(b.x, b.y, a + (i - (n - 1) / 2) * 0.42, { tele: 1.75, live: 0.4, w: 20 });
      });
      at(4, () => go(rnd(240, 1040), rnd(130, 280), 2));
    } },
    { name: "HIVE MIND", beats: 20, run(L) {
      go(640, 340, 2);
      const q = Bo();
      every(2, 18, 0.5, (i) => {
        for (let k = 0; k < 3; k++) bullet(q.x, q.y, i * 0.31 + (k * TAU) / 3, sp(150), { curve: 0.42, r: 8, life: 8 });
      });
      every(4, 18, 6, () => {
        for (let i = 0; i < dn(4); i++) bullet(q.x, q.y, rnd(TAU), sp(150), { home: 1.5, homeT: 2.4, r: 8, life: 6 });
      });
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r * 0.46;
    ink(c, b, 3);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + PI / 6, d = s * 1.75 * (1 + pu * 0.06);
      c.save(); c.translate(Math.cos(a) * d, Math.sin(a) * d);
      pg(c, 6, s, 0); c.fill(); c.stroke();
      c.restore();
    }
    pg(c, 6, s * 1.05, 0); solid(c, b); c.fill(); c.stroke();
    c.beginPath();
    c.moveTo(-s, -s * 2.5); c.lineTo(-s * 1.1, -s * 3.5); c.lineTo(-s * 0.4, -s * 2.9); c.lineTo(0, -s * 3.8);
    c.lineTo(s * 0.4, -s * 2.9); c.lineTo(s * 1.1, -s * 3.5); c.lineTo(s, -s * 2.5); c.closePath();
    solid(c, b); c.fill();
  },
};

const TWINS = {
  id: "twins", name: "THE ARGENT TWINS", title: "One Mind, Two Knives",
  tag: "Hit one and the other one remembers.",
  r: 42, home: 170, music: { bpm: 124, root: 47, scale: "minor", flavor: "break", seed: 71 },
  init(b) { b.parts[0].main = true; b.parts.push({ x: W - b.x, y: H - b.y, r: b.r, main: true }); },
  update(b) {
    b.parts[1].x = W - b.x;
    b.parts[1].y = H - b.y;
  },
  moves: [
    { name: "MIRROR LANCE", beats: 16, run(L) {
      go(rnd(260, 1020), 150, 2);
      every(2, 14, 3, () => {
        bodies().forEach((q) => beam(q.x, q.y, aim(q.x, q.y), { tele: 2, live: 0.4, w: 24 }));
      });
      every(5, 14, 6, () => go(rnd(240, 1040), rnd(110, 240), 2));
    } },
    { name: "RICOCHET", beats: 12, run(L) {
      every(0, 8, 4, (i) => {
        bodies().forEach((q) => burst(q.x, q.y, dn(7), sp(210), { off: i * 0.3, bounce: 2, life: 5.5, r: 9 }));
      });
    } },
    { name: "SWAP", beats: 16, run(L) {
      go(170, 120, 2);
      const gap = L >= 3 ? 3 : 4;
      for (let k = 0; k * gap < 11; k++) {
        const x = k % 2 ? 170 : 1110, y = k % 2 ? 120 : 600;
        at(2 + k * gap, () => {
          const b = Bo();
          warnLine(b.x, b.y, Math.atan2(y - b.y, x - b.x), 2, b.r * 1.3);
          if (b.parts[1]) warnLine(b.parts[1].x, b.parts[1].y, Math.atan2(H - y - b.parts[1].y, W - x - b.parts[1].x), 2, b.r * 1.3);
          at(4 + k * gap, () => {
            go(x, y, 1, "in");
            bodies().forEach((q) => burst(q.x, q.y, dn(10), sp(150), { off: k * 0.2 }));
          });
        });
      }
    } },
    { name: "PHANTOM STEP", beats: 16, run(L) {
      // Your own recent path detonates behind you, so standing still and doubling back both cost you.
      every(0, 14, 0.5, () => {
        const p = Pl();
        blast(p.x, p.y, 44, { tele: 2, live: 0.5 });
      });
      every(2, 14, 4, () => bodies().forEach((q) => fan(q.x, q.y, aim(q.x, q.y), 3, 0.3, sp(240))));
      at(0, () => go(640, 110, 2));
    } },
  ],
  draw(c, b, t, pu) {
    const one = (dx, dy, spin) => {
      c.save();
      c.translate(dx, dy);
      ink(c, b, 3);
      pg(c, 4, b.r * 1.1, spin); c.fill(); c.stroke();
      pg(c, 4, b.r * (0.42 + pu * 0.14), -spin); solid(c, b); c.fill();
      c.restore();
    };
    if (b.parts[1]) one(b.parts[1].x - b.x, b.parts[1].y - b.y, -t * 1.2);
    one(0, 0, t * 1.2);
  },
};

const HORIZON = {
  id: "horizon", name: "EVENT HORIZON", title: "The Hungry Silence",
  tag: "Light gave up first. You're doing pretty well, all things considered.",
  r: 60, home: 300, music: { bpm: 110, root: 38, scale: "phryg", flavor: "half", seed: 89 },
  moves: [
    { name: "ACCRETION", beats: 16, run(L) {
      go(640, 340, 2);
      at(0, () => { game.gravity = { x: 640, y: 340, str: 42 + L * 6 }; });
      every(2, 15, 0.5, (i) => {
        for (let k = 0; k < 2; k++) bullet(640, 340, i * 0.42 + k * PI, sp(165), { r: 8, curve: -0.2, life: 8 });
      });
    } },
    { name: "SPAGHETTIFY", beats: 20, run(L) {
      go(640, 340, 2);
      at(0, () => { game.gravity = { x: 640, y: 340, str: 38 + L * 5 }; });
      const n = L >= 3 ? 5 : 3, dir = rnd() < 0.5 ? 1 : -1;
      at(1, () => { for (let i = 0; i < n; i++) beam(640, 340, (i / n) * TAU + rnd(0.3), { tele: 3, live: 14, w: 22, spin: dir * sp(0.17) }); });
    } },
    { name: "HAWKING SPIT", beats: 16, run(L) {
      go(640, 340, 2);
      every(0, 13, 1, (i) => {
        const a = rnd(TAU), x = 640 + Math.cos(a) * 760, y = 340 + Math.sin(a) * 760;
        fan(clamp(x, -40, W + 40), clamp(y, -40, H + 40), a + PI, dn(3), 0.4, sp(180), { r: 8, curve: i % 2 ? 0.34 : -0.34, life: 7 });
      });
    } },
    { name: "SINGULARITY", beats: 20, run(L) {
      go(640, 340, 2);
      at(0, () => { game.gravity = { x: 640, y: 340, str: 95 + L * 6 }; });
      every(1, 13, 4, () => ring(640, 340, { r: 760, speed: -sp(165), th: 14, gaps: [{ a: rnd(TAU), w: 0.85 }, { a: rnd(TAU), w: 0.6 }], life: 6 }));
      at(14, () => { game.gravity = null; Bo().flash = 1; burst(640, 340, dn(32), sp(190)); burst(640, 340, dn(20), sp(110), { off: 0.1, r: 12 }); });
      at(16, () => burst(640, 340, dn(24), sp(250), { off: 0.2 }));
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    c.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      c.lineWidth = 5 - i;
      c.strokeStyle = CY;
      c.globalAlpha = 0.9 - i * 0.24;
      c.beginPath();
      c.ellipse(0, 0, s * (1.5 + i * 0.32 + pu * 0.08), s * (0.5 + i * 0.1), -0.35, t * (1.4 - i * 0.3) + i * 2, t * (1.4 - i * 0.3) + i * 2 + 4.6);
      c.stroke();
    }
    c.globalAlpha = 1;
    c.lineCap = "butt";
    c.beginPath(); c.arc(0, 0, s, 0, TAU);
    c.fillStyle = b.flash > 0 ? ICE : "#000";
    c.fill();
    c.lineWidth = 4; c.strokeStyle = ICE; c.stroke();
  },
};

const RIOT = {
  id: "riot", name: "RIOT ENGINE", title: "Eight Cylinders, No Brakes",
  tag: "It's been redlining since before the road existed.",
  r: 46, home: 180, music: { bpm: 152, root: 42, scale: "minor", flavor: "four", seed: 101 },
  moves: [
    { name: "RAMMING SPEED", beats: 16, run(L) {
      const gap = L >= 3 ? 3 : 4;
      for (let k = 0; k * gap < 13; k++) lunge(k * gap, 2.5, 1);
    } },
    { name: "BURNOUT", beats: 16, run(L) {
      const pts = [[150, 110], [1130, 110], [1130, 610], [150, 610], [640, 200]];
      pts.forEach((q, i) => at(i * 3, () => go(q[0], q[1], 3)));
      every(1, 13, 0.5, () => {
        const b = Bo();
        bullet(b.x, b.y, 0, 0, { r: 13, wait: 99, life: B2S(4), splitAt: B2S(4), split: { n: 4, speed: sp(170), off: rnd(TAU) } });
      });
    } },
    { name: "SCRAP CANNON", beats: 12, run(L) {
      every(0, 10, L >= 3 ? 1.5 : 2, () => {
        const b = Bo();
        bullet(b.x, b.y, aim(b.x, b.y), sp(300), { r: 18, life: 3, splitAt: B2S(2), split: { n: dn(12), speed: sp(190), off: rnd(TAU) } });
      });
    } },
    { name: "HIGHWAY", beats: 28, run(L) {
      go(640, 90, 2);
      const lanes = 6, lh = H / lanes;
      const shape = [[0, 2, 4], [1, 3, 5], [0, 1, 4], [2, 3, 5], [1, 4, 5], [0, 2, 3]];
      shape.forEach((set, k) => at(k * 4, () => {
        set.forEach((lane, i) => {
          const y = lane * lh + 8, fromLeft = (lane + k) % 2 === 0, tele = 2.5;
          warnBand(0, y, W, lh - 16, tele);
          at(k * 4 + tele, () => {
            const v = sp(1150);
            wall(fromLeft ? -380 : W, y, 380, lh - 16, { tele: 0, live: 4.5, vx: fromLeft ? v : -v });
          });
        });
      }));
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    c.rotate(b.heading);
    ink(c, b, 4);
    c.beginPath();
    c.moveTo(s * 1.4, 0); c.lineTo(-s * 0.6, s * 0.9); c.lineTo(-s, s * 0.45); c.lineTo(-s, -s * 0.45); c.lineTo(-s * 0.6, -s * 0.9);
    c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    c.fillRect(-s * 0.55, -s * 1.15, s * 0.8, s * 0.26);
    c.fillRect(-s * 0.55, s * 0.89, s * 0.8, s * 0.26);
    c.beginPath(); c.moveTo(s * 0.8, 0); c.lineTo(-s * 0.1, s * 0.34); c.lineTo(-s * 0.1, -s * 0.34); c.closePath(); c.fill();
    c.globalAlpha = 0.5 + pu * 0.5;
    c.fillRect(-s * (1.25 + pu * 0.6), -s * 0.32, s * 0.2, s * 0.2);
    c.fillRect(-s * (1.25 + pu * 0.6), s * 0.12, s * 0.2, s * 0.2);
    c.globalAlpha = 1;
  },
};

const SIREN = {
  id: "siren", name: "SIREN ZERO", title: "The Song Under the Static",
  tag: "You've been humming along for a while now. Haven't you noticed?",
  r: 54, home: 220, music: { bpm: 140, root: 44, scale: "harm", flavor: "break", seed: 131 },
  moves: [
    { name: "SINE CHOIR", beats: 20, run(L) {
      go(1160, 360, 2);
      const gapH = Math.max(200, 250 - L * 10), start = rnd(TAU);
      every(2, 18, 0.5, (i) => {
        const mid = 360 + Math.sin(start + i * 0.2) * 215;
        for (let y = 12; y < H; y += 34) {
          if (Math.abs(y - mid) > gapH / 2) bullet(W + 20, y, PI, sp(330), { r: 9, life: 6 });
        }
      });
    } },
    { name: "FEEDBACK", beats: 16, run(L) {
      go(640, 220, 2);
      every(1, 14, 2, () => {
        const b = Bo();
        ring(b.x, b.y, { speed: sp(230), th: 16, gaps: [{ a: rnd(TAU), w: 0.7 }, { a: rnd(TAU), w: 0.7 }], spin: rnd(-0.4, 0.4), life: 6 });
      });
    } },
    { name: "SHATTER NOTE", beats: 12, run(L) {
      every(0, 10, 2, (i) => {
        const p = Pl();
        blast(p.x, p.y, 70, { tele: 2, live: 0.3, onFire(h) { burst(h.x, h.y, dn(10), sp(170), { off: i * 0.4 }); } });
      });
    } },
    { name: "THE SCREAM", beats: 24, run(L) {
      go(120, 360, 2);
      const b = Bo();
      every(2, 20, 6, (i) => {
        const up = i % 2 === 0;
        beam(b.x, b.y, up ? -1.0 : 1.0, { tele: 2.5, live: 3.2, w: 104, spin: (up ? 1 : -1) * 0.62, spinTele: false });
      });
      every(3, 22, 3, () => ring(b.x, b.y, { speed: sp(240), th: 14, gaps: [{ a: rnd(-0.8, 0.8), w: 0.7 }], life: 7 }));
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    const wavy = (r, k, amp, ph) => {
      c.beginPath();
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * TAU, q = r + Math.sin(a * k + ph) * amp;
        c.lineTo(Math.cos(a) * q, Math.sin(a) * q);
      }
      c.closePath();
    };
    ink(c, b, 3);
    wavy(s, 7, 5 + pu * 8, t * 3); c.fill(); c.stroke();
    wavy(s * 0.68, 5, 3 + pu * 5, -t * 4); c.stroke();
    wavy(s * 0.36, 3, 2 + pu * 4, t * 5); solid(c, b); c.fill();
  },
};

const OBELISK = {
  id: "obelisk", name: "OBELISK PRIME", title: "The Last Thing Standing",
  tag: "It only knows one move: down.",
  r: 58, home: 130, music: { bpm: 92, root: 36, scale: "minor", flavor: "half", seed: 149 },
  moves: [
    { name: "MONOLITH RAIN", beats: 16, run(L) {
      go(640, 110, 2);
      every(0, 13, L >= 3 ? 0.75 : 1, (i) => {
        const x = i % 3 === 0 ? clamp(Pl().x - 60, 0, W - 120) : rnd(0, W - 120);
        warnBand(x, 0, 120, H, 2);
        at(i * (L >= 3 ? 0.75 : 1) + 2, () => wall(x, -300, 120, 260, { tele: 0, live: 4, vy: sp(1050) }));
      });
    } },
    { name: "CRUSHER", beats: 16, run(L) {
      go(640, 100, 2);
      const gap = Math.max(170, 280 - L * 16);
      const cw = (W - gap) / 2;
      const squeeze = (b0, side) => {
        const finalX = side < 0 ? 0 : W - cw, offX = side < 0 ? -cw : W;
        at(b0, () => wall(finalX, 0, cw, H, {
          tele: 2, live: 3,
          fn(h) {
            if (!h.on) return;
            const u = Math.min(1, (h.age - h.tele) / h.live), e = smooth(u < 0.5 ? u * 2 : (1 - u) * 2);
            h.x = lerp(offX, finalX, e);
          },
        }));
      };
      [0, 6].forEach((b0) => { squeeze(b0, -1); squeeze(b0, 1); });
      every(2, 13, 3, () => { const b = Bo(); fan(b.x, b.y, PI / 2, dn(3), 0.2, sp(220)); });
    } },
    { name: "RUNE LINES", beats: 12, run(L) {
      every(0, 10, 1, (i) => {
        const p = Pl();
        if (i % 2) beam(0, p.y, 0, { tele: 2, live: 0.35, w: 50, len: W });
        else beam(p.x, 0, PI / 2, { tele: 2, live: 0.35, w: 50, len: H });
      });
    } },
    { name: "ZIGGURAT", beats: 24, run(L) {
      go(640, 90, 2);
      const steps = 8, sw = W / steps;
      for (let round = 0; round < 3; round++) {
        const rev = round % 2 === 1;
        for (let i = 0; i < steps; i++) {
          const col = rev ? steps - 1 - i : i, top = 150 + i * 44;
          at(round * 7 + i * 0.5, () => wall(col * sw, top, sw, H - top, { tele: 2, live: 1.2 }));
        }
      }
      every(3, 21, 3, (i) => { const b = Bo(); burst(b.x, b.y, dn(10), sp(150), { off: i * 0.3 }); });
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath();
    c.moveTo(-s * 0.24, -s * 1.38); c.lineTo(s * 0.24, -s * 1.38); c.lineTo(s * 0.68, s * 1.2); c.lineTo(-s * 0.68, s * 1.2);
    c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    c.globalAlpha = 0.55 + pu * 0.45;
    [[-0.34, 0.8, 0.72], [-0.1, 0.18, 0.5], [0.1, -0.42, 0.34], [-0.2, -0.86, 0.24]].forEach(([x, y, w]) => {
      c.fillRect(x * s - (w * s) / 2 + 0.1 * s, y * s, w * s, 7);
    });
    c.globalAlpha = 1;
  },
};

const WIDOW = {
  id: "widow", name: "WIDOW PROTOCOL", title: "Decommissioned. Allegedly.",
  tag: "It was built to catch bugs. It got very literal about it.",
  r: 50, home: 180, music: { bpm: 144, root: 39, scale: "phryg", flavor: "four", seed: 163 },
  moves: [
    { name: "WEB SHOT", beats: 16, run(L) {
      every(0, 13, 2, (i) => {
        const a = rnd(0, W), c = rnd(0, W);
        const ang = Math.atan2(H, c - a);
        beam(a, 0, ang, { tele: 2, live: 3, w: 12, len: Math.hypot(H, c - a) });
        if (L >= 1) slowZone(rnd(180, W - 180), rnd(150, H - 150), 110, 8);
      });
    } },
    { name: "FANG VOLLEY", beats: 12, run(L) {
      every(0, 10, 2, (i) => {
        const b = Bo(), a = aim(b.x, b.y);
        fan(b.x - 30, b.y, a - 0.22, dn(4), 0.5, sp(285), { r: 8 });
        fan(b.x + 30, b.y, a + 0.22, dn(4), 0.5, sp(285), { r: 8 });
      });
    } },
    { name: "SKITTER", beats: 16, run(L) {
      every(0, 14, 2, () => {
        const x = rnd(120, W - 120), y = rnd(100, 500);
        blast(x, y, 112, { tele: 2, live: 0.3, onFire(h) { burst(h.x, h.y, dn(9), sp(170), { off: rnd(TAU) }); } });
        at(game.beat - game.moveBase + 1, () => go(x, y, 1, "in"));
      });
    } },
    { name: "COCOON", beats: 24, run(L) {
      const r = Math.max(180, 240 - L * 10);
      [0, 10].forEach((b0, k) => at(b0, () => {
        const p = Pl(), x = clamp(p.x, r, W - r), y = clamp(p.y, r, H - r), dx = k ? -1 : 1;
        safeZone(x, y, r, { tele: 3, live: 6, vx: dx * 42, vy: 0 });
      }));
      every(4, 22, 2, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(3), 0.5, sp(190)); });
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    c.lineWidth = 4;
    c.strokeStyle = CY;
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 4; i++) {
        const base = -1.0 + i * 0.68, w = Math.sin(t * 7 + i * 2 + side) * 0.14;
        const kx = side * Math.cos(base + w) * s * 1.35, ky = Math.sin(base + w) * s * 1.2 - s * 0.35;
        const fx = side * Math.cos(base * 1.05 + w) * s * 2.05, fy = Math.sin(base + w) * s * 1.85 + s * 0.18;
        c.beginPath(); c.moveTo(0, 0); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
      }
    }
    ink(c, b, 4);
    pg(c, 4, s * 0.74, PI / 4 + 0.785); c.fill(); c.stroke();
    solid(c, b);
    c.beginPath();
    c.moveTo(-s * 0.26, -s * 0.34); c.lineTo(s * 0.26, -s * 0.34); c.lineTo(-s * 0.26, s * 0.34); c.lineTo(s * 0.26, s * 0.34);
    c.closePath(); c.fill();
    c.globalAlpha = 1;
  },
};

const CARDINAL = {
  id: "cardinal", name: "CARDINAL NULL", title: "Patron Saint of Missing Files",
  tag: "ERROR: the thing killing you could not be found.",
  r: 50, home: 200, music: { bpm: 160, root: 46, scale: "harm", flavor: "break", seed: 181 },
  moves: [
    { name: "BAD SECTOR", beats: 16, run(L) {
      const cols = 8, rows = 5, cw = W / cols, ch = H / rows, odds = 0.3 + Math.min(L, 5) * 0.03;
      every(0, 12, 3, () => {
        for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
          if (rnd() < odds) wall(x * cw, y * ch, cw, ch, { tele: 3, live: 0.8 });
        }
      });
    } },
    { name: "TEAR", beats: 16, run(L) {
      go(640, 90, 2);
      every(0, 13, 2.5, () => {
        const y = clamp(Pl().y + rnd(-60, 60) - 60, 0, H - 120), left = rnd() < 0.5, tele = 2;
        warnBand(0, y, W, 120, tele);
        at(game.beat - game.moveBase + tele, () => wall(left ? -900 : W, y, 900, 120, { tele: 0, live: 3, vx: (left ? 1 : -1) * sp(1500) }));
      });
    } },
    { name: "BLACKOUT", beats: 20, run(L) {
      go(640, 150, 2);
      at(0, () => { game.dark = B2S(19); });
      every(2, 18, 2, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(4), 0.55, sp(175), { r: 11 }); });
      every(3, 18, 3, () => { const p = Pl(); blast(p.x, p.y, 70, { tele: 2, live: 0.35 }); });
    } },
    { name: "KERNEL PANIC", beats: 20, run(L) {
      every(0, 18, 3, (i) => {
        let x = 0, y = 0, tries = 0;
        do { x = rnd(140, W - 140); y = rnd(100, H - 200); } while (Math.hypot(x - Pl().x, y - Pl().y) < 300 && ++tries < 12);
        go(x, y, 0.5, "out");
        at((i + 1) * 3 - 1, () => burst(x, y, dn(10), sp(165), { off: i * 0.3 }));
      });
      every(1, 18, 4, (i) => {
        if (i % 2) beam(0, Pl().y, 0, { tele: 2, live: 0.4, w: 34, len: W });
        else beam(Pl().x, 0, PI / 2, { tele: 2, live: 0.4, w: 34, len: H });
      });
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r, slices = 9;
    const seed = Math.floor(t * 9);
    solid(c, b);
    c.globalAlpha = 0.92;
    for (let i = 0; i < slices; i++) {
      const y0 = -s * 1.4 + (i / slices) * s * 2.8, sh = (s * 2.8) / slices;
      const j = Math.sin(seed * 12.9 + i * 78.2) * 43758.5;
      const off = (j - Math.floor(j) - 0.5) * (8 + pu * 28);
      const yc = y0 + sh / 2, w = Math.abs(yc + s * 0.3) < s * 0.27 ? s * 1.05 : s * 0.3;
      c.fillRect(-w + off, y0, w * 2, sh - 1.5);
    }
    c.globalAlpha = 1;
    c.fillStyle = "#000";
    c.fillRect(-s * 0.2, -s * 0.46, s * 0.4, s * 0.26);
  },
};

const ECLIPSE = {
  id: "eclipse", name: "ECLIPSE KING", title: "Last Light of the Old Sky",
  tag: "Bow, or at least stand in the shade while you still can.",
  r: 62, home: 300, music: { bpm: 132, root: 37, scale: "minor", flavor: "march", seed: 199 },
  moves: [
    { name: "CORONA", beats: 20, run(L) {
      go(640, 340, 2);
      const n = 6 + Math.min(L, 4) - 2, dir = rnd() < 0.5 ? 1 : -1;
      at(1, () => { for (let i = 0; i < n; i++) beam(640, 340, (i / n) * TAU, { tele: 3, live: 15, w: 20, spin: dir * sp(0.15) }); });
    } },
    { name: "SOLAR FLARE", beats: 16, run(L) {
      every(0, 14, 2, (i) => {
        const b = Bo();
        ring(b.x, b.y, { speed: sp(220), th: 16, gaps: [{ a: aim(b.x, b.y) + rnd(-0.9, 0.9), w: 0.7 }, { a: rnd(TAU), w: 0.6 }], life: 6 });
        if (i % 2) fan(b.x, b.y, aim(b.x, b.y), dn(5), 0.9, sp(200));
      });
    } },
    { name: "SATELLITES", beats: 20, run(L) {
      go(640, 340, 2);
      const start = game.beat;
      const moon = (ring0, rad, n, spd) => {
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * TAU + ring0;
          const fn = (h) => {
            const u = game.beat - start, grow = Math.min(1, u / 4);
            const a = a0 + u * spd;
            h.x = 640 + Math.cos(a) * rad * grow;
            h.y = 340 + Math.sin(a) * rad * grow * 0.8;
          };
          const h = bullet(640, 340, 0, 0, { r: 15, life: B2S(18), wait: 99, fn });
          fn(h);
        }
      };
      at(0, () => { moon(0, 180, dn(4), 0.2); moon(1, 360, dn(5), -0.13); moon(0.5, 520, dn(7), 0.09); });
      every(6, 18, 4, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), 3, 0.3, sp(230)); });
    } },
    { name: "TOTALITY", beats: 24, run(L) {
      go(640, 110, 2);
      const r = Math.max(240, 280 - L * 8);
      let side = rnd() < 0.5 ? -1 : 1;
      [0, 7, 14].forEach((b0, k) => at(b0, () => {
        side *= -1;
        const x = 640 + side * 250, y = 400;
        safeZone(x, y, r, { tele: 4, live: 3.4, vx: 0, vy: k === 1 ? 26 : -26 });
      }));
      every(3, 22, 4, () => { const b = Bo(); burst(b.x, b.y, dn(8), sp(130), { off: rnd(TAU) }); });
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = CY;
    c.lineWidth = 3;
    const n = 18;
    for (let i = 0; i < n; i++) {
      const a = t * 0.35 + (i / n) * TAU, len = s * (1.28 + (i % 2) * 0.28 + pu * 0.2);
      c.beginPath();
      c.moveTo(Math.cos(a) * s * 1.08, Math.sin(a) * s * 1.08);
      c.lineTo(Math.cos(a + 0.06) * len, Math.sin(a + 0.06) * len);
      c.stroke();
    }
    c.beginPath(); c.arc(0, 0, s, 0, TAU);
    c.fillStyle = b.flash > 0 ? ICE : "#000"; c.fill();
    c.lineWidth = 5; c.strokeStyle = ICE; c.stroke();
    c.beginPath(); c.arc(s * 0.1, -s * 0.05, s * 0.86, 0, TAU);
    c.fillStyle = "#000"; c.fill();
  },
};

const BOSSES = [VOLT, SERPENT, METRO, QUEEN, TWINS, HORIZON, RIOT, SIREN, OBELISK, WIDOW, CARDINAL, ECLIPSE];

const CHOIR = {
  id: "choir", name: "THE LAST CHOIR", title: "Every Voice You Silenced",
  tag: "They all came back for one more verse. It's your turn to take the solo.",
  r: 56, home: 220, music: { bpm: 130, root: 45, scale: "harm", flavor: "break", seed: 211 },
  moves: BOSSES.map((d) => Object.assign({}, d.moves[3], { name: d.moves[3].name + " // " + d.name, owner: d })),
  draw(c, b, t, pu) {
    const o = game && game.move && game.move.owner;
    if (o && o.draw) { o.draw(c, b, t, pu); return; }
    ink(c, b, 3);
    for (let i = 0; i < 3; i++) { pg(c, 3, b.r * (1 - i * 0.2), t * (i % 2 ? -0.9 : 0.9) + i); c.stroke(); }
    pg(c, 6, b.r * (0.26 + pu * 0.1), t); solid(c, b); c.fill();
  },
};

const ZERO = {
  id: "zero", name: "ZERO//HERTZ", title: "The End of the Signal",
  tag: "Everything else you fought was noise. This is what the noise was hiding.",
  r: 60, home: 300, music: { bpm: 148, root: 38, scale: "phryg", flavor: "four", seed: 239 },
  moves: [
    { name: "SILENCE", beats: 24, run(L) {
      go(640, 200, 2);
      at(0, () => { game.muted = B2S(20); game.dark = B2S(20); });
      every(2, 20, 2, (i) => { const b = Bo(); burst(b.x, b.y, dn(14), sp(140), { off: i * 0.2, r: 11 }); });
      every(3, 20, 4, () => { const p = Pl(); blast(p.x, p.y, 90, { tele: 2, live: 0.4 }); });
    } },
    { name: "FLATLINE", beats: 20, run(L) {
      go(640, 90, 2);
      // A full-width line with no gap: the only way past it is to dodge straight through.
      every(0, 16, 5, (i) => {
        const down = i % 2 === 0;
        beam(0, down ? 24 : H - 24, 0, { tele: 2.5, live: 4.5, w: 16, len: W, vy: 0, fn(h) { if (h.on && !h.vy) h.vy = (down ? 1 : -1) * ((H - 48) / B2S(4.5)); } });
      });
      every(1, 18, 2, (i) => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(3), 0.5, sp(210)); });
    } },
    { name: "FULL SPECTRUM", beats: 24, run(L) {
      go(640, 90, 2);
      const n = 16, bw = W / n, gap = 230, start = game.moveBase + 3;
      const mid = (i) => 360 + Math.sin(i * 0.5 + (game.beat - start) * 0.38) * 190;
      for (let i = 0; i < n; i++) {
        const top = wall(i * bw + 2, 0, bw - 4, 10, { tele: 3, live: 18, fn(h) { h.h = Math.max(0, mid(i) - gap / 2); } });
        const bot = wall(i * bw + 2, H, bw - 4, 10, { tele: 3, live: 18, fn(h) { h.y = mid(i) + gap / 2; h.h = H - h.y; } });
        top.fn(top); bot.fn(bot);
      }
    } },
    { name: "LAST WORD", beats: 24, run(L) {
      go(640, 340, 2);
      const dir = rnd() < 0.5 ? 1 : -1;
      at(1, () => { for (let i = 0; i < 4; i++) beam(640, 340, (i / 4) * TAU + 0.5, { tele: 3, live: 19, w: 22, spin: dir * sp(0.16) }); });
      every(3, 22, 4, () => ring(640, 340, { speed: sp(210), th: 14, gaps: [{ a: rnd(TAU), w: 0.75 }, { a: rnd(TAU), w: 0.75 }], life: 6 }));
      every(5, 22, 4, () => { const p = Pl(); blast(p.x, p.y, 70, { tele: 2, live: 0.4 }); });
      every(4, 22, 2, (i) => bullet(640, 340, aim(640, 340), sp(280), { r: 12 }));
    } },
  ],
  draw(c, b, t, pu) {
    const s = b.r;
    c.lineWidth = 3;
    c.strokeStyle = ICE;
    c.beginPath(); c.arc(0, 0, s, 0, TAU);
    c.fillStyle = b.flash > 0 ? ICE : "#000"; c.fill(); c.stroke();
    c.strokeStyle = CY;
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(-s * 1.75, 0); c.lineTo(-s * 0.42, 0);
    c.lineTo(-s * 0.24, -s * pu * 0.75); c.lineTo(0, s * pu * 0.9); c.lineTo(s * 0.2, -s * pu * 0.42); c.lineTo(s * 0.34, 0);
    c.lineTo(s * 1.75, 0);
    c.stroke();
    c.lineWidth = 1.5;
    c.globalAlpha = 0.6;
    c.beginPath(); c.arc(0, 0, s * (1.32 + pu * 0.25), 0, TAU); c.stroke();
    c.globalAlpha = 1;
  },
};

const TIER_NAMES = ["FIRST CONTACT", "ESCALATION", "FULL FORM", "OVERDRIVE"];
const WAVES = [];
BOSSES.forEach((d, i) => {
  const base = 24 + i * 3;
  [1, 1.4, 1.8, 2.3].forEach((m, tier) => {
    WAVES.push({
      n: WAVES.length + 1, boss: d, tier, label: TIER_NAMES[tier],
      moves: d.moves.slice(0, Math.min(4, tier + 2)),
      hp: Math.round(base * m * 2),
      phases: tier >= 2 ? [0.66, 0.33] : [0.5],
    });
  });
});
WAVES.push({ n: 49, boss: CHOIR, tier: 3, label: "REQUIEM", moves: CHOIR.moves, hp: 340, phases: [0.75, 0.5, 0.25] });
WAVES.push({ n: 50, boss: ZERO, tier: 3, label: "END OF SIGNAL", moves: ZERO.moves, hp: 380, phases: [0.75, 0.5, 0.25] });
const ROSTER = BOSSES.concat([CHOIR, ZERO]);
