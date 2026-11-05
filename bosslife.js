"use strict";
// Makes every boss feel alive: layered detail, a body that moves with the music, and an animation for every attack.
// All of this is looks only. Hit areas and attacks are decided in the engine and never read from here.
const BossLife = (() => {
  const hashOf = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const fract = (x) => x - Math.floor(x);

  // Which kind of body language each attack pattern gets.
  const STYLE_OF_PAT = {
    rotor: "spin", pinwheel: "spin", spiral: "spin", swirl: "spin", weave: "spin", orbiters: "spin", sprinkler: "spin", flower: "spin",
    blocks: "slam", stack: "slam", halfSlam: "slam", quadrant: "slam", checker: "slam", starfall: "slam", vice: "slam", comb: "slam", domino: "slam",
    aimFan: "cannon", splitShot: "cannon", crossfire: "cannon", corners: "cannon", comet: "cannon", snipe: "cannon", bounceBeam: "cannon", sawblade: "cannon", turrets: "cannon",
    ringPulse: "pulse", ringGap: "pulse", stepBurst: "pulse", formation: "pulse", ripples: "pulse", bouncers: "pulse",
    implode: "implode", well: "implode", noose: "implode", iris: "implode", recall: "implode", boomerang: "implode",
    columns: "split", rows: "split", lattice: "split", rakes: "split", gates: "split", pincer: "split", gapWall: "split", traffic: "split", tide: "split", zipper: "split",
    lightning: "charge", flatline: "charge", sweep: "charge", crosshair: "charge", mirrorfire: "charge",
    charge: "dash", teleBurst: "dash", trail: "dash", footsteps: "dash", echo: "dash",
    blackout: "glitch", searchlight: "glitch", cage: "glitch", mines: "glitch", web: "glitch",
    rain: "hover", cover: "hover", fireworks: "hover", fountain: "hover", gale: "hover", serpentine: "hover", homing: "hover", seeker: "hover", pendulum: "hover", wipers: "hover",
  };
  // The hand-built moves of the original bosses, named directly.
  const STYLE_OF_MOVE = {
    "RING CIRCUIT": "pulse", "WARDLINE": "split", "ARC SNAP": "charge", "LOCKDOWN": "spin",
    "COIL STRIKE": "dash", "VENOM ARC": "cannon", "MOLT": "glitch", "OUROBOROS": "spin",
    "TICK TOCK": "hover", "DOWNBEAT": "slam", "STOP-GO": "pulse", "TIME SIGNATURE": "split",
    "DRONE SWARM": "hover", "HONEYCOMB": "slam", "ROYAL DECREE": "cannon", "HIVE MIND": "spin",
    "MIRROR LANCE": "cannon", "RICOCHET": "pulse", "SWAP": "dash", "PHANTOM STEP": "glitch",
    "ACCRETION": "spin", "SPAGHETTIFY": "spin", "HAWKING SPIT": "implode", "SINGULARITY": "implode",
    "RAMMING SPEED": "dash", "BURNOUT": "dash", "SCRAP CANNON": "cannon", "HIGHWAY": "split",
    "SINE CHOIR": "split", "FEEDBACK": "pulse", "SHATTER NOTE": "charge", "THE SCREAM": "charge",
    "MONOLITH RAIN": "slam", "CRUSHER": "slam", "RUNE LINES": "charge", "ZIGGURAT": "slam",
    "WEB SHOT": "cannon", "FANG VOLLEY": "cannon", "SKITTER": "dash", "COCOON": "implode",
    "BAD SECTOR": "glitch", "TEAR": "split", "BLACKOUT": "glitch", "KERNEL PANIC": "glitch",
    "CORONA": "spin", "SOLAR FLARE": "pulse", "SATELLITES": "spin", "TOTALITY": "implode",
    "SILENCE": "glitch", "FLATLINE": "charge", "FULL SPECTRUM": "split", "LAST WORD": "spin",
  };
  const styleOf = (move) => {
    if (!move) return "idle";
    const name = move.name.split(" // ")[0];
    return STYLE_OF_MOVE[name] || STYLE_OF_PAT[move.pat] || "pulse";
  };
  // Every move gets its own take on its style: which way, how fast, how hard.
  const tuneOf = (move) => {
    const h = hashOf(move ? move.name : "idle");
    return { dir: h % 2 ? 1 : -1, speed: 0.7 + fract(h / 977) * 0.9, power: 0.75 + fract(h / 131) * 0.6, h };
  };

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
    rings(c, r, t, pu, k) {
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

  /* ---------- the effect each style throws out when it fires ---------- */
  function burstFx(c, style, r, f, tune, t, aimA) {
    if (f <= 0.01) return;
    const u = 1 - f, base = c.globalAlpha;
    c.strokeStyle = ICE;
    c.globalAlpha = base * f;
    c.lineWidth = 2 + f * 3;
    if (style === "pulse") {
      c.beginPath(); c.arc(0, 0, r * (1.1 + u * 1.2), 0, TAU); c.stroke();
    } else if (style === "slam") {
      c.beginPath(); c.ellipse(0, r * 1.05, r * (0.8 + u * 1.6), r * (0.18 + u * 0.3), 0, 0, TAU); c.stroke();
      for (let i = -2; i <= 2; i++) arm(c, i * r * 0.45, r * 1.1, i * r * (0.6 + u), r * (1.15 + u * 0.25));
    } else if (style === "cannon") {
      c.save(); c.rotate(aimA);
      c.beginPath(); c.arc(r * 1.1, 0, r * (0.25 + u * 0.4), 0, TAU); c.stroke();
      for (let i = -1; i <= 1; i++) arm(c, r * 1.15, i * r * 0.18, r * (1.5 + u * 0.8), i * r * (0.3 + u * 0.4));
      c.restore();
    } else if (style === "implode") {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU + tune.h, d0 = r * (2.1 - u * 1.1);
        arm(c, Math.cos(a) * d0, Math.sin(a) * d0, Math.cos(a) * d0 * 0.75, Math.sin(a) * d0 * 0.75);
      }
    } else if (style === "spin") {
      const a = t * 8 * tune.dir;
      c.beginPath(); c.arc(0, 0, r * (1.25 + u * 0.4), a, a + 2.2); c.stroke();
      c.beginPath(); c.arc(0, 0, r * (1.25 + u * 0.4), a + PI, a + PI + 2.2); c.stroke();
    } else if (style === "split") {
      arm(c, -r * (1.6 + u), 0, r * (1.6 + u), 0);
      arm(c, 0, -r * (1.6 + u), 0, r * (1.6 + u));
    } else if (style === "charge") {
      // Short sparks jumping off the rim, so the body itself stays readable.
      const tick = Math.floor(t * 18);
      c.lineWidth = 1.5 + f;
      c.strokeStyle = CY;
      for (let i = 0; i < 7; i++) {
        const a0 = fract(Math.sin(i * 9.1 + tick) * 437.5) * TAU;
        let a = a0, x = Math.cos(a0) * r * 1.05, y = Math.sin(a0) * r * 1.05;
        c.beginPath(); c.moveTo(x, y);
        for (let q = 0; q < 3; q++) {
          a = a0 + (fract(Math.sin(q * 3.7 + i + tick) * 91.7) - 0.5) * 1.1;
          x += Math.cos(a) * r * 0.16; y += Math.sin(a) * r * 0.16;
          c.lineTo(x, y);
        }
        c.stroke();
      }
    } else if (style === "dash") {
      for (let i = -2; i <= 2; i++) arm(c, -r * (1.1 + u * 0.6), i * r * 0.28, -r * (2 + u * 1.2), i * r * 0.32);
    } else if (style === "glitch") {
      const tick = Math.floor(t * 24);
      for (let i = 0; i < 4; i++) {
        const y = (fract(Math.sin(i * 5.3 + tick) * 88.1) - 0.5) * r * 2.4;
        c.strokeRect(-r * (1.3 + fract(i * 0.37 + t) * 0.6), y, r * (2.6 + u), 3);
      }
    } else if (style === "hover") {
      c.beginPath(); c.arc(0, r * 0.2, r * (0.9 + u * 0.9), 0.2, PI - 0.2); c.stroke();
    }
    c.globalAlpha = base;
  }

  function stateOf(b, t) {
    if (!b._life) b._life = { x: b.x, y: b.y, t, vx: 0, vy: 0, trail: [], hash: 0, spin: 0, move: null, moveT: t };
    return b._life;
  }

  // The body with its inner detail: a pulsing core of light and a smaller copy of itself turning inside.
  function body(ctx, def, b, t, pu, calm, inner, rage) {
    const base = ctx.globalAlpha, R = b.r * (0.9 + pu * 0.25);
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    core.addColorStop(0, `rgba(${ICE_RGB},${0.35 + pu * 0.3 + rage * 0.15})`);
    core.addColorStop(1, `rgba(${NEON},0)`);
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
    if (!calm) { ctx.shadowColor = CY; ctx.shadowBlur = 22 + rage * 12; }
    ctx.save(); def.draw(ctx, b, t, pu); ctx.restore();
    ctx.shadowBlur = 0;
    ctx.save();
    ctx.globalAlpha = base * 0.28;
    ctx.globalCompositeOperation = "lighter";
    ctx.rotate(inner);
    ctx.scale(0.48, 0.48);
    def.draw(ctx, b, t * 1.7, pu);
    ctx.restore();
    ctx.globalAlpha = base;
  }

  function draw(ctx, def, b, t, pu, calm) {
    const inFight = !!(game && b === game.boss), L = stateOf(b, t), r = b.r;
    const h = L.hash || (L.hash = hashOf(def.name));
    const dtf = Math.max(0, Math.min(0.1, t - L.t));
    if (dtf > 0.0005) {
      L.vx += ((b.x - L.x) / dtf - L.vx) * 0.25;
      L.vy += ((b.y - L.y) / dtf - L.vy) * 0.25;
      L.x = b.x; L.y = b.y; L.t = t;
    }
    const speed = Math.hypot(L.vx, L.vy), base = ctx.globalAlpha;
    const fire = inFight ? clamp((b.attackT || 0) / 0.22, 0, 1) : 0, hurt = b.flash || 0;
    const phases = inFight ? game.wave.phases.length : 1, rage = inFight ? clamp(game.phase / phases, 0, 1) : 0.4;
    const hpf = inFight ? clamp(b.hp / b.maxHp, 0, 1) : 1, form = inFight ? game.wave.form : 2;
    const move = inFight && game.state === "fight" ? game.move : null;
    if (move !== L.move) { L.move = move; L.moveT = t; }
    const style = styleOf(move), tune = tuneOf(move);
    // Ramps in over the first beat of a move, so each attack visibly winds up.
    const into = move ? clamp((t - L.moveT) / B2S(1), 0, 1) : 0;
    const p = inFight ? game.player : { x: b.x + 100, y: b.y + 200 };
    const aimA = Math.atan2(p.y - b.y, p.x - b.x);

    // Motion trail when it's moving fast, longer while it's dashing.
    if (inFight && !calm) {
      const keep = style === "dash" ? 12 : 7;
      if (speed > (style === "dash" ? 120 : 240)) { L.trail.push({ x: b.x, y: b.y, age: 0 }); if (L.trail.length > keep) L.trail.shift(); }
      for (let i = L.trail.length - 1; i >= 0; i--) {
        const q = L.trail[i];
        q.age += dtf;
        if (q.age > 0.28) { L.trail.splice(i, 1); continue; }
        ctx.globalAlpha = base * 0.3 * (1 - q.age / 0.28);
        ctx.strokeStyle = CY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(q.x - b.x, q.y - b.y, r * 0.9, 0, TAU); ctx.stroke();
      }
    }

    // Layers behind the body. Dim outlines, so they never read as something that can hurt you.
    const k = { speed: (1 + rage * 1.1 + fire * 0.4) * (style === "spin" ? 1 + into * 1.5 : 1), rage };
    const count = 1 + form + (inFight && game.def.id === "zero" ? 1 : 0);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = CY;
    for (let i = 0; i < count; i++) {
      ctx.globalAlpha = base * (0.24 + rage * 0.08 + (calm ? 0 : pu * 0.08));
      LAYERS[LAYER_NAMES[(h + i * (3 + (h % 3))) % LAYER_NAMES.length]](ctx, r, t, pu, k, h + i);
    }
    ctx.globalAlpha = base;

    ctx.save();
    if (inFight && hurt > 0) {
      const a = Math.atan2(b.y - p.y, b.x - p.x), kick = hurt * r * 0.2;
      ctx.translate(Math.cos(a) * kick, Math.sin(a) * kick);
    }
    if (inFight && !calm && hpf < 0.25) ctx.translate(Math.sin(t * 41) * 2.5, Math.cos(t * 37) * 2.5);

    // The attack's own body language.
    const P = tune.power * into;
    let sx = 1, sy = 1, rot = 0;
    if (style === "spin") L.spin += dtf * tune.dir * tune.speed * (2 + fire * 6) * into;
    else L.spin *= Math.max(0, 1 - dtf * 3);
    rot += L.spin;
    if (style === "slam") {
      ctx.translate(0, -r * 0.3 * P * (1 - fire) + r * 0.22 * fire * P);
      sx += fire * 0.32 * P; sy -= fire * 0.24 * P;
    } else if (style === "cannon") {
      ctx.translate(-Math.cos(aimA) * r * 0.32 * fire * P, -Math.sin(aimA) * r * 0.32 * fire * P);
      rot += Math.sin(t * 2 * tune.speed) * 0.1 * P;
      sx += fire * 0.12; sy -= fire * 0.1;
    } else if (style === "pulse") {
      const s = 1 + fire * 0.24 * P - (1 - fire) * 0.05 * P * Math.sin(t * 6 * tune.speed);
      sx *= s; sy *= s;
    } else if (style === "implode") {
      const s = 1 - 0.16 * P - fire * 0.12 * P + Math.sin(t * 9 * tune.speed) * 0.03 * P;
      sx *= s; sy *= s; rot += t * 0.6 * tune.dir * P;
    } else if (style === "split") {
      sx += Math.sin(t * 5 * tune.speed) * 0.05 * P;
    } else if (style === "charge") {
      const j = (2 + fire * 7) * P * (calm ? 0.3 : 1);
      ctx.translate((Math.random() - 0.5) * j, (Math.random() - 0.5) * j);
      const s = 1 + 0.06 * P + fire * 0.1; sx *= s; sy *= s;
    } else if (style === "hover") {
      ctx.translate(Math.sin(t * 1.3 * tune.speed) * r * 0.12 * P, -r * 0.18 * P + Math.sin(t * 2.4 * tune.speed) * r * 0.1 * P - fire * r * 0.1);
      rot += Math.sin(t * 1.7 * tune.speed) * 0.12 * P;
    } else if (style === "dash") {
      rot += clamp(L.vx * 0.0008, -0.5, 0.5) * P;
    } else if (style === "glitch" && !calm && fract(Math.sin(Math.floor(t * 12) * 7.7 + tune.h) * 91.3) < 0.18 * P + fire * 0.4) {
      ctx.translate((fract(Math.sin(t * 91) * 13.1) - 0.5) * r * 0.5, 0);
    }

    // Leans into movement, squashes on the kick, breathes between beats.
    rot += clamp(L.vx * 0.00045, -0.3, 0.3);
    const breathe = Math.sin(t * 2.1 + h) * 0.015, big = inFight ? 1.14 : 1;
    const stretch = clamp(speed * 0.00016, 0, style === "dash" ? 0.3 : 0.16), bounce = (calm ? 0.3 : 1) * pu * 0.07;
    ctx.rotate(rot);
    ctx.scale(big * sx * (1 + bounce - stretch * 0.5 + breathe), big * sy * (1 - bounce * 0.75 + stretch - breathe));
    if (!calm && hpf < 0.4 && fract(Math.sin(Math.floor(t * 14) * 12.9 + h) * 437.5) < (0.4 - hpf) * 1.1) ctx.globalAlpha = base * 0.45;

    const inner = t * (0.5 + rage) * (h % 2 ? 1 : -1) + L.spin * 1.5;
    if (style === "split" && P > 0.05) {
      // The body opens down the middle while it lays down lines.
      const open = r * (0.12 + fire * 0.3) * P;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.beginPath(); ctx.rect(side < 0 ? -r * 3 : 0, -r * 3, r * 3, r * 6); ctx.clip();
        ctx.translate(side * open, 0);
        body(ctx, def, b, t, pu, calm, inner, rage);
        ctx.restore();
      }
      ctx.fillStyle = `rgba(${ICE_RGB},${0.5 * P})`;
      ctx.fillRect(-open * 0.6, -r * 1.1, open * 1.2, r * 2.2);
    } else if (style === "glitch" && P > 0.05 && !calm) {
      ctx.save(); ctx.globalAlpha = base * 0.35; ctx.translate(-r * 0.12 * P, 0); def.draw(ctx, b, t, pu); ctx.restore();
      body(ctx, def, b, t, pu, calm, inner, rage);
    } else {
      body(ctx, def, b, t, pu, calm, inner, rage);
    }
    ctx.globalAlpha = base;
    if (!calm) burstFx(ctx, style, r, fire * Math.max(0.3, into), tune, t, aimA - rot);
    ctx.globalAlpha = base;
    ctx.restore();

    // Sparks come off it as it takes damage.
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

  return { draw, shatter, styleOf, tuneOf, STYLE_OF_PAT, STYLE_OF_MOVE };
})();
