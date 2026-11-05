"use strict";
// Bodies for the second fifty bosses, part two.
Object.assign(LOOKS, {
  hand(c, b, t, pu) {
    const s = b.r, curl = 0.65 + Math.sin(t * 2.5) * 0.2 + pu * 0.15;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineCap = "round";
    [[-0.62, 0.72], [-0.3, 1], [0.04, 1.1], [0.38, 0.95]].forEach((q) => {
      c.lineWidth = s * 0.26;
      arm(c, q[0] * s, -s * 0.1, q[0] * s, -s * (0.1 + q[1] * curl));
    });
    c.lineWidth = s * 0.26;
    arm(c, s * 0.68, s * 0.4, s * 1.1, -s * 0.05);
    c.lineCap = "butt";
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.78, -s * 0.15); c.lineTo(s * 0.58, -s * 0.15); c.lineTo(s * 0.68, s * 0.9); c.lineTo(-s * 0.68, s * 0.9); c.closePath(); c.fill(); c.stroke();
    solid(c, b); c.beginPath(); c.arc(-s * 0.05, s * 0.4, s * (0.2 + pu * 0.08), 0, TAU); c.fill();
  },
  cactus(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineCap = "round"; c.lineWidth = s * 0.34;
    arm(c, 0, s * 1.1, 0, -s);
    c.beginPath(); c.moveTo(0, s * 0.3); c.lineTo(-s * 0.72, s * 0.3); c.lineTo(-s * 0.72, -s * 0.4); c.stroke();
    c.beginPath(); c.moveTo(0, 0); c.lineTo(s * 0.72, 0); c.lineTo(s * 0.72, -s * 0.7); c.stroke();
    c.lineCap = "butt";
    c.fillStyle = "#000";
    for (let i = 0; i < 5; i++) c.fillRect(-3, -s * 0.85 + i * s * 0.42, 6, s * 0.14);
    solid(c, b);
    c.beginPath(); c.arc(0, -s * 1.15, 5 + pu * 5, 0, TAU); c.fill();
  },
  web(c, b, t, pu) {
    const s = b.r * 1.15, n = 8;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 2;
    for (let i = 0; i < n; i++) { const a = (i / n) * TAU + t * 0.1; arm(c, 0, 0, Math.cos(a) * s, Math.sin(a) * s); }
    for (let rr = 1; rr <= 4; rr++) {
      c.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * TAU + t * 0.1, q = (rr / 4) * s * (1 + pu * 0.04);
        if (!i) c.moveTo(Math.cos(a) * q, Math.sin(a) * q);
        else { const m = a - TAU / n / 2; c.quadraticCurveTo(Math.cos(m) * q * 0.8, Math.sin(m) * q * 0.8, Math.cos(a) * q, Math.sin(a) * q); }
      }
      c.stroke();
    }
    solid(c, b); pg(c, 4, b.r * 0.3, PI / 4); c.fill();
  },
  spring(c, b, t, pu) {
    const s = b.r, squash = 0.75 + Math.sin(t * 5) * 0.2 + pu * 0.1;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 5;
    c.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80, a = u * TAU * 5, x = Math.cos(a) * s * 0.75, y = (u - 0.5) * s * 2.3 * squash + Math.sin(a) * s * 0.22;
      c.lineTo(x, y);
    }
    c.stroke();
    solid(c, b);
    c.fillRect(-s * 0.85, -s * 1.15 * squash - 9, s * 1.7, 9);
    c.fillRect(-s * 0.85, s * 1.15 * squash, s * 1.7, 9);
  },
  vinyl(c, b, t, pu) {
    const s = b.r * 1.15;
    ink(c, b, 3);
    c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill(); c.stroke();
    c.lineWidth = 1;
    for (let q = 0.5; q < 0.95; q += 0.1) { c.beginPath(); c.arc(0, 0, s * q, 0, TAU); c.stroke(); }
    c.rotate(t * 3);
    c.lineWidth = 3;
    c.beginPath(); c.arc(0, 0, s * 0.72, -0.4, 0.4); c.stroke();
    solid(c, b);
    c.beginPath(); c.arc(0, 0, s * (0.32 + pu * 0.05), 0, TAU); c.fill();
    c.fillStyle = "#000"; c.beginPath(); c.arc(0, 0, 4, 0, TAU); c.fill();
    c.rotate(-t * 3);
    c.strokeStyle = ICE; c.lineWidth = 4;
    c.beginPath(); c.moveTo(s * 1.05, -s * 0.95); c.lineTo(s * 0.9, -s * 0.1); c.lineTo(s * 0.55, s * 0.28); c.stroke();
  },
  sunface(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = CY; c.lineWidth = 4;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + t * 0.3, q = s * (1.3 + (i % 2) * 0.28 + pu * 0.15), m = a + 0.14;
      arm(c, Math.cos(a) * s * 0.95, Math.sin(a) * s * 0.95, Math.cos(m) * q, Math.sin(m) * q);
    }
    ink(c, b, 4);
    c.beginPath(); c.arc(0, 0, s * 0.9, 0, TAU); c.fill(); c.stroke();
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.moveTo(d * s * 0.15, -s * 0.18); c.lineTo(d * s * 0.6, -s * 0.34); c.lineTo(d * s * 0.5, -s * 0.05); c.closePath(); c.fill(); }
    c.beginPath(); c.arc(0, s * 0.12, s * 0.45, 0.25, PI - 0.25); c.closePath(); c.fill();
  },
  spade(c, b, t, pu) {
    const s = b.r * (1 + pu * 0.06);
    ink(c, b, 4);
    c.beginPath(); c.moveTo(0, -s * 1.25); c.bezierCurveTo(s * 1.5, -s * 0.2, s * 0.9, s * 0.85, 0, s * 0.3); c.bezierCurveTo(-s * 0.9, s * 0.85, -s * 1.5, -s * 0.2, 0, -s * 1.25); c.fill(); c.stroke();
    solid(c, b);
    c.beginPath(); c.moveTo(0, s * 0.2); c.lineTo(s * 0.32, s * 1.15); c.lineTo(-s * 0.32, s * 1.15); c.closePath(); c.fill();
  },
  book(c, b, t, pu) {
    const s = b.r, flap = Math.sin(t * 3) * 0.2;
    ink(c, b, 3);
    for (let d = -1; d <= 1; d += 2) {
      c.beginPath(); c.moveTo(0, -s * 0.6); c.quadraticCurveTo(d * s * 0.7, -s * (0.95 + flap), d * s * 1.3, -s * (0.65 + flap)); c.lineTo(d * s * 1.3, s * 0.75); c.quadraticCurveTo(d * s * 0.7, s * 0.45, 0, s * 0.8); c.closePath(); c.fill(); c.stroke();
    }
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) for (let i = 0; i < 4; i++) c.fillRect(d > 0 ? s * 0.25 : -s * 1.05, -s * 0.4 + i * s * 0.28, s * (0.8 - (i === 3 ? 0.3 : 0)), 3 + pu * 2);
    c.fillRect(-2, -s * 0.6, 4, s * 1.4);
  },
  traffic(c, b, t, pu) {
    const s = b.r, lit = Math.floor((game ? game.beat : t * 2) / 2) % 3;
    ink(c, b, 4);
    c.fillRect(-s * 0.55, -s * 1.3, s * 1.1, s * 2.5); c.strokeRect(-s * 0.55, -s * 1.3, s * 1.1, s * 2.5);
    for (let i = 0; i < 3; i++) {
      const y = -s * 0.78 + i * s * 0.78;
      c.beginPath(); c.arc(0, y, s * 0.3, 0, TAU);
      if (i === lit) { solid(c, b); c.fill(); ink(c, b, 4); } else c.stroke();
    }
    arm(c, -s * 0.55, -s * 0.2, -s * (0.95 + pu * 0.1), -s * 0.5);
    arm(c, s * 0.55, -s * 0.2, s * (0.95 + pu * 0.1), -s * 0.5);
  },
  guillotine(c, b, t, pu) {
    const s = b.r, drop = (Math.sin((game ? game.beat : t * 2) * PI / 2) + 1) * 0.5;
    c.lineWidth = 6; c.strokeStyle = b.flash > 0 ? ICE : CY;
    arm(c, -s * 0.8, s * 1.15, -s * 0.8, -s * 1.3);
    arm(c, s * 0.8, s * 1.15, s * 0.8, -s * 1.3);
    arm(c, -s * 1, -s * 1.3, s * 1, -s * 1.3);
    arm(c, -s * 1.05, s * 1.15, s * 1.05, s * 1.15);
    solid(c, b);
    const y = lerp(-s * 1, s * 0.25, drop);
    c.beginPath(); c.moveTo(-s * 0.72, y); c.lineTo(s * 0.72, y); c.lineTo(s * 0.72, y + s * 0.32); c.lineTo(-s * 0.72, y + s * 0.65); c.closePath(); c.fill();
  },
  prism(c, b, t, pu) {
    const s = b.r;
    c.lineWidth = 3; c.strokeStyle = CY;
    arm(c, -s * 2, s * 0.35, -s * 0.5, -s * 0.05);
    for (let i = -2; i <= 2; i++) {
      c.globalAlpha = 0.5 + pu * 0.5;
      arm(c, s * 0.42, s * 0.05, s * 1.85, s * (0.3 + i * 0.3));
    }
    c.globalAlpha = 1;
    ink(c, b, 4);
    pg(c, 3, s * 1.05, -PI / 2); c.fill(); c.stroke();
    pg(c, 3, s * 0.45, PI / 2 + t); c.stroke();
  },
  infinity(c, b, t, pu) {
    const s = b.r * 1.2;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 7;
    c.beginPath();
    for (let i = 0; i <= 80; i++) {
      const a = (i / 80) * TAU, q = 1 + Math.sin(a) * Math.sin(a);
      c.lineTo((s * Math.cos(a)) / q * 1.25, (s * Math.sin(a) * Math.cos(a)) / q * 1.5);
    }
    c.closePath(); c.stroke();
    solid(c, b);
    for (let k = 0; k < 2; k++) {
      const a = t * 2 + k * PI, q = 1 + Math.sin(a) * Math.sin(a);
      c.beginPath(); c.arc((s * Math.cos(a)) / q * 1.25, (s * Math.sin(a) * Math.cos(a)) / q * 1.5, 7 + pu * 4, 0, TAU); c.fill();
    }
  },
  lighthouse(c, b, t, pu) {
    const s = b.r, sweep = t * 1.2;
    solid(c, b);
    c.globalAlpha = 0.22 + pu * 0.2;
    c.beginPath(); c.moveTo(0, -s * 0.85); c.lineTo(Math.cos(sweep - 0.2) * s * 2.6, -s * 0.85 + Math.sin(sweep - 0.2) * s * 1.1); c.lineTo(Math.cos(sweep + 0.2) * s * 2.6, -s * 0.85 + Math.sin(sweep + 0.2) * s * 1.1); c.closePath(); c.fill();
    c.globalAlpha = 1;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.32, -s * 0.55); c.lineTo(s * 0.32, -s * 0.55); c.lineTo(s * 0.65, s * 1.15); c.lineTo(-s * 0.65, s * 1.15); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    [-0.1, 0.55].forEach((y) => c.fillRect(-s * (0.4 + y * 0.3), y * s, s * (0.8 + y * 0.6), s * 0.26));
    c.fillRect(-s * 0.26, -s * 1.05, s * 0.52, s * 0.42);
    c.beginPath(); c.moveTo(-s * 0.38, -s * 1.05); c.lineTo(0, -s * 1.42); c.lineTo(s * 0.38, -s * 1.05); c.closePath(); c.fill();
  },
  beetle(c, b, t, pu) {
    const s = b.r;
    c.rotate((b.heading || -PI / 2) + PI / 2);
    c.strokeStyle = CY; c.lineWidth = 4;
    for (let d = -1; d <= 1; d += 2) for (let i = 0; i < 3; i++) {
      const w = Math.sin(t * 9 + i * 2 + d) * 0.14, y = -s * 0.3 + i * s * 0.55;
      arm(c, d * s * 0.6, y, d * s * 1.35, y + s * (i - 1) * 0.5 + w * s);
    }
    arm(c, -s * 0.2, -s * 0.95, -s * 0.55, -s * 1.5);
    arm(c, s * 0.2, -s * 0.95, s * 0.55, -s * 1.5);
    ink(c, b, 4);
    c.beginPath(); c.ellipse(0, s * 0.15, s * 0.78, s * 1, 0, 0, TAU); c.fill(); c.stroke();
    arm(c, 0, -s * 0.85, 0, s * 1.15);
    solid(c, b);
    c.beginPath(); c.arc(0, -s * 0.9, s * 0.38, PI, 0); c.closePath(); c.fill();
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.arc(d * s * 0.36, s * 0.2, s * (0.15 + pu * 0.05), 0, TAU); c.fill(); }
  },
  tophat(c, b, t, pu) {
    const s = b.r;
    c.rotate(Math.sin(t * 2) * 0.1);
    ink(c, b, 4);
    c.fillRect(-s * 0.65, -s * 1.15, s * 1.3, s * 1.65); c.strokeRect(-s * 0.65, -s * 1.15, s * 1.3, s * 1.65);
    c.fillRect(-s * 1.2, s * 0.5, s * 2.4, s * 0.2); c.strokeRect(-s * 1.2, s * 0.5, s * 2.4, s * 0.2);
    solid(c, b);
    c.fillRect(-s * 0.65, s * 0.15, s * 1.3, s * 0.2);
    for (let i = 0; i < 3; i++) {
      const a = t * 2.5 + i * 2.1, x = Math.cos(a) * s * 0.9, y = -s * 1.4 + Math.sin(a) * s * 0.28;
      pg(c, 4, 5 + pu * 4, a); c.save(); c.translate(x, y); pg(c, 4, 5 + pu * 4, a); c.fill(); c.restore();
    }
  },
  plague(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s * 0.75, -s * 0.9); c.quadraticCurveTo(s * 0.1, -s * 1.3, s * 0.6, -s * 0.5); c.lineTo(s * 1.65, s * 0.72); c.quadraticCurveTo(s * 0.5, s * 0.7, s * 0.05, s * 0.7); c.quadraticCurveTo(-s * 0.8, s * 0.65, -s * 0.75, -s * 0.9); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.arc(-s * 0.05, -s * 0.28, s * 0.3, 0, TAU); c.stroke();
    solid(c, b);
    c.beginPath(); c.arc(-s * 0.05, -s * 0.28, s * (0.14 + pu * 0.1), 0, TAU); c.fill();
    c.fillRect(-s * 0.9, -s * 1.02, s * 1.5, s * 0.14);
  },
  astrolabe(c, b, t, pu) {
    const s = b.r * 1.15;
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      c.save(); c.rotate(t * (0.5 + i * 0.35) * (i % 2 ? -1 : 1) + i);
      c.beginPath(); c.ellipse(0, 0, s * (1 - i * 0.2), s * (0.42 + i * 0.1), 0, 0, TAU); c.stroke();
      solid(c, b); c.beginPath(); c.arc(s * (1 - i * 0.2), 0, 5, 0, TAU); c.fill();
      c.restore();
    }
    solid(c, b); pg(c, 4, s * (0.22 + pu * 0.06), t); c.fill();
  },
  crook(c, b, t, pu) {
    const s = b.r;
    c.rotate(Math.sin(t * 0.9) * 0.14);
    c.strokeStyle = b.flash > 0 ? ICE : CY; c.lineWidth = 7; c.lineCap = "round";
    c.beginPath(); c.moveTo(0, s * 1.35); c.lineTo(0, -s * 0.6); c.arc(s * 0.42, -s * 0.6, s * 0.42, PI, 0.1); c.stroke();
    c.lineCap = "butt";
    ink(c, b, 3);
    pg(c, 4, s * 0.34, 0); c.save(); c.translate(s * 0.42, -s * 0.5); pg(c, 4, s * (0.28 + pu * 0.1), t * 2); solid(c, b); c.fill(); c.restore();
    c.strokeStyle = CY; c.lineWidth = 2;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(0, s * (0.15 + i * 0.32), s * 0.2, 0, PI); c.stroke(); }
  },
  blimp(c, b, t, pu) {
    const s = b.r;
    c.translate(0, Math.sin(t * 1.2) * 5);
    ink(c, b, 3);
    c.beginPath(); c.moveTo(-s * 1.15, -s * 0.2); c.lineTo(-s * 1.65, -s * 0.72); c.lineTo(-s * 1.65, s * 0.5); c.lineTo(-s * 1.15, s * 0.1); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, -s * 0.1, s * 1.4, s * 0.68, 0, 0, TAU); c.fill(); c.stroke();
    c.lineWidth = 1.5;
    [-0.45, 0.45].forEach((q) => { c.beginPath(); c.ellipse(0, -s * 0.1, s * 1.4, s * 0.68 * Math.abs(q), 0, 0, TAU); c.stroke(); });
    ink(c, b, 3);
    c.fillRect(-s * 0.35, s * 0.6, s * 0.7, s * 0.28); c.strokeRect(-s * 0.35, s * 0.6, s * 0.7, s * 0.28);
    solid(c, b);
    for (let i = 0; i < 3; i++) c.fillRect(-s * 0.26 + i * s * 0.2, s * 0.66, s * 0.12, s * 0.14);
    c.save(); c.translate(s * 0.62, s * 0.74); c.rotate(t * 9); c.fillRect(-2, -s * 0.28 - pu * 4, 4, s * 0.56 + pu * 8); c.restore();
  },
  scorpion(c, b, t, pu) {
    const s = b.r;
    c.strokeStyle = CY; c.lineWidth = 4;
    for (let d = -1; d <= 1; d += 2) {
      for (let i = 0; i < 3; i++) arm(c, d * s * 0.5, s * 0.1 + i * s * 0.25, d * s * 1.25, s * (0.28 + i * 0.36) + Math.sin(t * 8 + i) * 4);
      c.beginPath(); c.moveTo(d * s * 0.5, -s * 0.15); c.lineTo(d * s * 1.15, -s * 0.5); c.lineTo(d * s * 1.1, -s * 1); c.stroke();
      c.beginPath(); c.arc(d * s * 1.1, -s * 1.15, s * 0.18, d > 0 ? 0.7 : 1.5, d > 0 ? 5.6 : 6.4); c.stroke();
    }
    c.lineWidth = 6;
    const st = Math.sin(t * 2.6) * 0.14 + pu * 0.1;
    c.beginPath(); c.moveTo(0, s * 0.75); c.quadraticCurveTo(0, s * 1.5, s * 0.1, -s * (0.6 + st)); c.stroke();
    solid(c, b);
    c.beginPath(); c.moveTo(s * 0.1, -s * (0.55 + st)); c.lineTo(s * 0.34, -s * (0.85 + st)); c.lineTo(-s * 0.08, -s * (1.05 + st)); c.closePath(); c.fill();
    ink(c, b, 4);
    c.beginPath(); c.ellipse(0, s * 0.3, s * 0.58, s * 0.62, 0, 0, TAU); c.fill(); c.stroke();
  },
  golem(c, b, t, pu) {
    const s = b.r, jolt = pu * 4;
    ink(c, b, 3);
    [[-0.55, -1.2, 1.1, 0.75], [-1, -0.42, 2, 0.95], [-0.85, 0.56, 0.68, 0.72], [0.17, 0.56, 0.68, 0.72], [-1.45, -0.32, 0.4, 0.9], [1.05, -0.32, 0.4, 0.9]].forEach((q, i) => {
      const y = q[1] * s - (i === 0 ? jolt : 0);
      c.fillRect(q[0] * s, y, q[2] * s, q[3] * s); c.strokeRect(q[0] * s, y, q[2] * s, q[3] * s);
    });
    solid(c, b);
    c.fillRect(-s * 0.36, -s * 0.92 - jolt, s * 0.24, s * 0.16);
    c.fillRect(s * 0.12, -s * 0.92 - jolt, s * 0.24, s * 0.16);
    pg(c, 4, s * (0.22 + pu * 0.08), PI / 4); c.fill();
    c.save(); c.translate(0, s * 0.05); pg(c, 4, s * (0.22 + pu * 0.08), PI / 4 + t); c.fill(); c.restore();
  },
  totem(c, b, t, pu) {
    const s = b.r;
    [[-1.3, 0], [-0.45, 1], [0.4, 2]].forEach((q) => {
      const y = q[0] * s + Math.sin(t * 2 + q[1]) * 3;
      ink(c, b, 3);
      c.fillRect(-s * 0.7, y, s * 1.4, s * 0.8); c.strokeRect(-s * 0.7, y, s * 1.4, s * 0.8);
      solid(c, b);
      if (q[1] === 0) { c.fillRect(-s * 0.44, y + s * 0.2, s * 0.3, s * 0.3); c.fillRect(s * 0.14, y + s * 0.2, s * 0.3, s * 0.3); }
      if (q[1] === 1) { pg(c, 3, s * (0.25 + pu * 0.08), PI / 2); c.save(); c.translate(0, y + s * 0.4); pg(c, 3, s * (0.25 + pu * 0.08), PI / 2); c.fill(); c.restore(); }
      if (q[1] === 2) { for (let i = 0; i < 4; i++) c.fillRect(-s * 0.5 + i * s * 0.28, y + s * 0.2, s * 0.17, s * (0.3 + (i % 2) * 0.15)); }
    });
    solid(c, b);
    for (let d = -1; d <= 1; d += 2) { c.beginPath(); c.moveTo(d * s * 0.7, -s * 1); c.lineTo(d * s * 1.3, -s * (1.4 + pu * 0.1)); c.lineTo(d * s * 0.7, -s * 0.65); c.closePath(); c.fill(); }
  },
  drum(c, b, t, pu) {
    const s = b.r;
    ink(c, b, 4);
    c.beginPath(); c.moveTo(-s, -s * 0.45); c.lineTo(-s, s * 0.7); c.quadraticCurveTo(0, s * 1.15, s, s * 0.7); c.lineTo(s, -s * 0.45); c.closePath(); c.fill(); c.stroke();
    c.lineWidth = 2;
    for (let i = 0; i < 5; i++) { const x = -s * 0.8 + i * s * 0.4; arm(c, x, -s * 0.12, x + (i % 2 ? s * 0.4 : -s * 0.1), s * 0.75); }
    ink(c, b, 4);
    c.beginPath(); c.ellipse(0, -s * 0.45, s, s * 0.36, 0, 0, TAU); solid(c, b); c.globalAlpha = 0.25 + pu * 0.75; c.fill(); c.globalAlpha = 1; c.stroke();
    c.lineWidth = 5;
    arm(c, -s * 0.2, -s * (0.55 + pu * 0.1), -s * 1.1, -s * (1.3 - pu * 0.6));
    arm(c, s * 0.2, -s * (0.55 + pu * 0.1), s * 1.1, -s * (1.3 - pu * 0.6));
  },
  shark(c, b, t, pu) {
    const s = b.r, bite = 0.15 + Math.abs(Math.sin(t * 3)) * 0.22 + pu * 0.1, tail = Math.sin(t * 7) * 0.2;
    c.rotate(b.heading || 0);
    ink(c, b, 3);
    c.beginPath(); c.moveTo(-s * 0.95, 0); c.lineTo(-s * 1.55, -s * (0.65 + tail)); c.lineTo(-s * 1.32, 0); c.lineTo(-s * 1.55, s * (0.5 - tail)); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-s * 0.05, -s * 0.42); c.lineTo(-s * 0.4, -s * 1.1); c.lineTo(s * 0.35, -s * 0.42); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(s * 1.4, -s * 0.05); c.quadraticCurveTo(s * 0.4, -s * 0.72, -s, -s * 0.05); c.quadraticCurveTo(0, s * 0.62, s * 1.15, s * bite); c.lineTo(s * 0.45, s * 0.1); c.closePath(); c.fill(); c.stroke();
    solid(c, b);
    c.beginPath(); c.arc(s * 0.72, -s * 0.2, 5, 0, TAU); c.fill();
    for (let i = 0; i < 4; i++) { const x = s * (0.55 + i * 0.17); c.beginPath(); c.moveTo(x, s * 0.08); c.lineTo(x + s * 0.08, s * 0.08); c.lineTo(x + s * 0.04, s * 0.24); c.closePath(); c.fill(); }
  },
});
