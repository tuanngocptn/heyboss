'use client';

import { useEffect, useRef } from 'react';
import { init } from '@waline/client';
import { useTranslations } from 'next-intl';

interface WalineCommentsProps {
  path: string;
  serverURL?: string;
}

export default function WalineComments({
  path,
  serverURL = process.env.NEXT_PUBLIC_WALINE_URL || 'http://localhost:8360'
}: WalineCommentsProps) {
  const walineInstanceRef = useRef<{ destroy?: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (containerRef.current && !walineInstanceRef.current) {
      // Delay initialization to avoid race conditions
      timeoutId = setTimeout(() => {
        try {
          if (containerRef.current && !walineInstanceRef.current) {
            walineInstanceRef.current = init({
              el: containerRef.current,
              serverURL,
              path,
              dark: true,
              login: 'disable',
              wordLimit: 0,
              pageSize: 10,
              lang: 'en',
              meta: ['nick'],
              requiredMeta: ['nick'],
              noCopyright:true,
              imageUploader: false,
              locale: {
                placeholder: t('boss.comments.placeholder') || 'Enter your comment...',
              },
              reaction: [
                '/imgs/waline/like.png',
                '/imgs/waline/heart.png',
                '/imgs/waline/haha.png',
                '/imgs/waline/wow.png',
                '/imgs/waline/cry.png',
                '/imgs/waline/angry.png'
              ],
            });
          }
        } catch (error) {
          console.error('Failed to initialize Waline:', error);
        }
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (walineInstanceRef.current) {
        try {
          if (typeof walineInstanceRef.current.destroy === 'function') {
            walineInstanceRef.current.destroy();
          }
        } catch {
          // Silently handle cleanup errors
        }
        walineInstanceRef.current = null;
      }
    };
  }, [serverURL, path, t]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="waline-container" />
    </div>
  );
}