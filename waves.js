"use strict";
// One wave per boss, in LINEUP order. Boss health is sized from its moves, so a good player sees them all.
const TIER_NAMES = ["FIRST CONTACT", "ESCALATION", "FULL FORM", "OVERDRIVE"];
const WAVES = LINEUP.map((d, i) => {
  const n = i + 1, tier = Math.min(3, Math.floor(i / 12));
  const seconds = d.moves.reduce((sum, m) => sum + m.beats, 0) * 60 / d.music.bpm;
  const label = n === 49 ? "REQUIEM" : n === 50 ? "END OF SIGNAL" : TIER_NAMES[tier];
  return {
    n, boss: d, tier: n >= 49 ? 3 : tier, label, moves: d.moves,
    hp: Math.round(seconds * (3.3 + i * 0.008)),
    phases: n >= 49 ? [0.75, 0.5, 0.25] : tier >= 2 ? [0.66, 0.33] : [0.5],
  };
});
const ROSTER = LINEUP;
