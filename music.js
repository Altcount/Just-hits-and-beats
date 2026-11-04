"use strict";
// Writes a whole song from a wave's music settings: sections, chords, bass, arps, melodies and drums.
// Pure data with no audio in it. A boss's three songs share its short theme, heard in each song's big section.
const Composer = (() => {
  const SCALES = {
    minor: [0, 2, 3, 5, 7, 8, 10], phryg: [0, 1, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
    harm: [0, 2, 3, 5, 7, 8, 11], mixo: [0, 2, 4, 5, 7, 9, 10], lydian: [0, 2, 4, 6, 7, 9, 11],
  };
  const PROGS = [
    [0, 5, 2, 6], [0, 3, 6, 2], [0, 6, 5, 6], [0, 2, 5, 4], [5, 3, 0, 6], [0, 4, 5, 3], [3, 5, 0, 4],
    [0, 5, 3, 4], [0, 1, 0, 6], [5, 6, 0, 0], [2, 5, 0, 6], [0, 3, 4, 3], [3, 0, 5, 6], [0, 0, 5, 3],
  ];
  const BASS = [
    [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0], [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0], [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  ];
  const ARPS = [
    [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1], [0, 2, 1, 3, 0, 2, 1, 4, 0, 2, 1, 3, 4, 2, 3, 1],
    [4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5], [0, 0, 2, 0, 3, 0, 2, 0, 4, 0, 2, 0, 3, 0, 5, 3],
    [0, null, 2, 3, null, 2, 4, null, 3, null, 2, 4, null, 5, 4, 2], [2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 5, 4, 3, 2],
  ];
  const RHYTHMS = [
    [0, 3, 6, 8, 11, 14], [0, 2, 4, 8, 10, 12], [0, 4, 6, 10, 12], [0, 3, 4, 7, 8, 12], [2, 4, 7, 10, 12, 15],
    [0, 6, 8, 14], [0, 2, 3, 6, 8, 11], [0, 4, 7, 8, 11, 14],
  ];
  // Every song starts with the two-bar fight countdown. The loop returns to the first section after it.
  const FORMS = [
    [["A", 8], ["B", 8], ["break", 4], ["drop", 8], ["B", 4], ["drop", 8]],
    [["A", 4], ["drop", 8], ["break", 4], ["B", 8], ["drop", 8]],
    [["B", 4], ["A", 8], ["drop", 8], ["break", 2], ["A", 4], ["drop", 8]],
    [["A", 8], ["break", 2], ["drop", 8], ["B", 8], ["break", 4], ["drop", 8]],
    [["drop", 4], ["A", 8], ["B", 8], ["break", 4], ["drop", 12]],
  ];
  const GROOVES = {
    four: { kick: [0, 4, 8, 12], snare: [4, 12], ghost: [], hat: [2, 6, 10, 14] },
    break: { kick: [0, 6, 10], snare: [4, 12], ghost: [7, 15], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
    half: { kick: [0, 10], snare: [8], ghost: [14], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
    march: { kick: [0, 4, 8, 12], snare: [4, 12, 14], ghost: [3, 11], hat: [0, 4, 8, 12] },
    shuffle: { kick: [0, 7, 10], snare: [4, 12], ghost: [9], hat: [0, 3, 4, 7, 8, 11, 12, 15] },
    roll: { kick: [0, 3, 8, 11], snare: [4, 12], ghost: [6, 14], hat: [0, 1, 2, 4, 6, 8, 9, 10, 12, 14] },
  };
  const makeRng = (seed) => {
    let s = (seed * 2654435761) >>> 0;
    return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  const mod = (a, n) => ((a % n) + n) % n;
  const fold = (m, lo, hi) => { while (m < lo) m += 12; while (m > hi) m -= 12; return m; };
  const slots = () => new Array(16).fill(null);

  function makeMotif(seed) {
    const r = makeRng(seed), rhythm = RHYTHMS[Math.floor(r() * RHYTHMS.length)], tones = [0, 2, 4, 6, 7, 9, 11];
    let at = 2 + Math.floor(r() * 3);
    return rhythm.map((s) => {
      at = Math.max(0, Math.min(tones.length - 1, at + [-2, -1, 1, 2][Math.floor(r() * 4)]));
      return { s, d: tones[at] };
    });
  }

  function make(m) {
    const r = makeRng(m.seed);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const scale = SCALES[m.scale] || SCALES.minor, root = m.root;
    const noteOf = (deg) => root + scale[mod(deg, 7)] + 12 * Math.floor(deg / 7);
    const form = pick(FORMS), groove = GROOVES[m.flavor] || GROOVES.four;
    const progs = { A: pick(PROGS), B: pick(PROGS), drop: pick(PROGS), break: pick(PROGS), intro: [0, 0, 0, 0] };
    const basses = { A: pick(BASS), B: pick(BASS), drop: pick(BASS), intro: BASS[7], break: BASS[7] };
    const arps = { A: pick(ARPS), B: pick(ARPS), drop: pick(ARPS), break: pick(ARPS), intro: ARPS[0] };
    const songMotif = makeMotif(m.seed * 3 + 1), answer = makeMotif(m.seed * 5 + 2), theme = makeMotif(m.themeSeed || m.seed);
    const motifs = { A: songMotif, B: answer, drop: theme };

    const patch = {
      lead: { wave: pick(["sawtooth", "square", "sawtooth", "triangle"]), det: 5 + r() * 11, cut: 2200 + r() * 2400, a: 0.006 + r() * 0.02 },
      arp: { wave: pick(["square", "sawtooth", "triangle"]), dec: 0.08 + r() * 0.1, cut: 1800 + r() * 2200 },
      bass: pick(["saw", "square", "reese", "pluck"]),
      pad: { wave: pick(["sawtooth", "triangle", "sawtooth"]), cut: 700 + r() * 800, det: 6 + r() * 10 },
      kit: { kickF: 130 + r() * 50, kickD: 0.15 + r() * 0.12, snareF: 1300 + r() * 1200, clap: r() < 0.5, hatF: 6500 + r() * 3500 },
    };
    const swing = m.flavor === "shuffle" ? 0.34 : r() < 0.3 ? 0.08 + r() * 0.1 : 0;
    const delayBeats = pick([0.75, 0.75, 0.5, 1.5]);

    const sections = [["intro", 2]].concat(form);
    const bars = [];
    sections.forEach(([kind, len], secIdx) => {
      const prog = progs[kind], hr = kind === "B" || kind === "break" ? 2 : 1;
      for (let i = 0; i < len; i++) {
        const chord = prog[Math.floor(i / hr) % 4], next = prog[Math.floor((i + 1) / hr) % 4];
        const progress = i / Math.max(1, len - 1), last = i === len - 1;
        const drop = kind === "drop", brk = kind === "break", intro = kind === "intro";
        const bar = {
          kind, progress, chord,
          kick: slots(), snare: slots(), ghost: slots(), hat: slots(), open: slots(), ride: slots(), tom: slots(),
          bass: slots(), arp: slots(), lead: slots(), counter: slots(),
          pad: null, crash: i === 0 && secIdx > 0 && !brk, riser: brk && last, impact: i === 0 && drop,
        };
        if (i % hr === 0) {
          // Each chord tone folds near the same centre, so chords move smoothly into each other.
          bar.pad = { notes: [0, 2, 4, 6].map((d) => fold(noteOf(chord + d) + 12, root + 13, root + 25)).sort((a, b) => a - b), bars: hr };
        }

        if (!brk) {
          groove.kick.forEach((s) => { bar.kick[s] = 1; });
          if (drop && i % 2 === 1) bar.kick[14] = 0.8;
          if (!intro) {
            groove.snare.forEach((s) => { bar.snare[s] = 1; });
            groove.ghost.forEach((s) => { bar.ghost[s] = 0.4; });
          }
        }
        groove.hat.forEach((s) => { bar.hat[s] = s % 4 === 0 ? 0.7 : 1; });
        if (drop) for (let s = 1; s < 16; s += 2) if (!bar.hat[s] && r() < 0.6) bar.hat[s] = 0.5;
        if (!brk && !intro) [2, 10].forEach((s) => { if (s % 4 === 2 && r() < 0.55) bar.open[s] = 1; });
        if (kind === "B") [0, 4, 8, 12].forEach((s) => { bar.ride[s] = 1; });
        if (last && !brk && !intro) {
          if (r() < 0.5) [12, 13, 14, 15].forEach((s, k) => { bar.tom[s] = 3 - k; });
          else [13, 14, 15].forEach((s) => { bar.snare[s] = 0.55; });
        }
        if (brk) [0, 8].forEach((s) => { bar.ride[s] = 0.7; });

        const bassLine = basses[kind];
        bassLine.forEach((on, s) => {
          if (!on) return;
          let d = chord;
          if (s === 14 && next !== chord && r() < 0.5) d = next - 1;
          const up = !brk && s % 8 === 6 && r() < 0.45 ? 12 : 0;
          bar.bass[s] = { m: fold(noteOf(d), 36, 47) + up, l: intro || brk ? 6 : 2, v: s % 8 === 0 ? 1 : 0.8 };
        });

        arps[kind].forEach((idx, s) => {
          if (idx === null || (kind === "A" && s % 2 === 1 && r() < 0.25)) return;
          const tones = [0, 2, 4, 6, 7, 9], d = chord + tones[idx % tones.length];
          bar.arp[s] = { m: fold(noteOf(d) + 24, root + 24, root + 43), v: s % 4 === 0 ? 1 : 0.7, pan: s % 2 };
        });

        const motif = motifs[kind];
        if (motif) {
          // A four-bar phrase: say it, say it over the new chord, change it, then land.
          const phraseBar = i % 4, notes = motif.map((n) => Object.assign({}, n));
          if (phraseBar === 2) notes.forEach((n, k) => { if (k % 2) n.d += pick([-2, -1, 1, 2]); });
          const shown = phraseBar === 3 ? notes.slice(0, 3) : notes;
          shown.forEach((n, k) => {
            const end = k + 1 < shown.length ? shown[k + 1].s : phraseBar === 3 ? 16 : 16;
            let d = chord + n.d;
            if (n.s % 8 === 0) d = chord + Math.round(n.d / 2) * 2;
            bar.lead[n.s] = { m: fold(noteOf(d) + 24, root + 24, root + 41), l: Math.min(end - n.s, phraseBar === 3 && k === shown.length - 1 ? 10 : 5), v: k === 0 ? 1 : 0.85 };
          });
          if (i % 2 === 0) bar.counter[0] = { m: fold(noteOf(chord + 4) + 12, root + 19, root + 31), l: 12, v: 0.8 };
          if (i % 2 === 1) bar.counter[4] = { m: fold(noteOf(chord + 2) + 12, root + 19, root + 31), l: 10, v: 0.8 };
        }
        bars.push(bar);
      }
    });
    return { bpm: m.bpm, swing, delayBeats, patch, bars, loopStart: 2, form: form.map((f) => f[0]).join("-") };
  }
  return { make, SCALE_NAMES: Object.keys(SCALES) };
})();
