'use client';
import { useEffect, useRef } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export default function Turnstile({
  onVerify,
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal'
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set');
      return;
    }

    // Load Turnstile script if not already loaded
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        renderTurnstile();
      };

      document.head.appendChild(script);
    } else {
      renderTurnstile();
    }

    function renderTurnstile() {
      if (containerRef.current && window.turnstile) {
        // Clear any existing widget
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme,
          size: size,
          callback: (token: string) => {
            onVerify(token);
          },
          'error-callback': () => {
            onError?.();
          },
          'expired-callback': () => {
            onExpire?.();
          },
        });
      }
    }

    return () => {
      // Cleanup on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [onVerify, onError, onExpire, theme, size]);

  return <div ref={containerRef} className="turnstile-container" />;
}