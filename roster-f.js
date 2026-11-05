"use strict";
// The second fifty, part three, then the finale, which always stays at the very end.
B("TRUE PRISM", "Splits Everything, Including Hairs", "It takes one clean line of light and makes it everybody's problem.", { bpm: 134, r: 50, look: { k: "prism" } }, [
  mv("REFRACTION", "bounceBeam", { gap: 1.5, bounces: 5, w: 20 }),
  mv("FULL SPECTRUM SPLIT", "rakes", { n: 9, gap: 1.75, tilt: 0.42, w: 24 }),
  mv("WHITE LIGHT", "splitShot", { n: 18, speed: 310, speed2: 215, gap: 1.5 }),
  mv("ANGLE OF INCIDENCE", "corners", { gap: 1.25, w: 26 }),
  mv("CAUSTICS", "ripples", { gap: 0.75, speed: 200 }),
  mv("CHROMATIC SHIFT", "sprinkler", { rate: 0.13, speed: 340, wide: 1.5, sweep: 0.26 }),
  mv("TOTAL INTERNAL", "iris", { big: 470, small: 170, n: 7 }),
]);
B("THE MOBIUS HEIR", "One Side, No Way Out", "Keep walking. You'll get back here eventually, and you'll be on the other side of it.", { bpm: 140, r: 50, look: { k: "infinity" } }, [
  mv("ENDLESS LOOP", "orbiters", { rings: [[200, 8, 0.34], [380, 10, -0.22], [540, 11, 0.13]], pos: [640, 340] }),
  mv("HALF TWIST", "weave", { rate: 0.25, speed: 225, step: 0.3, arms: true }),
  mv("SAME PLACE AGAIN", "echo", { rate: 0.28, r: 50, n: 6 }),
  mv("RECURSIVE CALL", "boomerang", { n: 24, gap: 1.75, speed: 470, pull: 310 }),
  mv("STACK OVERFLOW", "stack", { gap: 0.35, limit: 490, step: 120, n: 6 }),
  mv("EIGHT ON ITS SIDE", "wipers", { rate: 0.95, w: 28 }),
  mv("GROUNDHOG LOOP", "recall", { n: 26, gap: 2.25, speed: 310, speed2: 340 }),
]);
B("THE LAST KEEPER", "Still Tending the Light", "There hasn't been a ship in a thousand years. It isn't really waiting for ships.", { bpm: 100, r: 50, home: 170, fl: "half", look: { k: "lighthouse" } }, [
  mv("LONG BEAM", "sweep", { w: 96, gap: 4.25 }),
  mv("FOGHORN", "ringPulse", { n: 36, speed: 240, gap: 1.25, r: 9, twist: 0.08 }),
  mv("ROCKS AHEAD", "turrets", { n: 6, gap: 0.5, speed: 300, spread: 0.45 }),
  mv("LAMP OIL", "searchlight", { r: 170, rate: 0.82, n: 11 }),
  mv("STORM SURGE", "gale", { pull: 140, rate: 0.25, speed: 360, gap: 3.5 }),
  mv("SHIPWRECK SHOALS", "mines", { gap: 0.33, n: 9, speed: 195, fuse: 2.75 }),
  mv("NOBODY COMING", "blackout", { n: 10, speed: 220, gap: 1.25 }),
]);
B("SCARAB PROTOCOL", "Rolls the Sun Uphill Daily", "It won't stop. It can't stop. It would very much like you to get out of the way.", { bpm: 152, r: 48, look: { k: "beetle" } }, [
  mv("DUNG BALL", "sawblade", { n: 6, r: 32, speed: 340 }),
  mv("CARAPACE", "pincer", { hole: 195, gap: 1.25, speed: 330 }),
  mv("BURROW", "teleBurst", { gap: 1.5, n: 15, speed: 215 }),
  mv("MANDIBLES", "vice", { hole: 185, n: 6 }),
  mv("SAND SKITTER", "footsteps", { n: 10, gap: 1.75, r: 68 }),
  mv("SACRED ROLL", "charge", { gap: 2.5, tele: 2, n: 12 }),
  mv("TOMB SWARM", "homing", { n: 15, gap: 2, speed: 225, turn: 2.5 }),
]);
B("MISTER PRESTO", "And For My Next Trick", "Pick a card. Any card. It's the one with your name on, they all are.", { bpm: 138, r: 48, fl: "shuffle", look: { k: "tophat" } }, [
  mv("NOW YOU SEE ME", "blackout", { n: 11, speed: 225, gap: 1.25 }),
  mv("SAWN IN HALF", "halfSlam", { axis: "y", gap: 1.25, tele: 1.5 }),
  mv("RABBIT OUT", "fireworks", { gap: 0.5, n: 16, fuse: 0.8 }),
  mv("ENDLESS SCARVES", "serpentine", { lanes: 5, rate: 0.17, amp: 110, speed: 340 }),
  mv("MISDIRECTION", "mirrorfire", { gap: 0.9, r: 94, direct: true }),
  mv("THE DISAPPEARING BOX", "teleBurst", { gap: 1.25, n: 16, speed: 225 }),
  mv("TA-DA", "flower", { n: 52, petals: 11, gap: 1.25, speed: 225 }),
]);
B("DOCTOR MIASMA", "The Treatment Is Worse", "Breathe in. Hold it. Hold it. You've been cured of quite a few things already.", { bpm: 118, r: 50, look: { k: "plague" } }, [
  mv("BAD AIR", "well", { pull: 125, arms: 6, rate: 1, speed: 195 }),
  mv("LEECHES", "homing", { n: 17, gap: 2, speed: 230, turn: 2.6 }),
  mv("HOUSE CALL", "crosshair", { gap: 1.25, w: 30, tele: 1.5 }),
  mv("QUARANTINE", "cage", { r: 190, gap: 7, beats: 18, n: 6, drift: 70 }),
  mv("BLOODLETTING", "fountain", { rate: 0.13, speed: 500, wide: 1.4, fall: 430 }),
  mv("BLACK BILE", "mines", { gap: 0.3, n: 10, speed: 205, fuse: 2.5 }),
  mv("SECOND OPINION", "seeker", { n: 6, gap: 2.75, turn: 2.6, shards: 14 }),
]);
B("THE STARGAZER", "Your Fate Is Mostly Geometry", "It has charted every star, and it's fairly sure you're a rounding error.", { bpm: 124, r: 50, look: { k: "astrolabe" } }, [
  mv("ARMILLARY", "orbiters", { rings: [[160, 7, 0.4], [320, 10, -0.28], [480, 12, 0.18]], pos: [640, 340] }),
  mv("ZODIAC WHEEL", "pinwheel", { arms: 8, per: 7, spin: 0.26, space: 58, pos: [640, 320] }),
  mv("METEOR SHOWER", "rain", { dir: "left", n: 8, gap: 0.5, speed: 340, r: 8, tilt: 0.35 }),
  mv("ECLIPTIC", "rotor", { n: 9, spin: 0.24, w: 18, n2: 16, pos: [640, 340] }),
  mv("CONJUNCTION", "corners", { gap: 1, w: 28 }),
  mv("BAD HOROSCOPE", "lattice", { size: 150, gap: 1.5, w: 14 }),
  mv("RETROGRADE", "recall", { n: 30, gap: 2, speed: 330, speed2: 360 }),
]);
B("VOID SHEPHERD", "Counts Every One of You", "It knows when one has wandered off. It always goes and brings them back.", { bpm: 108, r: 50, fl: "half", look: { k: "crook" } }, [
  mv("THE FLOCK", "homing", { n: 20, gap: 1.75, speed: 235, turn: 2.6, time: 3 }),
  mv("BELLWETHER", "seeker", { n: 7, gap: 2.5, turn: 2.8, shards: 15 }),
  mv("CROOK AND PULL", "well", { pull: 145, arms: 6, rate: 0.75, speed: 205 }),
  mv("GREENER PASTURE", "iris", { big: 450, small: 160, n: 8 }),
  mv("SHEPHERD'S HOOK", "wipers", { rate: 1.05, w: 32 }),
  mv("VOID FOLD", "implode", { gap: 1.25, speed: 245, width: 0.72, holes: 2 }),
  mv("COUNTING SHEEP", "stepBurst", { n: 32, speed: 195, gap: 1 }),
]);
B("IRON DIRIGIBLE", "Absolutely Cannot Fall", "The engineers checked this very carefully, and then they all quietly resigned.", { bpm: 96, r: 52, home: 140, fl: "march", look: { k: "blimp" } }, [
  mv("PAYLOAD", "blocks", { gap: 0.45, w: 150, speed: 1250, aimEvery: 2 }),
  mv("BOMB BAY", "cover", { wide: 225, rate: 0.33, speed: 360 }),
  mv("GUN GONDOLA", "turrets", { n: 7, gap: 0.45, speed: 320, spread: 0.5 }),
  mv("AIR RAID", "starfall", { gap: 0.33, n: 11, speed: 225, r: 94 }),
  mv("PROPELLER WASH", "gale", { pull: 150, rate: 0.25, speed: 380, gap: 3 }),
  mv("FLAK BURST", "fireworks", { gap: 0.4, n: 18, fuse: 0.75 }),
  mv("CRASH POSITION", "stack", { gap: 0.3, limit: 500, step: 120, n: 7 }),
]);
B("STINGER MK IV", "Three Earlier Models Survived", "They're not in great shape. Mark IV fixed that oversight.", { bpm: 156, r: 48, fl: "roll", look: { k: "scorpion" } }, [
  mv("TAIL STRIKE", "lightning", { gap: 1.25, seg: 7, w: 28, aimed: true }),
  mv("PINCER MOVEMENT", "pincer", { hole: 185, gap: 1, speed: 360 }),
  mv("VENOM SAC", "splitShot", { n: 20, speed: 340, speed2: 230, gap: 1.25 }),
  mv("DESERT NIGHT", "searchlight", { r: 165, rate: 0.85, n: 12 }),
  mv("EXOSKELETON", "comb", { n: 12, gap: 2, speed: 820 }),
  mv("NEUROTOXIN", "ripples", { gap: 0.6, speed: 215 }),
  mv("MARK IV", "aimFan", { n: 11, spread: 1, speed: 350, gap: 1 }),
]);
B("GOLEM OF PROMISES", "Clay, Oath and Bad Planning", "Someone wrote one word on its forehead. Nobody remembers quite which word.", { bpm: 90, r: 54, fl: "half", look: { k: "golem" } }, [
  mv("HEAVY STEP", "domino", { gap: 1.75, r: 92, step: 0.18 }),
  mv("BROKEN VOW", "quadrant", { gap: 2, tele: 1.75 }),
  mv("CLAY FIST", "charge", { gap: 2.5, tele: 2, n: 14 }),
  mv("MUD SLIDE", "tide", { hole: 215, n: 22, rate: 0.42, wave: 0.36 }),
  mv("WORD ON THE BROW", "crosshair", { gap: 1.1, w: 32, tele: 1.5 }),
  mv("FOUNDATION", "vice", { axis: "y", hole: 170, n: 6 }),
  mv("CRUMBLE", "bouncers", { n: 18, gap: 2.25, speed: 285, bounce: 3 }),
]);
B("THREE-FACED TOTEM", "They Disagree About You", "One wants you gone, one wants you dead, and the middle one's just tired.", { bpm: 128, r: 50, fl: "march", look: { k: "totem" } }, [
  mv("TOP FACE", "ringGap", { holes: 2, width: 0.65, speed: 300, gap: 1 }),
  mv("MIDDLE FACE", "pinwheel", { arms: 9, per: 8, spin: 0.3, space: 54, pos: [640, 320] }),
  mv("BOTTOM FACE", "fountain", { rate: 0.1, speed: 520, wide: 1.5, fall: 440 }),
  mv("WAR PAINT", "rakes", { n: 10, gap: 1.5, tilt: 0.7, w: 28 }),
  mv("SPIRIT ANIMAL", "sawblade", { n: 7, r: 26, speed: 360, shots: 6 }),
  mv("CARVED IN CEDAR", "gates", { hole: 155, gap: 1.5, both: true, speed: 400 }),
  mv("ANCESTRAL VOTE", "mirrorfire", { gap: 0.75, r: 96, direct: true }),
]);
B("WARDRUM", "It Never Asked Who Started It", "Every army it ever played for is gone. It keeps time for whoever's left.", { bpm: 164, r: 50, fl: "march", look: { k: "drum" } }, [
  mv("MARCHING ORDERS", "columns", { n: 16, step: 0.2, fill: 0.72, back: true, beats: 10 }),
  mv("ROLL CALL", "rows", { n: 12, step: 0.22, fill: 0.68, back: true, beats: 10 }),
  mv("TIMPANI", "starfall", { gap: 0.25, n: 12, speed: 235, r: 96 }),
  mv("PARADIDDLE", "stepBurst", { n: 36, speed: 205, gap: 0.75 }),
  mv("BATTLE CADENCE", "checker", { cols: 14, rows: 8, gap: 1.25, tele: 1.5, beats: 14 }),
  mv("DOUBLE TIME", "pincer", { hole: 175, gap: 0.75, speed: 390 }),
  mv("FINAL SALVO", "flatline", { gap: 4, n: 6 }),
]);
B("MEGALODON.DLL", "Required by Nothing, Runs Anyway", "Everyone said it was extinct. It's been running in the background the entire time.", { bpm: 144, r: 50, look: { k: "shark" } }, [
  mv("BLOOD IN THE PACKETS", "charge", { gap: 2, tele: 1.75, n: 16 }),
  mv("FEEDING FRENZY", "homing", { n: 24, gap: 1.75, speed: 245, turn: 2.8 }),
  mv("ROW OF TEETH", "comb", { n: 13, gap: 1.75, speed: 880 }),
  mv("BIGGER BOAT", "gates", { hole: 150, gap: 1.25, both: true, speed: 420 }),
  mv("DORSAL WAKE", "serpentine", { lanes: 6, rate: 0.13, amp: 95, speed: 370 }),
  mv("DEEP DIVE", "implode", { gap: 1, speed: 265, width: 0.7, center: true, pos: [640, 340] }),
  mv("JAWS OF THE SYSTEM", "vice", { hole: 170, n: 8 }),
]);
B("MOTHER MEDUSA", "Don't Look Directly at the Hair", "It's not stone that gets you. It's how she stares until you start to believe it.", { bpm: 120, r: 52, look: { k: "jelly", n: 9 } }, [
  mv("STINGING VEIL", "cover", { wide: 205, rate: 0.25, speed: 390 }),
  mv("PETRIFY", "stepBurst", { n: 40, speed: 215, gap: 0.75 }),
  mv("TENTACLE DRIFT", "serpentine", { lanes: 7, rate: 0.13, amp: 130, speed: 310, wiggle: 2.5 }),
  mv("BLOOM TIDE", "tide", { hole: 200, n: 24, rate: 0.46, wave: 0.34 }),
  mv("GORGON GAZE", "searchlight", { r: 155, rate: 0.9, n: 13 }),
  mv("POLYP BROOD", "seeker", { n: 8, gap: 2.25, turn: 3, shards: 16 }),
  mv("BLOODLESS PULSE", "noose", { gap: 1.1, speed: 225, width: 0.75 }),
]);
B("NOCTURNE", "The Last Thing Before the End", "It only comes out when the music's nearly over. It's been listening the whole time.", { bpm: 160, r: 52, fl: "roll", look: { k: "wings", flap: 6 } }, [
  mv("ECHOLOCATION", "ripples", { gap: 0.45, speed: 230 }),
  mv("WING BLADE", "wipers", { rate: 1.2, w: 34 }),
  mv("MOONLIT SWARM", "homing", { n: 28, gap: 1.5, speed: 255, turn: 3 }),
  mv("DUSK FALL", "fireworks", { gap: 0.33, n: 20, fuse: 0.7 }),
  mv("BLOOD MOON", "iris", { big: 430, small: 150, n: 9 }),
  mv("HANGING UPSIDE DOWN", "lattice", { size: 135, gap: 1.25, w: 13 }),
  mv("FINAL NOCTURNE", "weave", { rate: 0.17, speed: 255, step: 0.26, arms: true }),
]);

add(CHOIR, []);
add(ZERO, [
  mv("DEAD AIR", "implode", { gap: 1.5, speed: 240, width: 0.75, center: true, pos: [640, 340] }),
  mv("CARRIER WAVE", "gapWall", { hole: 195, gap: 0.75, speed: 380, wave: 0.28 }),
  mv("THE LAST SAMPLE", "recall", { n: 26, gap: 2.5, speed: 300, speed2: 340 }),
  mv("BELOW THE NOISE FLOOR", "quadrant", { gap: 2, tele: 1.75 }),
]);
