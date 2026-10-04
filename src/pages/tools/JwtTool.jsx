import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import CryptoJS from 'crypto-js';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

export default function JwtTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState(null);
  const [secret, setSecret] = useState('');
  const [genPayload, setGenPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  
  const isDecode = path.includes('decode');

  const decode = () => {
    try {
      const parts = inp.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT');
      setOut({ header: JSON.stringify(JSON.parse(atob(parts[0])), null, 2), payload: JSON.stringify(JSON.parse(atob(parts[1])), null, 2), sig: parts[2] });
    } catch(e) { alert("Invalid JWT"); setOut(null); }
  };

  const base64url = (source) => CryptoJS.enc.Base64.stringify(source).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

  const generate = () => {
    try {
      const header = { alg: "HS256", typ: "JWT" };
      const strH = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
      const strP = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(JSON.parse(genPayload))));
      const sig = base64url(CryptoJS.HmacSHA256(strH + "." + strP, secret || 'secret'));
      setOut(strH + "." + strP + "." + sig);
    } catch(e) { alert("Invalid JSON payload"); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="JWT Token Utilities" path={path}>
      <div className="p-6 space-y-4">
        {isDecode ? (
          <>
            <textarea className="w-full h-24 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded break-all" value={inp} onChange={e=>setInp(e.target.value)} placeholder="ey..."></textarea>
            <button onClick={decode} className="px-6 py-2 bg-indigo-600 text-white rounded">Decode Token</button>
            {out && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200">
                  <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-red-600">Header</h3><CopyButton text={out.header} label="Copy header" /></div>
                  <pre className="text-xs">{out.header}</pre>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border border-purple-200">
                  <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-purple-600">Payload</h3><CopyButton text={out.payload} label="Copy payload" /></div>
                  <pre className="text-xs">{out.payload}</pre>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
               <textarea className="w-full h-48 p-4 font-mono text-sm border rounded" value={genPayload} onChange={e=>setGenPayload(e.target.value)} placeholder="Payload JSON"></textarea>
               <input type="text" className="w-full p-2 border rounded" value={secret} onChange={e=>setSecret(e.target.value)} placeholder="Secret Key (default: secret)" />
               <button onClick={generate} className="w-full px-6 py-2 bg-indigo-600 text-white rounded">Generate Token</button>
            </div>
            <OutputBox value={out || ''} label="Generated JWT" placeholder="Resulting JWT" className="h-full min-h-[200px]" textareaClassName="break-all" copyDisabled={!out} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}