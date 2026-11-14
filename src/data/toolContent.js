// SEO + help copy for every tool page. Pure data, no logic touches the tools.
// Rules followed here: only describe what each tool actually does, give real
// examples, and keep claims modest (no invented specs, stats or reviews).
//
// getToolContent(path, name) -> { group, lede, meta, what, problem, steps, example,
//   useCases, tasks, faqs, relatedGroup } or null when a path has no copy.

import { EXTRA_MORE } from './toolExtra.js';
import { TOOL_GAP } from './toolGapContent.js';

const BT = '`';
const SAMPLE_USER = '{"id":1,"name":"Ada"}';
// JSON to C# page example. The output below is exactly what the converter writes for this input.
const CSHARP_SAMPLE = '{"id":1,"first_name":"Ada","active":true,"address":{"city":"Pune","zip":"411001"},"tags":["admin","dev"],"orders":[{"id":7,"total":19.5}]}';
const CSHARP_OUTPUT = 'using System.Collections.Generic;\n\npublic class Root {\n    public double Id { get; set; }\n    public string FirstName { get; set; }\n    public bool Active { get; set; }\n    public Address Address { get; set; }\n    public List<string> Tags { get; set; }\n    public List<Orders> Orders { get; set; }\n}\n\npublic class Orders {\n    public double Id { get; set; }\n    public double Total { get; set; }\n}\n\npublic class Address {\n    public string City { get; set; }\n    public string Zip { get; set; }\n}';

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
  '/json-beautifier': {
    lede: 'Turn minified or messy JSON into clean, indented, readable JSON.',
    what: 'JSON Beautifier re-prints JSON with 2-space indentation and one item per line, so nested objects and arrays are easy to follow.',
    problem: 'Logs, network panels and API clients often show JSON squeezed onto one line. Reading it that way hides the structure and makes mistakes easy to miss.',
    steps: ['Paste your JSON into the input box.', 'Press Process.', 'Copy the beautified result. If the JSON is invalid, you get the parser error instead.'],
    example: { inLabel: 'Input', input: '{"user":{"id":1,"roles":["admin","dev"]},"active":true}', outLabel: 'Output', output: '{\n  "user": {\n    "id": 1,\n    "roles": [\n      "admin",\n      "dev"\n    ]\n  },\n  "active": true\n}' },
    useCases: ['Reading a minified response copied from browser dev tools', 'Making JSON diff-friendly before code review', 'Pasting readable JSON into documentation or a bug report'],
    tasks: ['Beautify JSON online', 'Pretty print JSON', 'Make minified JSON readable'],
  },
  '/json-minifier': {
    lede: 'Minify JSON online: remove spaces and line breaks to get compact one-line JSON, and see how many characters it saved.',
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
  java: { label: 'Java', output: 'import java.util.List;\n\npublic class Root {\n    private Double id;\n    private String name;\n}', note: 'Fields are private. Getters and setters are not generated.' },
  python: { label: 'Python', output: 'from dataclasses import dataclass\nfrom typing import Any, Optional, List\n\n@dataclass\nclass Root:\n    id: float\n    name: str', note: 'Output is a dataclass with type hints.' },
  go: { label: 'Go', output: `type Root struct {\n    Id float64 ${BT}json:"id"${BT}\n    Name string ${BT}json:"name"${BT}\n}`, note: 'Each field gets a json struct tag.' },
  php: { label: 'PHP', output: 'class Root {\n    public float $id;\n    public string $name;\n}', note: 'Output is a class with typed public properties.' },
  kotlin: { label: 'Kotlin', output: 'data class Root(\n    val id: Double,\n    val name: String\n)', note: 'Output is a data class. Properties are non-nullable unless you tick Optional / nullable properties.' },
};

// ---- Encoders / decoders --------------------------------------------------
const enc = {
  '/url-encoder': { what: 'URL Encoder percent-encodes text so it is safe inside a URL or query string (spaces become %20, & becomes %26).', lede: 'Turn text into a URL-safe string. Spaces, ampersands and special characters get percent-encoded.', ex: ['a b&c=d', 'a%20b%26c%3Dd'], tasks: ['URL encode online', 'Percent-encode a query value', 'Escape special characters in a URL'] },
  '/url-decoder': { what: 'URL Decoder turns percent-encoded text such as %20 or %26 back into readable characters.', lede: 'Decode percent-encoded URLs and query values back into plain text.', ex: ['a%20b%26c%3Dd', 'a b&c=d'], tasks: ['URL decode online', 'Decode %20 in a URL', 'Read an encoded query string'] },
  '/base64-encoder': { what: 'Base64 Encoder converts text (including UTF-8 characters) into a Base64 string.', lede: 'Encode text to Base64 in your browser. Handles UTF-8 input.', ex: ['hello', 'aGVsbG8='], tasks: ['Base64 encode a string', 'Encode text to Base64', 'Base64 online encoder'] },
  '/base64-decoder': { what: 'Base64 Decoder converts a Base64 string back into plain text. Paste the encoded value and the original text appears straight away. It reads the result as UTF-8, so accented letters and emoji decode correctly.', lede: 'Online decode Base64: paste a Base64 string and read the plain text inside it, right in your browser.', problem: 'Base64 data turns up in API responses, config files, HTTP headers and emails. It looks like random letters, so you cannot read it without decoding it first.', ex: ['aGVsbG8=', 'hello'], tasks: ['Base64 decode online', 'Decode a Base64 string', 'Read Base64 encoded text'] },
  '/html-encoder': { what: 'HTML encoding replaces five characters with special meaning in common HTML text and quoted-attribute contexts — &, <, >, double quotes and apostrophes — with character references. This encoder converts them to &amp;, &lt;, &gt;, &quot; and &#39; so a browser displays them as text instead of parsing them as markup.', lede: 'Encode HTML online with this free HTML encoder. Escape ampersands, angle brackets and quotes as HTML entities so tags and special characters display as text. Conversion runs in your browser.', problem: 'A text snippet containing <, > or & can be interpreted as HTML markup instead of appearing literally on a page. Encoding those characters is useful when displaying code samples, markup snippets or user-provided text in the correct HTML context.', ex: [`<div class="note">Tom & Jerry's <special> offer</div>`, '&lt;div class=&quot;note&quot;&gt;Tom &amp; Jerry&#39;s &lt;special&gt; offer&lt;/div&gt;'], tasks: ['HTML encode a string online', 'HTML escape special characters', 'Encode ampersands, angle brackets and quotes', 'Convert HTML characters to entities', 'Show HTML tags as text', 'HTML encoder online'] },
  '/html-decoder': { what: 'An HTML decoder converts HTML character references back into the characters they represent. This tool handles named entities such as &amp; and &lt;, decimal references such as &#38;, and hexadecimal references such as &#x26;. It is useful for reading encoded text copied from HTML source, feeds, API responses and database fields.', lede: 'Decode HTML entities online: paste encoded text and turn named, decimal and hexadecimal character references back into readable text and markup. Processing happens in your browser.', problem: 'Text copied from HTML documents, scraped pages, RSS feeds or API responses can contain character references such as &quot;, &#39; and &amp;. Manually replacing them is slow and easy to get wrong, especially when numeric or Unicode characters are involved.', ex: ['&lt;b class=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/b&gt; &copy; 2026', '<b class="x">Tom & Jerry</b> © 2026'], tasks: ['HTML decoder online', 'Decode HTML entities to text', 'Unescape named HTML entities', 'Decode decimal and hexadecimal references', 'Decode text copied from HTML source'] },
};

// ---- UUID -----------------------------------------------------------------
const uuid = {
  '/uuid-generator': { lede: 'Use this free UUID generator online to create a random UUID instantly. Generate UUID v4 or time-ordered v7 values in bulk, copy them, or download a text file. Everything runs in your browser.', what: 'A UUID generator creates a universally unique identifier (UUID), a 128-bit value commonly used as a unique ID in applications and databases. This online UUID generator creates random version 4 UUIDs with your browser\'s crypto.randomUUID() and time-ordered version 7 UUIDs from the current time plus secure random bytes. Choose standard, UPPERCASE, no-hyphen or {braces} output, then copy or download the generated UUIDs.', ex: ['Example UUID v4', '3b241101-e2bb-4255-8caf-4136c566a962'], steps: ['A random UUID is generated when the page loads — copy it or press Generate another.', 'Choose the quantity, UUID version 4 (random) or 7 (time-ordered), and output format.', 'Copy one UUID or the full list, or download the generated UUIDs as a .txt file.'], tasks: ['UUID generator online', 'Generate a random UUID', 'UUID v4 generator', 'Online random UUID generator', 'Generate multiple UUIDs at once', 'Download UUIDs as a text file'] },
  '/uuid-validator': { lede: 'Check whether a UUID or GUID is valid and see which version it is.', what: 'UUID Validator tests a string against the standard 8-4-4-4-12 hex layout, with a version digit of 1-8 and an RFC 4122 / RFC 9562 variant. The nil and max UUIDs are recognised as special values.', ex: ['123e4567-e89b-12d3-a456-426614174000', 'Valid UUID (version 1)'], steps: ['Paste the UUID (curly braces are fine).', 'Press the validate button.', 'Read the result: Valid UUID with its version, or Invalid UUID.'], tasks: ['Validate a UUID', 'Validate a GUID', 'UUID version checker', 'Is this a valid UUID?'] },
  '/uuid-parser': { lede: 'Decode a UUID: version, variant and, for v1, v6 and v7, the embedded timestamp.', what: 'UUID Parser checks the UUID format, reports its version and variant, and converts the creation time stored in version 1, 6 and 7 UUIDs into a readable date.', ex: ['123e4567-e89b-12d3-a456-426614174000', 'Version: 1\nVariant: RFC 4122 / RFC 9562 (variant 1)\nKind: Time-based\nTimestamp: 2228-06-25T20:01:28.545Z'], steps: ['Paste the UUID.', 'Press the parse button.', 'Read the version, variant and any timestamp.'], tasks: ['Parse a UUID', 'Find UUID version', 'Inspect a GUID'] },
};

// ---- JWT ------------------------------------------------------------------
const jwt = {
  '/jwt-decoder': { lede: 'Paste a JWT, see its header and payload as readable JSON.', what: 'JWT Decoder splits a JSON Web Token into its three parts and shows the decoded header and payload. It does not verify the signature.', ex: ['header.payload.signature (a token starting with "ey...")', 'Header:\n{ "alg": "HS256", "typ": "JWT" }\n\nPayload:\n{ "sub": "1234567890", ... }'], steps: ['Paste the token (three parts separated by dots).', 'Press Decode Token.', 'Copy the header or payload.'], tasks: ['Decode a JWT online', 'Read JWT claims', 'Inspect a token payload'] },
  '/jwt-generator': { lede: 'Build a signed HS256 JWT from your own payload and secret.', what: 'JWT Generator signs the JSON payload you provide using HMAC-SHA256 (HS256) and a secret key, and returns a token you can use for testing.', ex: ['Payload: {"sub":"1234567890","name":"John Doe"}\nSecret: my-test-secret', 'A token in the form header.payload.signature'], steps: ['Edit the payload JSON.', 'Enter a secret (the default is "secret").', 'Press Generate Token and copy the result.'], tasks: ['Generate a JWT for testing', 'Create an HS256 token', 'Sign a JWT online'] },
};

// ---- XML / YAML / CSV -----------------------------------------------------
const dataFmt = {
  '/xml-formatter': { lede: 'Indent and tidy XML so you can read it.', what: 'XML Formatter re-prints XML with consistent indentation.', ex: ['<a><b>1</b></a>', '<a>\n    <b>1</b>\n</a>'], tasks: ['Format XML online', 'Pretty print XML', 'Beautify XML'] },
  '/xml-validator': { lede: 'Validate XML online, check whether an XML document is well-formed, and inspect parser errors when its syntax is broken.', what: 'XML Validator reads pasted XML or a selected text/XML file and parses it with your browser\'s built-in XML parser. It reports whether the document is well-formed and, when the browser provides a position, shows the line and column around the error. It checks XML syntax only, not whether the document conforms to a DTD or XSD schema.', ex: ['<catalog><book id=7>XML</catalog>', 'Parser error: attribute values must be quoted (message and position depend on your browser)'], tasks: ['Validate XML online', 'Check XML syntax and well-formedness', 'Validate an XML file', 'Find mismatched or unclosed XML tags', 'Inspect an XML parser error'] },
  '/yaml-formatter': { lede: 'Parse YAML and print it back in a clean, consistent style.', what: 'YAML Formatter loads your YAML and writes it out again in standard block style.', ex: ['name: Ada\ntags: [a, b]', 'name: Ada\ntags:\n  - a\n  - b'], tasks: ['Format YAML online', 'Clean up YAML', 'Normalize YAML'] },
  '/yaml-to-json': { lede: 'Paste YAML and get formatted JSON back instantly, or see the parse error if the YAML is invalid.', what: 'YAML to JSON loads one YAML document with js-yaml and prints the same data as JSON with 2-space indentation. Comments are dropped, because JSON has no comment syntax.', ex: ['name: Ada', '{\n  "name": "Ada"\n}'], tasks: ['Convert YAML to JSON', 'YAML to JSON online', 'Turn a YAML config into JSON'] },
  '/csv-to-json': { lede: 'Convert CSV rows into a JSON array of objects.', what: 'CSV to JSON uses the first line as headers and turns each following line into an object. Choose a comma or semicolon delimiter. Quoted values are supported, and every value comes out as a string.', ex: ['id,name\n1,Ada', '[\n  {\n    "id": "1",\n    "name": "Ada"\n  }\n]'], tasks: ['Convert CSV to JSON', 'CSV to JSON online', 'Turn spreadsheet rows into JSON'] },
  '/json-to-csv': { lede: 'Paste an array of JSON objects and get CSV with a header row, ready for Excel or Google Sheets.', what: 'JSON to CSV takes an array of objects, uses every key found across the objects as the header row and prints one line per object. Values that contain commas or quotes are wrapped in quotes.', ex: ['[{"id":1,"name":"Ada"}]', 'id,name\n1,Ada'], tasks: ['Convert JSON to CSV', 'JSON to CSV online', 'Export JSON as CSV'] },
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
  '/unix-timestamp': { lede: 'Use this free Unix timestamp converter to see the current epoch time and convert Unix timestamps into readable UTC, local and ISO dates. Enter a date or timestamp to get Unix time in seconds, milliseconds, microseconds and nanoseconds.', ex: ['1700000000', 'UTC: Tue, 14 Nov 2023 22:13:20 GMT\nISO 8601: 2023-11-14T22:13:20.000Z\nUnix (ms): 1700000000000\nUnix (s): 1700000000'], tasks: ['Unix timestamp converter', 'Epoch time converter', 'Current Unix timestamp', 'Current epoch time in seconds', 'Convert Unix timestamp to date', 'Convert date to Unix timestamp', 'Convert epoch milliseconds to date', 'Convert epoch seconds to date'] },
};

// ---- Colors ---------------------------------------------------------------
const color = {
  '/color-converter': { lede: 'Convert colors between HEX and RGB.', ex: ['#FF5733', 'rgb(255, 87, 51)'], tasks: ['HEX to RGB', 'RGB to HEX', 'Color code converter'] },
  '/hex-to-rgb': { lede: 'Convert a HEX color code to RGB.', ex: ['#FF5733', 'rgb(255, 87, 51)'], tasks: ['HEX to RGB converter', 'Hex color to rgb()', 'Convert #FFF to RGB'] },
  '/rgb-to-hex': { lede: 'Convert RGB to hex online: enter red, green and blue values and get the hex color code for CSS, with a live preview.', ex: ['rgb(255, 87, 51)', '#FF5733'], tasks: ['RGB to HEX converter', 'RGB to hex value', 'rgb() to hex color', 'Convert RGB to #hex'] },
};

// ---- Number bases ---------------------------------------------------------
const base = {
  '/number-base-converter': { lede: 'Convert numbers between bases 2 to 36 (binary, octal, decimal, hex and more).', ex: ['255 (from base 10 to base 16)', 'FF'], tasks: ['Number base converter', 'Convert between binary, decimal and hex', 'Base 10 to base 16'] },
  '/binary-to-decimal': { lede: 'Convert a binary number to decimal.', ex: ['1010 (from base 2 to base 10)', '10'], tasks: ['Binary to decimal', 'Convert binary online', 'What is 1010 in decimal?'] },
  '/decimal-to-binary': { lede: 'Convert a decimal number to binary.', ex: ['10 (from base 10 to base 2)', '1010'], tasks: ['Decimal to binary', 'Convert decimal to binary online', 'What is 10 in binary?'] },
  '/hex-to-decimal': { lede: 'Convert a hexadecimal number to decimal.', ex: ['FF (from base 16 to base 10)', '255'], tasks: ['Hex to decimal', 'Convert hex online', 'What is FF in decimal?'] },
  '/decimal-to-hex': { lede: 'Convert decimal numbers to hexadecimal online. Enter a base 10 whole number to get its base 16 result instantly, or use the examples and conversion chart below to learn how decimal-to-hex conversion works.', ex: ['255 (decimal / base 10)', 'FF (hexadecimal / base 16)'], tasks: ['Decimal to hexadecimal converter', 'Decimal to hex calculator', 'Convert decimal to hexadecimal (base 10 to base 16)', 'Denary to hexadecimal conversion', 'What is 255 in hex?', 'Use a decimal to hexadecimal conversion chart'] },
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
          q('Does formatting preserve my JSON exactly?', 'Formatting changes whitespace, but this tool uses JavaScript JSON.parse and JSON.stringify. Very large integers can lose precision, duplicate object keys keep only the last value, and integer-like keys can be reordered. Keep the original input when exact preservation matters.'),
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
      const cs = p === '/json-to-csharp';
      return {
        lede: cs ? 'Free JSON to C# converter: paste JSON and get C# classes with nested types, List<T>, and System.Text.Json or Newtonsoft attributes. Runs in your browser.' : `Paste JSON, get a ${L.label} model for it.`,
        meta: `${n}: generate a ${L.label} class or type from a JSON sample. Free and runs in your browser.`,
        what: cs ? `This page generates C# model classes from a sample JSON object. It writes a root class with one public property per JSON key (each with a { get; set; } accessor pair), a separate class for each nested object and List<T> for arrays. ${L.note}` : `${n} reads a JSON object and writes a ${L.label} type with one field per key, a separate type for each nested object and a list type for arrays. ${L.note}`,
        problem: `Typing out model classes by hand for every API response is repetitive. Generating the first draft from a real JSON sample saves the boring part.`,
        steps: ['Paste a JSON object into the input box.', 'Press the convert button.', `Copy the generated ${L.label} code and adjust names or types to fit your project.`],
        example: cs ? { inLabel: 'JSON input', input: CSHARP_SAMPLE, outLabel: 'C# output', output: CSHARP_OUTPUT } : { inLabel: 'Input', input: SAMPLE_USER, outLabel: `${L.label} output`, output: L.output },
        useCases: ['Creating models for a new API integration', 'Mocking a type from a sample response', 'Starting a DTO without typing every property'],
        tasks: cs ? ['Convert JSON to csharp', 'C# model generator from JSON', 'Create C# DTOs from JSON', 'Generate a POCO class from an API response'] : [`JSON to ${L.label}`, `Generate ${L.label} class from JSON`, `${L.label} model from JSON`],
        faqs: cs ? [LOCAL] : [
          q('Does it handle nested objects and arrays?', 'Yes. Each nested object becomes its own type named after its key, and an array becomes a list of the matching type. Only the first array item is used to work out the item type.'),
          q('How are field types chosen?', 'From the sample values: numbers, booleans and strings get matching types, and null falls back to a generic type. One sample cannot show whether a field is optional or whether a number is a whole number.'),
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
        problem: v.problem || 'Encoded values show up in URLs, headers, tokens and logs. Decoding or encoding them by hand is slow, and one wrong character breaks the whole string.',
        steps: ['Type or paste your input on the left.', 'The result appears on the right as you type.', 'Press Copy to grab the output.'],
        example: { inLabel: 'Input', input: v.ex[0], outLabel: 'Output', output: v.ex[1] },
        useCases: ['Debugging query strings and redirect URLs', 'Reading values from HTTP headers or config files', 'Preparing text to embed in a URL or HTML page'],
        tasks: v.tasks,
        faqs: p === '/html-decoder'
          ? [
              q('What is an HTML decoder?', 'An HTML decoder converts character references such as &amp;, &lt; and &#169; back into the characters they represent.'),
              q('Does this decoder support named, decimal and hexadecimal entities?', 'Yes. The browser HTML parser handles named references such as &amp;, decimal references such as &#38;, and hexadecimal references such as &#x26;.'),
              q('Does decoding make HTML safe to render?', 'No. Decoding only converts character references. It does not sanitize markup or make untrusted HTML safe to insert into a page.'),
              LOCAL,
            ]
          : [
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
          p === '/uuid-generator'
            ? q('Which UUID versions can I generate?', 'Version 4 (random) and version 7 (time-ordered), in standard, UPPERCASE, no-hyphen or {braces} format.')
            : q('Which versions does the validator accept?', 'It accepts the standard layout with a version digit from 1 to 8 and an RFC 4122 / RFC 9562 variant.'),
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
              p === '/csv-to-json' ? q('Does it handle quoted fields or commas inside values?', 'Yes. A quoted value can contain the delimiter, and a doubled quote inside it becomes one quote. A quoted value that spans several lines is not supported.') : q('Does it quote values that contain commas?', 'Yes. A value with a comma, quote or line break is wrapped in quotes, with inner quotes doubled, so the columns stay aligned.'),
              p === '/csv-to-json' ? q('Why are numbers strings in the JSON?', 'CSV has no types, and this tool keeps every value as text.') : q('Can it flatten nested JSON?', 'No. Nested objects are written as [object Object] and arrays are joined with commas, so flatten the data first.'),
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
      lede: 'Paste two versions of a text or JSON and see what was added or removed, by line, word or character.',
      meta: `${n}: compare two texts and see added and removed lines. Free, runs in your browser.`,
      what: `${n} compares two texts and marks what was added (+) and removed (-). Compare by line, word or character, and optionally ignore whitespace.`,
      problem: 'When two configs, responses or snippets look the same but behave differently, reading them side by side by eye misses things.',
      steps: ['Paste the original text on one side and the changed text on the other.', 'Choose Lines, Words or Characters, and tick Ignore whitespace if formatting should not count.', 'Press Compare, read the result and copy it if you need to share it.'],
      example: { inLabel: 'Original vs changed', input: 'host=localhost\nport=80\n\nhost=localhost\nport=8080', outLabel: 'Result', output: '  host=localhost\n- port=80\n+ port=8080' },
      useCases: ['Spotting what changed between two config files', 'Comparing an expected and an actual API response', 'Checking edits before pasting them back'],
      tasks: ['Diff checker online', 'Compare two texts', 'Compare two JSON files', 'Find differences between two files'],
      faqs: [
        q('Can it compare by word or character?', 'Yes. Choose Lines, Words or Characters in the Diff mode menu.'),
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
      lede: 'Use this free website down checker to see whether a domain or URL responds from your browser and network. Check up to 10 addresses at once, then compare another connection if you need to investigate a wider outage.',
      meta: `${n}: check whether a website is up, down or reachable from your browser. See HTTP status when available, redirects and response time.`,
      what: `${n} checks whether a website or URL is reachable from your current browser and network. It sends a lightweight request to each address and reports the result, HTTP status when the site allows the browser to read it, redirect information and response time. It is a one-time browser-based check, not a global uptime monitor.`,
      problem: 'When a page will not load, the first question is whether the website is responding or whether the problem is specific to your device, browser, DNS, VPN or network. A quick check gives you a useful starting point before you troubleshoot.',
      steps: ['Enter a domain or full URL, with one address per line (up to 10).', 'Select Check status, or press Ctrl/Cmd + Enter.', 'Read the result, including any HTTP status, redirect and response time. If the result is unclear, repeat the check from another network or device.'],
      example: { inLabel: 'Input', input: 'example.com\nhttps://example.com/some/path', outLabel: 'Output', output: 'A result for each address: Up, Reachable, Server error, Timed out or Unreachable, with HTTP status when readable, redirect target and response time when available.' },
      useCases: ['Checking whether a website responds after a deployment or DNS change', 'Investigating whether a URL, page path or server is returning an HTTP error', 'Comparing several domains or URLs during troubleshooting', 'Checking whether a problem may be limited to your browser or network'],
      tasks: ['Website down checker', 'Check if a website is down', 'Find out whether a site is up or down', 'Check website status online', 'Test whether a URL is reachable', 'Check a server URL response', 'Compare up to 10 website addresses'],
      faqs: [
        q('Is this a worldwide website outage check?', 'No. The request comes from your own browser and network. It cannot confirm whether a website is down for every visitor or in other countries. For a second viewpoint, test from another network or use a monitoring service that checks from multiple regions.'),
        q('Why is there no HTTP status code for some websites?', 'Many websites do not allow cross-origin browser requests to expose their response details. In that case, the browser may confirm that the server responded but cannot reveal the exact HTTP status code.'),
        q('How many websites or URLs can I check at once?', 'You can enter up to 10 domains or full URLs, one per line. The checker returns a separate result for each address.'),
        q('Can I use this as a continuous uptime monitor?', 'No. This tool performs a one-time check when you press Check status. It does not run scheduled checks, keep uptime history or send outage alerts.'),
      ],
    }),
  },
];

// ---- In-depth content for the highest-value pages --------------------------
// Optional extras merged into getToolContent(): { sections, faqs }.
// Every statement describes how the tool (or the underlying standard) really behaves.
const EXTRA = {
  '/json-formatter': {
    sections: [
      {
        h: 'Common JSON errors and how to fix them',
        paras: ['If the formatter shows an error, the input is not strict JSON. These are the usual causes:'],
        list: [
          'A trailing comma after the last item in an object or array. Remove it.',
          'Single quotes around keys or strings. JSON requires double quotes.',
          'Unquoted keys such as {name: "Ada"}. Every key must be a double-quoted string.',
          'Comments (// or /* */). JSON has no comment syntax, so strip them first.',
          'Values such as undefined, NaN or Infinity. None of these exist in JSON; use null or a string.',
          'Raw line breaks or unescaped quotes inside a string. Write them as \\n and \\".',
        ],
      },
      {
        h: 'What formatting changes, and what it does not',
        paras: [
          'Formatting normally changes whitespace, but the parser and serializer can also normalize some values. Very large integers can lose precision, duplicate object keys keep only the last value, and integer-like keys can be reordered.',
          'Because it uses JavaScript\'s parser, three behaviors are worth knowing. Integers larger than 9,007,199,254,740,991 lose precision. If an object repeats a key, the last value wins and the earlier one is dropped. Keys that look like whole numbers, such as "1" or "2", are moved to the front in ascending order.',
        ],
      },
      {
        h: 'Where a JSON formatter helps most',
        list: [
          'Reading API responses and webhook payloads copied from logs or a network panel',
          'Reviewing config files such as package.json or appsettings.json',
          'Making request bodies readable in bug reports and documentation',
          'Spotting a missing bracket before it reaches production',
        ],
        links: [['JSON Validator', '/json-validator'], ['JSON Beautifier', '/json-beautifier'], ['JSON Minifier', '/json-minifier'], ['JSON to C#', '/json-to-csharp']],
        linksLabel: 'Next steps',
      },
    ],
    faqs: [
      q('What is the difference between a JSON formatter and a JSON validator?', 'A formatter re-prints valid JSON with indentation. A validator only tells you whether the JSON is valid. This formatter also shows the parser error when the JSON is invalid, so it checks syntax as a side effect.'),
      q('Can I choose tabs or 4-space indentation?', 'Yes. The formatter supports 2 spaces, 4 spaces or tabs. JSON validity is unchanged; only the output whitespace differs.'),
      q('Can it format very large JSON files?', 'It runs in your browser\'s memory, so inputs of many megabytes can be slow or freeze the tab. For very large files, a command-line tool such as jq is a better fit.'),
    ],
  },

  '/json-validator': {
    sections: [
      {
        "h": "Validate JSON in your own code",
        "paras": [
          "Use the same strict rules in your application. Parsing is validation: if the parser throws, the JSON is invalid."
        ],
        "code": "// JavaScript\ntry { JSON.parse(text); } catch (e) { console.error(e.message); }\n\n// Python\nimport json\njson.loads(text)  # raises json.JSONDecodeError with line and column\n\n// C#\nusing var doc = System.Text.Json.JsonDocument.Parse(text);",
        "links": [
          [
            "JSON Formatter",
            "/json-formatter"
          ],
          [
            "XML Validator",
            "/xml-validator"
          ],
          [
            "JSON to C#",
            "/json-to-csharp"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'Using this page as an online JSON parser',
        paras: [
          'The validator runs your text through the JSON parser built into your browser. If it parses, you see the root type, the number of top-level keys or items, the nesting depth and the size. If it does not, you see the parser message and, when the browser gives a position, the line and column.',
          'That makes it a quick way to check how a parser will treat a string before you use it in code. Parsing turns the text into objects, arrays, strings, numbers, booleans and null. It does not check the values against a schema.',
        ],
        links: [['Guide: fix JSON parse errors', '/guides/fix-json-parse-errors'], ['JSON Formatter', '/json-formatter']],
        linksLabel: 'Read more',
      },
      {
        h: 'What counts as valid JSON',
        paras: [
          'JSON (defined in RFC 8259) has seven kinds of value: object, array, string, number, true, false and null. Strings and keys use double quotes, items are separated by commas with no trailing comma, and comments are not allowed.',
          'A bare value is valid too. The text "hello", 42 and null are each valid JSON documents on their own.',
        ],
      },
      {
        h: 'What this validator checks, and what it does not',
        list: [
          'It checks syntax only, using the browser\'s own JSON parser.',
          'It does not check your data against a JSON Schema, so it cannot tell you that a field is missing or has the wrong type.',
          'It reports the first error the parser hits. Fix it and press Process again to find the next one.',
          'The wording of the error message depends on your browser, because each engine words its parse errors differently.',
        ],
      },
      {
        h: 'A quick validation workflow',
        paras: ['Paste the JSON, press Process, and fix whatever the error points at. Once it reads Valid JSON, format it so the structure is easy to read, or minify it if you need a compact string.'],
        links: [['JSON Formatter', '/json-formatter'], ['JSON Minifier', '/json-minifier'], ['JSON to C#', '/json-to-csharp']],
        linksLabel: 'Next steps',
      },
    ],
    faqs: [
      q('Does it validate against a JSON Schema?', 'No. It checks that the text is syntactically valid JSON. Schema validation needs a schema and a schema-aware validator.'),
      q('Why does it only show one error?', 'JSON.parse stops at the first problem it finds. Fix that one and validate again to reveal the next.'),
      q('Is a plain string or number valid JSON?', 'Yes. Under the current standard any JSON value can appear at the top level, so "hello" and 42 are both valid.'),
    ],
  },

  '/json-beautifier': {
    sections: [
      {
        "h": "Beautify JSON in code and in the terminal",
        "paras": [
          "When a log line or API response is one long line, these commands expand it with 2-space indentation."
        ],
        "code": "// JavaScript\nJSON.stringify(JSON.parse(text), null, 2)\n\n# Python (terminal)\npython -m json.tool response.json\n\n# jq (terminal)\njq . response.json",
        "links": [
          [
            "JSON Formatter",
            "/json-formatter"
          ],
          [
            "JSON Minifier",
            "/json-minifier"
          ],
          [
            "Diff Checker",
            "/diff-checker"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'When to beautify JSON',
        list: [
          'Reading a minified response copied from browser dev tools or a log line',
          'Making JSON diff-friendly so a code review shows one change per line',
          'Putting readable JSON into documentation, tickets and bug reports',
          'Checking nesting depth and spotting a misplaced bracket by eye',
        ],
      },
      {
        h: 'Beautified versus minified JSON',
        paras: [
          'For ordinary JSON, beautified and minified output represent the same values. Beautified JSON adds line breaks and indentation for people; minified JSON removes unnecessary whitespace for compact storage or transport. JavaScript parsing can still normalize large numbers, duplicate keys and integer-like key order.',
          'You can switch between the two for ordinary JSON, but this browser-based parser has the same JavaScript number, duplicate-key and integer-like-key behaviors described above.',
        ],
        links: [['JSON Minifier', '/json-minifier']],
        linksLabel: 'Go the other way',
      },
      {
        h: 'Beautifier, formatter and pretty printer',
        paras: [
          'These names describe the same operation. On this site the JSON Beautifier and the JSON Formatter use the same engine and the same 2-space indentation. Use whichever name you searched for. If you also want a clear valid or invalid verdict, use the JSON Validator.',
        ],
        links: [['JSON Formatter', '/json-formatter'], ['JSON Validator', '/json-validator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [
      q('Can I choose tabs or 4-space indentation?', 'Yes. The shared JSON tool supports 2 spaces, 4 spaces or tabs for formatted output.'),
      q('Does beautifying change the order of keys?', 'Usually the existing order is retained, but JavaScript reorders integer-like object keys such as "1" and "2". Duplicate keys also collapse to the last value.'),
      q('Is this different from the JSON Formatter?', 'No. Both produce the same output. They exist as separate pages because people search for both names.'),
    ],
  },

  '/json-minifier': {
    sections: [
      {
        "h": "Minify JSON in code and see the size saved",
        "paras": [
          "Minifying removes whitespace outside strings and keeps the data the same. After you minify here, the page shows the character count before and after."
        ],
        "code": "// JavaScript\nJSON.stringify(JSON.parse(text))\n\n# jq (terminal)\njq -c . input.json\n\n# Python\nimport json\njson.dumps(json.loads(text), separators=(',', ':'))",
        "links": [
          [
            "JSON Formatter",
            "/json-formatter"
          ],
          [
            "Base64 Encoder",
            "/base64-encoder"
          ],
          [
            "URL Encoder",
            "/url-encoder"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'What minifying removes',
        paras: [
          'The minifier removes spaces, tabs and line breaks that sit between JSON tokens. Whitespace inside a string value is part of the data, so it is kept.',
        ],
      },
      {
        h: 'Minified JSON and file size',
        paras: [
          'How much you save depends on how much whitespace the original had. Deeply indented JSON shrinks a lot; JSON that was already compact barely changes.',
          'Over HTTP, gzip or Brotli compression already squeezes repeated whitespace, so the extra gain from minifying is smaller there. Minified JSON is most useful where compression is not in play: environment variables, query parameters, local storage values and one-line config entries.',
        ],
      },
      {
        h: 'Things to know',
        list: [
          'Number formatting can be normalized: 1.0 becomes 1 and 1e3 becomes 1000.',
          'Integers beyond 9,007,199,254,740,991 lose precision, because the browser parses numbers as 64-bit floats.',
          'If a key appears twice in an object, the last value wins.',
        ],
        links: [['JSON Formatter', '/json-formatter'], ['JSON Validator', '/json-validator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [
      q('Does minifying change my data?', 'For ordinary JSON, only insignificant whitespace is removed. Because the tool parses and re-serializes JSON, very large integers can lose precision, duplicate keys keep only the last value, and integer-like keys can be reordered.'),
      q('Can I reverse it?', 'Yes. Paste the minified JSON into the JSON Formatter to get indented output again. Keep the original if exact numeric precision, duplicate keys or key ordering matters.'),
    ],
  },

  '/json-to-csharp': {
    sections: [
      {
        h: 'How the C# output is generated',
        list: [
          'The root class uses the name you set (default Root) and one property per top-level key.',
          'Numbers become double, true/false becomes bool and text becomes string.',
          'Nested objects become their own classes, arrays become List<T>, and null values become object so you can refine those by hand.',
          'Property names are PascalCase: "user_id" becomes UserId.',
        ],
      },
      {
        h: 'How JSON keys map to C# properties',
        paras: [
          'Each JSON key becomes one public C# property. Characters that are not letters or digits are dropped and the next letter is capitalized, so first_name and user-id become FirstName and UserId.',
        ],
      },
      {
        h: 'System.Text.Json and Newtonsoft.Json attributes',
        paras: [
          'Choose System.Text.Json for [JsonPropertyName] on modern .NET, or Newtonsoft.Json for [JsonProperty] on older projects. Leave attributes off when property names already match your JSON keys.',
        ],
        code: '// Deserialize\nJsonSerializer.Deserialize<Root>(json);           // System.Text.Json\nJsonConvert.DeserializeObject<Root>(json);       // Newtonsoft.Json',
        links: [
          ['JSON Validator', '/json-validator'],
          ['JSON Formatter', '/json-formatter'],
          ['JSON to TypeScript', '/json-to-typescript'],
        ],
        linksLabel: 'Related',
      },
    ],
  },

  '/jwt-decoder': {
    sections: [
      {
        h: 'Anatomy of a JWT',
        paras: [
          'A JSON Web Token has three parts separated by dots: header.payload.signature. The header and payload are JSON that has been Base64URL-encoded.',
          'The header usually names the signing algorithm (alg) and the token type (typ). The payload holds claims. Common registered claims include iss (issuer), sub (subject), aud (audience), exp (expiry), nbf (not before), iat (issued at) and jti (token ID).',
        ],
      },
      {
        h: 'Decoding is not verifying',
        paras: [
          'Anyone can read the header and payload of a signed JWT, because they are only encoded, not encrypted. Decoding does not prove the token is genuine. Only checking the signature with the right key does that, and it belongs on your server.',
          'For the same reason, never put secrets in a JWT payload, and never trust decoded claims without verifying the signature first.',
        ],
      },
      {
        h: 'Reading exp, nbf and iat',
        paras: [
          'These claims are Unix timestamps in seconds. A value like 1516239022 is hard to read on sight; paste it into a timestamp converter to see the date.',
        ],
        links: [['Timestamp Converter', '/timestamp-converter'], ['Unix Timestamp', '/unix-timestamp'], ['JWT Generator', '/jwt-generator'], ['Base64 Decoder', '/base64-decoder']],
        linksLabel: 'Related',
      },
      {
        h: 'A note on real tokens',
        paras: [
          'This decoder runs in your browser and the token is not uploaded for processing. Even so, a live token is a credential. Prefer expired or test tokens when you paste into any online tool.',
        ],
      },
    ],
    faqs: [
      q('Can this tool verify the signature?', 'No. It decodes the header and payload only. Signature verification needs the signing key or public key.'),
      q('Is a JWT encrypted?', 'A typical signed JWT is not encrypted. Its contents are readable by anyone who has the token. Encrypted tokens (JWE) are a different format.'),
      q('What does the exp claim mean?', 'It is the expiry time as a Unix timestamp in seconds. After that moment a server should reject the token.'),
      q('Is it safe to decode a JWT online?', 'Decoding here happens in your browser. Still, treat real tokens as credentials and use test or expired tokens when you can.'),
    ],
  },

  '/base64-decoder': {
    sections: [
      {
        h: 'How to decode a Base64 string',
        list: [
          'Paste the Base64 string into the input box.',
          'The plain text appears in the output as you type.',
          'Press Copy to take the result.',
        ],
        code: 'SGVsbG8sIFdvcmxkIQ==   ->   Hello, World!\ndXNlcjpwYXNzd29yZA==   ->   user:password\naMOpbGxv               ->   héllo',
      },
      {
        h: 'What Base64 is',
        paras: [
          'Base64 represents binary data using 64 printable characters: A-Z, a-z, 0-9, + and /, with = used for padding. It turns bytes into text that can travel safely through systems built for text, at the cost of making the data about one third larger.',
        ],
      },
      {
        h: 'Standard and URL-safe Base64',
        paras: [
          'This decoder expects the standard alphabet. URL-safe Base64, used in JWTs and some URLs, swaps + for - and / for _. To decode a URL-safe string here, replace - with + and _ with / first.',
        ],
      },
      {
        h: 'Where you will meet Base64 data',
        list: [
          'The user:password pair in an HTTP Basic Authorization header.',
          'Values in Kubernetes Secret manifests and other config files.',
          'The header and payload of a JWT, which use the URL-safe variant.',
          'Small files or text embedded in JSON, XML or email (MIME).',
        ],
        paras: ['If the decoded result is readable text, you are done. If it looks like gibberish, the Base64 data holds a file or other binary content rather than text.'],
      },
      {
        h: 'Spaces, padding and prefixes',
        paras: [
          'Spaces and line breaks inside the string are ignored, and a missing = at the end is usually accepted. A data: prefix such as data:text/plain;base64, is not part of the Base64 itself, so delete it and paste only what follows the comma.',
        ],
      },
      {
        h: 'Why the output may be empty or unreadable',
        list: [
          'The input is not valid Base64, for example because it is cut off or contains characters outside the alphabet.',
          'The string uses the URL-safe alphabet (see above).',
          'The decoded bytes are not UTF-8 text, such as an image or a compressed file. This tool decodes text only.',
        ],
        links: [['Base64 Encoder', '/base64-encoder'], ['URL Decoder', '/url-decoder'], ['JWT Decoder', '/jwt-decoder']],
        linksLabel: 'Related',
      },
      {
        h: 'Base64 is not encryption',
        paras: ['Decoding Base64 needs no key, which means anything stored as Base64 is readable by anyone. Do not use it to hide passwords or tokens.'],
      },
    ],
    faqs: [
      q('Can I decode an image or file here?', 'No. This tool decodes Base64 into text. Binary data such as images will not display correctly.'),
      q('Why does the decoded text look like gibberish?', 'The underlying bytes are probably not UTF-8 text. Base64 can hold any kind of data, not only text.'),
      q('Does it decode URL-safe Base64?', 'Not directly. Replace - with + and _ with / in the input first, then decode.'),
      q('Does it need the = padding at the end?', 'Usually not. A string such as SGVsbG8 decodes to Hello even without the padding. Spaces and line breaks inside the string are also ignored.'),
      q('Why does a string starting with data: fail to decode?', 'The data:...;base64, part is a URI prefix, not Base64. Remove everything up to and including the comma and paste only the encoded data.'),
    ],
  },

  '/base64-encoder': {
    sections: [
      {
        h: 'What Base64 encoding is used for',
        list: [
          'Embedding small binary or text values inside JSON, XML or HTML',
          'Building data: URIs for inline images and fonts',
          'The user:password string in HTTP Basic authentication headers',
          'Email attachments (MIME) and the segments of a JWT (in a URL-safe variant)',
        ],
      },
      {
        h: 'UTF-8 and special characters',
        paras: [
          'The tool converts your text to UTF-8 bytes before encoding, so accented letters and emoji encode correctly. For example, the text héllo encodes to aMOpbGxv.',
        ],
      },
      {
        h: 'Size, alphabet and padding',
        paras: [
          'Encoded output is about one third longer than the input. The tool produces standard Base64 with = padding. For the URL-safe variant, replace + with - and / with _, and remove the trailing = signs.',
        ],
        links: [['Base64 Decoder', '/base64-decoder'], ['URL Encoder', '/url-encoder'], ['JWT Decoder', '/jwt-decoder'], ['Hash Generator', '/hash-generator']],
        linksLabel: 'Related',
      },
      {
        h: 'Base64 is not encryption',
        paras: ['Base64 is a reversible encoding. Anyone can decode it without a key, so it should never be used to protect secrets.'],
      },
    ],
    faqs: [
      q('Does it output URL-safe Base64?', 'No. It outputs standard Base64. Replace + with - and / with _ and strip the = padding if you need the URL-safe form.'),
      q('Can it encode files or images?', 'No. It encodes text typed or pasted into the input box.'),
      q('Why is the output longer than the input?', 'Base64 maps every 3 bytes to 4 characters, so the result is roughly 33% larger.'),
    ],
  },

  '/uuid-generator': {
    sections: [
      {
        h: 'Generate a random UUID online',
        paras: [
          'Use this online UUID generator when you need a new identifier for an application, database record, API request or test fixture. A random UUID v4 is generated as soon as the page opens, so you can copy it immediately or generate another one. For bulk work, select 5, 10, 25, 50, 100, 250 or 500 UUIDs and copy or download the list.',
          'The generator also supports time-ordered UUID v7. Choose the version that fits your use case, then select standard, uppercase, no-hyphen or braces formatting.',
        ],
      },
      {
        h: 'What is a UUID? Format and example UUID',
        paras: [
          'A UUID (universally unique identifier) is a 128-bit identifier written as 32 hexadecimal digits in five groups, in the 8-4-4-4-12 pattern. For example: 3b241101-e2bb-4255-8caf-4136c566a962. In .NET and some databases, the same kind of identifier is commonly called a GUID.',
          'The version digit appears at the start of the third group. The first digit of the fourth group identifies the variant; for the standard RFC variant it is 8, 9, a or b.',
        ],
      },
      {
        h: 'UUID v4 generator: how random UUIDs work',
        paras: [
          'A UUID v4 generator creates identifiers using random bits. This tool uses your browser\'s crypto.randomUUID() method, which relies on a cryptographically secure random source. Version 4 is a common choice for database IDs, request IDs, test data and other identifiers that do not need to sort by creation time.',
          'UUID v7 is different: it starts with a millisecond timestamp and uses random bits for the remaining fields. That time-ordered layout can make UUID v7 a better fit for database indexes that benefit from values sorting roughly by creation time.',
        ],
      },
      {
        h: 'Generate a UUID in Java and Node.js',
        paras: [
          'A UUID generator is also available in common developer runtimes. Java provides UUID.randomUUID() in java.util.UUID. Node.js provides crypto.randomUUID() in its built-in crypto module. These examples generate version 4 UUIDs; this page is useful when you need a UUID quickly without writing code.',
        ],
        code: `// Java
import java.util.UUID;
UUID id = UUID.randomUUID();

// Node.js
import { randomUUID } from 'node:crypto';
const id = randomUUID();

// C#
Guid id = Guid.NewGuid();`,
      },
      {
        h: 'When to use UUIDs, and when to think twice',
        list: [
          'Good for: primary keys created on the client, request and correlation IDs, test fixtures and unique file names.',
          'Random UUIDs can be less suitable as clustered index keys in some databases because new rows land at random positions. Time-ordered UUIDs such as version 7 are designed for that case.',
          'A UUID is an identifier, not a secret. Do not use one as a password or an authorization token.',
        ],
        links: [['UUID Validator', '/uuid-validator'], ['UUID Parser', '/uuid-parser'], ['Hash Generator', '/hash-generator'], ['Timestamp Converter', '/timestamp-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [
      q('Is a UUID the same as a GUID?', 'They share the same 128-bit format. GUID is the name used in Microsoft environments such as .NET and SQL Server.'),
      q('Can two generated UUIDs be the same?', 'It is theoretically possible but so unlikely with 122 random bits that applications treat version 4 UUIDs as unique.'),
      q('Does it generate version 1 or version 7 UUIDs?', 'It generates version 4 (random) and version 7 (time-ordered) UUIDs. Version 1 is not offered. To read the timestamp inside a v1 or v7 UUID, use the UUID Parser.'),
    ],
  },
};

export function getToolGroup(path) {
  const g = GROUPS.find((x) => x.test(path));
  return g ? g.id : null;
}

export function getToolContent(path, name) {
  const g = GROUPS.find((x) => x.test(path));
  if (!g) return null;
  const base = { group: g.id, ...g.build(name, path) };
  const x = EXTRA[path] || EXTRA_MORE[path];
  const merged = x
    ? {
        ...base,
        ...(x.sections ? { sections: x.sections } : {}),
        faqs: [...base.faqs, ...(Array.isArray(x.faqs) ? x.faqs : [])],
      }
    : base;
  // Competitor-gap additions (data/toolGapContent.js): extra long-tail tasks and question-intent FAQs.
  const gap = TOOL_GAP[path];
  if (!gap) return merged;
  const seenQ = new Set(merged.faqs.map((f) => f.q.toLowerCase()));
  const seenT = new Set(merged.tasks.map((t) => t.toLowerCase()));
  return {
    ...merged,
    tasks: [...merged.tasks, ...gap.tasks.filter((t) => !seenT.has(t.toLowerCase()))],
    faqs: [...merged.faqs, ...gap.faqs.filter((f) => !seenQ.has(f.q.toLowerCase()))],
  };
}
