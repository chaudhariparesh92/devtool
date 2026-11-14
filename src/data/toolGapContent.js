// Competitor-gap content for every tool page. Pure data, merged by getToolContent() in toolContent.js.
//
// What this adds, per tool:
//   tasks - extra long-tail "what you can do" phrases (rendered in the existing task list + chips)
//   faqs  - extra question-intent FAQs (rendered in the existing FAQ block and FAQPage JSON-LD)
//
// Rules: every claim was checked against the component in src/pages/tools/. No keyword lists are
// rendered, no meta keywords, no invented features. Phrases come from questions and task wording that
// competing tool pages answer (see seo-reports/competitor-analysis.csv).

const f = (q, a) => ({ q, a });

export const TOOL_GAP = {
  // ------------------------------------------------------------------ JSON tools
  '/json-formatter': {
    tasks: ['Format JSON with 2 spaces, 4 spaces or tabs', 'Sort JSON keys alphabetically', 'Format JSON from a file or an HTTPS URL', 'Find the line and column of a JSON error'],
    faqs: [
      f('How do I sort JSON keys alphabetically?', 'Tick Sort keys before you format. Keys in every nested object are sorted A to Z. The order of items inside arrays is not changed.'),
      f('Can I format JSON from a URL or a file?', 'Yes. Drop a .json file onto the page, or enter an HTTPS address in the optional URL field and load it. A URL only loads if the server allows requests from other sites (CORS). If it does not, open the URL yourself and paste the response.'),
    ],
  },
  '/json-validator': {
    tasks: ['Check if JSON is valid before an API request', 'Find a trailing comma in JSON', 'Spot single quotes and unquoted keys in JSON', 'Debug a JSON parse error from a config file'],
    faqs: [
      f('How do I fix "Unexpected token" in JSON?', 'The parser stopped at a character JSON does not allow there. The usual causes are a trailing comma, single quotes instead of double quotes, an unquoted key, a comment, or text before the first brace. Fix the character the message points to and validate again.'),
      f('Does the validator show the line and column of the error?', 'It shows the message your browser\'s JSON parser returns. When that message includes a position, the tool turns it into a line and column. The wording and level of detail differ between browsers.'),
    ],
  },
  '/json-beautifier': {
    tasks: ['Beautify JSON copied from the browser network tab', 'Make minified API response JSON readable', 'Pretty print JSON with tab indentation', 'Prepare JSON for a code review or bug report'],
    faqs: [
      f('How do I beautify JSON copied from browser dev tools?', 'Copy the response body from the Network tab, paste it into the input box and press the format button. The tool re-prints it with one item per line and the indentation you pick.'),
      f('What is the difference between beautifying and validating JSON?', 'Beautifying changes only the whitespace so the structure is easier to read. Validating only tells you whether the text parses. This page does both in one step: valid JSON is re-printed, invalid JSON returns the parser error.'),
    ],
  },
  '/json-minifier': {
    tasks: ['Minify JSON to a single line', 'Remove whitespace from JSON for a request body', 'Shrink JSON before putting it in an environment variable', 'Compress JSON for a quick payload test'],
    faqs: [
      f('How much smaller does minified JSON get?', 'It depends on how much whitespace the original had. Deeply indented, pretty-printed JSON shrinks the most. JSON that is already compact barely changes.'),
      f('Is minifying the same as compressing with gzip?', 'No. Minifying only removes spaces and line breaks and the result is still plain JSON. Gzip is a separate compression step applied by a server or build tool, and it works on top of minified or pretty-printed JSON.'),
    ],
  },
  '/json-to-csharp': {
    tasks: [
      'JSON to C# converter',
      'Convert JSON to a C# class online',
      'Generate C# classes from JSON',
      'Generate a C# model from an API response',
      'Create C# classes for nested JSON objects',
      'Add System.Text.Json or Newtonsoft attributes',
      'JSON to C# class online',
      'JSON C# model generator',
    ],
    faqs: [
      f('How do I convert JSON to C# online?', 'Paste a JSON object into the input, set the root class name if you want, choose System.Text.Json or Newtonsoft.Json attributes, then press Generate. Copy the C# classes or download the file. Everything runs in your browser.'),
      f('Can I generate C# model classes from a JSON sample?', 'Yes. The tool creates a root class plus nested classes for objects and List<T> for arrays. Property names are PascalCase. You can mark properties nullable and pick serialization attributes.'),
      f('Should I use Newtonsoft.Json or System.Text.Json?', 'For new .NET 5+ projects prefer System.Text.Json ([JsonPropertyName]) — it is built in and fast. Use Newtonsoft.Json ([JsonProperty]) for older projects or when you need advanced Newtonsoft features.'),
      f('How do I convert JSON to C# in Visual Studio?', 'Visual Studio has Edit > Paste Special > Paste JSON as Classes. This page does the same job in the browser when you are not in the IDE, with attribute and nullable options.'),
      f('How do I deserialize the generated classes?', 'With Newtonsoft: JsonConvert.DeserializeObject<Root>(json). With System.Text.Json: JsonSerializer.Deserialize<Root>(json). Add the matching using directive from the generated attributes option.'),
      f('How do I convert a JSON array to a C# class?', 'Paste a single object from the array as the root. The tool expects a JSON object at the root. Arrays inside that object become List<T> properties with their own generated class.'),
    ],
  },

  '/json-to-typescript': {
    tasks: ['Convert JSON to a TypeScript interface', 'Type an API response in TypeScript', 'Generate TypeScript interfaces for nested objects', 'Make TypeScript properties optional'],
    faqs: [
      f('How do I type a JSON API response in TypeScript?', 'Paste a sample response object, generate the interfaces and copy them into your project. Then review them against the API documentation: one sample cannot show which fields are optional or which values can be null.'),
      f('How do I make the TypeScript properties optional?', 'Tick Optional / nullable properties. Each property then gets a ? so it may be missing. Null values are typed as unknown, so narrow them by hand where you know the real type.'),
    ],
  },
  '/json-to-java': {
    tasks: ['Convert JSON to a Java class online', 'Generate Java classes for Jackson or Gson from JSON', 'Create nested Java classes from a JSON object', 'Map a JSON array to List in Java'],
    faqs: [
      f('How do I convert JSON to a Java class for Jackson or Gson?', 'Paste a sample object and generate the class. JSON arrays become List<T> and the output starts with the java.util.List import. Treat the result as a first draft and add whatever your mapper needs, such as annotations, before using it.'),
      f('How are JSON arrays and nested objects written in Java?', 'A nested object becomes its own class named after its key. An array of objects becomes List<ThatClass>. An array of plain values becomes a List of the matching type, for example List<String>.'),
    ],
  },
  '/json-to-python': {
    tasks: ['Convert JSON to a Python dataclass', 'Generate Python classes from a JSON object', 'Create typed Python models from an API response', 'Mark Python dataclass fields as optional'],
    faqs: [
      f('How do I use the generated Python dataclass?', 'Load your JSON with json.loads, then pass the values into the class. For a flat object, Root(**data) works. For nested objects the values stay as dictionaries until you build the nested dataclasses yourself.'),
      f('How are optional fields written in the Python output?', 'With Optional / nullable properties ticked, each field type gets | None appended. The output header imports dataclass and the typing helpers it uses.'),
    ],
  },
  '/json-to-go': {
    tasks: ['Convert JSON to a Go struct', 'Generate Go struct tags from a JSON object', 'Create nested Go structs from JSON', 'Unmarshal JSON into a generated Go struct'],
    faqs: [
      f('What are the json tags in the Go struct?', 'Each field gets a tag such as `json:"user_id"`. The field name is capitalized so Go exports it, and the tag keeps the original JSON key so encoding/json can match them.'),
      f('How do I unmarshal JSON into the generated struct?', 'Copy the struct into your program, then call json.Unmarshal([]byte(data), &root) with a variable of the root type. Check the field types first: numbers are generated as float64 and null values as interface{}.'),
    ],
  },
  '/json-to-php': {
    tasks: ['Convert JSON to a PHP class', 'Generate PHP properties from a JSON object', 'Create a PHP model for an API response', 'Map JSON arrays to PHP array properties'],
    faqs: [
      f('How do I use the generated PHP class with json_decode?', 'json_decode returns an object or an array, not an instance of your class. Decode the JSON, then copy each value into the generated class yourself or write a small constructor or hydrator.'),
      f('How are JSON arrays typed in the PHP output?', 'Arrays are written with the array type. Nested objects become their own classes, and the property uses that class name as its type.'),
    ],
  },
  '/json-to-kotlin': {
    tasks: ['Convert JSON to a Kotlin data class', 'Generate Kotlin data classes from an API response', 'Create nested Kotlin data classes from JSON', 'Make Kotlin properties nullable'],
    faqs: [
      f('How do I use the Kotlin data class with kotlinx.serialization, Moshi or Gson?', 'Copy the data class into your project and add what your library requires, for example @Serializable for kotlinx.serialization. The tool writes plain val properties without library annotations.'),
      f('How are nullable values written in the Kotlin output?', 'A JSON null becomes Any?. With Optional / nullable properties ticked, every property type also gets a ? so it can be missing or null.'),
    ],
  },
  '/yaml-to-json': {
    tasks: ['Convert YAML to JSON online', 'Turn a Kubernetes or Docker Compose YAML file into JSON', 'Check YAML syntax by converting it to JSON', 'Convert a YAML config file to JSON for an API'],
    faqs: [
      f('Does YAML to JSON support multiple documents separated by ---?', 'The converter reads one YAML document. If your input contains several documents separated by ---, split them and convert each one on its own.'),
      f('What happens to comments when I convert YAML to JSON?', 'They are dropped. JSON has no comment syntax, so the output contains only the data.'),
    ],
  },
  '/csv-to-json': {
    tasks: ['Convert CSV to a JSON array of objects', 'Convert a semicolon separated file to JSON', 'Turn a spreadsheet export into JSON', 'Convert a CSV file to JSON for an API or mock data'],
    faqs: [
      f('What happens to empty header cells?', 'An empty header is named column1, column2 and so on, by position, so every value still has a key in the JSON.'),
      f('How do I convert a CSV file to a JSON array?', 'Paste the CSV or load the file, pick the delimiter, make sure the first row holds the column names and press convert. Each following row becomes one object in the array.'),
    ],
  },
  '/json-to-csv': {
    tasks: ['Convert a JSON array to CSV', 'Export JSON data to a spreadsheet', 'Convert JSON to comma-separated CSV with a header row', 'Download JSON as a CSV file'],
    faqs: [
      f('What if the objects in my array have different keys?', 'The header row is the union of all keys found in the array, in order of first appearance. An object that lacks a key gets an empty cell in that column.'),
      f('How do I open the converted CSV in Excel?', 'Download the converted file and open it in Excel or Google Sheets. The output is comma-separated with a header row, so each column lines up with a key from your JSON.'),
    ],
  },

  // ------------------------------------------------------------------ Encoders and decoders
  '/url-encoder': {
    tasks: ['Percent-encode a query parameter value', 'Encode spaces and special characters for a URL', 'Encode Unicode text for a URL', 'Escape & and = inside a query string value'],
    faqs: [
      f('What is the difference between encodeURI and encodeURIComponent?', 'This tool applies encodeURIComponent, which also encodes characters such as / ? & = : #. encodeURI leaves those alone so a whole URL keeps its structure. Use component encoding for a single value and never run it over a complete URL.'),
      f('Does a space become %20 or +?', 'This tool writes a space as %20. The + form for spaces comes from HTML form encoding and is only meaningful in query strings.'),
    ],
  },
  '/url-decoder': {
    tasks: ['Decode a percent-encoded URL', 'Read %20 and %3A in a link', 'Decode an encoded query string from a log file', 'Decode a UTF-8 URL parameter'],
    faqs: [
      f('What do %20, %3A and %2F mean in a URL?', '%20 is a space, %3A is a colon and %2F is a slash. Each % sequence is the hexadecimal value of one byte, and UTF-8 characters use several of them in a row.'),
      f('Why does the URL decoder return nothing for my text?', 'A stray % that is not followed by two hexadecimal digits is not valid percent-encoding, so the browser refuses to decode it and the output stays empty. Fix or remove that character and try again.'),
    ],
  },
  '/base64-encoder': {
    tasks: ['Base64 encode a string online', 'Encode UTF-8 text with emoji to Base64', 'Convert text to Base64 for a Basic auth header', 'Encode a JSON payload as Base64'],
    faqs: [
      f('How do I Base64 encode a string in JavaScript, Python or C#?', 'In the browser use btoa on UTF-8 bytes. In Node.js use Buffer.from(text).toString("base64"). In Python use base64.b64encode(text.encode()). In C# use Convert.ToBase64String(Encoding.UTF8.GetBytes(text)).'),
      f('What does the == at the end of Base64 mean?', 'It is padding. Base64 works in groups of three bytes, and one or two = characters fill the last group when the input length is not a multiple of three.'),
    ],
  },
  '/base64-decoder': {
    tasks: ['Base64 decode a string online', 'Decode a Base64 API response to text', 'Decode Base64 UTF-8 text', 'Read a Base64 value from a config file'],
    faqs: [
      f('What does the Base64 string SGVsbG8sIFdvcmxkIQ== decode to?', 'It decodes to Hello, World!. The two = characters at the end are padding.'),
      f('How do I decode Base64 in JavaScript, Python or C#?', 'In the browser use atob. In Node.js use Buffer.from(value, "base64").toString(). In Python use base64.b64decode(value). In C# use Convert.FromBase64String(value) and read the bytes with Encoding.UTF8.GetString.'),
    ],
  },
  '/html-encoder': {
    tasks: [
      'Encode HTML entities online',
      'HTML encode a string online',
      'Encode HTML special characters for display',
      'Escape ampersands, angle brackets and quotes',
      'Convert HTML characters to named entities',
      'Encode markup so it appears as text',
      'Escape an ampersand as &amp;',
      'HTML encode a string in JavaScript',
    ],
    faqs: [
      f('How do I HTML encode a string online?', 'Paste or type the string into the input box. The encoded text appears as you type: & becomes &amp;, < becomes &lt;, > becomes &gt;, " becomes &quot; and \' becomes &#39;. Press Copy and paste the result into your page.'),
      f('What is an HTML encoder?', 'An HTML encoder (or HTML escape tool) converts special characters into HTML entities so the browser shows them as text instead of treating them as markup. That is how you display a literal <div> tag or an ampersand on a page.'),
      f('Is this HTML encoder tool free?', 'Yes. It is free, needs no account and runs in your browser, so the text you enter is not sent to a server.'),
      f('Is HTML encoding the same as URL encoding?', 'No. HTML encoding uses entities such as &amp; and &lt; for markup. URL encoding uses percent codes such as %26 and %3C for URLs. Use this page for HTML entities and the URL Encoder for percent-encoding.'),
      f('Is HTML encoding enough to prevent XSS?', 'No. Escaping special characters is one part of output encoding, and the right escaping depends on where the text lands: element content, an attribute value, JavaScript or a URL. Prefer your framework\'s built-in escaping, and add a Content Security Policy for defense in depth.'),
      f('What is the difference between &lt; and &#60;?', 'They are two spellings of the same character. &lt; is a named entity and &#60; is a numeric one. This tool writes the named forms &amp;, &lt;, &gt;, &quot; and the numeric form &#39; for the apostrophe.'),
      f('Which characters does this HTML encoder replace?', 'It replaces five HTML-significant characters: ampersand (&) with &amp;, less-than (<) with &lt;, greater-than (>) with &gt;, double quote with &quot; and apostrophe with &#39;. Other characters, including ordinary Unicode text, are left unchanged.'),
      f('How do I HTML encode text in JavaScript?', 'Use a text-node API such as textContent when you want to display user text in an element. If you specifically need an encoded string, replace &, <, >, double quotes and apostrophes with their corresponding HTML entities. Avoid building HTML with untrusted strings.'),
      f('Is HTML encoding the same as HTML sanitization?', 'No. Encoding converts selected characters to entities for a particular output context. Sanitization parses markup and applies an allowlist or policy to remove unsafe elements and attributes. This encoder does not sanitize HTML or make arbitrary markup safe to insert into a page.'),
      f('Does HTML encoding work the same as URL encoding?', 'No. HTML entities such as &amp; and &lt; are used in HTML markup. URL encoding uses percent-encoded bytes such as %26 and %3C for URL components. Use the URL Encoder for URL values.'),
    ],
  },

  '/html-decoder': {
    tasks: [
      'HTML decode online',
      'HTML decoder',
      'Decode HTML entities to text',
      'Convert &amp; and &lt; back to characters',
      'Decode numeric and hex HTML entities',
      'Turn escaped HTML back into readable markup',
      'Decode html encoded string online',
      'Online html decoder',
    ],
    faqs: [
      f('How do I HTML decode online?', 'Paste text that contains entities into the input. The decoded characters appear as you type. Named forms such as &amp; and &lt;, decimal forms such as &#38;, and hex forms such as &#x26; are all supported. Press Copy when you are done.'),
      f('What is an HTML decoder?', 'An HTML decoder (or HTML unescape tool) converts character references back into the characters they represent. That is how &lt;div&gt; becomes the text <div> again, and &amp; becomes &.'),
      f('Is HTML decoding the same as URL decoding?', 'No. HTML entities such as &amp; and &#39; belong inside HTML documents. URL decoding handles percent codes such as %26. Use the URL Decoder for percent-encoded text and this tool for entities.'),
      f('Why does &amp;amp; decode to &amp; instead of &?', 'Decoding runs one pass. &amp;amp; is an ampersand that was escaped twice, so one pass leaves &amp;. Run the output through the decoder again to remove the second layer.'),
    ],
  },

  '/jwt-decoder': {
    tasks: ['Decode a JWT online', 'Read the claims inside a JSON Web Token', 'Check the exp claim of an access token', 'Inspect a Bearer token from an Authorization header'],
    faqs: [
      f('What are the three parts of a JWT?', 'A JWT is header.payload.signature, separated by dots. The header names the signing algorithm, the payload holds the claims, and the signature lets a server check that nothing was changed. The first two parts are Base64URL-encoded JSON.'),
      f('What do iss, sub, aud, nbf, iat and jti mean?', 'iss is the issuer, sub the subject (usually the user id) and aud the audience the token is meant for. nbf is the time before which the token is not valid, iat is when it was issued and jti is a unique token id. Times are Unix timestamps in seconds.'),
    ],
  },

  // ------------------------------------------------------------------ Generators and hashes
  '/uuid-generator': {
    tasks: [
      'UUID generator',
      'Generate a random UUID',
      'Online UUID generator tool',
      'Generate uuid online',
      'Random uuid generator',
      'Custom UUID format: uppercase, no hyphens, braces',
      'Generate UUID v4 online',
      'Generate UUID v7 online',
      'Generate up to 500 UUIDs at once',
      'Create random UUIDs for test data or database keys',
      'Download UUIDs as a text file',
    ],
    faqs: [
      f('How do I generate a random UUID online?', 'A UUID is ready when this page loads. Copy it, or change the quantity, version and format and press Generate. Version 4 values come from your browser\'s secure random source; nothing is sent to a server. For many values at once, raise the quantity and use Download .txt.'),
      f('What is the difference between UUID v4 and UUID v7?', 'UUID v4 is almost entirely random — the usual choice for opaque IDs. UUID v7 starts with a millisecond timestamp followed by random bits, so values created later sort after earlier ones and are friendlier to database indexes. Both are available here.'),
      f('Is a UUID the same as a GUID?', 'Yes for practical purposes. GUID is the Microsoft name for the same 128-bit identifier. This tool can output uppercase and {braces} forms that match common GUID style in .NET.'),
      f('Can I customize the UUID format?', 'Yes. Choose standard lowercase, UPPERCASE, without hyphens, or wrapped in {braces}. The version (v4 or v7) is selectable; the layout stays the standard 8-4-4-4-12 pattern.'),
      f('How do I generate a UUID in JavaScript, C# or Python?', 'In JavaScript use crypto.randomUUID(). In C# use Guid.NewGuid(). In Python use uuid.uuid4(). This page is for quick one-offs and bulk lists without opening a REPL.'),
      f('Is it safe that UUIDs are generated in the browser?', 'Yes for identifiers. Version 4 uses the Web Crypto API secure random source in your browser, and the values never leave your device. Do not treat a UUID as a password or API secret; use a purpose-built token for those.'),
    ],
  },

  '/uuid-validator': {
    tasks: ['UUID version checker', 'Validate a GUID', 'Check if a string is a valid UUID', 'Validate a GUID format', 'Check a UUID before saving it to a database', 'Test whether an id matches the 8-4-4-4-12 pattern'],
    faqs: [
      f('How do I check the version of a UUID?', 'Paste it and press validate: the result states the version, for example Valid UUID (version 4). The version is the first digit of the third group. For the variant and any embedded timestamp, use the UUID Parser.'),
      f('Is there a difference between a GUID validator and a UUID validator?', 'No. GUID is the Microsoft name for the same 128-bit identifier, so a GUID such as 123e4567-e89b-12d3-a456-426614174000 is checked the same way. Curly braces around it are accepted.'),
      f('What does a valid UUID look like?', 'Thirty-two hexadecimal digits in five groups of 8-4-4-4-12 separated by hyphens, for example 123e4567-e89b-12d3-a456-426614174000. The validator also checks the version digit and the variant.'),
      f('Is the nil UUID 00000000-0000-0000-0000-000000000000 valid here?', 'Yes. The nil UUID is a special reserved value and the validator recognises it, along with the all-ones max UUID. Other UUIDs must have a version digit from 1 to 8.'),
    ],
  },
  '/uuid-parser': {
    tasks: ['Find the version of a UUID', 'Check the UUID variant', 'Check whether a UUID contains a timestamp', 'Inspect a GUID from a log or database'],
    faqs: [
      f('Where is the version digit in a UUID?', 'It is the first character of the third group. In 123e4567-e89b-12d3-a456-426614174000 it is 1. The tool reports that version and the RFC 9562 variant.'),
      f('Can the parser read the timestamp out of a UUID?', 'Yes for versions 1, 6 and 7. It converts the embedded time into a UTC date. Versions 3, 4 and 5 carry no creation time, and the parser says so.'),
    ],
  },
  '/jwt-generator': {
    tasks: ['Generate a JWT with an HS256 secret', 'Create a test JSON Web Token', 'Build a JWT from a JSON payload', 'Add an exp claim to a test token'],
    faqs: [
      f('How do I add an expiry to a generated JWT?', 'Add an exp claim to the payload JSON as a Unix timestamp in seconds, for example "exp": 1893456000. You can get that number from the Timestamp Converter.'),
      f('What secret should I use?', 'Any text works for a test token, and the tool falls back to the word secret if you leave the field empty. For real systems use a long random secret that only your server knows, and generate production tokens on your server rather than in a browser page.'),
    ],
  },
  '/hash-generator': {
    tasks: ['Generate a hash from text online', 'Create a file checksum in the browser', 'Hash a string without uploading it', 'Compare a hash with a published checksum'],
    faqs: [
      f('How do I check a file checksum?', 'Choose or drop the file, copy the generated hash and compare it with the checksum the publisher lists. If every character matches, the file is the same. Use SHA-256 or SHA-512 pages when the publisher lists those.'),
      f('Is hashing the same as encryption?', 'No. A hash is a one-way fingerprint and cannot be turned back into the original data. Encryption is reversible with a key.'),
    ],
  },
  '/sha256-generator': {
    tasks: ['Generate a SHA-256 hash online', 'Calculate the SHA-256 checksum of a file', 'Create a 64-character hex digest from text', 'Verify a SHA-256 checksum'],
    faqs: [
      f('How do I generate a SHA-256 hash in JavaScript, Python or Linux?', 'In JavaScript use crypto.subtle.digest("SHA-256", bytes). In Python use hashlib.sha256(data).hexdigest(). On Linux use sha256sum file or echo -n text | sha256sum.'),
      f('Why does one extra space or newline change the whole hash?', 'A hash depends on every byte of the input. Adding a space, a trailing newline or changing letter case produces a completely different digest.'),
    ],
  },
  '/sha512-generator': {
    tasks: ['Generate a SHA-512 hash online', 'Calculate the SHA-512 checksum of a file', 'Create a 128-character hex digest from text', 'Compare SHA-512 hashes'],
    faqs: [
      f('How long is a SHA-512 hash?', 'It is 512 bits, written as 128 hexadecimal characters.'),
      f('What is the difference between SHA-256 and SHA-512?', 'Both belong to the SHA-2 family. SHA-256 produces a 256-bit digest (64 hex characters) and SHA-512 a 512-bit digest (128 hex characters). Both are suitable for checksums; pick the one your system or publisher uses.'),
    ],
  },
  '/md5-generator': {
    tasks: ['Generate an MD5 hash online', 'Create a 32-character MD5 checksum', 'Calculate the MD5 of a file', 'Check a legacy MD5 checksum'],
    faqs: [
      f('How long is an MD5 hash?', 'It is 128 bits, written as 32 hexadecimal characters.'),
      f('Can I still use MD5 for file checksums?', 'MD5 can still reveal accidental corruption in a download. It cannot be trusted to stop deliberate tampering, because different inputs with the same MD5 can be crafted. Use SHA-256 when integrity matters.'),
    ],
  },

  // ------------------------------------------------------------------ Web tools
  '/timestamp-converter': {
    tasks: ['Convert a Unix timestamp to a date', 'Convert a date to a Unix timestamp', 'Convert milliseconds, microseconds or nanoseconds to a date', 'Convert an ISO 8601 date to epoch time'],
    faqs: [
      f('How do I get the current Unix timestamp?', 'The input opens with the current time in seconds already filled in. In JavaScript the same value is Math.floor(Date.now() / 1000).'),
      f('What is the Year 2038 problem?', 'Systems that store Unix time in a signed 32-bit integer overflow on 19 January 2038. JavaScript dates use larger numbers, so the dates this tool converts are not affected.'),
    ],
  },
  '/unix-timestamp': {
    tasks: [
      'Get the current Unix timestamp', 'See the current epoch time in seconds and milliseconds',
      'Convert epoch time to a human-readable date', 'Convert Unix timestamp to UTC or local time',
      'Convert a date and time to Unix timestamp', 'Convert milliseconds, microseconds and nanoseconds to a date',
      'Check whether a timestamp is in seconds or milliseconds',
      'Read a timestamp from a log, database row, API response or JWT claim'
    ],
    faqs: [
      f('What is the current Unix timestamp?', 'The live clock at the top shows the current Unix timestamp in seconds and milliseconds and updates every second. It also shows the current UTC date. Use the adjacent copy buttons to copy either value.'),
      f('What is an epoch converter?', 'An epoch converter changes a Unix timestamp (the number of seconds or smaller time units since 1 January 1970 at 00:00:00 UTC) into a readable date and time. It can also convert a date and time back into a Unix timestamp.'),
      f('How do I convert a Unix timestamp to a date?', 'Paste the timestamp into the input. Keep Auto detect selected for a typical seconds or milliseconds value, or choose Seconds, Milliseconds, Microseconds or Nanoseconds if you know the unit. The result includes UTC, local time and ISO 8601.'),
      f('How do I convert a date to a Unix timestamp?', 'Enter a date string accepted by your browser, preferably ISO 8601 such as 2026-11-13T10:30:00Z. The result includes Unix seconds, milliseconds, microseconds and nanoseconds.'),
      f('What is the difference between Unix time and epoch time?', 'They are commonly used to mean the same thing: a count of time from the Unix epoch, 1 January 1970 at 00:00:00 UTC. POSIX time is another common name.'),
      f('Is a Unix timestamp in seconds or milliseconds?', 'Most Unix and API timestamps use 10 digits for seconds. JavaScript Date.now() usually returns 13 digits in milliseconds. This converter can auto-detect common seconds, milliseconds, microseconds and nanoseconds values; use the unit selector when you need to override detection.'),
      f('Why does my timestamp convert to a date in 1970?', 'The input may be in seconds but interpreted as milliseconds, or it may genuinely represent a date close to the Unix epoch. Check the source system and select the correct unit manually.'),
      f('Does changing the time zone change a Unix timestamp?', 'No. A Unix timestamp represents one instant and does not contain a time zone. The same timestamp can be displayed as different local clock times in different time zones; its UTC instant remains the same.'),
      f('What is the Unix epoch date?', 'The Unix epoch is 1 January 1970 at 00:00:00 UTC. Its Unix timestamp is 0.'),
      f('What is the Year 2038 problem?', 'Older systems that store Unix time in a signed 32-bit integer reach their maximum value at 2,147,483,647 seconds, corresponding to 19 January 2038 at 03:14:07 UTC. Systems using 64-bit time values avoid this specific limit.'),
      f('Can I convert a timestamp from a JWT, API response or server log?', 'Yes. Copy the numeric timestamp value from the exp or iat claim in a JWT, an API field or a log entry and paste it here. Check whether the source uses seconds or milliseconds before relying on the converted date.'),
      f('Does this tool support microsecond and nanosecond timestamps?', 'Yes. Choose Microseconds or Nanoseconds in the unit selector, or leave Auto detect selected for values with the usual digit lengths. Browser date display itself has millisecond precision, so sub-millisecond digits are not preserved in the displayed date.'),
    ],
  },
  '/color-converter': {
    tasks: ['Convert HEX to RGB', 'Convert RGB to HEX', 'Use a 3-digit hex color code', 'Preview a color while converting'],
    faqs: [
      f('Does it convert HSL or named colors like red?', 'No. The converter handles HEX and RGB only. Named colors and HSL values return the unsupported format message.'),
      f('What is a 3-digit hex color?', 'A shorthand where each digit is doubled. #FFF means #FFFFFF and #0AF means #00AAFF. The converter expands it before converting.'),
    ],
  },
  '/hex-to-rgb': {
    tasks: ['Convert a HEX color code to RGB', 'Convert #3B82F6 to rgb()', 'Convert a 3-digit hex color to RGB', 'Get RGB values for CSS from a design hex code'],
    faqs: [
      f('How do I convert #3B82F6 to RGB?', 'Read the hex code in pairs: 3B is 59, 82 is 130 and F6 is 246, so #3B82F6 is rgb(59, 130, 246).'),
      f('Does it support 8-digit hex codes with alpha?', 'Yes. An 8-digit code such as #3B82F680 converts to rgba(59, 130, 246, 0.5), where the last two digits become the alpha value.'),
    ],
  },
  '/rgb-to-hex': {
    tasks: ['Convert RGB to a HEX color code', 'Convert rgb(59, 130, 246) to hex', 'Change RGB to hex for CSS', 'Turn CSS rgb values into a hex code', 'Get an uppercase hex code for a design tool', 'Convert RGB to hexadecimal'],
    faqs: [
      f('Is it RGB to HEX or GRB to HEX?', 'CSS, design tools and this converter all use RGB order: red, green, blue. GRB is usually a typo. Some LED strips (WS2812, for example) do expect bytes in green, red, blue order. If you are working with one, swap the first two numbers before converting, then enter them as RGB.'),
      f('How do I convert rgb(59, 130, 246) to hex?', 'Convert each channel to two hex digits: 59 is 3B, 130 is 82 and 246 is F6. Together that is #3B82F6.'),
      f('What range should each RGB value be in?', 'Each channel is a whole number from 0 to 255. A value outside that range shows an error instead of a hex code.'),
      f('Does RGB to HEX support alpha (rgba)?', 'Yes. rgba(59, 130, 246, 0.5) becomes the 8-digit code #3B82F680, where the last two digits are the alpha value.'),
    ],
  },
  '/query-string-parser': {
    tasks: ['Parse a URL query string into JSON', 'Read the parameters of a URL', 'Decode %20 and + in query values', 'Turn ?a=1&b=2 into an object'],
    faqs: [
      f('Can I paste a full URL instead of just the query string?', 'Yes. The text before the question mark is ignored, so a complete URL works the same as the part after it.'),
      f('Does it decode %20 and + in values?', 'Yes. The parser decodes percent-encoded characters and treats + as a space, which is how browsers read query strings.'),
    ],
  },
  '/query-string-generator': {
    tasks: ['Build a query string from JSON', 'Encode URL parameters from an object', 'Create ?key=value&key2=value2 from key value pairs', 'Generate encoded query parameters for an API call'],
    faqs: [
      f('How do I send an array in a query string?', 'The generator turns an array into one comma-separated value, so {"ids":[1,2]} becomes ids=1%2C2. If your API expects repeated keys such as ids=1&ids=2, build those pairs by hand.'),
      f('Are special characters encoded in the output?', 'Yes. Values are percent-encoded, and spaces are written as +, which is the standard form for query strings.'),
    ],
  },
  '/cron-expression-generator': {
    tasks: ['Write a cron expression for every 5 minutes', 'Schedule a cron job at midnight', 'Run a cron job on weekdays at 9 AM', 'Check what a cron schedule means in plain English'],
    faqs: [
      f('What does */5 * * * * mean?', 'It runs every 5 minutes. The */5 in the minute field means every fifth minute, and the stars mean every hour, day, month and weekday.'),
      f('Can I pick a schedule instead of typing one?', 'Yes. Use the common-schedule buttons (every minute, every 5 minutes, hourly, daily at midnight, weekdays at 9:00, Mondays at 8:30, 1st of the month) and edit the result to fit your job.'),
      f('How do I run a cron job every day at midnight or at 9 AM on weekdays?', 'Use 0 0 * * * for every day at midnight and 0 9 * * 1-5 for 9:00 AM from Monday to Friday. Paste either one into the field to see it described in plain English.'),
    ],
  },
  '/cron-expression-parser': {
    tasks: ['Translate a cron expression into plain English', 'Check a crontab schedule before deploying', 'Understand a cron schedule from a CI or Kubernetes config', 'Find out what 0 9 * * 1-5 means'],
    faqs: [
      f('What does 0 9 * * 1-5 mean?', 'It describes a job that runs at 9:00 AM from Monday through Friday. The fields are minute 0, hour 9, any day of the month, any month, and weekdays 1 to 5.'),
      f('Can I use the description to check a schedule for a different scheduler?', 'Use it as a readable check of the five standard fields. Schedulers such as Kubernetes CronJobs, GitHub Actions and cloud services have their own details, for example time zone handling, so confirm those in the scheduler\'s documentation.'),
    ],
  },

  // ------------------------------------------------------------------ Text and data
  '/xml-formatter': {
    tasks: ['Pretty print XML online', 'Format minified XML', 'Indent an XML response for readability', 'Make an XML config file readable'],
    faqs: [
      f('How do I pretty print XML?', 'Paste the XML, press the format button and copy the indented result. Each element starts on its own line, nested by depth.'),
      f('Does formatting change the meaning of my XML?', 'Formatting only adds whitespace between elements, which XML readers normally ignore. Text inside elements is kept as it is.'),
    ],
  },
  '/xml-validator': {
    tasks: ['Validate XML online before importing or sending it to an API', 'Check whether an XML file is well-formed', 'Find mismatched, missing or unclosed XML tags', 'Check XML syntax and attribute quoting', 'Inspect a browser XML parser error with its line and column', 'Check the syntax of sitemap, RSS, SOAP or configuration XML'],
    faqs: [
      f('How do I validate XML online?', 'Paste your XML into the input area or choose an XML file, then press Process. The browser XML parser checks whether it is well-formed and displays a parser error if it is not.'),
      f('Can I validate an XML file instead of pasting its contents?', 'Yes. Choose or drop a file in the input area. The browser reads the file as text; press Process to run the well-formedness check.'),
      f('What XML errors does this checker find?', 'It detects XML parsing problems such as mismatched or unclosed tags, multiple root elements, unquoted attribute values and unescaped special characters. The exact error wording depends on your browser.'),
      f('Does this XML validator support XSD or DTD validation?', 'No. It checks whether the document is well-formed XML. XSD and DTD validation require comparing the document with a schema or document type definition, which this browser parser workflow does not do.'),
      f('What is the difference between well-formed XML and valid XML?', 'Well-formed XML follows the XML syntax rules. Valid XML must also conform to a DTD or XML Schema (XSD). A document can be well-formed but still fail schema validation.'),
      f('Why is an XML error reported after the actual mistake?', 'The parser reports where it noticed the inconsistency, not necessarily where it began. A missing closing tag may only be detected when a later closing tag does not match.'),
      f('Can I check an XML sitemap with this tool?', 'You can check that the sitemap is well-formed XML. This does not check sitemap-specific requirements such as the sitemap namespace, URL limits or protocol rules.'),
      f('Is XML sent to a server when I use the validator?', 'No. Pasted text is parsed in your browser, and a selected file is read locally with FileReader. The tool does not upload the XML to a remote validation service.'),
      f('Why does the validator show only the first XML error?', 'The browser DOMParser reports a parser error rather than a complete list of diagnostics. Fix the first reported issue and run the validation again to reveal any later errors.'),
      f('Can I format XML after checking it?', 'Yes. Use the XML Formatter to indent and make well-formed XML easier to read. Formatting and validation are separate tasks; formatting does not add XSD or DTD checks.'),
    ],
  },
  '/yaml-formatter': {
    tasks: ['Format and clean up YAML online', 'Fix YAML indentation', 'Re-print a YAML config file consistently', 'Check that YAML parses'],
    faqs: [
      f('Can YAML use tabs for indentation?', 'No. YAML requires spaces for indentation, and a tab causes a parse error. The formatter re-prints your data with consistent space indentation.'),
      f('How do I convert YAML to JSON?', 'Use the YAML to JSON page. It parses the same YAML and prints it as indented JSON.'),
    ],
  },
  '/text-counter': {
    tasks: ['Count characters, words and lines', 'Check the length of a meta description', 'Count words in a pasted text', 'Count lines in a log or list'],
    faqs: [
      f('How are words counted?', 'Words are runs of text separated by spaces, tabs or line breaks. Two words joined by a hyphen count as one.'),
      f('Do blank lines count in the line total?', 'Yes. Lines are counted by line breaks, so an empty line between paragraphs is included in the total.'),
    ],
  },
  '/case-converter': {
    tasks: ['Convert text to uppercase', 'Convert text to lowercase', 'Convert text to title case', 'Fix text typed with caps lock on'],
    faqs: [
      f('How does the title case output work?', 'The first letter of every word is capitalized and the rest is lowercased. Small words such as of or the are capitalized too, so edit them by hand if your style guide differs.'),
      f('Which cases does the tool produce?', 'It shows UPPERCASE, lowercase and Title Case together for whatever you paste. For code styles such as camelCase or snake_case, convert them by hand.'),
    ],
  },
  '/text-to-slug': {
    tasks: ['Turn a title into a URL slug', 'Convert text to a lowercase hyphenated slug', 'Remove special characters from a URL', 'Create a slug for a blog post title'],
    faqs: [
      f('What slug does "Hello, World! 2026" produce?', 'hello-world-2026. The text is lowercased, runs of other characters become a single hyphen, and hyphens at the start or end are trimmed.'),
      f('Are underscores kept in the slug?', 'No. Anything that is not a lowercase letter or a digit, including underscores, turns into a hyphen.'),
    ],
  },
  '/slug-generator': {
    tasks: ['Generate an SEO-friendly URL slug', 'Make a slug from an article title', 'Create a clean permalink', 'Convert a product name to a URL slug'],
    faqs: [
      f('Should a slug use hyphens or underscores?', 'Use hyphens. Search engines read hyphens as word separators, and Google\'s URL guidance recommends them over underscores.'),
      f('How long should a URL slug be?', 'There is no fixed limit, but short and descriptive works best. Keep the main words of the title and drop filler words when the slug would otherwise run long.'),
    ],
  },
  '/regex-tester': {
    tasks: ['Test a regular expression online', 'Find and replace with a regex', 'Test an email regex', 'Check a JavaScript regex against sample text'],
    faqs: [
      f('How do I do a regex find and replace?', 'Enter the pattern and flags, paste your text and type the replacement in the replacement box. You can use $1 for a capture group and $& for the whole match. The replaced text appears below the matches.'),
      f('What do the g, i and m flags do?', 'g finds every match instead of just the first, i ignores letter case, and m makes ^ and $ match at the start and end of each line.'),
    ],
  },
  '/regex-generator': {
    tasks: ['Try a ready-made email, URL or digits regex', 'Build and test a regex pattern', 'Copy a regex with its flags', 'Check a regex against example text'],
    faqs: [
      f('How do I make a regex case-insensitive or match across lines?', 'Add the i flag to ignore letter case and the m flag so ^ and $ match at each line. Type the letters into the flags box, for example gi or gm, then run the test.'),
      f('How do I match digits, words or URLs?', 'Load one of the built-in examples as a starting point. \\d+ matches digits, \\b[A-Za-z]+\\b matches words and https?://[^\\s]+ matches simple web addresses. Then edit the pattern and test it.'),
    ],
  },
  '/diff-checker': {
    tasks: ['Compare two texts and see the differences', 'Compare two code files', 'Ignore whitespace when comparing text', 'Compare by line, word or character'],
    faqs: [
      f('How do I ignore whitespace differences?', 'Tick the ignore whitespace option before you compare. Runs of spaces and line breaks are treated as a single space, so formatting-only changes disappear from the result.'),
      f('Can I compare two files?', 'Yes. Drop a file into each side, or paste the text, then press compare. The file is read in your browser and is not uploaded.'),
    ],
  },
  '/number-base-converter': {
    tasks: ['Convert between binary, octal, decimal and hex', 'Convert an octal number to decimal', 'Convert a number to another base online', 'Check a number in two bases'],
    faqs: [
      f('Which number bases can I convert between?', 'Binary (2), octal (8), decimal (10) and hexadecimal (16). Pick a From base and a To base from the two menus.'),
      f('Why is the result in capital letters?', 'Hexadecimal digits above 9 are shown as A to F in uppercase. 255 in hex is shown as FF.'),
    ],
  },
  '/binary-to-decimal': {
    tasks: ['Convert binary to decimal', 'Convert 8-bit binary to a number', 'Convert 1010 to decimal', 'Check a binary value by hand'],
    faqs: [
      f('What is 1010 in decimal?', '10. Reading from the right, 1010 is 0 + 2 + 0 + 8.'),
      f('What is 11111111 in decimal?', '255, the largest value that fits in 8 bits.'),
    ],
  },
  '/decimal-to-binary': {
    tasks: ['Convert decimal to binary', 'Convert 255 to binary', 'Convert a number to 8-bit binary', 'Check a decimal to binary conversion'],
    faqs: [
      f('What is 255 in binary?', '11111111, which is eight ones.'),
      f('What is 10 in binary?', '1010.'),
    ],
  },
  '/hex-to-decimal': {
    tasks: ['Convert hex to decimal', 'Convert FF to decimal', 'Convert a hex color channel to a number', 'Check a hexadecimal value'],
    faqs: [
      f('What is hex FF in decimal?', '255. F is 15, so FF is 15 x 16 + 15.'),
      f('Is hexadecimal case sensitive?', 'No. ff, FF and Ff all mean the same value, and the tool returns the same decimal number for each.'),
    ],
  },
  '/decimal-to-hex': {
    tasks: [
      'Convert decimal to hex', 'Convert 255 to hexadecimal', 'Convert RGB decimal values to hex',
      'Check a decimal to hex conversion', 'Convert a base 10 number to base 16',
      'Look up decimal and hexadecimal equivalents', 'Convert denary to hexadecimal online'
    ],
    faqs: [
      f('What is 255 in hex?', '255 in decimal is FF in hexadecimal.'),
      f('How do I convert RGB decimal values to hex?', 'Convert each channel separately and join the pairs. For example 59, 130 and 246 become 3B, 82 and F6, which gives #3B82F6. The RGB to HEX page does this in one step.'),
      f('What is 100 in hexadecimal?', '100 in decimal is 64 in hexadecimal.'),
      f('What is 16 in hexadecimal?', '16 in decimal is 10 in hexadecimal.'),
      f('What is denary to hexadecimal conversion?', 'Denary is another word for decimal. Denary to hexadecimal conversion is the same as converting base 10 to base 16.'),
    ],
  },

  // ------------------------------------------------------------------ Website checking
  '/website-status-checker': {
    tasks: [
      'Check if a website is down', 'Check if a site is down', 'Test website status',
      'Check several sites at once', 'See the HTTP status code of a URL',
      'Check whether a URL is working or not', 'Test whether a domain or path responds',
      'Check if a website is online', 'Find out if a site is down or just me',
      'Check website availability from this browser', 'Measure the response time for a URL'
    ],
    faqs: [
      f('What do HTTP 200, 301, 404 and 503 mean?', '200 means the request succeeded. 301 is a permanent redirect to another address. 404 means the page was not found. 503 means the server is temporarily unavailable.'),
      f('How do I check whether my own website is down?', 'Enter the domain here and read the result, then compare with how the site behaves on another network. This check runs from your browser, so a site that responds here can still be blocked for visitors in other places.'),
      f('Is my website down or is it just me?', 'Run the check, then open the same URL on a different device or network such as mobile data. If it works on the second connection, investigate your local DNS, VPN, firewall, browser or ISP. If it fails from several independent connections, the website or its host may be having an outage.'),
      f('Does this website status checker test from multiple locations?', 'No. It sends requests from your current browser and network only. A multi-location checker uses remote servers in different regions, which can reveal regional outages that a single browser check cannot detect.'),
      f('Why does another website down checker show a different result?', 'Different checkers may test from different networks, countries and server locations. Your browser may also be blocked by CORS, a firewall, DNS filtering or a VPN. Compare results from another network before concluding that the site is down for everyone.'),
    ],
  },
};
