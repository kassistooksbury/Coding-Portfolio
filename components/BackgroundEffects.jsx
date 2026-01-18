"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LiquidEther from './LiquidEther';
import LiquidCanvas from './LiquidCanvas';

export default function BackgroundEffects({ enabled = true, overscan = 1.6 }) {
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [webglOk, setWebglOk] = useState(true);
  const [initialViewport, setInitialViewport] = useState({ w: 0, h: 0 });

  // Simple WebGL check (fast, avoids extra renderer creation).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      setWebglOk(Boolean(gl));
    } catch {
      setWebglOk(false);
    }
  }, []);

  // Capture viewport size once on first client mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialViewport.w === 0 && initialViewport.h === 0) {
      setInitialViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Decide whether to mount the heavy effect.
  useEffect(() => {
    if (!enabled) return;
    try {
      const nav = navigator || {};
      const hw = nav.hardwareConcurrency || 4;
      const mem = nav.deviceMemory || 4;
      const conn = nav.connection || {};
      const slowConnection = (conn.effectiveType && (conn.effectiveType.includes('2g') || conn.effectiveType.includes('slow-2g')));
      if (hw <= 2 || (mem && mem <= 1) || slowConnection) {
        setAllowed(false);
        return;
      }
    } catch {}

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 800 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, [enabled]);

  if (!enabled) return null;

  const haveViewport = initialViewport.w > 0 && initialViewport.h > 0;
  const widthPx = Math.round(initialViewport.w || 0);
  const heightPx = Math.round(initialViewport.h || 0);
  const fixedWidthPx = Math.max(1, Math.round(widthPx * (overscan || 1)));
  const fixedHeightPx = Math.max(1, Math.round(heightPx * (overscan || 1)));

  const fallbackGradient = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background:
          'radial-gradient(1200px 700px at 20% 20%, rgba(82,39,255,0.16), transparent 60%), radial-gradient(900px 600px at 80% 30%, rgba(255,159,252,0.12), transparent 60%), radial-gradient(900px 700px at 50% 90%, rgba(177,158,239,0.10), transparent 60%), #000',
        pointerEvents: 'none'
      }}
    />
  );

  const showWebgl = webglOk && mounted && allowed && haveViewport;

  const effect = (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {fallbackGradient}

      {showWebgl ? (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: fixedWidthPx + 'px',
              height: fixedHeightPx + 'px',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          >
            <LiquidEther
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                mixBlendMode: 'screen',
                opacity: 1,
                pointerEvents: 'none'
              }}
              fixedWidthPx={fixedWidthPx}
              fixedHeightPx={fixedHeightPx}
              mouseForce={30}
              cursorSize={150}
              colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
              isViscous={true}
              viscous={20}
              autoSpeed={0.2}
              autoIntensity={1.5}
              resolution={0.5}
              dt={0.016}
              allowPointerInteraction={false}
            />
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <LiquidCanvas
            style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 1 }}
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            cursorSize={180}
            blur={30}
            fade={0.06}
            intensity={1.1}
            resolution={1}
            // Keep the background animating during scroll; IO-based pausing can look like "freezing".
            pauseWhenOffscreen={false}
          />
        </div>
      )}
    </div>
  );

  const wrapper = (
    <div className="bg-wrapper" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {effect}
    </div>
  );

  if (typeof document !== 'undefined') return createPortal(wrapper, document.body);
  return null;
}
