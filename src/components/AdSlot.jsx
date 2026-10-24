import { useEffect } from 'react';

// AdSense requires a real numeric ad-slot ID. Placeholder strings such as
// "YOUR_TOOL_BELOW_AD_SLOT" must not be sent to the ad script: they cannot
// serve an ad and can create misleading empty blocks or unstable layout.
const PUBLISHER_ID = 'ca-pub-1237108044981261';
const isConfiguredSlot = (slot) => /^\d+$/.test(String(slot || '').trim());

export default function AdSlot({ className = '', slot = '' }) {
  const configured = isConfiguredSlot(slot);

  useEffect(() => {
    if (!configured) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Ad blockers and network restrictions are expected in some browsers.
      console.warn('AdSense slot could not be initialized.', e);
    }
  }, [configured, slot]);

  // Keep the page free of fake ad boxes until a real slot ID is configured.
  // This avoids pushing invalid AdSense requests and prevents placeholder
  // blocks from consuming space or contributing to layout shifts.
  if (!configured) return null;

  return (
    <div className="ad-wrap" role="complementary" aria-label="Advertisement">
      <span className="ad-label" aria-hidden="true">Advertisement</span>
      <div className={`ad-box flex items-center justify-center overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={String(slot).trim()}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
