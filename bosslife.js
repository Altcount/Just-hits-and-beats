"use strict";
// Makes every boss feel alive: a face that reacts, a body that moves with the music, and layers behind it.
// All of this is looks only. Hit areas and attacks are decided in the engine and never read from here.
const BossLife = (() => {
  // [style, eye height, eye spacing, eye size, mouth, mouth height], all in units of the boss's radius.
  const F = (style, y = -0.1, gap = 0.34, size = 0.24, mouth = null, my = 0.42) => ({ style, y, gap, size, mouth, my });
  const BY_ID = {
    volt: F("fierce", -0.1, 0.3, 0.2, "jag", 0.32), metro: F("cyclops", 0.1, 0, 0.26), queen: F("fierce", -0.02, 0.2, 0.15, "jag", 0.2),
    twins: F("slits", 0, 0.2, 0.18), horizon: F("fierce", -0.12, 0.36, 0.24, "jag", 0.42), siren: F("round", -0.12, 0.26, 0.17, "wail", 0.26),
    obelisk: F("cyclops", -0.35, 0, 0.2, "jag", 0.42), widow: F("triple", -0.1, 0.2, 0.13), cardinal: F("visor", -0.33, 0, 0.5),
    eclipse: F("slits", -0.05, 0.34, 0.26, "jag", 0.38),
  };
  const BY_LOOK = {
    poly: F("fierce", -0.08, 0.3, 0.2, "jag", 0.32), star: F("cyclops", 0, 0, 0.26), orbit: F("round", -0.02, 0.2, 0.15), gear: F("fierce", -0.05, 0.22, 0.17, "jag", 0.2),
    wings: F("slits", -0.05, 0.13, 0.12), jelly: F("round", -0.45, 0.32, 0.2), crystal: F("slits", 0, 0.14, 0.13), planet: F("round", -0.08, 0.28, 0.2, "wail", 0.3),
    glyph: F("visor", -0.45, 0, 0.7), maw: F("cyclops", -0.5, 0, 0.2), bars: F("visor", -0.65, 0, 0.75), helix: F("cyclops", 0, 0, 0.26), cube: F("slits", 0, 0.2, 0.17),
    flame: F("fierce", 0.08, 0.26, 0.2, "jag", 0.5), hourglass: F("round", -0.72, 0.26, 0.16), lantern: F("cyclops", 0.1, 0, 0.26), blade: F("cyclops", 0, 0, 0.2),
    shell: F("cyclops", 0, 0, 0.26), crown: F("fierce", 0.05, 0.36, 0.2, "jag", 0.42), clock: F("round", -0.22, 0.3, 0.17, "wail", 0.3), trident: F("cyclops", -0.25, 0, 0.26),
    moth: F("round", -0.35, 0.82, 0.16), shield: F("fierce", -0.45, 0.36, 0.18), wheel: F("round", -0.2, 0.3, 0.17), ufo: F("round", -0.42, 0.2, 0.15),
    mushroom: F("round", 0.42, 0.14, 0.12, "wail", 0.78), sword: F("cyclops", 0.57, 0, 0.14), bell: F("fierce", -0.28, 0.24, 0.16, "jag", 0.32), key: F("cyclops", -0.6, 0, 0.24),
    cloud: F("fierce", -0.15, 0.36, 0.22, "jag", 0.22), snowflake: F("cyclops", 0, 0, 0.2), tree: F("cyclops", 0.05, 0, 0.2), rook: F("slits", -0.1, 0.2, 0.15, "jag", 0.42),
    dice: F("slits", -0.62, 0.42, 0.14), piano: F("fierce", -0.92, 0.34, 0.15), anchor: F("cyclops", -1, 0, 0.17), comet: F("fierce", -0.05, 0.24, 0.19, "jag", 0.3),
    sigil: F("cyclops", 0, 0, 0.28), rose: F("cyclops", 0, 0, 0.2), ribs: F("slits", -0.92, 0.26, 0.15, "jag", -0.55), candle: F("round", 0.18, 0.2, 0.15, "wail", 0.55),
    satellite: F("cyclops", 0, 0, 0.2), hand: F("cyclops", 0.42, 0, 0.26), cactus: F("fierce", -0.42, 0.11, 0.09), web: F("triple", 0, 0.14, 0.11), spring: F("visor", 0, 0, 0.62),
    vinyl: F("slits", -0.42, 0.3, 0.14), spade: F("fierce", -0.15, 0.32, 0.22, "jag", 0.24), book: F("round", -0.15, 0.65, 0.18), guillotine: F("visor", 0.88, 0, 0.6),
    prism: F("cyclops", 0.12, 0, 0.2), infinity: F("round", 0, 0.75, 0.2), lighthouse: F("cyclops", -0.82, 0, 0.14), tophat: F("fierce", -0.45, 0.28, 0.17), astrolabe: F("cyclops", 0, 0, 0.2),
    crook: F("cyclops", -0.5, 0, 0.14), blimp: F("round", -0.15, 0.7, 0.17, "wail", 0.15), scorpion: F("fierce", 0.15, 0.22, 0.15, "jag", 0.5), drum: F("fierce", 0.18, 0.4, 0.16, "jag", 0.58),
  };
  const faceOf = (def) => {
    const o = def.id === "choir" && game && game.move && game.move.owner ? game.move.owner : def;
    return o.id && BY_ID[o.id] ? BY_ID[o.id] : o.look ? BY_LOOK[o.look.k] || null : null;
  };
  const hashOf = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const fract = (x) => x - Math.floor(x);

  function drawEye(c, x, y, e, open, lx, ly, rage, shut) {
    const ry = e * 0.78 * open;
    c.beginPath(); c.ellipse(x, y, e, Math.max(0.6, ry), 0, 0, TAU);
    c.fillStyle = "#000"; c.fill();
    c.lineWidth = Math.max(1.5, e * 0.14); c.strokeStyle = CY; c.stroke();
    if (open < 0.12 || shut) return;
    c.save(); c.clip();
    const iris = e * (0.5 + rage * 0.12);
    c.fillStyle = ICE; c.beginPath(); c.arc(x + lx * e * 0.42, y + ly * e * 0.32, iris, 0, TAU); c.fill();
    c.fillStyle = "#000"; c.beginPath(); c.arc(x + lx * e * 0.5, y + ly * e * 0.38, iris * (0.55 - rage * 0.22), 0, TAU); c.fill();
    c.restore();
  }
  // The expression is the same parts for everyone; what changes is how open, how angry, how hurt.
  function drawFace(c, s, r, m, lx, ly) {
    const y = s.y * r, gap = s.gap * r, e = s.size * r, open = m.open;
    if (s.style === "cyclops") {
      drawEye(c, 0, y, e * (1 + m.attack * 0.2), open, lx, ly, m.rage);
    } else if (s.style === "round") {
      for (let d = -1; d <= 1; d += 2) drawEye(c, d * gap, y, e * (1 + m.attack * 0.15), open * (1 + m.hurt * 0.25), lx, ly, m.rage);
    } else if (s.style === "triple") {
      drawEye(c, 0, y - e * 1.1, e, open, lx, ly, m.rage);
      for (let d = -1; d <= 1; d += 2) drawEye(c, d * gap, y + e * 0.55, e, open, lx, ly, m.rage);
    } else if (s.style === "visor") {
      c.fillStyle = "#000"; c.fillRect(-e, y - r * 0.09 * open - 1, e * 2, r * 0.18 * open + 2);
      c.strokeStyle = CY; c.lineWidth = 2; c.strokeRect(-e, y - r * 0.09 * open - 1, e * 2, r * 0.18 * open + 2);
      if (open > 0.15) { c.fillStyle = ICE; c.fillRect(lx * e * 0.7 - r * 0.1, y - r * 0.05 * open, r * 0.2, r * 0.1 * open); }
    } else if (s.style === "slits") {
      for (let d = -1; d <= 1; d += 2) {
        c.fillStyle = "#000";
        c.beginPath(); c.moveTo(d * (gap - e), y - e * 0.1 + e * 0.5); c.lineTo(d * (gap + e), y - e * (0.72 + m.rage * 0.2)); c.lineTo(d * (gap + e * 0.72), y + e * (0.28 + open * 0.3)); c.closePath(); c.fill();
        c.strokeStyle = CY; c.lineWidth = 2; c.stroke();
        if (open > 0.15) { c.fillStyle = ICE; c.beginPath(); c.arc(d * gap + lx * e * 0.3, y + ly * e * 0.15, e * 0.24 * (1 + m.rage * 0.35), 0, TAU); c.fill(); }
      }
    } else {
      for (let d = -1; d <= 1; d += 2) {
        drawEye(c, d * gap, y, e * (1 + m.attack * 0.1), open * (m.hurt > 0.3 ? 0.45 : 1), lx, ly, m.rage);
        // Brows drop as it gets angrier and lift when it's stunned.
        const dip = (0.42 + m.rage * 0.4 + m.attack * 0.25 - m.hurt * 0.8) * e;
        c.strokeStyle = "#000"; c.lineWidth = Math.max(4, e * 0.55);
        c.beginPath(); c.moveTo(d * (gap + e * 1.15), y - e * 1.05); c.lineTo(d * (gap - e * 1.05), y - e * 1.05 + dip); c.stroke();
        c.strokeStyle = CY; c.lineWidth = Math.max(2, e * 0.26); c.stroke();
      }
    }
    if (!s.mouth) return;
    const w = (s.style === "cyclops" ? e * 1.1 : gap + e * 0.8), my = s.my * r, gape = r * (0.05 + m.mouth * 0.3);
    if (s.mouth === "wail") {
      c.beginPath(); c.ellipse(0, my, w * (0.5 - m.mouth * 0.12), gape, 0, 0, TAU);
      c.fillStyle = "#000"; c.fill(); c.strokeStyle = CY; c.lineWidth = 2; c.stroke();
      return;
    }
    const teeth = 5;
    c.beginPath();
    for (let i = 0; i <= teeth * 2; i++) c.lineTo(-w + (i / (teeth * 2)) * w * 2, my - gape * 0.4 + (i % 2 ? gape * 0.42 : 0));
    for (let i = teeth * 2; i >= 0; i--) c.lineTo(-w + (i / (teeth * 2)) * w * 2, my + gape - (i % 2 ? 0 : gape * 0.42));
    c.closePath();
    c.fillStyle = "#000"; c.fill(); c.strokeStyle = CY; c.lineWidth = Math.max(2, r * 0.035); c.stroke();
  }

  /* ---------- layers behind the body ---------- */
  const LAYERS = {
    spikes(c, r, t, pu, k, h) {
      const n = 8 + (h % 7), sp = (h % 2 ? 1 : -1) * 0.35 * k.speed;
      c.save(); c.rotate(t * sp);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU, in0 = r * 1.2, out = r * (1.42 + pu * 0.22 + k.rage * 0.2 + (i % 2) * 0.14);
        c.beginPath(); c.moveTo(Math.cos(a - 0.09) * in0, Math.sin(a - 0.09) * in0); c.lineTo(Math.cos(a) * out, Math.sin(a) * out); c.lineTo(Math.cos(a + 0.09) * in0, Math.sin(a + 0.09) * in0); c.stroke();
      }
      c.restore();
    },
    tendrils(c, r, t, pu, k, h) {
      const n = 5 + (h % 3);
      for (let i = 0; i < n; i++) {
        const base = (i / n) * TAU + t * 0.1, len = r * (1.65 + pu * 0.2 + k.rage * 0.35);
        c.beginPath();
        for (let q = 0; q <= 7; q++) {
          const u = q / 7, a = base + Math.sin(t * 2.5 * k.speed + i * 1.7 + u * 2.2) * 0.26 * u, d = lerp(r * 0.95, len, u);
          c.lineTo(Math.cos(a) * d, Math.sin(a) * d);
        }
        c.stroke();
      }
    },
    shards(c, r, t, pu, k, h) {
      const n = 4 + (h % 5);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + t * 0.8 * k.speed * (h % 2 ? 1 : -1), d = r * (1.45 + Math.sin(t * 2 + i) * 0.1 + pu * 0.1);
        c.save(); c.translate(Math.cos(a) * d, Math.sin(a) * d); c.rotate(a + t);
        pg(c, h % 3 === 0 ? 3 : 4, r * (0.1 + pu * 0.03), 0); c.stroke();
        c.restore();
      }
    },
    rings(c, r, t, pu, k, h) {
      c.setLineDash([r * 0.34, r * 0.2]);
      c.lineDashOffset = -t * 30 * k.speed;
      c.beginPath(); c.arc(0, 0, r * (1.32 + pu * 0.12), 0, TAU); c.stroke();
      c.lineDashOffset = t * 44 * k.speed;
      c.setLineDash([r * 0.1, r * 0.22]);
      c.beginPath(); c.arc(0, 0, r * (1.58 + pu * 0.18 + k.rage * 0.15), 0, TAU); c.stroke();
      c.setLineDash([]);
      c.lineDashOffset = 0;
    },
    teeth(c, r, t, pu, k, h) {
      const n = 12 + (h % 9), R = r * (1.28 + pu * 0.1);
      c.save(); c.rotate(-t * 0.3 * k.speed);
      c.beginPath();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU, st = TAU / n / 2;
        c.lineTo(Math.cos(a) * R, Math.sin(a) * R); c.lineTo(Math.cos(a + st * 0.4) * R * 1.13, Math.sin(a + st * 0.4) * R * 1.13);
        c.lineTo(Math.cos(a + st) * R * 1.13, Math.sin(a + st) * R * 1.13); c.lineTo(Math.cos(a + st * 1.4) * R, Math.sin(a + st * 1.4) * R);
      }
      c.closePath(); c.stroke();
      c.restore();
    },
    rays(c, r, t, pu, k, h) {
      const n = 14 + (h % 11);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + t * 0.14, wob = 0.5 + 0.5 * Math.sin(t * 3 * k.speed + i * 2.3);
        arm(c, Math.cos(a) * r * 1.22, Math.sin(a) * r * 1.22, Math.cos(a) * r * (1.32 + wob * 0.35 + pu * 0.3), Math.sin(a) * r * (1.32 + wob * 0.35 + pu * 0.3));
      }
    },
    moons(c, r, t, pu, k, h) {
      const n = 2 + (h % 3);
      for (let i = 0; i < n; i++) {
        const a = t * (0.9 - i * 0.2) * k.speed + i * 2, R = r * (1.4 + i * 0.26);
        c.beginPath(); c.ellipse(0, 0, R, R * 0.38, 0.5 * i - 0.4, 0, TAU); c.stroke();
        const co = Math.cos(0.5 * i - 0.4), si = Math.sin(0.5 * i - 0.4), x = Math.cos(a) * R, y = Math.sin(a) * R * 0.38;
        c.beginPath(); c.arc(x * co - y * si, x * si + y * co, r * (0.07 + pu * 0.03), 0, TAU); c.save(); c.globalAlpha = Math.min(1, c.globalAlpha * 2); c.fillStyle = CY; c.fill(); c.restore();
      }
    },
  };
  const LAYER_NAMES = Object.keys(LAYERS);

  function stateOf(b, t) {
    if (!b._life) b._life = { x: b.x, y: b.y, t, vx: 0, vy: 0, trail: [], hash: 0 };
    return b._life;
  }

  function draw(ctx, def, b, t, pu, calm) {
    const inFight = !!(game && b === game.boss), L = stateOf(b, t), r = b.r;
    const h = L.hash || (L.hash = hashOf(def.name));
    const dtf = t - L.t;
    if (dtf > 0.001) {
      L.vx += ((b.x - L.x) / dtf - L.vx) * 0.25;
      L.vy += ((b.y - L.y) / dtf - L.vy) * 0.25;
      L.x = b.x; L.y = b.y; L.t = t;
    }
    const speed = Math.hypot(L.vx, L.vy), base = ctx.globalAlpha;
    const attack = inFight ? clamp((b.attackT || 0) / 0.22, 0, 1) : 0, hurt = b.flash || 0;
    const phases = inFight ? game.wave.phases.length : 1, rage = inFight ? clamp(game.phase / phases, 0, 1) : 0.4;
    const hpf = inFight ? clamp(b.hp / b.maxHp, 0, 1) : 1, form = inFight ? game.wave.form : 2;
    const swell = inFight ? game.moveFlash * 0.06 : 0;

    // Motion trail when it's moving fast.
    if (inFight && !calm) {
      if (speed > 240) { L.trail.push({ x: b.x, y: b.y, age: 0 }); if (L.trail.length > 7) L.trail.shift(); }
      for (let i = L.trail.length - 1; i >= 0; i--) {
        const q = L.trail[i];
        q.age += Math.max(0, dtf);
        if (q.age > 0.28) { L.trail.splice(i, 1); continue; }
        ctx.globalAlpha = base * 0.3 * (1 - q.age / 0.28);
        ctx.strokeStyle = CY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(q.x - b.x, q.y - b.y, r * 0.9, 0, TAU); ctx.stroke();
      }
    }

    // Layers behind the body. They are dim outlines so they never read as something that can hurt you.
    const k = { speed: 1 + rage * 1.1 + attack * 0.4, rage };
    const count = 1 + form + (inFight && game.def.id === "zero" ? 1 : 0);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = CY;
    for (let i = 0; i < count; i++) {
      ctx.globalAlpha = base * (0.24 + rage * 0.08 + (calm ? 0 : pu * 0.08));
      LAYERS[LAYER_NAMES[(h + i * (3 + (h % 3))) % LAYER_NAMES.length]](ctx, r, t, pu, k, h + i);
    }
    ctx.globalAlpha = base;

    ctx.save();
    // Knocked back from a hit, and shaking when it's nearly dead.
    if (inFight && hurt > 0) {
      const a = Math.atan2(b.y - game.player.y, b.x - game.player.x), kick = hurt * r * 0.2;
      ctx.translate(Math.cos(a) * kick, Math.sin(a) * kick);
    }
    if (inFight && !calm && hpf < 0.25) ctx.translate(Math.sin(t * 41) * 2.5, Math.cos(t * 37) * 2.5);
    // Leans into movement, squashes on the kick, breathes between beats.
    ctx.rotate(clamp(L.vx * 0.00045, -0.3, 0.3));
    const breathe = Math.sin(t * 2.1 + h) * 0.015, big = inFight ? 1.14 : 1;
    const stretch = clamp(speed * 0.00016, 0, 0.16), bounce = (calm ? 0.3 : 1) * pu * 0.07;
    ctx.scale(big * (1 + bounce - stretch * 0.5 + breathe + swell + attack * 0.05), big * (1 - bounce * 0.75 + stretch - breathe + swell + attack * 0.05));
    if (!calm) { ctx.shadowColor = CY; ctx.shadowBlur = 22 + rage * 12; }
    // A badly hurt boss flickers like a failing light.
    if (!calm && hpf < 0.4 && fract(Math.sin(Math.floor(t * 14) * 12.9 + h) * 437.5) < (0.4 - hpf) * 1.1) ctx.globalAlpha = base * 0.45;
    ctx.save();
    def.draw(ctx, b, t, pu);
    ctx.restore();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = base;

    // The face.
    const s = faceOf(def);
    if (s) {
      const dx = inFight ? game.player.x - b.x : Math.sin(t * 0.7), dy = inFight ? game.player.y - b.y : Math.cos(t * 0.9) * 0.6, dist = Math.max(1, Math.hypot(dx, dy));
      const lx = inFight ? dx / dist : dx, ly = inFight ? dy / dist : dy;
      const beat = inFight ? game.beat : t * 2;
      const awake = inFight && game.state === "intro" ? clamp((beat - 3) / 1.5, 0, 1) : 1;
      const blinkPhase = fract((t + (h % 11)) / (3.1 + (h % 5) * 0.4));
      const blink = !calm && blinkPhase < 0.035 ? 0.08 : 1;
      const roaring = inFight && game.state === "intro" && beat > 5.5;
      const open = awake * blink * (1 + attack * 0.25) * (hpf < 0.25 && !inFight ? 0.8 : 1);
      const m = { open, attack, hurt, rage: Math.max(rage, 1 - hpf * 1.4), mouth: Math.max(attack, pu * 0.3, hurt * 0.7, roaring ? 1 : 0) };
      const bodies2 = b.parts && b.parts.length > 1 && b.parts[1].main ? b.parts.filter((q) => q.main) : null;
      if (bodies2) bodies2.forEach((q) => { ctx.save(); ctx.translate(q.x - b.x, q.y - b.y); drawFace(ctx, s, r, m, lx, ly); ctx.restore(); });
      else drawFace(ctx, s, r, m, lx, ly);
    }
    ctx.restore();

    // Sparks and smoke come off it as it takes damage.
    if (inFight && !calm && b.alive && hpf < 0.5 && Math.random() < (0.5 - hpf) * 0.8) {
      const a = Math.random() * TAU;
      game.parts.push({ x: b.x + Math.cos(a) * r * 0.8, y: b.y + Math.sin(a) * r * 0.8, vx: Math.cos(a) * 60, vy: -40 - Math.random() * 90, life: 0.5 + Math.random() * 0.5, age: 0, s: 2 + Math.random() * 3 });
    }
    ctx.globalAlpha = base;
    ctx.lineWidth = 1;
  }

  // When it dies, the body itself breaks into wedges that fly apart.
  function shatter(ctx, def, b, t, age, calm) {
    if (age > 1.3 || calm) return;
    const n = 8, life = age / 1.3, r = b.r, h = hashOf(def.name);
    b.flash = 0;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU, mid = (a0 + a1) / 2, spd = 180 + fract(Math.sin(i * 9.3 + h) * 77.1) * 260;
      ctx.save();
      ctx.globalAlpha = (1 - life) * (1 - life);
      ctx.translate(Math.cos(mid) * spd * age, Math.sin(mid) * spd * age + 120 * age * age);
      ctx.rotate((i % 2 ? 1 : -1) * age * (1.5 + (i % 3)));
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 3, a0, a1); ctx.closePath(); ctx.clip();
      ctx.scale(1.14, 1.14);
      def.draw(ctx, b, t, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  return { draw, shatter, BY_ID, BY_LOOK };
})();
