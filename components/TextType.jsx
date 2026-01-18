'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'span',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  prefix = '', // default: no prefix (page can provide its own static prefix)
  animate = true, // new prop: when false, render full text immediately
  reserveWidth, // new prop: if true, reserve space equal to the longest trait to avoid layout shifts
  ...props
}) => {
  const traits = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  // Determine default behavior for reserving width: if multiple traits are provided, enable by default
  const reserveWidthEnabled = typeof reserveWidth === 'boolean' ? reserveWidth : Array.isArray(text);

  // Compute the required min-width (in ch) to fit the longest trait (including prefix and reverse-mode)
  const maxCharWidth = useMemo(() => {
    if (!reserveWidthEnabled) return undefined;
    const lengths = traits.map(tr => {
      const t = reverseMode ? (tr || '').split('').reverse().join('') : (tr || '');
      return (prefix || '').length + t.length;
    });
    const max = Math.max(...lengths, (prefix || '').length);
    return max;
  }, [traits, prefix, reverseMode, reserveWidthEnabled]);

  // Debugging toggle: append ?text-debug=1 to the URL to enable logs for this component
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('text-debug') === '1';

  useEffect(() => {
    if (!debug) return;
    console.debug('[TextType] mounted, animate=', animate, 'text=', traits);
    return () => console.debug('[TextType] unmounted');
  }, []);

  // If animations are disabled, initialize displayedText to the full first trait
  const initialDisplayed = !animate
    ? prefix + (reverseMode ? (traits[0] || '').split('').reverse().join('') : (traits[0] || ''))
    : prefix;

  // displayedText starts with the prefix so deleting only removes trait characters
  const [displayedText, setDisplayedText] = useState(initialDisplayed);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  // Helpful trace of displayedText updates when debugging (moved after displayedText declaration)
  useEffect(() => {
    if (!debug) return;
    console.debug('[TextType] displayedText ->', displayedText);
  }, [displayedText]);

  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  // Remove GSAP-based blinking; use CSS keyframes instead (less main-thread work during scroll).
  // Keep the ref in case consumers rely on it for testing.

  // refs to keep mutable values for timers/logic (avoid stale closures)
  const currentIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = currentTextIndex;
  }, [currentTextIndex]);

  useEffect(() => {
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);

  // If animations are disabled, notify completion for the first trait once mounted.
  useEffect(() => {
    if (!animate && onSentenceComplete) {
      const firstTrait = traits[0] || '';
      Promise.resolve().then(() => onSentenceComplete(firstTrait, 0));
    }
    // run when animate or text/callback changes
  }, [animate, traits, onSentenceComplete]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return '#ffffff';
    return textColors[currentTextIndex % textColors.length];
  };

  // Main typing effect
  useEffect(() => {
    if (!isVisible) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If animations are disabled, skip typing logic entirely
    if (!animate) {
      return;
    }

    const currentTrait = traits[currentIndexRef.current] || '';
    const processedTrait = reverseMode ? currentTrait.split('').reverse().join('') : currentTrait;
    const fullText = prefix + processedTrait;

    const startTyping = () => {
      // If not yet at full text -> type
      if (displayedText.length < fullText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(prev => prev + fullText[prev.length]);
        }, getRandomSpeed());
        return;
      }

      // We've finished typing the trait
      if (displayedText === fullText) {
        if (onSentenceComplete) {
          if (debug) console.debug('[TextType] onSentenceComplete', currentTrait, currentIndexRef.current);
          // call with the original (unreversed) trait and index
          onSentenceComplete(currentTrait, currentIndexRef.current);
        }

        // If not looping and last trait, stop here
        if (!loop && currentIndexRef.current === traits.length - 1) {
          return;
        }

        // Pause, then start deleting back to the prefix
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }

      // If displayedText is longer than fullText (shouldn't happen) truncate
      if (displayedText.length > fullText.length) {
        setDisplayedText(fullText);
        return;
      }
    };

    const startDeleting = () => {
      // Only delete back to the prefix (keep prefix intact)
      if (displayedText.length > prefix.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1));
        }, deletingSpeed || getRandomSpeed());
        return;
      }

      // Reached the prefix, switch to next trait and start typing
      setIsDeleting(false);
      const nextIndex = (currentIndexRef.current + 1) % traits.length;
      currentIndexRef.current = nextIndex;
      setCurrentTextIndex(nextIndex);

      // Small pause before typing next trait (use initialDelay for the very first cycle, else short)
      const delay = currentIndexRef.current === 0 ? initialDelay : 100;
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prefix);
      }, delay);
    };

    // If starting fresh and only prefix is present, respect initialDelay once
    if (!isDeletingRef.current && displayedText === prefix && currentIndexRef.current === 0 && initialDelay > 0 && displayedText.length === prefix.length) {
      timeoutRef.current = setTimeout(() => {
        startTyping();
      }, initialDelay);
    } else if (isDeleting) {
      startDeleting();
    } else {
      startTyping();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // note: intentionally including displayedText, isDeleting, isVisible, typingSpeed, deletingSpeed, pauseDuration, prefix, getRandomSpeed, onSentenceComplete, loop, initialDelay, reverseMode, traits
  }, [displayedText, isDeleting, isVisible, typingSpeed, deletingSpeed, pauseDuration, prefix, getRandomSpeed, onSentenceComplete, loop, initialDelay, reverseMode, traits]);

  const shouldHideCursor = hideCursorWhileTyping && (
    (!isDeleting && displayedText.length > prefix.length && displayedText.length < (prefix + (traits[currentTextIndex] || '')).length) ||
    (isDeleting && displayedText.length > prefix.length)
  );

  // Start typing only once the element becomes visible (if requested)
  useEffect(() => {
    if (!startOnVisible) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // Fallback: if IO not available, start immediately.
      setIsVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { root: null, threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnVisible]);

  return (
    <Component
      ref={containerRef}
      className={`text-type ${className}`}
      {...props}
      // Merge incoming style with reserved width if requested. We apply minWidth on the outer
      // element so the cursor and content don't push layout while typing.
      style={
        maxCharWidth
          ? { ...(props.style || {}), minWidth: `${maxCharWidth}ch` }
          : props.style
      }
    >
      <span className="text-type__content" style={textColors && textColors.length ? { color: getCurrentTextColor() } : undefined}>
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor text-type__cursor--blink ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
          style={{ ['--cursor-blink-duration']: `${cursorBlinkDuration}s` }}
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
};

export default TextType;
