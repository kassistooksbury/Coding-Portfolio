'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ExperienceSection.css';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection = () => {
  const sectionRef = useRef(null);
  const squiggleRef = useRef(null);

  const experiences = [
    {
      title: "Computer Science Student",
      company: "Ohio State University",
      period: "2023 - Present",
      description: "Pursuing Bachelor's in Computer Science with focus on software development and web technologies.",
      skills: ["Java", "Python", "Data Structures", "Algorithms"]
    },
    {
      title: "Frontend Developer",
      company: "Personal Projects",
      period: "2022 - Present",
      description: "Building modern web applications using React, Next.js, and cutting-edge frontend technologies.",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Web Development Enthusiast",
      company: "Self-Taught",
      period: "2021 - Present",
      description: "Started learning web development through online courses and building personal projects.",
      skills: ["HTML", "CSS", "JavaScript", "Git"]
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const squiggle = squiggleRef.current;
    if (!section) return;

    // If the user prefers reduced motion, or if ScrollTrigger causes jank,
    // skip all scroll-driven animations.
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      const items = section.querySelectorAll('.experience-item');
      if (items && items.length) {
        gsap.set(items, { clearProps: 'all', autoAlpha: 1, y: 0 });
      }
      return;
    }

    let ctx;
    let rafId = null;
    let timeoutId = null;

    const setup = () => {
      ctx = gsap.context(() => {
        // Squiggle: remove scrub animation (scrub ties animation to scroll and can stutter)
        try {
          if (squiggle && typeof squiggle.getTotalLength === 'function') {
            const pathLength = squiggle.getTotalLength();
            squiggle.style.strokeDasharray = pathLength;
            squiggle.style.strokeDashoffset = pathLength;

            gsap.to(squiggle, {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true
              }
            });
          }
        } catch {}

        // Reveal experience items (once)
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
              trigger: section,
              start: 'top 75%',
              once: true
            }
          });
        }
      }, section);

      // Avoid forcing refresh loops; only refresh once after init.
      try { ScrollTrigger.refresh(true); } catch {}
    };

    rafId = requestAnimationFrame(() => {
      timeoutId = window.setTimeout(setup, 120);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      if (ctx) ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) trigger.kill();
      });
    };
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
            height="100%"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            style={{ position: 'absolute', left: '20px', top: '0', height: '100%' }}
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
