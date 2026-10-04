import { useEffect } from 'react';

// Ad logic is unchanged (AdSense push on mount). Only the wrapper is new:
// a small "Advertisement" label and a dashed frame, so ads read as ads and
// never get mistaken for tool controls. Ads stay in normal page flow.
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
    <div className="ad-wrap" role="complementary" aria-label="Advertisement">
      <span className="ad-label" aria-hidden="true">Advertisement</span>
      <div className={`ad-box flex items-center justify-center overflow-hidden ${className}`}>
        {/* 
          IMPORTANT: Replace the data-ad-client ID below with your own. 
          In local development, this will just appear as a blank box. 
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
    </div>
  );
}
