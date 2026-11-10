# .github

Profile surface for [github.com/ahrazzle](https://github.com/ahrazzle), plus shared community files if they ever earn their keep here.

What is inside:

- `profile/README.md` · the profile page copy.
- `assets/banner.svg` · animated header, generated deterministically by `tools/render_assets.mjs`. The lattice mark is a mathematical object, drawn from coordinates, not a bitmap.
- `assets/live.svg` · the public signal strip (repo counts, stars, newest push), refreshed daily by a workflow. One quantity per visual channel, honouring Eido's rules.
- `tools/render_assets.mjs` · generator. Vendors `tools/vendor/aesthetic-mixer.js` from [Moissanite-Labs/weft-eido](https://github.com/Moissanite-Labs/weft-eido) (Apache-2.0) to sweep a barycentric path through style space and emit SMIL keyframes for the hue ring. Eido averages hue on the circle, so red never blends through cyan.
- `.github/workflows/refresh.yml` · daily regeneration of `assets/live.svg` (and the banner), with no manual step.

Local use:

```bash
node tools/render_assets.mjs
```

It writes both SVGs. If the GitHub API is unreachable it keeps the previous `live.svg` instead of failing.
