// SEO + help copy for every tool page. Pure data, no logic touches the tools.
// Rules followed here: only describe what each tool actually does, give real
// examples, and keep claims modest (no invented specs, stats or reviews).
//
// getToolContent(path, name) -> { group, lede, meta, what, problem, steps, example,
//   useCases, tasks, faqs, relatedGroup } or null when a path has no copy.

const BT = '`';
const SAMPLE_USER = '{"id":1,"name":"Ada"}';

// ---- JSON formatter / validator / minifier --------------------------------
const jsonFmt = {
  '/json-formatter': {
    lede: 'Paste messy or minified JSON, get clean, indented JSON back. Then copy it with one click.',
    what: 'JSON Formatter (also called a JSON beautifier or pretty printer) takes a JSON string and re-prints it with 2-space indentation so you can actually read it.',
    problem: 'API responses, config files and log lines often arrive as one unreadable line. Formatting by hand is slow and error-prone, and a missing comma is easy to miss.',
    steps: ['Paste your JSON into the input box.', 'Press Process.', 'Copy the formatted result. If the JSON is invalid, you get the parser error instead.'],
    example: { inLabel: 'Input', input: '{"name":"Ada","tags":["dev","math"]}', outLabel: 'Output', output: '{\n  "name": "Ada",\n  "tags": [\n    "dev",\n    "math"\n  ]\n}' },
    useCases: ['Reading a minified API response', 'Cleaning up a JSON config before committing it', 'Making a payload readable for a bug report'],
    tasks: ['Format JSON online', 'Pretty print JSON', 'Beautify minified JSON'],
  },
  '/json-validator': {
    lede: 'Check whether a string is valid JSON and see the parser error if it is not.',
    what: 'JSON Validator parses your text with the browser\'s own JSON parser and tells you whether it is valid JSON.',
    problem: 'A trailing comma, single quotes or an unescaped character breaks JSON.parse in production. Validating first tells you something is wrong before your app does.',
    steps: ['Paste your JSON into the input box.', 'Press Process.', 'You get "Valid JSON!" or the exact parser error message.'],
    example: { inLabel: 'Input', input: '{"name": "Ada",}', outLabel: 'Result', output: 'Error: (parser message about the unexpected "}" - wording depends on your browser)' },
    useCases: ['Checking a hand-edited config file', 'Debugging a 400 error caused by a bad request body', 'Validating JSON before importing it somewhere strict'],
    tasks: ['Validate JSON online', 'Find a JSON syntax error', 'Check if JSON is valid'],
  },
  '/json-minifier': {
    lede: 'Strip whitespace from JSON so it is as small as it can be, without changing the data.',
    what: 'JSON Minifier parses your JSON and prints it back on a single line with no extra spaces or line breaks.',
    problem: 'Pretty-printed JSON carries whitespace you do not need in a request body, a query parameter or an environment variable.',
    steps: ['Paste formatted JSON into the input box.', 'Press Process.', 'Copy the single-line output.'],
    example: { inLabel: 'Input', input: '{\n  "name": "Ada",\n  "tags": ["dev", "math"]\n}', outLabel: 'Output', output: '{"name":"Ada","tags":["dev","math"]}' },
    useCases: ['Putting JSON into an env var or a one-line config', 'Shrinking a payload for a quick test', 'Comparing two JSON blobs without whitespace noise'],
    tasks: ['Minify JSON online', 'Compress JSON to one line', 'Remove whitespace from JSON'],
  },
};

// ---- JSON to code ---------------------------------------------------------
const LANGS = {
  csharp: { label: 'C#', output: 'public class Root {\n    public double Id { get; set; }\n    public string Name { get; set; }\n}', note: 'Numbers become double, text becomes string, true/false becomes bool.' },
  typescript: { label: 'TypeScript', output: 'export interface Root {\n    id: number;\n    name: string;\n}', note: 'Output is a TypeScript interface named Root.' },
  java: { label: 'Java', output: 'public class Root {\n    private Double id;\n    public Double getId() { return id; }\n    public void setId(Double id) { this.id = id; }\n    private String name;\n    public String getName() { return name; }\n    public void setName(String name) { this.name = name; }\n}', note: 'Fields come with getters and setters.' },
  python: { label: 'Python', output: 'from typing import Any\nfrom dataclasses import dataclass\n\n@dataclass\nclass Root:\n    id: float\n    name: str', note: 'Output is a dataclass with type hints.' },
  go: { label: 'Go', output: `type Root struct {\n    Id float64 ${BT}json:"id"${BT}\n    Name string ${BT}json:"name"${BT}\n}`, note: 'Each field gets a json struct tag.' },
  php: { label: 'PHP', output: 'class Root {\n    public $id;\n    public $name;\n}', note: 'Output is a class with public properties.' },
  kotlin: { label: 'Kotlin', output: 'data class Root(\n    val id: Double?\n    val name: String?\n)', note: 'Output is a data class with nullable properties.' },
};

// ---- Encoders / decoders --------------------------------------------------
const enc = {
  '/url-encoder': { what: 'URL Encoder percent-encodes text so it is safe inside a URL or query string (spaces become %20, & becomes %26).', lede: 'Turn text into a URL-safe string. Spaces, ampersands and special characters get percent-encoded.', ex: ['a b&c=d', 'a%20b%26c%3Dd'], tasks: ['URL encode online', 'Percent-encode a query value', 'Escape special characters in a URL'] },
  '/url-decoder': { what: 'URL Decoder turns percent-encoded text such as %20 or %26 back into readable characters.', lede: 'Decode percent-encoded URLs and query values back into plain text.', ex: ['a%20b%26c%3Dd', 'a b&c=d'], tasks: ['URL decode online', 'Decode %20 in a URL', 'Read an encoded query string'] },
  '/base64-encoder': { what: 'Base64 Encoder converts text (including UTF-8 characters) into a Base64 string.', lede: 'Encode text to Base64 in your browser. Handles UTF-8 input.', ex: ['hello', 'aGVsbG8='], tasks: ['Base64 encode a string', 'Encode text to Base64', 'Base64 online encoder'] },
  '/base64-decoder': { what: 'Base64 Decoder converts a Base64 string back into the original text.', lede: 'Decode Base64 strings back into readable text, right in your browser.', ex: ['aGVsbG8=', 'hello'], tasks: ['Base64 decode online', 'Decode a Base64 string', 'Read Base64 encoded text'] },
  '/html-encoder': { what: 'HTML Encoder replaces &, < and > with their HTML entities so markup shows up as text instead of being rendered.', lede: 'Escape HTML so tags display as text. Converts &, < and > to entities.', ex: ['<b>Tom & Jerry</b>', '&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;'], tasks: ['HTML escape online', 'Encode HTML entities', 'Show HTML tags as text'] },
  '/html-decoder': { what: 'HTML Decoder turns HTML entities such as &lt; and &amp; back into the characters they stand for.', lede: 'Decode HTML entities like &lt; and &amp; back into plain characters.', ex: ['&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;', '<b>Tom & Jerry</b>'], tasks: ['HTML decode online', 'Unescape HTML entities', 'Convert &amp; back to &'] },
};

// ---- UUID -----------------------------------------------------------------
const uuid = {
  '/uuid-generator': { lede: 'Generate random UUIDs (v4) in bulk and copy them.', what: 'UUID Generator creates random UUIDs using your browser\'s crypto.randomUUID(), the same kind of ID used for database keys and request IDs.', ex: ['Count: 3', '3b241101-e2bb-4255-8caf-4136c566a962\n(three random UUIDs, different every time)'], steps: ['Choose how many UUIDs you need.', 'Press generate.', 'Copy the list.'], tasks: ['Generate a UUID online', 'Create random GUIDs', 'Bulk UUID generator'] },
  '/uuid-validator': { lede: 'Check whether a string is a correctly formatted UUID.', what: 'UUID Validator tests a string against the standard 8-4-4-4-12 hex layout, with a version digit of 1-5 and an RFC 4122 variant.', ex: ['123e4567-e89b-12d3-a456-426614174000', 'Valid UUID'], steps: ['Paste the UUID.', 'Press the validate button.', 'Read the result: Valid UUID or Invalid UUID.'], tasks: ['Validate a UUID', 'Check GUID format', 'Is this a valid UUID?'] },
  '/uuid-parser': { lede: 'Read the version and variant of a UUID.', what: 'UUID Parser checks the UUID format and reports its version digit and variant.', ex: ['123e4567-e89b-12d3-a456-426614174000', 'Version: 1\nVariant: RFC 4122 (Leach-Salz)'], steps: ['Paste the UUID.', 'Press the parse button.', 'Read the version and variant.'], tasks: ['Parse a UUID', 'Find UUID version', 'Inspect a GUID'] },
};

// ---- JWT ------------------------------------------------------------------
const jwt = {
  '/jwt-decoder': { lede: 'Paste a JWT, see its header and payload as readable JSON.', what: 'JWT Decoder splits a JSON Web Token into its three parts and shows the decoded header and payload. It does not verify the signature.', ex: ['header.payload.signature (a token starting with "ey...")', 'Header:\n{ "alg": "HS256", "typ": "JWT" }\n\nPayload:\n{ "sub": "1234567890", ... }'], steps: ['Paste the token (three parts separated by dots).', 'Press Decode Token.', 'Copy the header or payload.'], tasks: ['Decode a JWT online', 'Read JWT claims', 'Inspect a token payload'] },
  '/jwt-generator': { lede: 'Build a signed HS256 JWT from your own payload and secret.', what: 'JWT Generator signs the JSON payload you provide using HMAC-SHA256 (HS256) and a secret key, and returns a token you can use for testing.', ex: ['Payload: {"sub":"1234567890","name":"John Doe"}\nSecret: my-test-secret', 'A token in the form header.payload.signature'], steps: ['Edit the payload JSON.', 'Enter a secret (the default is "secret").', 'Press Generate Token and copy the result.'], tasks: ['Generate a JWT for testing', 'Create an HS256 token', 'Sign a JWT online'] },
};

// ---- XML / YAML / CSV -----------------------------------------------------
const dataFmt = {
  '/xml-formatter': { lede: 'Indent and tidy XML so you can read it.', what: 'XML Formatter re-prints XML with consistent indentation.', ex: ['<a><b>1</b></a>', '<a>\n    <b>1</b>\n</a>'], tasks: ['Format XML online', 'Pretty print XML', 'Beautify XML'] },
  '/xml-validator': { lede: 'Check whether XML is well-formed and see the error if it is not.', what: 'XML Validator parses your XML with the browser\'s XML parser and reports whether it is well-formed.', ex: ['<a><b></a>', 'Error: XML Validation Error (parser message)'], tasks: ['Validate XML online', 'Check XML is well-formed', 'Find an XML syntax error'] },
  '/yaml-formatter': { lede: 'Parse YAML and print it back in a clean, consistent style.', what: 'YAML Formatter loads your YAML and writes it out again in standard block style.', ex: ['name: Ada\ntags: [a, b]', 'name: Ada\ntags:\n  - a\n  - b'], tasks: ['Format YAML online', 'Clean up YAML', 'Normalize YAML'] },
  '/yaml-to-json': { lede: 'Convert YAML to JSON.', what: 'YAML to JSON loads your YAML and prints the same data as formatted JSON.', ex: ['name: Ada', '{\n  "name": "Ada"\n}'], tasks: ['Convert YAML to JSON', 'YAML to JSON online', 'Turn a YAML config into JSON'] },
  '/csv-to-json': { lede: 'Convert CSV rows into a JSON array of objects.', what: 'CSV to JSON uses the first line as headers and turns each following line into an object. Values come out as strings.', ex: ['id,name\n1,Ada', '[\n  {\n    "id": "1",\n    "name": "Ada"\n  }\n]'], tasks: ['Convert CSV to JSON', 'CSV to JSON online', 'Turn spreadsheet rows into JSON'] },
  '/json-to-csv': { lede: 'Convert a JSON array of objects into CSV.', what: 'JSON to CSV takes an array of objects, uses the first object\'s keys as the header row and prints one line per object.', ex: ['[{"id":1,"name":"Ada"}]', 'id,name\n1,Ada'], tasks: ['Convert JSON to CSV', 'JSON to CSV online', 'Export JSON as CSV'] },
};

// ---- Text -----------------------------------------------------------------
const text = {
  '/text-counter': { lede: 'Count characters, words and lines as you type.', what: 'Text Counter shows the number of characters, words and lines in whatever you paste.', ex: ['hello world', 'Characters: 11\nWords: 2\nLines: 1'], tasks: ['Count characters online', 'Word counter for developers', 'Check text length'] },
  '/case-converter': { lede: 'Switch text between UPPERCASE, lowercase and Title Case in one go.', what: 'Case Converter shows your text in uppercase, lowercase and title case at the same time.', ex: ['hello world', 'UPPERCASE:\nHELLO WORLD\n\nlowercase:\nhello world\n\nTitle Case:\nHello World'], tasks: ['Convert text to uppercase', 'Change case online', 'Title case converter'] },
  '/text-to-slug': { lede: 'Turn any text into a clean, URL-friendly slug.', what: 'Text to Slug lowercases text, replaces runs of non-alphanumeric characters with hyphens and trims hyphens from the ends.', ex: ['Hello, World! 2026', 'hello-world-2026'], tasks: ['Text to slug', 'Make a URL slug', 'Slugify a title'] },
  '/slug-generator': { lede: 'Generate URL slugs from titles and headings.', what: 'Slug Generator turns a title into a lowercase, hyphen-separated slug you can use in a URL or file name.', ex: ['Hello, World! 2026', 'hello-world-2026'], tasks: ['Generate a slug', 'Blog post slug generator', 'Create SEO-friendly URLs'] },
};

// ---- Hashes ---------------------------------------------------------------
const H = {
  md5: '5d41402abc4b2a76b9719d911017c592',
  sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
  sha512: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
};
const hash = {
  '/hash-generator': { lede: 'Hash any string. This page uses SHA-256.', what: 'Hash Generator returns the SHA-256 hash of the text you type, updating as you type.', ex: ['hello', H.sha256], tasks: ['Generate a hash online', 'SHA-256 hash of a string', 'Checksum a string'] },
  '/sha256-generator': { lede: 'Generate the SHA-256 hash of any text.', what: 'SHA-256 Generator returns the 64-character hex SHA-256 digest of your input.', ex: ['hello', H.sha256], tasks: ['SHA-256 online', 'Generate SHA256 hash', 'SHA-256 checksum of a string'] },
  '/sha512-generator': { lede: 'Generate the SHA-512 hash of any text.', what: 'SHA-512 Generator returns the 128-character hex SHA-512 digest of your input.', ex: ['hello', H.sha512], tasks: ['SHA-512 online', 'Generate SHA512 hash', 'SHA-512 checksum of a string'] },
  '/md5-generator': { lede: 'Generate the MD5 hash of any text.', what: 'MD5 Generator returns the 32-character hex MD5 digest of your input.', ex: ['hello', H.md5], tasks: ['MD5 online', 'Generate MD5 hash', 'MD5 checksum of a string'] },
};

// ---- Timestamps -----------------------------------------------------------
const ts = {
  '/timestamp-converter': { lede: 'Convert Unix timestamps to human-readable dates, or date strings to Unix time.', ex: ['1700000000', 'ISO: 2023-11-14T22:13:20.000Z\nUnix (ms): 1700000000000\nUnix (s): 1700000000\n(UTC and local time are shown too)'], tasks: ['Convert timestamp to date', 'Date to Unix timestamp', 'Epoch converter'] },
  '/unix-timestamp': { lede: 'Turn a Unix (epoch) timestamp into UTC, local and ISO time.', ex: ['0', 'ISO: 1970-01-01T00:00:00.000Z\nUnix (ms): 0\nUnix (s): 0'], tasks: ['Unix timestamp converter', 'Epoch to date', 'What date is this Unix time?'] },
};

// ---- Colors ---------------------------------------------------------------
const color = {
  '/color-converter': { lede: 'Convert colors between HEX and RGB.', ex: ['#FF5733', 'rgb(255, 87, 51)'], tasks: ['HEX to RGB', 'RGB to HEX', 'Color code converter'] },
  '/hex-to-rgb': { lede: 'Convert a HEX color code to RGB.', ex: ['#FF5733', 'rgb(255, 87, 51)'], tasks: ['HEX to RGB converter', 'Hex color to rgb()', 'Convert #FFF to RGB'] },
  '/rgb-to-hex': { lede: 'Convert an RGB color to a HEX code.', ex: ['rgb(255, 87, 51)', '#FF5733'], tasks: ['RGB to HEX converter', 'rgb() to hex color', 'Convert RGB to #hex'] },
};

// ---- Number bases ---------------------------------------------------------
const base = {
  '/number-base-converter': { lede: 'Convert numbers between bases 2 to 36 (binary, octal, decimal, hex and more).', ex: ['255 (from base 10 to base 16)', 'FF'], tasks: ['Number base converter', 'Convert between binary, decimal and hex', 'Base 10 to base 16'] },
  '/binary-to-decimal': { lede: 'Convert a binary number to decimal.', ex: ['1010 (from base 2 to base 10)', '10'], tasks: ['Binary to decimal', 'Convert binary online', 'What is 1010 in decimal?'] },
  '/decimal-to-binary': { lede: 'Convert a decimal number to binary.', ex: ['10 (from base 10 to base 2)', '1010'], tasks: ['Decimal to binary', 'Convert decimal to binary online', 'What is 10 in binary?'] },
  '/hex-to-decimal': { lede: 'Convert a hexadecimal number to decimal.', ex: ['FF (from base 16 to base 10)', '255'], tasks: ['Hex to decimal', 'Convert hex online', 'What is FF in decimal?'] },
  '/decimal-to-hex': { lede: 'Convert a decimal number to hexadecimal.', ex: ['255 (from base 10 to base 16)', 'FF'], tasks: ['Decimal to hex', 'Convert decimal to hexadecimal', 'What is 255 in hex?'] },
};

// ---- Group definitions ----------------------------------------------------
const q = (question, answer) => ({ q: question, a: answer });
const LOCAL = q('Is my data sent to a server?', 'The processing runs in your browser, so what you paste into the tool is not uploaded for processing. As with any tool, avoid pasting live secrets you cannot afford to leak.');

const GROUPS = [
  {
    id: 'json-format',
    test: (p) => p in jsonFmt,
    build: (n, p) => {
      const v = jsonFmt[p];
      return {
        ...v,
        meta: `${n} online: ${v.lede} Free, runs in your browser, no signup.`,
        faqs: [
          q('What makes JSON invalid?', 'Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, and comments. Strict JSON allows none of these.'),
          q('Does it change my data?', 'No. The tool parses your JSON and prints it again. Keys and values stay the same; only whitespace changes.'),
          LOCAL,
        ],
      };
    },
  },
  {
    id: 'json-convert',
    test: (p) => /^\/json-to-(csharp|typescript|java|python|go|php|kotlin)$/.test(p),
    build: (n, p) => {
      const L = LANGS[p.split('-to-')[1]];
      return {
        lede: `Paste JSON, get a ${L.label} model for it.`,
        meta: `${n}: generate a ${L.label} class or type from a JSON sample. Free and runs in your browser.`,
        what: `${n} reads a JSON object and writes a ${L.label} type with one field per top-level key. ${L.note}`,
        problem: `Typing out model classes by hand for every API response is repetitive. Generating the first draft from a real JSON sample saves the boring part.`,
        steps: ['Paste a JSON object into the input box.', 'Press the convert button.', `Copy the generated ${L.label} code and adjust names or types to fit your project.`],
        example: { inLabel: 'Input', input: SAMPLE_USER, outLabel: `${L.label} output`, output: L.output },
        useCases: ['Creating models for a new API integration', 'Mocking a type from a sample response', 'Starting a DTO without typing every property'],
        tasks: [`JSON to ${L.label}`, `Generate ${L.label} class from JSON`, `${L.label} model from JSON`],
        faqs: [
          q('Does it handle nested objects and arrays?', 'It maps top-level keys. Nested objects and arrays come out as a generic type (such as object or any), so you will want to refine those by hand.'),
          q('How are field types chosen?', 'From the sample values: numbers, booleans and strings get matching types, anything else falls back to a generic type. One sample cannot show whether a field is optional.'),
          LOCAL,
        ],
      };
    },
  },
  {
    id: 'encoders',
    test: (p) => p in enc,
    build: (n, p) => {
      const v = enc[p];
      return {
        lede: v.lede,
        meta: `${n} online: ${v.lede} Free, instant, and it runs in your browser.`,
        what: v.what,
        problem: 'Encoded values show up in URLs, headers, tokens and logs. Decoding or encoding them by hand is slow, and one wrong character breaks the whole string.',
        steps: ['Type or paste your input on the left.', 'The result appears on the right as you type.', 'Press Copy to grab the output.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Debugging query strings and redirect URLs', 'Reading values from HTTP headers or config files', 'Preparing text to embed in a URL or HTML page'],
        tasks: v.tasks,
        faqs: [
          q('What if the output is empty?', 'The tool shows nothing when the input cannot be converted, for example malformed Base64 or a stray % in a URL. Check the input for typos or cut-off characters.'),
          q('Is encoding the same as encryption?', 'No. Encoding only changes the representation, and anyone can reverse it. Never use it to protect secrets.'),
          LOCAL,
        ],
      };
    },
  },
  {
    id: 'uuid',
    test: (p) => p in uuid,
    build: (n, p) => {
      const v = uuid[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free, no signup, runs in your browser.`,
        what: v.what,
        problem: 'You need IDs for test data, or you need to know whether an ID from a log or database is well-formed. Doing that by eye does not scale.',
        steps: v.steps,
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Seeding test data with unique IDs', 'Checking an ID copied from logs', 'Working out which UUID version a system produces'],
        tasks: v.tasks,
        faqs: [
          q('What is a UUID?', 'A UUID (or GUID) is a 128-bit identifier written as 32 hex digits in five groups, for example 123e4567-e89b-12d3-a456-426614174000.'),
          q('Which versions does the validator accept?', 'It accepts the standard layout with a version digit from 1 to 5 and an RFC 4122 variant.'),
          LOCAL,
        ],
      };
    },
  },
  {
    id: 'jwt',
    test: (p) => p in jwt,
    build: (n, p) => {
      const v = jwt[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free and runs in your browser.`,
        what: v.what,
        problem: 'Auth bugs often come down to what is inside a token: a wrong claim, an expired time, a missing role. Reading a JWT by hand means decoding Base64 pieces separately.',
        steps: v.steps,
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Checking claims like sub, exp and roles while debugging auth', 'Making a test token for a local API', 'Explaining to a teammate what a token carries'],
        tasks: v.tasks,
        faqs: [
          q('Does it verify the signature?', 'No. Decoding only reads the header and payload. A decoded token is not proof the token is genuine.'),
          q('Is a JWT payload secret?', 'No. The payload is only encoded, not encrypted, so anyone holding the token can read it. Do not put sensitive data in it.'),
          q('Which algorithm does the generator use?', 'HS256 (HMAC-SHA256) with the secret you enter.'),
        ],
      };
    },
  },
  {
    id: 'data-format',
    test: (p) => p in dataFmt,
    build: (n, p) => {
      const v = dataFmt[p];
      return {
        lede: v.lede,
        meta: `${n} online: ${v.lede} Free, no signup, runs in your browser.`,
        what: v.what,
        problem: 'Config files, exports and API payloads come in different formats, and moving between them by hand is where typos creep in.',
        steps: ['Paste your data into the input box.', 'Press Process.', 'Copy the output, or read the error message if the input could not be parsed.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Converting a config between formats', 'Checking a document before committing it', 'Turning an export into something your code can read'],
        tasks: v.tasks,
        faqs: p.includes('csv')
          ? [
              q('Does it handle quoted fields or commas inside values?', 'No. It splits on commas, so a value that contains a comma will be split. Use it for simple, flat data.'),
              q('Why are numbers strings in the JSON?', 'CSV has no types, and this tool keeps every value as text.'),
              LOCAL,
            ]
          : [
              q('What happens if my input is invalid?', 'You get the parser error message instead of output, so you can find the problem.'),
              q('Does it change my data?', 'It re-reads and re-prints the same content. Only the formatting or format changes.'),
              LOCAL,
            ],
      };
    },
  },
  {
    id: 'text',
    test: (p) => p in text,
    build: (n, p) => {
      const v = text[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free and instant, right in your browser.`,
        what: v.what,
        problem: 'Renaming things, writing URLs and checking limits are small jobs that interrupt real work. Doing them in a spreadsheet or by hand is slower than it should be.',
        steps: ['Type or paste your text.', 'The result updates as you type.', 'Copy it where you need it.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Naming URLs, files and branches', 'Checking text against a character limit', 'Normalizing text before pasting it into code'],
        tasks: v.tasks,
        faqs: [
          q('Does the slug keep non-English letters?', 'No. The slug keeps only a-z and 0-9 and replaces everything else with hyphens, so accented or non-Latin characters are dropped.'),
          LOCAL,
        ].slice(p.includes('slug') ? 0 : 1),
      };
    },
  },
  {
    id: 'hash',
    test: (p) => p in hash,
    build: (n, p) => {
      const v = hash[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free, instant, runs in your browser.`,
        what: v.what,
        problem: 'You need a quick checksum or fingerprint for a string, and you do not want to open a terminal or write a script just to get one.',
        steps: ['Type or paste your text.', 'The hash appears below as you type.', 'Press Copy hash.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Comparing a value against a known checksum', 'Making a stable fingerprint for a string', 'Generating test data'],
        tasks: v.tasks,
        faqs: [
          q('Can a hash be reversed?', 'Hash functions are one-way: you cannot recover the input from the output.'),
          q('Should I use this to store passwords?', 'No. Fast hashes such as MD5 and SHA are not suitable for password storage. Use a slow, salted algorithm designed for passwords.'),
          q('Is MD5 safe for security?', 'No. MD5 is considered broken for security uses. It is still handy for non-security checksums.'),
        ],
      };
    },
  },
  {
    id: 'timestamp',
    test: (p) => p in ts,
    build: (n, p) => {
      const v = ts[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free, instant, runs in your browser.`,
        what: `${n} converts a number or date string into UTC, local time, ISO 8601, and Unix time in seconds and milliseconds. The box starts with the current time.`,
        problem: 'Logs, databases and APIs store time as numbers that nobody can read at a glance, and mixing up seconds and milliseconds is an easy mistake.',
        steps: ['Enter a Unix timestamp or a date string.', 'The conversions appear as you type.', 'Copy the result.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Reading timestamps in logs and database rows', 'Checking token expiry times', 'Converting a date into epoch seconds for an API'],
        tasks: v.tasks,
        faqs: [
          q('Seconds or milliseconds?', 'All-digit input longer than 11 digits is treated as milliseconds; shorter input is treated as seconds.'),
          q('Which time zone is used?', 'Both UTC and your browser\'s local time zone are shown.'),
        ],
      };
    },
  },
  {
    id: 'color',
    test: (p) => p in color,
    build: (n, p) => {
      const v = color[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free and instant, right in your browser.`,
        what: `${n} converts between HEX codes (#FFF or #FFFFFF) and rgb() values. Enter a HEX code to get RGB, or an rgb() value to get HEX.`,
        problem: 'Design specs and CSS use different color formats, and converting by hand means doing hex math in your head.',
        steps: ['Enter a color such as #FF5733 or rgb(255, 87, 51).', 'The converted value appears as you type.', 'Press Copy.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Translating a designer\'s HEX codes for a CSS rule that uses rgb()', 'Matching colors between tools', 'Checking what a 3-digit HEX expands to'],
        tasks: v.tasks,
        faqs: [
          q('Which formats are supported?', 'HEX (3 or 6 digits, starting with #) and rgb(). Other formats such as HSL are not supported.'),
        ],
      };
    },
  },
  {
    id: 'number-base',
    test: (p) => p in base,
    build: (n, p) => {
      const v = base[p];
      return {
        lede: v.lede,
        meta: `${n}: ${v.lede} Free and instant, right in your browser.`,
        what: `${n} converts a whole number from one base to another using the From and To base selectors. Letters in the result are uppercase.`,
        problem: 'Bit masks, memory addresses, color codes and permissions all show up in different bases, and converting by hand is slow and error-prone.',
        steps: ['Set the From and To bases.', 'Type your number.', 'Copy the converted value.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Reading bit flags and masks', 'Converting hex values from a debugger or a spec', 'Learning how number bases relate'],
        tasks: v.tasks,
        faqs: [
          q('What if I see "Invalid number for base"?', 'The input has a character that does not exist in the From base, for example a 2 in a binary number.'),
          q('Are fractions supported?', 'The tool works on whole numbers. Anything after a decimal point is ignored.'),
        ],
      };
    },
  },
  {
    id: 'regex',
    test: (p) => p === '/regex-tester' || p === '/regex-generator',
    build: (n) => ({
      lede: 'Write a pattern, set the flags, and see every match in your sample text.',
      meta: `${n}: test JavaScript regular expressions against sample text. Free, runs in your browser.`,
      what: `${n} runs your pattern against your text using the JavaScript RegExp engine and lists the matches.`,
      problem: 'Regex is hard to get right without feedback. Testing in your app means rebuilding and rerunning every time you tweak the pattern.',
      steps: ['Enter a pattern and flags (g is on by default).', 'Paste the text to search.', 'Run the test and review the matches. An invalid pattern shows the error message.'],
      example: { inLabel: 'Pattern and text', input: 'Pattern: \\d+   Flags: g\nText: order 66 and 42', outLabel: 'Matches', output: '66\n42' },
      useCases: ['Checking a pattern before using it in code', 'Extracting numbers or IDs from log lines', 'Debugging a regex that matches too much'],
      tasks: ['Regex tester online', 'Test a regular expression', 'JavaScript regex tester'],
      faqs: [
        q('Which regex flavor is this?', 'JavaScript (ECMAScript). Other languages differ in details such as lookbehind support and named groups.'),
        q('Why does a global match return nothing?', 'Check the pattern and flags. An escaped backslash, a missing flag or a typo is the usual cause.'),
      ],
    }),
  },
  {
    id: 'diff',
    test: (p) => p === '/diff-checker',
    build: (n) => ({
      lede: 'Paste two versions of a text and see what was added or removed, line by line.',
      meta: `${n}: compare two texts and see added and removed lines. Free, runs in your browser.`,
      what: `${n} compares two blocks of text line by line and marks lines that were added (+), removed (-) or unchanged.`,
      problem: 'When two configs, responses or snippets look the same but behave differently, reading them side by side by eye misses things.',
      steps: ['Paste the original text on one side and the changed text on the other.', 'Press compare.', 'Read the result and copy it if you need to share it.'],
      example: { inLabel: 'Original vs changed', input: 'host=localhost\nport=80\n\nhost=localhost\nport=8080', outLabel: 'Result', output: '  host=localhost\n- port=80\n+ port=8080' },
      useCases: ['Spotting what changed between two config files', 'Comparing an expected and an actual API response', 'Checking edits before pasting them back'],
      tasks: ['Diff checker online', 'Compare two texts', 'Find differences between two files'],
      faqs: [
        q('Is the comparison by line or by character?', 'By line.'),
        LOCAL,
      ],
    }),
  },
  {
    id: 'query',
    test: (p) => p === '/query-string-parser' || p === '/query-string-generator',
    build: (n, p) => {
      const parse = p.includes('parser');
      return {
        lede: parse ? 'Break a URL or query string into key/value pairs.' : 'Turn a JSON object into a URL query string.',
        meta: `${n}: ${parse ? 'parse a URL query string into JSON' : 'build a URL query string from JSON'}. Free, runs in your browser.`,
        what: parse
          ? `${n} reads the part after the ? in a URL (or a bare query string) and prints the keys and values as JSON.`
          : `${n} takes a flat JSON object and prints it as an encoded key=value query string.`,
        problem: 'Long URLs with many parameters are hard to read, and building encoded query strings by hand invites mistakes.',
        steps: parse
          ? ['Paste a full URL or just the query string.', 'Press Process.', 'Read or copy the JSON.']
          : ['Paste a JSON object.', 'Press Process.', 'Copy the query string.'],
        example: parse
          ? { inLabel: 'Input', input: 'https://example.com/search?q=json&page=2', outLabel: 'Output', output: '{\n  "q": "json",\n  "page": "2"\n}' }
          : { inLabel: 'Input', input: '{"q":"json","page":2}', outLabel: 'Output', output: 'q=json&page=2' },
        useCases: ['Debugging tracking and filter parameters', 'Building test URLs for an API', 'Checking what a redirect URL really carries'],
        tasks: parse ? ['Parse query string', 'URL parameters to JSON', 'Read URL parameters'] : ['Build a query string', 'JSON to query string', 'Generate URL parameters'],
        faqs: [
          q(parse ? 'What about repeated keys?' : 'Does it support nested objects?', parse ? 'The result is a flat object, so when a key appears more than once only one value is kept.' : 'Use a flat object. Nested values are not expanded into separate parameters.'),
          LOCAL,
        ],
      };
    },
  },
  {
    id: 'cron',
    test: (p) => p === '/cron-expression-generator' || p === '/cron-expression-parser',
    build: (n) => ({
      lede: 'Type a cron expression, read it in plain English.',
      meta: `${n}: translate cron expressions into plain English. Free, runs in your browser.`,
      what: `${n} turns a cron expression such as */5 * * * * into a readable description. Edit the expression and the description updates as you type.`,
      problem: 'Cron syntax is compact and easy to misread. A schedule that runs hourly instead of daily is a bad surprise.',
      steps: ['Type or paste a cron expression (five fields).', 'Read the plain-English description.', 'Press Copy expression or Copy description.'],
      example: { inLabel: 'Input', input: '*/5 * * * *', outLabel: 'Output', output: 'Every 5 minutes' },
      useCases: ['Double-checking a schedule before deploying it', 'Reading cron lines in an old config', 'Explaining a schedule to a teammate'],
      tasks: ['Cron expression explained', 'Cron to human readable', 'Cron expression parser'],
      faqs: [
        q('What do the five fields mean?', 'In order: minute, hour, day of month, month, day of week.'),
        q('Does it show the next run time?', 'No. It describes the schedule in words; it does not list upcoming run times.'),
      ],
    }),
  },
  {
    id: 'website',
    test: (p) => p === '/website-status-checker',
    build: (n) => ({
      lede: 'Check whether a website or URL is reachable from your browser.',
      meta: `${n}: check if a website is up by domain name or URL. Free, runs from your browser.`,
      what: `${n} sends a lightweight request from your browser to each address you enter and reports whether it answered, the HTTP status when the site allows it, any redirect and the response time.`,
      problem: 'When a page will not load you want to know whether it is the site, your network or a typo, without opening five different "is it down" sites.',
      steps: ['Enter one or more domains or URLs, one per line.', 'Press Check status (or Ctrl/Cmd + Enter).', 'Read each result and copy them all with Copy results.'],
      example: { inLabel: 'Input', input: 'example.com\nhttps://example.com/some/path', outLabel: 'Output', output: 'One result per line: status label, HTTP status (when readable), redirect target and response time.' },
      useCases: ['Checking whether a site is reachable after a deploy', 'Telling a DNS or network issue from a typo', 'Spot-checking several URLs at once'],
      tasks: ['Is my website down', 'Check website status', 'URL reachability check'],
      faqs: [
        q('Is this a worldwide uptime check?', 'No. It tests what your own browser and network can reach. A site that is down for others may load for you, and the reverse.'),
        q('Why is there no HTTP status for some sites?', 'Some sites do not let browsers read their response. We can tell that the site answered, but not its status code.'),
        q('How many addresses can I check at once?', 'Up to 10, one per line.'),
      ],
    }),
  },
];

export function getToolGroup(path) {
  const g = GROUPS.find((x) => x.test(path));
  return g ? g.id : null;
}

export function getToolContent(path, name) {
  const g = GROUPS.find((x) => x.test(path));
  if (!g) return null;
  return { group: g.id, ...g.build(name, path) };
}
