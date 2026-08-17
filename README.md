# Image Slider Block

> Display Multiple Images In Beautiful Slider & Reduce Page Scroll

A Gutenberg block by [WPDeveloper](https://wpdeveloper.net) that lets you showcase multiple images in a fully customizable, responsive slider — without touching a line of code.

| | |
|---|---|
| **Stable tag** | 1.4.0 |
| **Requires at least** | WordPress 6.0 |
| **Tested up to** | WordPress 7.0.4 |
| **Requires PHP** | 7.4 |
| **License** | [GPLv3 or later](https://www.gnu.org/licenses/gpl-3.0.html) |

## Features

- **Completely customizable** — content, speed, colors, and layout to match your design
- **Responsive controls** — per-device typography, spacing, and visibility
- **Multiple layouts** — image only, image with content, vertical slider, content slider
- **Super light-weight** — no extra resources, optimized for fast loading and instant live editing
- **FSE & reusable block ready** — PHP-based style handler works with Full Site Editing
- **Dedicated support** — an active support team behind the plugin

## Installation

### From the Block Editor

1. Open the WordPress Block/Gutenberg Editor
2. Search for **"Slider Block"**
3. Install in one click

### Manual

1. Upload `slider-block` to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Follow the [documentation](https://essential-blocks.com/docs/)

## Development

This repository depends on two git submodules. **Neither is optional** — the build fails or produces a stale bundle without them:

| Submodule | Path | Repo |
|---|---|---|
| Shared controls | `controls/` | [`EssentialBlocks/controls`](https://github.com/EssentialBlocks/controls) |
| Style handler | `lib/style-handler/` | [`EssentialBlocks/style-handler`](https://github.com/EssentialBlocks/style-handler) |

```bash
git clone --recurse-submodules git@github.com:EssentialBlocks/slider-block.git
cd slider-block
npm install
```

If you already cloned without `--recurse-submodules`, `npm install` repairs it via the `postinstall` hook. To do it by hand:

```bash
npm run submodules      # git submodule update --init --recursive
npm run install:controls
```

| Command | Description |
|---|---|
| `npm start` | Build controls, then start the plugin build in watch mode |
| `npm run build` | Full production build — controls stage, then plugin stage |
| `npm run build:controls` | Controls stage only → `dist/modules.js`, `dist/modules.css` |
| `npm run submodules` | Init/update git submodules |
| `npm run install:controls` | Install `controls/` dependencies |
| `npm run packages-update` | Update `@wordpress/*` packages |

### How the build works

The build has **two stages**, because `controls/` is a separate package with its own `webpack.config.js` and its own dependency tree.

1. **Controls stage** — runs inside `controls/`. Bundles [`config/entries.js`](config/entries.js), which re-exports the shared controls and helpers from `controls/src/`. Output goes to `../dist`:
   - `dist/modules.js` — exposed on the `window.EBSliderControls` global (name comes from [`config/controlname.json`](config/controlname.json))
   - `dist/modules.css`, `dist/style-modules.css`, `dist/frontend.js`
2. **Plugin stage** — runs at the repo root against [`webpack.config.js`](webpack.config.js). Builds `dist/index.js` (editor), `dist/frontend/index.js` (frontend), `dist/style.css`.

`src/index.js` consumes stage 1 at runtime:

```js
const { ebConditionalRegisterBlockType } = window.EBSliderControls;
```

`includes/helpers.php` enqueues `dist/modules.js` as the `slider-block-controls-util` handle, reading its dependency list from `dist/modules.asset.php`. So an empty `controls/` submodule means stage 1 never runs and `dist/modules.js` goes stale — the editor still boots off the committed bundle, which hides the problem until the controls source changes.

`controls/` needs `npm install --force`, which `npm run install:controls` already passes. Two things make a plain install fail:

- `react-sortable-hoc@2` peers on React 16/17 while its `@wordpress/*` siblings pull React 18 — a plain `npm install` aborts with `ERESOLVE`.
- `--legacy-peer-deps` is **not** the right escape hatch here. It makes npm ignore *all* peer dependencies, including `ajv-keywords@5`'s peer on `ajv@^8.8.2`. npm then leaves the hoisted `ajv@6` in place and the controls build dies with `Cannot find module 'ajv/dist/compile/codegen'`. `--force` overrides the React conflict while still resolving peers, so `ajv@8` gets nested where it's needed.

### Asset handles

`dist/modules.css` is built from this plugin's own `controls` submodule pin, so it differs between the Essential Blocks single-block plugins and **must** be enqueued under a plugin-specific handle (`slider-block-editor-css`). It previously used the shared name `essential-blocks-editor-css`, which meant whichever plugin loaded first won the handle outright — `WP_Dependencies::add()` returns `false` for an already-registered handle — silently dropping every later plugin's stylesheet *and its dependencies*. That broke the arrow icon pickers whenever Button Group Block was active.

Genuinely shared vendor assets (`essential-blocks-icon-picker-css`, `essential-blocks-fontawesome`, `essential-blocks-animation`) keep their shared handles on purpose, so only one copy loads however many EB single-block plugins are active.

### Branches

| Branch | Purpose |
|---|---|
| `master` | Stable, released code |
| `latest` | Latest packaged release |
| `dev` | Active development |

## Contributors

| Contributor | WordPress.org |
|---|---|
| WPDeveloper Team | [wpdevteam](https://profiles.wordpress.org/wpdevteam/) |
| Re Enter Rupok | [re_enter_rupok](https://profiles.wordpress.org/re_enter_rupok/) |
| Asif Rahman | [Asif2BD](https://profiles.wordpress.org/asif2bd/) |
| Rahat Hossain | [rahat89](https://profiles.wordpress.org/rahat89/) |
| Rahat Sheikh (Leon) | [RahatSheikhLeon](https://profiles.wordpress.org/RahatSheikhLeon/) — [@RahatSheikhLeon](https://github.com/RahatSheikhLeon) |

Contributions are welcome. Open an issue or a pull request against the `dev` branch.

## Documentation & Support

- [Documentation and tutorials](https://essential-blocks.com/docs/)
- [Report an issue on GitHub](https://github.com/EssentialBlocks/slider-block)
- [Plugin support forum](https://wordpress.org/support/plugin/slider-block)
- [WPDeveloper](https://wpdeveloper.net/)

## Changelog

See [`readme.txt`](readme.txt) for the full changelog.

## License

GPL-3.0-or-later. See [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html).

> **Note:** the `Gruntfile.js` `readme` task (`wp_readme_to_markdown`) regenerates `README.md` from `readme.txt` and will overwrite this file. Don't run it unless you intend that.
