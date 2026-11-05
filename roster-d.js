"use strict";
// The second fifty, part one. These come after Eclipse's successors and before the finale.
B("ABDUCTOR NINE", "Probably Just Curious", "It has crossed eleven galaxies to ask you one question. The question is a beam.", { bpm: 124, r: 50, look: { k: "ufo" } }, [
  mv("TRACTOR BEAM", "searchlight", { r: 240, n: 6 }),
  mv("CROP CIRCLES", "ripples", { gap: 2, speed: 150 }),
  mv("MOTHERSHIP HUM", "pinwheel", { arms: 3, per: 6, spin: 0.16, pos: [640, 320] }),
  mv("FIRST CONTACT PROTOCOL", "bounceBeam", { gap: 3, bounces: 3 }),
  mv("SAUCER DROP", "starfall", { gap: 1.25, n: 7 }),
  mv("MISSING TIME", "blackout", { n: 5, speed: 170, gap: 2 }),
  mv("TAKE ME TO YOUR LEADER", "homing", { n: 6, gap: 3, speed: 175 }),
]);
B("THE GHOSTWRITER", "Finishes Other People's Sentences", "Everything you've ever said was its idea. It would like the credit now.", { bpm: 116, r: 48, fl: "half", look: { k: "ghost" } }, [
  mv("DEAD LETTER", "serpentine", { lanes: 2, rate: 0.5, speed: 220 }),
  mv("SPOOKY FOOTNOTE", "mirrorfire", { gap: 2, r: 74 }),
  mv("PHANTOM DRAFT", "seeker", { n: 2, gap: 4.5, speed: 170 }),
  mv("REWRITE", "recall", { n: 12, gap: 4, speed: 220, speed2: 230 }),
  mv("WRITER'S BLOCK", "stack", { gap: 1, n: 3 }),
  mv("HAUNTED MARGIN", "gates", { hole: 240, gap: 3.5 }),
  mv("CHILLING PREFACE", "weave", { rate: 0.75, speed: 150 }),
]);
B("MYCELIUM PRINCE", "Heir to Everything Underground", "Every forest you've ever walked through was one long, patient conversation about you.", { bpm: 104, r: 50, fl: "half", look: { k: "mushroom" } }, [
  mv("SPORE BLOOM", "fireworks", { gap: 2, n: 10, fuse: 1.1 }),
  mv("HYPHAL NET", "lattice", { size: 260, gap: 3.5, w: 16 }),
  mv("FAIRY RING", "noose", { gap: 3.5, r: 340, width: 1.2 }),
  mv("DECOMPOSE", "mines", { gap: 1, n: 7, speed: 145 }),
  mv("UNDERGROWTH", "fountain", { rate: 0.33, speed: 400, wide: 1 }),
  mv("ROYAL ROT", "homing", { n: 5, gap: 3.5, turn: 1.6 }),
  mv("TOADSTOOL THRONE", "flower", { n: 28, petals: 5, gap: 2.25, speed: 160 }),
]);
B("ANGLER OF THE DEEP WEB", "Don't Click the Light", "It's the prettiest thing down here, and it knows that you've been lonely.", { bpm: 112, r: 46, look: { k: "fish" } }, [
  mv("LURE", "searchlight", { r: 225, rate: 0.5 }),
  mv("BAITED HOOK", "pendulum", { swing: 1.1, w: 22, len: 620 }),
  mv("PRESSURE DROP", "well", { pull: 60, arms: 3, rate: 1, speed: 150 }),
  mv("BIOLUMINESCENCE", "ripples", { gap: 1.25, speed: 165 }),
  mv("BENTHIC SNAP", "charge", { gap: 3.5, tele: 2.5, n: 7 }),
  mv("PHISHING TRIP", "seeker", { n: 3, gap: 4, turn: 2 }),
  mv("MARIANA CURRENT", "serpentine", { lanes: 3, rate: 0.33, amp: 120, wiggle: 3 }),
]);
B("EXCALIBYTE", "Pulled From a Stone, Then Patched", "Only the rightful ruler can wield it. The licence has expired.", { bpm: 138, r: 48, look: { k: "sword" } }, [
  mv("ROUND TABLE", "pinwheel", { arms: 5, per: 6, spin: 0.2, pos: [640, 320] }),
  mv("KING'S CUT", "crosshair", { gap: 3, w: 24 }),
  mv("LADY OF THE LAKE", "ringGap", { holes: 2, width: 0.85, gap: 2, speed: 215 }),
  mv("SQUIRE'S OATH", "aimFan", { n: 5, spread: 0.6, speed: 270, gap: 1.5 }),
  mv("CALIBURN SWEEP", "sweep", { w: 70, gap: 6 }),
  mv("HOLY HAND GLITCH", "splitShot", { n: 13, speed2: 190, gap: 2 }),
  mv("ONCE AND FUTURE", "bounceBeam", { gap: 2.5, bounces: 4, w: 22 }),
]);
B("SISTER TOLL", "The Bell Rings for Thee", "She's been counting for six hundred years. She has reached your number.", { bpm: 92, r: 52, fl: "march", look: { k: "bell" } }, [
  mv("VESPER PEAL", "ringPulse", { n: 22, speed: 170, gap: 2 }),
  mv("CLAPPER", "pendulum", { swing: 1.2, w: 34, len: 640 }),
  mv("BELFRY BATS", "homing", { n: 7, gap: 3, speed: 185, turn: 2 }),
  mv("NINE TAILORS", "domino", { gap: 3, r: 78 }),
  mv("REQUIEM TIDE", "implode", { gap: 2.5, speed: 170 }),
  mv("SILENT NIGHT WATCH", "blackout", { n: 6, speed: 175, gap: 1.75 }),
  mv("LAST RITES", "noose", { gap: 2.75, speed: 150 }),
]);
B("THE SKELETON KEY", "Fits Every Lock You Own", "It has already been inside your house. It just came back to check the windows.", { bpm: 130, r: 46, look: { k: "key" } }, [
  mv("TUMBLERS", "comb", { n: 8, gap: 3.5, speed: 560 }),
  mv("DEADBOLT", "gates", { hole: 215, gap: 2.75, both: true, speed: 320 }),
  mv("PICK THE LOCK", "crosshair", { gap: 2.75, tele: 2.25 }),
  mv("MASTER COPY", "formation", { sides: 4, per: 8, gap: 2.5, speed: 200 }),
  mv("BREAK AND ENTER", "charge", { gap: 3, tele: 2.25, n: 8 }),
  mv("JIMMIED WINDOW", "rakes", { n: 6, gap: 2.25, tilt: 0.5 }),
  mv("SKELETON CREW", "turrets", { n: 3, gap: 1, spread: 0.3 }),
]);
B("NIMBUS REX", "A Weather System With Opinions", "Forecast: eighty percent chance of a personal vendetta.", { bpm: 118, r: 52, home: 150, look: { k: "cloud" } }, [
  mv("COLD FRONT", "cover", { wide: 300, rate: 0.75, speed: 260 }),
  mv("THUNDERHEAD", "lightning", { gap: 2.5, seg: 5 }),
  mv("GUST WARNING", "gale", { pull: 80, rate: 0.75, speed: 260 }),
  mv("HAILSTONE", "rain", { n: 5, gap: 0.5, speed: 280, r: 11 }),
  mv("BALL LIGHTNING", "seeker", { n: 3, gap: 4, speed: 195 }),
  mv("EYE OF THE STORM", "iris", { big: 580, small: 210, n: 4 }),
  mv("TROPICAL DEPRESSION", "swirl", { n: 13, speed: 195, curve: 1, gap: 2 }),
]);
B("WINTER PROTOCOL", "Scheduled Maintenance of the Sun", "Your warmth has been deprecated. Please migrate to the cold.", { bpm: 110, r: 48, look: { k: "snowflake" } }, [
  mv("FLURRY", "rain", { n: 4, gap: 0.5, speed: 170, r: 8, tilt: 0.35 }),
  mv("SIX-FOLD SYMMETRY", "formation", { sides: 6, per: 6, gap: 2.5, speed: 185 }),
  mv("FROSTBITE", "stepBurst", { n: 20, speed: 135, gap: 2 }),
  mv("BLACK ICE PATCH", "web", { gap: 1.5, w: 14, slow: true }),
  mv("AVALANCHE", "stack", { gap: 0.75, n: 4, limit: 420 }),
  mv("FLASH FREEZE", "lattice", { size: 240, gap: 2.75, w: 18 }),
  mv("PERMAFROST", "pinwheel", { arms: 6, per: 7, spin: 0.14, pos: [640, 320] }),
]);
B("TIN MARTYR", "Died for Your Warranty", "It rebuilt itself from spite and a toaster. It only knows one hymn.", { bpm: 134, r: 50, fl: "march", look: { k: "robot" } }, [
  mv("ASSEMBLY LINE", "traffic", { lanes: 6, gap: 4, speed: 1000 }),
  mv("RIVET GUN", "turrets", { n: 4, gap: 0.75, speed: 260 }),
  mv("SERVO WHINE", "sprinkler", { rate: 0.2, speed: 280, wide: 1.3 }),
  mv("BLOWN CAPACITOR", "starfall", { gap: 0.75, n: 8, speed: 175 }),
  mv("LASER WELD", "bounceBeam", { gap: 2, bounces: 3, w: 24 }),
  mv("RECYCLE BIN", "well", { pull: 75, arms: 4, rate: 1, speed: 165 }),
  mv("BLUE SCREEN HYMN", "checker", { cols: 10, rows: 6, gap: 2.25, tele: 2.25, beats: 14 }),
]);
B("YGGDRASIL.EXE", "Every Branch a Merge Conflict", "Nine worlds, one root directory, and absolutely nobody has read the documentation.", { bpm: 102, r: 54, fl: "half", look: { k: "tree" } }, [
  mv("ROOT ACCESS", "lightning", { gap: 2.25, seg: 6, w: 26 }),
  mv("BRANCH PREDICTION", "fountain", { rate: 0.25, speed: 440, wide: 1.1 }),
  mv("FORK BOMB", "fireworks", { gap: 1.25, n: 12, fuse: 0.9 }),
  mv("WORLD SERPENT THREAD", "serpentine", { lanes: 4, rate: 0.33, amp: 75 }),
  mv("LEAF NODE", "rain", { dir: "right", n: 4, gap: 0.5, speed: 230, r: 8, tilt: 0.3 }),
  mv("GARBAGE RAGNAROK", "implode", { gap: 2.25, speed: 185, center: true, pos: [640, 340] }),
  mv("RUNE COMMIT", "domino", { gap: 2.5, r: 80, step: 0.2 }),
]);
B("THE NIGHT AUDITOR", "Your Figures Do Not Add Up", "It sees all your receipts in the dark. Who, it asks. Who approved this?", { bpm: 108, r: 50, look: { k: "owl" } }, [
  mv("TWO WIDE EYES", "mirrorfire", { gap: 1.75, r: 80, direct: true }),
  mv("SILENT WINGS", "blackout", { n: 6, speed: 180, gap: 1.75 }),
  mv("TALON SWOOP", "charge", { gap: 3, tele: 2.5, n: 9 }),
  mv("PELLET", "splitShot", { n: 14, speed: 260, speed2: 185, gap: 2 }),
  mv("HEAD TURN", "wipers", { rate: 0.55 }),
  mv("BALANCE THE BOOKS", "checker", { cols: 8, rows: 4, gap: 2, tele: 2.25, beats: 14 }),
  mv("FISCAL MIDNIGHT", "searchlight", { r: 205, rate: 0.6, n: 7 }),
]);
B("PHARAOH OF THE STACK", "Mummified in Legacy Code", "It was buried with everything it needed. Nobody was able to find the source.", { bpm: 96, r: 54, fl: "march", look: { k: "pyramid" } }, [
  mv("CAPSTONE", "blocks", { gap: 1, w: 150, speed: 950 }),
  mv("SAND TOMB", "stack", { gap: 0.6, limit: 440, step: 110 }),
  mv("CURSE OF THE MAINFRAME", "seeker", { n: 3, gap: 3.5, turn: 2.3, shards: 11 }),
  mv("EYE OF RA", "sweep", { w: 80, gap: 5.5 }),
  mv("THE FALSE DOOR", "gates", { hole: 200, gap: 2.5, both: true }),
  mv("PLAGUE OF LOCUSTS", "homing", { n: 8, gap: 2.75, speed: 190, turn: 2 }),
  mv("NILE FLOOD", "tide", { hole: 250, n: 14, rate: 0.28 }),
]);
B("CASTELLAN ROOK", "Moves in Straight Lines Only", "It has defended this corner since the opening. You are, it regrets, on its file.", { bpm: 120, r: 50, fl: "march", look: { k: "rook" } }, [
  mv("OPEN FILE", "columns", { n: 8, step: 0.4, fill: 0.7, back: true, beats: 14 }),
  mv("OPEN RANK", "rows", { n: 6, step: 0.5, fill: 0.72, back: true, beats: 14 }),
  mv("CASTLING", "teleBurst", { gap: 2.25, n: 12, speed: 180 }),
  mv("PORTCULLIS", "vice", { axis: "y", hole: 210, n: 3 }),
  mv("ZUGZWANG", "crosshair", { gap: 2.25, w: 26 }),
  mv("BATTLEMENTS", "comb", { n: 8, gap: 3, speed: 640 }),
  mv("BOILING OIL", "cover", { wide: 260, rate: 0.5, speed: 300 }),
]);
B("LADY SNAKE EYES", "The House Always Wins", "She's never once rolled anything else, and she's never once been asked to leave.", { bpm: 128, r: 46, fl: "shuffle", look: { k: "dice" } }, [
  mv("LOADED ROLL", "quadrant", { gap: 3.25, tele: 2.75 }),
  mv("DOUBLE OR NOTHING", "mirrorfire", { gap: 1.5, r: 88 }),
  mv("BOXCARS", "traffic", { lanes: 5, gap: 3.5, speed: 1100 }),
  mv("HOUSE EDGE", "bouncers", { n: 10, gap: 3, speed: 240, bounce: 3 }),
  mv("SEVEN OUT", "formation", { sides: 7, per: 5, gap: 2.25, speed: 205 }),
  mv("HIGH ROLLER", "sawblade", { n: 3, r: 28, shots: 3 }),
  mv("CROOKED CROUPIER", "recall", { n: 16, gap: 3.25, speed: 250, speed2: 275 }),
]);
B("MAESTRO DISSONANCE", "Conducts With a Bone Saw", "The orchestra stopped playing years ago. He's still counting them in.", { bpm: 144, r: 50, fl: "break", look: { k: "piano" } }, [
  mv("TRITONE", "weave", { rate: 0.5, speed: 185, arms: true }),
  mv("BLACK KEYS", "columns", { n: 7, step: 0.35, fill: 0.8, beats: 12 }),
  mv("STACCATO", "stepBurst", { n: 22, speed: 150, gap: 1.5 }),
  mv("GRAND FINALE", "fireworks", { gap: 1, n: 13, fuse: 0.85 }),
  mv("POLYRHYTHM", "lattice", { size: 200, gap: 2.25, w: 16 }),
  mv("CRESCENDO", "ringGap", { holes: 2, width: 0.72, speed: 265, gap: 1.5 }),
  mv("BATON SNAP", "aimFan", { n: 7, spread: 0.7, speed: 285, gap: 1.25 }),
]);
B("DEAD WEIGHT", "It Was Always Going to Sink", "It would like you to come down and see the bottom. There's plenty of room.", { bpm: 88, r: 52, fl: "half", look: { k: "anchor" } }, [
  mv("SOUNDING LINE", "pendulum", { arms: 2, swing: 1.25, w: 24, len: 680, rate: 1 }),
  mv("BARNACLE", "mines", { gap: 0.6, n: 7, speed: 165, fuse: 3.5 }),
  mv("TIDAL GATE", "gates", { hole: 195, gap: 2.25, speed: 350 }),
  mv("CHAIN LOCKER", "cage", { r: 210, gap: 8, beats: 18, n: 4 }),
  mv("BOTTOM FEEDER", "homing", { n: 9, gap: 2.5, speed: 195, turn: 2.1 }),
  mv("UNDERSEA CABLE", "serpentine", { lanes: 4, rate: 0.25, amp: 100, speed: 280 }),
  mv("ALL HANDS LOST", "well", { pull: 105, arms: 4, rate: 1, speed: 180 }),
]);
