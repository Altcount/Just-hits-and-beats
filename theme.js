"use strict";
// The one neon colour the whole game is drawn in. Everything reads these instead of a fixed colour.
let CY = "#00f0ff", ICE = "#d8ffff", DARK = "#001114", NEON = "0,240,255", ICE_RGB = "216,255,255";

const NEON_PRESETS = [
  { name: "CYAN", hue: 184 }, { name: "ELECTRIC BLUE", hue: 214 }, { name: "ULTRAVIOLET", hue: 268 },
  { name: "MAGENTA", hue: 300 }, { name: "HOT PINK", hue: 328 }, { name: "LASER RED", hue: 356 },
  { name: "BLAZE", hue: 24 }, { name: "SOLAR", hue: 54 }, { name: "ACID", hue: 76 }, { name: "TOXIC GREEN", hue: 122 },
];

function hslToRgb(h, s, l) {
  const f = (n) => {
    const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))));
  };
  return [f(0), f(8), f(4)];
}
const toHex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

const Theme = {
  hue: 184,
  listeners: [],
  set(hue) {
    this.hue = ((hue % 360) + 360) % 360;
    // Reds, blues and purples look far darker than yellow at the same lightness, so they get lifted to stay readable.
    let light = 0.5, rgb = hslToRgb(this.hue, 1, light);
    while (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] < 80 && light < 0.72) {
      light += 0.01;
      rgb = hslToRgb(this.hue, 1, light);
    }
    NEON = rgb.join(",");
    CY = toHex(rgb);
    const ice = hslToRgb(this.hue, 1, 0.92);
    ICE = toHex(ice);
    ICE_RGB = ice.join(",");
    DARK = toHex(hslToRgb(this.hue, 1, 0.04));
    this.listeners.forEach((fn) => fn());
  },
};
