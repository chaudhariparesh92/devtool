import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import CopyButton from '../../components/CopyButton';
import FileDropZone from '../../components/FileDropZone';

export default function DiffTool({ path }) {
  const [t1,setT1]=useState(''); const [t2,setT2]=useState(''); const [diffRes,setDiffRes]=useState([]); const [mode,setMode]=useState('lines'); const [ignoreWhitespace,setIgnoreWhitespace]=useState(false);
  const compare=async()=>{ const Diff=await import('diff'); const a=ignoreWhitespace?t1.replace(/\s+/g,' ').trim():t1; const b=ignoreWhitespace?t2.replace(/\s+/g,' ').trim():t2; setDiffRes(mode==='words'?Diff.diffWords(a,b):mode==='chars'?Diff.diffChars(a,b):Diff.diffLines(a,b)); };
  const diffText=useMemo(()=>diffRes.map(p=>(p.added?'+ ':p.removed?'- ':'  ')+p.value).join(''),[diffRes]);
  const load=(setter)=>(file)=>{if(!file)return;const r=new FileReader();r.onload=()=>setter(String(r.result||''));r.readAsText(file);};
  return <ToolLayout title="Diff Checker" desc="Compare text, code or files with line, word and character differences." path={path}><div className="p-6 space-y-4">
    <div className="flex flex-wrap gap-3 items-center"><label className="text-sm font-medium">Diff mode</label><select value={mode} onChange={e=>setMode(e.target.value)} className="px-3 py-2 border rounded bg-white dark:bg-gray-900"><option value="lines">Lines</option><option value="words">Words</option><option value="chars">Characters</option></select><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ignoreWhitespace} onChange={e=>setIgnoreWhitespace(e.target.checked)}/> Ignore whitespace</label><button onClick={compare} className="px-6 py-2 bg-indigo-600 text-white rounded font-bold">Compare</button></div>
    <div className="grid md:grid-cols-2 gap-4"><div><textarea className="w-full h-56 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={t1} onChange={e=>setT1(e.target.value)} placeholder="Original text…"/><FileDropZone onFile={load(setT1)} label="Drop original file or choose one" /></div><div><textarea className="w-full h-56 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={t2} onChange={e=>setT2(e.target.value)} placeholder="Modified text…"/><FileDropZone onFile={load(setT2)} label="Drop modified file or choose one" /></div></div>
    <div className="flex justify-end"><CopyButton text={diffText} label="Copy diff" disabled={!diffText}/></div><div className="p-4 border rounded bg-white dark:bg-gray-900 min-h-[140px] whitespace-pre-wrap font-mono text-sm overflow-auto">{diffRes.map((part,i)=><span key={i} className={part.added?'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300':part.removed?'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300':'text-gray-600 dark:text-gray-400'}>{part.value}</span>)}</div>
  </div></ToolLayout>;
}
