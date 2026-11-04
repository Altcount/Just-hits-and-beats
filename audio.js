"use strict";
// Everything you hear is synthesized here: one sequencer driven by the game's beat clock, plus sfx.
const Sound = (() => {
  let ac = null, master, musicBus, fxBus, delayIn, noiseBuf;
  let track = null, nextStep = 0;
  const vol = { music: 0.7, sfx: 0.8 };
  const lastSfx = {};

  const SCALES = {
    minor: [0, 2, 3, 5, 7, 8, 10],
    phryg: [0, 1, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    harm: [0, 2, 3, 5, 7, 8, 11],
  };
  const PROGS = [[0, 5, 3, 6], [0, 3, 5, 4], [0, 6, 5, 6], [0, 2, 5, 4], [0, 0, 5, 6]];
  const BASS = [
    [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0],
    [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
  ];

  function init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (ac) { if (ac.state === "suspended") ac.resume(); return; }
    ac = new AC();
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 5;
    comp.connect(ac.destination);
    master = ac.createGain(); master.gain.value = 0.85; master.connect(comp);
    musicBus = ac.createGain(); musicBus.gain.value = vol.music; musicBus.connect(master);
    fxBus = ac.createGain(); fxBus.gain.value = vol.sfx; fxBus.connect(master);
    const d = ac.createDelay(1); d.delayTime.value = 0.28;
    const fb = ac.createGain(); fb.gain.value = 0.34;
    const wet = ac.createGain(); wet.gain.value = 0.3;
    d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(musicBus);
    delayIn = d;
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  function setVolumes(m, s) {
    vol.music = m; vol.sfx = s;
    if (ac) { musicBus.gain.value = m; fxBus.gain.value = s; }
  }
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function tone(type, f, t, dur, v, o = {}) {
    const osc = ac.createOscillator(), g = ac.createGain();
    osc.type = type; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + (o.a || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let last = osc;
    if (o.cut) {
      const fl = ac.createBiquadFilter();
      fl.type = "lowpass"; fl.Q.value = o.q || 6;
      fl.frequency.setValueAtTime(o.cut, t);
      fl.frequency.exponentialRampToValueAtTime(Math.max(60, o.cut * 0.25), t + dur);
      osc.connect(fl); last = fl;
    }
    last.connect(g); g.connect(o.bus || musicBus);
    if (o.wet) g.connect(delayIn);
    osc.start(t); osc.stop(t + dur + 0.02);
  }
  function noise(t, dur, v, freq, type, bus) {
    const s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter();
    s.buffer = noiseBuf; fl.type = type; fl.frequency.value = freq;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(bus || musicBus);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }
  const kick = (t) => { tone("sine", 150, t, 0.2, 0.95, { to: 42 }); noise(t, 0.02, 0.25, 2500, "highpass"); };
  const snare = (t) => { noise(t, 0.16, 0.42, 1700, "bandpass"); tone("triangle", 210, t, 0.09, 0.28, { to: 130 }); };
  const hat = (t, open) => noise(t, open ? 0.14 : 0.04, open ? 0.14 : 0.1, 8000, "highpass");

  // Builds a repeatable song from a boss's music settings so each boss always sounds like itself.
  function makeTrack(m) {
    let s = m.seed >>> 0;
    const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const scale = SCALES[m.scale] || SCALES.minor;
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const arp = [], lead = [];
    for (let i = 0; i < 16; i++) arp.push(r() < 0.72 ? pick([0, 2, 4, 7, 9]) : null);
    let deg = 7;
    for (let i = 0; i < 64; i++) {
      if (i % 2 === 0 && r() < 0.62) { deg = Math.max(2, Math.min(13, deg + pick([-2, -1, 1, 2, 3, -3]))); lead.push(deg); }
      else lead.push(null);
    }
    return { bpm: m.bpm, root: m.root, scale, flavor: m.flavor || "four", prog: pick(PROGS), bass: pick(BASS), arp, lead };
  }
  const noteOf = (tr, chord, d) => {
    const n = tr.scale.length, i = chord + d;
    return tr.root + tr.scale[((i % n) + n) % n] + 12 * Math.floor(i / n);
  };

  function playStep(step, t, level) {
    const tr = track, s = step % 16, chord = tr.prog[Math.floor(step / 16) % 4], f = tr.flavor;
    const kicks = f === "break" ? [0, 6, 10] : f === "half" ? [0, 10] : [0, 4, 8, 12];
    const snares = f === "half" ? [8] : f === "march" ? [4, 12, 14] : [4, 12];
    if (kicks.includes(s)) kick(t);
    if (level >= 1) {
      if (snares.includes(s)) snare(t);
      if (s % 2 === 0) hat(t, s % 4 === 2);
      else if (level >= 3) hat(t, false);
    }
    if (tr.bass[s]) tone("sawtooth", mtof(noteOf(tr, chord, 0) - 24), t, 0.17, 0.38, { cut: 500 + level * 240, q: 8 });
    if (level >= 2 && tr.arp[s] !== null) {
      tone("square", mtof(noteOf(tr, chord, tr.arp[s]) + 12), t, 0.12, 0.075, { cut: 2400, wet: true });
    }
    if (level >= 3 && tr.lead[step % 64] !== null) {
      tone("sawtooth", mtof(noteOf(tr, chord, tr.lead[step % 64]) + 12), t, 0.3, 0.09, { cut: 3200, wet: true, a: 0.012 });
    }
    if (level >= 4 && s === 0) {
      [0, 2, 4].forEach((d) => tone("sawtooth", mtof(noteOf(tr, chord, d)), t, 1.3, 0.055, { cut: 1400, a: 0.08 }));
    }
  }

  function setTrack(musicDef) { track = makeTrack(musicDef); nextStep = 0; }
  function stopTrack() { track = null; }
  function suspend() { if (ac && ac.state === "running") ac.suspend(); }
  function resume() { if (ac && ac.state === "suspended") ac.resume(); }

  // Called every frame with the game's beat so music and attacks can never drift apart.
  function update(beat, level, muted) {
    if (!ac || !track || ac.state !== "running") return;
    const bps = track.bpm / 60;
    if (nextStep / 4 < beat - 0.5) nextStep = Math.ceil(beat * 4);
    while (nextStep / 4 <= beat + 0.14 * bps) {
      const t = ac.currentTime + Math.max(0, nextStep / 4 - beat) / bps;
      if (!muted) playStep(nextStep, t, level);
      nextStep++;
    }
  }

  function sfx(name) {
    if (!ac || ac.state !== "running") return;
    const now = ac.currentTime;
    if (lastSfx[name] && now - lastSfx[name] < 0.035) return;
    lastSfx[name] = now;
    const o = { bus: fxBus };
    switch (name) {
      case "hit": tone("square", 520, now, 0.09, 0.26, { ...o, to: 240 }); noise(now, 0.07, 0.3, 3000, "bandpass", fxBus); break;
      case "perfect":
        tone("square", 880, now, 0.14, 0.26, { ...o, to: 1500 });
        tone("sine", 1760, now + 0.02, 0.2, 0.2, o);
        noise(now, 0.1, 0.34, 5000, "highpass", fxBus); break;
      case "surge":
        tone("sawtooth", 300, now, 0.34, 0.34, { ...o, to: 1800, cut: 5000 });
        noise(now, 0.25, 0.4, 2200, "bandpass", fxBus); break;
      case "whiff": tone("triangle", 300, now, 0.06, 0.1, { ...o, to: 180 }); break;
      case "dash": noise(now, 0.13, 0.24, 2600, "bandpass", fxBus); tone("sine", 240, now, 0.13, 0.13, { ...o, to: 720 }); break;
      case "dodge": tone("sine", 1100, now, 0.2, 0.26, { ...o, to: 2200 }); tone("sine", 1650, now + 0.06, 0.18, 0.18, o); break;
      case "hurt": tone("sawtooth", 170, now, 0.34, 0.5, { ...o, to: 42 }); noise(now, 0.24, 0.5, 900, "lowpass", fxBus); break;
      case "zap": noise(now, 0.08, 0.13, 3600, "bandpass", fxBus); break;
      case "phase":
        noise(now, 0.7, 0.48, 700, "lowpass", fxBus);
        tone("sawtooth", 90, now, 0.8, 0.42, { ...o, to: 560, cut: 3000 }); break;
      case "die": tone("sawtooth", 300, now, 1.1, 0.48, { ...o, to: 26 }); noise(now, 0.7, 0.5, 500, "lowpass", fxBus); break;
      case "win":
        noise(now, 1.1, 0.6, 500, "lowpass", fxBus);
        [0, 4, 7, 12, 16].forEach((d, i) => tone("square", mtof(62 + d), now + i * 0.09, 0.36, 0.18, o)); break;
      case "ui": tone("square", 760, now, 0.05, 0.1, o); break;
      case "go": tone("square", 660, now, 0.1, 0.18, o); break;
    }
  }

  return { init, setVolumes, setTrack, stopTrack, update, sfx, suspend, resume, isOn: () => !!ac };
})();
