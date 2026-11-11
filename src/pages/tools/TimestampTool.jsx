import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

// "3 days ago" / "in 2 hours" for a moment in time. Used for the Relative line of the result.
function relativeTime(ms) {
  const diff = (ms - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [name, secs] of units) {
    if (abs >= secs || name === 'second') return rtf.format(Math.round(diff / secs), name);
  }
  return '';
}

// Unix timestamps (seconds) for the start and end of today, this month and this year, in UTC and in the visitor's time zone.
function dayBoundaries(nowMs) {
  const n = new Date(nowMs);
  const y = n.getUTCFullYear(), m = n.getUTCMonth(), d = n.getUTCDate();
  const utc = (yy, mm, dd, h = 0, mi = 0, s = 0) => Math.floor(Date.UTC(yy, mm, dd, h, mi, s) / 1000);
  const ly = n.getFullYear(), lm = n.getMonth(), ld = n.getDate();
  const local = (yy, mm, dd, h = 0, mi = 0, s = 0) => Math.floor(new Date(yy, mm, dd, h, mi, s).getTime() / 1000);
  return [
    ['Start of today', utc(y, m, d), local(ly, lm, ld)],
    ['End of today', utc(y, m, d, 23, 59, 59), local(ly, lm, ld, 23, 59, 59)],
    ['Start of this month', utc(y, m, 1), local(ly, lm, 1)],
    ['Start of this year', utc(y, 0, 1), local(ly, 0, 1)],
  ];
}

export default function TimestampTool({ path }) {
  const [inp,setInp]=useState(''); const [unit,setUnit]=useState('auto'); const [out,setOut]=useState('');
  useEffect(()=>setInp(Math.floor(Date.now()/1000).toString()),[]);
  // Live clock for /unix-timestamp only. Starts as null so the prerendered HTML and first client render match.
  const [now,setNow]=useState(null);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{if(path!=='/unix-timestamp'||paused)return undefined;const tick=()=>setNow(Date.now());tick();const id=setInterval(tick,1000);return()=>clearInterval(id);},[path,paused]);
  useEffect(()=>{
    try{
      if(!inp){setOut('');return;}
      let d;
      if(/^\d+$/.test(inp)){
        const n=Number(inp);
        // Auto detect by digit count: 17+ nanoseconds, 14-16 microseconds, 12-13 milliseconds, otherwise seconds.
        const ms=unit==='seconds'?n*1000:unit==='milliseconds'?n:unit==='microseconds'?n/1000:unit==='nanoseconds'?n/1e6:inp.length>=17?n/1e6:inp.length>13?n/1e3:n<1e11?n*1000:n;
        d=new Date(ms);
      } else d=new Date(inp);
      if(isNaN(d.getTime()))throw new Error();
      setOut(`UTC: ${d.toUTCString()}\nLocal: ${d.toString()}\nISO 8601: ${d.toISOString()}\nRelative: ${relativeTime(d.getTime())}\nUnix (ms): ${d.getTime()}\nUnix (s): ${Math.floor(d.getTime()/1000)}\nUnix (µs): ${Math.floor(d.getTime()*1000)}\nUnix (ns): ${d.getTime()*1000000}`);
    }catch{setOut('Invalid Date / Timestamp');}
  },[inp,unit]);

  const isLive = path==='/unix-timestamp';
  const rows = isLive && now!==null ? dayBoundaries(now) : null;
  const tz = rows ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone') : '';

  return <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Convert Unix timestamps in seconds, milliseconds, microseconds or nanoseconds to dates and back." path={path}><div className="p-6 space-y-4">
    {isLive&&<div className="card p-4 flex flex-wrap items-end gap-x-8 gap-y-4"><div><div className="text-xs uppercase tracking-wide" style={{color:'var(--muted)'}}>Current Unix timestamp (seconds)</div><div className="font-mono text-2xl font-bold">{now===null?'--':Math.floor(now/1000)}</div></div><CopyButton text={now===null?'':String(Math.floor(now/1000))} label="Copy seconds" /><div><div className="text-xs uppercase tracking-wide" style={{color:'var(--muted)'}}>Milliseconds</div><div className="font-mono text-2xl font-bold">{now===null?'--':now}</div></div><CopyButton text={now===null?'':String(now)} label="Copy milliseconds" /><div><div className="text-xs uppercase tracking-wide" style={{color:'var(--muted)'}}>Current UTC date</div><div className="font-mono text-lg">{now===null?'--':new Date(now).toISOString()}</div></div><button type="button" onClick={()=>setPaused(p=>!p)} aria-pressed={paused} className="px-3 py-1.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">{paused?'Resume':'Pause'}</button></div>}
    {rows&&<div className="min-w-0"><h3 className="font-black mb-2">Unix timestamp for today, this month and this year</h3><div className="table-wrap"><table><thead><tr><th>Moment</th><th>UTC (seconds)</th><th>Your time zone: {tz} (seconds)</th></tr></thead><tbody>{rows.map(([label,u,l])=><tr key={label}><td>{label}</td><td className="font-mono">{u}</td><td className="font-mono">{l}</td></tr>)}</tbody></table></div></div>}
    <div className="flex flex-wrap gap-3 items-center"><input type="text" className="flex-1 min-w-[240px] p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Enter Unix timestamp or ISO date…"/><select value={unit} onChange={e=>setUnit(e.target.value)} className="p-3 border rounded bg-white dark:bg-gray-900"><option value="auto">Auto detect</option><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option><option value="microseconds">Microseconds</option><option value="nanoseconds">Nanoseconds</option></select></div><OutputBox value={out} label="Converted date and time" placeholder="Result…" className="min-h-[220px]" copyDisabled={out==='Invalid Date / Timestamp'}/><button onClick={()=>setInp('')} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear</button></div></ToolLayout>;
}
