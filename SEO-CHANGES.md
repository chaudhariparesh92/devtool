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

## Phase 4 (1 Nov 2026): query-driven page edits + speed
Pages edited from the Search Console queries you posted (natural wording, no stuffing):
- /website-status-checker: new title/description/H1, lede, 'what', 6+ new task phrases, a 'quick checklist' section linking the guide, FAQs for 'is my website up', 'is this URL working', status pages, https.
- /rgb-to-hex: title/description, lede, tasks, 'RGB to hex in CSS' section, FAQs (free online converter, by hand, CSS).
- /json-to-csharp: title/description, C#-specific lede/what/tasks (the old text said top-level keys only; the tool generates nested classes), FAQs (model generator, Visual Studio Paste Special).
- / (home): hero wording 'developer tools online', FAQs 'Can I edit a JWT online?' and 'Is there an online json_decode?'.
- Ignored on purpose: the junk query ('overbite,web content,...') and 'when this page is ready.'

Speed (static changes; not measured, no build possible here):
- crypto-js, diff, js-yaml, xml-formatter, cronstrue are now loaded on demand (dynamic import) instead of being in the main bundle: HashTool, JwtTool, DiffTool, DataFormatTool, CronTool.
- Footer: the 4 hidden badge images had no loading attribute, so browsers still downloaded them on every page; now loading=lazy + decoding=async (markup and hidden state unchanged). Also class -> className on the HypeStar badge.
- Unchanged on purpose: the AdSense script tag in index.html (moving it behind an inline loader could break AdSense site verification).
- Measure after deploy: PageSpeed Insights / CrUX for /, /json-formatter, /website-status-checker.

## Phase 5 (1 Nov 2026): UUID generator, HTML encoder, Unix timestamp, UUID validator
- /uuid-generator: title/description now say v4 and v7 and GUID formats (old text said v4 only); lede/what/tasks; FAQs 'how do I generate a random UUID online', 'can I customize the UUID format'; fixed a stale FAQ that said v4 only; the shared 'validator accepts versions 1 to 5' FAQ was wrong (1 to 8) and is now not shown on the generator.
- /uuid-validator: description corrected (1 to 8, not 1 to 5), 'UUID version checker' and GUID wording, FAQs on checking the version and GUID vs UUID.
- /html-encoder: title/description/lede for 'html encoder tool' and 'encode a string online', FAQs (how to encode a string, free tool).
- /unix-timestamp: title/H1 'Current Unix Timestamp Online', description, tasks, FAQs; NEW live panel (seconds, milliseconds, UTC date, copy buttons) in TimestampTool.jsx, shown on /unix-timestamp only and rendered after mount so hydration matches.
- Dates: those four routes marked 2026-11-01.
