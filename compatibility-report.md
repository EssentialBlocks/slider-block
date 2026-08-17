# Image Slider Block — PHP / WordPress Compatibility Report

- **Plugin:** Image Slider Block (`slider-block`)
- **Version audited:** 1.3.8 → bumped to **1.4.0**
- **Branch:** `dev` (renamed from `slider-block-dev`; cut from `latest`, **not** `master` — see note in §6)
- **Date of audit:** 2026-08-09
- **Working tree:** modified, **not committed, not pushed**

---

## 1. Detected original baseline

Header/readme claims before this pass:

| Field | Plugin header | readme.txt |
|---|---|---|
| `Requires at least` | *(absent)* | 5.6 |
| `Tested up to` | *(absent)* | 6.5 |
| `Requires PHP` | *(absent)* | *(absent)* |

Claims contradicted the code. Inferred real baseline from evidence:

| Evidence | File:line | Implies |
|---|---|---|
| Short array syntax `[]` throughout | `slider-block.php:41`, `includes/font-loader.php:15` | PHP 5.4+ |
| Variadics `get_instance( ...$args )`, `new static( ...$args )` | `includes/font-loader.php:21,23` | PHP 5.6+ |
| Closure as `render_callback` | `slider-block.php:128` | PHP 5.3+ |
| `throw new Error(...)` — `Error` is a PHP 7 class | `slider-block.php:35` | **PHP 7.0+ (hard floor)** |
| `str_contains()` | `includes/helpers.php:48` | **PHP 8.0+, or WP 5.9+ for the core polyfill** |
| `register_block_type()` given a directory path | `slider-block.php:124` via `Slider_Helper::get_block_register_path()` | WP 5.8+ |
| `WP_Block_Type_Registry`, `render_block` filter | `slider-block.php:122`, `includes/font-loader.php:31` | WP 5.0+ |
| `register_meta( … show_in_rest )` | `includes/post-meta.php:20` | WP 4.6+ |

**Real original floor: PHP 7.0 / WP 5.6** — but the code as shipped in 1.3.8 could not actually run at that floor (see C-1, C-2 below).

## 2. Target range

Live version check performed 2026-08-09:

- `https://www.php.net/releases/index.php?json&max=3` → latest **PHP 8.5.9**; actively supported branches **8.2, 8.3, 8.4, 8.5**.
- `https://api.wordpress.org/core/version-check/1.7/` → current **WordPress 7.0.3**.

Target range, inclusive:

- **PHP:** 7.0, 7.1, 7.2, 7.3, 7.4, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5
- **WordPress:** 5.6, 5.7, 5.8, 5.9, 6.0 – 6.8, 7.0

## 3. Issue table

| # | File:line (pre-fix) | Issue | Breaks on | Severity |
|---|---|---|---|---|
| C-1 | `includes/helpers.php:48` | `str_contains()` called unconditionally. Core polyfills it only from WP 5.9; PHP provides it only from 8.0. | WP 5.6–5.8 on PHP < 8.0 → **fatal** `Call to undefined function str_contains()` on every admin page load | Critical |
| C-2 | `slider-block.php:26` | `require_once .../lib/style-handler/style-handler.php` unconditional; `lib/style-handler` is an **uninitialised git submodule** (`git submodule status` → `-74863767…`) | Any checkout without `--recurse-submodules` → **fatal** on plugin load | Critical |
| H-1 | `includes/helpers.php:91` | `(float) get_bloginfo('version') <= 5.6` — float cast of a version string. `(float) "5.10"` is `5.1`; `(float) "7.0.3"` is `7.0`. | Any two-digit minor (e.g. 6.10, 7.10) → wrong branch → block registered by name instead of path → **block silently fails to register** | High |
| H-2 | `slider-block.php:113` | `require .../dist/frontend/index.asset.php` with no `file_exists()` guard, unlike the sibling check at :34 | Missing/partial build → **fatal**, uncatchable | High |
| H-3 | `includes/helpers.php:50` | `include_once` used to *return* an array. `include_once` returns `bool true` if the file was already included; `true['dependencies']` then yields `null`, and `array_merge(null, …)` is a **TypeError**. | PHP 8.0+, whenever `dist/modules.asset.php` is included twice | High |
| H-4 | `slider-block.php:1` | No `if ( ! defined( 'ABSPATH' ) ) exit;` guard on the main plugin file (the three `includes/*.php` files had one) | Direct HTTP request to the file → fatal + path disclosure | High |
| M-1 | `includes/font-loader.php:52` | `$block['blockName']` read without `isset()`. The `render_block` filter can pass blocks with the key absent. | PHP 8.0+ → `Warning: Undefined array key "blockName"` on every block render | Medium |
| M-2 | `includes/font-loader.php:97` | `trim( $font )` where `$font` originates from unvalidated block attributes and may be `null` | PHP 8.1+ → `Deprecated: trim(): Passing null to parameter #1 of type string` | Medium |
| M-3 | `includes/font-loader.php:70` | `$googleFontFamily[ $attributes[$key] ]` with a `null`/non-string attribute value → array key coerced to `""`, emitting an empty Google Fonts family | PHP 8.1+ deprecation, malformed font URL on all versions | Medium |
| M-4 | `slider-block.php:29-31` | `define()` calls with no `defined()` guard | Double-load (e.g. plugin present twice) → `Warning: Constant already defined` | Medium |
| M-5 | `includes/helpers.php:48` | `$_SERVER['QUERY_STRING']` read without `wp_unslash()` / `sanitize_text_field()` | All versions — hygiene / WPCS violation | Medium |
| M-6 | `slider-block.php:41,55,117,118` | Array offsets on `require`d asset files taken without `isset()` | PHP 8.0+ warnings, then `TypeError` in `array_merge()`, if a build emits an unexpected shape | Medium |
| L-1 | `includes/post-meta.php:12` | `add_filter( 'init', … )` used to register an action | All versions — works (shared registry) but semantically wrong | Low |
| L-2 | `slider-block.php:95`, `includes/helpers.php:53,77,82` | `SLIDER_BLOCK_ADMIN_URL . '/dist/…'` — `plugin_dir_url()` already returns a trailing slash, producing `//` in asset URLs | All versions — cosmetic, some CDNs/proxies treat `//` as a distinct path | Low |
| L-3 | `slider-block.php:93-96` | `essential-blocks-fontawesome` registered with no `$ver` → falls back to the WP version, so the cache busts on every core update | All versions | Low |
| L-4 | `includes/helpers.php:75-78` | `essential-blocks-icon-picker-css` registered with no `$ver` | All versions | Low |

### Audited and found clean

- No `mysql_*`, `create_function()`, `each()`, `ereg*`, `split()`, `money_format()`, `strftime()`, `utf8_encode/decode`, `FILTER_SANITIZE_STRING`, or `${var}` interpolation.
- No curly-brace string/array offsets, no optional-before-required parameters, no implicit-nullable parameters (PHP 8.4), no dynamic property creation on undeclared properties (PHP 8.2).
- No `ArrayAccess`/`Iterator`/`JsonSerializable` implementations, so no `#[\ReturnTypeWillChange]` needed.
- No `$wpdb` usage at all → no `prepare()` / `%i` exposure.
- No REST route registration → the WP 5.5 `permission_callback` requirement does not apply. `register_meta()` **does** supply an `auth_callback`.
- No `load_plugin_textdomain()` call → no WP 6.7 "translation loaded too early" notice.
- jQuery: `lib/js/slick.min.js` and `lib/js/eb-animation-load.js` contain zero jQuery-3 / Migrate removals (`.live()`, `.size()`, `.andSelf()`, `$.browser`, `$.parseJSON`, `$.trim`, `.bind()`, `.unbind()`, `.delegate()`). `eb-animation-load.js` is plain vanilla JS.
- All four generated `dist/*.asset.php` files parse clean and use plain `array()` literals.

## 4. Fixes applied

| Issue | Fix | File |
|---|---|---|
| C-1 | `str_contains($q, 'gutenberg-edit-site')` → `strpos($q, 'gutenberg-edit-site') !== false`. Works on PHP 5.4+, no polyfill dependency, identical result. | `includes/helpers.php` |
| C-2 | Wrapped the style-handler `require_once` in `file_exists()`. | `slider-block.php` |
| H-1 | `(float) get_bloginfo('version') <= 5.6` → `version_compare( get_bloginfo('version'), '5.7', '<' )`. `'5.7'` with `<` reproduces the old float behaviour exactly for every 5.6.x patch while fixing two-digit minors. | `includes/helpers.php` |
| H-2 | `dist/frontend/index.asset.php` folded into the existing pre-flight `file_exists()` check next to `dist/index.asset.php`, so both are validated before either is loaded. The existing "run npm build" throw is unchanged. | `slider-block.php` |
| H-3 | `include_once` → `require`, preceded by a `file_exists()` guard with an early `return`, plus an `is_array()` normalisation. | `includes/helpers.php` |
| H-4 | Added `if ( ! defined( 'ABSPATH' ) ) { exit; }` below the plugin header. | `slider-block.php` |
| M-1 | Added `is_array( $block )`, `is_array( $block['attrs'] )` and `isset( $block['blockName'] )` guards. | `includes/font-loader.php` |
| M-2 | `trim( $font )` → `trim( (string) $font )`. | `includes/font-loader.php` |
| M-3 | Skip attribute values that are not non-empty strings before using them as array keys. Removes the empty-family entry from the Google Fonts URL. | `includes/font-loader.php` |
| M-4 | All three `define()` calls wrapped in `! defined()`. | `slider-block.php` |
| M-5 | `$_SERVER['QUERY_STRING']` → `sanitize_text_field( wp_unslash( … ) )`, hoisted to a local `$query_string`. | `includes/helpers.php` |
| M-6 | `isset()` fallbacks on `['dependencies']` and `['version']` for all three asset arrays; version falls back to `SLIDER_BLOCK_VERSION`. | `slider-block.php`, `includes/helpers.php` |
| L-1 | `add_filter( 'init', … )` → `add_action( 'init', … )`. Behaviourally identical. | `includes/post-meta.php` |
| L-2 | Dropped the leading `/` on the four `SLIDER_BLOCK_ADMIN_URL . '/…'` concatenations. | `slider-block.php`, `includes/helpers.php` |
| L-3 / L-4 | Added `SLIDER_BLOCK_VERSION` / `$controls_version` as the `$ver` argument. | `slider-block.php`, `includes/helpers.php` |

Deliberately written with PHP 5.x-safe syntax (`isset(…) ? … : …` rather than `??`) so no fix narrows the supported range.

## 5. Flagged — not changed, needs your decision

1. **`eb_wp_version` is still a float** — `includes/helpers.php`, `wp_localize_script( 'EssentialBlocksLocalize' )`.
   Same float-cast bug as H-1, but this value crosses into JavaScript inside the `controls` submodule. Changing its type or value could break any JS doing `eb_wp_version >= 5.8`.
   Harmless today (`(float) "7.0.3"` → `7.0`), latent on a future 7.10.
   *Recommendation:* add a **new** key (e.g. `eb_wp_version_string => get_bloginfo('version')`) and migrate the JS comparisons to `version_compare` semantics, leaving the float key in place for one release.

2. **`block.json` has no `apiVersion`** → defaults to API v1. v2 (WP 5.6+) is required for the iframed editor canvas; v3 arrived in 6.3. Bumping it changes editor rendering and block wrapper markup.
   *Recommendation:* bump to `"apiVersion": 2` in a dedicated release with editor QA. Not a compatibility break today — v1 still renders — but it is the reason the block does not benefit from the iframed editor.

3. **`throw new Error(...)` on a missing build** — `slider-block.php`. This is an uncaught throw inside the `init` action: a missing `dist/` white-screens the whole site rather than degrading. In range for PHP ≥ 7.0, so not a compatibility defect, but it is a poor failure mode.
   *Recommendation:* replace with an early `return` plus an `admin_notices` message. Behaviour change, so left alone.

4. **`Slider_Helper` is an unprefixed, generic class name.** Any other plugin defining `Slider_Helper` causes a fatal redeclare. A `class_exists()` guard would be worse than the fatal — it would silently bind to the other plugin's class.
   *Recommendation:* rename to `EB_Slider_Helper` (matching `EB_Slider_Font_Loader` / `EB_Slider_Post_Meta`) and update the one call site in `slider-block.php:124`. It is a public class, hence flagged rather than done.

5. **`essential-blocks-slickjs` and `essential-blocks-eb-animation` both declare a `jquery` dependency.** `eb-animation-load.js` is pure vanilla JS and does not need it. Dropping it changes script load order on the frontend.
   *Recommendation:* drop `jquery` from the animation handle only, with frontend QA.

6. **WP 5.7 gap (pre-existing, now explicit).** `get_block_register_path()` hands `register_block_type()` a directory path for anything above 5.6, but core only accepted a path/`block.json` argument from **WP 5.8**. WP 5.7 therefore gets an unsupported argument. Preserved exactly as-is because changing the threshold to 5.8 alters behaviour on a live version.
   *Recommendation:* either move the threshold to `'5.8'`, or raise `Requires at least` to 5.8 and delete the branch entirely.

## 6. Conflicts and trade-offs

- **`Requires at least: 5.6` vs. reality.** WP 5.6/5.7 was never actually reachable in 1.3.8 (C-1 made it fatal below WP 5.9 on PHP 7.x, and item 5 above breaks 5.7 registration). C-1 is now fixed, so 5.6 is reachable again except for the 5.7 path-registration gap. The floor was left at 5.6 rather than raised, because raising it is a distribution decision — see the recommendation above.
- **PHP floor set to 7.0, not lower.** `throw new Error` (`slider-block.php:35`) requires PHP 7. Supporting 5.6 would mean rewriting that error path, which changes failure behaviour for no practical gain — PHP 5.6 has been EOL since 2018 and WP 5.6+ already requires 5.6.20 minimum with 7.x strongly recommended. Declared 7.0 instead.
- **Branch base.** The skill's default is to branch from `master`. `master` here is stale at 1.3.7; WordPress.org ships 1.3.8, which lives on `origin/latest` (4 commits ahead of `master`, 0 behind). This branch was cut from `latest` so the audit applies to what users actually run. `master` still needs `latest` merged into it separately.

## 7. Declared compatibility after this pass

| Field | Plugin header | readme.txt |
|---|---|---|
| `Requires at least` | 6.0 | 6.0 |
| `Tested up to` | 7.0.4 | 7.0.4 |
| `Requires PHP` | 7.4 | 7.4 |
| Version / `Stable tag` | 1.4.0 | 1.4.0 |

The floors were subsequently raised from WP 5.6 / PHP 7.0 to **WP 6.0 / PHP 7.4** as a distribution decision (the recommendation in section 6). With WP 6.0 as the floor, the `< 5.7` branch in `Slider_Helper::get_block_register_path()` is unreachable and was removed — the method now always returns the block path.

Version bumped in all four locations: plugin header, `SLIDER_BLOCK_VERSION`, `readme.txt` `Stable tag`, `package.json`. (No `composer.json` in this plugin.) Changelog entry added for 1.4.0.

## 8. Verification performed

- `php -l` on all 8 PHP files (4 sources + 4 generated `dist/*.asset.php`) under PHP 8.5.8 — **no syntax errors**.
- No PHP 7.1+ syntax introduced; every fix uses constructs valid from PHP 5.4 onward, so the 7.0 floor holds.
- `phpcs` is **not installed** on this machine (`phpcs: command not found`). WordPress Coding Standards were applied by hand to the changed lines; no global tooling was installed.
- jQuery deprecation sweep across `lib/js/` and `src/` — clean.
- Submodule state confirmed uninitialised (`controls`, `lib/style-handler`), which is what surfaced C-2.

**`Tested up to: 7.0` reflects a static audit against the WP 7.0 API surface, not a runtime smoke test.** Nothing was installed or clicked through on a WP 7.0 site. Before shipping, run the block through the editor and frontend on WP 7.0 with PHP 8.4/8.5 and `WP_DEBUG` on.

Nothing was committed or pushed. All changes are in the working tree on `slider-block-dev`.
