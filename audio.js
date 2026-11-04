"use strict";
// Everything you hear is synthesized here. The song itself is written by Composer in music.js;
// this plays it through a mixing desk of channels, reverb, stereo echo and a kick-driven pump.
const Sound = (() => {
  let G = null, track = null, nextStep = 0;
  const vol = { music: 0.7, sfx: 0.8 };
  const lastSfx = {};

  function reverbImpulse(ctx, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const u = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - u, 3.2) * (u < 0.002 ? u / 0.002 : 1);
      }
    }
    return buf;
  }

  function graph(ctx) {
    const g = { ctx };
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.ratio.value = 4; comp.attack.value = 0.006; comp.release.value = 0.16;
    // A gentle clip after the compressor keeps sudden stacks from crackling.
    const clip = ctx.createWaveShaper(), curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = (i / 511.5) - 1; curve[i] = Math.tanh(x * 1.15) / Math.tanh(1.15); }
    clip.curve = curve; clip.oversample = "2x";
    comp.connect(clip); clip.connect(ctx.destination);
    g.master = ctx.createGain(); g.master.gain.value = 0.78; g.master.connect(comp);
    g.music = ctx.createGain(); g.music.gain.value = vol.music; g.music.connect(g.master);
    g.fx = ctx.createGain(); g.fx.gain.value = vol.sfx; g.fx.connect(g.master);
    // Melodic parts duck under each kick, which is what makes the mix breathe.
    // The song fader is what gives sections their huge quiet-to-loud range.
    g.song = ctx.createGain(); g.song.connect(g.music);
    g.pump = ctx.createGain(); g.pump.connect(g.song);

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    g.noise = noiseBuf;

    g.revIn = ctx.createGain();
    const rev = ctx.createConvolver(); rev.buffer = reverbImpulse(ctx, 1.9);
    const revOut = ctx.createGain(); revOut.gain.value = 0.55;
    g.revIn.connect(rev); rev.connect(revOut); revOut.connect(g.pump);

    g.echoIn = ctx.createGain();
    g.dL = ctx.createDelay(2); g.dR = ctx.createDelay(2);
    const fb = ctx.createGain(); fb.gain.value = 0.42;
    const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 3200;
    const wet = ctx.createGain(); wet.gain.value = 0.6;
    g.echoIn.connect(g.dL); g.dL.connect(tone); tone.connect(g.dR); g.dR.connect(fb); fb.connect(g.dL);
    const panner = (p, dest) => {
      if (!ctx.createStereoPanner) return dest;
      const s = ctx.createStereoPanner(); s.pan.value = p; s.connect(dest); return s;
    };
    g.dL.connect(panner(-0.75, wet)); g.dR.connect(panner(0.75, wet));
    wet.connect(g.pump);

    const ch = (level, pan, revSend, echoSend, bus) => {
      const c = ctx.createGain(); c.gain.value = level;
      c.connect(pan ? panner(pan, bus) : bus);
      if (revSend) { const s = ctx.createGain(); s.gain.value = revSend; c.connect(s); s.connect(g.revIn); }
      if (echoSend) { const s = ctx.createGain(); s.gain.value = echoSend; c.connect(s); s.connect(g.echoIn); }
      return c;
    };
    g.ch = {
      kick: ch(0.72, 0, 0, 0, g.song), tick: ch(0.28, 0, 0, 0, g.song),
      snare: ch(1, 0, 0.28, 0, g.song), ghost: ch(0.6, -0.12, 0.12, 0, g.song),
      hat: ch(0.7, 0.22, 0, 0, g.song), ride: ch(0.45, -0.3, 0.1, 0, g.song),
      tomL: ch(0.7, -0.35, 0.18, 0, g.song), tomR: ch(0.7, 0.35, 0.18, 0, g.song),
      sub: ch(0.46, 0, 0, 0, g.pump), bass: ch(0.4, 0, 0, 0, g.pump),
      padL: ch(0.17, -0.7, 0.55, 0, g.pump), padR: ch(0.17, 0.7, 0.55, 0, g.pump),
      arpL: ch(0.5, -0.5, 0.14, 0.3, g.pump), arpR: ch(0.5, 0.5, 0.14, 0.3, g.pump),
      lead: ch(0.75, 0, 0.36, 0.32, g.pump), wideL: ch(0.3, -0.75, 0.3, 0.2, g.pump), wideR: ch(0.3, 0.75, 0.3, 0.2, g.pump),
      counter: ch(0.26, -0.3, 0.42, 0.18, g.pump),
      stabL: ch(0.17, -0.4, 0.14, 0.05, g.pump), stabR: ch(0.17, 0.4, 0.14, 0.05, g.pump),
      swell: ch(0.5, 0, 0.4, 0, g.music), boom: ch(0.9, 0, 0.35, 0, g.music),
    };
    return g;
  }

  function init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (G) { if (G.ctx.state === "suspended") G.ctx.resume(); return; }
    G = graph(new AC());
    applyEcho();
  }
  function applyEcho() {
    if (!G || !track) return;
    const t = Math.min(1.9, (60 / track.bpm) * track.delayBeats);
    G.dL.delayTime.value = t;
    G.dR.delayTime.value = t;
  }
  function setVolumes(m, s) {
    vol.music = m; vol.sfx = s;
    if (G) { G.music.gain.value = m; G.fx.gain.value = s; }
  }
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // One synth voice: oscillator, optional sweeping filter, and a volume shape with a held middle.
  function voice(dest, type, f, t, dur, v, o = {}) {
    const ctx = G.ctx, osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type;
    // A small scoop up into the note is what makes a chip lead feel played rather than typed.
    if (o.from) { osc.frequency.setValueAtTime(o.from, t); osc.frequency.exponentialRampToValueAtTime(f, t + 0.16); }
    else if (o.scoop) { osc.frequency.setValueAtTime(f * 0.97, t); osc.frequency.exponentialRampToValueAtTime(f, t + o.scoop); }
    else osc.frequency.setValueAtTime(f, t);
    if (o.det) osc.detune.value = o.det;
    if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + (o.toT || dur));
    const a = o.a || 0.004, end = t + Math.max(dur, a + 0.01);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + a);
    if (o.hold) g.gain.setValueAtTime(v, Math.max(t + a, end - (o.r || 0.12)));
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    let last = osc;
    if (o.cut) {
      const fl = ctx.createBiquadFilter();
      fl.type = "lowpass"; fl.Q.value = o.q || 2;
      fl.frequency.setValueAtTime(o.cut, t);
      if (o.cutTo) fl.frequency.exponentialRampToValueAtTime(Math.max(60, o.cutTo), t + (o.cutT || dur));
      osc.connect(fl); last = fl;
    }
    last.connect(g); g.connect(dest);
    osc.start(t); osc.stop(end + 0.02);
  }
  function burstNoise(dest, t, dur, v, freq, type, o = {}) {
    const ctx = G.ctx, s = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    s.buffer = G.noise; fl.type = type; fl.frequency.setValueAtTime(freq, t);
    if (o.q) fl.Q.value = o.q;
    if (o.to) fl.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    if (o.rise) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.03); }
    else { g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
    s.connect(fl); fl.connect(g); g.connect(dest);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  function kick(k, t, v) {
    voice(G.ch.kick, "sine", k.kickF, t, k.kickD, v, { to: 42, toT: k.kickD * 0.6 });
    burstNoise(G.ch.kick, t, 0.018, 0.22 * v, 3000, "highpass");
    // Duck everything melodic for the length of the kick.
    const dip = G.pump.gain, stepT = 60 / track.bpm / 4;
    dip.setValueAtTime(0.5, t);
    dip.linearRampToValueAtTime(1, t + Math.min(0.26, stepT * 2.2));
  }
  function snare(k, t, v, dest) {
    burstNoise(dest, t, 0.17, 0.55 * v, k.snareF, "bandpass", { q: 0.8 });
    voice(dest, "triangle", 215, t, 0.09, 0.34 * v, { to: 130 });
    if (k.clap) [0.012, 0.024].forEach((d) => burstNoise(dest, t + d, 0.05, 0.28 * v, 1800, "bandpass", { q: 1.4 }));
  }

  function playStep(step, t0, level, T) {
    const bar = Math.floor(step / 16) + (T.shift || 0), n = T.bars.length;
    const B = T.bars[bar < n ? bar : T.loopStart + ((bar - T.loopStart) % (n - T.loopStart))];
    const s = step % 16, stepT = 60 / T.bpm / 4, t = t0 + (s % 2 ? T.swing * stepT : 0), P = T.patch, C = G.ch;

    if (s === 0) {
      // Quiet sections stay quiet, and the drop arrives all at once.
      const song = G.song.gain;
      if (B.impact) song.setValueAtTime(B.gain, t);
      else song.setTargetAtTime(B.gain, t, 0.35);
      if (B.drone) voice(C.sub, "sine", mtof(B.drone) / 2, t, stepT * 16, 0.8, { a: 0.12, hold: true, r: 0.2 });
    }
    if (B.kick[s]) kick(P.kit, t, B.kick[s] * 0.95);
    else if (s % 4 === 0 && B.kind !== "break") voice(C.tick, "sine", 95, t, 0.09, 0.7, { to: 55 });
    if (B.snare[s]) snare(P.kit, t, B.snare[s], C.snare);
    if (level >= 3 && B.ghost[s]) snare(P.kit, t, B.ghost[s], C.ghost);
    if (B.hat[s]) burstNoise(C.hat, t, 0.035, 0.2 * B.hat[s], P.kit.hatF, "highpass");
    if (level >= 3 && B.open[s]) burstNoise(C.hat, t, 0.17, 0.17, P.kit.hatF * 0.9, "highpass");
    if (level >= 3 && B.ride[s]) burstNoise(C.ride, t, 0.28, 0.16 * B.ride[s], 6000, "bandpass", { q: 3 });
    if (B.tom[s] !== null) voice(s % 2 ? C.tomR : C.tomL, "sine", 95 + B.tom[s] * 42, t, 0.2, 0.55, { to: 60 + B.tom[s] * 20 });

    if (s === 0 && B.crash && level >= 2) burstNoise(C.ride, t, 1.1, 0.5, 5200, "highpass");
    if (s === 0 && B.impact) {
      voice(C.boom, "sine", 88, t, 0.75, 0.75, { to: 30 });
      burstNoise(C.boom, t, 0.55, 0.3, 700, "lowpass");
    }
    if (s === 0 && B.riser && level >= 2) {
      burstNoise(C.swell, t, stepT * 16, 0.5, 400, "bandpass", { rise: true, to: 7000, q: 1.5 });
    }

    const b = B.bass[s];
    if (b) {
      const f = mtof(b.m), dur = stepT * b.l * 0.95, cutT = Math.max(0.1, dur * 0.7);
      const open = 280 + B.progress * 260 + level * 130 + (B.kind === "drop" ? 500 : 0);
      voice(C.sub, "sine", f / (b.m >= 48 ? 4 : 2), t, dur, 0.9 * b.v, { hold: true, r: 0.03 });
      if (P.bass === "reese") {
        voice(C.bass, "sawtooth", f, t, dur, 0.62 * b.v, { det: -11, cut: open * 1.5, cutTo: open * 0.8, cutT, q: 3, hold: true, r: 0.03 });
        voice(C.bass, "sawtooth", f, t, dur, 0.62 * b.v, { det: 11, cut: open * 1.5, cutTo: open * 0.8, cutT, q: 3, hold: true, r: 0.03 });
      } else if (P.bass === "square") {
        voice(C.bass, "square", f, t, dur, 0.62 * b.v, { cut: open * 1.7, cutTo: open * 0.6, cutT, q: 5 });
      } else if (P.bass === "pluck") {
        voice(C.bass, "sawtooth", f * 2, t, Math.min(dur, 0.2), 0.75 * b.v, { cut: open * 3, cutTo: 200, cutT: 0.14, q: 7 });
      } else {
        voice(C.bass, "sawtooth", f, t, dur, 0.75 * b.v, { cut: open * 2, cutTo: open * 0.6, cutT, q: 7 });
      }
    }

    if (B.pad && s === 0 && !B.gap) {
      const dur = stepT * 16 * B.pad.bars, cut = P.pad.cut * (B.kind === "break" ? 1.4 : 1) + B.progress * 600 + level * 110;
      B.pad.notes.forEach((m, i) => {
        const f = mtof(m), opt = { a: 0.14, hold: true, r: 0.25, cut, cutTo: cut * 1.5, q: 1.2 };
        voice(C.padL, P.pad.wave, f, t, dur, 0.4, Object.assign({ det: -P.pad.det - i }, opt));
        voice(C.padR, P.pad.wave, f, t, dur, 0.4, Object.assign({ det: P.pad.det + i }, opt));
      });
    }

    const a = B.arp[s];
    if (a && level >= 2 && B.kind !== "intro") {
      const cut = P.arp.cut * (0.65 + B.progress * 0.8) * (B.kind === "break" ? 0.7 : 1);
      voice(a.pan ? C.arpR : C.arpL, P.arp.wave, mtof(a.m), t, P.arp.dec, 0.52 * a.v, { cut, cutTo: 400, cutT: P.arp.dec, q: 3 });
    }

    const H = B.stab[s];
    if (H && level >= 3) {
      const dur = stepT * 1.7, cut = P.stab.cut + B.progress * 500 + (B.kind === "drop" ? 400 : 0);
      H.notes.forEach((m, i) => {
        const f = mtof(m);
        voice(C.stabL, P.stab.wave, f, t, dur, 0.5 * H.v, { det: -7 - i * 2, cut: cut * 1.6, cutTo: cut * 0.5, cutT: dur, q: 3 });
        voice(C.stabR, P.stab.wave, f, t, dur, 0.5 * H.v, { det: 7 + i * 2, cut: cut * 1.6, cutTo: cut * 0.5, cutT: dur, q: 3 });
      });
    }

    const L = B.lead[s];
    if (L && level >= 3) {
      const dur = stepT * L.l, f = mtof(L.m), opt = { a: P.lead.a, hold: true, r: 0.09, cut: P.lead.cut, cutTo: P.lead.cut * 0.55, cutT: dur, q: 2, scoop: 0.025 };
      // Long notes slide in from the last one, like a voice instead of a keyboard.
      if (L.glide && T.lastLead) opt.from = T.lastLead;
      T.lastLead = f;
      voice(C.lead, P.lead.wave, f, t, dur, 0.58 * L.v, Object.assign({ det: -P.lead.det * 0.4 }, opt));
      voice(C.lead, P.lead.wave, f, t, dur, 0.5 * L.v, Object.assign({ det: P.lead.det * 0.4 }, opt));
      if (level >= 5 || B.kind === "drop") {
        // The big sections get a wide double and an octave underneath for weight, never a higher one.
        voice(C.wideL, "sawtooth", f, t, dur, 0.58 * L.v, Object.assign({}, opt, { det: -P.lead.det * 1.5 }));
        voice(C.wideR, "sawtooth", f, t, dur, 0.58 * L.v, Object.assign({}, opt, { det: P.lead.det * 1.5 }));
        voice(C.wideR, "triangle", f / 2, t, dur, 0.5 * L.v, { a: P.lead.a, hold: true, r: 0.09 });
      }
    }
    const K = B.counter[s];
    if (K && level >= 4) voice(C.counter, "triangle", mtof(K.m), t, stepT * K.l, 0.8 * K.v, { a: 0.06, hold: true, r: 0.2 });
  }

  function setTrack(musicDef) { track = Composer.make(musicDef); nextStep = 0; applyEcho(); }
  // Jumps the song to the start of its next big section at the coming bar. Attacks stay in time because the beat never moves.
  function sectionJump(beat) {
    if (!track) return null;
    const n = track.bars.length, wrap = (b) => (b < n ? b : track.loopStart + ((b - track.loopStart) % (n - track.loopStart)));
    const nextBar = Math.ceil(beat / 4) + (track.shift || 0);
    for (let k = 0; k < n; k++) {
      const at = wrap(nextBar + k), B = track.bars[at];
      if (B.kind === "drop" && B.impact) {
        track.shift = (track.shift || 0) + k;
        return B;
      }
    }
    return null;
  }
  function stopTrack() { track = null; }
  function suspend() { if (G && G.ctx.state === "running") G.ctx.suspend(); }
  function resume() { if (G && G.ctx.state === "suspended") G.ctx.resume(); }

  // Called every frame with the game's beat so music and attacks can never drift apart.
  function update(beat, level, muted) {
    if (!G || !track || G.ctx.state !== "running") return;
    const bps = track.bpm / 60;
    if (nextStep / 4 < beat - 0.5) nextStep = Math.ceil(beat * 4);
    while (nextStep / 4 <= beat + 0.14 * bps) {
      const t = G.ctx.currentTime + Math.max(0, nextStep / 4 - beat) / bps;
      if (!muted) playStep(nextStep, t, level, track);
      nextStep++;
    }
  }

  // Renders part of a song silently to a buffer, so its sound can be measured.
  async function render(musicDef, seconds, level) {
    const off = new OfflineAudioContext(2, Math.floor(44100 * seconds), 44100);
    const savedG = G, savedTrack = track;
    G = graph(off);
    track = Composer.make(musicDef);
    applyEcho();
    const stepT = 60 / track.bpm / 4, chunk = 0.25, made = track;
    let step = 0;
    // Queue notes a little ahead at a time, the same way the live game does.
    const queue = (until) => { for (; step * stepT < until && step * stepT < seconds - 0.3; step++) playStep(step, step * stepT, level, made); };
    queue(chunk + 0.1);
    for (let x = chunk; x < seconds - 0.1; x += chunk) {
      const at = x;
      off.suspend(at).then(() => { queue(at + chunk + 0.1); off.resume(); });
    }
    const buffer = await off.startRendering();
    G = savedG;
    track = savedTrack;
    return { buffer, track: made };
  }

  function sfxTone(type, f, t, dur, v, o = {}) { voice(G.fx, type, f, t, dur, v, Object.assign({ cutTo: o.cut ? o.cut * 0.25 : 0, q: 6 }, o)); }
  function sfx(name) {
    if (!G || G.ctx.state !== "running") return;
    const now = G.ctx.currentTime;
    if (lastSfx[name] && now - lastSfx[name] < 0.035) return;
    lastSfx[name] = now;
    const fx = G.fx, mid = (a) => mtof(62 + a);
    switch (name) {
      case "hit": sfxTone("square", 520, now, 0.09, 0.26, { to: 240 }); burstNoise(fx, now, 0.07, 0.3, 3000, "bandpass"); break;
      case "perfect":
        sfxTone("square", 880, now, 0.14, 0.26, { to: 1500 });
        sfxTone("sine", 1760, now + 0.02, 0.2, 0.2);
        burstNoise(fx, now, 0.1, 0.34, 5000, "highpass"); break;
      case "surge":
        sfxTone("sawtooth", 300, now, 0.34, 0.34, { to: 1800, cut: 5000 });
        burstNoise(fx, now, 0.25, 0.4, 2200, "bandpass"); break;
      case "whiff": sfxTone("triangle", 300, now, 0.06, 0.1, { to: 180 }); break;
      case "dash": burstNoise(fx, now, 0.13, 0.24, 2600, "bandpass"); sfxTone("sine", 240, now, 0.13, 0.13, { to: 720 }); break;
      case "dodge": sfxTone("sine", 1100, now, 0.2, 0.26, { to: 2200 }); sfxTone("sine", 1650, now + 0.06, 0.18, 0.18); break;
      case "hurt": sfxTone("sawtooth", 170, now, 0.34, 0.5, { to: 42 }); burstNoise(fx, now, 0.24, 0.5, 900, "lowpass"); break;
      case "zap": burstNoise(fx, now, 0.08, 0.13, 3600, "bandpass"); break;
      case "phase":
        burstNoise(fx, now, 0.7, 0.48, 700, "lowpass");
        sfxTone("sawtooth", 90, now, 0.8, 0.42, { to: 560, cut: 3000 }); break;
      case "die": sfxTone("sawtooth", 300, now, 1.1, 0.48, { to: 26 }); burstNoise(fx, now, 0.7, 0.5, 500, "lowpass"); break;
      case "win":
        burstNoise(fx, now, 1.1, 0.6, 500, "lowpass");
        [0, 4, 7, 12, 16].forEach((d, i) => sfxTone("square", mid(d), now + i * 0.09, 0.36, 0.18)); break;
      case "ui": sfxTone("square", 760, now, 0.05, 0.1); break;
      case "go": sfxTone("square", 660, now, 0.1, 0.18); break;
    }
  }

  return { init, setVolumes, setTrack, sectionJump, stopTrack, update, sfx, suspend, resume, render, isOn: () => !!G };
})();
