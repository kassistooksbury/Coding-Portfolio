'use client';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ExperienceSection.css';

gsap.registerPlugin(ScrollTrigger);

// Prevent ScrollTrigger from overreacting to mobile browser UI resize events.
ScrollTrigger.config({ ignoreMobileResize: true });

const ExperienceSection = () => {
  const sectionRef = useRef(null);
  const squiggleRef = useRef(null);

  const experiences = [
    {
      title: 'Software Engineer Intern (XP)',
      company: 'Great American Insurance Group',
      period: 'May 2025 - Dec 2025',
      description:
        'Collaborated in an Agile XP environment to build and test enterprise software, practicing pair programming, TDD, and CI. Led refactoring during a MarkLogic-to-Oracle migration and improved internal automation by integrating LLM-powered workflows.',
      skills: ['Java', 'SQL', 'Oracle', 'Agile XP', 'TDD', 'CI', 'LLMs'],
    },
    {
      title: 'HPC Software Support Intern',
      company: 'Ohio Supercomputer Center',
      period: 'Jan 2025 - May 2025',
      description:
        'Supported researchers using HPC systems by troubleshooting jobs, performance issues, and environment/configuration problems. Used Linux/UNIX, scripting, and programming to optimize workflows and maintained technical documentation for internal tools and procedures.',
      skills: ['Linux/UNIX', 'Python', 'C/C++', 'Fortran', 'Shell Scripting', 'HPC'],
    },
    {
      title: 'Technical Student Assistant',
      company: 'The Ohio State University',
      period: 'Aug 2023 - May 2025',
      description:
        'Provided IT customer support via phone and email, coordinating service requests and resolving common account, password, and networking issues. Resolved 20+ issues per shift in a 24/7 support environment, improving response time and service accuracy.',
      skills: ['Customer Support', 'Ticketing', 'Networking Basics', 'Troubleshooting'],
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const path = squiggleRef.current;
    const svgEl = section?.querySelector('svg.squiggle-line');
    const timelineEl = section?.querySelector('.experience-timeline');
    if (!section || !path || !svgEl || !timelineEl) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      const items = section.querySelectorAll('.experience-item');
      if (items && items.length) {
        gsap.set(items, { clearProps: 'all', autoAlpha: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      let ro;
      let st;
      let length = 0;
      let setDashoffset;
      let warmupTimer;

      const measureAndApply = () => {
        const timelineRect = timelineEl.getBoundingClientRect();
        const h = Math.max(1, Math.round(timelineRect.height));

        svgEl.style.height = `${h}px`;
        svgEl.setAttribute('height', String(h));
        svgEl.setAttribute('viewBox', `0 0 100 ${h}`);

        path.setAttribute(
          'd',
          `M50,0 Q70,${h * 0.125} 30,${h * 0.25} ` +
            `Q10,${h * 0.375} 50,${h * 0.5} ` +
            `Q90,${h * 0.625} 50,${h * 0.75} ` +
            `Q10,${h * 0.875} 50,${h}`
        );

        path.setAttribute('fill', 'none');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        let nextLength = 0;
        try {
          nextLength = path.getTotalLength();
        } catch {
          nextLength = 0;
        }
        if (!nextLength) return false;

        length = nextLength;
        path.setAttribute('stroke-dasharray', String(length));

        const progress = st ? st.progress : 0;
        path.setAttribute('stroke-dashoffset', String(length * (1 - progress)));
        setDashoffset = gsap.quickSetter(path, 'strokeDashoffset');

        return true;
      };

      // Reveal experience items (once) - unchanged
      const items = section.querySelectorAll('.experience-item');
      if (items && items.length) {
        gsap.set(items, { autoAlpha: 0, y: 40 });
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power2.out',
          scrollTrigger: {
            id: 'exp-items',
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        });
      }

      const buildOnce = () => {
        if (st) return;
        if (!measureAndApply()) return;

        st = ScrollTrigger.create({
          id: 'exp-squiggle-draw',
          trigger: section,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: true,
          onUpdate: (self) => {
            if (!length || !setDashoffset) return;
            setDashoffset(length * (1 - self.progress));
          },
        });

        // Single refresh after creation
        ScrollTrigger.refresh();

        // Warm-up: for the first ~1s, re-measure/refresh periodically to catch late layout shifts
        // (fonts, images, async content). DevTools was effectively doing this via forced reflow.
        const started = Date.now();
        warmupTimer = window.setInterval(() => {
          if (Date.now() - started > 1200) {
            clearInterval(warmupTimer);
            warmupTimer = null;
            return;
          }
          if (measureAndApply()) ScrollTrigger.refresh();
        }, 120);
      };

      const schedule = () => requestAnimationFrame(() => requestAnimationFrame(buildOnce));

      // Wait for fonts if available
      const fontsReady =
        typeof document !== 'undefined' &&
        document.fonts &&
        typeof document.fonts.ready?.then === 'function'
          ? document.fonts.ready
          : null;

      if (fontsReady) fontsReady.then(schedule).catch(schedule);
      schedule();
      window.addEventListener('load', schedule, { once: true });

      const remeasure = () => {
        if (!st) return;
        if (measureAndApply()) ScrollTrigger.refresh();
      };

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => requestAnimationFrame(remeasure));
        ro.observe(timelineEl);
      }

      window.addEventListener('resize', remeasure, { passive: true });

      return () => {
        window.removeEventListener('resize', remeasure);
        if (ro) ro.disconnect();
        if (warmupTimer) clearInterval(warmupTimer);
        if (st) st.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="experience-section">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="display-title gradient-text font-[--font-dela-gothic]">
            EXPERIENCE
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            My journey through education and hands-on development experience.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Squiggle Line SVG */}
          <svg
            className="squiggle-line"
            width="100"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            style={{ position: 'absolute', left: '20px', top: '0' }}
          >
            <path
              ref={squiggleRef}
              d="M50,0 Q70,100 30,200 Q10,300 50,400 Q90,500 50,600 Q10,700 50,800"
              fill="none"
              stroke="#5227FF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* Experience Timeline */}
          <div className="experience-timeline">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="experience-item"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="experience-content">
                  <div className="experience-marker"></div>
                  <h3 className="experience-title">{exp.title}</h3>
                  <h4 className="experience-company">{exp.company}</h4>
                  <p className="experience-period">{exp.period}</p>
                  <p className="experience-description">{exp.description}</p>

                  <div className="experience-skills">
                    {exp.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="experience-skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
