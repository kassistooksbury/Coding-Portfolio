'use client';

import { useEffect, useRef } from 'react';

/**
 * LiquidCanvas
 * Lightweight Canvas2D interactive "liquid" fallback for environments where WebGL is disabled.
 * It reacts to pointer movement and remains scroll-friendly (no preventDefault; pointer-events: none).
 */
export default function LiquidCanvas({
  className = '',
  style = {},
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  intensity = 1,
  cursorSize = 160,
  blur = 28,
  fade = 0.08,
  resolution = 1,
  /**
   * If true, pauses work when the canvas is offscreen.
   * Keep false to avoid any perceived "freezing" during scroll.
   */
  pauseWhenOffscreen = false,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let running = true;
    let visible = true;

    const colorStops = colors.length >= 2 ? colors : ['#ffffff', '#ffffff'];
    const idleRadiusRef = { current: 0 };

    let idleTimer = 0;
    const idleFps = 24;
    const idleDelay = Math.round(1000 / idleFps);

    const stopLoop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      if (idleTimer) {
        window.clearTimeout(idleTimer);
        idleTimer = 0;
      }
    };

    const scheduleNext = () => {
      if (!running) return;
      if (rafRef.current || idleTimer) return;

      if (mouseRef.current.active) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        idleTimer = window.setTimeout(() => {
          idleTimer = 0;
          rafRef.current = requestAnimationFrame(tick);
        }, idleDelay);
      }
    };

    function tick() {
      rafRef.current = 0;
      if (!running) return;

      const { w, h } = sizeRef.current;
      const shouldDraw = visible && w > 1 && h > 1;
      if (!shouldDraw) {
        stopLoop();
        return;
      }

      const m = mouseRef.current;

      if (!idleRadiusRef.current) {
        idleRadiusRef.current = cursorSize * sizeRef.current.dpr * 0.85;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      m.vx *= 0.9;
      m.vy *= 0.9;

      const speed = Math.min(1, (Math.hypot(m.vx, m.vy) / 60) * intensity);
      const hasPointer = m.x > -9000 && m.y > -9000;
      const rPointer = cursorSize * sizeRef.current.dpr * (0.65 + speed);

      const g1 = hasPointer ? ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, rPointer) : null;
      if (g1) {
        g1.addColorStop(0, hexToRgba(colorStops[0], 0.28 + 0.22 * speed));
        g1.addColorStop(0.55, hexToRgba(colorStops[1] ?? colorStops[0], 0.18 + 0.18 * speed));
        g1.addColorStop(1, hexToRgba(colorStops[2] ?? colorStops[1] ?? colorStops[0], 0));
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = `blur(${blur}px)`;

      if (m.active && g1) {
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(m.x, m.y, rPointer, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!m.active) {
        const t = performance.now() * 0.00025;
        const ax = (0.5 + 0.5 * Math.sin(t * 1.2)) * w;
        const ay = (0.5 + 0.5 * Math.cos(t * 1.05)) * h;
        const ar = Math.max(idleRadiusRef.current, cursorSize * sizeRef.current.dpr * 0.7);

        const g2 = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
        g2.addColorStop(0, hexToRgba(colorStops[0], 0.18));
        g2.addColorStop(0.6, hexToRgba(colorStops[1] ?? colorStops[0], 0.1));
        g2.addColorStop(1, hexToRgba(colorStops[2] ?? colorStops[1] ?? colorStops[0], 0));
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(ax, ay, ar, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      scheduleNext();
    }

    const ensureTicking = () => {
      if (!running) return;
      const { w, h } = sizeRef.current;
      const drawable = visible && w > 1 && h > 1;
      if (!drawable) return;
      scheduleNext();
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      const rw = Math.max(1, Math.floor(cssW * dpr * resolution));
      const rh = Math.max(1, Math.floor(cssH * dpr * resolution));
      canvas.width = rw;
      canvas.height = rh;
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      sizeRef.current = { w: rw, h: rh, dpr: dpr * resolution };
      ensureTicking();
    };

    resize();

    const parentEl = canvas.parentElement;
    const ro =
      typeof ResizeObserver !== 'undefined' && parentEl
        ? new ResizeObserver(() => {
            resize();
          })
        : null;
    ro?.observe(parentEl);

    const onPointerMove = (e) => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
      const x = (e.clientX - rect.left) * sizeRef.current.dpr;
      const y = (e.clientY - rect.top) * sizeRef.current.dpr;
      const m = mouseRef.current;
      if (m.px > -9000) {
        m.vx = x - m.px;
        m.vy = y - m.py;
      }
      m.px = x;
      m.py = y;
      m.x = x;
      m.y = y;
      m.active = true;
      ensureTicking();
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
      ensureTicking();
    };

    const onVisibilityChange = () => {
      const tabVisible = document.visibilityState === 'visible';
      if (!tabVisible) stopLoop();
      else ensureTicking();
    };

    const target = canvas.parentElement || canvas;

    window.addEventListener('resize', resize, { passive: true });
    target.addEventListener('pointermove', onPointerMove, { passive: true });
    target.addEventListener('pointerdown', onPointerMove, { passive: true });
    target.addEventListener('pointerleave', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

    const io =
      pauseWhenOffscreen && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              visible = entries.some((e) => e.isIntersecting);
              if (!visible) stopLoop();
              else ensureTicking();
            },
            { root: null, threshold: 0 }
          )
        : null;
    io?.observe(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ensureTicking();

    return () => {
      running = false;
      stopLoop();
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener('resize', resize);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerdown', onPointerMove);
      target.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [colors, intensity, cursorSize, blur, fade, resolution, pauseWhenOffscreen]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ pointerEvents: 'none', display: 'block', width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    />
  );
}

function hexToRgba(hex, a) {
  const h = (hex || '').replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const n = parseInt(full || '000000', 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
