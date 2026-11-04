"use strict";
// Draws the arena. Visual rule the whole game follows: hollow means warning, solid means pain.
const FONT = '"Chakra Petch", "Segoe UI", system-ui, sans-serif';
const Render = (() => {
  let cv, c, scale = 1, calm = false;
  const sprites = {};
  let vignette = null;

  function setup(canvas) {
    cv = canvas;
    c = cv.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }
  function resize() {
    const ww = window.innerWidth, wh = window.innerHeight;
    const s = Math.min(ww / W, wh / H);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.style.width = Math.floor(W * s) + "px";
    cv.style.height = Math.floor(H * s) + "px";
    cv.width = Math.floor(W * s * dpr);
    cv.height = Math.floor(H * s * dpr);
    scale = cv.width / W;
    vignette = null;
  }
  function setCalm(v) { calm = v; }
  // Bullet sprites and the vignette are baked in one colour, so a switch throws them away.
  Theme.listeners.push(() => { Object.keys(sprites).forEach((k) => delete sprites[k]); vignette = null; });

  function bulletSprite(r) {
    const key = Math.round(r);
    if (sprites[key]) return sprites[key];
    const pad = key + 12, s = document.createElement("canvas");
    s.width = s.height = pad * 4;
    const x = s.getContext("2d");
    x.scale(2, 2);
    const g = x.createRadialGradient(pad, pad, key * 0.6, pad, pad, pad);
    g.addColorStop(0, `rgba(${NEON},.75)`);
    g.addColorStop(1, `rgba(${NEON},0)`);
    x.fillStyle = g;
    x.fillRect(0, 0, pad * 2, pad * 2);
    x.fillStyle = CY;
    x.beginPath(); x.arc(pad, pad, key, 0, TAU); x.fill();
    x.fillStyle = ICE;
    x.beginPath(); x.arc(pad, pad, key * 0.45, 0, TAU); x.fill();
    return (sprites[key] = { img: s, half: pad });
  }

  function background(t, pu, intensity) {
    c.fillStyle = "#000";
    c.fillRect(0, 0, W, H);
    const size = 80, drift = (t * 24) % size;
    c.strokeStyle = `rgba(${NEON},${0.07 + pu * 0.09 * intensity})`;
    c.lineWidth = 1;
    c.beginPath();
    for (let x = -drift; x <= W; x += size) { c.moveTo(x, 0); c.lineTo(x, H); }
    for (let y = -drift; y <= H; y += size) { c.moveTo(0, y); c.lineTo(W, y); }
    c.stroke();
    if (!vignette) {
      vignette = c.createRadialGradient(W / 2, H / 2, 240, W / 2, H / 2, 780);
      vignette.addColorStop(0, `rgba(${NEON},.06)`);
      vignette.addColorStop(1, "rgba(0,0,0,0)");
    }
    c.fillStyle = vignette;
    c.fillRect(0, 0, W, H);
  }

  function dashed(on) { c.setLineDash(on ? [12, 9] : []); }

  function drawHazards(g) {
    // Telegraphs and big shapes first so bullets always sit on top of them.
    for (const h of g.hz) {
      if (h.k === "z") {
        c.fillStyle = `rgba(${NEON},.07)`;
        c.strokeStyle = `rgba(${NEON},.3)`;
        c.lineWidth = 1;
        c.beginPath(); c.arc(h.x, h.y, h.r, 0, TAU); c.fill(); c.stroke();
        c.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * PI;
          c.moveTo(h.x - Math.cos(a) * h.r, h.y - Math.sin(a) * h.r);
          c.lineTo(h.x + Math.cos(a) * h.r, h.y + Math.sin(a) * h.r);
        }
        c.stroke();
      } else if (h.k === "s") drawSafeZone(h);
      else if (h.k === "w") drawWall(h);
      else if (h.k === "c") drawBlast(h);
      else if (h.k === "l") drawBeam(h);
    }
    for (const h of g.hz) {
      if (h.k === "r") drawRing(h);
    }
    c.globalCompositeOperation = "lighter";
    for (const h of g.hz) {
      if (h.k !== "b") continue;
      const sp = bulletSprite(h.r);
      if (h.wait > 0 && h.splitAt) {
        // Mines blink faster the closer they are to popping.
        const u = h.age / h.splitAt;
        c.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(u * u * 26));
      }
      c.drawImage(sp.img, h.x - sp.half, h.y - sp.half, sp.half * 2, sp.half * 2);
      c.globalAlpha = 1;
    }
    c.globalCompositeOperation = "source-over";
  }

  function teleU(h) { return h.tele > 0 ? clamp(h.age / h.tele, 0, 1) : 1; }

  function drawBeam(h) {
    const x2 = h.x + Math.cos(h.a) * h.len, y2 = h.y + Math.sin(h.a) * h.len;
    const line = (w) => { c.lineWidth = w; c.beginPath(); c.moveTo(h.x, h.y); c.lineTo(x2, y2); c.stroke(); };
    if (!h.on) {
      const u = teleU(h);
      c.strokeStyle = `rgba(${NEON},${0.1 + u * 0.22})`;
      line(h.w * u);
      c.strokeStyle = `rgba(${NEON},${0.35 + u * 0.55})`;
      dashed(true); line(1.5); dashed(false);
    } else if (!h.ghost) {
      const left = h.live > 0 ? 1 - clamp((h.age - h.tele) / h.live, 0, 1) : 0;
      const w = h.w * (left < 0.2 ? left / 0.2 : 1);
      c.strokeStyle = `rgba(${NEON},.22)`; line(w + 18);
      c.strokeStyle = CY; line(w);
      c.strokeStyle = ICE; line(w * 0.35);
    }
  }
  function drawWall(h) {
    if (!h.on) {
      const u = teleU(h);
      c.fillStyle = `rgba(${NEON},${0.03 + u * 0.13})`;
      c.fillRect(h.x, h.y, h.w, h.h);
      c.strokeStyle = `rgba(${NEON},${0.35 + u * 0.55})`;
      c.lineWidth = 2;
      dashed(true); c.strokeRect(h.x, h.y, h.w, h.h); dashed(false);
    } else if (!h.ghost) {
      c.fillStyle = CY;
      c.fillRect(h.x, h.y, h.w, h.h);
      c.strokeStyle = ICE;
      c.lineWidth = 3;
      c.strokeRect(h.x, h.y, h.w, h.h);
    }
  }
  function drawBlast(h) {
    c.beginPath(); c.arc(h.x, h.y, h.r, 0, TAU);
    if (!h.on) {
      const u = teleU(h);
      c.fillStyle = `rgba(${NEON},${0.03 + u * 0.13})`;
      c.fill();
      c.strokeStyle = `rgba(${NEON},${0.4 + u * 0.5})`;
      c.lineWidth = 2;
      dashed(true); c.stroke(); dashed(false);
      c.beginPath(); c.arc(h.x, h.y, h.r * u, 0, TAU);
      c.lineWidth = 2;
      c.strokeStyle = `rgba(${ICE_RGB},${0.25 + u * 0.5})`;
      c.stroke();
    } else if (!h.ghost) {
      c.fillStyle = CY; c.fill();
      c.strokeStyle = ICE; c.lineWidth = 3; c.stroke();
    }
  }
  function drawRing(h) {
    c.lineWidth = h.th;
    c.strokeStyle = CY;
    const gaps = h.gaps.map((g) => [g.a - g.w / 2, g.a + g.w / 2]).sort((a, b) => a[0] - b[0]);
    if (!gaps.length) { c.beginPath(); c.arc(h.x, h.y, Math.max(0, h.r), 0, TAU); c.stroke(); return; }
    for (let i = 0; i < gaps.length; i++) {
      const s = gaps[i][1], e = i + 1 < gaps.length ? gaps[i + 1][0] : gaps[0][0] + TAU;
      if (e <= s) continue;
      c.beginPath(); c.arc(h.x, h.y, Math.max(0, h.r), s, e); c.stroke();
    }
  }
  function drawSafeZone(h) {
    if (!h.on) {
      c.strokeStyle = `rgba(${ICE_RGB},${0.5 + teleU(h) * 0.5})`;
      c.lineWidth = 3;
      dashed(true);
      c.beginPath(); c.arc(h.x, h.y, h.r, 0, TAU); c.stroke();
      dashed(false);
      c.fillStyle = `rgba(${NEON},${teleU(h) * 0.13})`;
      c.beginPath(); c.rect(0, 0, W, H); c.arc(h.x, h.y, h.r, 0, TAU, true); c.fill();
    } else {
      c.fillStyle = `rgba(${NEON},.82)`;
      c.beginPath(); c.rect(0, 0, W, H); c.arc(h.x, h.y, h.r, 0, TAU, true); c.fill();
      c.strokeStyle = ICE; c.lineWidth = 4;
      c.beginPath(); c.arc(h.x, h.y, h.r, 0, TAU); c.stroke();
    }
  }

  function drawBossDef(ctx, def, b, t, pu) {
    if (!calm) { ctx.shadowColor = CY; ctx.shadowBlur = 22; }
    def.draw(ctx, b, t, pu);
    ctx.shadowBlur = 0;
  }

  function drawPlayer(g) {
    const p = g.player;
    if (!p.alive) return;
    const weapon = WEAPONS[p.weapon];
    const inRange = !weapon.ranged && g.boss.alive && g.boss.parts.some((q) => q.hit !== false && Math.hypot(q.x - p.x, q.y - p.y) - q.r < STRIKE_R);
    c.strokeStyle = inRange ? `rgba(${ICE_RGB},.75)` : `rgba(${NEON},.14)`;
    c.lineWidth = inRange ? 2 : 1;
    if (!weapon.ranged) { c.beginPath(); c.arc(p.x, p.y, STRIKE_R, 0, TAU); c.stroke(); }
    if (p.windup > 0) {
      // Heavy Slam winding up: the ring closes in, and the slam lands as it reaches you.
      c.strokeStyle = ICE; c.lineWidth = 4;
      c.beginPath(); c.arc(p.x, p.y, lerp(16, STRIKE_R, p.windup / weapon.windup), 0, TAU); c.stroke();
    }

    if (p.dashCd > 0) {
      c.strokeStyle = CY; c.lineWidth = 3;
      c.beginPath(); c.arc(p.x, p.y, 21, -PI / 2, -PI / 2 + TAU * (1 - p.dashCd / DASH_CD)); c.stroke();
    }
    if (p.inv > 0 && p.dashI <= 0 && Math.floor(g.t * 16) % 2 === 0) return;
    c.save();
    c.translate(p.x, p.y);
    c.rotate(PI / 4 + p.tilt);
    if (!calm) { c.shadowColor = "#fff"; c.shadowBlur = 18; }
    // The black gap keeps the player readable when standing on top of solid cyan.
    c.fillStyle = "#000"; c.fillRect(-14, -14, 28, 28);
    c.shadowBlur = 0;
    c.fillStyle = "#fff"; c.fillRect(-10, -10, 20, 20);
    if (p.dashI > 0) { c.strokeStyle = ICE; c.lineWidth = 2; c.strokeRect(-17, -17, 34, 34); }
    c.restore();
    for (let i = 0; i < p.charge; i++) {
      const a = g.t * 3 + (i / MAX_CHARGE) * TAU;
      c.fillStyle = ICE;
      c.beginPath(); c.arc(p.x + Math.cos(a) * 30, p.y + Math.sin(a) * 30, 4.5, 0, TAU); c.fill();
    }
  }

  function drawFx(g) {
    for (const o of g.orbs) {
      c.fillStyle = ICE;
      c.beginPath(); c.arc(o.x, o.y, o.surge ? 11 : 7, 0, TAU); c.fill();
      c.strokeStyle = CY; c.lineWidth = 2;
      c.beginPath(); c.arc(o.x, o.y, o.surge ? 16 : 11, 0, TAU); c.stroke();
    }
    for (const r of g.rings) {
      const u = r.age / r.life, rad = lerp(r.r, r.to, 1 - (1 - u) * (1 - u));
      c.strokeStyle = `rgba(${ICE_RGB},${(1 - u) * 0.85})`;
      c.lineWidth = r.w * (1 - u) + 0.5;
      c.beginPath(); c.arc(r.x, r.y, rad, 0, TAU); c.stroke();
    }
    c.fillStyle = CY;
    for (const q of g.parts) {
      c.globalAlpha = 1 - q.age / q.life;
      c.fillRect(q.x - q.s / 2, q.y - q.s / 2, q.s, q.s);
    }
    c.globalAlpha = 1;
    c.textAlign = "center";
    for (const f of g.floats) {
      c.globalAlpha = 1 - f.age / f.life;
      c.fillStyle = ICE;
      c.font = `700 ${Math.round(16 + f.size * 18)}px ${FONT}`;
      c.fillText(f.text, f.x, f.y - f.age * 44);
    }
    c.globalAlpha = 1;
  }

  function hud(g, pu) {
    const b = g.boss, barW = 760, x0 = (W - barW) / 2, y0 = 34;
    // Black plates so the HUD stays readable when an attack floods the arena with solid cyan.
    c.fillStyle = "rgba(0,0,0,.78)";
    c.fillRect(x0 - 14, 3, barW + 28, y0 + 23);
    c.fillRect(6, H - 54, 28 + g.player.maxHp * 30 + 290, 48);
    c.fillRect(W - 112, H - 62, 106, 56);
    c.textBaseline = "alphabetic";
    c.textAlign = "left";
    c.font = `700 22px ${FONT}`;
    c.fillStyle = CY;
    c.fillText(g.def.name, x0, y0 - 9);
    c.textAlign = "right";
    c.font = `500 15px ${FONT}`;
    c.fillStyle = `rgba(${NEON},.8)`;
    c.fillText(`WAVE ${String(g.n).padStart(2, "0")}  //  ${g.wave.label}`, x0 + barW, y0 - 10);
    c.strokeStyle = CY; c.lineWidth = 2;
    c.strokeRect(x0, y0, barW, 16);
    const frac = clamp(b.hp / b.maxHp, 0, 1);
    c.fillStyle = b.flash > 0 ? "#fff" : CY;
    c.fillRect(x0 + 3, y0 + 3, (barW - 6) * frac, 10);
    c.fillStyle = "#000";
    g.wave.phases.forEach((f) => c.fillRect(x0 + barW * f - 1.5, y0, 3, 16));

    if (g.state === "fight" && g.move) {
      c.textAlign = "center";
      const big = g.moveFlash;
      c.font = `700 ${Math.round(17 + big * 14)}px ${FONT}`;
      // Black outline keeps the name readable when a boss or attack is right behind it.
      c.strokeStyle = "#000";
      c.lineWidth = 6;
      c.lineJoin = "round";
      c.strokeText(g.move.name, W / 2, y0 + 44 + big * 6);
      c.fillStyle = `rgba(${ICE_RGB},${0.7 + big * 0.3})`;
      c.fillText(g.move.name, W / 2, y0 + 44 + big * 6);
    }

    const p = g.player;
    c.textAlign = "left";
    for (let i = 0; i < p.maxHp; i++) {
      const x = 28 + i * 30, y = H - 30;
      c.save();
      c.translate(x, y);
      c.rotate(PI / 4);
      if (i < p.hp) { c.fillStyle = "#fff"; c.fillRect(-8, -8, 16, 16); }
      else { c.strokeStyle = `rgba(${NEON},.45)`; c.lineWidth = 2; c.strokeRect(-8, -8, 16, 16); }
      c.restore();
    }
    const sx = 28 + p.maxHp * 30 + 20;
    c.font = `600 13px ${FONT}`;
    c.fillStyle = p.charge ? ICE : `rgba(${NEON},.55)`;
    c.fillText("SURGE", sx, H - 25);
    for (let i = 0; i < MAX_CHARGE; i++) {
      const x = sx + 62 + i * 18;
      c.beginPath(); c.arc(x, H - 30, 6, 0, TAU);
      if (i < p.charge) { c.fillStyle = ICE; c.fill(); }
      else { c.strokeStyle = `rgba(${NEON},.45)`; c.lineWidth = 1.5; c.stroke(); }
    }
    c.font = `700 14px ${FONT}`;
    c.fillStyle = ICE;
    c.fillText(WEAPONS[p.weapon].name, sx + 132, H - 25);
    // Beat lamp: strike when this flashes for double damage.
    const lx = W - 44, ly = H - 34;
    c.beginPath(); c.arc(lx, ly, 10 + pu * 9, 0, TAU);
    c.fillStyle = `rgba(${NEON},${0.2 + pu * 0.8})`;
    c.fill();
    c.textAlign = "right";
    c.font = `600 13px ${FONT}`;
    c.fillStyle = `rgba(${NEON},.7)`;
    c.fillText("BEAT", lx - 26, ly + 5);

    if (g.phaseFlash > 0) {
      c.textAlign = "center";
      c.globalAlpha = Math.min(1, g.phaseFlash * 1.5);
      c.fillStyle = "#fff";
      c.font = `700 62px ${FONT}`;
      c.fillText(`PHASE ${g.phase + 1}`, W / 2, H / 2 - 10);
      c.font = `500 20px ${FONT}`;
      c.fillStyle = CY;
      c.fillText("BOSS ARMORED  //  +1 HEALTH", W / 2, H / 2 + 24);
      c.globalAlpha = 1;
    }
    if (g.n === 1 && p.weapon === "pulse" && g.state === "fight" && g.t - g.fightStart < 14) hints(g);
  }

  function hints(g) {
    c.textAlign = "center";
    c.font = `500 18px ${FONT}`;
    c.fillStyle = ICE;
    const touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    c.fillText(
      touch ? "Get close and tap HIT when the ring lights up.  Tap DODGE to pass through danger."
        : "Get close and press J when the ring lights up.  Press SPACE to dodge through danger.",
      W / 2, H - 76,
    );
  }

  function intro(g) {
    const u = g.beat / INTRO_BEATS;
    const alpha = clamp(Math.min(u * 6, (1 - u) * 4), 0, 1);
    c.globalAlpha = alpha;
    c.textAlign = "center";
    c.font = `600 22px ${FONT}`;
    c.fillStyle = CY;
    c.fillText(`WAVE ${String(g.n).padStart(2, "0")}  //  ${g.wave.label}`, W / 2, H / 2 + 30);
    c.font = `700 84px ${FONT}`;
    c.fillStyle = "#fff";
    c.fillText(g.def.name, W / 2, H / 2 + 112);
    c.font = `500 22px ${FONT}`;
    c.fillStyle = ICE;
    c.fillText(g.def.title, W / 2, H / 2 + 150);
    c.globalAlpha = 1;
    const left = Math.ceil(INTRO_BEATS - g.beat);
    if (left <= 3) {
      c.fillStyle = CY;
      c.font = `700 40px ${FONT}`;
      c.fillText(String(left), W / 2, H - 44);
    }
  }

  function frame(g) {
    const pu = Math.pow(1 - (g.beat % 1), 3);
    c.setTransform(scale, 0, 0, scale, 0, 0);
    c.save();
    if (g.shake > 0 && !calm) {
      c.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
    }
    background(g.t, calm ? pu * 0.3 : pu, g.state === "intro" ? 0.5 : 1);
    drawHazards(g);
    if (g.boss.alive) {
      c.save();
      c.translate(g.boss.x, g.boss.y);
      const armored = g.boss.armor > g.t;
      if (armored) c.globalAlpha = 0.55;
      drawBossDef(c, g.def, g.boss, g.t, pu);
      c.restore();
      if (armored) {
        c.strokeStyle = ICE; c.lineWidth = 2;
        c.beginPath(); c.arc(g.boss.x, g.boss.y, g.boss.r * 1.65, 0, TAU); c.stroke();
      }
    }
    drawPlayer(g);
    drawFx(g);
    if (g.dark > 0) darkness(g, pu);
    c.restore();
    if (g.flash > 0 && !calm) {
      c.fillStyle = `rgba(${NEON},${g.flash * 0.3})`;
      c.fillRect(0, 0, W, H);
    }
    hud(g, pu);
    if (g.state === "intro") intro(g);
    // Letterbox rim, brightest on the kick.
    c.strokeStyle = `rgba(${NEON},${0.35 + (calm ? 0 : pu * 0.5)})`;
    c.lineWidth = 3;
    c.strokeRect(1.5, 1.5, W - 3, H - 3);
  }

  // Only a circle around the player stays lit; the beat briefly opens it so nothing is truly unseen.
  function darkness(g, pu) {
    const p = g.player;
    const rad = 215 + pu * 130;
    const gr = c.createRadialGradient(p.x, p.y, rad * 0.62, p.x, p.y, rad);
    gr.addColorStop(0, "rgba(0,0,0,0)");
    gr.addColorStop(1, "rgba(0,0,0,.97)");
    c.fillStyle = gr;
    c.fillRect(-40, -40, W + 80, H + 80);
  }

  // Backdrop for the menus: a boss drifting behind the grid in time with the menu music.
  function menu(t, beat, def, previewBoss) {
    const pu = Math.pow(1 - (beat % 1), 3);
    c.setTransform(scale, 0, 0, scale, 0, 0);
    background(t, calm ? pu * 0.3 : pu, 0.7);
    if (def) {
      c.save();
      c.globalAlpha = 0.28;
      c.translate(W * 0.73 + Math.sin(t * 0.4) * 30, H * 0.5 + Math.cos(t * 0.5) * 20);
      c.scale(2.7, 2.7);
      drawBossDef(c, def, previewBoss, t, pu);
      c.restore();
      c.globalAlpha = 1;
    }
  }

  function preview(canvas, def, t, pu) {
    const x = canvas.getContext("2d");
    const d = canvas.width;
    x.clearRect(0, 0, d, d);
    x.save();
    x.translate(d / 2, d / 2);
    const fit = (d * 0.3) / def.r;
    x.scale(fit, fit);
    drawBossDef(x, def, { x: 0, y: 0, r: def.r, flash: 0, parts: [], heading: 0 }, t, pu);
    x.restore();
    x.shadowBlur = 0;
  }

  return { setup, setCalm, frame, menu, preview, resize };
})();
