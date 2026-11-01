# SEO phase 1 changes (31 Oct 2026)

Original upload is untouched; this is a modified copy. No URL slugs, theme, fonts or layouts changed.

## Code
- src/data/seo.js: categoryLink() now returns the tool path for a one-tool category (Website Checking -> /website-status-checker) instead of /tools?category=...
- public/sw.js: cache name odt-shell-v2, network-first for page navigations, old caches deleted on activate.
- src/utils/color.js (new) + src/pages/tools/ColorTool.jsx: RGB to HEX accepts rgb(), rgba(), "r, g, b" and "r g b"; rejects values over 255 with a message; 8-digit hex and rgba() round trip; hex without # accepted for 6 or 8 digits.
- src/utils/uuid.js (new) + src/pages/tools/UuidTool.jsx: parser decodes version, variant, kind and v1/v6/v7 timestamps, recognises nil/max; validator shows the version; generator adds Standard / UPPERCASE / No hyphens / {braces} output.
- src/pages/tools/JsonConverterTool.jsx: JSON to C# gets a Property attributes menu (None, System.Text.Json, Newtonsoft.Json). Default output unchanged.

## Content (kept in line with behaviour)
- src/data/toolContent.js, toolExtra.js, toolGapContent.js: UUID generator/validator/parser, RGB to HEX, HEX to RGB, Color Converter, JSON to C# and Website Status Checker copy updated. Fixed existing claims that contradicted the code (C# nested classes, UUID validator version range).
- Status checker: new HTTP status code section and two FAQs; lede reframed as down-for-everyone-or-just-you.

## Verify before deploying
npm ci && npm run build   (prerender enforces unique titles/descriptions/canonicals/JSON-LD)
Then test in the browser: /rgb-to-hex, /uuid-generator, /uuid-parser, /uuid-validator, /json-to-csharp, and that the footer Website Checking link goes to /website-status-checker.
Not run here: no network, so no build and no browser test.

## Phase 2 (same day)
- Per-page Updated dates / sitemap lastmod / JSON-LD dateModified: src/data/seo.js getLastModified() with an honest list of routes whose content or behaviour changed (these edits were already in the working copy; I reviewed them and corrected the list to routes that really changed).
- JSON validator: success output now shows root type, size and nesting depth; beautifier/minifier labels and a before/after size line (JsonFormatterTool.jsx).
- Sibling-tool differentiation and extra content: JSON validator/beautifier/minifier, HTML encoder/decoder, timestamp converter / unix timestamp, XML formatter/validator, slug pair, number-base family, cron parser (toolContent.js, toolExtra.js, toolSeoData.js related links).
- Cron tools: common-schedule preset buttons (CronTool.jsx) + FAQ.
- Not changed: footer badges (decision pending), backlinks (plan only).

## Phase 3 (1 Nov 2026): /guides section
- New: src/data/guides.js (8 guides: website down checks, UUID v4 vs v7, RGB to HEX, JSON to C#, JWT decoding, cron examples, decimal to hex, JSON parse errors), src/pages/GuidesIndex.jsx, src/pages/GuidePage.jsx.
- Wired: src/App.jsx routes (/guides + 8 guide URLs), src/data/seo.js (indexable routes, page SEO, Article + BreadcrumbList JSON-LD, lastmod), Header + Footer links, ToolLayout 'Learn more' link on the matching tool pages. public/sitemap.xml regenerated (75 URLs).
- Code samples in the guides were run (JS and Python) before inclusion.
- Footer directory badges unchanged (already class 'hidden' in the original).
- Verify: npm ci && npm run build; open dist/guides/*/index.html; check one H1 per page and the sitemap count.
