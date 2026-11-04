"use strict";
// Every boss gets three waves in a row: 3 moves, then 5, then all of them.
// Boss health is sized from how long those moves take to play.
const FORM_NAMES = ["FIRST CONTACT", "ESCALATION", "FULL FORM"];
const WAVES = [];
LINEUP.forEach((d, i) => {
  const finals = i >= LINEUP.length - 2, rank = Math.min(3, Math.floor(i / 12));
  [3, 5, d.moves.length].forEach((count, form) => {
    const moves = d.moves.slice(0, count), n = WAVES.length + 1;
    const seconds = moves.reduce((sum, m) => sum + m.beats, 0) * 60 / d.music.bpm;
    let label = FORM_NAMES[form];
    if (form === 2 && i === LINEUP.length - 2) label = "REQUIEM";
    if (form === 2 && i === LINEUP.length - 1) label = "END OF SIGNAL";
    WAVES.push({
      n, boss: d, form, tier: finals ? 3 : rank + (form === 2 ? 1 : 0), label, moves,
      hp: Math.round(seconds * (3.3 + i * 0.008) * 0.8),
      phases: form === 0 ? [0.5] : finals && form === 2 ? [0.75, 0.5, 0.25] : [0.66, 0.33],
    });
  });
});
const ROSTER = LINEUP;
