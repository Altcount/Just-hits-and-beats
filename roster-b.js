"use strict";
// Waves 18-33.
B("TIDAL CLOCKWORK", "Runs Eleven Minutes Fast", "It isn't early. Everyone else has simply been late to their own funeral.", { bpm: 120, r: 52, look: { k: "clock" } }, [
  mv("MAINSPRING", "spiral", { arms: 3, rate: 0.75, speed: 160 }),
  mv("MINUTE HAND", "rotor", { n: 2, spin: 0.2, w: 24, pos: [640, 340] }),
  mv("HOUR STRIKE", "halfSlam", { gap: 3, tele: 2.5 }),
  mv("ESCAPEMENT", "stepBurst", { n: 15, speed: 135, gap: 2 }),
  mv("SLACK WATER", "gapWall", { hole: 270, gap: 1.5, speed: 280 }),
  mv("LEAP SECOND", "teleBurst", { gap: 2.5, n: 9, speed: 165 }),
  mv("COGWORK TEETH", "checker", { cols: 10, rows: 6, gap: 2.5, tele: 2.5, beats: 14 }),
]);
B("MOTHER OF MIRRORS", "Seven Years Bad Luck, Per Child", "Every reflection is one of her kids, and they all want your attention.", { bpm: 118, r: 48, look: { k: "crystal", n: 7 } }, [
  mv("SILVERED GAZE", "corners", { gap: 2.25, w: 20 }),
  mv("SPLIT IMAGE", "splitShot", { n: 12, speed2: 180, gap: 2 }),
  mv("HALL OF GLASS", "bouncers", { n: 7, gap: 4, speed: 210, bounce: 3 }),
  mv("SHARD HALO", "orbiters", { rings: [[160, 5, 0.26], [330, 7, -0.16]], pos: [640, 340] }),
  mv("BACKWARD STEP", "echo", { rate: 0.6, r: 42, n: 3 }),
  mv("VANITY LINE", "rakes", { n: 6, gap: 2.75, tilt: 0.5, w: 26 }),
  mv("CRACKED SILVER", "lightning", { gap: 3.5, seg: 4 }),
]);
B("HEX ADMIRAL", "Sank With All Hands, Refused to Stop", "The fleet was lost at sea. The admiral has not been informed.", { bpm: 110, r: 54, fl: "march", look: { k: "trident" } }, [
  mv("BROADSIDE", "gapWall", { hole: 240, gap: 2, speed: 340, dir: "right" }),
  mv("DEPTH CHARGE", "mines", { gap: 0.75, n: 7, speed: 150, fuse: 3.5 }),
  mv("TRIDENT SALVO", "aimFan", { n: 3, spread: 0.35, speed: 320, gap: 1.5 }),
  mv("SHIPPING LANES", "traffic", { lanes: 6, gap: 4.5, speed: 900 }),
  mv("MAELSTROM", "well", { pull: 58, arms: 3, rate: 1, speed: 150 }),
  mv("FIRE ALL TUBES", "comet", { gap: 3.5, speed: 560 }),
  mv("ABANDON SHIP", "implode", { gap: 3, speed: 165, holes: 2, width: 0.95, center: true }),
]);
add(HORIZON, [
  mv("TIDAL FORCE", "vice", { hole: 300, pos: [640, 340] }),
  mv("REDSHIFT", "boomerang", { n: 12, gap: 3.5, speed: 340, pull: 220, pos: [640, 340] }),
  mv("DEAD STAR", "formation", { sides: 5, per: 5, gap: 3, speed: 185, pos: [640, 340] }),
]);
B("COUNT OVERCLOCK", "Runs Hot, Dies Young, Reboots", "Cooling was always somebody else's department.", { bpm: 150, r: 46, fl: "break", look: { k: "gear", n: 9, spin: 2.2 } }, [
  mv("THERMAL SPIKE", "starfall", { gap: 1, n: 7, speed: 175, r: 84 }),
  mv("BUS CONTENTION", "traffic", { lanes: 5, gap: 4.5, speed: 1000 }),
  mv("RED LINE", "columns", { n: 10, step: 0.5, fill: 0.85, back: true, beats: 16 }),
  mv("TURBO", "charge", { gap: 3.5, tele: 2.5, n: 8 }),
  mv("CLOCK SKEW", "stepBurst", { n: 18, speed: 150, gap: 2 }),
  mv("FAN FAILURE", "sprinkler", { rate: 0.25, speed: 290, wide: 1.4, sweep: 0.3 }),
  mv("HEAT SINK", "well", { pull: 60, arms: 2, rate: 0.75, speed: 170 }),
]);
B("MARROW CANTOR", "Sings With What's Left", "A lovely baritone, considering there's no chest behind it.", { bpm: 106, r: 50, fl: "half", look: { k: "skull" } }, [
  mv("BONE CHOIR", "ringGap", { holes: 2, width: 0.85, speed: 200, gap: 1.75 }),
  mv("HOLLOW HYMN", "flower", { n: 30, petals: 6, gap: 2, speed: 165 }),
  mv("RIB CAGE", "cage", { r: 240, gap: 9, beats: 18, n: 3 }),
  mv("GRAVE LINES", "rows", { n: 7, step: 0.7, fill: 0.85, back: true, beats: 16 }),
  mv("DIRGE", "blackout", { n: 4, speed: 165, gap: 2 }),
  mv("JAWBONE", "boomerang", { n: 11, gap: 3, speed: 330, pull: 210 }),
  mv("OSSUARY RAIN", "rain", { n: 4, gap: 0.5, speed: 230, r: 10 }),
]);
B("THE NINTH PLANET", "Demoted, and Holding a Grudge", "They took its title. It would like to discuss this at close range.", { bpm: 98, r: 58, home: 300, fl: "half", look: { k: "planet", n: 2 } }, [
  mv("ORBITAL DECAY", "implode", { gap: 2.5, speed: 175, width: 0.9, pos: [640, 340] }),
  mv("MOONS OF SPITE", "orbiters", { rings: [[170, 4, 0.22], [340, 6, -0.15], [500, 7, 0.08]], pos: [640, 340] }),
  mv("KUIPER HAIL", "rain", { dir: "right", n: 3, gap: 0.5, speed: 240, r: 10, tilt: 0.25 }),
  mv("ESCAPE VELOCITY", "well", { pull: 72, arms: 4, rate: 1.25, speed: 165, pos: [640, 340] }),
  mv("ICE GIANT", "comet", { gap: 3, speed: 600, tail: 2.2 }),
  mv("RECOUNT THE VOTE", "footsteps", { n: 6, gap: 2.75 }),
  mv("PLANETARY DEFENSE", "sweep", { w: 70, gap: 6 }),
]);
add(RIOT, [
  mv("OIL SLICK", "web", { gap: 1.5, w: 16, slow: true }),
  mv("TIRE IRON", "boomerang", { n: 10, gap: 3, speed: 370, pull: 240 }),
  mv("REDLINER", "sprinkler", { rate: 0.2, speed: 320, wide: 1.2, sweep: 0.4 }),
]);
B("SAINT VOLTAGE", "Patron of Unsafe Outlets", "Miracles performed: twelve. Survivors of said miracles: under review.", { bpm: 142, r: 50, look: { k: "wheel", n: 8, spin: 2 } }, [
  mv("HOLY ARC", "lightning", { gap: 2.5, seg: 5, w: 28 }),
  mv("HALO OF AMPS", "rotor", { n: 4, spin: 0.17, w: 20, n2: 10, pos: [640, 340] }),
  mv("BENEDICTION", "ringPulse", { n: 18, speed: 195, gap: 1.5, twist: 0.3 }),
  mv("GROUND FAULT", "checker", { cols: 8, rows: 5, gap: 2, tele: 2, beats: 14 }),
  mv("STATIC RELIC", "mines", { gap: 0.5, n: 6, speed: 165, fuse: 3.5 }),
  mv("SHOCK PILGRIMS", "homing", { n: 5, gap: 3, speed: 180, turn: 1.8 }),
  mv("MARTYR CURRENT", "crossfire", { n: 2, gap: 2, w: 22 }),
]);
B("ANT THEOREM", "Proved by Exhaustion", "One ant is a rounding error. This is what happens when you carry the one.", { bpm: 146, r: 46, fl: "break", look: { k: "orbit", n: 9 } }, [
  mv("COLUMN MARCH", "gapWall", { hole: 220, gap: 1.25, speed: 300, wave: 0.28 }),
  mv("PROOF BY SWARM", "homing", { n: 6, gap: 3, speed: 185, turn: 2 }),
  mv("QED", "formation", { sides: 4, per: 8, gap: 2.5, speed: 200 }),
  mv("COROLLARY", "zipper", { rate: 0.33, speed: 300, rowsN: 12, r: 9 }),
  mv("LEMMA TRAIL", "trail", { gap: 0.5, n: 5, speed: 175 }),
  mv("LONG DIVISION", "halfSlam", { axis: "y", gap: 2.5, tele: 2.25 }),
  mv("EXHAUSTIVE CASE", "spiral", { arms: 5, rate: 0.75, step: 0.3, speed: 170 }),
]);
B("HUSH MERIDIAN", "Draws the Line, Then You", "Cross it quietly. It has excellent hearing and no sense of proportion.", { bpm: 112, r: 50, look: { k: "eye", slit: true } }, [
  mv("LONGITUDE", "columns", { n: 12, step: 0.4, fill: 0.8, beats: 14 }),
  mv("LATITUDE", "rows", { n: 8, step: 0.5, fill: 0.85, beats: 14 }),
  mv("PRIME CUT", "sweep", { w: 66, gap: 6 }),
  mv("DEAD RECKONING", "blackout", { n: 5, speed: 180, gap: 2 }),
  mv("TROPIC OF PAIN", "rakes", { n: 7, gap: 2.25, tilt: 0.7, w: 26 }),
  mv("POLAR NIGHT", "recall", { n: 14, gap: 4, speed: 240, speed2: 260 }),
  mv("DATE LINE", "flatline", { gap: 6, n: 2 }),
]);
add(SIREN, [
  mv("TREMOLO", "stepBurst", { n: 20, speed: 150, gap: 1.5 }),
  mv("DOPPLER", "comet", { gap: 2.5, speed: 680 }),
  mv("RESONANT CAGE", "cage", { r: 225, gap: 8, beats: 16, n: 4 }),
]);
B("TALLOW DUCHESS", "Melting, Furious, Very Well Dressed", "She has outlived three fortunes and most of her own face.", { bpm: 124, r: 50, look: { k: "crown", n: 5 } }, [
  mv("HOT WAX", "swirl", { n: 12, speed: 195, curve: 1, gap: 1.75 }),
  mv("CHANDELIER DROP", "blocks", { gap: 1.25, w: 130, speed: 900 }),
  mv("BALLROOM FLOOR", "checker", { cols: 8, rows: 5, gap: 2, tele: 2, beats: 16 }),
  mv("ENTITLEMENT", "aimFan", { n: 7, spread: 0.9, speed: 250, gap: 1.5 }),
  mv("LAST WALTZ", "pendulum", { arms: 2, swing: 1.2, w: 22, len: 620, rate: 1.1 }),
  mv("DOWRY", "splitShot", { n: 14, speed2: 195, gap: 1.75 }),
  mv("DEBUTANTE'S END", "vice", { axis: "y", hole: 200, n: 3 }),
]);
B("NULLWYRM", "Eats the Zeroes First", "Your data is safe. Your data is safe. Your data is", { bpm: 154, r: 52, fl: "break", look: { k: "helix" } }, [
  mv("ROLLBACK", "recall", { n: 16, gap: 3.5, speed: 250, speed2: 280 }),
  mv("COIL OF NOTHING", "spiral", { arms: 4, rate: 0.5, speed: 180, curve: 0.2 }),
  mv("DOUBLE HELIX", "pendulum", { arms: 2, swing: 1.3, w: 20, len: 680, y: 360, x: 640, rate: 0.9 }),
  mv("DEREFERENCE", "snipe", { gap: 1, r: 62, extra: 1 }),
  mv("MEMORY LEAK", "mines", { gap: 0.5, n: 7, speed: 175, fuse: 3 }),
  mv("GARBAGE ROUND", "implode", { gap: 2.25, speed: 200, width: 0.85 }),
  mv("BLUE WYRM", "tide", { hole: 260, n: 14, rate: 0.3 }),
]);
B("ASHEN CHANCELLOR", "Governs What's Left of the Map", "Taxes are due. The city that owed them is, regrettably, also due.", { bpm: 116, r: 54, fl: "march", look: { k: "poly", n: 5, n2: 5, n3: 5, spin: 0.3 } }, [
  mv("LEVY", "crossfire", { n: 2, gap: 1.75, w: 24 }),
  mv("SCORCHED DECREE", "lightning", { gap: 2.5, seg: 6, aimed: true }),
  mv("EMBARGO", "gapWall", { hole: 220, gap: 1.25, speed: 330, dir: "up" }),
  mv("PURGE ROSTER", "quadrant", { gap: 4, tele: 3 }),
  mv("CURFEW", "blackout", { n: 5, speed: 185, gap: 1.75 }),
  mv("ROAD TOLL", "traffic", { lanes: 7, gap: 4, speed: 1050 }),
  mv("VOTE OF ASH", "starfall", { gap: 0.75, n: 7, speed: 180 }),
]);
add(OBELISK, [
  mv("FAULT LINE", "lightning", { gap: 3, seg: 5, w: 34, pos: [640, 110] }),
  mv("BEDROCK", "quadrant", { gap: 4, tele: 3, pos: [640, 110] }),
  mv("TOPPLE", "halfSlam", { gap: 2.5, tele: 2.25, pos: [640, 110] }),
]);
