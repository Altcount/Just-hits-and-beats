"use strict";
// Bodies for the second fifty bosses, part one. Every boss gets a shape of its own.
Object.assign(LOOKS, {
  ufo(c, b, t, pu) {
    const s = b.r;
    c.rotate(Math.sin(t * 2) * 0.12);
    ink(c, b, 3);
    c.beginPath(); c.arc(0, -s * 0.15, s * 0.55, PI, 0); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, s * 0.05, s * 1.25, s * 0.38, 0, 0, TAU); c.fill(); c.stroke();
    solid(c, b);
    for (let i = 0; i < 5; i++) { const a = t * 3 + i * 1.26; c.beginPath(); c.arc(Math.cos(a) * s, s * 0.05 + Math.sin(a) * s * 0.28, 4 + pu * 2, 0, TAU); c.fill(); }
    c.globalAlpha = 0.25 + pu * 0.35;
    c.beginPath(); c.moveTo(-s * 0.3, s * 0.4); c.lineTo(s * 0.3, s * 0.4); c.lineTo(s * 0.7, s * 1.4); c.lineTo(-s * 0.7, s * 1.4); c.closePath(); c.fill();
    c.globalAlpha = 1;
  },
  ghost(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.arc(0, -s * 0.2, s * 0.85, PI, 0); c.lineTo(s * 0.85, s);
    for (let i = 0; i <= 6; i++) c.lineTo(s * 0.85 - (i / 6) * s * 1.7, s * (i % 2 ? 0.72 : 1) + Math.sin(t * 5 + i) * 5);
    c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.ellipse(d * s * 0.32, -s * 0.25, s * 0.16, s * (0.24 + pu * 0.08), 0, 0, TAU); c.fill(); }
  },
  mushroom(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.3, -s * 0.1); c.lineTo(-s * 0.38, s * 1.1); c.lineTo(s * 0.38, s * 1.1); c.lineTo(s * 0.3, -s * 0.1); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, -s * 0.1, s * (1.1 + pu * 0.08), PI, 0); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    [[-0.6, -0.4], [0, -0.75], [0.6, -0.4], [-0.2, -0.3], [0.28, -0.32]].forEach((q) => { c.beginPath(); c.arc(q[0] * s, q[1] * s, s * 0.14, 0, TAU); c.fill(); });
  },
  fish(c, b, t, pu) {
    const s = b.r, flick = Math.sin(t * 8) * 0.25;
    c.rotate(b.heading || 0);
    ink(c, b, 3);
    c.beginPath(); c.moveTo(-s * 0.8, 0); c.lineTo(-s * 1.5, -s * (0.6 + flick)); c.lineTo(-s * 1.5, s * (0.6 - flick)); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, 0, s, s * 0.6, 0, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(s * 0.5, -s * 0.5); c.quadraticCurveTo(s * 1.1, -s * 1.3, s * 1.4, -s * 0.6); c.stroke();
    solid(c, b);
    c.beginPath(); c.arc(s * 1.4, -s * 0.55, 5 + pu * 5, 0, TAU); c.fill();
    c.beginPath(); c.arc(s * 0.5, -s * 0.12, 5, 0, TAU); c.fill();
  },
  sword(c, b, t, pu) {
    const s = b.r;
    c.rotate(0.7 + Math.sin(t * 1.5) * 0.15);
    ink(c, b, 3);
    c.beginPath(); c.moveTo(-s * 0.15, s * 0.5); c.lineTo(-s * 0.15, -s); c.lineTo(0, -s * 1.5); c.lineTo(s * 0.15, -s); c.lineTo(s * 0.15, s * 0.5); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    c.fillRect(-s * 0.6, s * 0.5, s * 1.2, s * 0.14);
    c.fillRect(-s * 0.09, s * 0.64, s * 0.18, s * 0.6);
    c.globalAlpha = 0.5 + pu * 0.5;
    c.fillRect(-2, -s * 1.1, 4, s * 1.5);
    c.globalAlpha = 1;
  },
  bell(c, b, t, pu) {
    const s = b.r, sw = Math.sin((game ? game.beat : t * 2) * PI) * 0.25;
    c.rotate(sw);
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s, s * 0.7); c.quadraticCurveTo(-s * 0.65, s * 0.2, -s * 0.55, -s * 0.4); c.arc(0, -s * 0.4, s * 0.55, PI, 0); c.quadraticCurveTo(s * 0.65, s * 0.2, s, s * 0.7); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    c.beginPath(); c.arc(-sw * s * 1.2, s * 0.8, s * (0.18 + pu * 0.07), 0, TAU); c.fill();
    c.fillRect(-s * 0.08, -s * 1.2, s * 0.16, s * 0.28);
  },
  key(c, b, t, pu) {
    const s = b.r;
    c.rotate(t * 0.6);
    c.lineWidth = 7; c.strokeStyle = b.flash > 0 ? ICE : CY;
    c.beginPath(); c.arc(0, -s * 0.6, s * (0.5 + pu * 0.06), 0, TAU); c.stroke();
    arm(c, 0, -s * 0.1, 0, s * 1.2);
    arm(c, 0, s * 0.75, s * 0.42, s * 0.75);
    arm(c, 0, s * 1.1, s * 0.34, s * 1.1);
    solid(c, b); c.beginPath(); c.arc(0, -s * 0.6, s * 0.16, 0, TAU); c.fill();
  },
  cloud(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 3);
    [[-0.65, 0.05, 0.5], [0.65, 0.05, 0.5], [-0.2, -0.3, 0.6], [0.3, -0.25, 0.55], [0, 0.15, 0.55]].forEach((q) => { c.beginPath(); c.arc(q[0] * s, q[1] * s, q[2] * s, 0, TAU); c.fill(); c.stroke(); });
    [[-0.65, 0.05, 0.42], [0.65, 0.05, 0.42], [-0.2, -0.3, 0.52], [0.3, -0.25, 0.47], [0, 0.15, 0.47]].forEach((q) => { c.beginPath(); c.arc(q[0] * s, q[1] * s, q[2] * s, 0, TAU); c.fill(); });
    solid(c, b);
    c.globalAlpha = 0.4 + pu * 0.6;
    c.beginPath(); c.moveTo(s * 0.1, s * 0.4); c.lineTo(-s * 0.25, s * 1); c.lineTo(0, s * 1); c.lineTo(-s * 0.2, s * 1.55); c.lineTo(s * 0.35, s * 0.8); c.lineTo(s * 0.05, s * 0.8); c.lineTo(s * 0.3, s * 0.4); c.closePath(); c.fill();
    c.globalAlpha = 1;
  },
  snowflake(c, b, t, pu) {
    const s = b.r;
    c.rotate(t * 0.4);
    c.lineWidth = 4; c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      c.save(); c.rotate((i / 6) * TAU);
      arm(c, 0, 0, 0, -s * (1.2 + pu * 0.1));
      [0.45, 0.8].forEach((u) => { arm(c, 0, -s * u, -s * 0.28, -s * (u + 0.25)); arm(c, 0, -s * u, s * 0.28, -s * (u + 0.25)); });
      c.restore();
    }
    c.lineCap = "butt";
    pg(c, 6, s * 0.22, 0); solid(c, b); c.fill();
  },
  robot(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    arm(c, 0, -s * 0.8, 0, -s * 1.25);
    solid(c, b); c.beginPath(); c.arc(0, -s * 1.3, 5 + pu * 5, 0, TAU); c.fill();
    ink(c, b, 4);
    c.fillRect(-s * 0.85, -s * 0.8, s * 1.7, s * 1.5); c.strokeRect(-s * 0.85, -s * 0.8, s * 1.7, s * 1.5);
    solid(c, b);
    const blink = Math.floor(t * 3) % 7 === 0 ? 0.03 : 0.2;
    c.fillRect(-s * 0.55, -s * 0.4, s * 0.38, s * blink * 2); c.fillRect(s * 0.17, -s * 0.4, s * 0.38, s * blink * 2);
    for (let i = 0; i < 5; i++) c.fillRect(-s * 0.55 + i * s * 0.24, s * 0.22, s * 0.16, s * 0.12 + (i % 2) * pu * s * 0.14);
    c.fillRect(-s * 1.2, -s * 0.2, s * 0.3, s * 0.5); c.fillRect(s * 0.9, -s * 0.2, s * 0.3, s * 0.5);
  },
  tree(c, b, t, pu) {
    const s = b.r, sway = Math.sin(t * 0.9) * 0.1;
    const branch = (len, depth) => {
      arm(c, 0, 0, 0, -len);
      if (!depth) { solid(c, b); c.beginPath(); c.arc(0, -len, 3 + pu * 3, 0, TAU); c.fill(); return; }
      c.save(); c.translate(0, -len);
      c.save(); c.rotate(-0.55 + sway); branch(len * 0.72, depth - 1); c.restore();
      c.save(); c.rotate(0.55 + sway); branch(len * 0.72, depth - 1); c.restore();
      c.restore();
    };
    c.translate(0, s);
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 3;
    branch(s * 0.72, 4);
  },
  owl(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.9, -s); c.lineTo(-s * 0.5, -s * 0.7); c.lineTo(s * 0.5, -s * 0.7); c.lineTo(s * 0.9, -s); c.lineTo(s * 0.9, s * 0.5); c.quadraticCurveTo(0, s * 1.5, -s * 0.9, s * 0.5); c.closePath(); c.fill(); c.stroke();
    for (let d = -1; d <= 1; d += 2) {
      c.beginPath(); c.arc(d * s * 0.42, -s * 0.2, s * 0.36, 0, TAU); c.stroke();
      solid(c, b); c.beginPath(); c.arc(d * s * 0.42, -s * 0.2, s * (0.13 + pu * 0.08), 0, TAU); c.fill(); ink(c, b, 4);
    }
    solid(c, b);
    c.beginPath(); c.moveTo(-s * 0.1, s * 0.1); c.lineTo(s * 0.1, s * 0.1); c.lineTo(0, s * 0.35); c.closePath(); c.fill();
  },
  pyramid(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(0, -s * 1.15); c.lineTo(s * 1.25, s * 0.9); c.lineTo(-s * 1.25, s * 0.9); c.closePath(); c.fill(); c.stroke();
    c.lineWidth = 2;
    for (let i = 1; i <= 3; i++) { const y = -s * 1.15 + (i / 4) * s * 2.05, w = (i / 4) * s * 1.25; arm(c, -w, y, w, y); }
    solid(c, b);
    c.beginPath(); c.moveTo(-s * 0.28, -s * 0.15); c.quadraticCurveTo(0, -s * (0.5 + pu * 0.1), s * 0.28, -s * 0.15); c.quadraticCurveTo(0, s * 0.15, -s * 0.28, -s * 0.15); c.fill();
  },
  rook(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.85, s * 1.1); c.lineTo(-s * 0.55, s * 0.6); c.lineTo(-s * 0.5, -s * 0.5); c.lineTo(-s * 0.85, -s * 0.5);
    [-0.85, -0.5, -0.3, 0.3, 0.5, 0.85].forEach((x, i) => { c.lineTo(x * s, -s * 0.95); if (i < 5) c.lineTo(x * s, i % 2 ? -s * 0.95 : -s * 0.7); });
    c.lineTo(s * 0.85, -s * 0.5); c.lineTo(s * 0.5, -s * 0.5); c.lineTo(s * 0.55, s * 0.6); c.lineTo(s * 0.85, s * 1.1); c.closePath(); c.fill(); c.stroke();
    solid(c, b); c.fillRect(-s * 0.14, -s * 0.2, s * 0.28, s * (0.5 + pu * 0.15));
  },
  dice(c, b, t, pu) {
    const s = b.r * 0.9, face = [1, 2, 3, 4, 5, 6][Math.floor((game ? game.beat : t * 2) / 2) % 6];
    c.rotate(Math.sin(t) * 0.3);
    ink(c, b, 4);
    c.fillRect(-s, -s, s * 2, s * 2); c.strokeRect(-s, -s, s * 2, s * 2);
    const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[face];
    solid(c, b);
    P.forEach((q) => { c.beginPath(); c.arc(q[0] * s * 0.55, q[1] * s * 0.55, s * (0.15 + pu * 0.04), 0, TAU); c.fill(); });
  },
  piano(c, b, t, pu) {
    const s = b.r, n = 7, kw = (s * 2.2) / n, hitKey = Math.floor((game ? game.beat : t * 2) * 2) % n;
    ink(c, b, 3);
    for (let i = 0; i < n; i++) {
      const x = -s * 1.1 + i * kw, down = i === hitKey;
      if (down) { solid(c, b); c.fillRect(x, -s * 0.6, kw, s * (1.3 + pu * 0.1)); ink(c, b, 3); }
      else { c.fillRect(x, -s * 0.6, kw, s * 1.3); }
      c.strokeRect(x, -s * 0.6, kw, s * 1.3);
    }
    solid(c, b);
    [1, 2, 4, 5, 6].forEach((i) => c.fillRect(-s * 1.1 + i * kw - kw * 0.28, -s * 0.6, kw * 0.56, s * 0.72));
  },
  anchor(c, b, t, pu) {
    const s = b.r;
    c.rotate(Math.sin(t * 0.9) * 0.2);
    c.lineWidth = 7; c.lineCap = "round"; c.strokeStyle = b.flash > 0 ? ICE : CY;
    c.beginPath(); c.arc(0, -s, s * 0.22, 0, TAU); c.stroke();
    arm(c, 0, -s * 0.78, 0, s);
    arm(c, -s * 0.5, -s * 0.45, s * 0.5, -s * 0.45);
    c.beginPath(); c.arc(0, s * 0.1, s * 0.92, 0.15, PI - 0.15); c.stroke();
    c.lineCap = "butt";
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.moveTo(d * s * 0.92, s * 0.15); c.lineTo(d * s * (1.25 + pu * 0.1), s * 0.05); c.lineTo(d * s * 0.98, s * 0.55); c.closePath(); c.fill(); }
  },
  comet(c, b, t, pu) {
    const s = b.r;
    c.rotate(b.heading || 0.5);
    solid(c, b);
    for (let i = 0; i < 7; i++) {
      c.globalAlpha = 0.65 - i * 0.08;
      const x = -s * (0.6 + i * 0.38) - Math.sin(t * 7 + i) * 4, y = Math.sin(t * 6 + i * 1.5) * s * 0.25;
      c.beginPath(); c.arc(x, y, s * (0.5 - i * 0.055), 0, TAU); c.fill();
    }
    c.globalAlpha = 1;
    ink(c, b, 4);
    pg(c, 7, s * (0.75 + pu * 0.08), t); c.fill(); c.stroke();
    c.beginPath(); c.arc(s * 0.12, -s * 0.1, s * 0.16, 0, TAU); c.stroke();
    c.beginPath(); c.arc(-s * 0.22, s * 0.18, s * 0.1, 0, TAU); c.stroke();
  },
  sigil(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 3;
    c.beginPath(); c.arc(0, 0, s * (1.15 + pu * 0.08), 0, TAU); c.stroke();
    c.beginPath(); c.arc(0, 0, s * 0.95, 0, TAU); c.stroke();
    c.rotate(t * 0.35);
    c.beginPath();
    for (let i = 0; i <= 5; i++) { const a = -PI / 2 + (i * 2 * TAU) / 5; c.lineTo(Math.cos(a) * s * 0.95, Math.sin(a) * s * 0.95); }
    c.stroke();
    solid(c, b);
    for (let i = 0; i < 5; i++) { const a = -PI / 2 + (i * TAU) / 5; c.fillRect(Math.cos(a) * s * 1.05 - 4, Math.sin(a) * s * 1.05 - 4, 8, 8); }
  },
  kraken(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 5; c.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const base = (i / 8) * PI + 0.05;
      c.beginPath(); c.moveTo(Math.cos(base) * s * 0.5, s * 0.1);
      for (let k = 1; k <= 7; k++) {
        const q = k / 7, a = base + Math.sin(t * 3 + i + k * 0.8) * 0.3;
        c.lineTo(Math.cos(a) * s * (0.5 + q * 1.1), s * 0.1 + Math.sin(a) * s * (0.2 + q * 1.1));
      }
      c.stroke();
    }
    c.lineCap = "butt";
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.6, s * 0.2); c.quadraticCurveTo(-s * 0.95, -s * 1.3, 0, -s * 1.3); c.quadraticCurveTo(s * 0.95, -s * 1.3, s * 0.6, s * 0.2); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.arc(d * s * 0.28, -s * 0.2, s * (0.13 + pu * 0.06), 0, TAU); c.fill(); }
  },
  rose(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 3);
    for (let ringN = 3; ringN >= 1; ringN--) {
      const n = ringN + 3, rr = s * (ringN / 3) * (1.05 + pu * 0.06);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + ringN + t * 0.15 * (ringN % 2 ? 1 : -1);
        c.save(); c.rotate(a);
        c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(rr * 0.9, -rr * 0.55, rr, 0); c.quadraticCurveTo(rr * 0.9, rr * 0.55, 0, 0);
        c.fill(); c.stroke();
        c.restore();
      }
    }
    c.beginPath(); c.arc(0, 0, s * 0.14, 0, TAU); solid(c, b); c.fill();
  },
  ribs(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 4; c.lineCap = "round";
    arm(c, 0, -s * 1.1, 0, s * 1.1);
    for (let i = 0; i < 5; i++) {
      const y = -s * 0.8 + i * s * 0.4, w = s * (1.1 - Math.abs(i - 1.5) * 0.16) * (1 + pu * 0.05);
      for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(d * w, y - s * 0.12, d * w * 0.82, y + s * 0.24); c.stroke(); }
    }
    c.lineCap = "butt";
    solid(c, b);
    c.beginPath(); c.arc(s * 0.12, -s * 0.15, s * (0.2 + pu * 0.1), 0, TAU); c.fill();
  },
  candle(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.5, -s * 0.3); c.lineTo(-s * 0.5, s * 1.1); c.lineTo(s * 0.5, s * 1.1); c.lineTo(s * 0.5, -s * 0.15); c.lineTo(s * 0.28, -s * 0.3); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(s * 0.32, -s * 0.2); c.quadraticCurveTo(s * 0.45, s * 0.2, s * 0.32, s * 0.45); c.lineWidth = 6; c.stroke();
    solid(c, b);
    const fl = Math.sin(t * 9) * 4;
    c.beginPath(); c.moveTo(0, -s * 0.35); c.quadraticCurveTo(-s * 0.32, -s * 0.7, fl, -s * (1.3 + pu * 0.25)); c.quadraticCurveTo(s * 0.32, -s * 0.7, 0, -s * 0.35); c.fill();
  },
  satellite(c, b, t, pu) {
    const s = b.r;
    c.rotate(t * 0.5);
    ink(c, b, 3);
    for (let d = -1; d <= 1; d += 2) {
      c.fillRect(d > 0 ? s * 0.45 : -s * 1.5, -s * 0.3, s * 1.05, s * 0.6); c.strokeRect(d > 0 ? s * 0.45 : -s * 1.5, -s * 0.3, s * 1.05, s * 0.6);
      for (let i = 1; i < 4; i++) { const x = (d > 0 ? s * 0.45 : -s * 1.5) + i * s * 0.26; arm(c, x, -s * 0.3, x, s * 0.3); }
    }
    pg(c, 8, s * 0.5, 0); c.fill(); c.stroke();
    arm(c, 0, -s * 0.5, 0, -s * 1);
    c.beginPath(); c.arc(0, -s * 1.15, s * 0.3, 0.2, PI - 0.2); c.stroke();
    solid(c, b); c.beginPath(); c.arc(0, 0, s * (0.2 + pu * 0.1), 0, TAU); c.fill();
  },
});
