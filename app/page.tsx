'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';

const BackgroundEffects = dynamic(() => import('../components/BackgroundEffects'), { ssr: false });
const StaggeredMenu = dynamic(() => import('../components/StaggeredMenu').then((m) => m.StaggeredMenu), { ssr: false });
const TextType = dynamic(() => import('../components/TextType'), { ssr: false });
import SkillsSection from '../components/SkillsSection';
const ScrollReveal = dynamic(() => import('../components/ScrollReveal'), { ssr: false });
const ExperienceSection = dynamic(() => import('../components/ExperienceSection'), { ssr: false });
const ContactSection = dynamic(() => import('../components/ContactSection'), { ssr: false });
const ProjectsSection = dynamic(() => import('../components/ProjectsSection'), { ssr: false });

interface MenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
}

interface SocialItem {
  label: string;
  link: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { label: 'Home', ariaLabel: 'Go to home section', link: '#home' },
  { label: 'Skills', ariaLabel: 'View my skills', link: '#skills' },
  { label: 'Experience', ariaLabel: 'View my experience', link: '#experience' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

const socialItems: SocialItem[] = [
  { label: 'GitHub', link: 'https://github.com/kassistooksbury', icon: '/globe.svg' },
  { label: 'Discord', link: 'https://discord.gg/kassistooksbury', icon: '/window.svg' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/kassi-stooksbury', icon: '/file.svg' }
];

export default function Home() {
  // Show background immediately; LiquidEther internally throttles work when not visible.
  const [showBackgroundEffects] = useState(true);
  const [homeVisible, setHomeVisible] = useState(true);
  const bgRef = useRef<HTMLElement | null>(null);

  // Observe the #home section and only enable the heavy background when the section is visible.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = bgRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setHomeVisible(Boolean(e && e.isIntersecting));
      },
      { root: null, threshold: [0, 0.01] }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // only enable the heavy background when the browser is idle AND the home section is visible
  const enableBackground = showBackgroundEffects && homeVisible;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Full-viewport background effects (fixed). */}
      <BackgroundEffects enabled={enableBackground} />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 py-8">
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#fff"
            openMenuButtonColor="#fff"
            changeMenuColorOnOpen={true}
            colors={['#151515', '#1a1a1a', '#0a0a0a']}
            logoUrl="/stooksbury_resume26.docx.pdf"
            accentColor="#5227FF"
          />
        </nav>

        {/* Main Content */}
        <main className="relative w-full">
          {/* Home Section */}
          <section
            ref={bgRef}
            id="home"
            className="relative w-full flex items-center justify-center scroll-mt-0"
            style={{
              // Force the hero to be taller than the viewport so the next section
              // (Skills) requires scrolling to reach.
              minHeight: '112vh',
              paddingBottom: '6vh'
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center px-4">
              <div className="w-full h-full flex flex-col items-center justify-center px-4">
                <h1 className="text-block max-w-[90vw] text-center">
                  <TextType
                    text={"HELLO, MY NAME IS KASSI\nSTOOKSBURY"}
                    typingSpeed={60}
                    deletingSpeed={60}
                    initialDelay={150}
                    pauseDuration={0}
                    loop={false}
                    animate={true}
                    className="inline display-title gradient-text whitespace-pre font-[--font-dela-gothic]"
                    showCursor={true}
                    hideCursorWhileTyping={false}
                    cursorCharacter="|"
                    cursorClassName="text-[#FF9FFC]"
                    cursorBlinkDuration={0.55}
                    variableSpeed={undefined}
                    reserveWidth={false}
                    onSentenceComplete={() => {}}
                  />
                </h1>
              </div>
            </div>
          </section>

          {/* Skills Section with ScrollReveal */}
          <SkillsSection />

          {/* Experience Section */}
          <ExperienceSection />

          {/* Projects Section with ScrollReveal (under construction) */}
          <ScrollReveal>
            <ProjectsSection />
          </ScrollReveal>

          {/* Contact Section with ScrollReveal */}
          <ScrollReveal>
            <ContactSection />
          </ScrollReveal>
        </main>
      </div>
    </div>
  );
}
