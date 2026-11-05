"use strict";
// Waves 34-50.
B("THE KEPT PROMISE", "It Said It Would Come Back", "And here it is, on schedule, with interest.", { bpm: 130, r: 50, look: { k: "hourglass" } }, [
  mv("OVERDUE", "recall", { n: 16, gap: 3.5, speed: 250, speed2: 285 }),
  mv("SANDS RUNNING", "rain", { n: 5, gap: 0.5, speed: 250, r: 8, tilt: 0.12 }),
  mv("FINAL NOTICE", "quadrant", { gap: 3.5, tele: 2.75 }),
  mv("SWORN IN", "cage", { r: 220, gap: 8, beats: 18, n: 4 }),
  mv("COMPOUND INTEREST", "flower", { n: 36, petals: 7, gap: 1.75, speed: 180 }),
  mv("TURN IT OVER", "halfSlam", { axis: "y", gap: 2, tele: 2 }),
  mv("EVERY WORD", "footsteps", { n: 8, gap: 2.5, r: 60 }),
]);
B("RAZORBLOOM", "It Only Opens for You", "The most beautiful thing in the arena, and it has noticed you noticing.", { bpm: 136, r: 48, look: { k: "blade", n: 6, spin: 1.2 } }, [
  mv("PETAL FALL", "flower", { n: 40, petals: 8, gap: 1.75, speed: 190 }),
  mv("THORN LATTICE", "rakes", { n: 7, gap: 2, tilt: 0.55, w: 28 }),
  mv("SEED BURST", "starfall", { gap: 0.75, n: 8, speed: 190 }),
  mv("POLLEN COUNT", "homing", { n: 7, gap: 2.75, speed: 190, turn: 2 }),
  mv("PHOTOTROPIC", "sprinkler", { rate: 0.2, speed: 300, wide: 1.5, sweep: 0.2 }),
  mv("BRAMBLE GATE", "vice", { hole: 240, n: 3 }),
  mv("WILTING CUT", "sweep", { w: 72, gap: 5.5 }),
]);
B("DEACON FLUX", "Preaches at 60 Hertz", "Bow your head and hold very still. He means it in the electrical sense.", { bpm: 144, r: 50, fl: "march", look: { k: "wheel", n: 3, spin: -3 } }, [
  mv("ALTERNATING CURRENT", "zipper", { rate: 0.25, speed: 320, rowsN: 12, r: 9 }),
  mv("COMMUNION ARC", "lightning", { gap: 2, seg: 6, w: 28 }),
  mv("TRANSFORMER HUM", "well", { pull: 80, arms: 4, rate: 1, speed: 175 }),
  mv("CONGREGATION", "orbiters", { rings: [[190, 6, 0.28], [360, 8, -0.18], [530, 9, 0.1]], pos: [640, 340] }),
  mv("PHASE SHIFT", "teleBurst", { gap: 2, n: 11, speed: 185 }),
  mv("SERMON ON THE GRID", "checker", { cols: 10, rows: 6, gap: 2, tele: 2, beats: 16 }),
  mv("BLOWN FUSE", "flatline", { gap: 5.5, n: 3 }),
]);
add(WIDOW, [
  mv("SILK NOOSE", "well", { pull: 70, arms: 3, rate: 1, speed: 170 }),
  mv("EGG SAC", "mines", { gap: 0.5, n: 8, speed: 175, fuse: 3 }),
  mv("BLACK ICE", "rakes", { n: 6, gap: 2.25, tilt: 0.6, w: 26 }),
]);
B("MAW OF TUESDAY", "Nobody Knows Why Tuesday", "It ate Monday's lunch, then Monday, and it has heard about your week.", { bpm: 140, r: 54, look: { k: "maw", n: 4 } }, [
  mv("CHOMP", "charge", { gap: 3, tele: 2, n: 10 }),
  mv("ALL YOU CAN EAT", "well", { pull: 90, arms: 3, rate: 0.75, speed: 180 }),
  mv("SPIT TAKE", "splitShot", { n: 16, speed: 320, speed2: 205, gap: 1.5 }),
  mv("WEEKLY MEETING", "stepBurst", { n: 22, speed: 160, gap: 1.5 }),
  mv("GRINDING MOLARS", "vice", { axis: "y", hole: 190, n: 4 }),
  mv("SECOND HELPING", "boomerang", { n: 14, gap: 2.5, speed: 390, pull: 260 }),
  mv("BURP", "ringGap", { holes: 2, width: 0.75, speed: 260, gap: 1.5, th: 22 }),
]);
B("SEVENTH SIEVE", "Strains the Weak From the Hours", "Nothing gets through it. Please do not take this as a challenge.", { bpm: 134, r: 50, look: { k: "bars", n: 12 } }, [
  mv("MESH", "checker", { cols: 12, rows: 7, gap: 1.75, tele: 2, beats: 16 }),
  mv("FINE GRIND", "tide", { hole: 230, n: 18, rate: 0.34, wave: 0.42 }),
  mv("FILTER SWEEP", "columns", { n: 14, step: 0.3, fill: 0.72, back: true, beats: 14 }),
  mv("SETTLED SILT", "blocks", { gap: 1, w: 110, speed: 1050 }),
  mv("PERCOLATE", "rain", { dir: "up", n: 5, gap: 0.5, speed: 260, r: 8 }),
  mv("THE REMAINDER", "formation", { sides: 7, per: 5, gap: 2, speed: 210 }),
  mv("SIFT", "gapWall", { hole: 205, gap: 1, speed: 340, wave: 0.3 }),
]);
B("LUMEN HARROW", "Plows the Sky for Salt", "It's a farmer. You are, unfortunately, a weed.", { bpm: 126, r: 50, look: { k: "gear", n: 5, spin: -1 } }, [
  mv("FURROW", "traffic", { lanes: 6, gap: 3.5, speed: 1150, len: 400 }),
  mv("SICKLE ARC", "sweep", { w: 80, gap: 5 }),
  mv("REAPING TEETH", "rotor", { n: 5, spin: 0.2, w: 20, n2: 12, pos: [640, 340] }),
  mv("CROP ROTATION", "orbiters", { rings: [[210, 7, 0.3], [400, 9, -0.2]], pos: [640, 340] }),
  mv("BLIGHT", "echo", { rate: 0.4, r: 44, n: 4 }),
  mv("SALT THE EARTH", "mines", { gap: 0.4, n: 7, speed: 185, fuse: 3 }),
  mv("HARVEST MOON", "comet", { gap: 2, speed: 720, tail: 2.2 }),
]);
add(CARDINAL, [
  mv("CORRUPT HEADER", "lightning", { gap: 2.25, seg: 6, w: 26 }),
  mv("HOLY NULL", "cage", { r: 215, gap: 8, beats: 18, n: 4 }),
  mv("EXCOMMUNICATE", "quadrant", { gap: 3, tele: 2.5 }),
]);
B("THE UNSENT LETTER", "Dear Whoever Is Still Listening", "It's been sealed for years, and every word of it is about you.", { bpm: 120, r: 48, look: { k: "glyph", n: 11, seed: 9 } }, [
  mv("RETURN TO SENDER", "recall", { n: 18, gap: 3, speed: 260, speed2: 300 }),
  mv("POISON PEN", "aimFan", { n: 9, spread: 1, curve: 0.55, lead: 0.5, speed: 250, gap: 1.5 }),
  mv("RUNNING INK", "rain", { n: 7, gap: 0.5, speed: 270, r: 8, tilt: 0.2 }),
  mv("POSTSCRIPT", "footsteps", { n: 9, gap: 2, r: 58 }),
  mv("READ BETWEEN", "rows", { n: 10, step: 0.28, fill: 0.72, back: true, beats: 12 }),
  mv("BLACKED OUT", "blackout", { n: 6, speed: 195, gap: 1.5 }),
  mv("LAST PARAGRAPH", "flatline", { gap: 5, n: 4 }),
]);
B("CERULEAN BUTCHER", "Clean Cuts, Reasonable Rates", "He's a professional. It will be over quickly, and he has other appointments.", { bpm: 152, r: 50, look: { k: "blade", n: 3, spin: 3.4 } }, [
  mv("PRIME RIB", "rakes", { n: 8, gap: 1.75, tilt: 0.65, w: 28 }),
  mv("CLEAVER DROP", "blocks", { gap: 0.75, w: 120, speed: 1150, aimEvery: 2 }),
  mv("BONING KNIFE", "crossfire", { n: 3, gap: 1.75, w: 20 }),
  mv("MEAT HOOK", "pendulum", { arms: 2, swing: 1.3, w: 24, len: 650, rate: 1.4 }),
  mv("SHARPENING STEEL", "sprinkler", { rate: 0.15, speed: 350, wide: 1.2, sweep: 0.35 }),
  mv("THE GOOD CUTS", "halfSlam", { gap: 1.75, tele: 1.75 }),
  mv("SAWDUST FLOOR", "swirl", { n: 16, speed: 225, curve: 1.1, gap: 1.5 }),
]);
B("PALE ARITHMETIC", "All Sums Come to This", "It has checked the math on you twice, and you do not carry.", { bpm: 138, r: 50, look: { k: "cube" } }, [
  mv("LONG FORM", "formation", { sides: 4, per: 10, gap: 2, speed: 225, R: 110 }),
  mv("REMAINDER ZERO", "quadrant", { gap: 2.75, tele: 2.25 }),
  mv("SQUARE ROOT", "checker", { cols: 6, rows: 4, gap: 1.5, tele: 1.75, beats: 14 }),
  mv("EXPONENT", "spiral", { arms: 6, rate: 0.75, step: 0.27, speed: 195, curve: 0.15 }),
  mv("DIVIDE BY YOU", "vice", { hole: 220, n: 4 }),
  mv("FACTORIAL", "bouncers", { n: 11, gap: 3, speed: 245, bounce: 3 }),
  mv("NEGATIVE SPACE", "tide", { hole: 225, n: 20, rate: 0.36, wave: 0.38 }),
]);
add(ECLIPSE, [
  mv("UMBRA", "blackout", { n: 7, speed: 205, gap: 1.5, pos: [640, 340] }),
  mv("MOONFALL", "comet", { gap: 1.75, speed: 760, tail: 2.2 }),
  mv("SUNSPOT", "starfall", { gap: 0.6, n: 9, speed: 200 }),
]);
B("GRIEF ENGINE", "Runs on What You Didn't Say", "Its fuel gauge has never once read empty.", { bpm: 128, r: 54, fl: "march", look: { k: "gear", n: 14, spin: 0.5 } }, [
  mv("PISTON SOB", "columns", { n: 16, step: 0.25, fill: 0.72, back: true, beats: 12 }),
  mv("REGRET LOOP", "boomerang", { n: 18, gap: 2.25, speed: 420, pull: 275 }),
  mv("EXHAUST", "well", { pull: 100, arms: 5, rate: 1, speed: 190 }),
  mv("FIVE STAGES", "formation", { sides: 5, per: 8, gap: 1.75, speed: 235 }),
  mv("WHAT YOU MEANT", "echo", { rate: 0.33, r: 46, n: 5 }),
  mv("OVERPRESSURE", "implode", { gap: 1.75, speed: 225, width: 0.8, holes: 2 }),
  mv("NOTHING LEFT", "flatline", { gap: 4.5, n: 5 }),
]);
B("THE VAST APPROVAL", "It Is So Proud of You", "Everything you did led here, and it has clapped the entire time.", { bpm: 132, r: 56, look: { k: "star", n: 12, inner: 0.72, spin: 0.25 } }, [
  mv("STANDING OVATION", "stepBurst", { n: 26, speed: 175, gap: 1.25 }),
  mv("GOLD STAR", "starfall", { gap: 0.5, n: 9, speed: 210, r: 84 }),
  mv("GOOD JOB", "ringGap", { holes: 2, width: 0.7, speed: 275, gap: 1.25 }),
  mv("BIG HUG", "cage", { r: 200, gap: 7, beats: 18, n: 5, drift: 60 }),
  mv("SO MUCH POTENTIAL", "corners", { gap: 1.5, w: 24 }),
  mv("TOP OF THE CLASS", "tide", { hole: 215, n: 20, rate: 0.38 }),
  mv("KEEP IT UP", "homing", { n: 9, gap: 2.25, speed: 205, turn: 2.2 }),
]);
B("EVENING ARCHON", "The Sun's Last Bureaucrat", "All light must be returned by close of business. It is almost five.", { bpm: 158, r: 56, fl: "break", look: { k: "orbit", n: 4 } }, [
  mv("CLOSE OF BUSINESS", "quadrant", { gap: 2.25, tele: 2 }),
  mv("DUSK ROTOR", "rotor", { n: 7, spin: 0.22, w: 18, n2: 14, pos: [640, 340] }),
  mv("STAMPED AND FILED", "blocks", { gap: 0.6, w: 120, speed: 1200, aimEvery: 2 }),
  mv("LIGHT RETURNED", "recall", { n: 22, gap: 2.75, speed: 275, speed2: 320 }),
  mv("LONG SHADOWS", "sweep", { w: 90, gap: 4.5 }),
  mv("NIGHT SHIFT", "blackout", { n: 8, speed: 215, gap: 1.25 }),
  mv("FINAL ARCHIVE", "lightning", { gap: 1.75, seg: 7, w: 28, aimed: true }),
]);
