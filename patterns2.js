"use strict";
// A second set of attack patterns, each built around an idea the first set doesn't use.
Object.assign(PAT, {
  // Bullets that wind like a snake instead of flying straight.
  serpentine(o, B) {
    const amp = o.amp || 90, w = o.wiggle || 4;
    every(1, B - 2, o.rate || 0.25, (i) => {
      const lanes = o.lanes || 3;
      for (let k = 0; k < lanes; k++) {
        const y = ((k + 0.5) / lanes) * H, left = k % 2 === 0;
        bullet(left ? -20 : W + 20, y, left ? 0 : PI, sp(o.speed || 260), { r: 9, life: 7, fn(h) { h.vy = Math.cos(h.age * w) * amp * w; } });
      }
    });
  },
  // A circle of safety that closes in and opens back up.
  iris(o, B) {
    const big = o.big || 560, small = o.small || 190, live = B - 5;
    at(0, () => {
      safeZone(640, 360, big, { tele: 3, live, fn(h) {
        if (!h.on) return;
        const u = Math.min(1, (h.age - h.tele) / h.live);
        h.r = lerp(big, small, smooth(u < 0.5 ? u * 2 : (1 - u) * 2));
      } });
    });
    if (o.n) every(4, B - 2, 3, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n), 0.5, sp(170)); });
  },
  // Stay in the moving light. It wanders slower than you can run.
  searchlight(o, B) {
    const r = o.r || 210, rate = o.rate || 0.55, tele = 3.5;
    let ph = rnd(TAU);
    const posAt = (when, q) => ({ x: 640 + Math.sin(when * rate + q) * 360, y: 370 + Math.sin(when * rate * 1.6 + q) * 130 });
    const pos = () => posAt(game.t, ph);
    at(0, () => {
      // Starts somewhere the player can reach by the time the darkness lands.
      const when = game.t + B2S(tele), p = Pl(), reach = reachIn(B2S(tele)) + r - 30;
      for (let tries = 0, gap = Infinity, keep = ph; tries < 24; tries++) {
        const q = keep + (tries / 24) * TAU, c = posAt(when, q), dist = Math.hypot(c.x - p.x, c.y - p.y);
        if (dist < gap) { gap = dist; ph = q; }
        if (dist <= reach) { ph = q; break; }
      }
      const s = pos();
      safeZone(s.x, s.y, r, { tele, live: B - 6, fn(h) { const q = pos(); h.x = q.x; h.y = q.y; } });
    });
    if (o.n) every(5, B - 2, 3, () => { const b = Bo(); burst(b.x, b.y, dn(o.n), sp(130), { off: rnd(TAU) }); });
  },
  // Two long arms sweeping from the bottom corners, out of step with each other.
  wipers(o, B) {
    const start = game.moveBase, rate = o.rate || 0.5, len = o.len || 980;
    const arm1 = () => -PI / 4 + Math.sin((game.beat - start) * rate) * (PI / 4);
    const arm2 = () => -3 * PI / 4 - Math.sin((game.beat - start) * rate + PI) * (PI / 4);
    at(1, () => {
      beam(0, H, arm1(), { tele: 2.5, live: B - 5, w: o.w || 26, len, fn(h) { h.a = arm1(); } });
      beam(W, H, arm2(), { tele: 2.5, live: B - 5, w: o.w || 26, len, fn(h) { h.a = arm2(); } });
    });
  },
  // Walls with one hole in them, marching across the arena.
  gates(o, B) {
    const hole = o.hole || 210, st = o.gap || 3, v = o.speed || 300;
    let last = (H - hole) / 2;
    every(0, B - 4, st, (i) => {
      // Each hole stays within running distance of the last one.
      const stride = SPEED * B2S(st) * (o.both ? 0.45 : 0.75);
      const y = clamp(last + rnd(-stride, stride), 50, H - hole - 50), fromRight = o.both ? i % 2 === 0 : true, x = fromRight ? W : -44, vx = (fromRight ? -1 : 1) * sp(v), life = (W + 80) / sp(v) / (60 / game.bpm);
      last = y;
      wall(x, 0, 44, y, { tele: 1.5, live: life, vx });
      wall(x, y + hole, 44, H - y - hole, { tele: 1.5, live: life, vx });
    });
  },
  // Two bullet walls closing from both sides, their holes in different places.
  pincer(o, B) {
    const hole = o.hole || 230, lo = hole / 2 + 20, hi = H - hole / 2 - 20;
    let mid = 360;
    every(2, B - 3, o.gap || 2, () => {
      // The two walls share a drifting safe lane, moving no faster than you can run.
      const stride = Math.min(150, SPEED * B2S(o.gap || 2) * 0.7);
      mid = clamp(mid + rnd(-stride, stride), lo, hi);
      const a = clamp(mid + rnd(-25, 25), lo, hi), b2 = clamp(mid + rnd(-25, 25), lo, hi);
      for (let y = 12; y < H; y += 36) {
        if (Math.abs(y - a) > hole / 2) bullet(-20, y, 0, sp(o.speed || 270), { r: 9, life: 6 });
        if (Math.abs(y - b2) > hole / 2) bullet(W + 20, y, PI, sp(o.speed || 270), { r: 9, life: 6 });
      }
    });
  },
  // Blocks that land and stay, building a floor that pushes you up.
  stack(o, B) {
    const cols = 8, cw = W / cols, height = new Array(cols).fill(0), top = o.limit || 380, st = o.gap || 0.75;
    for (let k = 0; k * st < B - 4; k++) {
      at(k * st, () => {
        const col = Math.floor(rnd(cols));
        if (height[col] >= top) return;
        height[col] += o.step || 120;
        const hNow = height[col];
        wall(col * cw, H - hNow, cw, hNow, { tele: 2, live: B - k * st - 2.5 });
      });
    }
    if (o.n) every(2, B - 2, 3, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.n), 0.5, sp(190)); });
  },
  // A whole grid of thin beams. Stay inside a cell, then slide when the grid shifts.
  lattice(o, B) {
    const size = o.size || 220, w = o.w || 18;
    every(0, B - 3, o.gap || 3, (k) => {
      const off = k % 2 ? size / 2 : 0;
      for (let x = off; x <= W; x += size) vLine(x, w, 2, 0.5);
      for (let y = off; y <= H; y += size) hLine(y, w, 2, 0.5);
    });
  },
  // Blasts at your reflection, so the safest-looking spot keeps moving.
  mirrorfire(o, B) {
    every(0, B - 3, o.gap || 1.5, () => {
      const p = Pl(), r = o.r || 84;
      blast(W - p.x, p.y, r, { tele: 2 });
      blast(p.x, H - p.y, r, { tele: 2 });
      blast(W - p.x, H - p.y, r, { tele: 2 });
      if (o.direct) blast(p.x, p.y, r * 0.7, { tele: 2.25 });
    });
  },
  // Four fixed guns in the arena that take turns firing.
  turrets(o, B) {
    const spots = [[150, 130], [W - 150, 130], [W - 150, H - 130], [150, H - 130]];
    at(0, () => spots.forEach((q) => bullet(q[0], q[1], 0, 0, { r: 20, wait: 99, life: B2S(B - 1) })));
    every(2, B - 2, o.gap || 1, (i) => {
      const q = spots[i % 4];
      fan(q[0], q[1], aim(q[0], q[1]), dn(o.n || 3), o.spread || 0.3, sp(o.speed || 240), { r: 8 });
    });
  },
  // Heavy rain with one dry column, which moves.
  cover(o, B) {
    const wide = o.wide || 280;
    let spot = rnd(wide, W - wide);
    every(0, B - 2, o.rate || 0.5, (i) => {
      if (i % (o.shift || 6) === 0 && i) spot = clamp(spot + (rnd() < 0.5 ? -1 : 1) * rnd(180, 330), wide / 2, W - wide / 2);
      for (let x = 30; x < W; x += 62) {
        if (Math.abs(x - spot) > wide / 2) bullet(x + rnd(-8, 8), -20, PI / 2, sp(o.speed || 300), { r: 8, life: 5 });
      }
    });
  },
  // Rings spreading out from random points, like drops in water.
  ripples(o, B) {
    every(0, B - 3, o.gap || 1.5, () => {
      const q = awayPoint(160);
      ring(q.x, q.y, { speed: sp(o.speed || 170), th: 12, gaps: [{ a: rnd(TAU), w: 1 }, { a: rnd(TAU), w: 1 }], life: 6 });
    });
  },
  // A line of blasts toppling across the arena, one after another.
  domino(o, B) {
    every(0, B - 4, o.gap || 3, (k) => {
      const horizontal = k % 2 === 0, base = game.beat - game.moveBase, n = 9, spot = horizontal ? rnd(90, H - 90) : rnd(120, W - 120);
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n, x = horizontal ? u * W : spot, y = horizontal ? spot : u * H;
        at(base + i * (o.step || 0.25), () => blast(x, y, o.r || 84, { tele: 2, live: 0.3 }));
      }
    });
  },
  // Slow, big bombs that chase you, then go off.
  seeker(o, B) {
    every(0, B - 4, o.gap || 4, () => {
      const b = Bo(), n = dn(o.n || 2), fuse = o.fuse || 2.6;
      for (let i = 0; i < n; i++) {
        bullet(b.x, b.y, (i / n) * TAU + rnd(1), sp(o.speed || 190), { r: 16, home: o.turn || 2.2, homeT: fuse, life: fuse + 1, splitAt: fuse, split: { n: dn(o.shards || 9), speed: sp(170), off: rnd(TAU) } });
      }
    });
  },
  // A ring that appears around wherever you are and tightens.
  noose(o, B) {
    every(0, B - 4, o.gap || 3, () => {
      const p = Pl();
      ring(p.x, p.y, { r: o.r || 320, speed: -sp(o.speed || 135), th: 14, gaps: [{ a: rnd(TAU), w: o.width || 1 }, { a: rnd(TAU), w: 0.7 }], life: 5 });
    });
  },
  // Beams through your position, swapping between a plus and an X.
  crosshair(o, B) {
    every(0, B - 3, o.gap || 2.5, (k) => {
      const p = Pl(), base = k % 2 ? PI / 4 : 0;
      for (let i = 0; i < 4; i++) beam(p.x, p.y, base + (i * PI) / 2, { tele: o.tele || 2, live: 0.4, w: o.w || 26 });
    });
  },
  // One beam that reflects off the arena walls.
  bounceBeam(o, B) {
    every(1, B - 3, o.gap || 2.5, () => {
      const b = Bo();
      let x = b.x, y = b.y, a = aim(x, y);
      for (let k = 0; k < (o.bounces || 4); k++) {
        const c = Math.cos(a), s = Math.sin(a);
        const tx = c > 0 ? (W - x) / c : c < 0 ? -x / c : Infinity, ty = s > 0 ? (H - y) / s : s < 0 ? -y / s : Infinity, t = Math.min(tx, ty);
        beam(x, y, a, { tele: 2, live: 0.5, w: o.w || 20, len: t });
        x += c * t; y += s * t;
        a = tx < ty ? PI - a : -a;
      }
    });
  },
  // Two spirals turning opposite ways, weaving through each other.
  weave(o, B) {
    every(2, B - 1, o.rate || 0.5, (i) => {
      const b = Bo(), st = o.step || 0.35;
      bullet(b.x, b.y, i * st, sp(o.speed || 165), { r: 8, life: 8 });
      bullet(b.x, b.y, -i * st, sp(o.speed || 165), { r: 8, life: 8 });
      if (o.arms) { bullet(b.x, b.y, i * st + PI, sp(o.speed || 165), { r: 8, life: 8 }); bullet(b.x, b.y, -i * st + PI, sp(o.speed || 165), { r: 8, life: 8 }); }
    });
  },
  // Shells that climb, burst into stars, and rain down under gravity.
  fireworks(o, B) {
    every(0, B - 3, o.gap || 1.5, () => {
      const x = rnd(110, W - 110), fuse = o.fuse || 1;
      bullet(x, H + 15, -PI / 2, sp(o.speed || 520), { r: 13, life: 5, fn(h) {
        if (h.age < fuse) return;
        const n = dn(o.n || 12);
        for (let i = 0; i < n; i++) bullet(h.x, h.y, (i / n) * TAU, sp(150), { r: 7, ay: o.fall || 120, life: 5 });
        h.life = 0;
      } });
    });
  },
  // A stream thrown upward that arcs and falls back down.
  fountain(o, B) {
    every(1, B - 1, o.rate || 0.25, (i) => {
      const b = Bo(), a = -PI / 2 + Math.sin(i * 0.45) * (o.wide || 0.9);
      bullet(b.x, b.y, a, sp(o.speed || 430), { r: 8, ay: o.fall || 380, life: 6 });
    });
  },
  // A few huge blades that keep bouncing around the arena.
  sawblade(o, B) {
    at(2, () => {
      const b = Bo(), n = o.n || 3;
      for (let i = 0; i < n; i++) bullet(b.x, b.y, (i / n) * TAU + rnd(1), sp(o.speed || 270), { r: o.r || 30, bounce: 99, life: B2S(B - 3) });
    });
    if (o.shots) every(4, B - 2, 3, () => { const b = Bo(); fan(b.x, b.y, aim(b.x, b.y), dn(o.shots), 0.4, sp(210)); });
  },
  // Wind that shoves you sideways while rain blows across.
  gale(o, B) {
    every(0, B, o.gap || 5, (k) => {
      const right = k % 2 === 0;
      game.gravity = { x: right ? 5000 : -5000, y: 360, str: o.pull || 95 };
      game.floats.push({ x: 640, y: 120, text: right ? "WIND >>>" : "<<< WIND", size: 0.6, age: 0, life: 0.8 });
    });
    every(1, B - 1, o.rate || 0.5, (i) => {
      const dir = Math.floor(i * (o.rate || 0.5) / (o.gap || 5)) % 2 === 0;
      for (let k = 0; k < dn(o.n || 2); k++) bullet(dir ? -20 : W + 20, rnd(0, H), dir ? rnd(-0.15, 0.15) : PI + rnd(-0.15, 0.15), sp(o.speed || 300), { r: 8, life: 6 });
    });
  },
  // Teeth sliding up and down, like a comb passing through the arena.
  comb(o, B) {
    const n = o.n || 8, cw = W / n;
    every(0, B - 4, o.gap || 3, (k) => {
      for (let i = 0; i < n; i++) {
        const down = (i + k) % 2 === 0, tooth = cw * 0.58, v = sp(o.speed || 620);
        const y = down ? -360 : H + 20;
        warnBand(i * cw + (cw - tooth) / 2, 0, tooth, H, 2);
        at(k * (o.gap || 3) + 2, () => wall(i * cw + (cw - tooth) / 2, y, tooth, 340, { tele: 0, live: 3.5, vy: down ? v : -v }));
      }
    });
  },
  // Stiff arms of bullets spinning around a fixed centre.
  pinwheel(o, B) {
    const start = game.beat, arms = o.arms || 4, per = o.per || 7, gap = o.space || 62, spin = o.spin || 0.2;
    at(1, () => {
      const c = Bo();
      const cx = c.x, cy = c.y;
      for (let a = 0; a < arms; a++) for (let j = 1; j <= per; j++) {
        const fn = (h) => {
          const u = game.beat - start, grow = Math.min(1, u / 3), ang = (a / arms) * TAU + u * spin;
          h.x = cx + Math.cos(ang) * j * gap * grow;
          h.y = cy + Math.sin(ang) * j * gap * grow;
        };
        fn(bullet(cx, cy, 0, 0, { r: 10, wait: 99, life: B2S(B - 2), fn }));
      }
    });
  },
});
Object.assign(PAT_BEATS, { iris: 18, searchlight: 18, wipers: 16, stack: 16, sawblade: 14, gale: 15, pinwheel: 16 });
