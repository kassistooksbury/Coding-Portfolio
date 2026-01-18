'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  direction = 'up',
  distance = 50,
  duration = 0.8,
  delay = 0,
  className = ''
}) => {
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Respect global animation disable + reduced motion.
    const noAnim = typeof document !== 'undefined' && document.body.classList.contains('no-anim');
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noAnim || reduceMotion) {
      gsap.set(element, { clearProps: 'all', autoAlpha: 1, x: 0, y: 0 });
      return;
    }

    let ctx;
    let animation;

    const createAnimation = () => {
      ctx = gsap.context(() => {
        const initialState = {
          autoAlpha: 0,
          y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
          x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
          willChange: 'transform, opacity'
        };

        gsap.set(element, initialState);

        animation = gsap.to(element, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: duration,
          delay: delay,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: element,
            start: 'top 92%',
            end: 'bottom 15%',
            once: true
          }
        });
      }, element);
    };

    if (typeof document !== 'undefined' && document.body.classList.contains('is-hydrated')) {
      createAnimation();
    } else {
      const body = document && document.body;
      if (body && 'MutationObserver' in window) {
        observerRef.current = new MutationObserver(() => {
          if (body.classList.contains('is-hydrated')) {
            createAnimation();
            observerRef.current?.disconnect();
            observerRef.current = null;
          }
        });
        observerRef.current.observe(body, { attributes: true, attributeFilter: ['class'] });
      } else {
        const t = setTimeout(() => createAnimation(), 200);
        return () => clearTimeout(t);
      }
    }

    return () => {
      try {
        animation?.kill();
        ctx?.revert();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) trigger.kill();
        });
        observerRef.current?.disconnect();
        observerRef.current = null;
      } catch {}
    };
  }, [direction, distance, duration, delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
