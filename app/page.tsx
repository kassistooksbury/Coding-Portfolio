'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BackgroundEffects = dynamic(() => import('../components/BackgroundEffects'), { ssr: false });
const StaggeredMenu = dynamic(() => import('../components/StaggeredMenu').then(mod => mod.StaggeredMenu), { ssr: false });
const TextType = dynamic(() => import('../components/TextType'), { ssr: false });

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
  { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

const socialItems: SocialItem[] = [
  { label: 'GitHub', link: 'https://github.com/kassistooksbury', icon: '/globe.svg' },
  { label: 'Discord', link: 'https://discord.gg/kassistooksbury', icon: '/window.svg' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/kassi-stooksbury', icon: '/file.svg' }
];

export default function Home() {
  const [showAnimatedWord, setShowAnimatedWord] = useState(false);
  useEffect(() => {
    // Reset scroll position on mount
    window.scrollTo(0, 0);

    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0">
        <BackgroundEffects />
      </div>

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
            logoUrl=""
            accentColor="#5227FF"
          />
        </nav>

        {/* Main Content */}
        <main className="relative">
          {/* Home Section */}
          <section id="home" className="relative min-h-[100vh] flex items-center justify-center scroll-mt-0">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-block max-w-[90vw] flex flex-wrap items-center justify-center">
                <TextType
                  text="HELLO, MY NAME IS KASSI STOOKSBURY. I AM "
                  typingSpeed={60}
                  deletingSpeed={60}
                  initialDelay={0}
                  pauseDuration={0}
                  loop={false}
                  className="text-[100px] sm:text-[120px] md:text-[140px] lg:text-[160px] font-bold leading-[1] tracking-tighter whitespace-pre bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] text-transparent bg-clip-text select-none font-[--font-dela-gothic]"
                  showCursor={!showAnimatedWord}
                  cursorCharacter="|"
                  cursorClassName="text-[#FF9FFC]"
                  onSentenceComplete={() => setShowAnimatedWord(true)}
                  variableSpeed={undefined}
                />

                {showAnimatedWord && (
                  <TextType
                    text={["A STUDENT", "A DEVELOPER", "DRIVEN", "CREATIVE", "A PROBLEM-SOLVER","CURIOUS", "A TEAM PLAYER"]}
                    typingSpeed={60}
                    deletingSpeed={60}
                    initialDelay={0}
                    pauseDuration={800}
                    loop={true}
                    className="text-[100px] sm:text-[120px] md:text-[140px] lg:text-[160px] font-bold leading-[1] tracking-tighter whitespace-pre bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] text-transparent bg-clip-text select-none font-[--font-dela-gothic]"
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-[#FF9FFC]"
                    variableSpeed={undefined}
                    onSentenceComplete={undefined}
                  />
                )}
              </h1>
              {/*</h1>*/}
              {/*<p className="subheader-text text-[16px] sm:text-[18px] md:text-[20px] text-gray-400 text-center font-light leading-relaxed tracking-wide mt-8 max-w-[600px]">*/}
              {/*  <TextType*/}
              {/*    text="A passionate Computer Science student at Ohio State University, crafting digital experiences that blend creativity with technical excellence. Focused on building innovative web solutions that make an impact."*/}
              {/*    typingSpeed={30}*/}
              {/*    initialDelay={8000}*/}
              {/*    className="text-[16px] sm:text-[18px] md:text-[20px] text-gray-400 text-center font-light leading-relaxed tracking-wide"*/}
              {/*    showCursor={false}*/}
              {/*    loop={false}*/}
              {/*  />*/}
              {/*</p>*/}
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="min-h-[100vh] flex items-center justify-center py-32 bg-[#080808] scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-24">&nbsp;</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-8">
                    <div className="card card-hover p-8">
                      <h3 className="text-2xl font-semibold tracking-tight text-white">&nbsp;</h3>
                      <p className="body-text">&nbsp;</p>
                    </div>

                    <div className="card card-hover p-8">
                      <h3 className="text-2xl font-semibold tracking-tight text-white">&nbsp;</h3>
                      <p className="body-text">&nbsp;</p>
                    </div>
                  </div>

                  <div className="card p-8">
                    <h3 className="text-2xl font-semibold tracking-tight text-white mb-8">&nbsp;</h3>
                    <div className="grid grid-cols-1 gap-10">
                      <div>
                        <h4 className="text-[#5227FF] mb-6 text-lg font-medium tracking-wide">
                          &nbsp;
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          {Array(6).fill('').map((_, index) => (
                            <div key={index} className="text-gray-300 text-sm tracking-wide">
                              &nbsp;
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[#FF9FFC] mb-6 text-lg font-medium tracking-wide">
                          &nbsp;
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          {Array(6).fill('').map((_, index) => (
                            <div key={index} className="text-gray-300 text-sm tracking-wide">
                              &nbsp;
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="min-h-[100vh] flex items-center justify-center py-32 bg-[#0a0a0a] scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-24">&nbsp;</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {Array(2).fill('').map((_, index) => (
                    <div key={index} className="card p-8">
                      <h3 className="text-2xl font-semibold text-white mb-6">&nbsp;</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">&nbsp;</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {Array(3).fill('').map((_, i) => (
                          <span key={i} className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">
                            &nbsp;
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-6">
                        <a href="#" className="text-[#5227FF] hover:text-[#FF9FFC] transition-colors duration-300">
                          &nbsp;
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                          &nbsp;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="min-h-[100vh] flex items-center justify-center py-32 bg-[#050505] scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-24">&nbsp;</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-6">
                    <div className="card p-8">
                      <h3 className="text-2xl font-semibold text-white mb-6">&nbsp;</h3>
                      <p className="body-text mb-8">&nbsp;</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array(3).fill('').map((_, index) => (
                          <a
                            key={index}
                            href="#"
                            className="card-hover px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg text-white"
                          >
                            <span className="font-medium">&nbsp;</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card p-8">
                    <h3 className="text-2xl font-semibold text-white mb-8">&nbsp;</h3>
                    <div className="space-y-4 mb-8">
                      {Array(3).fill('').map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                          <span className={`w-2 h-2 ${index === 0 ? 'bg-green-400' : index === 1 ? 'bg-[#5227FF]' : 'bg-[#FF9FFC]'} rounded-full animate-pulse`}></span>
                          <span className="text-gray-300 font-medium">&nbsp;</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <p className="text-gray-300 mb-4 font-medium">&nbsp;</p>
                      <a href="#" className="inline-block px-6 py-3 bg-[#5227FF] hover:bg-[#4315FF] text-white rounded-lg transition-all duration-300">
                        &nbsp;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Scrollable Sections */}
          <section className="min-h-screen bg-black/90 backdrop-blur-sm" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black/95 backdrop-blur-sm" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          {/* Gradual fade to black sections */}
          <section className="min-h-screen bg-gradient-to-b from-black/70 to-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-gradient-to-b from-black/80 to-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-gradient-to-b from-black/90 to-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          <section className="min-h-screen bg-black" aria-hidden="true">
            <div className="h-full w-full"></div>
          </section>

          {/* Final fade out section */}
          <div className="h-screen bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
        </main>
      </div>
    </div>
  );
}
