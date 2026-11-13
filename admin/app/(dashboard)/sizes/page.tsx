'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The three customization screens now live together under /customization.
export default function Redirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customization?tab=sizes');
  }, [router]);
  return null;
}
