import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import CopyButton from '../../components/CopyButton';
import DownloadButton from '../../components/DownloadButton';
import { useLocalStorage } from '../../utils/useLocalStorage';

const EXAMPLES = { email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', url: 'https?://[^\\s]+', digits: '\\d+', words: '\\b[A-Za-z]+\\b' };
export default function RegexTool({ path }) {
  const [regex,setRegex]=useLocalStorage(`odt:${path}:regex`,''); const [flags,setFlags]=useLocalStorage(`odt:${path}:flags`,'g'); const [text,setText]=useLocalStorage(`odt:${path}:text`,'');
  const [replacement,setReplacement]=useState(''); const [out,setOut]=useState([]); const [replaced,setReplaced]=useState(''); const [err,setErr]=useState('');
  const isGenerator=path.includes('generator');
  const testRegex=()=>{ try{setErr('');const re=new RegExp(regex,flags);setOut([...text.matchAll(re)]);setReplaced(text.replace(re,replacement));}catch(e){setErr(e.message);setOut([]);setReplaced('');} };
  const loadExample=(k)=>{setRegex(EXAMPLES[k]);setFlags('g');setText(k==='email'?'ada@example.com\nnot-an-email\nhello@site.dev':'Try '+k+' with 123 and https://example.com');};
  const generated = useMemo(()=>regex ? `/${regex}/${flags}` : '',[regex,flags]);
  return <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Test, generate and explain regular expressions locally in your browser." path={path}>
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2"><input value={regex} onChange={e=>setRegex(e.target.value)} className="flex-1 min-w-[220px] p-3 font-mono border rounded bg-gray-50 dark:bg-gray-900" placeholder={isGenerator?'Describe or enter a regex pattern…':'Pattern'} /><input value={flags} onChange={e=>setFlags(e.target.value)} className="w-24 p-3 font-mono border rounded bg-gray-50 dark:bg-gray-900" aria-label="Regex flags" placeholder="gim" /><button onClick={testRegex} className="px-6 py-2 bg-indigo-600 text-white rounded">{isGenerator?'Generate / Test':'Test regex'}</button></div>
      <div className="flex flex-wrap gap-2">{Object.keys(EXAMPLES).map(k=><button key={k} onClick={()=>loadExample(k)} className="px-3 py-1.5 text-xs rounded bg-gray-200 dark:bg-gray-700">Example: {k}</button>)}</div>
      <textarea className="w-full h-36 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={text} onChange={e=>setText(e.target.value)} placeholder="Test string…" />
      <div className="grid md:grid-cols-2 gap-4"><div className="p-4 border rounded bg-gray-50 dark:bg-gray-900"><h3 className="font-bold mb-2">Pattern</h3><code className="break-all">{generated || '—'}</code></div><div className="p-4 border rounded bg-gray-50 dark:bg-gray-900"><h3 className="font-bold mb-2">Replacement</h3><div className="flex gap-2"><input value={replacement} onChange={e=>setReplacement(e.target.value)} className="flex-1 p-2 border rounded bg-white dark:bg-gray-800" placeholder="$& or replacement text" /><CopyButton text={replaced} /></div>{replaced && <pre className="mt-2 whitespace-pre-wrap text-sm">{replaced}</pre>}</div></div>
      {err&&<div role="alert" className="text-red-600 p-3 bg-red-50 border rounded">{err}</div>}
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900"><div className="flex items-center justify-between mb-2"><h3 className="font-bold">Matches ({out.length})</h3><div className="flex gap-2"><CopyButton text={out.map(m=>m[0]).join('\n')} label="Copy matches" disabled={!out.length}/><DownloadButton text={out.map(m=>m[0]).join('\n')} filename="regex-matches.txt" label="Download" /></div></div>{out.map((m,i)=><div key={i} className="p-2 mb-2 bg-white dark:bg-gray-800 border rounded"><span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold break-all">{m[0]}</span><span className="text-xs text-gray-500 ml-2">Index: {m.index}{m.length ? ` · Length: ${m[0].length}`:''}</span></div>)}</div>
    </div></ToolLayout>;
}
