'use client';

import {useLocale} from 'next-intl';
import {useRouter} from 'next/navigation';
import {usePathname} from 'next/navigation';
import {useTransition} from 'react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      // Navigate to the same path but with different locale
      const newPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, `/${nextLocale}$1`) || `/${nextLocale}`;
      router.replace(newPath);
    });
  }

  return (
    <div className="relative">
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={(e) => onSelectChange(e.target.value)}
        className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
    </div>
  );
}