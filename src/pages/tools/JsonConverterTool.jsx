import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
export default function JsonConverterTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const lang = path.split('-to-')[1];

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const getType = (val) => {
    if (val === null) return 'any';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const convert = () => {
    try {
      if (!inp.trim()) return;
      const p = JSON.parse(inp);
      let res = '';
      
      const generateProps = (obj) => {
        let props = '';
        for(let key in obj) {
          const t = getType(obj[key]);
          if (lang === 'csharp') {
            const ct = t==='number'?'double': t==='boolean'?'bool': t==='string'?'string':'object';
            props += `    public ${ct} ${capitalize(key)} { get; set; }\n`;
          } else if (lang === 'typescript') {
            const ct = t==='number'?'number': t==='boolean'?'boolean': t==='string'?'string':'any';
            props += `    ${key}: ${ct};\n`;
          } else if (lang === 'java') {
            const ct = t==='number'?'Double': t==='boolean'?'Boolean': t==='string'?'String':'Object';
            props += `    private ${ct} ${key};\n    public ${ct} get${capitalize(key)}() { return ${key}; }\n    public void set${capitalize(key)}(${ct} ${key}) { this.${key} = ${key}; }\n`;
          } else if (lang === 'python') {
            props += `    ${key}: ${t==='number'?'float': t==='boolean'?'bool': t==='string'?'str':'Any'}\n`;
          } else if (lang === 'go') {
            props += `    ${capitalize(key)} ${t==='number'?'float64': t==='boolean'?'bool': t==='string'?'string':'interface{}'} \`json:"${key}"\`\n`;
          } else if (lang === 'php') {
            props += `    public $${key};\n`;
          } else if (lang === 'kotlin') {
            const ct = t==='number'?'Double': t==='boolean'?'Boolean': t==='string'?'String':'Any';
            props += `    val ${key}: ${ct}?\n`;
          }
        }
        return props;
      };

      if (lang === 'csharp') res = `public class Root {\n${generateProps(p)}}`;
      else if (lang === 'typescript') res = `export interface Root {\n${generateProps(p)}}`;
      else if (lang === 'java') res = `public class Root {\n${generateProps(p)}}`;
      else if (lang === 'python') res = `from typing import Any\nfrom dataclasses import dataclass\n\n@dataclass\nclass Root:\n${generateProps(p) || '    pass'}`;
      else if (lang === 'go') res = `type Root struct {\n${generateProps(p)}}`;
      else if (lang === 'php') res = `class Root {\n${generateProps(p)}}`;
      else if (lang === 'kotlin') res = `data class Root(\n${generateProps(p)})`;

      setOut(res);
      setErr('');
    } catch(e) { setErr(e.message); setOut(''); }
  };

  return (
    <ToolLayout title={`JSON to ${lang.toUpperCase()}`} desc={`Generate ${lang} models from JSON.`} path={path}>
      <div className="p-6 grid md:grid-cols-2 gap-4 h-[600px]">
        <div className="flex flex-col gap-4">
          <textarea className="w-full flex-1 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Paste JSON..."></textarea>
          <button onClick={convert} className="py-2 bg-indigo-600 text-white rounded font-bold">Convert to {lang}</button>
          {err && <div className="text-red-600 p-2 bg-red-50 border rounded text-sm">{err}</div>}
        </div>
        <OutputBox value={out} label="Generated code" placeholder="Generated code..." className="h-full" textareaClassName="border-indigo-200 dark:border-indigo-800" />
      </div>
    </ToolLayout>
  );
}