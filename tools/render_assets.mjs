#!/usr/bin/env node
/**
 * Renders the profile assets for github.com/ahrazzle.
 *
 * Two files are written:
 *   assets/banner.svg  Deterministic animated header. The lattice mark is
 *                      static (it is a mathematical object, not a picture).
 *                      One visual channel, the orbit ring, is driven by the
 *                      vendored Eido aesthetic mixer: a barycentric sweep
 *                      through style space whose hue is averaged on the
 *                      circle, emitted as SMIL keyframes. No JavaScript runs
 *                      on GitHub, so the animation is computed here, as math,
 *                      and shipped as data.
 *   assets/live.svg    The "signal" strip: public repo count, stars, and the
 *                      newest push across the profile and four orgs. Fetched
 *                      from the GitHub API; falls back to the previous file
 *                      if the API is unreachable, so a failed run never
 *                      degrades the profile.
 *
 * Eido rule honoured here: one quantity per visual channel. The ring carries
 * hue and nothing else; stroke width, radius and opacity stay put.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mixAestheticPresets } from "./vendor/aesthetic-mixer.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_BANNER = join(root, "assets", "banner.svg");
const OUT_LIVE = join(root, "assets", "live.svg");

/* ---------- palette (static, brand) ---------- */
const BG0 = "#0e1612";
const BG1 = "#152019";
const CHAMPAGNE = "#dbc69a";
const MINT = "#b4cda3";
const DOT = "#efe2ad";
const TEXT = "#e8e3d3";
const MUTED = "#9db08f";

/* ---------- Eido sweep ---------- */
// Three anchor styles. The weights orbit the simplex so the ring's hue
// travels the unit circle; hue is averaged on the circle, never through 0.5.
const PRESETS = {
  pine:      { rounding: 0.3, density: 0.55, contrast: 0.05, hue: 0.36 }, // deep pine mint
  ember:     { rounding: 0.1, density: 0.25, contrast: 0.35, hue: 0.07 }, // banked ember
  champagne: { rounding: 0.75, density: 0.7, contrast: 0.1, hue: 0.13 },  // champagne gold
};
const hueAt = (t) =>
  mixAestheticPresets(PRESETS, {
    pine:      0.5 + 0.5 * Math.cos(2 * Math.PI * t),
    ember:     0.5 + 0.5 * Math.cos(2 * Math.PI * t - (2 * Math.PI) / 3),
    champagne: 0.5 + 0.5 * Math.cos(2 * Math.PI * t - (4 * Math.PI) / 3),
  }).hue;

const STEPS = 24;
const hsl = (h) => `hsl(${Math.round(h * 360)}, 52%, 62%)`;
const ringColors = Array.from({ length: STEPS + 1 }, (_, i) => hsl(hueAt(i / STEPS))).join(";");
const SWEEP_S = 36; // slow; calm, not busy

/* ---------- banner ---------- */
const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 260" role="img" aria-labelledby="t">
  <title id="t">Ahraz Arifuddin · Curiosity, creation, interconnection · Toronto</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BG0}"/><stop offset="1" stop-color="${BG1}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.35" r="0.55">
      <stop offset="0" stop-color="#dbc69a" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#dbc69a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="880" height="260" fill="url(#bg)"/>
  <rect width="880" height="260" fill="url(#glow)"/>

  <text x="42" y="102" font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="${DOT}" letter-spacing="0.5">Ahraz Arifuddin</text>
  <text x="42" y="132" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="12.5" fill="${MINT}" letter-spacing="1">OBSERVATION BEFORE OPINION · EXECUTION BEFORE CREDIT</text>
  <text x="42" y="160" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="16.5" fill="${TEXT}">Curiosity, creation, interconnection.</text>
  <text x="42" y="186" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="11.5" fill="${MUTED}">Toronto</text>
  <text x="42" y="222" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="11.5" fill="${MUTED}">R = √2 − 1</text>

  <g transform="translate(660 128) scale(78)" fill="none" stroke-linejoin="round">
    <path d="M-1-1H1V1H-1ZM-1-1L1 1M1-1L-1 1" stroke="${CHAMPAGNE}" stroke-width="0.026" opacity="0.4"/>
    <circle r="0.62" stroke="none"/>
    <path d="M0.0000000,-0.5857864L-1,-1 M0.0000000,-0.5857864L1,-1 M0.0000000,-0.5857864L0,0 M0.5857864,0.0000000L1,-1 M0.5857864,0.0000000L1,1 M0.5857864,0.0000000L0,0 M0.0000000,0.5857864L1,1 M0.0000000,0.5857864L-1,1 M0.0000000,0.5857864L0,0 M-0.5857864,0.0000000L-1,1 M-0.5857864,0.0000000L-1,-1 M-0.5857864,0.0000000L0,0" stroke="${CHAMPAGNE}" stroke-width="0.045"/>
    <circle cx="0" cy="-0.5857864" r="0.4142136" stroke="${MINT}" stroke-width="0.009" opacity="0.65"/>
    <circle cx="0.5857864" cy="0" r="0.4142136" stroke="${MINT}" stroke-width="0.009" opacity="0.65"/>
    <circle cx="0" cy="0.5857864" r="0.4142136" stroke="${MINT}" stroke-width="0.009" opacity="0.65"/>
    <circle cx="-0.5857864" cy="0" r="0.4142136" stroke="${MINT}" stroke-width="0.009" opacity="0.65"/>
    <g stroke-width="0.02" fill="${DOT}">
      <circle cx="0" cy="-0.5857864" r="0.026">
        <animate attributeName="r" values="0.026;0.034;0.026" dur="7.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0.5857864" cy="0" r="0.026">
        <animate attributeName="r" values="0.026;0.034;0.026" dur="7.2s" begin="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0.5857864" r="0.026">
        <animate attributeName="r" values="0.026;0.034;0.026" dur="7.2s" begin="3.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="-0.5857864" cy="0" r="0.026">
        <animate attributeName="r" values="0.026;0.034;0.026" dur="7.2s" begin="5.4s" repeatCount="indefinite"/>
      </circle>
    </g>
    <circle r="0.97" fill="none" stroke="hsl(0,52%,62%)" stroke-width="0.022" stroke-dasharray="0.06 0.1" opacity="0.9">
      <animate attributeName="stroke" values="${ringColors}" dur="${SWEEP_S}s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="rotate" values="0;360" dur="90s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>
`;

/* ---------- live signal strip ---------- */
async function collect() {
  const owners = ["ahrazzle", "Foundation-0", "Moissanite-Labs", "aska-digital", "Proven-Commons"];
  let repos = 0;
  let stars = 0;
  let newest = 0;
  for (const owner of owners) {
    const res = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&type=owner`, {
      headers: {
        "User-Agent": "ahrazzle-profile-readme",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`${owner}: http ${res.status}`);
    const page = await res.json();
    repos += page.length;
    for (const r of page) {
      stars += r.stargazers_count ?? 0;
      const t = Date.parse(r.pushed_at ?? 0);
      if (t > newest) newest = t;
    }
  }
  return { repos, stars, newest };
}

async function live() {
  let stats = null;
  try {
    stats = await collect();
  } catch (err) {
    console.warn(`signal fetch failed (${err.message}); keeping previous live.svg`);
    return;
  }
  const day = new Date(stats.newest).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const label = `SIGNAL`;
  const body = `${stats.repos} public repos across five homes · ${stats.stars} stars · newest push ${day}`;
  const tail = `rendered ${today}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 44" role="img" aria-label="${body}">
  <rect width="880" height="44" fill="${BG0}" stroke="#22301f"/>
  <circle cx="22" cy="22" r="3.5" fill="${MINT}">
    <animate attributeName="opacity" values="1;0.25;1" dur="2.4s" repeatCount="indefinite"/>
  </circle>
  <text x="36" y="18" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="11.5" fill="${CHAMPAGNE}" letter-spacing="2">${label}</text>
  <text x="36" y="34" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="11" fill="${TEXT}">${body}</text>
  <text x="872" y="27" text-anchor="end" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="10" fill="${MUTED}">${tail}</text>
</svg>
`;
}

const liveSvg = await live();
if (liveSvg) writeFileSync(OUT_LIVE, liveSvg);
writeFileSync(OUT_BANNER, banner);
console.log("wrote", OUT_BANNER);
console.log("wrote", OUT_LIVE, liveSvg ? "(fresh)" : "(kept previous)");
