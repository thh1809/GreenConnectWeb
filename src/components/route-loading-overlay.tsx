'use client';
import Loading from '@/app/loading';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPath = useRef(pathname);


  useEffect(() => {
    if (prevPath.current !== pathname) {
      // Schedule setShow(true) in a microtask to avoid sync setState
      Promise.resolve().then(() => setShow(true));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShow(false), 500);
      prevPath.current = pathname;
    }
  }, [pathname]);

  if (!show) return null;
  return <Loading />;
}
