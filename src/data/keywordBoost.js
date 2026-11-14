// Per-page keyword wording for tool pages. Plain data (no imports), merged in seo.js getToolSeo().
//   t: title override        d: meta description override
//   s: secondary keywords    l: long-tail keywords      (metadata for the keyword map)
//   tasks: extra "what people use it for" phrases      faqs: [question, answer] pairs added to the page
// Sources: queries seen in Search Console for this domain, plus how ranking pages word the same jobs.
// No search volumes are implied. Every answer describes what the tool really does.

export const KEYWORD_BOOST = {
  // UUID Generator: supporting FAQ for supplied SEMrush developer-query intent.
  '/uuid-generator': {
    faqs: [
      ['How do I generate a UUID in Java or Node.js?', "In Java, import java.util.UUID and call UUID.randomUUID(). In Node.js, import { randomUUID } from 'node:crypto' and call randomUUID(). Both create a version 4 UUID."],
    ],
  },
  '/json-formatter': {
    d: 'Free online JSON formatter and viewer. Paste minified JSON, get indented output with key sorting, a tree view and parser errors. Runs in your browser.',
    s: ['online json formatter', 'json formatter online', 'free json formatter', 'format json', 'json pretty print', 'json viewer online', 'view json'],
    l: ['how to write a json file', 'make json readable', 'json formatter no signup', 'format json in browser', 'json indent online'],
    tasks: ['Online JSON formatter', 'Free JSON formatter', 'Make minified JSON readable', 'JSON pretty print online', 'View JSON online', 'Align and indent JSON'],
    faqs: [
      ['How do I format JSON online?', 'Paste your JSON into the input box and the formatted, indented result appears in the output. If the JSON is invalid, the parser error is shown instead so you can fix it first.'],
      ['How do I write a JSON file?', 'A JSON file is a plain text file, usually saved with the .json extension, that holds one JSON value: normally an object in curly braces or an array in square brackets. Keys and strings need double quotes, items are separated by commas, and there are no comments or trailing commas. Paste what you wrote here to format it, or into the JSON Validator to check it.'],
      ['Can I use this as a JSON viewer?', 'Yes, for reading JSON. Paste it, drop a .json file onto the page or load it from an HTTPS URL, and you get indented output, optional key sorting, counts of keys, objects and arrays, and a tree / structured view. It is not an interactive collapsible tree, and very large files can be slow in a browser tab.'],
      ['What is JSON and what does a JSON file look like?', 'JSON (JavaScript Object Notation) is a text format for structured data. Objects use curly braces, arrays use square brackets, and values are strings, numbers, true, false or null. A JSON file is a plain text file, usually ending in .json, that holds one such value, for example {"name":"Ada","tags":["dev","math"],"active":true}. Paste it into the formatter above to see it indented.'],
      ['How do I open a JSON file?', 'A .json file is plain text, so any text editor opens it (Notepad, TextEdit, VS Code), and so does a web browser. To read it comfortably, choose the file in the file box on this page or drag it in. It is read and formatted in your browser and is not uploaded.'],
      ['How do I format JSON in Notepad++, Visual Studio, VS Code or Vim?', 'Notepad++ needs a plugin such as JSTool or JSON Viewer. Visual Studio and VS Code have a Format Document command that works on .json files. In Vim you can pipe the buffer through a tool such as jq or python -m json.tool. On any command line, json_pp, jq . and python -m json.tool all pretty print JSON. For a quick one-off, paste the JSON here instead.'],
      ['How do I put JSON inside JSON?', 'Either nest it as an object or array value, or store it as an escaped string, where every quote inside it has a backslash in front. A string-encoded value appears as one long string when you format the outer JSON. Copy its contents, remove the escaping and paste it into the formatter to read it as JSON.'],
      ['Do I need to download a JSON formatter?', 'No. It runs in your browser, so there is nothing to install, whether you are on Windows, macOS or Linux. Use the Download button on the output to save the formatted result as a .json file.'],
    ],
  },
  '/json-validator': {
    s: ['online json validator', 'json syntax checker', 'check json', 'json lint', 'validate json', 'verify json online', 'json analyzer'],
    l: ['validate json file online', 'find json errors', 'why is my json invalid', 'json error checker', 'json syntax error finder'],
    tasks: ['Online JSON validator', 'Validate a JSON file', 'Find the error in my JSON', 'Verify JSON online', 'Check if JSON is valid or not', 'See JSON root type, size and depth'],
    faqs: [
      ['How do I validate a JSON file online?', 'Open the file in a text editor, copy its contents and paste them into the validator. If the JSON is valid you see a success message; if not, you see the parser error and can use its position to find the problem.'],
      ['Why does my JSON fail validation?', 'The usual causes are a trailing comma, single quotes instead of double quotes, unquoted keys, comments, or values such as undefined and NaN that JSON does not allow.'],
      ['Can the validator fix my JSON?', 'No. It does not repair JSON automatically. It shows the parser error and, when the browser gives a position, the line and column, so you can correct the problem yourself. After fixing it, validate again.'],
      ['What does the validator tell me about valid JSON?', 'When the JSON is valid you see the root type (object or array), the number of top-level keys or items, the nesting depth and the size in characters. To re-print the same JSON with indentation, use the JSON Formatter.'],
      ['Is this a JSON parser?', 'It uses the JSON parser built into your browser, so it tells you whether a string parses and shows either a structure summary or the error. To parse JSON in your own code, use JSON.parse in JavaScript, json.loads in Python or JsonSerializer.Deserialize in C#.'],
    ],
  },
  '/json-beautifier': {
    t: 'JSON Beautifier Online - Beautify and Pretty Print JSON',
    d: 'Free JSON beautifier: beautify minified JSON online into readable, indented text. Pretty print JSON in your browser with no signup.',
    s: ['json beautifier online', 'json beautify', 'beautify json online', 'json pretty print', 'unminify json'],
    l: ['json beautifier', 'beautify minified json', 'online json beautifier', 'make json pretty', 'expand one line json'],
    tasks: ['JSON beautify online', 'Online JSON beautifier', 'Unminify JSON', 'Expand one-line JSON', 'Beautify a JSON array', 'Align JSON online'],
    faqs: [
      ['What is the difference between a JSON beautifier and a JSON formatter?', 'Nothing important: both add line breaks and indentation so JSON is easy to read. The names are used interchangeably, along with pretty printer.'],
      ['How do I beautify minified JSON?', 'Paste the one-line JSON into the input. The beautified version appears immediately, with each key on its own line and nested objects indented.'],
      ['How do I beautify JSON in JavaScript?', 'Parse the text and stringify it with an indent argument: JSON.stringify(JSON.parse(text), null, 2). This page does the same thing and lets you pick 1 to 8 spaces or tabs, with optional key sorting.'],
      ['Can it beautify a JSON array?', 'Yes. The root can be an object or an array. An array is printed with one item per line and nested objects indented under it.'],
    ],
  },
  '/json-minifier': {
    s: ['json minifier online', 'minify json', 'compress json', 'json compressor', 'remove whitespace from json'],
    l: ['minify json online', 'json to one line', 'reduce json size', 'strip json whitespace', 'compact json'],
    tasks: ['Minify JSON online', 'JSON minify online', 'Compress JSON to one line', 'Remove whitespace from JSON'],
    faqs: [
      ['How do I minify JSON?', 'Paste your JSON and the minified version appears as a single line with all spaces and line breaks outside strings removed. Copy it into your request, config or test fixture.'],
    ],
  },
  '/json-to-typescript': {
    s: ['json to typescript online', 'json to ts', 'json to typescript interface', 'generate typescript interfaces from json', 'json to type'],
    l: ['convert json to typescript interface', 'typescript interface from json', 'json to typescript types', 'api response to typescript', 'json to ts interface online'],
    tasks: ['JSON to TypeScript online', 'Generate a TypeScript interface from JSON', 'Type an API response'],
    faqs: [
      ['How do I convert JSON to a TypeScript interface?', 'Paste a sample JSON object and the generator writes an interface for the root and one for each nested object. Copy the output into your project and rename the interfaces to fit your code.'],
      ['Can a generated interface describe every API response?', 'It describes the sample you paste. Optional fields, unions and values that are sometimes null may need manual edits, so use a sample that shows all the fields.'],
    ],
  },
  '/json-to-java': {
    t: 'JSON to Java Object Converter - Generate Java Classes',
    d: 'Convert JSON to a Java object online: paste a JSON sample and generate Java classes with fields for each key. Free JSON to POJO converter in your browser.',
    s: ['json to java object online', 'json to java class', 'json to pojo', 'convert json to java', 'json to java converter'],
    l: ['json to java object', 'generate java class from json', 'json to pojo online', 'json to java model', 'java classes from json'],
    tasks: ['JSON to Java object online', 'JSON to POJO', 'Generate Java classes from an API response'],
    faqs: [
      ['How do I convert JSON to a Java object?', 'Generate the classes here from a sample, add them to your project, then deserialize with a library such as Jackson (objectMapper.readValue(json, Root.class)) or Gson (gson.fromJson(json, Root.class)).'],
      ['What is a POJO?', 'A plain old Java object: an ordinary class with fields and getters or setters, with no special base class. It is the usual target when mapping JSON into Java.'],
    ],
  },
  '/json-to-python': {
    s: ['json to python dataclass', 'json to python class', 'convert json to python object', 'json to dataclass', 'json to python model'],
    l: ['generate python class from json', 'json to python online', 'python dataclass from json', 'json dict to class', 'json to python object'],
    tasks: ['JSON to Python class online', 'Generate a Python dataclass from JSON', 'Model an API response in Python'],
    faqs: [
      ['How do I convert JSON to a Python object?', 'Parse the text with json.loads(text) to get dictionaries and lists. To work with attributes instead of keys, generate a dataclass here and build it from the parsed dictionary.'],
      ['What is the difference between a dict and a dataclass?', 'A dict is flexible but untyped and accessed by key. A dataclass has named, typed fields, which gives editor completion and clearer code.'],
    ],
  },
  '/json-to-go': {
    s: ['json to go struct', 'json to golang struct', 'convert json to go', 'json to struct', 'json to go online'],
    l: ['generate go struct from json', 'json to golang struct online', 'go struct from api response', 'json tags go struct', 'json to go type'],
    tasks: ['JSON to Go struct online', 'Generate a Go struct from JSON', 'JSON to Golang struct'],
    faqs: [
      ['How do I turn JSON into a Go struct?', 'Paste a sample object and copy the generated struct. Then parse with json.Unmarshal(data, &value). Fields must start with a capital letter to be exported, and struct tags such as json:"user_name" map them to the JSON keys.'],
    ],
  },
  '/json-to-php': {
    s: ['json to php class', 'json to php object', 'json decode php online', 'convert json to php', 'json to php array'],
    l: ['json_decode online', 'json to php class generator', 'php class from json', 'json decode php example', 'json to php model'],
    tasks: ['JSON to PHP class online', 'Online json_decode helper', 'Generate a PHP class from JSON'],
    faqs: [
      ['How do I use json_decode in PHP?', 'json_decode($json, true) returns an associative array. Without the second argument it returns a stdClass object. Check json_last_error() or pass JSON_THROW_ON_ERROR to catch invalid JSON.'],
      ['Can I decode JSON online like json_decode?', 'Paste the JSON into the JSON Validator or JSON Formatter to see whether it parses and how it is structured, then use this tool to draft a PHP class for it.'],
    ],
  },
  '/json-to-kotlin': {
    s: ['json to kotlin data class', 'json to kotlin', 'convert json to kotlin', 'kotlin data class from json', 'json to kotlin class'],
    l: ['generate kotlin data class from json', 'json to kotlin online', 'kotlin model from api response', 'json to kotlin serializable', 'data class from json'],
    tasks: ['JSON to Kotlin data class online', 'Generate a Kotlin model from JSON', 'Model an API response in Kotlin'],
    faqs: [
      ['How do I parse JSON into a Kotlin data class?', 'Generate the data class here, then decode with a library: kotlinx.serialization (annotate the class with @Serializable and call Json.decodeFromString), Moshi or Gson.'],
    ],
  },
  '/yaml-to-json': {
    d: 'Convert YAML to JSON online: paste YAML and get formatted JSON instantly. Free YAML to JSON converter that runs in your browser, no signup.',
    s: ['yaml to json online', 'convert yaml to json', 'yaml to json converter', 'yml to json', 'yaml parser'],
    l: ['yaml to json online free', 'convert yml to json', 'kubernetes yaml to json', 'yaml config to json', 'yaml to json formatter'],
    tasks: ['YAML to JSON online', 'Convert YML to JSON', 'Turn a YAML config into JSON'],
    faqs: [
      ['How do I convert YAML to JSON?', 'Paste the YAML into the input and the JSON appears formatted in the output. Invalid YAML shows the parser error with its line so you can fix it.'],
      ['What happens to YAML comments?', 'They are dropped. JSON has no comment syntax, so only the data is converted.'],
      ['How do I convert YAML to JSON in Python or JavaScript?', 'In Python, load the text with yaml.safe_load from PyYAML and print it with json.dumps(data, indent=2). In JavaScript, use load from the js-yaml package and JSON.stringify(data, null, 2). This page does the same thing in your browser.'],
    ],
  },
  '/csv-to-json': {
    s: ['csv to json online', 'convert csv to json', 'csv to json converter', 'csv to array of objects', 'csv parser'],
    l: ['csv to json free online', 'csv file to json', 'convert spreadsheet to json', 'csv rows to json objects', 'csv with header to json'],
    tasks: ['CSV to JSON online', 'Convert a CSV file to JSON', 'Spreadsheet data to JSON'],
    faqs: [
      ['How does CSV to JSON conversion work?', 'The first row is used as the header, so each following row becomes a JSON object with those names as keys. You can choose the delimiter, and the result can be downloaded as a file.'],
      ['How do I convert an Excel sheet to JSON?', 'Export or save the sheet as CSV, paste the CSV text here and convert. Check that the first row holds your column names.'],
    ],
  },
  '/json-to-csv': {
    s: ['json to csv online', 'convert json to csv', 'json to csv converter', 'json array to csv', 'json to excel csv'],
    l: ['json to csv free online', 'convert json to spreadsheet', 'array of objects to csv', 'api response to csv', 'download json as csv'],
    tasks: ['JSON to CSV online', 'Convert a JSON array to CSV', 'Open JSON in a spreadsheet'],
    faqs: [
      ['What JSON can I convert to CSV?', 'An array of flat objects, such as [{"name":"Ada","age":36}]. Each object becomes a row and the keys become the header. Other shapes show an error asking for an array of objects.'],
      ['How do I convert nested JSON to CSV?', 'This page does not flatten nested objects: they are written as [object Object]. Flatten the data first. In Python, pandas.json_normalize turns nested records into flat columns. In JavaScript, map each object to a flat one before converting.'],
      ['How do I open the result in Excel?', 'Download the CSV or copy it into a file ending in .csv, then open it in Excel or Google Sheets.'],
    ],
  },
  '/url-encoder': {
    s: ['url encoder online', 'url encode', 'percent encoding', 'encode url online', 'urlencode'],
    l: ['url encode string online', 'encode special characters in url', 'percent encode text', 'encodeuricomponent online', 'escape url parameters'],
    tasks: ['URL encode online', 'Percent-encode a query value', 'Escape special characters in a URL'],
    faqs: [
      ['What is URL encoding?', 'URL encoding, or percent-encoding, replaces characters that are not safe in a URL with a percent sign and two hex digits, for example a space becomes %20 and & becomes %26.'],
      ['Should I encode a whole URL or just a value?', 'This tool works like JavaScript encodeURIComponent, which also encodes / ? & = and :. Use it for a single parameter value or path segment, not for a complete URL you want to keep working.'],
    ],
  },
  '/url-decoder': {
    d: 'URL decode online: decode percent-encoded text such as %20 and %2F back to readable characters. Free URL decoder and encoding decoder in your browser.',
    s: ['url decode online', 'url decoder', 'url encoding decoder', 'percent decoder', 'decode url'],
    l: ['url decode online free', 'decode percent encoded string', 'decode %20 in url', 'decodeuricomponent online', 'unescape url'],
    tasks: ['URL decode online', 'Decode %20 and other percent codes', 'Read an encoded URL'],
    faqs: [
      ['How do I URL decode a string?', 'Paste the encoded text and the readable version appears, with %20 turned into a space, %2F into / and so on.'],
      ['Does it turn + into a space?', 'No. It decodes percent codes like JavaScript decodeURIComponent, which leaves + as it is. In form-encoded query strings a + usually means a space, so replace it first if needed.'],
    ],
  },
  '/base64-encoder': {
    d: 'Base64 encoder: encode text to Base64 online, including UTF-8 characters. Free Base64 encode tool that runs in your browser, no signup.',
    s: ['base64 encoder', 'base64 encode online', 'encode to base64', 'text to base64', 'base64 converter'],
    l: ['base64 encode string online', 'convert text to base64', 'base64 encoder online free', 'utf-8 to base64', 'encode string base64'],
    tasks: ['Base64 encode online', 'Convert text to Base64', 'Encode UTF-8 text to Base64'],
    faqs: [
      ['How do I encode a string to Base64?', 'Type or paste the text and the Base64 version appears. The tool encodes the text as UTF-8 first, so accented letters, symbols and emoji work correctly.'],
      ['Why does Base64 output end with = signs?', 'Base64 works in groups of three bytes. When the input does not fill the last group, one or two = characters pad it out. They are part of the encoding.'],
    ],
  },
  '/base64-decoder': {
    d: 'Decode Base64 online: paste a Base64 string and get readable text. Free Base64 decoder that handles UTF-8 and runs in your browser, no signup.',
    s: ['base64 decoder online', 'decode base64 online', 'base64 decode', 'online decode base64', 'base64 to text'],
    l: ['base64decoder', 'base64 translator', 'decode base64 string', 'base64 decode utf-8', 'convert base64 to text'],
    tasks: ['Decode Base64 online', 'Base64 to text', 'Read an encoded Base64 string'],
    faqs: [
      ['How do I decode a Base64 string?', 'Paste the Base64 text and the decoded text appears. Spaces and line breaks are ignored, but a data: prefix must be removed first. If the output is empty, the input is not valid Base64.'],
      ['Can it decode URL-safe Base64 (Base64URL)?', 'Base64URL uses - and _ instead of + and /. Replace them with + and / before pasting, because this decoder expects the standard alphabet.'],
    ],
  },
  '/html-decoder': {
    t: 'HTML Decoder Online – Decode HTML Entities & Encoded Text',
    d: 'Free HTML decoder online for named, decimal and hexadecimal entities. Decode encoded text in your browser, then copy or download the result. No signup.',
    s: ['html decoder', 'html decode online', 'decode html', 'online html decoder', 'html entity decode', 'html entities decode', 'html entity decoder', 'htmlentities decode', 'html unescape', 'decode text online'],
    l: ['decode html entities online', 'decode html encoded string online', 'decode named html entities', 'decode decimal html entities', 'decode hexadecimal html entities', 'decode numeric html entities', 'decode text containing html entities'],
    tasks: ['HTML decoder online', 'Decode HTML entities to text', 'Decode named, decimal and hexadecimal entities', 'Unescape HTML character references', 'Decode encoded text from HTML source'],
    faqs: [
      ['What is the difference between an HTML encoder and decoder?', 'An HTML encoder converts characters such as < and & into character references so they can be displayed as text in HTML. An HTML decoder reverses those references and returns the represented characters.'],
      ['Can I decode HTML entities in JavaScript?', 'Yes. In a browser, a detached textarea can parse character references: create a textarea element, assign the encoded string to its innerHTML, then read its value. Keep the decoded result as text unless you have safely sanitized it for an HTML context.'],
    ],
  },
  '/jwt-decoder': {
    s: ['jwt decoder online', 'decode jwt', 'jwt parser', 'jwt token decoder', 'jwt debugger'],
    l: ['decode jwt token online', 'jwt editor online', 'read jwt claims', 'jwt header payload viewer', 'decode bearer token'],
    tasks: ['Decode a JWT token online', 'Read JWT claims', 'Inspect a Bearer token'],
    faqs: [
      ['How do I decode a JWT?', 'Paste the token. It is split at the dots and the header and payload are Base64URL-decoded into readable JSON, so you can see the algorithm and claims such as sub, iss and exp.'],
      ['What do exp, iat and sub mean?', 'exp is when the token expires, iat when it was issued (both in Unix seconds), and sub the subject, usually a user ID. Convert the numbers with the Unix Timestamp tool.'],
    ],
  },
  '/jwt-generator': {
    t: 'JWT Generator Online - Create JWT Tokens (HS256)',
    d: 'Create a JWT online: enter a JSON payload and secret to generate an HS256 token for testing. Free JWT token generator that runs in your browser.',
    s: ['jwt generator', 'create jwt online', 'jwt token generator', 'generate jwt', 'jwt creator'],
    l: ['jwt generator online', 'create jwt token online', 'generate hs256 jwt', 'test jwt token', 'jwt encoder'],
    tasks: ['Create a JWT online', 'JWT token generator', 'Generate an HS256 test token'],
    faqs: [
      ['How do I create a JWT online?', 'Enter the payload as JSON and a secret, then generate. The tool builds the header, signs the token with HS256 and shows the three-part JWT to copy.'],
      ['Can I use a generated token in production?', 'Use it for testing only. Never paste a real production signing secret into any online tool; use a throwaway secret and sign production tokens on your server.'],
    ],
  },
  '/uuid-parser': {
    s: ['uuid parser', 'uuid decoder', 'uuid version checker', 'guid parser', 'uuid inspector'],
    l: ['decode uuid online', 'get timestamp from uuid', 'uuid v7 timestamp', 'check uuid variant', 'uuid v1 timestamp'],
    tasks: ['UUID decoder', 'Get the timestamp from a UUID', 'Identify the UUID version'],
    faqs: [
      ['How do I get the timestamp from a UUID?', 'Paste it into the parser. For versions 1, 6 and 7 it converts the embedded time into a UTC date. Versions 3, 4 and 5 contain no timestamp.'],
    ],
  },
  '/hash-generator': {
    s: ['hash generator online', 'sha256 hash generator', 'checksum generator', 'text to hash', 'online hash tool'],
    l: ['generate hash from text', 'sha-256 hash online', 'hash a string online', 'hash generator no upload', 'sha256 checksum text'],
    tasks: ['Generate a hash online', 'Hash text with SHA-256', 'Create a checksum from text'],
    faqs: [
      ['What is the difference between MD5, SHA-256 and SHA-512?', 'They are different hash algorithms. MD5 gives a 32-character hex digest and is broken for security use; SHA-256 gives 64 characters and SHA-512 gives 128. Use SHA-256 or SHA-512 when security matters.'],
      ['Can a hash be reversed?', 'No. A hash is one-way: the same input always gives the same output, but the input cannot be calculated back from the hash.'],
    ],
  },
  '/sha256-generator': {
    s: ['sha256 generator', 'sha256 hash online', 'sha-256 generator', 'sha256 online', 'sha256 checksum'],
    l: ['generate sha256 hash from string', 'sha256 hash of text', 'sha 256 online', 'online sha256 calculator', 'sha256 hash generator free'],
    tasks: ['SHA256 online', 'Get the SHA-256 hash of a string', 'SHA-256 checksum of text'],
    faqs: [
      ['How long is a SHA-256 hash?', 'A SHA-256 hash is 256 bits, written as 64 hexadecimal characters.'],
      ['Is SHA-256 good for storing passwords?', 'Not on its own. A plain fast hash is easy to brute-force. Store passwords with a slow, salted algorithm such as bcrypt, scrypt or Argon2.'],
    ],
  },
  '/sha512-generator': {
    d: 'SHA512 online: generate a SHA-512 hash from text, as 128 hexadecimal characters. Free SHA-512 generator that runs in your browser, no signup.',
    s: ['sha 512 generator', 'sha512 online', 'sha512 hash generator', 'sha-512 generator', 'sha512 checksum'],
    l: ['sha512 hash online', 'generate sha512 from string', 'sha-512 hash text', 'online sha512 calculator', 'sha 512 hash generator'],
    tasks: ['SHA 512 generator', 'SHA512 online', 'Get the SHA-512 hash of a string'],
    faqs: [
      ['How long is a SHA-512 hash?', 'A SHA-512 hash is 512 bits, written as 128 hexadecimal characters.'],
      ['When should I use SHA-512 instead of SHA-256?', 'Both are considered secure for integrity checks. SHA-512 gives a longer digest and can be faster on 64-bit systems; SHA-256 is more widely used and its shorter output is easier to store.'],
    ],
  },
  '/md5-generator': {
    t: 'MD5 Generator Online - Get the MD5 Hash of a String',
    d: 'Get MD5 online: generate the MD5 hash of any text as a 32-character hex digest. Free MD5 generator that runs in your browser, no signup.',
    s: ['md5 generator', 'get md5 online', 'md5 hash online', 'md5 online', 'md5 checksum'],
    l: ['md5 to string online', 'generate md5 hash from text', 'md5 hash of string', 'online md5 calculator', 'md5 hash generator free'],
    tasks: ['Get MD5 online', 'MD5 hash of a string', 'MD5 checksum of text'],
    faqs: [
      ['Can I convert an MD5 hash back to a string?', 'No. MD5 is a one-way function. Websites that claim to reverse it only look the hash up in tables of known strings, which fails for anything unusual.'],
      ['Is MD5 safe to use?', 'It is fine for non-security checksums such as cache keys or spotting duplicates, but it is broken for security uses like signatures or password storage. Use SHA-256 or better there.'],
    ],
  },
  '/unix-timestamp': {
    t: 'Unix Timestamp Converter - Epoch Time & Date Converter',
    d: 'Convert Unix timestamps to readable dates and dates to Unix time. See current epoch time in seconds and milliseconds. Free online epoch converter.',
    s: ['unix timestamp converter', 'epoch converter', 'epoch time converter', 'unix time converter', 'unix epoch converter', 'unix epoch time converter', 'epoch timestamp converter', 'current epoch time', 'current unix time', 'current timestamp', 'timestamp to date', 'epoch to date', 'epoch to time', 'unix timestamp to date', 'unix time to date', 'date to epoch', 'date to unix timestamp', 'unix timestamp to datetime', 'timestamp calculator', 'epoch calculator', 'unix timestamp calculator', 'posix time converter'],
    l: ['convert epoch time to date', 'convert epoch to time', 'convert unix timestamp to date', 'convert unix time to date', 'convert date to epoch time', 'convert date to unix timestamp', 'convert milliseconds to date', 'convert seconds to date', 'convert epoch milliseconds to date', 'convert epoch seconds to date', 'human date to unix timestamp', 'how to convert unix timestamp', 'how to read unix timestamp', 'what is epoch time', 'what is unix time', 'what is a unix timestamp', 'unix timestamp in seconds vs milliseconds'],
    tasks: ['Epoch converter online', 'Convert epoch time to date', 'Convert Unix time to date', 'Convert date to Unix timestamp', 'Get current epoch time', 'Convert a timestamp from seconds or milliseconds', 'Read a Unix timestamp from a JWT exp claim or API response'],
    faqs: [
      ['How do I convert epoch time to a date?', 'Paste the epoch value into the converter. Select the unit if needed, then read the UTC, local and ISO 8601 date results.'],
      ['How do I convert a date to epoch time?', 'Enter a date and time in a browser-supported format, preferably ISO 8601. The converter shows the matching Unix timestamp in seconds and milliseconds as well as smaller units.'],
      ['Why are Unix timestamps sometimes 10 digits and sometimes 13 digits?', 'A 10-digit value is commonly seconds since the Unix epoch. A 13-digit value is commonly milliseconds. JavaScript Date.now() returns milliseconds, while many Unix commands and APIs use seconds.'],
    ],
  },
  '/timestamp-converter': {
    t: 'Timestamp Converter - Timestamp to Date and Back',
    d: 'Timestamp to date converter: decode Unix timestamps in seconds or milliseconds to UTC, local and ISO time, or convert a date back. Free, in your browser.',
    s: ['timestamp to date', 'timestamp converter', 'timestamp decoder', 'timestamp convert', 'unix time to date'],
    l: ['timestamp to date online', 'timecode to date', 'convert timestamp to datetime', 'epoch to human date', 'date to timestamp converter'],
    tasks: ['Timestamp to date', 'Timestamp decoder', 'Convert a date to a timestamp'],
    faqs: [
      ['How do I convert a timestamp to a date?', 'Paste the number. The tool detects seconds, milliseconds, microseconds or nanoseconds and shows the date in UTC, local time and ISO 8601.'],
      ['What if my timestamp shows the wrong year?', 'The unit is probably wrong. 10 digits are normally seconds and 13 digits milliseconds; choose the unit manually if the automatic guess does not fit.'],
    ],
  },
  '/color-converter': {
    s: ['color converter', 'hex to rgb and rgb to hex', 'color code converter', 'color format converter', 'css color converter'],
    l: ['convert hex to rgb online', 'color converter online', 'rgba to hex', 'hex to rgba', 'css color code converter'],
    tasks: ['Color code converter', 'Convert HEX to RGB and back', 'Convert rgba to 8-digit HEX'],
    faqs: [
      ['Which color formats does it convert?', 'HEX in 3, 4, 6 or 8 digits to rgb() or rgba(), and rgb() or rgba() back to HEX. HSL and named colors are not supported.'],
    ],
  },
  '/hex-to-rgb': {
    s: ['hex to rgb', 'hex to rgb converter', 'hex color to rgb', 'hex to rgba', 'convert hex to rgb online'],
    l: ['hex to rgb online', 'hex code to rgb', '#ffffff to rgb', 'hex to rgb calculator', 'css hex to rgb'],
    tasks: ['Hex to RGB online', 'Hex color code to RGB', 'Convert #RRGGBB to rgb()'],
    faqs: [
      ['How do I convert hex to RGB?', 'Split the code into three pairs and convert each from base 16 to decimal: #3B82F6 becomes 3B = 59, 82 = 130 and F6 = 246, so rgb(59, 130, 246). The tool does this as you type.'],
      ['Does it accept 3-digit hex like #FFF?', 'Yes. A 3-digit code is expanded by doubling each digit, so #FFF means #FFFFFF, which is rgb(255, 255, 255).'],
    ],
  },
  '/query-string-parser': {
    t: 'Query String Parser Online - Parse URL Parameters to JSON',
    d: 'Free online query string parser: paste a URL or query string and get its parameters as readable, decoded JSON. Runs in your browser, no signup.',
    s: ['query string parser', 'url parameter parser', 'parse query string online', 'url query parser', 'get parameters from url'],
    l: ['parser online', 'string parser', 'parse url parameters to json', 'query string to json', 'split url parameters'],
    tasks: ['Query string parser online', 'Parse URL parameters', 'URL query string to JSON'],
    faqs: [
      ['How do I parse a query string?', 'Paste a full URL or just the part after the ?. Everything before the question mark is ignored, and the parameters are shown as decoded JSON key-value pairs.'],
      ['Does it decode %20 and other codes?', 'Yes. Percent-encoded values are decoded, so name=Ada%20Lovelace appears as Ada Lovelace.'],
    ],
  },
  '/query-string-generator': {
    s: ['query string generator', 'url parameter builder', 'json to query string', 'build query string online', 'create url parameters'],
    l: ['json to url parameters', 'generate query string from json', 'url query builder', 'encode query parameters', 'object to query string'],
    tasks: ['JSON to query string', 'Build URL parameters', 'Create an encoded query string'],
    faqs: [
      ['How do I build a query string from JSON?', 'Paste a flat JSON object such as {"q":"dev tools","page":2} and the tool outputs q=dev+tools&page=2, with values encoded for use in a URL.'],
    ],
  },
  '/cron-expression-generator': {
    s: ['cron expression generator', 'cron generator', 'crontab generator', 'cron schedule builder', 'cron job generator'],
    l: ['cron expression generator online', 'write a cron expression', 'cron schedule examples', 'crontab guru alternative', 'every 5 minutes cron'],
    tasks: ['Cron expression generator', 'Build a crontab schedule', 'Cron job schedule examples'],
    faqs: [
      ['How do I generate a cron expression?', 'Click one of the common schedules or type your own five-field expression, then edit it and read the plain-English description to confirm it does what you want.'],
    ],
  },
  '/cron-expression-parser': {
    d: 'Cron expression translator: paste a cron schedule and read it in plain English. Convert cron expressions like */5 * * * * and check them before you deploy.',
    s: ['cron expression parser', 'cron expression translator', 'convert cron expression', 'cron to human readable', 'crontab explainer'],
    l: ['cron expression to plain english', 'explain cron expression', 'cron translator online', 'what does this cron mean', 'cron syntax checker'],
    tasks: ['Cron expression translator', 'Convert a cron expression to text', 'Explain a crontab line'],
    faqs: [
      ['How do I translate a cron expression to plain English?', 'Paste the expression and the description appears, for example 0 9 * * 1-5 reads as at 09:00, Monday through Friday. Invalid expressions show an error.'],
    ],
  },
  '/xml-formatter': {
    d: 'Indent XML online: paste XML and get pretty-printed, neatly indented output. Free XML formatter and beautifier that runs in your browser, no signup.',
    s: ['xml formatter online', 'indent xml online', 'xml beautifier', 'xml pretty print', 'format xml'],
    l: ['xml formatter', 'pretty print xml online', 'beautify xml online', 'format xml file', 'xml indenter'],
    tasks: ['Indent XML online', 'XML beautifier', 'Pretty print XML'],
    faqs: [
      ['How do I indent XML online?', 'Paste the XML into the input and the indented version appears, with each nested element on its own line. If you are not sure the XML is well-formed, check it with the XML Validator first.'],
    ],
  },
  '/xml-validator': {
    d: 'Validate XML online for well-formed syntax errors. Paste XML or upload a file, then inspect parser errors and line details. Free, browser-based XML checker.',
    s: ['online xml validator', 'xml validator', 'validate xml', 'xml validation', 'xml checker online', 'xml syntax checker', 'xml linter', 'xml lint', 'xml file checker', 'xml file validator', 'xml parser online', 'xml well formed checker', 'xml document validator', 'xml validation tool', 'xml syntax validation'],
    l: ['validate xml online', 'validate xml file', 'check xml syntax online', 'check if xml is well formed', 'find xml syntax errors', 'xml error checker', 'xml format checker', 'xml structure checker', 'xml tag checker', 'xml code validator', 'xml markup validator', 'xml data format checker', 'check xml before an api request', 'validate sitemap xml syntax', 'xml namespace syntax check'],
    tasks: ['Validate XML online for syntax errors', 'Check if an XML document is well-formed', 'Validate an XML file in your browser', 'Find mismatched and unclosed XML tags', 'Check XML before importing or sending it to an API'],
    faqs: [
      ['Can I validate an XML file online?', 'Yes. Choose or drop a text or XML file into the input area, then press Process. The file is read in your browser and parsed locally.'],
      ['Does this online XML validator check XSD or DTD schemas?', 'No. It checks XML well-formedness and syntax only. Schema validity is a separate check that compares the document with rules defined by an XSD or DTD.'],
      ['What is the difference between XML well-formedness and XML validity?', 'Well-formed XML follows the XML syntax rules, such as one root element and correctly nested, closed tags. Valid XML is also compliant with a DTD or XML Schema (XSD).'],
      ['Why does an XML parser report an error on a different line?', 'A parser reports where it detected the problem, which can be after the original mistake. For example, an omitted closing tag may only become obvious when the parser reaches the next element.'],
      ['Can I use this XML checker for a sitemap or SOAP response?', 'You can check whether the sitemap or SOAP XML is well-formed. This does not verify sitemap protocol rules, SOAP message rules, or an external schema.'],
      ['Is my XML uploaded to a server?', 'No. The XML text is parsed by your browser. A selected file is read locally with the browser FileReader API; the validator does not send it to a validation server.'],
    ],
  },
  '/yaml-formatter': {
    s: ['yaml formatter online', 'yaml validator', 'format yaml', 'yaml beautifier', 'yaml checker'],
    l: ['yaml formatter', 'yaml lint online', 'indent yaml online', 'check yaml syntax', 'reformat yaml'],
    tasks: ['YAML formatter online', 'Check YAML syntax', 'Reformat a YAML file'],
    faqs: [
      ['How do I format YAML online?', 'Paste the YAML and the cleanly indented version appears. If the YAML is invalid, the parser error is shown with its line and column.'],
      ['Are comments kept when YAML is reformatted?', 'No. The formatter parses the data and writes it back out, so comments are not preserved. Keep a copy if you need them.'],
    ],
  },
  '/text-counter': {
    d: 'Text length checker: count characters, words and lines as you type. Free online text counter that runs in your browser, with no signup.',
    s: ['text counter', 'character counter', 'word counter', 'text length checker', 'count characters online'],
    l: ['text length checker online', 'count words in text', 'character count tool', 'line counter', 'how long is my text'],
    tasks: ['Text length checker', 'Count words and characters', 'Count lines in text'],
    faqs: [
      ['How do I check the length of a text?', 'Type or paste it and the character, word and line counts update immediately.'],
      ['How are characters counted?', 'The count uses JavaScript string length, so some emoji and rare symbols count as two characters even though they look like one.'],
    ],
  },
  '/case-converter': {
    s: ['case converter', 'uppercase converter', 'lowercase converter', 'title case converter', 'text case changer'],
    l: ['convert text to uppercase online', 'change case online', 'text to lowercase', 'capitalize each word', 'online case changer'],
    tasks: ['Convert text to uppercase', 'Convert text to lowercase', 'Capitalize each word'],
    faqs: [
      ['How do I change text to uppercase or lowercase?', 'Paste the text and choose the case you want. UPPERCASE, lowercase and Title Case are available.'],
    ],
  },
  '/text-to-slug': {
    s: ['text to slug', 'title to slug', 'slugify text', 'url slug converter', 'string to slug'],
    l: ['convert title to url slug', 'slugify string online', 'make url friendly text', 'blog title to slug', 'text to url slug online'],
    tasks: ['Slugify text', 'Convert a title to a URL slug', 'Make URL-friendly text'],
    faqs: [
      ['What happens to accented letters?', 'Characters outside a to z and 0 to 9 are treated as separators, so accents are removed rather than transliterated: cafe with an accent becomes caf. Replace accented letters before converting if you want to keep them.'],
    ],
  },
  '/slug-generator': {
    s: ['slug generator', 'url slug generator', 'seo slug generator', 'permalink generator', 'create slug online'],
    l: ['generate url slug from title', 'seo friendly url generator', 'clean url slug', 'blog post slug generator', 'wordpress slug generator'],
    tasks: ['SEO-friendly slug generator', 'Create a clean URL slug', 'Generate a permalink'],
    faqs: [
      ['What is a URL slug?', 'The slug is the readable last part of a URL that identifies a page, for example /how-to-format-json. A good slug is short, lowercase and uses hyphens between words.'],
      ['How do I make a slug from a title?', 'Paste the title. The generator lowercases it, replaces spaces and symbols with single hyphens and trims hyphens from the ends.'],
    ],
  },
  '/regex-tester': {
    s: ['regex tester', 'regex tester online', 'regular expression tester', 'javascript regex tester', 'test regex online'],
    l: ['online regex tester', 'regex checker', 'test regular expression', 'regex match tester', 'regex replace tester'],
    tasks: ['Test a regex online', 'JavaScript regex tester', 'Test regex replace'],
    faqs: [
      ['Which regex flavor does the tester use?', 'It uses the JavaScript RegExp engine of your browser. Patterns that rely on features from other flavors, such as PCRE, Python or .NET, may behave differently.'],
      ['How do I test a regular expression?', 'Enter the pattern, set flags such as g or i, and add sample text. Matches are listed as you type, and you can try a replacement string too.'],
    ],
  },
  '/regex-generator': {
    d: 'Regex generator and pattern maker: write a regular expression, test it live against sample text and copy the /pattern/flags literal. Runs in your browser.',
    s: ['regex generator', 'regex generator online', 'regular expression generator', 'regex pattern maker', 'regex builder'],
    l: ['regex generator from string', 'create regex online', 'build a regex pattern', 'regex maker', 'regex pattern generator'],
    tasks: ['Regex generator online', 'Regex pattern maker', 'Build a regular expression'],
    faqs: [
      ['Can it generate a regex from a sample string?', 'No. It does not infer a pattern from examples. You write the pattern, see matches on your sample text immediately, and copy the finished /pattern/flags literal. Start from a building block such as \\d+ for digits or [a-z]+ for letters.'],
    ],
  },
  '/diff-checker': {
    d: 'Diff checker online: compare two texts or JSON files by line, word or character, and ignore whitespace. Free, runs in your browser.',
    s: ['diff checker', 'text compare', 'compare two texts', 'online diff tool', 'text difference checker'],
    l: ['diff checker online', 'compare two text files online', 'find differences between two texts', 'code diff online', 'line by line comparison'],
    tasks: ['Compare two texts', 'Compare two JSON files', 'Find differences between two files', 'Line-by-line diff'],
    faqs: [
      ['How do I compare two texts?', 'Paste the original on one side and the changed version on the other, choose line, word or character mode, and compare. Added and removed parts are highlighted.'],
      ['Can I ignore whitespace differences?', 'Yes. Turn on the ignore whitespace option and runs of spaces and line breaks are normalised before comparing.'],
    ],
  },
  '/number-base-converter': {
    s: ['number base converter', 'base converter', 'binary decimal hex converter', 'radix converter', 'numeral system converter'],
    l: ['convert between binary and hex', 'binary to hex converter', 'octal converter', 'base 2 to base 16', 'number system converter online'],
    tasks: ['Convert between binary, octal, decimal and hex', 'Binary to hex', 'Base 2 to base 16'],
    faqs: [
      ['Which number bases does it support?', 'Binary (2), octal (8), decimal (10) and hexadecimal (16). Choose the base you are converting from and to.'],
      ['Is there a limit on number size?', 'Very large values can lose precision, because the tool uses standard JavaScript numbers, which are exact only up to 9007199254740991.'],
    ],
  },
  '/binary-to-decimal': {
    s: ['binary to decimal', 'binary to decimal converter', 'binary to number', 'convert binary to decimal', 'binary calculator'],
    l: ['binary to decimal online', 'binary to decimal conversion', 'how to convert binary to decimal', '1011 binary to decimal', 'bin to dec'],
    tasks: ['Binary to decimal online', 'Convert a binary number', 'Bin to dec'],
    faqs: [
      ['How do I convert binary to decimal?', 'Multiply each digit by a power of two, starting from 1 on the right, and add the results. For example 1011 = 8 + 0 + 2 + 1 = 11.'],
    ],
  },
  '/decimal-to-binary': {
    s: ['decimal to binary', 'decimal to binary converter', 'number to binary', 'convert decimal to binary', 'dec to bin'],
    l: ['decimal to binary online', 'how to convert decimal to binary', '13 in binary', 'integer to binary', 'decimal to binary calculator'],
    tasks: ['Decimal to binary online', 'Convert a number to binary', 'Dec to bin'],
    faqs: [
      ['How do I convert decimal to binary?', 'Divide the number by 2 repeatedly and write down the remainders, then read them from last to first. For 13: remainders 1, 0, 1, 1 give 1101.'],
    ],
  },
  '/hex-to-decimal': {
    s: ['hex to decimal', 'hex to decimal converter', 'hexadecimal to decimal', 'convert hex to decimal', 'hex to number'],
    l: ['hex to decimal online', 'hexadecimal to decimal converter', 'how to convert hex to decimal', 'ff hex to decimal', 'hex to dec'],
    tasks: ['Hex to decimal online', 'Hexadecimal to decimal', 'Hex to dec'],
    faqs: [
      ['How do I convert hex to decimal?', 'Multiply each digit by a power of 16 and add the results: FF = 15 x 16 + 15 = 255. In JavaScript use parseInt("FF", 16).'],
    ],
  },
  '/decimal-to-hex': {
    t: 'Decimal to Hex Converter & Calculator | Free Online',
    d: 'Convert decimal to hexadecimal with this free online decimal to hex calculator. Turn base 10 numbers into base 16, with worked examples and a conversion chart.',
    s: [
      'decimal to hexadecimal', 'decimal to hex', 'convert decimal to hexadecimal', 'convert decimal to hex',
      'decimal to hexadecimal converter', 'decimal to hex converter', 'decimal to hexadecimal calculator',
      'decimal to hex calculator', 'hexadecimal calculator', 'hex and decimal converter',
      'decimal and hexadecimal converter', 'decimal convert to hex', 'converter decimal to hexadecimal',
      'conversion decimal to hex', 'conversion decimal to hexadecimal', 'converting decimal to hexadecimal',
      'converting decimals to hexadecimals calculator', 'base 10 to base 16', 'denary to hexadecimal',
      'decimal to hexadecimal conversion chart'
    ],
    l: [
      'how to convert decimal to hexadecimal', 'how to convert decimal to hex',
      'decimal to hexadecimal conversion calculator', 'decimal to hex conversion chart',
      'convert base 10 to base 16', 'what is 255 in hexadecimal', 'decimal number to hex table'
    ],
    tasks: [
      'Decimal to hexadecimal converter online', 'Decimal to hex calculator',
      'Convert decimal numbers from base 10 to base 16', 'Use a decimal to hexadecimal conversion chart',
      'Convert denary numbers to hexadecimal', 'Check common decimal and hexadecimal values'
    ],
    faqs: [
      ['How do I convert decimal to hexadecimal?', 'Divide the whole-number value by 16 repeatedly. Record each remainder, write remainders 10 to 15 as A to F, and read the digits from last to first. For example, 255 becomes FF.'],
      ['What is the difference between decimal and hexadecimal?', 'Decimal is base 10 and uses digits 0 to 9. Hexadecimal is base 16 and uses 0 to 9 plus A to F, where A represents 10 and F represents 15.'],
      ['Is this a decimal to hexadecimal calculator?', 'Yes. Enter a decimal whole number and the result is converted to its hexadecimal representation as you type. The page starts with Decimal (10) as the input base and Hex (16) as the output base.'],
      ['Does it support decimal fractions or very large integers?', 'The current converter uses JavaScript parseInt, so it converts the integer portion and does not preserve digits after a decimal point. Very large values can lose precision because JavaScript numbers have a safe-integer limit.'],
    ],
  },
};
