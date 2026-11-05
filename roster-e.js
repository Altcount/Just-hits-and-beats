"use strict";
// The second fifty, part two.
B("HALLEY'S GRUDGE", "Back Every Seventy-Six Years", "Last time you weren't here. This time it checked the guest list.", { bpm: 140, r: 44, look: { k: "comet" } }, [
  mv("PERIHELION", "comet", { gap: 2.5, speed: 650 }),
  mv("TAIL OF ICE", "serpentine", { lanes: 2, rate: 0.25, speed: 330, amp: 110 }),
  mv("LONG ORBIT", "orbiters", { rings: [[230, 5, 0.24], [430, 7, -0.14]], pos: [640, 340] }),
  mv("IMPACT WINTER", "starfall", { gap: 0.6, n: 8, speed: 185, r: 92 }),
  mv("DEBRIS FIELD", "bouncers", { n: 11, gap: 3, speed: 250, bounce: 2 }),
  mv("EXTINCTION EVENT", "stack", { gap: 0.5, limit: 460, step: 115, n: 3 }),
  mv("SEVENTY-SIX YEARS", "recall", { n: 18, gap: 3, speed: 260, speed2: 300 }),
]);
B("THE FINE PRINT", "By Fighting You Agree", "Section nine clearly states you lose. You should have read section nine.", { bpm: 118, r: 50, look: { k: "sigil" } }, [
  mv("TERMS AND CONDITIONS", "rows", { n: 12, step: 0.3, fill: 0.62, beats: 12 }),
  mv("BINDING CIRCLE", "iris", { big: 540, small: 195, n: 5 }),
  mv("AUTO-RENEWAL", "ringGap", { holes: 2, width: 0.8, gap: 1.5, speed: 225, spin: 0.5 }),
  mv("HIDDEN CLAUSE", "lattice", { size: 190, gap: 2.25, w: 15 }),
  mv("COOLING-OFF PERIOD", "gale", { pull: 105, rate: 0.5, speed: 300 }),
  mv("SIGN HERE", "crosshair", { gap: 2, w: 28 }),
  mv("PENTAGRAM OF LIABILITY", "formation", { sides: 5, per: 9, gap: 2, speed: 225, R: 110 }),
]);
B("KRAKEN.SYS", "Has Stopped Responding", "Eight tentacles, one thread, and it will not release the handle.", { bpm: 106, r: 50, fl: "half", look: { k: "kraken" } }, [
  mv("TENTACLE LOCK", "wipers", { rate: 0.65, w: 30 }),
  mv("INK CLOUD", "blackout", { n: 7, speed: 190, gap: 1.75 }),
  mv("SUCKER PUNCH", "footsteps", { n: 8, gap: 2.25, r: 66 }),
  mv("DRAG BELOW", "well", { pull: 115, arms: 5, rate: 1, speed: 185 }),
  mv("CRUSH DEPTH", "vice", { hole: 215, n: 4 }),
  mv("MEMORY DUMP", "serpentine", { lanes: 5, rate: 0.25, amp: 80, speed: 290 }),
  mv("UNHANDLED EXCEPTION", "seeker", { n: 4, gap: 3.25, turn: 2.4, shards: 12 }),
]);
B("BLACK BLOOM", "Grown in a Quarantine Bay", "Do not water. Do not feed. Do not, under any circumstances, compliment it.", { bpm: 126, r: 48, look: { k: "rose" } }, [
  mv("OPENING PETALS", "flower", { n: 42, petals: 9, gap: 1.75, speed: 195 }),
  mv("THORNWORK", "rakes", { n: 8, gap: 2, tilt: 0.65 }),
  mv("POLLINATE", "fireworks", { gap: 0.9, n: 14, fuse: 0.9 }),
  mv("CREEPING VINE", "serpentine", { lanes: 3, rate: 0.2, speed: 310, amp: 130, wiggle: 3 }),
  mv("HOTHOUSE", "searchlight", { r: 200, rate: 0.62, n: 9 }),
  mv("NIGHTSHADE", "homing", { n: 10, gap: 2.5, speed: 200, turn: 2.2 }),
  mv("DEADHEADING", "pinwheel", { arms: 5, per: 8, spin: 0.26, space: 58, pos: [640, 320] }),
]);
B("RIBCAGE RADIO", "Broadcasting From Inside", "Tune in. It's your heartbeat on every channel, and the signal's getting closer.", { bpm: 132, r: 48, fl: "break", look: { k: "ribs" } }, [
  mv("HEARTBEAT", "ringPulse", { n: 26, speed: 190, gap: 1.5, twist: 0.13 }),
  mv("BONE CONDUCTION", "lightning", { gap: 2, seg: 6, w: 28, aimed: true }),
  mv("DEAD FREQUENCY", "ripples", { gap: 1, speed: 180 }),
  mv("BAD RECEPTION", "checker", { cols: 12, rows: 7, gap: 2, tele: 2, beats: 14 }),
  mv("PACEMAKER", "stepBurst", { n: 24, speed: 165, gap: 1.5 }),
  mv("VAGUS TUNER", "noose", { gap: 2.25, speed: 165, width: 0.9 }),
  mv("CARDIAC ARREST", "flatline", { gap: 5, n: 4 }),
]);
B("WICK THE UNBURNT", "Lit at Both Ends, Still Here", "Everyone told it that it couldn't last. They've all been gone a long time.", { bpm: 122, r: 48, look: { k: "candle" } }, [
  mv("TALLOW RAIN", "cover", { wide: 250, rate: 0.5, speed: 320 }),
  mv("MATCH HEAD", "fireworks", { gap: 0.8, n: 12, fuse: 0.8, fall: 150 }),
  mv("DRAFT FROM THE DOOR", "gale", { pull: 110, rate: 0.5, speed: 320, gap: 4 }),
  mv("SPLUTTER", "swirl", { n: 15, speed: 215, curve: 1.15, gap: 1.5 }),
  mv("SMOKE SIGNAL", "fountain", { rate: 0.2, speed: 470, wide: 1.2, fall: 400 }),
  mv("DARK ROOM", "blackout", { n: 8, speed: 200, gap: 1.5 }),
  mv("WAX PILLAR", "stack", { gap: 0.5, limit: 470, n: 4 }),
]);
B("SPUTNIK'S ORPHAN", "Still Waiting for a Reply", "It has been beeping since before your parents met. You're the first to answer.", { bpm: 136, r: 48, look: { k: "satellite" } }, [
  mv("LOW ORBIT", "orbiters", { rings: [[170, 6, 0.3], [340, 8, -0.2], [510, 9, 0.11]], pos: [640, 340] }),
  mv("BEEP", "turrets", { n: 3, gap: 0.5, speed: 280, spread: 0.25 }),
  mv("GROUND STATION", "bounceBeam", { gap: 1.75, bounces: 4, w: 22 }),
  mv("SOLAR PANEL", "halfSlam", { gap: 2, tele: 2 }),
  mv("KESSLER CASCADE", "sawblade", { n: 4, r: 26, speed: 300, shots: 4 }),
  mv("RE-ENTRY", "blocks", { gap: 0.6, w: 110, speed: 1150, aimEvery: 2 }),
  mv("COLD WAR LULLABY", "weave", { rate: 0.33, speed: 200, arms: true }),
]);
B("HIGH FIVE", "Do Not Leave It Hanging", "It's been holding that pose since the year it was built. Your turn.", { bpm: 128, r: 50, look: { k: "hand" } }, [
  mv("TOO SLOW", "footsteps", { n: 9, gap: 2, r: 70 }),
  mv("FINGER GUNS", "aimFan", { n: 5, spread: 0.45, speed: 340, gap: 1 }),
  mv("SLAP", "halfSlam", { axis: "y", gap: 1.75, tele: 1.75 }),
  mv("JAZZ HANDS", "pinwheel", { arms: 5, per: 7, spin: 0.3, pos: [640, 320] }),
  mv("THUMB WAR", "crosshair", { gap: 1.75, w: 30, tele: 1.75 }),
  mv("PALM READER", "seeker", { n: 4, gap: 3, turn: 2.5, shards: 12 }),
  mv("FIST BUMP", "vice", { hole: 200, n: 5 }),
]);
B("SAGUARO KID", "Fastest Spines in the West", "This arena's only big enough for one of you, and it's been standing here for a century.", { bpm: 124, r: 48, fl: "shuffle", look: { k: "cactus" } }, [
  mv("SPINE VOLLEY", "ringPulse", { n: 30, speed: 215, gap: 1.5, r: 7, twist: 0.1 }),
  mv("HIGH NOON", "searchlight", { r: 190, rate: 0.68, n: 9 }),
  mv("TUMBLEWEED", "sawblade", { n: 5, r: 24, speed: 320 }),
  mv("DUST DEVIL", "gale", { pull: 125, rate: 0.5, speed: 340, gap: 3.5 }),
  mv("QUICK DRAW", "corners", { gap: 1.25, w: 24 }),
  mv("DRY GULCH", "gapWall", { hole: 200, gap: 0.75, speed: 370, dir: "down", wave: 0.3 }),
  mv("SHOWDOWN", "mirrorfire", { gap: 1.25, r: 92, direct: true }),
]);
B("LIAR'S LATTICE", "Every Strand a Small Untruth", "It told you the way out was over there. It told the last one that, too.", { bpm: 116, r: 50, look: { k: "web" } }, [
  mv("TANGLED WEB", "web", { gap: 1, w: 15, slow: true }),
  mv("WHITE LIES", "lattice", { size: 175, gap: 2, w: 15 }),
  mv("FALSE EXIT", "gates", { hole: 175, gap: 2, both: true, speed: 360 }),
  mv("SPUN STORY", "weave", { rate: 0.25, speed: 210, step: 0.42 }),
  mv("CAUGHT OUT", "noose", { gap: 2, speed: 180, width: 0.85 }),
  mv("GOSSIP", "homing", { n: 11, gap: 2.25, speed: 205, turn: 2.3 }),
  mv("THE WHOLE TRUTH", "iris", { big: 500, small: 175, n: 6 }),
]);
B("BAD COIL", "Stores Energy, Holds Grudges", "Somebody compressed it once, in 1974, and it has been waiting to let that go.", { bpm: 148, r: 46, fl: "roll", look: { k: "spring" } }, [
  mv("BOING", "bouncers", { n: 13, gap: 2.5, speed: 270, bounce: 4 }),
  mv("TENSION", "vice", { axis: "y", hole: 190, n: 5 }),
  mv("RECOIL", "boomerang", { n: 20, gap: 2, speed: 440, pull: 290 }),
  mv("POGO", "teleBurst", { gap: 1.75, n: 13, speed: 195 }),
  mv("HOOKE'S LAW", "fountain", { rate: 0.17, speed: 480, wide: 1.3, fall: 420 }),
  mv("METAL FATIGUE", "comb", { n: 10, gap: 2.5, speed: 700 }),
  mv("SNAP BACK", "recall", { n: 22, gap: 2.75, speed: 290, speed2: 320 }),
]);
B("DJ FLATLINE", "One Night Only, Forever", "No requests. No encores. No exits, as far as anyone has been able to tell.", { bpm: 150, r: 50, fl: "four", look: { k: "vinyl" } }, [
  mv("NEEDLE DROP", "starfall", { gap: 0.5, n: 9, speed: 205, r: 88 }),
  mv("SCRATCH", "wipers", { rate: 0.85, w: 26 }),
  mv("BASS DROP", "halfSlam", { gap: 1.5, tele: 1.75 }),
  mv("BPM CHALLENGE", "stepBurst", { n: 26, speed: 180, gap: 1.25 }),
  mv("CROSSFADE", "pincer", { hole: 215, gap: 1.5, speed: 300 }),
  mv("LOCKED GROOVE", "pinwheel", { arms: 6, per: 8, spin: 0.3, space: 56, pos: [640, 320] }),
  mv("LAST CALL", "flatline", { gap: 4.5, n: 5 }),
]);
B("SOL INVICTUS", "Undefeated, and Very Smug", "It has watched every empire end. It's not even trying and you're squinting.", { bpm: 130, r: 54, home: 300, fl: "march", look: { k: "sunface" } }, [
  mv("SUNRISE LINE", "columns", { n: 12, step: 0.25, fill: 0.72, back: true, beats: 12 }),
  mv("HELIOPAUSE", "implode", { gap: 1.75, speed: 215, width: 0.8, center: true, pos: [640, 340] }),
  mv("CORONAL RAYS", "rotor", { n: 8, spin: 0.2, w: 20, n2: 14, pos: [640, 340] }),
  mv("BURNING GAZE", "searchlight", { r: 185, rate: 0.72, n: 10 }),
  mv("NOON EVERYWHERE", "ringPulse", { n: 34, speed: 230, gap: 1.25, twist: 0.09 }),
  mv("SOLAR WIND", "gale", { pull: 130, rate: 0.33, speed: 350, gap: 4 }),
  mv("DAWN OF EMPIRES", "fireworks", { gap: 0.6, n: 15, fuse: 0.85 }),
]);
B("QUEEN OF SPADES", "She Has Already Seen Your Hand", "Bet whatever you like. She's been dealing since before there was a table.", { bpm: 126, r: 50, fl: "shuffle", look: { k: "spade" } }, [
  mv("SHUFFLE THE DECK", "traffic", { lanes: 7, gap: 3, speed: 1200 }),
  mv("CUT THE CARDS", "crosshair", { gap: 1.75, w: 30 }),
  mv("ROYAL FLUSH", "formation", { sides: 5, per: 10, gap: 1.75, speed: 235, R: 120 }),
  mv("ACE UP THE SLEEVE", "seeker", { n: 5, gap: 3, turn: 2.5, shards: 13 }),
  mv("BLUFF", "mirrorfire", { gap: 1, r: 90, direct: true }),
  mv("ALL IN", "quadrant", { gap: 2.5, tele: 2 }),
  mv("DEAD MAN'S HAND", "sawblade", { n: 5, r: 26, speed: 330, shots: 5 }),
]);
B("THE BLACK LEDGER", "All Debts Come Due", "Your name's in here, in a hand you recognise. There's a date beside it.", { bpm: 112, r: 50, look: { k: "book" } }, [
  mv("PAGE TURN", "wipers", { rate: 0.75, w: 34 }),
  mv("ACCOUNTS PAYABLE", "gates", { hole: 165, gap: 1.75, both: true, speed: 380 }),
  mv("REDACTED", "blackout", { n: 9, speed: 210, gap: 1.5 }),
  mv("INTEREST ACCRUES", "ringGap", { holes: 2, width: 0.68, speed: 290, gap: 1.25 }),
  mv("PAPER TRAIL", "echo", { rate: 0.3, r: 48, n: 6 }),
  mv("FORECLOSURE", "iris", { big: 480, small: 165, n: 7 }),
  mv("CLOSING ENTRY", "lattice", { size: 165, gap: 1.75, w: 14 }),
]);
B("MISS RED LIGHT", "Stop. Go. Stop. You Moved.", "She doesn't care where you were going. She cares that you've moved.", { bpm: 142, r: 48, fl: "march", look: { k: "traffic" } }, [
  mv("RUSH HOUR", "traffic", { lanes: 8, gap: 2.75, speed: 1300, len: 300 }),
  mv("AMBER LIGHT", "stepBurst", { n: 28, speed: 185, gap: 1.25 }),
  mv("JAYWALKER", "crossfire", { n: 4, gap: 1.5, w: 20 }),
  mv("GRIDLOCK", "checker", { cols: 12, rows: 7, gap: 1.5, tele: 1.75, beats: 14 }),
  mv("SPEED CAMERA", "searchlight", { r: 175, rate: 0.78, n: 10 }),
  mv("HIT AND RUN", "comet", { gap: 1.5, speed: 800, tail: 2.4 }),
  mv("ROAD CLOSED", "comb", { n: 11, gap: 2.25, speed: 760 }),
]);
B("LA VEUVE", "The Widow Who Never Misses", "They called her a mercy, once. She's kept the title and let the mercy go.", { bpm: 110, r: 50, fl: "march", look: { k: "guillotine" } }, [
  mv("THE DROP", "blocks", { gap: 0.5, w: 140, speed: 1300, aimEvery: 2 }),
  mv("ROPE AND PULLEY", "pendulum", { arms: 2, swing: 1.3, w: 28, len: 720, rate: 1.5 }),
  mv("BASKET", "stack", { gap: 0.4, limit: 480, step: 120, n: 5 }),
  mv("REIGN OF TERROR", "starfall", { gap: 0.4, n: 10, speed: 215, r: 90 }),
  mv("COURTYARD CROWD", "homing", { n: 13, gap: 2.25, speed: 215, turn: 2.4 }),
  mv("SWIFT JUSTICE", "halfSlam", { gap: 1.25, tele: 1.5 }),
  mv("LAST WORDS", "noose", { gap: 1.75, speed: 195, width: 0.8 }),
]);
