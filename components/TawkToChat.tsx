'use client';

import { useEffect } from 'react';

export default function TawkToChat() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Store the original window properties to restore on unmount
    const originalTawkApi = (window as any).Tawk_API;
    const originalTawkLoadStart = (window as any).Tawk_LoadStart;

    // Initialize Tawk.to
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    // Create script element
    const script = document.createElement('script');
    const firstScript = document.getElementsByTagName('script')[0];
    
    script.async = true;
    script.src = 'https://embed.tawk.to/6887c1494ae83b191c0c7c2c/1j194m1pr';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    return () => {
      // Cleanup script on component unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      // Restore original window properties
      if (originalTawkApi === undefined) {
        delete (window as any).Tawk_API;
      } else {
        (window as any).Tawk_API = originalTawkApi;
      }
      
      if (originalTawkLoadStart === undefined) {
        delete (window as any).Tawk_LoadStart;
      } else {
        (window as any).Tawk_LoadStart = originalTawkLoadStart;
      }
    };
  }, []);

  return null;
}
