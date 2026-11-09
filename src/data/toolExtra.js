// Extra on-page content (sections + FAQs) for tools that previously only had the short generated copy.
// Pure data, merged into getToolContent() in toolContent.js. Rules: describe only what the tool in
// src/pages/tools/ really does, use real input/output pairs, state limits plainly, no keyword lists.
// Section shape matches toolContent.js EXTRA: { h, paras?, list?, code?, links?, linksLabel? }.

const q = (question, answer) => ({ q: question, a: answer });
const SAMPLE = '{"id":1,"name":"Ada","active":true,"address":{"city":"London"},"tags":["math"]}';

// Shared by the JSON-to-code pages. `code` is the exact output the tool produces for SAMPLE.
const jsonToCode = (label, kind, mapping, code, extraList, links, faqs) => ({
  sections: [
    {
      h: `How JSON maps to ${label} types`,
      paras: [`The tool reads the top-level keys of a JSON object and writes one ${kind} per key. Types come from the sample values you paste:`],
      list: mapping,
    },
    {
      h: `JSON to ${label} example`,
      paras: ['Input:'],
      code: `${SAMPLE}\n\n// ${label} output\n${code}`,
    },
    {
      h: `What to review before you use the ${label} output`,
      list: [
        'Paste a JSON object, not a bare array. The tool walks the top-level keys, so an array root produces meaningless index names.',
        'Nested objects and arrays are not expanded into their own types. In the example, address and tags both fall back to a generic type, so write those types by hand.',
        'One sample cannot show which fields are optional or which numbers are integers. Numbers are always mapped to a floating-point type.',
        ...extraList,
      ],
      links,
      linksLabel: 'Related',
    },
  ],
  faqs,
});

export const EXTRA_MORE = {
  // ------------------------------------------------------------ JSON to code
  '/json-to-typescript': jsonToCode(
    'TypeScript', 'interface member',
    ['number, string and boolean values become number, string and boolean.', 'null, arrays and nested objects become any.', 'Keys are kept exactly as written, with no camelCase conversion.'],
    'export interface Root {\n    id: number;\n    name: string;\n    active: boolean;\n    address: any;\n    tags: any;\n}',
    ['The interface is always named Root. Rename it and replace any with real types, for example string[] for tags.'],
    [['JSON Validator', '/json-validator'], ['JSON to C#', '/json-to-csharp'], ['JSON to Python', '/json-to-python'], ['JSON Formatter', '/json-formatter']],
    [q('Can I use the interface straight from an API response?', 'Use it as a first draft. Replace the any fields, mark optional fields with ? and check the names against the API documentation.')],
  ),
  '/json-to-java': jsonToCode(
    'Java', 'private field with a getter and setter',
    ['number becomes Double, boolean becomes Boolean and string becomes String.', 'null, arrays and nested objects become Object.', 'Getter and setter names capitalize the first letter of the key (key id gives getId and setId).'],
    'public class Root {\n    private Double id;\n    public Double getId() { return id; }\n    public void setId(Double id) { this.id = id; }\n    private String name;\n    public String getName() { return name; }\n    public void setName(String name) { this.name = name; }\n    // ...the same pattern for active (Boolean), address (Object) and tags (Object)\n}',
    ['Keys that are not valid Java identifiers, such as first-name, are written as-is and will not compile. Rename them.', 'The tool does not add Jackson or Gson annotations or package and import lines.'],
    [['JSON to Kotlin', '/json-to-kotlin'], ['JSON to C#', '/json-to-csharp'], ['JSON Validator', '/json-validator'], ['JSON Formatter', '/json-formatter']],
    [q('Why are numbers Double instead of Integer?', 'A single JSON number does not say whether it is an integer, so the tool picks Double. Change it to Integer or Long if your data is whole numbers.')],
  ),
  '/json-to-python': jsonToCode(
    'Python', 'dataclass field',
    ['number becomes float, boolean becomes bool and string becomes str.', 'null, arrays and nested objects become Any.', 'The output includes the dataclass and typing imports. An empty object produces a class with pass.'],
    'from typing import Any\nfrom dataclasses import dataclass\n\n@dataclass\nclass Root:\n    id: float\n    name: str\n    active: bool\n    address: Any\n    tags: Any',
    ['Keys are used as field names unchanged. A key such as first-name or class is not a valid Python field name and needs renaming.', 'The dataclass does not parse JSON by itself. Load the JSON with json.loads and pass the values in.'],
    [['JSON to TypeScript', '/json-to-typescript'], ['JSON to Go', '/json-to-go'], ['YAML to JSON', '/yaml-to-json'], ['JSON Validator', '/json-validator']],
    [q('Does this generate Pydantic models?', 'No. It generates a standard-library dataclass with type hints. You can adapt the fields to Pydantic yourself.')],
  ),
  '/json-to-go': jsonToCode(
    'Go', 'struct field',
    ['number becomes float64, boolean becomes bool and string becomes string.', 'null, arrays and nested objects become interface{}.', 'Field names are capitalized so they are exported, and each field gets a json tag with the original key.'],
    'type Root struct {\n    Id float64 `json:"id"`\n    Name string `json:"name"`\n    Active bool `json:"active"`\n    Address interface{} `json:"address"`\n    Tags interface{} `json:"tags"`\n}',
    ['The json tags let encoding/json match keys correctly even after capitalization. Run gofmt on the result to align the fields.', 'Replace interface{} with real struct or slice types for nested data.'],
    [['JSON to Java', '/json-to-java'], ['JSON to TypeScript', '/json-to-typescript'], ['JSON Formatter', '/json-formatter'], ['JSON Validator', '/json-validator']],
    [q('Why is every number a float64?', 'encoding/json decodes JSON numbers into float64 by default and a sample cannot show whether a value is a whole number. Change it to int where appropriate.')],
  ),
  '/json-to-php': jsonToCode(
    'PHP', 'public property',
    ['Every key becomes a public property named after the key, for example public $id;.', 'No types are written, so number, string, boolean, array and nested object values are all untyped.'],
    'class Root {\n    public $id;\n    public $name;\n    public $active;\n    public $address;\n    public $tags;\n}',
    ['Add property types and a constructor yourself if your PHP version and coding style call for them.'],
    [['JSON to Java', '/json-to-java'], ['JSON to Python', '/json-to-python'], ['JSON to CSV', '/json-to-csv'], ['JSON Validator', '/json-validator']],
    [q('Does it generate typed properties or getters?', 'No. The output is a plain class with untyped public properties, which you can extend by hand.')],
  ),
  '/json-to-kotlin': jsonToCode(
    'Kotlin', 'constructor parameter',
    ['number becomes Double, boolean becomes Boolean and string becomes String.', 'null, arrays and nested objects become Any.', 'Every parameter is a nullable val, for example val id: Double?.'],
    'data class Root(\n    val id: Double?\n    val name: String?\n    val active: Boolean?\n    val address: Any?\n    val tags: Any?\n)',
    ['The tool writes one parameter per line without commas between them. Add a comma after each parameter except the last before you compile.', 'Remove the ? from parameters that are always present, and add a serialization annotation if your library needs one.'],
    [['JSON to Java', '/json-to-java'], ['JSON to C#', '/json-to-csharp'], ['JSON to TypeScript', '/json-to-typescript'], ['JSON Formatter', '/json-formatter']],
    [q('Why does the generated Kotlin not compile?', 'The parameter lines are printed without commas. Add a comma at the end of every parameter line except the last one.')],
  ),

  // --------------------------------------------------- YAML / CSV / JSON data
  '/yaml-to-json': {
    sections: [
      {
        h: 'YAML to JSON example',
        paras: ['The tool parses the YAML with js-yaml and prints the result as JSON with 2-space indentation.'],
        code: 'name: api\nports:\n  - 80\n  - 443\nenabled: true\n\n// JSON output\n{\n  "name": "api",\n  "ports": [\n    80,\n    443\n  ],\n  "enabled": true\n}',
      },
      {
        h: 'Common YAML errors',
        list: ['Tabs used for indentation. YAML needs spaces.', 'Inconsistent indentation inside a list or mapping.', 'A colon in an unquoted value, such as a time or URL, that should be quoted.', 'Comments disappear in the output, because JSON has no comment syntax.'],
        links: [['YAML Formatter', '/yaml-formatter'], ['JSON Validator', '/json-validator'], ['JSON Formatter', '/json-formatter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Can I convert Kubernetes or Docker Compose YAML?', 'Yes, if it is a single YAML document. The tool loads one document; a file with several documents separated by --- is not handled.')],
  },
  '/csv-to-json': {
    sections: [
      {
        h: 'CSV to JSON example',
        paras: ['The first line is used as the keys. Each later line becomes one object, and all values come out as strings.'],
        code: 'id,name,city\n1,Ada,London\n2,Linus,Helsinki\n\n// JSON output\n[\n  { "id": "1", "name": "Ada", "city": "London" },\n  { "id": "2", "name": "Linus", "city": "Helsinki" }\n]',
      },
      {
        h: 'Limits of this CSV to JSON converter',
        list: ['Lines are split on every comma, so a quoted value that contains a comma is split in two.', 'Quotes are not removed and multi-line quoted fields are not supported.', 'Numbers and booleans are not detected, so 1 stays the text "1".', 'Empty lines are skipped.'],
        links: [['JSON to CSV', '/json-to-csv'], ['JSON Formatter', '/json-formatter'], ['YAML to JSON', '/yaml-to-json']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Can it use a semicolon or tab delimiter?', 'No. The delimiter is always a comma.')],
  },
  '/json-to-csv': {
    sections: [
      {
        h: 'JSON to CSV example',
        paras: ['Paste an array of objects. The keys of the first object become the header row.'],
        code: '[{"id":1,"name":"Ada"},{"id":2,"name":"Linus"}]\n\n// CSV output\nid,name\n1,Ada\n2,Linus',
      },
      {
        h: 'What to know before exporting to CSV',
        list: ['The input must be a non-empty array. A single object shows the error "Need an array of objects".', 'Only the keys of the first object are used, so keys that appear only in later objects are dropped.', 'Values are joined with commas without quoting or escaping, so a value that contains a comma will shift the columns.', 'Nested objects are written as [object Object].'],
        links: [['CSV to JSON', '/csv-to-json'], ['JSON Validator', '/json-validator'], ['JSON Formatter', '/json-formatter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Can it flatten nested JSON?', 'No. Nested values are not flattened. Flatten the data first or convert only the top-level fields.')],
  },
  '/yaml-formatter': {
    sections: [
      {
        h: 'YAML formatter example',
        paras: ['The tool parses your YAML and prints it again with consistent 2-space indentation.'],
        code: 'name:   api\nports: [80,   443]\n\n// formatted output\nname: api\nports:\n  - 80\n  - 443',
      },
      {
        h: 'What the YAML formatter changes',
        list: ['Comments are removed, because the YAML is parsed to data and written back.', 'Quoting and flow style (inline lists) may change to the dumper\'s defaults.', 'If the YAML is invalid, you see the parser error instead of output, which also makes this a quick YAML syntax check.'],
        links: [['YAML to JSON', '/yaml-to-json'], ['XML Formatter', '/xml-formatter'], ['Diff Checker', '/diff-checker']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Will it keep my comments?', 'No. Comments are not part of the parsed data, so they are dropped. Format a copy if you need to keep the original comments.')],
  },
  '/xml-formatter': {
    sections: [
      {
        "h": "Pretty print XML in code and the terminal",
        "code": "# xmllint (terminal)\nxmllint --format input.xml\n# Python\nimport xml.dom.minidom\nxml.dom.minidom.parseString(text).toprettyxml()\n// C#\nSystem.Xml.Linq.XDocument.Parse(text).ToString()",
        "links": [
          [
            "XML Validator",
            "/xml-validator"
          ],
          [
            "YAML Formatter",
            "/yaml-formatter"
          ],
          [
            "Diff Checker",
            "/diff-checker"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'XML formatter example',
        code: '<root><user id="1"><name>Ada</name></user></root>\n\n// formatted output\n<root>\n    <user id="1">\n        <name>Ada</name>\n    </user>\n</root>',
      },
      {
        h: 'When to format XML',
        list: ['Reading SOAP responses, sitemaps or RSS feeds that arrive as one line.', 'Making an XML config diff-friendly before review.', 'Spotting a missing closing tag, since malformed XML fails to format.'],
        links: [['XML Validator', '/xml-validator'], ['YAML Formatter', '/yaml-formatter'], ['Diff Checker', '/diff-checker']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it validate against a schema?', 'No. It formats the XML only. For a well-formedness check use the XML Validator, which also does not check XSD schemas.')],
  },
  '/xml-validator': {
    sections: [
      {
        "h": "Well-formed versus valid XML",
        "paras": [
          "A well-formed document follows the XML syntax rules. A valid document also matches a schema (XSD) or DTD. This page checks well-formedness only; it does not validate against a schema."
        ],
        "list": [
          "There is exactly one root element.",
          "Every start tag has a matching end tag, nested correctly.",
          "Tag and attribute names are case-sensitive.",
          "Attribute values are quoted.",
          "The characters & and < are escaped as &amp; and &lt; in text."
        ],
        "links": [
          [
            "XML Formatter",
            "/xml-formatter"
          ],
          [
            "JSON Validator",
            "/json-validator"
          ],
          [
            "YAML Formatter",
            "/yaml-formatter"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'What XML is and why the format matters',
        paras: [
          'XML (Extensible Markup Language) is a markup language for storing and sending structured data. An XML document is human readable text, which is why it is still common for data exchange between systems, in sitemaps, RSS feeds, SOAP messages and configuration files.',
          'Parsers are strict about the format. One missing closing tag makes the whole XML data unusable, so checking the document first saves a failed import or API call. This XML format checker tells you whether the document is well-formed. It does not compare the document with a document type definition (DTD) or an XML Schema.',
        ],
      },
      {
        h: 'What counts as valid XML here',
        paras: ['The tool uses your browser\'s XML parser and reports a parser error if the document is not well-formed. That covers syntax, not meaning.'],
        list: ['Every opening tag has a matching closing tag, in the right order.', 'There is exactly one root element.', 'Attribute values are quoted, and & is written as &amp;.'],
      },
      {
        h: 'XML validator example',
        code: '<root><item>one</root>\n\n// Result: an error from the XML parser (wording depends on your browser)\n\n<root><item>one</item></root>\n\n// Result: Valid XML!',
        links: [['XML Formatter', '/xml-formatter'], ['HTML Encoder', '/html-encoder'], ['JSON Validator', '/json-validator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it check a DTD or XSD schema?', 'No. It only checks that the XML is well-formed.')],
  },

  // -------------------------------------------------------- Encoders / URL
  '/url-encoder': {
    sections: [
      {
        h: 'URL encoding example',
        paras: ['The tool applies encodeURIComponent, which is meant for a single value inside a URL, such as one query parameter.'],
        code: 'name=Ada Lovelace&city=Zürich/UK\n\n// encoded\nname%3DAda%20Lovelace%26city%3DZ%C3%BCrich%2FUK',
      },
      {
        h: 'What gets percent-encoded',
        list: ['Spaces become %20, not +.', 'Reserved characters such as & = ? / # : are encoded, so do not paste a whole URL if you want it left intact.', 'Letters, digits and - _ . ! ~ * \' ( ) are left alone.', 'Non-ASCII characters are encoded as UTF-8 bytes.'],
        links: [['URL Decoder', '/url-decoder'], ['Query String Generator', '/query-string-generator'], ['Base64 Encoder', '/base64-encoder']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why is my whole URL unreadable after encoding?', 'The tool encodes every reserved character, including : and /. Encode only the parameter values, then put them into the URL.')],
  },
  '/url-decoder': {
    sections: [
      {
        h: 'URL decoding example',
        code: 'caf%C3%A9%20au%20lait\n\n// decoded\ncafé au lait',
      },
      {
        h: 'Why URL decoding fails',
        list: ['A stray % that is not followed by two hex digits is malformed, and the output stays empty.', 'A plus sign is not turned into a space. If a form-encoded value uses +, replace it with a space first.', 'Text that was encoded twice needs to be decoded twice.'],
        links: [['URL Encoder', '/url-encoder'], ['Query String Parser', '/query-string-parser'], ['Base64 Decoder', '/base64-decoder']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it decode + as a space?', 'No. It uses decodeURIComponent, which leaves + unchanged. Replace + with a space yourself for form-encoded data.')],
  },
  '/html-encoder': {
    sections: [
      {
        "h": "Encode in code, and why it matters for security",
        "paras": [
          "Escaping user input before placing it in a page is a core defence against cross-site scripting. Prefer your framework escaping or textContent over building HTML strings by hand."
        ],
        "code": "// JavaScript\nel.textContent = userInput;   // safe, no manual escaping\n// C#\nSystem.Net.WebUtility.HtmlEncode(text)\n# Python\nimport html; html.escape(text)"
      },
      {
        "h": "HTML entity reference",
        "paras": [
          "These five characters are the ones that matter when you put text into HTML."
        ],
        "code": "&   ->  &amp;\n<   ->  &lt;\n>   ->  &gt;\n\"   ->  &quot;\n'   ->  &#39;",
        "links": [
          [
            "HTML Decoder",
            "/html-decoder"
          ],
          [
            "URL Encoder",
            "/url-encoder"
          ],
          [
            "Base64 Encoder",
            "/base64-encoder"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'HTML encoding example',
        code: '<p class="note">Fish & chips</p>\n\n// encoded\n&lt;p class="note"&gt;Fish &amp; chips&lt;/p&gt;',
      },
      {
        h: 'What the HTML encoder escapes',
        list: ['Only three characters are replaced: &, < and >.', 'Double and single quotes are left as they are, so do not rely on this output inside an HTML attribute value.', 'For untrusted data in a real page, use your framework\'s escaping instead of pasting output from a tool.'],
        links: [['HTML Decoder', '/html-decoder'], ['URL Encoder', '/url-encoder'], ['XML Formatter', '/xml-formatter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it escape quotes?', 'No. Only &, < and > are escaped.')],
  },
  '/html-decoder': {
    sections: [
      {
        "h": "Decode HTML entities in code",
        "code": "# Python\nimport html; html.unescape(text)\n// C#\nSystem.Net.WebUtility.HtmlDecode(text)\n// JavaScript (browser)\nnew DOMParser().parseFromString(text, 'text/html').documentElement.textContent"
      },
      {
        "h": "Named and numeric entities",
        "paras": [
          "An entity can be written by name, by decimal number or by hex number. All three below mean the same character."
        ],
        "code": "&copy;   &#169;   &#xA9;   ->  (c) symbol\n&amp;    &#38;    &#x26;   ->  &\n&nbsp;   &#160;            ->  non-breaking space",
        "links": [
          [
            "HTML Encoder",
            "/html-encoder"
          ],
          [
            "URL Decoder",
            "/url-decoder"
          ],
          [
            "Base64 Decoder",
            "/base64-decoder"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'When you need to decode encoded text',
        paras: [
          'Entities appear when text has been escaped so it can sit safely inside HTML documents. You meet them in page source, scraped content, RSS and API responses, CMS exports and database fields, where a quote shows up as &quot; or an apostrophe as &#39;.',
          'HTML entities are not the same thing as percent-encoding. A value like %20 or %3D comes from a URL encoder, so use the URL Decoder for that. Going the other way, the HTML Encoder escapes characters and the URL Encoder percent-encodes them.',
        ],
        links: [['URL Decoder', '/url-decoder'], ['URL Encoder', '/url-encoder'], ['HTML Encoder', '/html-encoder']],
        linksLabel: 'Related',
      },
      {
        h: 'HTML decoding example',
        code: '&lt;p&gt;Fish &amp; chips&lt;/p&gt; &copy; 2026\n\n// decoded\n<p>Fish & chips</p> © 2026',
      },
      {
        h: 'Which entities are decoded',
        list: ['Named entities such as &amp;, &lt;, &gt;, &quot; and &copy;.', 'Numeric entities such as &#169; and &#x1F600;.', 'The browser\'s own HTML parser does the decoding, so the result matches what a browser would show.'],
        links: [['HTML Encoder', '/html-encoder'], ['URL Decoder', '/url-decoder'], ['Diff Checker', '/diff-checker']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Can decoding run scripts in my text?', 'The tool decodes into a textarea element, which treats the content as text, so tags in your input are not run.')],
  },

  // ---------------------------------------------------------------- UUID/JWT
  '/uuid-validator': {
    sections: [
      {
        h: 'What the UUID validator accepts',
        list: ['32 hex digits in the 8-4-4-4-12 layout, upper or lower case.', 'A version digit from 1 to 8 at the start of the third group.', 'A variant digit of 8, 9, a or b at the start of the fourth group.', 'Version 6, 7 and 8 UUIDs are accepted, and the all-zero nil UUID and all-ones max UUID are recognised as special values.'],
      },
      {
        h: 'UUID validation examples',
        code: '123e4567-e89b-12d3-a456-426614174000  ->  Valid UUID (version 1)\n123e4567-e89b-92d3-a456-426614174000  ->  Invalid UUID (version digit 9)\n123e4567e89b12d3a456426614174000      ->  Invalid UUID (no hyphens)',
        links: [['UUID Parser', '/uuid-parser'], ['UUID Generator', '/uuid-generator'], ['Regex Tester', '/regex-tester']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Is a UUID v7 valid here?', 'Yes. Versions 1 to 8 are accepted, so a version 7 UUID is reported as valid with its version shown.')],
  },
  '/uuid-parser': {
    sections: [
      {
        h: 'What the UUID parser shows',
        paras: ['After a format check, the tool reads the version digit (the first character of the third group), reports the variant, and for version 1, 6 and 7 UUIDs converts the embedded time into a UTC date.'],
        code: '123e4567-e89b-12d3-a456-426614174000\n\n// result\nVersion: 1\nVariant: RFC 4122 / RFC 9562 (variant 1)\nKind: Time-based\nTimestamp: 2228-06-25T20:01:28.545Z',
      },
      {
        h: 'Reading a UUID by eye',
        list: ['In xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx, M is the version and N starts with 8, 9, a or b for the RFC 4122 variant.', 'Version 1 and 6 timestamps count 100-nanosecond ticks since 15 October 1582; version 7 stores Unix milliseconds in its first 48 bits. The parser does not show the node (MAC) field.'],
        links: [['UUID Validator', '/uuid-validator'], ['UUID Generator', '/uuid-generator'], ['Number Base Converter', '/number-base-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it work on a GUID from .NET?', 'Yes, if the GUID is written with hyphens in the standard format, since a GUID uses the same 128-bit layout.')],
  },
  '/jwt-generator': {
    sections: [
      {
        h: 'What the JWT generator creates',
        list: ['The header is fixed: {"alg":"HS256","typ":"JWT"}.', 'The payload is the JSON you enter. It is not modified, so add iat and exp yourself if you need them.', 'The signature is HMAC-SHA256 over header.payload using the secret you type. If the secret is empty, the word secret is used.', 'Only HS256 is supported. There is no RS256 or ES256.'],
      },
      {
        h: 'Use generated tokens for testing only',
        paras: ['Tokens built here are handy for trying an API or a decoder. Do not type a production signing secret into any web page, and create real tokens on your server.'],
        links: [['JWT Decoder', '/jwt-decoder'], ['SHA-256 Generator', '/sha256-generator'], ['Unix Timestamp', '/unix-timestamp'], ['JSON Validator', '/json-validator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why does the tool say Invalid JSON payload?', 'The payload box must contain valid JSON. Run it through the JSON Validator to find the syntax error.')],
  },
  // ------------------------------------------------------------------- Hashes
  '/hash-generator': {
    sections: [
      {
        h: 'What this hash generator does',
        paras: ['This page returns the SHA-256 hash of your text, in lowercase hex, as you type. If you need a different algorithm, use the MD5 or SHA-512 page; each has its own tool.'],
        code: 'hello\n\n// SHA-256\n2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      },
      {
        h: 'What a hash is, and what it is not',
        list: ['A hash maps any input to a fixed-length digest, and the same input always gives the same digest.', 'Hashing is one-way. You cannot decrypt a hash, although short or common inputs can be guessed.', 'It is not encryption and it is not a safe way to store passwords by itself.', 'The tool hashes text only, and it does not add a salt or compute HMACs.'],
        links: [['SHA-256 Generator', '/sha256-generator'], ['SHA-512 Generator', '/sha512-generator'], ['MD5 Generator', '/md5-generator'], ['Base64 Encoder', '/base64-encoder']],
        linksLabel: 'Algorithm pages',
      },
    ],
    faqs: [q('Which algorithm should I pick?', 'SHA-256 is a common default for checksums and integrity checks. SHA-512 gives a longer digest. MD5 is only for non-security checksums.')],
  },
  '/sha256-generator': {
    sections: [
      {
        h: 'SHA-256 hash example',
        code: 'hello\n\n// SHA-256 (64 hex characters)\n2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      },
      {
        h: 'Where SHA-256 is used',
        list: ['Checksums and file integrity comparisons.', 'The signature step in HS256 JWTs, where it is combined with a secret as HMAC-SHA256.', 'Content addressing, cache keys and Git-style identifiers in many systems.', 'Not recommended on its own for password storage. Use a slow, salted password hashing algorithm instead.'],
        links: [['SHA-512 Generator', '/sha512-generator'], ['MD5 Generator', '/md5-generator'], ['JWT Generator', '/jwt-generator'], ['Hash Generator', '/hash-generator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('How long is a SHA-256 hash?', 'It is 256 bits, shown as 64 hexadecimal characters.')],
  },
  '/sha512-generator': {
    sections: [
      {
        h: 'SHA-512 hash example',
        code: 'hello\n\n// SHA-512 (128 hex characters)\n9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
      },
      {
        h: 'SHA-512 compared with SHA-256',
        list: ['SHA-512 produces a 512-bit digest, shown as 128 hex characters, twice the length of SHA-256.', 'Both belong to the SHA-2 family and are considered secure for integrity checks.', 'Use SHA-512 when a spec asks for it. Otherwise SHA-256 is the more common choice.'],
        links: [['SHA-256 Generator', '/sha256-generator'], ['MD5 Generator', '/md5-generator'], ['Hash Generator', '/hash-generator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Is SHA-512 safe for passwords?', 'Not by itself. It is fast, which helps attackers. Use a slow password hashing function with a salt.')],
  },
  '/md5-generator': {
    sections: [
      {
        h: 'MD5 hash example',
        code: 'hello\n\n// MD5 (32 hex characters)\n5d41402abc4b2a76b9719d911017c592',
      },
      {
        h: 'Is MD5 secure?',
        paras: ['No. MD5 has known collision attacks, and it is fast to brute-force, so it must not be used for passwords, signatures or any security decision.'],
        list: ['Acceptable uses: quick checksums to spot accidental corruption, cache keys and matching legacy systems that require MD5.', 'For anything security-related, use SHA-256 or SHA-512, and a dedicated password hashing algorithm for passwords.'],
        links: [['SHA-256 Generator', '/sha256-generator'], ['SHA-512 Generator', '/sha512-generator'], ['Hash Generator', '/hash-generator']],
        linksLabel: 'Safer alternatives',
      },
    ],
    faqs: [q('Why is the MD5 of an empty string not empty?', 'A hash always has a fixed length. The tool shows no result for empty input, but the MD5 of an empty string is d41d8cd98f00b204e9800998ecf8427e.')],
  },

  // -------------------------------------------------------------- Time & color
  '/timestamp-converter': {
    sections: [
      {
        "h": "Seconds, milliseconds and microseconds",
        "paras": [
          "Count the digits before you convert: the wrong unit gives a date in 1970 or in the far future."
        ],
        "list": [
          "10 digits: seconds (for example 1700000000)",
          "13 digits: milliseconds (JavaScript Date.now())",
          "16 digits: microseconds",
          "19 digits: nanoseconds"
        ],
        "code": "1700000000 seconds  -> 2023-11-14T22:13:20Z\n// JavaScript\nnew Date(1700000000 * 1000).toISOString()\n# Python\nfrom datetime import datetime, timezone\ndatetime.fromtimestamp(1700000000, timezone.utc)",
        "links": [
          [
            "Unix Timestamp",
            "/unix-timestamp"
          ],
          [
            "JWT Decoder",
            "/jwt-decoder"
          ],
          [
            "Cron Expression Parser",
            "/cron-expression-parser"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'Convert a Unix timestamp to a date',
        paras: ['Enter a number or a date string. The input starts with the current time in seconds. Digit-only values longer than 11 digits are read as milliseconds, shorter ones as seconds.'],
        code: '1700000000\n\n// output\nUTC: Tue, 14 Nov 2023 22:13:20 GMT\nISO: 2023-11-14T22:13:20.000Z\nUnix (ms): 1700000000000\nUnix (s): 1700000000',
      },
      {
        h: 'Convert a date to a Unix timestamp',
        paras: ['Type a date string that JavaScript can parse, such as an ISO 8601 value like 2023-11-14T22:13:20Z. The same panel shows Unix seconds and milliseconds. The Local line uses your device time zone.'],
        list: ['If you see Invalid Date / Timestamp, the string could not be parsed. ISO 8601 is the safest format.', 'There is no time zone picker. Add Z or an offset such as +05:30 to the string when the zone matters.'],
        links: [['Unix Timestamp', '/unix-timestamp'], ['JWT Decoder', '/jwt-decoder'], ['Cron Expression Parser', '/cron-expression-parser']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('How do I convert milliseconds to a date?', 'Paste the 13-digit value. Numbers longer than 11 digits are treated as milliseconds automatically.')],
  },
  '/unix-timestamp': {
    sections: [
      {
        "h": "Notable Unix timestamps",
        "code": "0           1970-01-01T00:00:00Z  (the epoch)\n1000000000  2001-09-09T01:46:40Z\n2147483647  2038-01-19T03:14:07Z  (largest signed 32-bit value)"
      },
      {
        "h": "Get the current Unix timestamp in code",
        "code": "// JavaScript (seconds)\nMath.floor(Date.now() / 1000)\n# Python\nimport time; int(time.time())\n// C#\nDateTimeOffset.UtcNow.ToUnixTimeSeconds()\n# Bash\ndate +%s\n-- PostgreSQL\nSELECT EXTRACT(EPOCH FROM now());",
        "links": [
          [
            "Timestamp Converter",
            "/timestamp-converter"
          ],
          [
            "Cron Expression Generator",
            "/cron-expression-generator"
          ],
          [
            "JWT Decoder",
            "/jwt-decoder"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'What is a Unix timestamp?',
        paras: ['A Unix timestamp, or epoch time, counts the time elapsed since 1 January 1970 00:00:00 UTC. It has no time zone, which is why APIs, databases and JWT claims such as exp and iat use it.', 'The page opens with the current time in seconds already filled in, so you can copy the current Unix timestamp right away.'],
      },
      {
        h: 'Seconds or milliseconds?',
        list: ['10 digits, such as 1700000000, is normally seconds (JWT, most Unix tools).', '13 digits, such as 1700000000000, is normally milliseconds (JavaScript Date.now()).', 'Pasting the wrong unit gives a date in 1970 or the far future, which is the quickest way to spot the mix-up.'],
        links: [['Timestamp Converter', '/timestamp-converter'], ['JWT Decoder', '/jwt-decoder'], ['Number Base Converter', '/number-base-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why does my Unix timestamp show 1970?', 'The number is probably in seconds being read as a smaller unit, or it is 0 or a very small value. Check whether your source uses seconds or milliseconds.')],
  },
  '/color-converter': {
    sections: [
      {
        h: 'What the color converter supports',
        list: ['HEX to RGB: enter a value starting with #, in 3 or 6 digits (#FFF or #FFFFFF).', 'RGB to HEX: enter rgb(r, g, b) and get an uppercase HEX code.', 'A color preview swatch appears next to the result.', 'HSL and named colors are not supported. 6-digit and 8-digit HEX codes are also accepted without the # sign, and 8-digit (alpha) HEX converts to rgba().'],
      },
      {
        h: 'Color conversion examples',
        code: '#3B82F6          ->  rgb(59, 130, 246)\nrgb(59, 130, 246) ->  #3B82F6',
        links: [['HEX to RGB Converter', '/hex-to-rgb'], ['RGB to HEX Converter', '/rgb-to-hex'], ['HEX to Decimal', '/hex-to-decimal']],
        linksLabel: 'Direction-specific pages',
      },
    ],
    faqs: [q('Which direction should I use?', 'Both directions work on this page. Type a HEX code to get RGB, or an rgb() value to get HEX.')],
  },
  '/hex-to-rgb': {
    sections: [
      {
        h: 'How to convert HEX to RGB',
        paras: ['A HEX color is three bytes written in base 16: red, green, blue. Split #FF5733 into FF, 57 and 33, then convert each pair from hexadecimal to decimal.'],
        code: '#FF5733  ->  FF = 255, 57 = 87, 33 = 51  ->  rgb(255, 87, 51)\n#F53     ->  expands to #FF5533  ->  rgb(255, 85, 51)',
      },
      {
        h: 'HEX to RGB in this tool',
        list: ['Type the code with the # sign. Three-digit shorthand is expanded for you.', '8-digit HEX with an alpha pair (such as #3B82F680) converts to rgba(59, 130, 246, 0.5).', 'The same panel converts rgb() values back to HEX if you type one.'],
        links: [['RGB to HEX Converter', '/rgb-to-hex'], ['Color Converter', '/color-converter'], ['Hex to Decimal Converter', '/hex-to-decimal']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why does my HEX code say unsupported format?', 'The tool expects the code to start with #. Add it, for example #FF5733.')],
  },
  '/rgb-to-hex': {
    sections: [
      {
        h: 'How to convert RGB to HEX',
        paras: ['Convert each channel from decimal to two hexadecimal digits and join them: red, green, blue.'],
        code: 'rgb(255, 87, 51)  ->  255 = FF, 87 = 57, 51 = 33  ->  #FF5733',
      },
      {
        h: 'RGB to hex in CSS',
        paras: ['CSS accepts both notations, so rgb(59, 130, 246) and #3B82F6 draw the same blue. Hex is shorter and is what design tools and style guides usually list; rgb() and rgba() are handy when you need to change a single channel or the opacity.'],
        code: 'color: rgb(59, 130, 246);  /* same as */  color: #3B82F6;\nbackground: rgba(59, 130, 246, 0.5);  /* same as */  background: #3B82F680;',
        links: [['Guide: RGB to HEX conversion, formula and code', '/guides/rgb-to-hex-conversion']],
        linksLabel: 'Read more',
      },
      {
        h: 'RGB to HEX in this tool',
        list: ['Type rgb(255, 87, 51), rgba(255, 87, 51, 0.5) or just 255, 87, 51. Whole numbers from 0 to 255 are accepted.', 'Results are uppercase with a leading #. An alpha value adds a two-digit alpha pair (8-digit HEX).', 'A value above 255 shows an error message instead of a malformed code.'],
        links: [['HEX to RGB Converter', '/hex-to-rgb'], ['Color Converter', '/color-converter'], ['Decimal to Hex Converter', '/decimal-to-hex']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Is there a free online RGB to HEX converter without signup?', 'Yes. This one is free, needs no account and runs in your browser. Type the RGB values and the hex code and a color preview appear as you type.'), q('How do I calculate RGB to hex by hand?', 'Convert each channel to base 16 and join the three pairs: divide by 16 for the first digit and take the remainder for the second, using A to F for 10 to 15. The guide linked above shows a worked example with code.'), q('How do I change RGB to hex in CSS?', 'Replace rgb(59, 130, 246) with #3B82F6. Both work in CSS. For transparency, rgba(59, 130, 246, 0.5) becomes the 8-digit value #3B82F680.'), q('Can I paste the numbers without rgb()?', 'Yes. 255, 87, 51 or 255 87 51 works the same as rgb(255, 87, 51).')],
  },

  // -------------------------------------------------------- Query strings, cron
  '/query-string-parser': {
    sections: [
      {
        h: 'Query string to JSON example',
        paras: ['Paste a whole URL or only the part after ?. The tool takes everything after the question mark, decodes it and prints key-value pairs as JSON.'],
        code: 'https://example.com/search?q=hello+world&page=2&tag=a&tag=b\n\n// output\n{\n  "q": "hello world",\n  "page": "2",\n  "tag": "b"\n}',
      },
      {
        h: 'Things to know about parsed parameters',
        list: ['All values are strings, so page is "2", not 2.', 'When a key repeats, only the last value is kept (tag above).', 'Plus signs and %20 both become spaces.'],
        links: [['Query String Generator', '/query-string-generator'], ['URL Decoder', '/url-decoder'], ['JSON Formatter', '/json-formatter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it keep repeated parameters?', 'No. If a key appears more than once, the last value wins.')],
  },
  '/query-string-generator': {
    sections: [
      {
        h: 'JSON to query string example',
        code: '{"q":"hello world","page":"2"}\n\n// output\nq=hello+world&page=2',
      },
      {
        h: 'What the generator expects',
        list: ['A flat JSON object. Strings and numbers work best.', 'Spaces become + and special characters are percent-encoded.', 'Nested objects become [object Object], and arrays are joined with commas, so flatten your data first.', 'The question mark is not added, so put ? in front yourself.'],
        links: [['Query String Parser', '/query-string-parser'], ['URL Encoder', '/url-encoder'], ['JSON Validator', '/json-validator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why do I see Error processing input?', 'The input is not valid JSON. Check it with the JSON Validator.')],
  },
  '/cron-expression-generator': {
    sections: [
      {
        h: 'Common cron expressions',
        paras: ['Type an expression and the description updates as you type. These examples can be pasted in as a starting point:'],
        code: '*/5 * * * *     runs every 5 minutes\n0 * * * *       runs at the top of every hour\n0 0 * * *       runs every day at midnight\n30 9 * * 1-5    runs at 09:30 on weekdays\n0 0 1 * *       runs at midnight on the 1st of each month',
      },
      {
        h: 'How to write a cron expression',
        list: ['Five fields: minute, hour, day of month, month, day of week.', '* means every value, */n means every n units, a-b is a range and a,b is a list.', 'This page describes a schedule you type. It does not offer point-and-click controls or list upcoming run times.'],
        links: [['Cron Expression Parser', '/cron-expression-parser'], ['Unix Timestamp', '/unix-timestamp'], ['Timestamp Converter', '/timestamp-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Which cron time zone does it assume?', 'None. It describes the pattern only. The time zone depends on the system that runs the job.')],
  },
  '/cron-expression-parser': {
    sections: [
      {
        "h": "Cron gotchas that cause surprises",
        "list": [
          "Fields are minute, hour, day of month, month, day of week, in that order.",
          "In classic cron, if both day of month and day of week are set, the job runs when either one matches.",
          "Schedules run in the server time zone, which is often UTC.",
          "Quartz and some cloud schedulers add a seconds field and use different syntax."
        ],
        "links": [
          [
            "Cron Expression Generator",
            "/cron-expression-generator"
          ],
          [
            "Unix Timestamp",
            "/unix-timestamp"
          ],
          [
            "Timestamp Converter",
            "/timestamp-converter"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'How to read a cron expression',
        paras: ['Paste a crontab schedule to see it in plain English. The five fields are, in order, minute, hour, day of month, month and day of week.'],
        code: '30 9 * * 1-5\n\n// description\nAt 09:30 AM, Monday through Friday',
      },
      {
        h: 'Common cron parsing mistakes',
        list: ['Swapping day of month and day of week.', 'Using 24-hour values in the hour field, for example 0 for midnight.', 'Setting both day of month and day of week, which many cron implementations treat as OR.', 'The tool does not show next run times, so check those in your scheduler.'],
        links: [['Cron Expression Generator', '/cron-expression-generator'], ['Timestamp Converter', '/timestamp-converter'], ['Regex Tester', '/regex-tester']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('What does an Invalid Cron Expression message mean?', 'The text could not be read as a cron schedule. Check the number of fields and the value ranges.')],
  },

  // ------------------------------------------------------------------- Text
  '/text-counter': {
    sections: [
      {
        h: 'What the text counter measures',
        list: ['Characters: the full length of the text, including spaces and line breaks.', 'Words: groups of characters separated by whitespace.', 'Lines: the number of line breaks plus one.', 'It does not count sentences, paragraphs, bytes or reading time.'],
      },
      {
        h: 'Text counter example',
        code: 'Hello world\nsecond line\n\n// output\nCharacters: 23\nWords: 4\nLines: 2',
        links: [['Case Converter', '/case-converter'], ['Slug Generator', '/slug-generator'], ['Diff Checker', '/diff-checker']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does the character count include spaces?', 'Yes. It counts every character, including spaces and line breaks.')],
  },
  '/case-converter': {
    sections: [
      {
        h: 'What the case converter returns',
        paras: ['Paste text once and the tool shows three versions together: UPPERCASE, lowercase and Title Case.'],
        code: 'convert this TEXT\n\n// output\nUPPERCASE: CONVERT THIS TEXT\nlowercase: convert this text\nTitle Case: Convert This Text',
      },
      {
        h: 'Case styles that are not included',
        list: ['camelCase, PascalCase, snake_case and kebab-case are not generated.', 'For a hyphenated lowercase form of a title, use the slug tool.'],
        links: [['Text to Slug', '/text-to-slug'], ['Slug Generator', '/slug-generator'], ['Text Counter', '/text-counter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Can it convert to camelCase or snake_case?', 'No. It converts to uppercase, lowercase and title case only.')],
  },
  '/text-to-slug': {
    sections: [
      {
        "h": "Slugify a title in code",
        "code": "// JavaScript\ntitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')\n# Python (python-slugify package)\nfrom slugify import slugify; slugify(title)",
        "links": [
          [
            "Slug Generator",
            "/slug-generator"
          ],
          [
            "Case Converter",
            "/case-converter"
          ],
          [
            "Text Counter",
            "/text-counter"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'Text to slug example',
        code: 'Hello, World! Café 2026\n\n// slug\nhello-world-caf-2026',
      },
      {
        h: 'How the text becomes a slug',
        list: ['Everything is lowercased.', 'Any run of characters other than a-z and 0-9 becomes a single hyphen.', 'Leading and trailing hyphens are removed.', 'Accented letters are not transliterated. The é in Café is dropped, so check the result for words that include accents.'],
        links: [['Slug Generator', '/slug-generator'], ['Case Converter', '/case-converter'], ['URL Encoder', '/url-encoder']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why did my accented letters disappear?', 'The tool keeps only a-z and 0-9. Replace accented letters with plain ones before converting.')],
  },
  '/slug-generator': {
    sections: [
      {
        "h": "What makes a good URL slug",
        "list": [
          "Lowercase letters, numbers and hyphens only.",
          "Short and readable: keep the words that describe the page.",
          "Hyphens between words, not underscores or spaces.",
          "Stable: avoid dates and version numbers you will have to change."
        ],
        "code": "Best Free JSON Tools in 2026!  ->  best-free-json-tools-in-2026",
        "links": [
          [
            "Text to Slug",
            "/text-to-slug"
          ],
          [
            "Case Converter",
            "/case-converter"
          ],
          [
            "URL Encoder",
            "/url-encoder"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'Slug generator example',
        code: 'How to Format JSON in 2026\n\n// slug\nhow-to-format-json-in-2026',
      },
      {
        h: 'Tips for a good URL slug',
        list: ['Keep it short and descriptive, using the words people would search for.', 'Use hyphens between words, and lowercase letters and digits.', 'Avoid dates and filler words that you may want to change later.', 'Check the output for accented letters: this tool removes them instead of transliterating.'],
        links: [['Text to Slug', '/text-to-slug'], ['URL Encoder', '/url-encoder'], ['Text Counter', '/text-counter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Should a slug include stop words?', 'It is usually fine to drop words such as a, the and of when the slug stays clear. Edit the result by hand if needed.')],
  },
  '/regex-tester': {
    sections: [
      {
        h: 'Regex tester example',
        code: 'Pattern: \\d{4}-\\d{2}-\\d{2}   Flags: g\nText: 2026-10-05 and 2025-01-31\n\n// matches\n2026-10-05  (index 0)\n2025-01-31  (index 15)',
      },
      {
        h: 'Regex flags and common errors',
        list: ['The g flag is required. Without it the test throws an error, so keep g in the flags box.', 'i ignores case, m makes ^ and $ match at each line, and s lets . match line breaks.', 'The tester lists each match and its index. It does not display capture groups.', 'It uses the JavaScript regex engine, so lookbehind and named groups depend on your browser.'],
        links: [['Regex Generator', '/regex-generator'], ['Text Counter', '/text-counter'], ['Diff Checker', '/diff-checker']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Why do I get an error about a non-global RegExp?', 'The tool finds all matches, which requires the g flag. Add g to the flags field.')],
  },
  '/regex-generator': {
    sections: [
      {
        h: 'Common regex patterns to start from',
        paras: ['This page does not build patterns for you. It runs the same matcher as the Regex Tester, so you write or paste a pattern, add flags and check it against sample text. These patterns work in JavaScript and can be pasted in:'],
        code: 'Digits:            \\d+\nISO date:          \\d{4}-\\d{2}-\\d{2}\nEmail (simple):    \\b[\\w.+-]+@[\\w-]+\\.[\\w.]+\\b\nWord characters:   \\w+',
      },
      {
        h: 'What a regular expression is',
        paras: [
          'A regular expression (regex) is a sequence of characters that describes a search pattern. Regular expressions let you find, extract or check text without writing a loop for every case, for example pulling email addresses or order numbers out of a log file.',
          'Use this page as a regex pattern maker and regex builder: write the pattern in small parts, run it after each change and watch the matches list update. A complex regex is much easier to debug when you grow it one piece at a time.',
        ],
      },
      {
        h: 'Regex generator from a string: build the pattern by hand',
        paras: [
          'To turn a sample string into a regex, start with the string itself and escape the characters that have a special meaning: . * + ? ^ $ { } ( ) | [ ] and the backslash. Then swap the variable parts for classes such as \\d for a digit or \\w for a word character.',
        ],
        code: 'String:        price: $5.00 (USD)\nEscaped regex: price: \\$5\\.00 \\(USD\\)\nGeneral regex: price: \\$\\d+\\.\\d{2} \\([A-Z]{3}\\)',
      },
      {
        h: 'Find and replace with a regex',
        paras: [
          'Fill in the replacement box to see the text after a find and replace. Wrap parts of the pattern in parentheses to make groups, then refer to them as $1, $2 and so on.',
        ],
        code: 'Pattern:      (\\w+)@(\\w+)\\.com   Flags: g\nReplacement:  $2: $1\nText:         ada@example.com, bob@site.com\nResult:       example: ada, site: bob',
      },
      {
        h: 'Test a pattern before you ship it',
        list: ['Run it against both text that should match and text that should not.', 'Keep g in the flags so every match is listed.', 'A simple email pattern accepts most addresses but not every valid one. Use your language\'s validation library for strict checks.'],
        links: [['Regex Tester', '/regex-tester'], ['UUID Validator', '/uuid-validator'], ['Query String Parser', '/query-string-parser']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does this page create a regex from a description?', 'No. You write the pattern. The page shows every match so you can refine it.')],
  },
  '/diff-checker': {
    sections: [
      {
        h: 'Diff checker example',
        code: 'Original:      Modified:\nname: api      name: api\nport: 80       port: 8080\n\n// result\n  name: api\n- port: 80\n+ port: 8080',
      },
      {
        h: 'How the comparison works',
        list: ['It compares the two texts line by line. Changed lines show as one removed line and one added line.', 'Removed lines are red, added lines are green and unchanged lines are grey.', 'Copy diff copies a plain-text version with + and - prefixes.', 'It does not highlight changes inside a line.'],
        links: [['JSON Formatter', '/json-formatter'], ['YAML Formatter', '/yaml-formatter'], ['XML Formatter', '/xml-formatter']],
        linksLabel: 'Format first for cleaner diffs',
      },
    ],
    faqs: [q('How do I compare two JSON files?', 'Format both with the JSON Formatter so each key is on its own line, then paste them into the two boxes.')],
  },

  // ---------------------------------------------------------- Number bases
  '/number-base-converter': {
    sections: [
      {
        "h": "Number base prefixes and a quick table",
        "paras": [
          "Source code marks the base with a prefix: 0x for hex, 0b for binary and 0o for octal in JavaScript and Python. C# supports 0x and 0b."
        ],
        "code": "Decimal  Binary  Octal  Hex\n8        1000    10     8\n10       1010    12     A\n15       1111    17     F\n16       10000   20     10\n255      11111111 377    FF",
        "links": [
          [
            "Binary to Decimal",
            "/binary-to-decimal"
          ],
          [
            "Decimal to Hex",
            "/decimal-to-hex"
          ],
          [
            "Hex to Decimal",
            "/hex-to-decimal"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'Converting between binary, octal, decimal and hex',
        list: ['Choose the From base and the To base from Binary (2), Octal (8), Decimal (10) or Hex (16).', 'Type a whole number. Hex digits are accepted in upper or lower case, and the result is uppercase.', 'Fractions are not supported and anything after a decimal point is ignored.', 'Very large integers lose precision beyond what JavaScript numbers can hold exactly.'],
      },
      {
        h: 'Number base examples',
        code: '1010   (2 -> 10)   =  10\n255    (10 -> 16)  =  FF\nFF     (16 -> 2)   =  11111111\n17     (8 -> 10)   =  15',
        links: [['Binary to Decimal', '/binary-to-decimal'], ['Decimal to Binary', '/decimal-to-binary'], ['Hex to Decimal', '/hex-to-decimal'], ['Decimal to Hex', '/decimal-to-hex']],
        linksLabel: 'Focused conversions',
      },
    ],
    faqs: [q('Which bases are supported?', 'Binary (2), octal (8), decimal (10) and hexadecimal (16).')],
  },
  '/binary-to-decimal': {
    sections: [
      {
        "h": "Binary to decimal: powers of two",
        "paras": [
          "Each binary digit is worth a power of two, starting at 1 on the right. Add the values of the digits that are 1."
        ],
        "code": "1101 = 1x8 + 1x4 + 0x2 + 1x1 = 13\n11111111 = 255\n\n// JavaScript\nparseInt('1101', 2)            // 13\n# Python\nint('1101', 2)                 # 13",
        "links": [
          [
            "Decimal to Binary",
            "/decimal-to-binary"
          ],
          [
            "Hex to Decimal",
            "/hex-to-decimal"
          ],
          [
            "Number Base Converter",
            "/number-base-converter"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'How to convert binary to decimal',
        paras: ['Each binary digit is a power of 2, counted from the right starting at 0. Add up the powers where the digit is 1.'],
        code: '1010 = 1x8 + 0x4 + 1x2 + 0x1 = 10\n1101 = 1x8 + 1x4 + 0x2 + 1x1 = 13',
      },
      {
        h: 'Binary to decimal in this tool',
        list: ['The page opens with From set to Binary (2) and To set to Decimal (10). Type the binary number.', 'Only 0 and 1 belong in a binary number. A value that starts with another digit shows Invalid number for base 2, but otherwise the tool stops reading at the first bad digit, so 1021 is read as 10. Check your digits.'],
        links: [['Decimal to Binary', '/decimal-to-binary'], ['Number Base Converter', '/number-base-converter'], ['Hex to Decimal', '/hex-to-decimal']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('What happens if I type a 2 in a binary number?', 'The tool reads digits until the first one that is not valid for the base, so 1021 is read as 10. A value that starts with an invalid digit shows an "Invalid number for base 2" message.')],
  },
  '/decimal-to-binary': {
    sections: [
      {
        "h": "Decimal to binary: method and code",
        "paras": [
          "Divide by 2 repeatedly and read the remainders from last to first."
        ],
        "code": "13 / 2 = 6 remainder 1\n6 / 2 = 3 remainder 0\n3 / 2 = 1 remainder 1\n1 / 2 = 0 remainder 1\nRead upwards: 1101\n\n// JavaScript\n(13).toString(2)               // '1101'\n# Python\nbin(13)                        # '0b1101'",
        "links": [
          [
            "Binary to Decimal",
            "/binary-to-decimal"
          ],
          [
            "Decimal to Hex",
            "/decimal-to-hex"
          ],
          [
            "Number Base Converter",
            "/number-base-converter"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'How to convert decimal to binary',
        paras: ['Divide the number by 2 repeatedly and write down the remainders. Read them from last to first.'],
        code: '13 / 2 = 6 r 1\n 6 / 2 = 3 r 0\n 3 / 2 = 1 r 1\n 1 / 2 = 0 r 1\n\nRead upward: 1101   (255 in decimal is 11111111 in binary)',
      },
      {
        h: 'Decimal to binary in this tool',
        list: ['The page opens with From set to Decimal (10) and To set to Binary (2). Type your number.', 'Whole numbers only, and negative numbers keep a minus sign instead of showing two\'s complement.'],
        links: [['Binary to Decimal', '/binary-to-decimal'], ['Number Base Converter', '/number-base-converter'], ['Decimal to Hex', '/decimal-to-hex']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it show two\'s complement for negative numbers?', 'No. A negative decimal such as -5 is shown as -101, with a minus sign.')],
  },
  '/hex-to-decimal': {
    sections: [
      {
        "h": "Hex to decimal: method and code",
        "paras": [
          "Multiply each hex digit by a power of 16, starting from 16^0 on the right, and add the results."
        ],
        "code": "2F = 2 x 16 + 15 x 1 = 47\nFF = 15 x 16 + 15 x 1 = 255\n\n// JavaScript\nparseInt('ff', 16)             // 255\n// C#\nConvert.ToInt32(\"FF\", 16)      // 255\n# Python\nint('ff', 16)                  # 255",
        "links": [
          [
            "Decimal to Hex",
            "/decimal-to-hex"
          ],
          [
            "Number Base Converter",
            "/number-base-converter"
          ],
          [
            "HEX to RGB",
            "/hex-to-rgb"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'How to convert hex to decimal',
        paras: ['Each hex digit is a power of 16, from the right. The letters A to F stand for 10 to 15.'],
        code: 'FF = 15x16 + 15x1 = 255\n1A = 1x16 + 10x1 = 26',
      },
      {
        h: 'Hex to decimal in this tool',
        list: ['The page opens with From set to Hex (16) and To set to Decimal (10). Type the hex number.', 'Upper and lower case digits both work.', 'Hex color codes are three separate bytes, so use the HEX to RGB converter for colors.'],
        links: [['Decimal to Hex', '/decimal-to-hex'], ['HEX to RGB Converter', '/hex-to-rgb'], ['Number Base Converter', '/number-base-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Can I include the 0x prefix?', 'Yes. A leading 0x is accepted when the From base is Hex (16).')],
  },
  '/decimal-to-hex': {
    sections: [
      {
        "h": "Decimal and hex reference",
        "code": "Decimal  Hex    Decimal  Hex\n0        0      16       10\n9        9      32       20\n10       A      64       40\n11       B      100      64\n12       C      128      80\n13       D      255      FF\n14       E      256      100\n15       F      4095     FFF"
      },
      {
        "h": "Decimal to hex: method and code",
        "paras": [
          "Divide the number by 16 repeatedly and read the remainders from last to first. Remainders 10 to 15 are written A to F."
        ],
        "code": "255 / 16 = 15 remainder 15 (F)\n15 / 16 = 0  remainder 15 (F)\nRead upwards: FF\n\n// JavaScript\n(255).toString(16)            // 'ff'\n// C#\nConvert.ToString(255, 16)      // \"ff\"\n# Python\nhex(255)                       # '0xff'",
        "links": [
          [
            "Hex to Decimal",
            "/hex-to-decimal"
          ],
          [
            "Number Base Converter",
            "/number-base-converter"
          ],
          [
            "RGB to HEX",
            "/rgb-to-hex"
          ]
        ],
        "linksLabel": "Related"
      },
      {
        h: 'How to convert decimal to hex',
        paras: ['Divide by 16 repeatedly and write the remainders as hex digits, then read them from last to first.'],
        code: '255 / 16 = 15 r 15  ->  F, F\nResult: FF\n\n4095 = FFF',
      },
      {
        h: 'Decimal to hex in this tool',
        list: ['The page opens with From set to Decimal (10) and To set to Hex (16). Type your number.', 'The result is uppercase and has no 0x prefix.', 'To turn RGB channel values into a color code, use the RGB to HEX converter.'],
        links: [['Guide: how to convert decimal to hex, with worked examples and a table', '/guides/decimal-to-hex-conversion'], ['Hex to Decimal', '/hex-to-decimal'], ['RGB to HEX Converter', '/rgb-to-hex'], ['Number Base Converter', '/number-base-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Does it add the 0x prefix?', 'No. Add 0x yourself if your code needs it.')],
  },

  // ----------------------------------------------------------- Website check
  '/website-status-checker': {
    sections: [
      {
        h: 'Check if a website is down: a quick checklist',
        list: ['Enter the domain or full URL and press Check status. Up means the site answered; a timeout or Unreachable result means your browser could not connect.', 'If a site is down here, test the same address on another network, such as mobile data, to see whether the problem is only on your side.', 'If it is up here but will not open in your usual browser, clear the DNS cache, turn off any VPN and try a private window.', 'Read the status code when one is shown: 5xx means the server has a problem, 4xx means the server is up but refused or could not find that address.'],
        links: [['Guide: how to check if a website is down', '/guides/check-if-a-website-is-down']],
        linksLabel: 'Read more',
      },
      {
        h: 'What common HTTP status codes mean',
        list: ['200 OK: the server returned the page.', '301 or 302: the address redirects somewhere else.', '403 Forbidden: the server is up but refused the request.', '404 Not Found: the server is up but that path does not exist.', '500 Internal Server Error: the server is up but failing.', '503 Service Unavailable: the server is overloaded or down for maintenance.'],
      },
      {
        h: 'How the website status checker works',
        paras: ['Your browser sends a HEAD request to each address you enter, up to 10 at a time, and waits up to 12 seconds. There is no server of ours in between, so the result reflects what your own network can reach.'],
        list: ['Up: the server answered with a normal status code.', 'Online (client error): the server answered with a 4xx code, so the site is alive but that address returned an error.', 'Server error: a 5xx code, so the server is reachable but reporting a problem.', 'Unreachable or timeout: the browser could not connect, or the request took too long.'],
      },
      {
        h: 'Limits to keep in mind',
        list: ['Many sites block cross-origin reads. In that case the tool can only tell whether the server answered, not the exact status code.', 'http:// addresses cannot be checked from this https:// page.', 'A site that is down for others can still load for you, and the reverse. It is not a worldwide uptime monitor.'],
        links: [['URL Encoder', '/url-encoder'], ['Query String Parser', '/query-string-parser'], ['Timestamp Converter', '/timestamp-converter']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Is my website up right now?', 'Enter your domain and press Check status. A result of Up means your browser got an answer from the server a moment ago. Check again from another network to see whether visitors elsewhere get the same result.'), q('Is this URL working?', 'Paste the full address, including the path. Up means the server answered normally. Online (client error) means the server is alive but that address returned a 4xx error such as 404, and Server error means it returned a 5xx code.'), q('Where do I find a website status page?', 'Many services publish an official status page, often at a status subdomain such as status.example.com. This tool does not read those pages; it tests whether the address responds from your browser.'), q('Does it work for https sites?', 'Yes. Enter the domain or an https:// address. Plain http:// addresses cannot be tested from this https:// page because browsers block them.'), q('Is it down for everyone or just me?', 'The tool only tests from your own browser and network. Try it from another network or device to compare.'), q('How do I check if a website is down?', 'Enter the domain or URL and press Check status. If it is reachable here but not in your usual browser, the problem is likely local: try another network, clear the DNS cache or turn off a VPN.'), q('Why does it say reachable without a status code?', 'Many sites do not let other pages read their response. The browser can still tell that the server answered, so the tool reports reachable without the exact code.')],
  },
};
