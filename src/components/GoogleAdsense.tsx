import { useEffect } from 'react';

interface GoogleAdsenseProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const GoogleAdsense = ({ className }: GoogleAdsenseProps) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1928556796401484"
        data-ad-slot="1187584115"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};