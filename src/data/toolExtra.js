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
        h: 'What this online XML validator checks',
        paras: [
          'This free XML validator checks whether a document is well-formed: it parses the XML and reports syntax errors that prevent it from being read as an XML document. Paste XML text or choose a local file, then press Process to see the result.',
          'The check uses the XML parser built into your browser. It does not upload your XML to a remote validation service. When the browser reports a location, the tool shows the line and column with a short excerpt to help you inspect the problem.',
        ],
        list: ['One document root element is present.', 'Elements are properly nested and closing tags match their opening tags.', 'Attribute values use quotation marks.', 'Reserved characters in text and attributes are escaped correctly.', 'The document can be parsed as XML.'],
        links: [['XML Formatter', '/xml-formatter'], ['JSON Validator', '/json-validator'], ['YAML Formatter', '/yaml-formatter']],
        linksLabel: 'Related tools',
      },
      {
        h: 'Well-formed XML vs valid XML: what is the difference?',
        paras: [
          'Well-formedness is the basic syntax requirement for every XML document. A well-formed document has a single root element, correctly nested tags, quoted attribute values and properly escaped reserved characters.',
          'Validity is a stricter check. A valid document must be well-formed and also conform to a grammar defined by a Document Type Definition (DTD) or an XML Schema (XSD). This page checks well-formedness only; it does not evaluate an XML document against an XSD, DTD, namespace contract or application-specific rules.',
        ],
        code: `<book><title>XML Basics</title></book>\n\n// Well-formed: tags are nested and closed.\n// Schema validity is a separate check against an XSD or DTD.`,
      },
      {
        h: 'Common XML syntax errors and how to fix them',
        paras: ['Use these small examples to recognize frequent XML parser errors. Correct the markup, then run the XML check again.'],
        code: `Mismatched tags\n<root><item>one</root>\n<root><item>one</item></root>\n\nUnescaped ampersand\n<name>Tom & Jerry</name>\n<name>Tom &amp; Jerry</name>\n\nUnquoted attribute\n<item id=7>Book</item>\n<item id="7">Book</item>\n\nTwo root elements\n<a>1</a><b>2</b>\n<root><a>1</a><b>2</b></root>\n\nCase-sensitive tag names\n<Item>Book</item>\n<Item>Book</Item>`,
        list: ['XML tag names are case-sensitive: <Item> and <item> are different names.', 'Escape ampersands as &amp; and less-than signs as &lt; when they are data, not markup.', 'Use a CDATA section when you need to include a larger block of text containing markup-like characters.', 'Keep the XML declaration, if present, at the beginning of the document.'],
      },
      {
        h: 'How to read XML validation errors',
        paras: [
          'The browser parser may include a line and column in its error message. When available, this tool displays the reported position and a short excerpt with a caret. Browser engines use different parser messages, so the exact wording can vary.',
          'The reported position is where the parser detected a problem, not always where the mistake was introduced. If a closing tag is missing, for example, the parser may only notice when a later tag does not match. Check the preceding element as well as the highlighted position.',
          'The browser parser generally stops at the first fatal XML syntax error. Correct that issue and press Process again to check the document for the next one.',
        ],
      },
      {
        h: 'Validate an XML file in your browser',
        paras: ['You can paste XML directly or choose/drop a local XML or text file using the file control below the input. The browser reads the selected file as text; the contents are then passed to the same XML parser as pasted input. Press Process to run the check.'],
        list: ['Open or paste the XML document.', 'Choose or drop a local file if you do not want to copy its contents.', 'Press Process.', 'If the parser reports an error, review the message and line/column excerpt.', 'Fix the XML and validate it again.'],
      },
      {
        h: 'Checking XML sitemaps, SOAP messages and RSS feeds',
        paras: [
          'Sitemaps, SOAP envelopes, RSS feeds and XML configuration files all need to be well-formed before another system can parse them. This validator can check that baseline XML syntax.',
          'A successful syntax check does not prove that a sitemap follows the sitemap protocol, that a SOAP message meets a service contract, or that an RSS feed follows every application-specific requirement. Those checks need the relevant protocol rules or schema. For sitemap-specific checks, use a dedicated sitemap validator; for XSD or DTD checks, use a schema-aware validator.',
        ],
        links: [['XML Formatter', '/xml-formatter'], ['Diff Checker', '/diff-checker'], ['YAML to JSON', '/yaml-to-json']],
        linksLabel: 'Related tools',
      },
      {
        h: 'Validate XML against an XSD or DTD with developer tools',
        paras: ['This browser-based XML checker does not perform XSD or DTD validation. If you need to check element types, required attributes, allowed child elements or other schema constraints, use a schema-aware tool such as xmllint or the XML validation APIs in your programming language.'],
        code: `# Check XML well-formedness with xmllint\nxmllint --noout document.xml\n\n# Validate XML against an XSD schema\nxmllint --noout --schema schema.xsd document.xml\n\n# Python: parse XML for well-formedness\nimport xml.etree.ElementTree as ET\nET.parse("document.xml")\n\n// C#: parse XML for well-formedness\nSystem.Xml.Linq.XDocument.Load("document.xml");`,
      },
    ],
    faqs: [
      q('Does this XML validator check XSD or DTD schemas?', 'No. It checks whether the XML is well-formed. Use a schema-aware validator to compare the document with an XSD or DTD.'),
      q('Can I upload an XML file to validate?', 'Yes. Choose or drop a local XML or text file below the input. The browser reads it locally; press Process to validate its syntax.'),
      q('Does the XML checker upload or store my document?', 'No. The parser runs in your browser and the selected file is read locally. The validator does not send the XML to a remote validation service.'),
      q('Can I validate a sitemap with this XML checker?', 'It checks whether the sitemap is well-formed XML, but it does not validate sitemap protocol requirements such as namespaces, URL limits or required elements.'),
      q('Why does the parser show only one error?', 'The browser XML parser reports a fatal parse error rather than a complete diagnostic list. Fix the first issue and run the check again.'),
      q('What should I use to format XML after validation?', 'Use the XML Formatter to indent and make well-formed XML easier to read. Formatting does not replace syntax or schema validation.'),
    ],
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
        h: 'How to encode HTML online',
        paras: [
          'Paste text or an HTML snippet into the input. The HTML encoder converts ampersands, angle brackets and quotation marks into character references as you type. Copy the result when you want the original characters to appear literally rather than being parsed as markup.',
        ],
        list: [
          'Paste the text or markup you want to display as text.',
          'The encoder escapes &, <, >, double quotes and apostrophes.',
          'Copy the encoded output into the appropriate HTML text or quoted-attribute context.',
          'Use your framework\'s contextual output escaping for application templates and user-controlled values.',
        ],
      },
      {
        h: 'HTML encoding characters and entity reference',
        paras: [
          'HTML entity encoding replaces characters that have special meaning in markup with character references. This tool uses readable named references for four characters and a numeric reference for the apostrophe.',
        ],
        code: '&   ->  &amp;\n<   ->  &lt;\n>   ->  &gt;\n"   ->  &quot;\n\'   ->  &#39;',
        links: [
          ['HTML Decoder', '/html-decoder'],
          ['URL Encoder', '/url-encoder'],
          ['Base64 Encoder', '/base64-encoder'],
        ],
        linksLabel: 'Related tools',
      },
      {
        h: 'HTML encode example: convert markup to visible text',
        paras: ['For example, encoding a snippet changes the markup characters into entities. When the result is placed in an HTML text node, the browser displays the tags and attributes as text instead of creating those elements.'],
        code: 'Input:\n<div class="note">Tom & Jerry\'s offer</div>\n\nEncoded output:\n&lt;div class=&quot;note&quot;&gt;Tom &amp; Jerry&#39;s offer&lt;/div&gt;',
      },
      {
        h: 'How to HTML encode in JavaScript',
        paras: [
          'When displaying a string inside an existing element, prefer assigning it with textContent. The browser treats the value as text and does not parse it as markup. If another system specifically requires an HTML-encoded string, escape the relevant characters for that output context.',
        ],
        code: '// Safely display text in an existing element\nelement.textContent = userInput;\n\n// Create an HTML-encoded string when a string is required\nconst escapeHtml = (value) => value.replace(/[&<>"\']/g, (char) => ({\n  "&": "&amp;", "<": "&lt;", ">": "&gt;",\n  "\\\"": "&quot;", "\'": "&#39;"\n}[char]));',
      },
      {
        h: 'HTML encoding, escaping and XSS protection',
        paras: [
          'HTML output encoding is an important defense when untrusted text is inserted into an HTML context, but the correct method depends on where the value is used. HTML text, quoted attributes, JavaScript, CSS and URL components have different parsing rules. This tool only produces a basic HTML entity-escaped string; it is not an HTML sanitizer and does not make input safe for every context.',
          'For application code, prefer framework-provided contextual escaping and avoid inserting untrusted strings with innerHTML. If you need to accept and render user-authored markup, use a reputable HTML sanitizer with an explicit allowlist.',
        ],
      },
      {
        h: 'HTML encoding vs URL encoding',
        paras: [
          'HTML encoding uses character references such as &amp; and &lt; so characters display correctly in HTML. URL encoding uses percent-encoded bytes such as %20 and %26 for a URL path or query component. They solve different problems and are not interchangeable.',
        ],
        links: [
          ['URL Encoder', '/url-encoder'],
          ['URL Decoder', '/url-decoder'],
          ['HTML Decoder', '/html-decoder'],
        ],
        linksLabel: 'Related tools',
      },
    ],
    faqs: [
      {
        q: 'Does this HTML encoder convert every character into an entity?',
        a: 'No. It escapes &, <, >, double quotes and apostrophes. Ordinary letters, numbers, accented characters and emoji are left as they are.',
      },
      {
        q: 'Can I use HTML entities to encode JavaScript?',
        a: 'HTML entities are not a general-purpose JavaScript string encoder. Use JavaScript string serialization or a context-aware API for JavaScript values. This tool is intended for HTML entity escaping.',
      },
    ],
  },

  '/html-decoder': {
    sections: [
      {
        h: 'How to decode HTML entities online',
        paras: [
          'Paste text containing HTML character references into the input. The decoded text appears as you type, and you can copy it or download it as a text file. The decoder performs one pass, matching the usual behavior of an HTML entity decoder.',
        ],
        list: [
          'Paste encoded text from HTML source, an email, an RSS feed, an API response or a database field.',
          'Named references such as &amp; and &lt; are decoded alongside decimal and hexadecimal numeric references.',
          'Review the decoded result in the output field, then copy or download it.',
          'To convert ordinary characters into HTML entities instead, open the HTML Encoder.',
        ],
        links: [['HTML Encoder', '/html-encoder'], ['URL Decoder', '/url-decoder'], ['Base64 Decoder', '/base64-decoder']],
        linksLabel: 'Related tools',
      },
      {
        h: 'Named, decimal and hexadecimal HTML entities',
        paras: [
          'HTML character references can identify a character by a readable name, a decimal Unicode code point, or a hexadecimal code point. Different reference forms can represent the same character.',
        ],
        code: '&copy;   &#169;   &#xA9;   ->  ©\n&amp;    &#38;    &#x26;   ->  &\n&lt;     &#60;    &#x3C;   ->  <\n&gt;     &#62;    &#x3E;   ->  >\n&quot;   &#34;    &#x22;   ->  "\n&apos;   &#39;    &#x27;   ->  \'',
      },
      {
        h: 'HTML decoder example',
        paras: ['For example, an encoded paragraph can be decoded back into readable markup. The result is displayed as text in the output field rather than being rendered as a page element.'],
        code: 'Input:\n&lt;p class=&quot;note&quot;&gt;Fish &amp; chips&lt;/p&gt; &copy; 2026\n\nDecoded output:\n<p class="note">Fish & chips</p> © 2026',
      },
      {
        h: 'Decode Unicode and numeric character references',
        paras: [
          'Numeric references can represent characters beyond basic ASCII, including copyright symbols, accented letters and many scripts. A decimal reference starts with &# and a hexadecimal reference starts with &#x. The browser HTML parser resolves valid references to their corresponding characters.',
        ],
        code: '&#233;   ->  é\n&#xE9;  ->  é\n&#128512; -> 😀\n&#x1F600; -> 😀',
      },
      {
        h: 'Why does double-encoded HTML need another pass?',
        paras: [
          'This decoder processes the input once. If &amp;amp; is decoded, the result is &amp; because the original ampersand entity was itself encoded. Run that result through the decoder again only when you know the text was intentionally encoded more than once.',
        ],
        code: 'First pass:  &amp;lt;div&amp;gt;  ->  &lt;div&gt;\nSecond pass: &lt;div&gt;        ->  <div>',
      },
      {
        h: 'HTML decoding vs URL decoding',
        paras: [
          'HTML entity decoding and URL percent-decoding solve different problems. HTML references use forms such as &amp;, &lt; and &#38;. URL-encoded values use percent sequences such as %26, %3C and %20. Choose the decoder that matches the format of your input.',
        ],
        links: [['URL Decoder', '/url-decoder'], ['HTML Encoder', '/html-encoder']],
        linksLabel: 'Related tools',
      },
      {
        h: 'HTML decoding and security',
        paras: [
          'Decoding is not sanitization, validation or deobfuscation of arbitrary scripts. An encoded tag becomes markup characters after decoding. This tool keeps the result in a text field, but if you later insert untrusted output into a web page, use safe text APIs or a maintained HTML sanitizer appropriate to the context.',
        ],
      },
      {
        h: 'Decode HTML entities in code',
        code: '# Python\nimport html\nhtml.unescape(encoded_text)\n\n// C#\nSystem.Net.WebUtility.HtmlDecode(encodedText)\n\n// JavaScript in a browser\nconst textarea = document.createElement("textarea");\ntextarea.innerHTML = encodedText;\nconst decodedText = textarea.value;',
      },
    ],
    faqs: [
      { q: 'Can decoding run scripts in my text?', a: 'No. This tool reads the decoded value from a textarea and displays it in a read-only text field. It does not insert the decoded result into the page as executable markup.' },
    ],
  },

  '/uuid-generator': {
    sections: [
      {
        h: 'UUID v4 vs UUID v7',
        paras: [
          'Version 4 is random: 122 bits from a secure random source. Use it when you need an opaque unique id and do not care about sort order.',
          'Version 7 is time-ordered: the first 48 bits are a Unix millisecond timestamp, then random bits. Newer IDs sort after older ones, which helps B-tree indexes and log streams. Both versions use the same 8-4-4-4-12 string layout.',
        ],
      },
      {
        h: 'GUID vs UUID',
        paras: [
          'GUID is the name Windows and .NET use for the same 128-bit value. This generator can emit uppercase hex and {braces} so the string matches common GUID style, while the bits remain a standard UUID.',
        ],
        links: [
          ['UUID Validator', '/uuid-validator'],
          ['UUID Parser', '/uuid-parser'],
          ['Timestamp Converter', '/timestamp-converter'],
        ],
        linksLabel: 'Related',
      },
      {
        h: 'Generate UUIDs in code',
        code: '// JavaScript (browser or Node 19+)\ncrypto.randomUUID()\n\n// C#\nGuid.NewGuid()\n\n// Python\nimport uuid; uuid.uuid4()',
      },
    ],
    faqs: [
      {
        q: 'Does anything leave my browser?',
        a: 'No. UUIDs are created locally with the Web Crypto API. There is no server round-trip for generation.',
      },
    ],
  },
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
  '/json-to-csharp': {
    sections: [
      {
        h: 'How to convert JSON to C# online',
        list: [
          'Paste a JSON object (API response, config, or sample payload).',
          'Optionally set the root class name and mark properties nullable.',
          'Choose None, System.Text.Json, or Newtonsoft.Json attributes.',
          'Press Generate, then copy or download the C# classes.',
        ],
      },
      {
        h: 'Type inference',
        paras: [
          'The converter maps JSON values to C# types: strings to string, booleans to bool, integers to int (or double for decimals), arrays to List<T>, and nested objects to their own classes. Null samples become object so you can tighten the type by hand.',
        ],
        code: 'JSON string     -> string\nJSON number     -> double (or int when whole)\nJSON true/false -> bool\nJSON null       -> object\nJSON array      -> List<T>\nJSON object     -> nested class',
      },
      {
        h: 'Newtonsoft.Json vs System.Text.Json',
        paras: [
          'System.Text.Json ships with modern .NET and uses [JsonPropertyName("key")]. Newtonsoft.Json is still common in older codebases and uses [JsonProperty("key")]. Pick the option that matches the library already in your project.',
        ],
        code: '// System.Text.Json\nJsonSerializer.Deserialize<Root>(json);\n\n// Newtonsoft.Json\nJsonConvert.DeserializeObject<Root>(json);',
      },
      {
        h: 'Worked example',
        code: '{\n  "id": 1,\n  "email": "user@example.com",\n  "roles": ["admin"]\n}\n\n// becomes (System.Text.Json style)\npublic class Root {\n  [JsonPropertyName("id")]\n  public double Id { get; set; }\n  [JsonPropertyName("email")]\n  public string Email { get; set; }\n  [JsonPropertyName("roles")]\n  public List<string> Roles { get; set; }\n}',
        links: [
          ['JSON Validator', '/json-validator'],
          ['JSON Formatter', '/json-formatter'],
          ['JSON to TypeScript', '/json-to-typescript'],
        ],
        linksLabel: 'Related',
      },
    ],
    faqs: [
      {
        q: 'Does any JSON leave my browser?',
        a: 'No. Conversion runs entirely in your browser. Use that when the sample contains private fields.',
      },
    ],
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
        h: 'What is a Unix timestamp or epoch time?',
        paras: [
          'A Unix timestamp (also called Unix time, epoch time or POSIX time) represents a moment as a count from 1 January 1970 at 00:00:00 UTC. The epoch itself is timestamp 0. A timestamp represents the same instant worldwide; the time zone only affects how that instant is displayed as a calendar date and clock time.',
          'Developers use Unix timestamps in API responses, database records, application logs, analytics events and JWT claims. A numeric value is compact, easy to compare and unambiguous when systems agree on whether it is measured in seconds or milliseconds.'
        ],
        links: [['JWT Decoder', '/jwt-decoder'], ['Timestamp Converter', '/timestamp-converter']],
        linksLabel: 'Related developer tools'
      },
      {
        h: 'Unix timestamp in seconds vs. milliseconds',
        paras: ['Unix and POSIX tools commonly return seconds. JavaScript Date.now() returns milliseconds, which is why two timestamps for the same moment can differ by a factor of 1,000. This converter also accepts microseconds and nanoseconds when you select the matching unit.'],
        list: [
          'Seconds: commonly 10 digits, for example 1700000000.',
          'Milliseconds: commonly 13 digits, for example 1700000000000.',
          'Microseconds: commonly 16 digits, for example 1700000000000000.',
          'Nanoseconds: commonly 19 digits, for example 1700000000000000000.',
          'If a result lands in 1970 or far in the future, check the input unit and use the unit selector to correct it.'
        ]
      },
      {
        h: 'Unix timestamp conversion examples',
        code: `Unix timestamp     UTC date and time
0                  1970-01-01T00:00:00Z
1000000000         2001-09-09T01:46:40Z
1700000000         2023-11-14T22:13:20Z
2147483647         2038-01-19T03:14:07Z`,
        paras: ['For example, 1700000000 seconds is the same instant as 1700000000000 milliseconds. Both convert to 2023-11-14T22:13:20.000Z.']
      },
      {
        h: 'How to get the current Unix timestamp in code',
        code: `// JavaScript: seconds and milliseconds
Math.floor(Date.now() / 1000)
Date.now()

# Python: seconds
import time
int(time.time())

// C#: seconds and milliseconds
DateTimeOffset.UtcNow.ToUnixTimeSeconds()
DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()

// Java
Instant.now().getEpochSecond()

// PHP
time()

// Go
time.Now().Unix()

-- PostgreSQL
SELECT EXTRACT(EPOCH FROM NOW());

-- MySQL
SELECT UNIX_TIMESTAMP();

# Linux / macOS shell
date +%s`,
        links: [['JWT Decoder', '/jwt-decoder'], ['Timestamp Converter', '/timestamp-converter'], ['Cron Expression Parser', '/cron-expression-parser']],
        linksLabel: 'Related developer tools'
      },
      {
        h: 'Where developers use Unix timestamps',
        list: [
          'API responses: interpret created_at, updated_at, expires_at and other numeric date fields.',
          'JWT tokens: inspect exp and iat claims to understand when a token expires or was issued.',
          'Application logs: translate numeric event times into readable dates while debugging.',
          'Databases: inspect epoch values stored in SQL or NoSQL records.',
          'Testing: create a known timestamp for a test fixture or compare two event times.'
        ],
        links: [['JWT Decoder', '/jwt-decoder'], ['Timestamp Converter', '/timestamp-converter']]
      },
      {
        h: 'Unix epoch and the Year 2038 problem',
        paras: ['The Unix epoch begins at 1970-01-01 00:00:00 UTC. A signed 32-bit integer can store a maximum positive value of 2,147,483,647 seconds, which corresponds to 2038-01-19 03:14:07 UTC. Systems that still use signed 32-bit time storage need to migrate to a wider representation; modern 64-bit timestamps avoid this particular overflow limit.']
      }
    ],
    faqs: [
      q('What is the Unix timestamp for January 1, 1970?', 'The Unix timestamp is 0 at 1970-01-01 00:00:00 UTC. This moment is known as the Unix epoch.'),
      q('Can I use this as a date to epoch converter?', 'Yes. Enter a date string, preferably in ISO 8601 format, in the input. The result displays the matching Unix timestamp in seconds, milliseconds, microseconds and nanoseconds.'),
      q('Does a Unix timestamp include a time zone?', 'No. It represents an instant relative to UTC and contains no time-zone identifier. The converter displays the instant in UTC and your browser\'s local time.'),
    ],
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
        paras: ['RGB stores a color as three decimal channels: red, green and blue. Each channel ranges from 0 to 255. To create a six-digit HEX color, convert each channel to a two-digit base-16 value and concatenate the pairs in RGB order after a # symbol.'],
        code: 'rgb(255, 87, 51)\nR: 255 = FF\nG: 87 = 57\nB: 51 = 33\nHEX: #FF5733',
      },
      {
        h: 'RGB to HEX conversion formula',
        paras: ['Convert each decimal channel independently to hexadecimal and pad values shorter than two digits with a leading zero. The first pair is red, the second is green and the third is blue. The order matters: do not swap the channels.'],
        code: 'HEX = # + hex(R).padStart(2, "0") + hex(G).padStart(2, "0") + hex(B).padStart(2, "0")\n\nRGB(32, 7, 1) = #200701',
      },
      {
        h: 'RGB and HEX color codes in CSS',
        paras: ['CSS accepts both rgb() notation and hexadecimal color notation. They describe the same sRGB color when the channel values match. HEX is common in design systems, style guides and CSS variables; rgb() can be convenient when editing individual channels.'],
        code: '/* These represent the same color */\ncolor: rgb(59, 130, 246);\ncolor: #3B82F6;',
      },
      {
        h: 'Convert RGBA to 8-digit HEX',
        paras: ['This converter also accepts rgba() input. When an alpha channel is supplied, the result includes an eighth hexadecimal digit pair after the RGB channels. The alpha value from 0 to 1 is scaled to a byte from 00 to FF.'],
        code: 'rgba(59, 130, 246, 0.5)  ->  #3B82F680\n\nThe final 80 pair represents approximately 50% opacity.',
      },
      {
        h: 'RGB input formats and supported ranges',
        list: ['Enter rgb(255, 87, 51), rgba(255, 87, 51, 0.5), or three comma- or space-separated channel values.', 'Each red, green and blue channel must be a whole number from 0 through 255.', 'The converter also accepts HEX input and returns the corresponding RGB or RGBA notation, so it can be used in either direction.', 'The output uses uppercase hexadecimal digits and includes the leading # symbol.', 'HSL, named CSS colors and percentage RGB channels are not supported by this converter.'],
        links: [['HEX to RGB Converter', '/hex-to-rgb'], ['Color Converter', '/color-converter'], ['Decimal to Hex Converter', '/decimal-to-hex'], ['Guide: RGB to HEX conversion, formula and code', '/guides/rgb-to-hex-conversion']],
        linksLabel: 'Related tools and guide',
      },
    ],
    faqs: [
      q('How do I convert RGB to HEX?', 'Convert the red, green and blue values separately to two-digit hexadecimal numbers, then join them in that order after #. For example, rgb(255, 87, 51) becomes #FF5733.'),
      q('What is the HEX code for RGB(255, 0, 0)?', 'RGB(255, 0, 0) is #FF0000. The red channel 255 becomes FF, while green and blue zero values become 00.'),
      q('What is the RGB range for a HEX color code?', 'Each standard RGB channel is an integer from 0 to 255. Each channel maps to one byte, represented by two hexadecimal digits from 00 to FF.'),
      q('Why does RGB(32, 7, 1) become #200701?', 'Each channel must occupy exactly two hexadecimal digits. Decimal 32 is 20, 7 is 07 and 1 is 01, so the combined code is #200701.'),
      q('Does this RGB to HEX converter support RGBA?', 'Yes. You can enter rgba(r, g, b, a). The output is an eight-digit HEX value: #RRGGBBAA, where the last pair represents alpha transparency.'),
      q('How is the alpha value converted to HEX?', 'The alpha channel is between 0 and 1. The converter multiplies it by 255, rounds to the nearest whole number and writes that value as a two-digit hexadecimal pair.'),
      q('Can I convert RGB to HEX for CSS?', 'Yes. Copy the resulting #RRGGBB code into a CSS color property, such as color: #FF5733; or background-color: #FF5733;.'),
      q('Is RGB to HEX conversion lossless?', 'For integer RGB channels from 0 to 255, conversion to six-digit HEX is exact. Both formats represent the same three channel values.'),
      q('Can I enter RGB numbers without the rgb() function?', 'Yes. Enter three comma-separated values such as 255, 87, 51 or three space-separated values such as 255 87 51.'),
      q('Why is my RGB value invalid?', 'Each channel must be a whole number between 0 and 255. Check that you entered exactly three channel values and did not use percentages, decimals or values outside the supported range.'),
      q('Does this tool convert HEX back to RGB too?', 'Yes. Enter a supported HEX value such as #FF5733 to get rgb(255, 87, 51). Three- and four-digit shorthand as well as six- and eight-digit HEX are accepted when entered with #.'),
      q('What is the difference between RGB and HEX?', 'RGB writes the red, green and blue channels as decimal numbers. HEX writes the same channels as hexadecimal pairs. For example, rgb(255, 87, 51) and #FF5733 describe the same color.'),
      q('Does the converter support HSL or named colors?', 'No. Use the Color Converter for additional color formats. This page focuses on RGB, RGBA and HEX values.'),
      q('Is RGB the same as RBG?', 'The standard order is RGB: red, green, blue. RBG is usually a typing mistake. Some hardware uses a different channel order, so check the device documentation before changing channel positions.'),
    ],
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
        h: 'Decimal to hexadecimal conversion chart',
        paras: ['Use this decimal to hex chart to look up common base 10 values and their base 16 equivalents. Hexadecimal uses A through F for decimal values 10 through 15.'],
        code: `Decimal  Hex   Decimal  Hex
0        0     16       10
1        1     20       14
9        9     25       19
10       A     32       20
11       B     64       40
12       C     100      64
13       D     128      80
14       E     255      FF
15       F     256      100
                 1000     3E8
                 4095     FFF
                 65535    FFFF`
      },
      {
        h: 'How to convert decimal to hexadecimal',
        paras: ['To convert a whole decimal number to hex, divide it by 16 and record the remainder. Divide the quotient by 16 again until it reaches zero. Read the remainders in reverse order. Remainders from 10 to 15 become A, B, C, D, E and F.'],
        code: `255 ÷ 16 = 15 remainder 15  →  F
 15 ÷ 16 =  0 remainder 15  →  F
Read the remainders upwards: FF

Therefore: 255 (base 10) = FF (base 16)`,
      },
      {
        h: 'Decimal to hex examples',
        paras: ['These worked examples show how a decimal to hexadecimal calculator represents familiar values.'],
        code: `Decimal     Hexadecimal
10          A
16          10
100         64
255         FF
256         100
4095        FFF

For 4095:
4095 ÷ 16 = 255 remainder 15 (F)
 255 ÷ 16 =  15 remainder 15 (F)
  15 ÷ 16 =   0 remainder 15 (F)
Read upwards: FFF`,
      },
      {
        h: 'Decimal to hexadecimal in programming',
        paras: ['Most programming languages provide a built-in way to convert an integer from decimal to hexadecimal. These examples use the value 255.'],
        code: `// JavaScript
(255).toString(16).toUpperCase(); // "FF"

# Python
format(255, "X")                  # "FF"

// C#
255.ToString("X")                 // "FF"
Convert.ToString(255, 16)          // "ff"`,
        links: [['Hex to Decimal Converter', '/hex-to-decimal'], ['Number Base Converter', '/number-base-converter']],
        linksLabel: 'Related converters'
      },
      {
        h: 'Decimal to hex in this tool',
        list: ['The page opens with From set to Decimal (10) and To set to Hex (16). Enter a whole number in the input field.', 'The hexadecimal result appears in uppercase and does not include a 0x prefix.', 'The converter uses the integer portion of the input; digits after a decimal point are not converted.', 'For RGB colour channels, use the RGB to HEX converter instead of converting the three values separately.'],
        links: [['Step-by-step decimal to hexadecimal guide', '/guides/decimal-to-hex-conversion'], ['Hex to Decimal', '/hex-to-decimal'], ['RGB to HEX Converter', '/rgb-to-hex'], ['Number Base Converter', '/number-base-converter']],
        linksLabel: 'Related tools and guide'
      },
    ],
    faqs: [q('Does it add the 0x prefix?', 'No. The result is shown without a 0x prefix. Add 0x yourself if your code or documentation requires it.')],
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
        h: 'Down for everyone or just you? How to read the result',
        paras: ['This checker sends the request from your own browser, so it answers one question: can I reach this site from here? It cannot prove on its own that a site is down for every visitor. Compare it with a second vantage point:'],
        list: ['Unreachable or Timed out here, but the site loads on another network or device: the problem is local (DNS cache, VPN, firewall, ad blocker or ISP).', 'Up here, but the site fails for other people: the cause is probably regional, such as a CDN, DNS or routing problem. Ask someone in another location to test it.', 'Fails here and everywhere else you try: the server or its host is probably down. A monitoring service that tests from several regions can confirm it; this tool does not do that.', 'Up here, but the page will not load properly in your browser tab: the server is answering, so look at the page itself (a script error, a login redirect or a cached redirect).'],
        links: [['Guide: how to check if a website is down', '/guides/check-if-a-website-is-down']],
        linksLabel: 'Step-by-step guide',
      },
      {
        h: 'Why another website down checker may show a different result',
        paras: ['Website status depends on where and how the request is made. This page checks from your browser, while server-side services may test from remote data centres or several geographic regions. Those checks can legitimately disagree when a site has a regional CDN, DNS, routing, firewall or hosting issue.'],
        list: ['A site may load from your network but fail from another country or ISP.', 'A firewall, VPN, proxy, DNS filter or browser extension can affect requests from your device.', 'Cross-origin restrictions can hide the HTTP response details from a browser even when the server has replied.', 'For a wider picture, compare this result with a second network or a multi-region monitoring service.'],
      },
      {
        h: 'Limits to keep in mind',
        list: ['Many sites block cross-origin reads. In that case the tool can only tell whether the server answered, not the exact status code.', 'http:// addresses cannot be checked from this https:// page.', 'A site that is down for others can still load for you, and the reverse. It is not a worldwide uptime monitor and does not provide scheduled checks, uptime history or outage alerts.'],
        links: [['Guide: how to check if a website is down', '/guides/check-if-a-website-is-down'], ['URL Encoder', '/url-encoder'], ['JSON Validator', '/json-validator']],
        linksLabel: 'Related',
      },
    ],
    faqs: [q('Is my website up right now?', 'Enter your domain and press Check status. A result of Up means your browser got an answer from the server a moment ago. Check again from another network to see whether visitors elsewhere get the same result.'), q('Is this URL working?', 'Paste the full address, including the path. Up means the server answered normally. Online (client error) means the server is alive but that address returned a 4xx error such as 404, and Server error means it returned a 5xx code.'), q('Where do I find a website status page?', 'Many services publish an official status page, often at a status subdomain such as status.example.com. This tool does not read those pages; it tests whether the address responds from your browser.'), q('Does it work for https sites?', 'Yes. Enter the domain or an https:// address. Plain http:// addresses cannot be tested from this https:// page because browsers block them.'), q('Is it down for everyone or just me?', 'This tool cannot prove a site is down for everyone, because it tests from your own browser and network. If it shows Unreachable here, test the same address on another network or device. If it works there, the problem is local. If it fails everywhere, the site or its host is probably down.'), q('How do I check if a website is down?', 'Enter the domain or URL and press Check status. If it is reachable here but not in your usual browser, the problem is likely local: try another network, clear the DNS cache or turn off a VPN.'), q('Why does it say reachable without a status code?', 'Many sites do not let other pages read their response. The browser can still tell that the server answered, so the tool reports reachable without the exact code.'), q('Does this website work?', 'Enter its address and press Check status. Up means the server answered a request from your browser a moment ago, so the site is reachable. It does not test that every page, login or form on the site works, only that the address responds.'), q('How is this different from a server-side down checker?', 'A server-side checker sends the request from its own servers, often from several regions, so it can show whether a site is down for everyone. This tool sends it from your browser, so it shows what your own connection can reach and sends nothing to us. Use both to tell a local problem from an outage.')],
  },
};
