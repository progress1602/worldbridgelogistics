import React, { useEffect } from 'react';

declare global {
  interface Window {
    chaportConfig?: {
      appId: string;
    };
    chaport?: any;
  }
}

export const ChaportWidget: React.FC = () => {
  useEffect(() => {
    const appId = import.meta.env.VITE_CHAPORT_APP_ID;
    
    if (!appId) {
      console.error('CHAPORT ERROR: VITE_CHAPORT_APP_ID is not defined. Please add it to your environment variables in AI Studio Settings.');
      return;
    }

    // Initialize Chaport configuration
    window.chaportConfig = {
      appId: appId
    };

    // Chaport installation script - standard v3 snippet
    (function(w: any, d: Document) {
      if (w.chaport) return;
      w.chaport = function() {
        (w.chaport._q = w.chaport._q || []).push(arguments);
      };
      
      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://app.chaport.com/javascripts/insert.js';
      
      const ss = d.getElementsByTagName('script')[0];
      if (ss && ss.parentNode) {
        ss.parentNode.insertBefore(s, ss);
      } else {
        d.head.appendChild(s);
      }
    })(window, document);

  }, []);

  return null;
};
