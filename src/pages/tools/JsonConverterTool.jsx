import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import FileDropZone from '../../components/FileDropZone';

const typeInfo = (value) => {
  if (value === null) return { kind: 'null', child: null };
  if (Array.isArray(value)) return { kind: 'array', child: value.length ? typeInfo(value[0]) : { kind: 'any' } };
  if (typeof value === 'object') return { kind: 'object', child: value };
  return { kind: typeof value };
};
const pascal = (s) => String(s).replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toUpperCase()) || 'Root';
const safeProp = (s) => /^[A-Za-z_$][\w$]*$/.test(s) ? s : JSON.stringify(s);

export default function JsonConverterTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [optional, setOptional] = useState(false);
  const lang = path.split('-to-')[1];

  const convert = () => {
    try {
      if (!inp.trim()) throw new Error('Paste a JSON object first.');
      const root = JSON.parse(inp);
      if (!root || Array.isArray(root) || typeof root !== 'object') throw new Error('The root JSON value should be an object.');
      const classes = [];
      const seen = new Set();
      const nameFor = (key) => pascal(key);
      const scalar = (info, key) => {
        if (info.kind === 'string') return { csharp:'string', typescript:'string', java:'String', python:'str', go:'string', php:'string', kotlin:'String' }[lang] || 'any';
        if (info.kind === 'number') return { csharp:'double', typescript:'number', java:'Double', python:'float', go:'float64', php:'float', kotlin:'Double' }[lang] || 'any';
        if (info.kind === 'boolean') return { csharp:'bool', typescript:'boolean', java:'Boolean', python:'bool', go:'bool', php:'bool', kotlin:'Boolean' }[lang] || 'any';
        if (info.kind === 'null') return { csharp:'object', typescript:'unknown', java:'Object', python:'Any', go:'interface{}', php:'mixed', kotlin:'Any?' }[lang] || 'any';
        return 'any';
      };
      const makeType = (value, key) => {
        const info = typeInfo(value);
        if (info.kind === 'object') { const n = nameFor(key); buildClass(n, value); return n; }
        if (info.kind === 'array') {
          if (info.child?.kind === 'object' && info.child.child) { const n = nameFor(key); buildClass(n, info.child.child); return { csharp:`List<${n}>`, typescript:`${n}[]`, java:`List<${n}>`, python:`list[${n}]`, go:`[]${n}`, php:`array`, kotlin:`List<${n}>` }[lang] || `${n}[]`; }
          const inner = info.child ? (info.child.kind === 'object' ? 'object' : scalar(info.child, key)) : 'any';
          return { csharp:`List<${inner}>`, typescript:`${inner}[]`, java:`List<${inner}>`, python:`list[${inner}]`, go:`[]${inner}`, php:'array', kotlin:`List<${inner}>` }[lang] || `${inner}[]`;
        }
        return scalar(info, key);
      };
      const buildClass = (name, obj) => {
        if (seen.has(name)) return; seen.add(name);
        const props = Object.entries(obj).map(([key, value]) => ({ key, type: makeType(value, key) }));
        classes.push({ name, props });
      };
      buildClass(rootName || 'Root', root);

      const render = (cls) => {
        if (lang === 'csharp') return `public class ${cls.name} {\n${cls.props.map(p=>`    public ${p.type}${optional?'?':''} ${pascal(p.key)} { get; set; }`).join('\n')}\n}`;
        if (lang === 'typescript') return `export interface ${cls.name} {\n${cls.props.map(p=>`    ${safeProp(p.key)}${optional?'?':''}: ${p.type};`).join('\n')}\n}`;
        if (lang === 'java') return `public class ${cls.name} {\n${cls.props.map(p=>`    private ${p.type} ${p.key};`).join('\n')}\n}`;
        if (lang === 'python') return `@dataclass\nclass ${cls.name}:\n${cls.props.map(p=>`    ${p.key}: ${p.type}${optional?' | None':''}`).join('\n') || '    pass'}`;
        if (lang === 'go') return `type ${cls.name} struct {\n${cls.props.map(p=>`    ${pascal(p.key)} ${p.type} \`json:"${p.key}"\``).join('\n')}\n}`;
        if (lang === 'php') return `class ${cls.name} {\n${cls.props.map(p=>`    public ${p.type} $${p.key};`).join('\n')}\n}`;
        if (lang === 'kotlin') return `data class ${cls.name}(\n${cls.props.map((p,i)=>`    val ${safeProp(p.key)}: ${p.type}${optional?'?':''}${i < cls.props.length-1?',':''}`).join('\n')}\n)`;
        return '';
      };
      let header = '';
      if (lang === 'python') header = 'from dataclasses import dataclass\nfrom typing import Any, Optional, List\n\n';
      if (lang === 'java') header = 'import java.util.List;\n\n';
      if (lang === 'csharp') header = 'using System.Collections.Generic;\n\n';
      setOut(header + classes.reverse().map(render).join('\n\n'));
      setErr('');
    } catch (e) { setErr(e.message || 'Could not convert JSON.'); setOut(''); }
  };

  const loadFile = (file) => { if (!file) return; const r = new FileReader(); r.onload = () => setInp(String(r.result || '')); r.readAsText(file); };

  return (
    <ToolLayout title={`JSON to ${lang.toUpperCase()}`} desc={`Generate nested ${lang} models from JSON with configurable root naming.`} path={path}>
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium" htmlFor="root-name">Root type name</label>
          <input id="root-name" value={rootName} onChange={e=>setRootName(e.target.value)} className="px-3 py-2 border rounded bg-white dark:bg-gray-900" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={optional} onChange={e=>setOptional(e.target.checked)} /> Optional / nullable properties</label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <textarea className="w-full min-h-[360px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Paste JSON object…" spellCheck="false" />
            <FileDropZone accept=".json,application/json" onFile={loadFile} label="Choose or drop a JSON file" />
            <button onClick={convert} className="w-full py-2 bg-indigo-600 text-white rounded font-bold">Generate {lang} models</button>
            {err && <div role="alert" className="text-red-600 p-3 bg-red-50 border rounded text-sm">{err}</div>}
          </div>
          <OutputBox value={out} label="Generated code" placeholder="Generated code…" className="min-h-[430px]" textareaClassName="border-indigo-200 dark:border-indigo-800" downloadFilename={`${lang}-models.txt`} />
        </div>
      </div>
    </ToolLayout>
  );
}
