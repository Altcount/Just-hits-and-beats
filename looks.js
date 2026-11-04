"use strict";
// Body designs for the bosses that don't have a hand-drawn one in bosses.js.
const arm = (c, x1, y1, x2, y2) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
const LOOKS = {
  poly(c, b, t, pu, o) {
    ink(c, b, 4);
    pg(c, o.n, b.r, t * (o.spin || 0.4)); c.fill(); c.stroke();
    pg(c, o.n2 || o.n, b.r * 0.62, -t * (o.spin || 0.4)); c.stroke();
    pg(c, o.n3 || 3, b.r * (0.26 + pu * 0.1), t); solid(c, b); c.fill();
  },
  star(c, b, t, pu, o) {
    ink(c, b, 3);
    c.beginPath();
    for (let i = 0; i < o.n * 2; i++) {
      const a = t * (o.spin || 0.6) + (i / (o.n * 2)) * TAU, q = b.r * (i % 2 ? o.inner || 0.45 : 1.15 + pu * 0.15);
      c.lineTo(Math.cos(a) * q, Math.sin(a) * q);
    }
    c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, 0, b.r * 0.2, 0, TAU); solid(c, b); c.fill();
  },
  orbit(c, b, t, pu, o) {
    ink(c, b, 3);
    c.beginPath(); c.arc(0, 0, b.r * 0.55, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, 0, b.r * 1.1, 0, TAU); c.globalAlpha = 0.45; c.stroke(); c.globalAlpha = 1;
    solid(c, b);
    for (let i = 0; i < o.n; i++) {
      const a = t * 1.3 + (i / o.n) * TAU;
      c.beginPath(); c.arc(Math.cos(a) * b.r * 1.1, Math.sin(a) * b.r * 1.1, 8 + pu * 3, 0, TAU); c.fill();
    }
    c.beginPath(); c.arc(0, 0, b.r * 0.22, 0, TAU); c.fill();
  },
  eye(c, b, t, pu, o) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 1.35, 0); c.quadraticCurveTo(0, -s * (1.3 + pu * 0.2), s * 1.35, 0); c.quadraticCurveTo(0, s * (1.3 + pu * 0.2), -s * 1.35, 0);
    c.closePath(); c.fill(); c.stroke();
    const lx = game && game.player ? clamp((game.player.x - b.x) * 0.03, -s * 0.3, s * 0.3) : 0, ly = game && game.player ? clamp((game.player.y - b.y) * 0.03, -s * 0.2, s * 0.2) : 0;
    c.beginPath(); c.arc(lx, ly, s * 0.42, 0, TAU); c.stroke();
    if (o.slit) { solid(c, b); c.fillRect(lx - 4, ly - s * 0.36, 8, s * 0.72); }
    else { c.beginPath(); c.arc(lx, ly, s * 0.2, 0, TAU); solid(c, b); c.fill(); }
  },
  gear(c, b, t, pu, o) {
    ink(c, b, 3);
    c.save(); c.rotate(t * (o.spin || 0.8));
    c.beginPath();
    for (let i = 0; i < o.n; i++) {
      const a = (i / o.n) * TAU, w = (TAU / o.n) * 0.25;
      [[-w * 1.2, 0.8], [-w * 0.7, 1.1], [w * 0.7, 1.1], [w * 1.2, 0.8]].forEach((q) => c.lineTo(Math.cos(a + q[0]) * b.r * q[1], Math.sin(a + q[0]) * b.r * q[1]));
    }
    c.closePath(); c.fill(); c.stroke();
    c.restore();
    c.beginPath(); c.arc(0, 0, b.r * (0.32 + pu * 0.08), 0, TAU); solid(c, b); c.fill();
  },
  wings(c, b, t, pu, o) {
    const s = b.r, flap = Math.sin(t * (o.flap || 4)) * 0.25;
    ink(c, b, 3);
    for (let d = -1; d <= 1; d += 2) {
      for (let i = 0; i < 3; i++) {
        c.beginPath(); c.moveTo(d * s * 0.2, 0);
        c.quadraticCurveTo(d * s * (1 + i * 0.3), -s * (1 - i * 0.5 + flap), d * s * (1.6 - i * 0.12), s * (i * 0.45 - 0.3 + flap));
        c.closePath(); c.fill(); c.stroke();
      }
    }
    pg(c, 4, s * 0.42, PI / 4); solid(c, b); c.fill();
  },
  jelly(c, b, t, pu, o) {
    const s = b.r;
    c.strokeStyle = CY; c.lineWidth = 3;
    for (let i = 0; i < o.n; i++) {
      const x = lerp(-s * 0.8, s * 0.8, i / (o.n - 1));
      c.beginPath(); c.moveTo(x, 0);
      for (let k = 1; k <= 5; k++) c.lineTo(x + Math.sin(t * 3 + i + k) * 7, (k / 5) * s * (1.4 + pu * 0.3));
      c.stroke();
    }
    ink(c, b, 4);
    c.beginPath(); c.arc(0, 0, s, PI, 0); c.closePath(); c.fill(); c.stroke();
    solid(c, b); c.beginPath(); c.arc(0, -s * 0.35, s * (0.2 + pu * 0.08), 0, TAU); c.fill();
  },
  crystal(c, b, t, pu, o) {
    const s = b.r;
    ink(c, b, 3);
    for (let i = 0; i < o.n; i++) {
      const a = (i / o.n) * TAU + Math.sin(t * 0.6) * 0.15;
      c.save(); c.rotate(a);
      c.beginPath(); c.moveTo(-s * 0.16, -s * 0.2); c.lineTo(0, -s * (1.12 + (i % 2) * 0.25 + pu * 0.1)); c.lineTo(s * 0.16, -s * 0.2);
      c.closePath(); c.fill(); c.stroke();
      c.restore();
    }
    pg(c, 6, s * 0.3, t); solid(c, b); c.fill();
  },
  planet(c, b, t, pu, o) {
    const s = b.r * 0.72;
    ink(c, b, 4);
    c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill(); c.stroke();
    c.globalAlpha = 0.6; c.lineWidth = 2;
    for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(0, i * s * 0.45, s * Math.sqrt(1 - i * i * 0.2), s * 0.1, 0, 0, TAU); c.stroke(); }
    c.globalAlpha = 1; c.lineWidth = 4;
    for (let i = 0; i < (o.n || 1); i++) { c.beginPath(); c.ellipse(0, 0, b.r * (1.45 + i * 0.25 + pu * 0.1), b.r * 0.32, -0.4 + i * 0.5, 0, TAU); c.stroke(); }
  },
  glyph(c, b, t, pu, o) {
    const s = b.r, n = o.n;
    solid(c, b);
    for (let i = 0; i < n; i++) {
      const w = s * (0.5 + 0.9 * Math.abs(Math.sin(i * 2.3 + (o.seed || 1)))), y = -s + (i / (n - 1)) * s * 2, off = Math.sin(t * 2 + i) * 6 * pu;
      c.fillRect(-w + off, y - 5, w * 2, 10);
    }
    c.fillRect(-5, -s * 1.1, 10, s * 2.2);
  },
  maw(c, b, t, pu, o) {
    const s = b.r, open = 0.25 + Math.abs(Math.sin(t * 2.2)) * 0.5 + pu * 0.2;
    c.rotate(b.heading || 0);
    ink(c, b, 4);
    c.beginPath(); c.arc(0, 0, s, open, TAU - open); c.lineTo(0, 0); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    for (let i = 0; i < (o.n || 4); i++) {
      const a = open + 0.12 + i * 0.28;
      [a, TAU - a].forEach((q) => { c.save(); c.rotate(q); c.beginPath(); c.moveTo(s, -7); c.lineTo(s * 0.68, 0); c.lineTo(s, 7); c.closePath(); c.fill(); c.restore(); });
    }
  },
  bars(c, b, t, pu, o) {
    const s = b.r, n = o.n, w = (s * 2) / n;
    ink(c, b, 3);
    c.strokeRect(-s, -s, s * 2, s * 2);
    solid(c, b);
    for (let i = 0; i < n; i++) {
      const h = s * 1.9 * (0.25 + 0.7 * Math.abs(Math.sin(t * (2 + i * 0.3) + i * 1.7))) * (0.7 + pu * 0.3);
      c.fillRect(-s + i * w + 2, s - h, w - 4, h);
    }
  },
  helix(c, b, t, pu, o) {
    const s = b.r;
    c.lineWidth = 3; c.strokeStyle = CY;
    for (let i = -7; i <= 7; i++) {
      const y = (i / 7) * s * 1.25, ph = t * 2.4 + i * 0.6, x = Math.sin(ph) * s * 0.7;
      arm(c, x, y, -x, y);
      solid(c, b);
      c.beginPath(); c.arc(x, y, 5 + pu * 2, 0, TAU); c.arc(-x, y, 5, 0, TAU); c.fill();
    }
  },
  cube(c, b, t, pu, o) {
    const s = b.r * 0.72, ca = Math.cos(t), sa = Math.sin(t), P = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      const X = x * ca - z * sa, Z = x * sa + z * ca, Y = y * Math.cos(0.6) - Z * Math.sin(0.6);
      P.push([X * s * (1 + pu * 0.1), Y * s * (1 + pu * 0.1)]);
    }
    c.lineWidth = 3; c.strokeStyle = b.flash > 0 ? ICE : CY;
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      const d = i ^ j;
      if (d === 1 || d === 2 || d === 4) arm(c, P[i][0], P[i][1], P[j][0], P[j][1]);
    }
    solid(c, b); pg(c, 4, b.r * 0.2, t); c.fill();
  },
  flame(c, b, t, pu, o) {
    const s = b.r;
    for (let i = 0; i < 3; i++) {
      const q = 1 - i * 0.3;
      c.beginPath(); c.moveTo(0, s * q);
      c.bezierCurveTo(-s * 1.1 * q, s * 0.5 * q, -s * 0.5 * q + Math.sin(t * 6) * 6, -s * 0.2 * q, Math.sin(t * 5 + i) * 10, -s * (1.35 + pu * 0.3) * q);
      c.bezierCurveTo(s * 0.5 * q + Math.sin(t * 7) * 6, -s * 0.2 * q, s * 1.1 * q, s * 0.5 * q, 0, s * q);
      if (i === 2) { solid(c, b); c.fill(); } else { ink(c, b, 3); if (!i) c.fill(); c.stroke(); }
    }
  },
  hourglass(c, b, t, pu, o) {
    const s = b.r, flip = Math.floor(t / 4) % 2 ? -1 : 1, fill = (t % 4) / 4;
    c.scale(1, flip);
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.8, -s * 1.15); c.lineTo(s * 0.8, -s * 1.15); c.lineTo(-s * 0.8, s * 1.15); c.lineTo(s * 0.8, s * 1.15); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    const a = s * 0.6 * (1 - fill), d = s * 0.6 * fill;
    c.beginPath(); c.moveTo(-a, -a * 1.2); c.lineTo(a, -a * 1.2); c.lineTo(0, 0); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-d, s * 1.05); c.lineTo(d, s * 1.05); c.lineTo(0, s * 1.05 - d * 1.2); c.closePath(); c.fill();
  },
  mask(c, b, t, pu, o) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(0, -s * 1.2); c.lineTo(s, -s * 0.5); c.lineTo(s * 0.72, s * 0.7); c.lineTo(0, s * 1.25); c.lineTo(-s * 0.72, s * 0.7); c.lineTo(-s, -s * 0.5); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) {
      c.beginPath(); c.moveTo(d * s * 0.16, -s * 0.2); c.lineTo(d * s * 0.7, -s * (0.42 + pu * 0.15)); c.lineTo(d * s * 0.62, -s * 0.02); c.closePath(); c.fill();
    }
    c.fillRect(-s * 0.3, s * 0.45, s * 0.6, 5 + (o.grin ? pu * 10 : 0));
  },
  lantern(c, b, t, pu, o) {
    const s = b.r;
    c.rotate(Math.sin(t * 1.4) * 0.14);
    ink(c, b, 3);
    arm(c, 0, -s * 1.4, 0, -s);
    c.beginPath(); c.moveTo(-s * 0.4, -s); c.lineTo(s * 0.4, -s); c.lineTo(s * 0.75, -s * 0.25); c.lineTo(s * 0.75, s * 0.6); c.lineTo(s * 0.4, s); c.lineTo(-s * 0.4, s); c.lineTo(-s * 0.75, s * 0.6); c.lineTo(-s * 0.75, -s * 0.25); c.closePath(); c.fill(); c.stroke();
    solid(c, b); c.beginPath(); c.arc(0, s * 0.1, s * (0.3 + pu * 0.18), 0, TAU); c.fill();
  },
  blade(c, b, t, pu, o) {
    ink(c, b, 3);
    for (let i = 0; i < o.n; i++) {
      c.save(); c.rotate(t * (o.spin || 2.2) + (i / o.n) * TAU);
      c.beginPath(); c.moveTo(0, -b.r * 0.2); c.quadraticCurveTo(b.r * 0.9, -b.r * 0.5, b.r * 1.3, 0); c.quadraticCurveTo(b.r * 0.7, b.r * 0.1, 0, b.r * 0.2);
      c.closePath(); c.fill(); c.stroke();
      c.restore();
    }
    c.beginPath(); c.arc(0, 0, b.r * (0.2 + pu * 0.08), 0, TAU); solid(c, b); c.fill();
  },
  shell(c, b, t, pu, o) {
    c.lineWidth = 4; c.strokeStyle = CY;
    c.rotate(t * 0.3);
    c.beginPath();
    for (let i = 0; i < 90; i++) {
      const a = i * 0.21, q = (i / 90) * b.r * (1.15 + pu * 0.1);
      c.lineTo(Math.cos(a) * q, Math.sin(a) * q);
    }
    c.stroke();
    solid(c, b); c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fill();
  },
  crown(c, b, t, pu, o) {
    const s = b.r, n = o.n;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s, s * 0.7);
    for (let i = 0; i <= n * 2; i++) c.lineTo(lerp(-s, s, i / (n * 2)), i % 2 ? -s * 0.1 : -s * (0.85 + pu * 0.2));
    c.lineTo(s, s * 0.7); c.closePath(); c.fill(); c.stroke();
    solid(c, b); c.fillRect(-s * 0.8, s * 0.25, s * 1.6, s * 0.18);
    for (let i = 0; i <= n; i++) { c.beginPath(); c.arc(lerp(-s, s, i / n), -s * (0.98 + pu * 0.2), 6, 0, TAU); c.fill(); }
  },
  clock(c, b, t, pu, o) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill(); c.stroke();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; arm(c, Math.cos(a) * s * 0.82, Math.sin(a) * s * 0.82, Math.cos(a) * s * 0.96, Math.sin(a) * s * 0.96); }
    c.lineWidth = 5; arm(c, 0, 0, Math.cos(t * 2) * s * 0.75, Math.sin(t * 2) * s * 0.75);
    c.lineWidth = 7; arm(c, 0, 0, Math.cos(t * 0.3) * s * 0.48, Math.sin(t * 0.3) * s * 0.48);
    solid(c, b); c.beginPath(); c.arc(0, 0, 7 + pu * 4, 0, TAU); c.fill();
  },
  skull(c, b, t, pu, o) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.arc(0, -s * 0.2, s * 0.9, PI * 0.85, PI * 0.15); c.lineTo(s * 0.45, s * 0.9); c.lineTo(-s * 0.45, s * 0.9); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.arc(d * s * 0.36, -s * 0.2, s * (0.2 + pu * 0.06), 0, TAU); c.fill(); }
    for (let i = -1; i <= 1; i++) c.fillRect(i * s * 0.22 - 3, s * 0.45, 6, s * 0.42);
  },
  trident(c, b, t, pu, o) {
    const s = b.r;
    c.rotate(Math.sin(t) * 0.2);
    c.lineWidth = 6; c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineCap = "round";
    arm(c, 0, -s * 1.1, 0, s * 1.2);
    c.beginPath(); c.moveTo(-s * 0.8, -s * 1.1); c.lineTo(-s * 0.8, -s * 0.25); c.lineTo(s * 0.8, -s * 0.25); c.lineTo(s * 0.8, -s * 1.1); c.stroke();
    c.lineCap = "butt";
    pg(c, 4, s * (0.28 + pu * 0.1), PI / 4); c.translate(0, 0); solid(c, b); c.fill();
  },
  moth(c, b, t, pu, o) {
    const s = b.r, f = 0.75 + Math.sin(t * 8) * 0.25;
    ink(c, b, 3);
    for (let d = -1; d <= 1; d += 2) {
      c.beginPath(); c.moveTo(0, -s * 0.4); c.lineTo(d * s * 1.5 * f, -s); c.lineTo(d * s * 1.2 * f, s * 0.1); c.lineTo(d * s * 0.7 * f, s * 0.9); c.lineTo(0, s * 0.4); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(d * s * 0.85 * f, -s * 0.3, s * (0.16 + pu * 0.08), 0, TAU); solid(c, b); c.fill(); ink(c, b, 3);
    }
    solid(c, b); c.fillRect(-5, -s * 0.6, 10, s * 1.3);
  },
  shield(c, b, t, pu, o) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s, -s); c.lineTo(s, -s); c.lineTo(s * 0.9, s * 0.2); c.lineTo(0, s * 1.3); c.lineTo(-s * 0.9, s * 0.2); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    c.fillRect(-5, -s * 0.8, 10, s * 1.7);
    c.fillRect(-s * 0.7, -s * (0.3 + pu * 0.1), s * 1.4, 10);
  },
  wheel(c, b, t, pu, o) {
    ink(c, b, 4);
    c.beginPath(); c.arc(0, 0, b.r, 0, TAU); c.fill(); c.stroke();
    c.save(); c.rotate(t * (o.spin || 1.4));
    for (let i = 0; i < o.n; i++) { const a = (i / o.n) * TAU; arm(c, 0, 0, Math.cos(a) * b.r, Math.sin(a) * b.r); }
    c.restore();
    c.beginPath(); c.arc(0, 0, b.r * (1.18 + pu * 0.12), 0, TAU); c.globalAlpha = 0.4; c.stroke(); c.globalAlpha = 1;
    c.beginPath(); c.arc(0, 0, b.r * 0.22, 0, TAU); solid(c, b); c.fill();
  },
};
const lookOf = (o) => (c, b, t, pu) => LOOKS[o.k](c, b, t, pu, o);
