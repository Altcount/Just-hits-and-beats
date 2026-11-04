"use strict";
// Waves 1-17, in order. Originals from bosses.js gain moves through add(); B() makes a new boss.
const LINEUP = [];
function add(def, moves) { def.moves.push(...moves); LINEUP.push(def); }
function B(name, title, tag, s, moves) {
  const n = LINEUP.length + 1;
  LINEUP.push({
    id: name.toLowerCase().replace(/[^a-z]/g, ""), name, title, tag, r: s.r || 50, home: s.home || 210, draw: lookOf(s.look), moves,
    music: { bpm: s.bpm, root: 36 + (n * 5) % 12, scale: ["minor", "phryg", "dorian", "harm"][n % 4], flavor: s.fl || "four", seed: n * 37 + 5 },
  });
}

add(VOLT, [
  mv("LIVE WIRE", "web", { gap: 2.5 }),
  mv("BREAKER TRIP", "halfSlam", { gap: 3.5, tele: 3 }),
  mv("SURGE PROTECTOR", "orbiters", { rings: [[170, 3, 0.2]], r: 13 }),
]);
B("BITMITE", "Smallest Bug in the Build", "It chewed through one line of code. That was enough.", { bpm: 112, r: 44, look: { k: "poly", n: 4, n2: 4, n3: 4, spin: 1.1 } }, [
  mv("NIBBLE", "aimFan", { n: 3, spread: 0.5, speed: 190 }),
  mv("BYTE SWARM", "homing", { n: 3, turn: 1.3 }),
  mv("PARITY FLIP", "checker", { cols: 6, rows: 4, gap: 3, tele: 3, beats: 14 }),
  mv("BIT ROT", "mines", { gap: 1.5, n: 5, speed: 125 }),
  mv("BUFFER CRAWL", "stepBurst", { n: 10, speed: 110, gap: 3 }),
  mv("SEGFAULT", "snipe", { gap: 2.5, r: 66 }),
  mv("STACK TRACE", "columns", { n: 6, step: 1.1 }),
]);
B("HOLLOW LANTERN", "It Lights the Way Down", "Everyone who followed it swears it was going somewhere.", { bpm: 104, r: 50, fl: "half", look: { k: "lantern" } }, [
  mv("WICK SPIT", "ringPulse", { n: 9, speed: 140, gap: 3 }),
  mv("MOTH CALL", "well", { pull: 26, arms: 2, rate: 1.5, speed: 130 }),
  mv("EMBER DRIFT", "rain", { gap: 1, n: 3, speed: 150, r: 8 }),
  mv("GUTTERING", "blackout", { n: 3, speed: 145, gap: 3 }),
  mv("PILOT LIGHT", "footsteps", { n: 4, gap: 4 }),
  mv("SWINGING HOOK", "pendulum", { swing: 0.9, w: 20, len: 520 }),
  mv("SOOT PETALS", "flower", { n: 20, petals: 3, gap: 3, speed: 130 }),
]);
B("MOSS TYRANT", "King of the Quiet Server Room", "Nobody has rebooted it in forty years, and it took that personally.", { bpm: 96, r: 54, fl: "half", look: { k: "crown", n: 3 } }, [
  mv("SPORE COUGH", "splitShot", { speed: 210, n: 8, speed2: 135, gap: 3 }),
  mv("CREEPING ROOT", "rows", { n: 5, step: 1.3 }),
  mv("OVERGROWTH", "swirl", { n: 8, speed: 145, curve: 0.6, gap: 3 }),
  mv("ROYAL COMPOST", "starfall", { gap: 2, n: 5, speed: 125, r: 76 }),
  mv("VINE TOLL", "sprinkler", { rate: 0.5, speed: 190, wide: 1 }),
  mv("DAMP THRONE", "implode", { gap: 4, speed: 130, width: 1.1 }),
  mv("HUMUS MINES", "trail", { gap: 1, speed: 125 }),
]);
add(SERPENT, [
  mv("FORKED TONGUE", "crossfire", { gap: 2.5, w: 20 }),
  mv("SHED SKIN", "formation", { sides: 6, per: 4, gap: 4, speed: 150 }),
  mv("HOODED GLARE", "boomerang", { n: 8, gap: 4, speed: 280, pull: 190 }),
]);
B("PAPER WASP", "Folded From Old Warrants", "It stings exactly once. It just has several thousand copies.", { bpm: 134, r: 46, look: { k: "moth" } }, [
  mv("ORIGAMI DIVE", "charge", { gap: 4, tele: 3 }),
  mv("PAPERCUT", "rakes", { n: 4, gap: 3.5, w: 22 }),
  mv("CONFETTI STORM", "rain", { dir: "left", n: 2, gap: 0.5, speed: 240, r: 7, tilt: 0.2 }),
  mv("CARBON COPY", "echo", { rate: 1, r: 40 }),
  mv("HIVE MEMO", "homing", { n: 4, gap: 4, turn: 1.5 }),
  mv("CREASE LINE", "columns", { n: 7, step: 0.9 }),
  mv("FOLD IN HALF", "halfSlam", { axis: "y", gap: 4, tele: 3 }),
]);
B("KID CATHODE", "Child Star of Channel Nine", "Please stand by. Please keep standing right there.", { bpm: 128, r: 48, fl: "break", look: { k: "bars", n: 6 } }, [
  mv("TEST PATTERN", "checker", { cols: 8, rows: 5, gap: 3, tele: 3, beats: 14 }),
  mv("SCANLINE", "rows", { n: 8, step: 0.6, fill: 0.7 }),
  mv("STATIC SHOWER", "zipper", { rate: 0.75, speed: 230, rowsN: 7 }),
  mv("CHANNEL SURF", "teleBurst", { gap: 4, n: 8, speed: 140 }),
  mv("VERTICAL HOLD", "vice", { axis: "y", hole: 280 }),
  mv("COMMERCIAL BREAK", "bouncers", { n: 5, gap: 5, speed: 185 }),
  mv("SIGN-OFF", "ringGap", { gap: 3, width: 1, speed: 180 }),
]);
B("BRASS ORACLE", "Answers Only in Shrapnel", "Ask it a question. It's been dying for you to ask.", { bpm: 108, r: 52, fl: "march", look: { k: "eye" } }, [
  mv("FORESIGHT", "footsteps", { n: 5, gap: 3.5 }),
  mv("PROPHECY BOLT", "crossfire", { gap: 3, w: 28 }),
  mv("THIRD VERSE", "aimFan", { n: 5, spread: 0.7, speed: 200, gap: 2.5 }),
  mv("BLIND SPOT", "blackout", { n: 3, speed: 150, gap: 3 }),
  mv("READ THE RINGS", "ringGap", { holes: 3, width: 0.8, speed: 170, gap: 3 }),
  mv("SEE IT COMING", "snipe", { gap: 2, r: 64, tele: 2.5 }),
  mv("BRAZEN GAZE", "sprinkler", { rate: 0.4, speed: 210, wide: 1.1, sweep: 0.35 }),
]);
add(METRO, [
  mv("RUBATO", "recall", { n: 8, gap: 5, speed: 190, speed2: 190 }),
  mv("FERMATA", "formation", { sides: 4, per: 5, gap: 4, speed: 150 }),
  mv("DA CAPO", "boomerang", { n: 8, gap: 4, speed: 270, pull: 180 }),
]);
B("SALT WIDOWER", "He Keeps Her Tide Tables", "He still sets out two cups. You'd best not touch the other one.", { bpm: 100, r: 50, fl: "half", look: { k: "shell" } }, [
  mv("HIGH TIDE", "gapWall", { hole: 300, gap: 2, speed: 240 }),
  mv("UNDERTOW", "well", { pull: 40, arms: 2, rate: 1.25, speed: 140 }),
  mv("BRINE SPRAY", "rain", { dir: "up", n: 2, gap: 0.5, speed: 220, r: 8 }),
  mv("GRIEF SWELL", "implode", { gap: 3.5, speed: 135, width: 1.05 }),
  mv("LOW TIDE", "bouncers", { n: 6, gap: 5, speed: 170, bounce: 1 }),
  mv("SALT LINE", "web", { gap: 2.5, w: 14 }),
  mv("WIDOW'S WALK", "trail", { gap: 1, n: 3, speed: 135, path: [[160, 200], [1120, 200], [160, 200], [1120, 200], [640, 200]] }),
]);
B("GLOAM JESTER", "Laughs Half a Beat Late", "The joke is on you. You are also the punchline, and the stage.", { bpm: 138, r: 48, fl: "break", look: { k: "mask", grin: true } }, [
  mv("PRATFALL", "blocks", { gap: 2, w: 110, speed: 780 }),
  mv("JUGGLING KNIVES", "boomerang", { n: 7, gap: 4 }),
  mv("BAD TIMING", "stepBurst", { n: 12, speed: 120, gap: 2.5 }),
  mv("THE OLD SWITCH", "teleBurst", { gap: 3.5, n: 8, speed: 150 }),
  mv("CUSTARD BOMB", "splitShot", { n: 8, speed2: 150, gap: 2.5 }),
  mv("HECKLER", "aimFan", { n: 4, spread: 0.6, curve: 0.5, lead: 0.4, speed: 210 }),
  mv("CURTAIN CALL", "vice", { hole: 330 }),
]);
B("CINDER ABBOT", "The Monastery Is Still on Fire", "He took a vow of silence, then discovered an extremely loud loophole.", { bpm: 116, r: 52, fl: "march", look: { k: "flame" } }, [
  mv("VESPER FLAME", "spiral", { arms: 2, rate: 0.75, speed: 145 }),
  mv("ASH WEDNESDAY", "rain", { n: 3, gap: 0.75, speed: 170, r: 9 }),
  mv("CENSER SWING", "pendulum", { swing: 1, w: 24, len: 540 }),
  mv("BURNT OFFERING", "starfall", { gap: 1.5, n: 6, speed: 140 }),
  mv("SILENT ORDER", "formation", { sides: 3, per: 7, gap: 3.5, speed: 165 }),
  mv("PYRE LINES", "columns", { n: 8, step: 0.8, back: true, beats: 18 }),
  mv("SMOKE BLESSING", "swirl", { n: 8, speed: 160, curve: 0.7, gap: 2.5 }),
]);
add(QUEEN, [
  mv("PHEROMONE TRAIL", "echo", { rate: 0.75, r: 42 }),
  mv("WAX SEAL", "cage", { r: 260, gap: 9, beats: 16 }),
  mv("NUPTIAL FLIGHT", "charge", { gap: 4, tele: 2.5, n: 7 }),
]);
B("IRON PILGRIM", "Walked Here From the Last War", "It has been told the war is over. It is walking back to check.", { bpm: 88, r: 54, fl: "march", look: { k: "shield" } }, [
  mv("LONG MARCH", "footsteps", { n: 7, gap: 3.5, r: 62 }),
  mv("SHIELD WALL", "gapWall", { hole: 260, gap: 2, speed: 220, dir: "down" }),
  mv("SIEGE LOB", "splitShot", { speed: 240, n: 12, speed2: 160, gap: 2.5 }),
  mv("TRENCH LINE", "rows", { n: 6, step: 1, back: true, beats: 16 }),
  mv("ROLLING BARRAGE", "columns", { n: 8, step: 0.6, fill: 0.8 }),
  mv("RUSTED OATH", "stepBurst", { n: 16, speed: 125, gap: 2.5 }),
  mv("NO MAN'S LAND", "mines", { gap: 0.75, n: 6, speed: 135, fuse: 4 }),
]);
B("VELVET STATIC", "The Voice on the Dead Line", "It knows your name. It's just having some trouble pronouncing you.", { bpm: 122, r: 48, fl: "break", look: { k: "glyph", n: 7, seed: 3 } }, [
  mv("DIAL TONE", "ringPulse", { n: 16, speed: 175, gap: 2 }),
  mv("CROSSED LINES", "corners", { gap: 3, w: 18 }),
  mv("WHITE NOISE", "zipper", { rate: 0.5, speed: 260, rowsN: 10, r: 9 }),
  mv("HOLD MUSIC", "flower", { n: 24, petals: 4, gap: 2.5, speed: 150 }),
  mv("WRONG NUMBER", "teleBurst", { gap: 3, n: 9, speed: 155 }),
  mv("PARTY LINE", "web", { gap: 1.5, w: 12, slow: true }),
  mv("DISCONNECT", "blackout", { n: 4, speed: 160 }),
]);
B("GRAND VIZIER 8", "Seven Prior Viziers Are Unavailable", "Advises the throne. There hasn't been anyone on it for a while.", { bpm: 126, r: 50, look: { k: "star", n: 8, inner: 0.55 } }, [
  mv("COURT INTRIGUE", "recall", { n: 10, gap: 4.5, speed: 210, speed2: 220 }),
  mv("POISON GOBLET", "homing", { n: 4, gap: 3.5, speed: 150, time: 3 }),
  mv("EDICT OF EIGHT", "formation", { sides: 8, per: 3, gap: 3, speed: 180 }),
  mv("PALACE GUARD", "orbiters", { rings: [[210, 4, 0.2], [380, 5, -0.12]], x: 640, y: 340 }),
  mv("SECRET PASSAGE", "cage", { r: 260, gap: 9, beats: 16, n: 3 }),
  mv("HIDDEN DAGGER", "crossfire", { gap: 2.25, w: 22 }),
  mv("REGICIDE", "rakes", { n: 5, gap: 3, tilt: 0.45 }),
]);
add(TWINS, [
  mv("SILVER ECHO", "footsteps", { n: 5, gap: 3 }),
  mv("PERFECT SYMMETRY", "corners", { gap: 2.75, w: 22 }),
  mv("BOTH HANDS", "swirl", { n: 9, speed: 175, curve: 0.8, gap: 2.5 }),
]);
