import { useEffect, useRef, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import FileDropZone from '../../components/FileDropZone';
// crypto-js is loaded on demand so it stays out of the main bundle.
let cryptoLib;
const loadCrypto = () => (cryptoLib ??= import('crypto-js').then((m) => m.default));

export default function HashTool({ path }) {
  const [inp,setInp]=useState(''); const [out,setOut]=useState(''); const [fileName,setFileName]=useState('');
  const seq=useRef(0);
  useEffect(()=>{loadCrypto();},[]);
  const digest=(C,v)=>path.includes('md5')?C.MD5(v).toString():path.includes('sha512')?C.SHA512(v).toString():C.SHA256(v).toString();
  const hash=async(value)=>{setInp(value);const id=++seq.current;if(!value){setOut('');return;}const C=await loadCrypto();if(id===seq.current)setOut(digest(C,value));};
  const hashFile=(file)=>{if(!file)return;setFileName(file.name);const id=++seq.current;const r=new FileReader();r.onload=async()=>{const C=await loadCrypto();if(id!==seq.current)return;const word=C.lib.WordArray.create(r.result);setOut(digest(C,word));};r.readAsArrayBuffer(file);};
  return <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Generate text or file hashes locally in your browser." path={path}><div className="p-6 space-y-4">
    <textarea className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded min-h-[150px]" value={inp} onChange={e=>hash(e.target.value)} placeholder="String to hash…" />
    <FileDropZone accept="*/*" onFile={hashFile} label="Choose or drop a file to hash" />
    {fileName&&<p className="text-sm text-gray-500">File: {fileName}</p>}
    {out&&<OutputBox value={out} label="Generated hash" downloadFilename={`${path.split('/').pop()}.txt`} textareaClassName="break-all text-xl"/>}
    <button type="button" onClick={()=>{setInp('');setOut('');setFileName('')}} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear</button>
    {path.includes('md5')&&<p className="text-xs text-amber-700 dark:text-amber-300">MD5 is not suitable for passwords, signatures or security-sensitive integrity checks. Use SHA-256 or SHA-512 when a cryptographic hash is required.</p>}
  </div></ToolLayout>;
}
