'use client';
import { useEffect } from 'react';

export default function ClientHydrate() {
  useEffect(() => {
    let rafId = 0;

    const reveal = () => {
      try {
        document.body.classList.remove('hydrating');
        document.body.classList.add('is-hydrated');
      } catch {}
    };

    // Reveal ASAP to avoid blocking scroll/interaction.
    rafId = requestAnimationFrame(reveal);

    // Optional debug param used elsewhere
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('no-anim') === '1') {
        document.body.classList.add('no-anim');
      }
    } catch {}

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
