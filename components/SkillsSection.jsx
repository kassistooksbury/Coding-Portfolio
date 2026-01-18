'use client';
import React from 'react';
import './SkillsSection.css';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiSass,
  SiNodedotjs,
  SiPython,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiDocker,
  SiFirebase,
  SiLinux
} from 'react-icons/si';

// Inline Java icon fallback (avoid depending on a missing react-icon export)
const JavaIcon = ({ size = 48, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    aria-hidden="true"
  >
    <path d="M7 3s5 0 5 3c0 3-3 3-3 3s3 0 3 3c0 3-3 3-3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 21s2-1 5-1 6 1 6 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SkillIcon = ({ skill, index }) => {
  const IconComponent = skill.icon;

  // Safety check to ensure the icon component exists
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
    >
      <IconComponent
        size={48}
        style={{ color: skill.color }}
        title={skill.name}
      />
      <span className="skill-name">{skill.name}</span>
    </div>
  );
};

const SkillsSection = () => {
  // Frontend Technologies
  const frontendSkills = [
    { icon: SiReact, name: "React", color: "#61DAFB" },
    { icon: SiNextdotjs, name: "Next.js", color: "#FFFFFF" },
    { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
    { icon: SiHtml5, name: "HTML5", color: "#E34F26" },
    { icon: SiCss3, name: "CSS3", color: "#1572B6" },
    { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
    { icon: SiSass, name: "SASS", color: "#CC6699" },
  ];

  const backendSkills = [
    // Use inline JavaIcon as a fallback instead of importing a missing SiJava
    { icon: (props) => <JavaIcon {...props} />, name: "Java", color: "#ED8B00" },
    { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
    { icon: SiPython, name: "Python", color: "#3776AB" },
    { icon: SiExpress, name: "Express.js", color: "#FFFFFF" },
    { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
  ];

  const toolsSkills = [
    { icon: SiGit, name: "Git", color: "#F05032" },
    { icon: SiGithub, name: "GitHub", color: "#FFFFFF" },
    { icon: SiDocker, name: "Docker", color: "#2496ED" },
    { icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
    { icon: SiLinux, name: "Linux", color: "#FCC624" },
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="container mx-auto px-6 md:px-8">
        {/* Skills Title */}
        <div className="skills-header">
          <h2 className="display-title gradient-text font-[--font-dela-gothic]">
            SKILLS & TECHNOLOGIES
          </h2>
        </div>

        {/* Skills Categories */}
        <div className="skills-categories">
          {/* Frontend Row */}
          <div className="skills-category">
            <h3 className="frontend-skill text-2xl font-semibold text-[#5227FF] mb-8 text-center">Frontend Technologies</h3>
            <div className="skills-grid">
              {frontendSkills.map((skill, index) => (
                <SkillIcon key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>

          {/* Backend Row */}
          <div className="skills-category">
            <h3 className="backend-skill text-2xl font-semibold text-[#5227FF] mb-8 text-center">Backend Technologies</h3>
            <div className="skills-grid">
              {backendSkills.map((skill, index) => (
                <SkillIcon key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>

          {/* Tools Row */}
          <div className="skills-category">
            <h3 className="tools-skill text-2xl font-semibold text-[#5227FF] mb-8 text-center">Tools & Platforms</h3>
            <div className="skills-grid">
              {toolsSkills.map((skill, index) => (
                <SkillIcon key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
