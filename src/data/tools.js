// Single source of truth for tool names and categories.
// Add a new tool here AND add its route in App.jsx.

export const CATEGORIES = [
  'JSON Tools',
  'Encoders & Decoders',
  'Generators & Hashes',
  'Web Tools',
  'Text & Data',
  'Website Checking',
];

const t = (path, name, category) => ({ path, name, category });

export const TOOLS = [
  // JSON Tools
  t('/json-formatter', 'JSON Formatter', 'JSON Tools'),
  t('/json-validator', 'JSON Validator', 'JSON Tools'),
  t('/json-beautifier', 'JSON Beautifier', 'JSON Tools'),
  t('/json-minifier', 'JSON Minifier', 'JSON Tools'),
  t('/json-to-csharp', 'JSON to C#', 'JSON Tools'),
  t('/json-to-typescript', 'JSON to TypeScript', 'JSON Tools'),
  t('/json-to-java', 'JSON to Java', 'JSON Tools'),
  t('/json-to-python', 'JSON to Python', 'JSON Tools'),
  t('/json-to-go', 'JSON to Go', 'JSON Tools'),
  t('/json-to-php', 'JSON to PHP', 'JSON Tools'),
  t('/json-to-kotlin', 'JSON to Kotlin', 'JSON Tools'),
  t('/yaml-to-json', 'YAML to JSON', 'JSON Tools'),
  t('/csv-to-json', 'CSV to JSON', 'JSON Tools'),
  t('/json-to-csv', 'JSON to CSV', 'JSON Tools'),

  // Encoders & Decoders
  t('/url-encoder', 'URL Encoder', 'Encoders & Decoders'),
  t('/url-decoder', 'URL Decoder', 'Encoders & Decoders'),
  t('/base64-encoder', 'Base64 Encoder', 'Encoders & Decoders'),
  t('/base64-decoder', 'Base64 Decoder', 'Encoders & Decoders'),
  t('/html-encoder', 'HTML Encoder', 'Encoders & Decoders'),
  t('/html-decoder', 'HTML Decoder', 'Encoders & Decoders'),
  t('/jwt-decoder', 'JWT Decoder', 'Encoders & Decoders'),

  // Generators & Hashes
  t('/uuid-generator', 'UUID Generator', 'Generators & Hashes'),
  t('/uuid-validator', 'UUID Validator', 'Generators & Hashes'),
  t('/uuid-parser', 'UUID Parser', 'Generators & Hashes'),
  t('/jwt-generator', 'JWT Generator', 'Generators & Hashes'),
  t('/hash-generator', 'Hash Generator', 'Generators & Hashes'),
  t('/sha256-generator', 'SHA-256 Generator', 'Generators & Hashes'),
  t('/sha512-generator', 'SHA-512 Generator', 'Generators & Hashes'),
  t('/md5-generator', 'MD5 Generator', 'Generators & Hashes'),

  // Web Tools
  t('/timestamp-converter', 'Timestamp Converter', 'Web Tools'),
  t('/unix-timestamp', 'Unix Timestamp', 'Web Tools'),
  t('/color-converter', 'Color Converter', 'Web Tools'),
  t('/hex-to-rgb', 'HEX to RGB', 'Web Tools'),
  t('/rgb-to-hex', 'RGB to HEX', 'Web Tools'),
  t('/query-string-parser', 'Query String Parser', 'Web Tools'),
  t('/query-string-generator', 'Query String Generator', 'Web Tools'),
  t('/cron-expression-generator', 'Cron Expression Generator', 'Web Tools'),
  t('/cron-expression-parser', 'Cron Expression Parser', 'Web Tools'),

  // Text & Data
  t('/xml-formatter', 'XML Formatter', 'Text & Data'),
  t('/xml-validator', 'XML Validator', 'Text & Data'),
  t('/yaml-formatter', 'YAML Formatter', 'Text & Data'),
  t('/text-counter', 'Text Counter', 'Text & Data'),
  t('/case-converter', 'Case Converter', 'Text & Data'),
  t('/text-to-slug', 'Text to Slug', 'Text & Data'),
  t('/slug-generator', 'Slug Generator', 'Text & Data'),
  t('/regex-tester', 'Regex Tester', 'Text & Data'),
  t('/regex-generator', 'Regex Generator', 'Text & Data'),
  t('/diff-checker', 'Diff Checker', 'Text & Data'),
  t('/number-base-converter', 'Number Base Converter', 'Text & Data'),
  t('/binary-to-decimal', 'Binary to Decimal', 'Text & Data'),
  t('/decimal-to-binary', 'Decimal to Binary', 'Text & Data'),
  t('/hex-to-decimal', 'HEX to Decimal', 'Text & Data'),
  t('/decimal-to-hex', 'Decimal to HEX', 'Text & Data'),

  // Website Checking
  t('/website-status-checker', 'Website Status Checker', 'Website Checking'),
];

// Short descriptions used on the Categories and Tools pages (presentation/SEO only).
export const CATEGORY_INFO = {
  'JSON Tools': 'Format, validate, beautify and minify JSON, generate C#, TypeScript, Java, Python, Go, PHP and Kotlin models from it, or convert between JSON, YAML and CSV.',
  'Encoders & Decoders': 'URL, Base64 and HTML encoding and decoding, plus a JWT decoder for reading token claims.',
  'Generators & Hashes': 'Generate UUIDs and JWTs, validate UUIDs, and create MD5, SHA-256 and SHA-512 hashes.',
  'Web Tools': 'Timestamps, color codes, query strings and cron expressions - the small things web work keeps throwing at you.',
  'Text & Data': 'Format XML and YAML, count text, change case, make slugs, test regex, diff two texts and convert number bases.',
  'Website Checking': 'Check whether a website or URL is reachable from your browser.',
};
