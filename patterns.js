"use strict";
// Attack patterns behind the named moves. mv(name, pattern, options) makes one move; options tune it.
function awayPoint(minD, y0 = 90, y1 = H - 60) {
  let x = 0, y = 0, tries = 0;
  do { x = rnd(70, W - 70); y = rnd(y0, y1); } while (Math.hypot(x - Pl().x, y - Pl().y) < minD && ++tries < 14);
  return { x, y };
}
const vLine = (x, w, tele = 2, live = 0.5) => beam(x, 0, PI / 2, { tele, live, w, len: H });
const hLine = (y, w, tele = 2, live = 0.5) => beam(0, y, 0, { tele, live, w, len: W });

// How far the player can get in this many seconds, with a dash and a small margin.
// Attacks that cover huge areas use this so there is always somewhere you can really reach in time.
const reachIn = (secs) => 130 + SPEED * Math.max(0, secs - DASH_T);

const PAT = {
  ringPulse(o, B) {
    every(2, B - 1, o.gap || 2, (i) => {
      const b = Bo();
      // Capped so a ring near the boss still has gaps your hitbox fits through.
      burst(b.x, b.y, Math.min(42, dn(o.n || 12)), sp(o.speed || 170), { off: i * (o.twist || 0.2), r: o.r || 9, curve: o.curve || 0 });
    });
  },
  spiral(o, B) {
    const arms = o.arms || 2, dir = o.dir || 1;
    every(2, B - 1, o.rate || 0.5, (i) => {
      const b = Bo();
      for (let k = 0; k < arms; k++) bullet(b.x, b.y, dir * i * (o.step || 0.4) + (k / arms) * TAU, sp(o.speed || 165), { r: o.r || 8, curve: o.curve || 0, life: 8 });
    });
  },
  aimFan(o, B) {
    every(1, B - 1, o.gap || 2, (i) => {
      const b = Bo(), s = o.curve && i % 2 ? -1 : 1;
      fan(b.x, b.y, aim(b.x, b.y) - s * (o.lead || 0), dn(o.n || 5), o.spread || 0.8, sp(o.speed || 220), { r: o.r || 9, curve: (o.curve || 0) * s, life: 7 });
    });
  },
  columns(o, B) {
    const n = o.n || 8, cw = W / n, st = o.step || 0.75;
    for (let i = 0; i < n; i++) at(i * st, () => vLine(cw * (i + 0.5), cw * (o.fill || 0.9)));
    if (o.back) for (let i = 0; i < n; i++) at(n * st + 1 + i * st, () => vLine(W - cw * (i + 0.5), cw * (o.fill || 0.9)));
  },
  rows(o, B) {
    const n = o.n || 6, rh = H / n, st = o.step || 0.9;
    for (let i = 0; i < n; i++) at(i * st, () => hLine(rh * (i + 0.5), rh * (o.fill || 0.9)));
    if (o.back) for (let i = 0; i < n; i++) at(n * st + 1 + i * st, () => hLine(H - rh * (i + 0.5), rh * (o.fill || 0.9)));
  },
  snipe(o, B) {
    every(0, B - 3, o.gap || 1.5, () => {
      const p = Pl();
      blast(p.x, p.y, o.r || 72, { tele: o.tele || 2 });
      for (let k = 0; k < (o.extra || 0); k++) blast(p.x + rnd(-200, 200), p.y + rnd(-140, 140), (o.r || 72) * 0.8, { tele: o.tele || 2 });
    });
  },
  mines(o, B) {
    every(1, B - 5, o.gap || 1, (i) => {
      const q = awayPoint(130), stay = B2S(o.fuse || 4);
      bullet(q.x, q.y, 0, 0, { r: o.r || 14, wait: 99, life: stay, splitAt: stay, split: { n: dn(o.n || 6), speed: sp(o.speed || 150), off: i * 0.5 } });
    });
  },
  rain(o, B) {
    const dir = o.dir || "down";
    every(0, B - 2, o.gap || 0.5, () => {
      for (let k = 0; k < dn(o.n || 3); k++) {
        const side = dir === "down" || dir === "up";
        const x = side ? rnd(0, W) : dir === "right" ? -20 : W + 20;
        const y = side ? (dir === "down" ? -20 : H + 20) : rnd(0, H);
        const a = { down: PI / 2, up: -PI / 2, right: 0, left: PI }[dir] + rnd(-(o.tilt || 0), o.tilt || 0);
        bullet(x, y, a, sp(o.speed || 210), { r: o.r || 9, life: 8 });
      }
    });
  },
  gapWall(o, B) {
    const dir = o.dir || "left", gapH = o.hole || 240, st = o.wave || 0.2, ph = rnd(TAU), span = dir === "left" || dir === "right" ? H : W;
    every(2, B - 2, o.gap || 1, (i) => {
      const mid = span / 2 + Math.sin(ph + i * st * (o.gap || 1) * 2) * (span / 2 - gapH / 2 - 20);
      for (let u = 12; u < span; u += 36) {
        if (Math.abs(u - mid) < gapH / 2) continue;
        if (dir === "left") bullet(W + 20, u, PI, sp(o.speed || 300), { r: 9, life: 7 });
        else if (dir === "right") bullet(-20, u, 0, sp(o.speed || 300), { r: 9, life: 7 });
        else if (dir === "down") bullet(u, -20, PI / 2, sp(o.speed || 260), { r: 9, life: 7 });
        else bullet(u, H + 20, -PI / 2, sp(o.speed || 260), { r: 9, life: 7 });
      }
    });
  },
  rotor(o, B) {
    const n = o.n || 3, s = (rnd() < 0.5 ? 1 : -1) * (o.spin || 0.14);
    at(2, () => {
      const b = Bo();
      for (let i = 0; i < n; i++) beam(b.x, b.y, (i / n) * TAU + 0.3, { tele: 3, live: B - 5, w: o.w || 22, spin: s * game.spMul });
    });
    if (o.n2) every(5, B - 2, 4, (i) => { const b = Bo(); burst(b.x, b.y, dn(o.n2), sp(150), { off: i * 0.4 }); });
  },
  crossfire(o, B) {
    every(0, B - 3, o.gap || 2, (i) => {
      for (let k = 0; k < (o.n || 1); k++) {
        const e = (i + k) % 4, x = e === 0 ? 0 : e === 1 ? W : rnd(0, W), y = e === 2 ? 0 : e === 3 ? H : rnd(0, H);
        beam(x, y, aim(x, y) + (k ? rnd(-0.25, 0.25) : 0), { tele: 2, live: 0.4, w: o.w || 24 });
      }
    });
  },
  ringGap(o, B) {
    every(1, B - 3, o.gap || 2, () => {
      const b = Bo(), gaps = [];
      for (let k = 0; k < (o.holes || 2); k++) gaps.push({ a: rnd(TAU), w: o.width || 0.75 });
      ring(b.x, b.y, { speed: sp(o.speed || 220), th: o.th || 16, gaps, spin: o.spin ? rnd(-o.spin, o.spin) : 0, life: 7 });
    });
  },
  implode(o, B) {
    every(1, B - 5, o.gap || 3, () => {
      const c = o.center ? { x: 640, y: 360 } : Bo(), gaps = [];
      for (let k = 0; k < (o.holes || 2); k++) gaps.push({ a: rnd(TAU), w: o.width || 0.9 });
      ring(c.x, c.y, { r: 820, speed: -sp(o.speed || 170), th: 15, gaps, life: 7 });
    });
  },
  checker(o, B) {
    const cols = o.cols || 8, rows = o.rows || 5, cw = W / cols, ch = H / rows;
    every(0, B - 3, o.gap || 2, (k) => {
      for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
        if ((x + y + k) % 2 === 0) wall(x * cw, y * ch, cw, ch, { tele: o.tele || 2, live: 0.5 });
      }
    });
  },
  traffic(o, B) {
    const lanes = o.lanes || 6, lh = H / lanes, st = o.gap || 4, tele = 2.5;
    for (let k = 0; k * st < B - 6; k++) {
      const offset = k % 2;
      at(k * st, () => {
        for (let lane = offset; lane < lanes; lane += 2) {
          const y = lane * lh + 8, left = (lane + k) % 4 < 2;
          warnBand(0, y, W, lh - 16, tele);
          at(k * st + tele, () => wall(left ? -(o.len || 340) : W, y, o.len || 340, lh - 16, { tele: 0, live: 4.5, vx: (left ? 1 : -1) * sp(o.speed || 1050) }));
        }
      });
    }
  },
  charge(o, B) {
    const st = o.gap || 4;
    for (let k = 0; k * st < B - 3; k++) lunge(k * st, o.tele || 2.5, 1);
    if (o.n) every(3.5, B - 1, st, () => { const b = Bo(); burst(b.x, b.y, dn(o.n), sp(150)); });
  },
  homing(o, B) {
    every(0, B - 3, o.gap || 3, () => {
      const b = Bo(), n = dn(o.n || 4);
      for (let i = 0; i < n; i++) bullet(b.x, b.y, (i / n) * TAU + rnd(0.5), sp(o.speed || 165), { home: o.turn || 1.7, homeT: o.time || 2.6, r: 8, life: 7 });
    });
  },
  bouncers(o, B) {
    every(0, B - 5, o.gap || 4, (i) => {
      const b = Bo();
      burst(b.x, b.y, dn(o.n || 7), sp(o.speed || 210), { off: i * 0.3, bounce: o.bounce || 2, life: 5.5, r: 9 });
    });
  },
  cage(o, B) {
    const r = o.r || 230, st = o.gap || 10;
    for (let k = 0; k * st < B - 6; k++) {
      at(k * st, () => {
        const p = Pl(), x = clamp(p.x, r, W - r), y = clamp(p.y, r, H - r);
        safeZone(x, y, r, { tele: 3, live: st - 4, vx: (k % 2 ? -1 : 1) * (o.drift || 36), vy: 0 });
      });
    }
    if (o.n) every(4, B - 2, 3, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n), 0.5, sp(180)); });
  },
  pendulum(o, B) {
    const ox = o.x === undefined ? 640 : o.x, oy = o.y === undefined ? 30 : o.y, base = o.a === undefined ? PI / 2 : o.a, sw = o.swing || 1.1, len = o.len || 560, start = game.moveBase;
    const angle = (ph) => base + Math.sin((game.beat - start) * (o.rate || PI / 2) + ph) * sw;
    for (let k = 0; k < (o.arms || 1); k++) {
      const ph = k * PI;
      at(1, () => beam(ox, oy, angle(ph), { tele: 2, live: B - 4, w: o.w || 26, len, fn(h) { h.a = angle(ph); } }));
    }
  },
  stepBurst(o, B) {
    every(0, B - 2, o.gap || 2, (i) => {
      const b = Bo();
      burst(b.x, b.y, Math.min(36, dn(o.n || 14)), sp(o.speed || 125), { off: i * 0.13, stepping: true, life: 12, r: 10 });
    });
  },
  splitShot(o, B) {
    every(0, B - 2, o.gap || 2, () => {
      const b = Bo();
      bullet(b.x, b.y, aim(b.x, b.y), sp(o.speed || 290), { r: o.r || 18, life: 3, splitAt: B2S(o.fuse || 2), split: { n: dn(o.n || 11), speed: sp(o.speed2 || 185), off: rnd(TAU) } });
    });
  },
  orbiters(o, B) {
    const start = game.beat, cx = o.x || 640, cy = o.y || 340, rings = o.rings || [[190, 4, 0.2], [360, 5, -0.13]];
    at(0, () => rings.forEach((rg, ri) => {
      const n = dn(rg[1]);
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU + ri, fn = (h) => {
          const u = game.beat - start, g = Math.min(1, u / 4), a = a0 + u * rg[2];
          h.x = cx + Math.cos(a) * rg[0] * g; h.y = cy + Math.sin(a) * rg[0] * g * 0.82;
        };
        fn(bullet(cx, cy, 0, 0, { r: o.r || 15, life: B2S(B - 2), wait: 99, fn }));
      }
    }));
    every(6, B - 2, o.gap || 4, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), 3, 0.3, sp(220)); });
  },
  well(o, B) {
    at(2, () => { const b = Bo(); game.gravity = { x: b.x, y: b.y, str: o.pull || 55 }; });
    every(2, B - 1, o.rate || 1, (i) => {
      const b = Bo();
      for (let k = 0; k < (o.arms || 3); k++) bullet(b.x, b.y, i * 0.37 + (k / (o.arms || 3)) * TAU, sp(o.speed || 160), { r: 8, curve: o.curve || -0.2, life: 8 });
    });
  },
  teleBurst(o, B) {
    every(0, B - 2, o.gap || 3, (i) => {
      const q = awayPoint(300, 100, H - 200), st = o.gap || 3;
      go(q.x, q.y, 0.5, "out");
      at((i + 1) * st - 1, () => burst(q.x, q.y, dn(o.n || 10), sp(o.speed || 165), { off: i * 0.3 }));
    });
  },
  trail(o, B) {
    const pts = o.path || [[160, 120], [1120, 120], [1120, 600], [160, 600], [640, 220]], st = (B - 4) / pts.length;
    pts.forEach((q, i) => at(i * st, () => go(q[0], q[1], st)));
    every(1, B - 3, o.gap || 0.5, () => {
      const b = Bo();
      bullet(b.x, b.y, 0, 0, { r: 13, wait: 99, life: B2S(o.fuse || 4), splitAt: B2S(o.fuse || 4), split: { n: o.n || 4, speed: sp(o.speed || 165), off: rnd(TAU) } });
    });
  },
  blocks(o, B) {
    const up = o.dir === "up", st = o.gap || 1, w = o.w || 120;
    for (let k = 0; k * st < B - 4; k++) {
      at(k * st, () => {
        const x = k % (o.aimEvery || 3) === 0 ? clamp(Pl().x - w / 2, 0, W - w) : rnd(0, W - w);
        warnBand(x, 0, w, H, 2);
        at(k * st + 2, () => wall(x, up ? H + 40 : -300, w, 260, { tele: 0, live: 4, vy: (up ? -1 : 1) * sp(o.speed || 1000) }));
      });
    }
  },
  vice(o, B) {
    const vert = o.axis === "y", size = vert ? H : W, hole = o.hole || (vert ? 220 : 280), t = (size - hole) / 2;
    const squeeze = (b0, side) => {
      const fin = side < 0 ? 0 : size - t, off = side < 0 ? -t : size;
      at(b0, () => {
        // Holds the warning until the player has had time to reach the gap from wherever they are.
        const p = Pl(), away = Math.abs((vert ? p.y - H / 2 : p.x - W / 2)) - hole / 2 + PLAYER_R + 10;
        const needed = (Math.max(0, away - 130) / SPEED + DASH_T) / B2S(1);
        const opt = { tele: Math.max(2, needed), live: 3, fn(h) {
          if (!h.on) return;
          const u = Math.min(1, (h.age - h.tele) / h.live), e = smooth(u < 0.5 ? u * 2 : (1 - u) * 2), v = lerp(off, fin, e);
          if (vert) h.y = v; else h.x = v;
        } };
        if (vert) wall(0, fin, W, t, opt); else wall(fin, 0, t, H, opt);
      });
    };
    for (let b0 = 0; b0 < B - 6; b0 += 6) { squeeze(b0, -1); squeeze(b0, 1); }
    if (o.n) every(2, B - 3, 3, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n), 0.3, sp(210)); });
  },
  flower(o, B) {
    every(1, B - 1, o.gap || 2, (i) => {
      const b = Bo(), n = dn(o.n || 28), k = o.petals || 5;
      for (let j = 0; j < n; j++) {
        const a = (j / n) * TAU;
        bullet(b.x, b.y, a, sp((o.speed || 165) * (1 + 0.45 * Math.sin(a * k + i))), { r: 8, life: 7 });
      }
    });
  },
  zipper(o, B) {
    const n = o.rowsN || 9;
    every(1, B - 1, o.rate || 0.5, (i) => {
      const row = i % n, y = ((row + 0.5) / n) * H, left = i % 2 === 0;
      bullet(left ? -20 : W + 20, y, left ? 0 : PI, sp(o.speed || 290), { r: o.r || 11, life: 7 });
    });
  },
  lightning(o, B) {
    every(0, B - 3, o.gap || 3, () => {
      let x = rnd(100, W - 100), y = 0;
      const seg = o.seg || 5, sy = H / seg;
      for (let s = 0; s < seg; s++) {
        const nx = clamp(x + rnd(-300, 300), 30, W - 30), ny = y + sy;
        beam(x, y, Math.atan2(ny - y, nx - x), { tele: 2, live: 0.5, w: o.w || 30, len: Math.hypot(nx - x, ny - y) + 6 });
        x = nx; y = ny;
      }
      if (o.aimed) vLine(Pl().x, 34);
    });
  },
  echo(o, B) {
    every(0, B - 3, o.rate || 0.5, () => { const p = Pl(); blast(p.x, p.y, o.r || 44, { tele: o.tele || 2.25, live: 0.5 }); });
    if (o.n) every(2, B - 3, 4, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n), 0.3, sp(230)); });
  },
  blackout(o, B) {
    at(0, () => { game.dark = B2S(B - 1); });
    every(2, B - 2, o.gap || 2, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n || 4), 0.55, sp(o.speed || 170), { r: 11 }); });
  },
  sweep(o, B) {
    every(1, B - 5, o.gap || 6, (i) => {
      const left = i % 2 === 0, x = left ? 0 : W, y = o.y === undefined ? 360 : o.y, a = left ? -1 : PI + 1, d = left ? 1 : -1;
      beam(x, y, a, { tele: 2.5, live: 3.2, w: o.w || 90, spin: d * 0.62 });
    });
  },
  starfall(o, B) {
    every(0, B - 3, o.gap || 1, (i) => {
      const q = awayPoint(0);
      blast(q.x, q.y, o.r || 90, { tele: 2, live: 0.3, onFire(h) { burst(h.x, h.y, dn(o.n || 7), sp(o.speed || 165), { off: i * 0.4 }); } });
    });
  },
  web(o, B) {
    every(0, B - 3, o.gap || 2, () => {
      const a = rnd(0, W), c = rnd(0, W);
      beam(a, 0, Math.atan2(H, c - a), { tele: 2, live: 3, w: o.w || 12, len: Math.hypot(H, c - a) });
      if (o.slow) slowZone(rnd(180, W - 180), rnd(150, H - 150), 110, 8);
    });
  },
  tide(o, B) {
    const n = o.n || 16, bw = W / n, hole = o.hole || 240, start = game.moveBase + 3, rate = o.rate || 0.36, amp = 340 - hole / 2 - 10;
    const mid = (i) => 360 + Math.sin(i * (o.wave || 0.5) + (game.beat - start) * rate) * amp;
    for (let i = 0; i < n; i++) {
      const top = wall(i * bw + 2, 0, bw - 4, 10, { tele: 3, live: B - 6, fn(h) { h.h = Math.max(0, mid(i) - hole / 2); } });
      const bot = wall(i * bw + 2, H, bw - 4, 10, { tele: 3, live: B - 6, fn(h) { h.y = mid(i) + hole / 2; h.h = H - h.y; } });
      top.fn(top); bot.fn(bot);
    }
  },
  formation(o, B) {
    const sides = o.sides || 4, per = o.per || 7;
    every(1, B - 2, o.gap || 3, (i) => {
      const b = Bo(), R = o.R || 90, rot = i * 0.4, wait = B2S(1.5);
      for (let s = 0; s < sides; s++) {
        const a1 = rot + (s / sides) * TAU, a2 = rot + ((s + 1) / sides) * TAU;
        for (let j = 0; j < per; j++) {
          const u = j / per, x = b.x + lerp(Math.cos(a1), Math.cos(a2), u) * R, y = b.y + lerp(Math.sin(a1), Math.sin(a2), u) * R;
          bullet(x, y, Math.atan2(y - b.y, x - b.x), sp(o.speed || 190), { r: 8, wait, life: 8 });
        }
      }
    });
  },
  rakes(o, B) {
    const n = o.n || 5;
    every(0, B - 3, o.gap || 2.5, (k) => {
      const a = (k % 2 ? 1 : -1) * (o.tilt || 0.6) + PI / 2, step = W / n;
      for (let i = -1; i <= n + 1; i++) {
        const x = i * step + (k % 2 ? step / 2 : 0);
        beam(x, 0, a, { tele: 2, live: 0.45, w: o.w || 30, len: 1200 });
      }
    });
  },
  comet(o, B) {
    every(0, B - 3, o.gap || 3, (i) => {
      const left = i % 2 === 0, x = left ? -20 : W + 20, y = rnd(60, H - 60);
      warnLine(x, y, aim(x, y), 2, 44);
      at(game.beat - game.moveBase + 2, () => {
        let last = 0;
        bullet(x, y, aim(x, y), sp(o.speed || 620), { r: 20, life: 4, fn(h) {
          if (h.age - last > 0.09) { last = h.age; bullet(h.x, h.y, rnd(TAU), sp(o.drift || 50), { r: 7, life: o.tail || 1.8 }); }
        } });
      });
    });
  },
  flatline(o, B) {
    every(0, B - 6, o.gap || 5, (i) => {
      const down = i % 2 === 0;
      beam(0, down ? 24 : H - 24, 0, { tele: 2.5, live: 4.5, w: 16, len: W, fn(h) { if (h.on && !h.vy) h.vy = (down ? 1 : -1) * ((H - 48) / B2S(4.5)); } });
    });
    if (o.n) every(1, B - 2, 2, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n), 0.5, sp(205)); });
  },
  sprinkler(o, B) {
    every(1, B - 1, o.rate || 0.25, (i) => {
      const b = Bo(), mid = o.a === undefined ? PI / 2 : o.a;
      bullet(b.x, b.y, mid + Math.sin(i * (o.sweep || 0.25)) * (o.wide || 1.3), sp(o.speed || 250), { r: 8, life: 6 });
    });
  },
  halfSlam(o, B) {
    every(0, B - 3, o.gap || 3, (i) => {
      const vert = o.axis === "y", tele = o.tele || 2.5, p = Pl(), mid = vert ? H / 2 : W / 2, at0 = vert ? p.y : p.x;
      let high = i % 2 === 1;
      // If the slam would land on you and the safe half is out of reach, it takes the other half instead.
      if (high === at0 >= mid && Math.abs(at0 - mid) + PLAYER_R + 6 > reachIn(B2S(tele))) high = !high;
      if (vert) wall(0, high ? H / 2 : 0, W, H / 2, { tele, live: 0.5 });
      else wall(high ? W / 2 : 0, 0, W / 2, H, { tele, live: 0.5 });
    });
  },
  quadrant(o, B) {
    every(0, B - 3, o.gap || 3.5, () => {
      // The safe corner is always one the player can actually get to in time.
      const p = Pl(), tele = o.tele || 3, reach = reachIn(B2S(tele)), options = [];
      for (let q = 0; q < 4; q++) {
        const qx = (q % 2) * (W / 2), qy = (q >> 1) * (H / 2);
        const gx = Math.max(qx + PLAYER_R + 6 - p.x, p.x - (qx + W / 2 - PLAYER_R - 6), 0), gy = Math.max(qy + PLAYER_R + 6 - p.y, p.y - (qy + H / 2 - PLAYER_R - 6), 0);
        if (Math.hypot(gx, gy) <= reach) options.push(q);
      }
      const safe = options.length ? options[Math.floor(rnd(options.length))] : (p.x >= W / 2 ? 1 : 0) + (p.y >= H / 2 ? 2 : 0);
      for (let q = 0; q < 4; q++) if (q !== safe) wall((q % 2) * (W / 2), (q >> 1) * (H / 2), W / 2, H / 2, { tele: o.tele || 3, live: 0.5 });
    });
  },
  corners(o, B) {
    every(0, B - 3, o.gap || 2.5, () => {
      [[0, 0], [W, 0], [0, H], [W, H]].forEach((c) => beam(c[0], c[1], aim(c[0], c[1]), { tele: 2, live: 0.4, w: o.w || 20 }));
    });
  },
  footsteps(o, B) {
    every(0, B - 4, o.gap || 3, (k) => {
      const b = Bo(), p = Pl(), n = o.n || 6, base = game.beat - game.moveBase;
      for (let i = 1; i <= n; i++) {
        const u = i / n, x = lerp(b.x, p.x, u), y = lerp(b.y, p.y, u);
        at(base + (i - 1) * 0.25, () => blast(x, y, o.r || 66, { tele: 2, live: 0.35 }));
      }
    });
  },
  recall(o, B) {
    every(0, B - 4, o.gap || 4, (i) => {
      const b = Bo(), n = dn(o.n || 12), wait = B2S(o.hold || 2.5);
      for (let j = 0; j < n; j++) {
        let fired = false;
        bullet(b.x, b.y, (j / n) * TAU + i, sp(o.speed || 230), { r: 9, drag: 2.4, life: 8, fn(h) {
          if (!fired && h.age > wait) {
            fired = true; h.drag = 0;
            const a = aim(h.x, h.y), s = sp(o.speed2 || 250);
            h.vx = Math.cos(a) * s; h.vy = Math.sin(a) * s;
          }
        } });
      }
    });
  },
  boomerang(o, B) {
    every(0, B - 4, o.gap || 3, (i) => {
      const b = Bo(), n = dn(o.n || 10);
      for (let j = 0; j < n; j++) {
        const a = (j / n) * TAU + i * 0.3, pull = sp(o.pull || 230);
        bullet(b.x, b.y, a, sp(o.speed || 340), { r: 9, ax: -Math.cos(a) * pull, ay: -Math.sin(a) * pull, life: 5 });
      }
    });
  },
  swirl(o, B) {
    every(1, B - 2, o.gap || 2, (i) => {
      const b = Bo();
      burst(b.x, b.y, dn(o.n || 10), sp(o.speed || 200), { off: i * 0.5, curve: (i % 2 ? -1 : 1) * (o.curve || 0.9), life: 7, r: 9 });
    });
  },
};
const PAT_BEATS = { rotor: 16, orbiters: 16, tide: 20, cage: 18, traffic: 22, flatline: 20, blackout: 16, pendulum: 16, well: 14, trail: 14, sweep: 18 };

// Default placement keeps the boss reachable; a move can pin it with pos: [x, y].
function mv(name, pat, o = {}) {
  const beats = o.beats || PAT_BEATS[pat] || 12;
  return {
    name, pat, beats,
    run() {
      if (o.pos) go(o.pos[0], o.pos[1], 2);
      else go(rnd(260, 1020), rnd(130, 290), 2);
      PAT[pat](o, beats);
    },
  };
}
