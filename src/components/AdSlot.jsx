import { useEffect } from 'react';

export default function AdSlot({ className = "", slot = "" }) {
  useEffect(() => {
    try {
      // Tells Google to fill the ad slot when the component mounts
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded overflow-hidden ${className}`}>
      {/* 
        IMPORTANT: Replace the data-ad-client ID below with your own. 
        In local development, this will just appear as a blank gray box. 
        Ads will only show up when deployed to a Google-approved domain.
      */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}