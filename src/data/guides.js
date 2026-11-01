// Long-form guides. Plain data with no imports, so seo.js, the pages and the prerender script can all share it.
// Each guide: one primary tool (CTA + contextual link), related tools, sections, FAQs.
// Every statement should describe real behaviour of the standard, the language or the tool.

export const GUIDES_UPDATED = '2026-11-01';

export const GUIDES = [
  {
    slug: 'check-if-a-website-is-down',
    title: 'Check If a Website Is Down: Status Codes and Fixes',
    description: 'Find out whether a site is down for everyone or just you. Read HTTP status codes, test with curl, and rule out DNS and network problems.',
    h1: 'How to Check If a Website Is Down',
    lede: 'A page that will not load is either the site, your network, or a typo. Work through these checks in order and you will know which one in a couple of minutes.',
    tool: '/website-status-checker',
    toolName: 'Website Status Checker',
    related: ['/url-encoder', '/query-string-parser', '/timestamp-converter'],
    sections: [
      {
        h: 'Step 1: separate a typo from an outage',
        paras: ['Check the address first. A wrong subdomain, a missing letter or http:// on a site that only serves https:// looks exactly like an outage. Paste the address into the Website Status Checker, which tests it from your own browser and network and shows whether the server answered.'],
      },
      {
        h: 'Step 2: is it down for everyone or only for you?',
        paras: ['A single check only tells you what your connection can reach. To compare, try another network, such as mobile data, or ask a colleague in another location to load the page. If it works elsewhere, the problem is local: your DNS cache, a VPN, a proxy, a firewall or your ISP.'],
        list: [
          'Turn off the VPN or proxy and reload.',
          'Try a different DNS resolver such as 1.1.1.1 or 8.8.8.8.',
          'Flush the local DNS cache (ipconfig /flushdns on Windows, sudo dscacheutil -flushcache on macOS).',
          'Open the page in a private window to rule out extensions and cached redirects.',
        ],
      },
      {
        h: 'Step 3: read the HTTP status code',
        paras: ['If the server answers, the status code says what kind of problem it is.'],
        list: [
          '200 OK: the page loaded. A blank page after this is a front-end problem, not an outage.',
          '301, 302, 307, 308: the address redirects. Follow the redirect target.',
          '401 Unauthorized and 403 Forbidden: the server is up but refuses you, often because of missing credentials or a blocked IP.',
          '404 Not Found: the server is up but that path does not exist.',
          '429 Too Many Requests: you are being rate limited.',
          '500 Internal Server Error: the server is up but the application failed.',
          '502 Bad Gateway and 504 Gateway Timeout: a proxy or load balancer could not get a good answer from the application behind it.',
          '503 Service Unavailable: the server is overloaded or in maintenance.',
        ],
      },
      {
        h: 'Step 4: test from the command line',
        paras: ['curl shows the status code and timing and separates DNS, connection and TLS failures.'],
        code: '# Status code and total time\ncurl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" https://example.com\n\n# Headers only, with connection details\ncurl -I -v https://example.com\n\n# DNS only\ndig +short example.com',
      },
      {
        h: 'Checking from code',
        paras: ['A HEAD request is enough to read the status. In Python the standard library raises an exception for 4xx and 5xx answers, so catch it.'],
        code: 'import urllib.request, urllib.error\n\ndef status(url):\n    req = urllib.request.Request(url, method="HEAD")\n    try:\n        with urllib.request.urlopen(req, timeout=10) as r:\n            return r.status\n    except urllib.error.HTTPError as e:\n        return e.code          # the server answered with 4xx or 5xx\n    except Exception as e:\n        return str(e)          # DNS, TLS or timeout problem',
      },
      {
        h: 'What a browser-based checker can and cannot tell you',
        paras: ['A checker that runs in your browser can only report what your own connection can reach. Many sites do not let other pages read their response, so the tool may confirm that the server answered without showing the exact status code. It is a quick first check, not a worldwide uptime monitor. For continuous monitoring from several regions, use a dedicated uptime service.'],
      },
    ],
    faqs: [
      { q: 'Why does a site load for others but not for me?', a: 'The cause is usually local: a stale DNS cache, a VPN or proxy, a blocked route at your ISP, or a firewall rule. Test from another network to confirm.' },
      { q: 'What does a 503 error mean?', a: 'The server is reachable but cannot handle the request right now, usually because of overload or maintenance. It is normally temporary.' },
      { q: 'What is the difference between a 502 and a 504?', a: 'Both come from a gateway or proxy. A 502 means it received an invalid answer from the application behind it; a 504 means that application did not answer in time.' },
    ],
  },
  {
    slug: 'uuid-v4-vs-v7',
    title: 'UUID v4 vs v7: Differences and How to Read a v7 Timestamp',
    description: 'Compare random UUID v4 with time-ordered UUID v7, see why v7 suits database keys, and decode the timestamp stored inside a v7 UUID.',
    h1: 'UUID v4 vs v7: Which One to Use',
    lede: 'Both are 128-bit identifiers written the same way. The difference is what the bits contain: v4 is almost entirely random, while v7 starts with a timestamp.',
    tool: '/uuid-parser',
    toolName: 'UUID Parser',
    related: ['/uuid-generator', '/uuid-validator', '/timestamp-converter'],
    sections: [
      {
        h: 'How the two versions are built',
        paras: ['A UUID is written as 32 hexadecimal digits in the 8-4-4-4-12 layout. The first digit of the third group is the version, and the first digit of the fourth group is 8, 9, a or b for the standard variant (RFC 9562, which replaces RFC 4122).'],
        list: [
          'Version 4: 122 random bits, with 6 bits fixed for the version and variant. Nothing in it relates to time.',
          'Version 7: a 48-bit Unix timestamp in milliseconds, then the version and variant bits, then random bits.',
        ],
        code: '018f3c5e-7b1a-7cc2-8f2e-9a4b3c2d1e0f\n^^^^^^^^ ^^^^ ^               version digit = 7\n48-bit millisecond timestamp (first 12 hex digits)',
      },
      {
        h: 'Why v7 is friendlier to databases',
        paras: ['Random v4 keys land at random positions in a B-tree index, so inserts touch many pages and can cause page splits and a bigger, more fragmented index. Version 7 values created later sort after earlier ones, so new rows are added near the end of the index, much like an auto-increment key, while staying unique across machines. The sort order is by millisecond; two IDs from the same millisecond are ordered by their random bits unless the generator adds a counter.'],
      },
      {
        h: 'When v4 is still the right choice',
        list: [
          'You do not want the creation time to be visible in the identifier.',
          'The ID is used for lookups only and index locality does not matter.',
          'Your platform has no v7 support and you want zero extra dependencies.',
        ],
        paras: ['Neither version is a secret. Do not use a UUID as a password, an API key or an authorization token.'],
      },
      {
        h: 'Read the timestamp out of a v7 UUID',
        paras: ['Take the first 12 hex digits (ignore the hyphens), read them as a number, and treat it as Unix milliseconds.'],
        code: '// JavaScript\nconst id = "018f3c5e-7b1a-7cc2-8f2e-9a4b3c2d1e0f";\nconst ms = parseInt(id.replace(/-/g, "").slice(0, 12), 16);\nconsole.log(new Date(ms).toISOString());   // 2024-05-03T02:52:55.962Z\n\n# Python\nfrom datetime import datetime, timezone\nh = "018f3c5e-7b1a-7cc2-8f2e-9a4b3c2d1e0f".replace("-", "")\nprint(datetime.fromtimestamp(int(h[:12], 16) / 1000, tz=timezone.utc))',
      },
      {
        h: 'Generating each version',
        code: '// JavaScript (browser and Node): version 4\ncrypto.randomUUID();\n\n// C# (.NET 9 and later)\nGuid.NewGuid();            // version 4\nGuid.CreateVersion7();     // version 7\n\n# Python: version 4\nimport uuid\nuuid.uuid4()',
        paras: ['For version 7 in other languages and databases, check whether your runtime or library version already includes it before adding a dependency. You can also generate v4 and v7 values in the UUID Generator and decode any UUID in the UUID Parser.'],
      },
    ],
    faqs: [
      { q: 'Can I tell when a v4 UUID was created?', a: 'No. A version 4 UUID has no timestamp. Only versions 1, 6 and 7 carry creation time.' },
      { q: 'Are v7 UUIDs guaranteed to be unique?', a: 'In practice yes: the random bits make collisions extremely unlikely, as with v4. Uniqueness is not a guarantee in the mathematical sense for either version.' },
      { q: 'Is UUID the same as GUID?', a: 'They share the same 128-bit format. GUID is the name used in Microsoft environments such as .NET and SQL Server.' },
    ],
  },
  {
    slug: 'rgb-to-hex-conversion',
    title: 'RGB to HEX Conversion: Formula, Examples and CSS Alpha',
    description: 'Convert RGB to HEX by hand with a worked example, handle alpha and shorthand codes, and see code for JavaScript, Python and C#.',
    h1: 'How to Convert RGB to HEX',
    lede: 'A HEX colour code is the same three numbers as an RGB colour, written in base 16. Once you see the pattern, you can convert in your head.',
    tool: '/rgb-to-hex',
    toolName: 'RGB to HEX Converter',
    related: ['/hex-to-rgb', '/color-converter', '/decimal-to-hex'],
    sections: [
      {
        h: 'The conversion in three steps',
        paras: ['Each RGB channel is a whole number from 0 to 255. Each one becomes exactly two hexadecimal digits, and the three pairs are joined after a #.'],
        list: [
          'Divide the channel by 16. The whole part is the first hex digit.',
          'The remainder is the second hex digit.',
          'Digits 10 to 15 are written A to F. Repeat for red, green and blue.',
        ],
        code: 'rgb(59, 130, 246)\n59  = 3 * 16 + 11  ->  3B\n130 = 8 * 16 + 2   ->  82\n246 = 15 * 16 + 6  ->  F6\n\n#3B82F6',
      },
      {
        h: 'Alpha (transparency)',
        paras: ['An 8-digit HEX code adds a fourth pair for alpha. Multiply the alpha value (0 to 1) by 255, round, and convert like any other channel. rgba(59, 130, 246, 0.5) gives 0.5 * 255 = 127.5, which rounds to 128, or 80 in hex, so the code is #3B82F680. Modern CSS also accepts the space-separated form rgb(59 130 246 / 50%).'],
      },
      {
        h: '3-digit shorthand',
        paras: ['A 3-digit code such as #FA0 doubles every digit, so it means #FFAA00. A colour can only be shortened when each pair has two identical digits. #3B82F6 has no shorthand.'],
      },
      {
        h: 'Code for the common languages',
        code: '// JavaScript\nconst toHex = (r, g, b) =>\n  "#" + [r, g, b].map(n => n.toString(16).padStart(2, "0")).join("").toUpperCase();\ntoHex(59, 130, 246);   // "#3B82F6"\n\n# Python\nr, g, b = 59, 130, 246\nprint("#{:02X}{:02X}{:02X}".format(r, g, b))   # #3B82F6\n\n// C#\nint r = 59, g = 130, b = 246;\nstring hex = $"#{r:X2}{g:X2}{b:X2}";            // #3B82F6',
      },
      {
        h: 'Common mistakes',
        list: [
          'Values above 255 or below 0 do not map to two hex digits. Check the range first.',
          'Forgetting the leading zero: 5 must be written 05, not 5.',
          'Mixing percentages and numbers: rgb(100%, 50%, 0%) is not rgb(100, 50, 0).',
          'Pasting a string such as rgb(59, 130, 246) into code that expects three separate numbers.',
        ],
        paras: ['The RGB to HEX Converter accepts rgb(), rgba() and plain r, g, b input, and shows an error for values outside 0 to 255.'],
      },
    ],
    faqs: [
      { q: 'Is HEX case sensitive?', a: 'No. #3b82f6 and #3B82F6 are the same colour. Pick one style and keep it consistent.' },
      { q: 'How do I convert HEX back to RGB?', a: 'Split the code into three pairs and convert each pair from base 16 to decimal: 3B is 59, 82 is 130, F6 is 246.' },
      { q: 'What does an 8-digit HEX code mean?', a: 'The last two digits are the alpha channel, where 00 is fully transparent and FF is fully opaque.' },
    ],
  },
  {
    slug: 'json-to-csharp-system-text-json-newtonsoft',
    title: 'JSON to C#: System.Text.Json vs Newtonsoft Attributes',
    description: 'Turn JSON into C# classes, then choose JsonPropertyName or JsonProperty, fix case sensitivity and pick the right number and nullable types.',
    h1: 'Convert JSON to C# Classes: System.Text.Json vs Newtonsoft',
    lede: 'A generator gives you a working first draft of the classes. The details that bite later are property name matching, number types and nullability.',
    tool: '/json-to-csharp',
    toolName: 'JSON to C# Converter',
    related: ['/json-validator', '/json-formatter', '/json-to-typescript'],
    sections: [
      {
        h: 'Start from a sample object',
        paras: ['Paste one representative JSON object. The generator creates a class for the root and a class for each nested object, and arrays become List<T>.'],
        code: '{\n  "id": 42,\n  "user_name": "ada",\n  "is_active": true,\n  "tags": ["dev", "math"]\n}',
      },
      {
        h: 'Map JSON names to C# names',
        paras: ['JSON keys are often camelCase or snake_case while C# properties are PascalCase. An attribute states the mapping explicitly. The two libraries use different attributes.'],
        code: '// System.Text.Json\nusing System.Text.Json.Serialization;\npublic class User {\n    [JsonPropertyName("id")]        public int Id { get; set; }\n    [JsonPropertyName("user_name")] public string UserName { get; set; }\n}\n\n// Newtonsoft.Json\nusing Newtonsoft.Json;\npublic class User {\n    [JsonProperty("id")]        public int Id { get; set; }\n    [JsonProperty("user_name")] public string UserName { get; set; }\n}',
        paras: ['In the JSON to C# Converter, the Property attributes menu adds either style to every property.'],
      },
      {
        h: 'Case sensitivity: the usual surprise',
        paras: ['System.Text.Json matches property names case-sensitively by default, so "name" will not fill a property called Name unless you opt in. Newtonsoft.Json matches case-insensitively by default.'],
        code: 'var options = new JsonSerializerOptions {\n    PropertyNameCaseInsensitive = true,\n    PropertyNamingPolicy = JsonNamingPolicy.CamelCase\n};\nvar user = JsonSerializer.Deserialize<User>(json, options);',
        list: ['To map snake_case keys without an attribute on every property, set PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower (.NET 8 and later).'],
      },
      {
        h: 'Fix the types a sample cannot reveal',
        list: [
          'Numbers: one sample cannot tell int from long, double or decimal. Use decimal for money, long for large IDs, int for small counts.',
          'Nullable values: a null or missing field needs a nullable type, such as string? or int?.',
          'Dates: ISO 8601 strings such as 2026-11-01T10:00:00Z deserialize into DateTime or DateTimeOffset.',
          'Arrays of mixed types: the generator cannot infer a single type, so define a proper model.',
          'Keys that are C# keywords, such as class or event, need an @ prefix or an attribute.',
        ],
      },
      {
        h: 'Records for immutable models',
        paras: ['For read-only data transfer objects, a positional record is shorter. System.Text.Json can deserialize records through their constructor.'],
        code: 'public record User(int Id, string UserName, bool IsActive, List<string> Tags);',
      },
    ],
    faqs: [
      { q: 'Which library should I pick for a new project?', a: 'System.Text.Json is built into .NET and is the default choice. Use Newtonsoft.Json when you rely on its features or already depend on it.' },
      { q: 'Can I convert a JSON array to a class?', a: 'Paste a single object from the array. The converter expects the root value to be an object, and arrays of objects inside it become List<T>.' },
      { q: 'Why is a property null after deserializing?', a: 'The most common causes are a name mismatch (case sensitivity or snake_case), a missing setter, or a type the serializer cannot convert.' },
    ],
  },
  {
    slug: 'how-to-decode-a-jwt',
    title: 'How to Decode a JWT and Read Its Claims Safely',
    description: 'Split a JSON Web Token, decode the header and payload in JavaScript or Python, read exp and aud, and learn why decoding is not verifying.',
    h1: 'How to Decode a JWT and Read Its Claims',
    lede: 'A JSON Web Token is three Base64URL strings joined by dots. Reading the first two takes no key, but trusting them does.',
    tool: '/jwt-decoder',
    toolName: 'JWT Decoder',
    related: ['/base64-decoder', '/timestamp-converter', '/json-formatter'],
    sections: [
      {
        h: 'The three parts',
        paras: ['A token looks like header.payload.signature. The header and payload are JSON encoded with Base64URL, which is Base64 with - instead of + and _ instead of /, and usually without = padding. The signature is binary data used for verification.'],
        list: [
          'Header: the signing algorithm (alg) and token type (typ), and sometimes a key ID (kid).',
          'Payload: the claims, such as the issuer, subject and expiry.',
          'Signature: proves the first two parts were not changed, if you check it.',
        ],
      },
      {
        h: 'Decode in JavaScript',
        code: 'function decodePart(part) {\n  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");\n  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));\n  return JSON.parse(new TextDecoder().decode(bytes));   // handles UTF-8\n}\nconst [h, p] = token.split(".");\nconsole.log(decodePart(h), decodePart(p));',
      },
      {
        h: 'Decode in Python',
        code: 'import base64, json\n\ndef decode_part(part):\n    padded = part + "=" * (-len(part) % 4)\n    return json.loads(base64.urlsafe_b64decode(padded))\n\nheader, payload, _ = token.split(".")\nprint(decode_part(header), decode_part(payload))',
      },
      {
        h: 'Claims worth reading first',
        list: [
          'exp: expiry time, in seconds since 1 January 1970 UTC. Convert it with a timestamp tool.',
          'iat: when the token was issued. nbf: not valid before this time.',
          'iss: who issued it. aud: who it is meant for. sub: the subject, often a user ID.',
          'jti: a unique token ID, useful for revocation lists.',
        ],
        paras: ['If a request fails with 401, check exp first. A token that expired seconds ago is the most common cause, and clock skew between servers can make it look expired early.'],
      },
      {
        h: 'Decoding is not verifying',
        paras: ['Anyone can decode a token, and anyone can create one with any claims. Only a signature check with the correct key shows it is genuine. Verify on the server with a maintained library, require the algorithm you expect, reject the none algorithm, and check exp, iss and aud. Never make an authorization decision from a payload you only decoded.'],
      },
      {
        h: 'Handle tokens like passwords',
        paras: ['A valid access token works as a credential until it expires. Avoid pasting production tokens into tools you do not control. The JWT Decoder runs in your browser, but if a token has been exposed anywhere, revoke it and issue a new one.'],
      },
    ],
    faqs: [
      { q: 'Can I read a JWT without the secret?', a: 'Yes. The header and payload are only encoded, not encrypted. The secret or public key is needed only to verify the signature.' },
      { q: 'Is a JWT encrypted?', a: 'A standard signed JWT is not. Anything in the payload is readable by whoever holds the token, so do not put secrets in it.' },
      { q: 'Why does my token fail to decode?', a: 'It may be cut off, contain spaces or a Bearer prefix, or use a different format such as an encrypted token with five parts.' },
    ],
  },
  {
    slug: 'cron-expression-examples',
    title: 'Cron Expression Examples and How to Read Them',
    description: 'Read the five cron fields, copy common schedules such as every 5 minutes or weekdays at 9:00, and avoid time zone and day-of-week traps.',
    h1: 'Cron Expression Examples and How to Read Them',
    lede: 'A standard cron expression has five fields. Learn what each one means and you can read any schedule at a glance.',
    tool: '/cron-expression-parser',
    toolName: 'Cron Expression Parser',
    related: ['/cron-expression-generator', '/timestamp-converter', '/unix-timestamp'],
    sections: [
      {
        h: 'The five fields',
        code: '*  *  *  *  *\n|  |  |  |  |\n|  |  |  |  +-- day of week   (0-6, Sunday is 0; many systems also accept 7)\n|  |  |  +----- month         (1-12)\n|  |  +-------- day of month  (1-31)\n|  +----------- hour          (0-23)\n+-------------- minute        (0-59)',
        paras: ['A job runs when the current time matches every field. A star means every value.'],
      },
      {
        h: 'Special characters',
        list: [
          '* any value.',
          ', a list: 1,15 means the 1st and the 15th.',
          '- a range: 1-5 means Monday to Friday in the day-of-week field.',
          '/ a step: */5 in the minute field means every 5 minutes.',
        ],
      },
      {
        h: 'Common schedules',
        code: '* * * * *       every minute\n*/5 * * * *     every 5 minutes\n*/15 * * * *    every 15 minutes\n0 * * * *       at the start of every hour\n0 0 * * *       every day at midnight\n30 2 * * *      every day at 02:30\n0 9 * * 1-5     at 09:00 on weekdays\n30 8 * * 1      at 08:30 every Monday\n0 0 * * 0       every Sunday at midnight\n0 0 1 * *       at midnight on the 1st of each month\n0 0 1 1 *       at midnight on 1 January',
        paras: ['Paste any of these into the Cron Expression Parser to see the plain-English description, or start from the presets in the Cron Expression Generator.'],
      },
      {
        h: 'Traps that cause missed or extra runs',
        list: [
          'Day of month and day of week together: in standard cron, if both fields are restricted, the job runs when either one matches, not both.',
          'Time zone: cron uses the time zone of the machine or scheduler. GitHub Actions scheduled workflows use UTC. Kubernetes CronJobs support a timeZone field in recent versions.',
          'Overlapping runs: if a job takes longer than its interval, runs can stack up. Add a lock or a concurrency policy.',
          'Daylight saving time: a job at 02:30 can be skipped or run twice on the days clocks change. Schedule in UTC when exact timing matters.',
          'Different dialects: Quartz and Spring use six or seven fields with seconds, so an expression is not portable between them and standard five-field cron.',
        ],
      },
    ],
    faqs: [
      { q: 'What does */5 * * * * mean?', a: 'It runs every 5 minutes: the */5 in the minute field means every fifth minute, and the stars mean every hour, day, month and weekday.' },
      { q: 'How do I run a cron job every 10 seconds?', a: 'Standard cron cannot. Its smallest unit is a minute. Use a scheduler that supports seconds, a loop with sleep, or a systemd timer.' },
      { q: 'Does Sunday equal 0 or 7?', a: 'Most cron implementations accept both, but 0 is the safe choice. Check your scheduler documentation.' },
    ],
  },
  {
    slug: 'decimal-to-hex-conversion',
    title: 'Decimal to Hex: Step-by-Step Method With Code',
    description: 'Convert decimal to hexadecimal by repeated division, use the 0 to 15 table, and do it in JavaScript, Python and C# including large numbers.',
    h1: 'How to Convert Decimal to Hexadecimal',
    lede: 'Hexadecimal is base 16. Divide by 16 repeatedly and read the remainders backwards.',
    tool: '/decimal-to-hex',
    toolName: 'Decimal to Hex Converter',
    related: ['/hex-to-decimal', '/number-base-converter', '/rgb-to-hex'],
    sections: [
      {
        h: 'The digits',
        paras: ['Base 16 needs sixteen symbols, so after 9 it continues with the letters A to F.'],
        code: 'Decimal:  0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15\nHex:      0 1 2 3 4 5 6 7 8 9 A  B  C  D  E  F',
      },
      {
        h: 'Method: repeated division',
        paras: ['Divide the number by 16, write down the remainder, then divide the quotient by 16 again. Stop when the quotient is 0. The hex number is the remainders read from last to first.'],
        code: '3054 / 16 = 190 remainder 14  (E)\n 190 / 16 =  11 remainder 14  (E)\n  11 / 16 =   0 remainder 11  (B)\n\nread backwards: BEE   ->   3054 = 0xBEE\n\n255 / 16 = 15 remainder 15 (F), 15 / 16 = 0 remainder 15 (F)  ->  FF',
      },
      {
        h: 'Check it by converting back',
        paras: ['Multiply each digit by a power of 16 and add: BEE = 11 * 256 + 14 * 16 + 14 = 2816 + 224 + 14 = 3054.'],
      },
      {
        h: 'Code',
        code: '// JavaScript\n(255).toString(16);              // "ff"\nparseInt("ff", 16);              // 255\nBigInt("18446744073709551615").toString(16);   // "ffffffffffffffff"\n\n# Python\nhex(255)                         # "0xff"\nint("ff", 16)                    # 255\n\n// C#\n255.ToString("X");               // "FF"\nConvert.ToInt32("FF", 16);       // 255',
        paras: ['JavaScript numbers lose precision above 2^53 - 1 (9007199254740991), so use BigInt for large values.'],
      },
      {
        h: 'Negative numbers and prefixes',
        list: [
          'Hex has no sign of its own. Negative integers are shown in two\'s complement for a fixed width: -1 as a 32-bit value is FFFFFFFF.',
          'Code usually writes hex with a prefix: 0xFF in C, C#, Java and JavaScript, #FF in CSS colours.',
          'Pad to a fixed width when you need it, for example 0A rather than A for one byte.',
        ],
        paras: ['Use the Decimal to Hex Converter for quick checks, or the Number Base Converter to see binary, octal, decimal and hex together.'],
      },
    ],
    faqs: [
      { q: 'What is 255 in hex?', a: 'FF. It is 15 * 16 + 15, and it is the largest value of one byte.' },
      { q: 'Why do programmers use hex?', a: 'One hex digit is exactly four bits, so a byte is always two digits. That makes memory values, colours and hashes compact and easy to read.' },
      { q: 'How do I convert hex to decimal?', a: 'Multiply each digit by a power of 16 and add the results, or use parseInt(value, 16) in JavaScript.' },
    ],
  },
  {
    slug: 'fix-json-parse-errors',
    title: 'Fix JSON Parse Errors: 10 Common Causes',
    description: 'Find why JSON.parse fails: trailing commas, single quotes, comments, NaN, bad escapes and a BOM, with fixes and code to locate the error.',
    h1: 'How to Fix JSON Parse Errors',
    lede: 'JSON is stricter than JavaScript object syntax. Almost every parse error comes from one of a short list of mistakes.',
    tool: '/json-validator',
    toolName: 'JSON Validator',
    related: ['/json-formatter', '/json-minifier', '/json-to-csharp'],
    sections: [
      {
        h: 'The ten usual causes',
        list: [
          'Trailing comma after the last item: {"a": 1,}. Remove the comma.',
          'Single quotes: {\'a\': 1}. JSON requires double quotes for keys and strings.',
          'Unquoted keys: {a: 1}. Every key must be a double-quoted string.',
          'Comments (// or /* */). JSON has no comment syntax. Strip them, or use a format that allows comments for config files.',
          'Values that do not exist in JSON: undefined, NaN and Infinity. Use null or a string.',
          'Unescaped characters inside strings: a raw line break, a tab or a double quote. Write them as \\n, \\t and \\".',
          'A byte order mark (BOM) at the start of a file, which looks like invisible text before the opening brace.',
          'Numbers with leading zeros or a leading plus, such as 007 or +5, and hexadecimal literals such as 0xFF.',
          'Several JSON documents in one file, as in logs with one object per line. Parse each line separately.',
          'A truncated response, where the closing bracket is missing because the download or copy was cut short.',
        ],
      },
      {
        h: 'Find the exact position',
        paras: ['Error messages differ between browsers and runtimes, but most point to a position or a line and column. Look at the character just before the reported position as well, because the real mistake is often the comma or quote that came earlier.'],
        code: '// JavaScript\ntry {\n  JSON.parse(text);\n} catch (e) {\n  console.error(e.message);   // wording differs between browsers\n}\n\n# Python reports line and column\nimport json\ntry:\n    json.loads(text)\nexcept json.JSONDecodeError as e:\n    print(e.msg, "line", e.lineno, "column", e.colno)',
      },
      {
        h: 'Check it quickly from the terminal',
        code: '# Python\'s built-in tool: exits with an error and a position if invalid\npython -m json.tool response.json\n\n# jq prints the parse error\njq . response.json',
        paras: ['Paste the text into the JSON Validator to see the parser error, then format it with the JSON Formatter so the structure is easy to read.'],
      },
      {
        h: 'Prevent it at the source',
        list: [
          'Produce JSON with a serializer, not by joining strings by hand.',
          'Set the Content-Type header to application/json and check the response status before parsing.',
          'Read the body as text and log it when a parse fails, so you can see what actually arrived.',
        ],
      },
    ],
    faqs: [
      { q: 'Why does JSON.parse fail on a JavaScript object literal?', a: 'Object literals allow unquoted keys, single quotes and trailing commas. JSON allows none of them.' },
      { q: 'Can JSON contain comments?', a: 'No. Some config tools accept comments in their own variants, but standard JSON parsers, including JSON.parse, reject them.' },
      { q: 'Is a plain string or number valid JSON?', a: 'Yes. Under the current standard a JSON text can be any value, not only an object or array.' },
    ],
  },
];

export const GUIDE_ROUTES = GUIDES.map((g) => `/guides/${g.slug}`);
export const getGuide = (path) => GUIDES.find((g) => `/guides/${g.slug}` === path) || null;
export const guidesForTool = (toolPath) => GUIDES.filter((g) => g.tool === toolPath || g.related.includes(toolPath));
