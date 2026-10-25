import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import FileDropZone from '../../components/FileDropZone';
import CryptoJS from 'crypto-js';

export default function HashTool({ path }) {
  const [inp,setInp]=useState(''); const [out,setOut]=useState(''); const [fileName,setFileName]=useState('');
  const hash=(value)=>{setInp(value);if(!value){setOut('');return;}setOut(path.includes('md5')?CryptoJS.MD5(value).toString():path.includes('sha512')?CryptoJS.SHA512(value).toString():CryptoJS.SHA256(value).toString());};
  const hashFile=(file)=>{if(!file)return;setFileName(file.name);const r=new FileReader();r.onload=()=>{const word=CryptoJS.lib.WordArray.create(r.result);setOut(path.includes('md5')?CryptoJS.MD5(word).toString():path.includes('sha512')?CryptoJS.SHA512(word).toString():CryptoJS.SHA256(word).toString());};r.readAsArrayBuffer(file);};
  return <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Generate text or file hashes locally in your browser." path={path}><div className="p-6 space-y-4">
    <textarea className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded min-h-[150px]" value={inp} onChange={e=>hash(e.target.value)} placeholder="String to hash…" />
    <FileDropZone accept="*/*" onFile={hashFile} label="Choose or drop a file to hash" />
    {fileName&&<p className="text-sm text-gray-500">File: {fileName}</p>}
    {out&&<OutputBox value={out} label="Generated hash" downloadFilename={`${path.split('/').pop()}.txt`} textareaClassName="break-all text-xl"/>}
    <button type="button" onClick={()=>{setInp('');setOut('');setFileName('')}} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear</button>
    {path.includes('md5')&&<p className="text-xs text-amber-700 dark:text-amber-300">MD5 is not suitable for passwords, signatures or security-sensitive integrity checks. Use SHA-256 or SHA-512 when a cryptographic hash is required.</p>}
  </div></ToolLayout>;
}
