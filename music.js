"use strict";
// Writes a whole song from a wave's music settings. Pure data with no audio in it.
// Style goal: driving chiptune and EDM with riffs, in a lower register, where each section has its own job
// and melodies keep moving across eight bars. A boss's three songs share its theme, heard in the big sections.
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
    [0, null, null, 1, null, null, 2, null, 3, null, null, 2, null, null, 1, null], [0, 1, null, 2, 3, null, 2, 1, 0, 1, null, 2, 4, null, 3, 2],
  ];
  // Syncopated chord hits, the riff layer that gives big sections their punch.
  const STABS = [
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0], [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1], [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
  ];
  const RHYTHMS = [
    [0, 3, 6, 8, 11, 14], [0, 2, 4, 8, 10, 12], [0, 4, 6, 10, 12], [0, 3, 4, 7, 8, 12], [2, 4, 7, 10, 12, 15],
    [0, 6, 8, 14], [0, 2, 3, 6, 8, 11], [0, 4, 7, 8, 11, 14], [0, 3, 6, 10, 13], [0, 8, 10, 12, 14], [4, 6, 8, 11],
    [0, 1, 2, 4, 8, 11],
  ];
  // Long songs, so a normal fight never hears one loop. The count-in comes first and isn't repeated.
  const FORMS = [
    [["A", 8], ["B", 8], ["break", 4], ["drop", 8], ["C", 8], ["B", 8], ["break", 2], ["drop", 16]],
    [["A", 8], ["drop", 8], ["C", 8], ["break", 4], ["B", 8], ["A", 8], ["drop", 16]],
    [["B", 8], ["A", 8], ["break", 2], ["drop", 16], ["C", 8], ["break", 4], ["drop", 8]],
    [["A", 8], ["B", 8], ["drop", 8], ["break", 2], ["C", 8], ["A", 8], ["break", 4], ["drop", 16]],
    [["drop", 8], ["A", 8], ["C", 8], ["B", 8], ["break", 4], ["drop", 16]],
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

  // A one-bar idea: when notes fall, and how far each moves from the last.
  function makeIdea(r) {
    const rhythm = RHYTHMS[Math.floor(r() * RHYTHMS.length)];
    return { rhythm, moves: rhythm.map(() => [-2, -1, -1, 1, 1, 2, 3, -3][Math.floor(r() * 8)]) };
  }
  // The shape of an eight-bar melody: a question, an answer, the question changed, a rest, and a landing.
  const PLANS = [
    ["a", "b", "a2", "rest", "a", "c", "b2", "end"],
    ["a", "a2", "b", "c", "a", "rest", "b2", "end"],
    ["a", "b", "c", "b2", "a2", "rest", "c", "end"],
    ["b", "a", "b2", "a2", "c", "a", "rest", "end"],
  ];
  function writeMelody(r, chordAt, len, theme) {
    const a = theme || makeIdea(r), b = makeIdea(r), c = makeIdea(r);
    const plan = PLANS[Math.floor(r() * PLANS.length)], bars = [];
    let cur = chordAt(0) + 4;
    const tones = (ch) => [0, 2, 4, 6].map((d) => ch + d);
    const nearest = (deg, ch) => {
      let best = deg, gap = 99;
      for (const t of tones(ch)) for (let o = -14; o <= 14; o += 7) {
        const g = Math.abs(t + o - deg);
        if (g < gap) { gap = g; best = t + o; }
      }
      return best;
    };
    for (let i = 0; i < len; i++) {
      const kind = plan[i % 8], ch = chordAt(i), notes = [];
      if (kind === "rest") { bars.push(notes); continue; }
      if (kind === "end") {
        cur = nearest(cur - 1, ch);
        notes.push({ s: 0, deg: cur, l: 6 }, { s: 6, deg: cur + (r() < 0.5 ? 1 : -1), l: 2 }, { s: 8, deg: nearest(cur, ch), l: 8 });
        bars.push(notes);
        continue;
      }
      const idea = kind[0] === "a" ? a : kind[0] === "b" ? b : c, changed = kind.length > 1;
      idea.rhythm.forEach((s, k) => {
        let move = idea.moves[k % idea.moves.length];
        if (changed && k >= idea.rhythm.length - 2) move = -move + (r() < 0.5 ? 1 : -1);
        cur += move;
        if (s % 8 === 0) cur = nearest(cur, ch);
        // Don't wander out of the singing range.
        if (cur > ch + 11) cur -= 7;
        if (cur < ch - 3) cur += 7;
        const next = k + 1 < idea.rhythm.length ? idea.rhythm[k + 1] : 16;
        notes.push({ s, deg: cur, l: Math.min(next - s, 6) });
      });
      bars.push(notes);
    }
    return bars;
  }

  function make(m) {
    const r = makeRng(m.seed);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const scale = SCALES[m.scale] || SCALES.minor, root = m.root;
    const noteOf = (deg) => root + scale[mod(deg, 7)] + 12 * Math.floor(deg / 7);
    const form = pick(FORMS), groove = GROOVES[m.flavor] || GROOVES.four;
    const theme = makeIdea(makeRng(m.themeSeed || m.seed));

    const kinds = ["A", "B", "C", "drop", "break", "intro"], parts = {};
    kinds.forEach((k) => {
      parts[k] = {
        prog: k === "intro" ? [0, 0, 0, 0] : pick(PROGS),
        bass: [pick(BASS), pick(BASS)], arp: [pick(ARPS), pick(ARPS)], stab: [pick(STABS), pick(STABS)],
      };
    });
    parts.intro.bass = [BASS[7], BASS[7]];
    parts.break.bass = [BASS[7], BASS[4]];
    // Each section has a job. Some carry arps, some riffs, so the texture keeps changing.
    const arpOn = { A: r() < 0.4, B: true, C: false, drop: r() < 0.65, break: true, intro: false };
    const stabOn = { A: !arpOn.A, B: false, C: true, drop: true, break: false, intro: false };

    const patch = {
      lead: { wave: pick(["square", "square", "sawtooth", "triangle"]), det: 4 + r() * 8, cut: 1700 + r() * 1300, a: 0.006 + r() * 0.015 },
      arp: { wave: pick(["square", "triangle", "triangle"]), dec: 0.09 + r() * 0.1, cut: 900 + r() * 900 },
      stab: { wave: pick(["sawtooth", "square"]), cut: 700 + r() * 700 },
      bass: pick(["saw", "square", "reese", "pluck"]),
      pad: { wave: pick(["sawtooth", "triangle", "sawtooth"]), cut: 550 + r() * 600, det: 6 + r() * 10 },
      kit: { kickF: 130 + r() * 50, kickD: 0.15 + r() * 0.12, snareF: 1100 + r() * 900, clap: r() < 0.5, hatF: 5200 + r() * 2300 },
    };
    const swing = m.flavor === "shuffle" ? 0.34 : r() < 0.25 ? 0.08 + r() * 0.1 : 0;
    const delayBeats = pick([0.75, 0.75, 0.5, 1.5]);

    const sections = [["intro", 2]].concat(form);
    let lastDrop = -1;
    sections.forEach((sec, i) => { if (sec[0] === "drop") lastDrop = i; });
    const lift = r() < 0.6 ? 2 : 0;
    const bars = [];
    sections.forEach(([kind, len], secIdx) => {
      const part = parts[kind], hr = kind === "B" || kind === "break" ? 2 : 1, up = secIdx === lastDrop ? lift : 0;
      const chordAt = (i) => part.prog[Math.floor(i / hr) % 4];
      const n = (deg) => noteOf(deg) + up;
      const drop = kind === "drop", brk = kind === "break", intro = kind === "intro", halfTime = kind === "C";
      const melody = kind === "A" || kind === "B" || kind === "C" || drop ? writeMelody(r, chordAt, len, drop ? theme : null) : null;
      for (let i = 0; i < len; i++) {
        const chord = chordAt(i), next = chordAt(i + 1);
        const progress = i / Math.max(1, len - 1), last = i === len - 1, turn = i % 4 === 3;
        const bar = {
          kind, progress, chord,
          kick: slots(), snare: slots(), ghost: slots(), hat: slots(), open: slots(), ride: slots(), tom: slots(),
          bass: slots(), arp: slots(), lead: slots(), counter: slots(), stab: slots(),
          pad: null, crash: i === 0 && secIdx > 0 && !brk, riser: brk && last, impact: i === 0 && drop,
        };
        if (i % hr === 0) {
          // Chord tones fold near one centre so chords move smoothly, and stay below the melody.
          bar.pad = { notes: [0, 2, 4, 6].map((d) => fold(n(chord + d) + 12, root + 7, root + 19)).sort((a, b) => a - b), bars: hr };
        }

        if (!brk) {
          (halfTime ? [0, 10] : groove.kick).forEach((s) => { bar.kick[s] = 1; });
          if (drop && i % 2 === 1) bar.kick[14] = 0.8;
          if (turn && !intro) bar.kick[15] = 0.7;
          if (!intro) {
            (halfTime ? [8] : groove.snare).forEach((s) => { bar.snare[s] = 1; });
            groove.ghost.forEach((s) => { if (r() < 0.75) bar.ghost[s] = 0.4; });
          }
        }
        (halfTime ? [0, 4, 8, 12] : groove.hat).forEach((s) => { bar.hat[s] = s % 4 === 0 ? 0.7 : 1; });
        if (drop) for (let s = 1; s < 16; s += 2) if (!bar.hat[s] && r() < 0.5) bar.hat[s] = 0.45;
        if (!brk && !intro) [2, 10].forEach((s) => { if (r() < 0.4) bar.open[s] = 1; });
        if (kind === "B") [0, 4, 8, 12].forEach((s) => { bar.ride[s] = 1; });
        if ((last || (turn && r() < 0.4)) && !brk && !intro) {
          const fill = r();
          if (fill < 0.4) [12, 13, 14, 15].forEach((s, k) => { bar.tom[s] = 3 - k; });
          else if (fill < 0.75) [13, 14, 15].forEach((s) => { bar.snare[s] = 0.55; });
          else [10, 12, 14].forEach((s, k) => { bar.tom[s] = 2 - k; });
        }
        if (brk) [0, 8].forEach((s) => { bar.ride[s] = 0.7; });

        // The bassline alternates two patterns and walks into each new chord.
        part.bass[Math.floor(i / 2) % 2].forEach((on, s) => {
          if (!on) return;
          let d = chord;
          if (s >= 14 && next !== chord) d = next + (r() < 0.5 ? 1 : -1);
          const octave = !brk && s % 8 === 6 && r() < 0.35 ? 12 : 0;
          bar.bass[s] = { m: fold(n(d), 36, 47) + octave, l: intro || brk ? 6 : 2, v: s % 8 === 0 ? 1 : 0.8 };
        });

        if (arpOn[kind]) {
          part.arp[Math.floor(i / 2) % 2].forEach((idx, s) => {
            if (idx === null) return;
            const tones = [0, 2, 4, 6, 7, 9], d = chord + tones[idx % tones.length];
            bar.arp[s] = { m: fold(n(d) + 12, root + 14, root + 30), v: s % 4 === 0 ? 1 : 0.7, pan: s % 2 };
          });
        }
        if (stabOn[kind]) {
          part.stab[Math.floor(i / 2) % 2].forEach((on, s) => {
            if (!on) return;
            const base = fold(n(chord) + 12, root + 7, root + 18);
            bar.stab[s] = { notes: [base, fold(n(chord + 4) + 12, base + 1, base + 12), base + 12], v: s % 4 === 0 ? 1 : 0.8 };
          });
        }
        if (melody) {
          melody[i].forEach((note, k) => {
            bar.lead[note.s] = { m: fold(n(note.deg) + 12, root + 12, root + 30), l: note.l, v: k === 0 ? 1 : 0.85 };
          });
          if (kind !== "A" && i % 2 === 0) bar.counter[0] = { m: fold(n(chord + 4) + 12, root + 7, root + 19), l: 12, v: 0.8 };
          if (kind !== "A" && i % 2 === 1) bar.counter[4] = { m: fold(n(chord + 2) + 12, root + 7, root + 19), l: 10, v: 0.8 };
        }
        bars.push(bar);
      }
    });
    return { bpm: m.bpm, swing, delayBeats, patch, bars, loopStart: 2, form: form.map((f) => f[0]).join("-") };
  }
  return { make, SCALE_NAMES: Object.keys(SCALES) };
})();
