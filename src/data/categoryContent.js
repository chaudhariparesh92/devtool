// Content for the /category/<slug> pages. One page per category that has enough tools to be useful.
// "Website Checking" has a single tool, so it gets no category page (a thin page would hurt, not help).
// Pure data: used by pages/CategoryPage.jsx, data/seo.js, scripts/prerender.mjs and scripts/generate-sitemap.mjs.
// Only describes tools that exist in data/tools.js and behave as written in data/toolContent.js.

export const CATEGORY_PAGES = {
  'JSON Tools': {
    slug: 'json-tools',
    title: 'JSON Tools Online - Format, Validate and Convert JSON',
    description: 'Free JSON tools that run in your browser: format, validate, beautify and minify JSON, generate models in 7 languages, and convert JSON to and from CSV and YAML.',
    h1: 'JSON Tools Online',
    intro: [
      'JSON is the default format for APIs, config files and logs, and most of the time the problem is the same: the JSON is on one line, or it will not parse. These tools cover the everyday jobs. Format or beautify a payload so you can read it, validate it to find the syntax error, or minify it for a request body or environment variable.',
      'When you start from a sample response, the converters write a first draft of a class or type in C#, TypeScript, Java, Python, Go, PHP or Kotlin. For data moving in and out of spreadsheets and config files there are JSON to CSV, CSV to JSON and YAML to JSON converters.',
    ],
    guide: [
      { need: 'The JSON is one unreadable line', to: '/json-formatter', text: 'Format it with indentation. The beautifier does the same job with wording aimed at minified input.' },
      { need: 'JSON.parse is throwing an error', to: '/json-validator', text: 'Find out whether it parses and read the parser message. Trailing commas, single quotes and unquoted keys are the usual causes.' },
      { need: 'You need the smallest possible JSON', to: '/json-minifier', text: 'Strip whitespace without changing the data.' },
      { need: 'You need a model class from a response', to: '/json-to-csharp', text: 'Generate a first draft in C#, then see the TypeScript, Java, Python, Go, PHP and Kotlin converters in the list below.' },
      { need: 'The data lives in a spreadsheet or a YAML file', to: '/json-to-csv', text: 'Move between JSON and CSV, or turn YAML into JSON with the YAML to JSON converter.' },
    ],
  },
  'Encoders & Decoders': {
    slug: 'encoders-decoders',
    title: 'Encoder and Decoder Tools - URL, Base64, HTML and JWT',
    description: 'Free online encoders and decoders for URL, Base64, HTML entities and JWT tokens, with notes on what each one does and does not do. Runs in your browser.',
    h1: 'Encoder and Decoder Tools',
    intro: [
      'Encoding changes how data is written so it survives a particular place: a URL, an HTML page or a text-only protocol. It is not encryption, and anyone can reverse it. Pick the encoder that matches where the text is going. URL encoding is for values inside a link or query string, HTML encoding is for showing markup as text, and Base64 turns text or bytes into a plain ASCII string.',
      'The JWT decoder is here because a token is three Base64URL-style segments. It shows the header and payload as JSON, but decoding is not verification, so a decoded token is not proof that it is genuine.',
    ],
    guide: [
      { need: 'A value must go safely into a URL', to: '/url-encoder', text: 'Percent-encode it, and use the URL decoder to read an encoded link.' },
      { need: 'You need text as a Base64 string', to: '/base64-encoder', text: 'Encode UTF-8 text, and use the Base64 decoder to turn it back. Base64 hides nothing.' },
      { need: 'Markup must appear as text on a page', to: '/html-encoder', text: 'Escape &, < and >, then use the HTML decoder to reverse entities.' },
      { need: 'You want to read what is inside a token', to: '/jwt-decoder', text: 'Decode the header and payload. Verify the signature on your server.' },
    ],
  },
  'Generators & Hashes': {
    slug: 'generators-hashes',
    title: 'UUID, JWT and Hash Generators - Free Online Tools',
    description: 'Free browser-based generators and checkers: random UUID v4 generator, UUID validator and parser, HS256 JWT generator, and SHA-256, SHA-512 and MD5 hash generators.',
    h1: 'UUID, JWT and Hash Generators',
    intro: [
      'These tools create or check the identifiers and digests that show up in everyday development. The UUID generator makes random version 4 UUIDs in bulk, and the validator and parser check a UUID\'s format, version and variant. The JWT generator signs a test token with HS256, which is handy for trying an API or a decoder.',
      'The hash tools return the SHA-256, SHA-512 or MD5 digest of the text you type. Hashes are one-way and are not encryption. MD5 is only suitable for non-security checksums, and no plain hash is a safe way to store passwords.',
    ],
    guide: [
      { need: 'You need unique IDs for test data or keys', to: '/uuid-generator', text: 'Generate 1 to 100 random v4 UUIDs at once.' },
      { need: 'You are not sure a UUID string is valid', to: '/uuid-validator', text: 'Check the format, or use the UUID parser to read its version and variant.' },
      { need: 'You need a quick test token for an API', to: '/jwt-generator', text: 'Sign a JSON payload with HS256 and a test secret. Do not use production secrets.' },
      { need: 'You need a checksum or digest of some text', to: '/sha256-generator', text: 'SHA-256 is a good default. Use the SHA-512 page for a longer digest, or MD5 only for non-security checksums.' },
    ],
  },
  'Web Tools': {
    slug: 'web-tools',
    title: 'Web Dev Tools - Timestamps, Colors, Cron, Query Strings',
    description: 'Free web developer tools: timestamp converters, HEX and RGB color converters, a query string parser and generator, and cron expression tools.',
    h1: 'Web Developer Tools',
    intro: [
      'Small chores come up constantly in web work: decoding a timestamp from a log, turning a design\'s HEX color into RGB, reading the parameters in a long URL or checking what a cron schedule actually means. These tools handle each one in a single step.',
      'The timestamp tools show UTC, local time, ISO 8601 and Unix seconds and milliseconds. The color tools convert between HEX and RGB. The query string tools turn a URL query into JSON and back, and the cron tools describe a five-field schedule in plain English.',
    ],
    guide: [
      { need: 'A log or API gives you a number like 1700000000', to: '/timestamp-converter', text: 'Convert it to a date, or read the Unix timestamp explainer for seconds versus milliseconds.' },
      { need: 'A color code needs a different format', to: '/color-converter', text: 'Convert HEX and RGB, or use the dedicated HEX to RGB and RGB to HEX pages.' },
      { need: 'A URL has a long list of parameters', to: '/query-string-parser', text: 'Parse it into JSON, or build a query string from JSON with the generator.' },
      { need: 'A schedule must run at the right time', to: '/cron-expression-parser', text: 'Read a cron expression in plain English before you deploy it.' },
    ],
  },
  'Text & Data': {
    slug: 'text-data',
    title: 'Text and Data Tools - XML, YAML, Regex, Diff and More',
    description: 'Free text and data tools: XML and YAML formatters, XML validator, regex tester, diff checker, text counter, case and slug tools, and number base converters.',
    h1: 'Text and Data Tools',
    intro: [
      'This group covers formatting, checking and transforming plain text and structured data. Format XML and YAML so a config is readable, validate that XML is well-formed, compare two versions of a file line by line, or test a regular expression against sample text.',
      'There are also quick text utilities, including a character, word and line counter, a case converter, slug tools for URLs, and number base converters for binary, octal, decimal and hexadecimal values.',
    ],
    guide: [
      { need: 'XML or YAML is hard to read', to: '/xml-formatter', text: 'Indent XML, or tidy YAML with the YAML formatter. Use the XML validator to check that a document is well-formed.' },
      { need: 'You need to know what changed between two texts', to: '/diff-checker', text: 'Compare line by line. Format JSON first so each key sits on its own line.' },
      { need: 'A pattern is not matching what you expect', to: '/regex-tester', text: 'Test a JavaScript regular expression and see every match with its index.' },
      { need: 'You need a URL slug or a different text case', to: '/slug-generator', text: 'Create a clean slug, or switch text between UPPERCASE, lowercase and Title Case with the case converter.' },
      { need: 'You are converting between binary, decimal and hex', to: '/number-base-converter', text: 'Convert whole numbers between bases, or open a focused page such as binary to decimal.' },
    ],
  },
};

export const CATEGORY_SLUG = Object.fromEntries(Object.entries(CATEGORY_PAGES).map(([k, v]) => [k, v.slug]));
export const categoryPath = (category) => (CATEGORY_SLUG[category] ? `/category/${CATEGORY_SLUG[category]}` : null);
