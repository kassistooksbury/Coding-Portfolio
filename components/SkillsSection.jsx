'use client';
import React from 'react';
import './SkillsSection.css';
import ScrollReveal from './ScrollReveal';
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiGit,
  SiGithub,
  SiLinux,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiRuby,
} from 'react-icons/si';

// Inline Java icon fallback (avoid depending on a missing react-icon export)
const JavaIcon = ({ size = 48, style, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    aria-hidden="true"
  >
    {/* cup */}
    <path
      d="M6 8h10v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    {/* handle */}
    <path
      d="M16 9h1.2a2.3 2.3 0 0 1 0 4.6H16"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* saucer */}
    <path
      d="M7 19h8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    {/* steam */}
    <path
      d="M9 4c1 1 1 2 0 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 4c1 1 1 2 0 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15 4c1 1 1 2 0 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SkillIcon = ({ skill, index }) => {
  const IconComponent = skill.icon;

  if (!IconComponent) {
    console.warn(`Icon component not found for ${skill.name}`);
    return null;
  }

  return (
    <div
      className="skill-icon-item"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
      tabIndex={0}
      onMouseEnter={(e) => e.currentTarget.setAttribute('data-hovered', 'true')}
      onMouseLeave={(e) => e.currentTarget.removeAttribute('data-hovered')}
      onFocus={(e) => e.currentTarget.setAttribute('data-hovered', 'true')}
      onBlur={(e) => e.currentTarget.removeAttribute('data-hovered')}
    >
      <span className="skill-iconWrap" aria-hidden="true">
        <IconComponent
          size={48}
          style={{ color: skill.color }}
          title={skill.name}
        />
      </span>
      <span className="skill-name">{skill.name}</span>
    </div>
  );
};

const SkillsSection = () => {
  // Languages
  const frontendSkills = [
    { icon: JavaIcon, name: 'Java', color: '#ED8B00' },
    { icon: SiPython, name: 'Python', color: '#3776AB' },
    { icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
    { icon: SiHtml5, name: 'HTML', color: '#E34F26' },
    { icon: SiCss3, name: 'CSS', color: '#1572B6' },
    { icon: SiRuby, name: 'Ruby', color: '#CC342D' },
    { icon: CIcon, name: 'C', color: '#A8B9CC' },
    { icon: AssemblyIcon, name: 'x86-64 Assembly', color: '#ffffff' },
    { icon: SqlIcon, name: 'SQL', color: '#5227FF' }
  ];

  // Tools & Frameworks
  const backendSkills = [
    { icon: SiReact, name: 'React', color: '#61DAFB' },
    { icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
    { icon: SiGit, name: 'Git', color: '#F05032' },
    { icon: SiGithub, name: 'GitHub', color: '#FFFFFF' },
    { icon: SiLinux, name: 'Linux', color: '#FCC624' },
    { icon: EclipseIcon, name: 'Eclipse', color: '#2C2255' },
    { icon: IntelliJIcon, name: 'IntelliJ', color: '#ffffff' },
    { icon: PodmanIcon, name: 'Podman', color: '#892CA0' }
  ];

  // Keep the layout but use an empty third group to avoid redesigning markup.
  const toolsSkills = [];

  return (
    <section id="skills" className="skills-section">
      <div className="container mx-auto px-6 md:px-8">
        {/* Skills Title */}
        <ScrollReveal>
          <div className="skills-header">
            <h2 className="display-title gradient-text font-[--font-dela-gothic]">
              SKILLS & TECHNOLOGIES
            </h2>
          </div>
        </ScrollReveal>

        {/* Skills Categories */}
        <div className="skills-categories">
          {/* Languages Row */}
          <ScrollReveal>
            <div className="skills-category">
              <h3 className="frontend-skill text-2xl font-semibold text-[#5227FF] mb-8 text-center">Languages</h3>
              <div className="skills-grid">
                {frontendSkills.map((skill, index) => (
                  <SkillIcon key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Tools & Frameworks Row */}
          <ScrollReveal>
            <div className="skills-category">
              <h3 className="backend-skill text-2xl font-semibold text-[#5227FF] mb-8 text-center">Tools & Frameworks</h3>
              <div className="skills-grid">
                {backendSkills.map((skill, index) => (
                  <SkillIcon key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Third Row removed if empty */}
          {toolsSkills.length > 0 ? (
            <ScrollReveal>
              <div className="skills-category">
                <h3 className="tools-skill text-2xl font-semibold text-[#5227FF] mb-8 text-center">Tools & Platforms</h3>
                <div className="skills-grid">
                  {toolsSkills.map((skill, index) => (
                    <SkillIcon key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
};

// --- icon helpers for skills not covered by react-icons/si ---
const CIcon = ({ size = 48, style, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9c3.2 0 6.01-1.68 7.6-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const AssemblyIcon = ({ size = 48, style, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <path d="M4 7h16M6 11h12M8 15h8M10 19h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SqlIcon = ({ size = 48, style, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.6" fill="none" />
    <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
);

const EclipseIcon = ({ size = 48, style, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IntelliJIcon = ({ size = 48, style, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PodmanIcon = ({ size = 48, style, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <path d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4v6c0 2.2-1.8 4-4 4s-4-1.8-4-4V9z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9.5 11h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default SkillsSection;
