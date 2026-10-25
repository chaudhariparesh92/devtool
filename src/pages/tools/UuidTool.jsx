import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

function uuidv7() {
  const bytes=new Uint8Array(16); crypto.getRandomValues(bytes); const ms=BigInt(Date.now());
  for(let i=5;i>=0;i--) bytes[i]=Number((ms>>BigInt((5-i)*8))&255n);
  bytes[6]=(bytes[6]&0x0f)|0x70; bytes[8]=(bytes[8]&0x3f)|0x80;
  const h=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join(''); return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
export default function UuidTool({ path }) {
  const [inp,setInp]=useState('');const [out,setOut]=useState('');const [count,setCount]=useState(10);const [version,setVersion]=useState('v4');
  const isGen=path.includes('generator'),isVal=path.includes('validator'),isPar=path.includes('parser');
  const generate=()=>{const fn=version==='v7'?uuidv7:crypto.randomUUID;setOut(Array.from({length:count},()=>fn()).join('\n'));};
  const process=()=>{const r=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;const v=inp.trim();const ok=r.test(v);if(isVal)setOut(ok?'Valid UUID':'Invalid UUID');else if(isPar){if(!ok)return setOut('Invalid UUID to parse.');setOut(`Version: ${v.charAt(14)}\nVariant: RFC 9562 (variant 1)\nTimestamp: ${v.charAt(14)==='7'?'UUIDv7 carries a millisecond timestamp in its first 48 bits.':'Not a timestamp-bearing UUID version.'}`);}};
  return <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Generate, validate and inspect RFC UUIDs in your browser." path={path}><div className="p-6 flex flex-col items-center gap-6">
    {isGen?<div className="w-full max-w-2xl space-y-4"><div className="flex flex-wrap items-center gap-3"><label>Quantity</label><select value={count} onChange={e=>setCount(Number(e.target.value))} className="p-2 border rounded dark:bg-gray-700"><option>1</option><option>5</option><option>10</option><option>25</option><option>50</option><option>100</option></select><select value={version} onChange={e=>setVersion(e.target.value)} className="p-2 border rounded dark:bg-gray-700"><option value="v4">UUID v4</option><option value="v7">UUID v7</option></select><button onClick={generate} className="px-6 py-2 bg-indigo-600 text-white rounded font-bold">Generate UUIDs</button></div>{out&&<OutputBox value={out} label="Generated UUIDs" className="w-full h-64" textareaClassName="text-left"/>}</div>:<div className="w-full max-w-2xl space-y-4"><input type="text" className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Enter UUID…"/><button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded">{isVal?'Validate UUID':'Parse UUID'}</button>{out&&<div className="relative p-4 pr-24 font-bold border rounded bg-gray-50 dark:bg-gray-900"><pre className="whitespace-pre-wrap">{out}</pre><CopyButton text={out} className="absolute top-2 right-2"/></div>}</div>}
  </div></ToolLayout>;
}
