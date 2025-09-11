'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Image from 'next/image';

const BackgroundEffects = dynamic(() => import('../components/BackgroundEffects'), { ssr: false });
const StaggeredMenu = dynamic(() => import('../components/StaggeredMenu').then(mod => mod.StaggeredMenu), { ssr: false });

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
  { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
  { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

const socialItems: SocialItem[] = [
  { label: 'GitHub', link: 'https://github.com/kassistooksbury', icon: '/globe.svg' },
  { label: 'Discord', link: 'https://discord.gg/kassistooksbury', icon: '/window.svg' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/kassistooksbury', icon: '/file.svg' }
];

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black selection:bg-[#5227FF]/30 selection:text-white">
      {/* Background layer */}
      <div className="fixed inset-0">
        <BackgroundEffects />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 py-8">
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
            logoUrl="/lanyard.png"
            accentColor="#5227FF"
          />
        </div>

        {/* Main Content with increased top padding */}
        <main className="relative pt-32">
          {/* Home Section */}
          <section id="home" className="min-h-screen flex items-center justify-center py-24">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-4xl space-y-10">
                <div className="space-y-6">
                    <div style={{ marginTop: 350 }} />
                    <p className="section-subtitle text-center">hello, im kassi stooksbury </p>
                  <h1 className="space-y-4">
                    <span className="block text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white">
                      Hello, I&apos;m
                    </span>
                    <span className="block text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white">
                      Kassi Stooksbury
                    </span>
                    <span className="gradient-text block text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight">
                      Full Stack Developer
                    </span>
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-0.5 w-12 md:w-24 bg-gradient-to-r from-[#5227FF] to-[#FF9FFC]"></div>
                  <p className="section-subtitle mb-0">Based in Kansas City</p>
                </div>

                <p className="body-text text-lg md:text-xl max-w-2xl">
                  I specialize in crafting exceptional digital experiences through creative development
                  and innovative solutions. With expertise in both front-end and back-end technologies,
                  I bring ideas to life with clean code and engaging interfaces.
                </p>

                <div className="flex flex-wrap gap-4 pt-6">
                  <a
                    href="#projects"
                    className="group px-6 md:px-8 py-4 bg-[#5227FF] hover:bg-[#4315FF] text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="font-medium tracking-wide">View Projects</span>
                    <Image src="/globe.svg" alt="Projects" width={20} height={20}
                      className="opacity-75 group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                  <a
                    href="#contact"
                    className="group px-6 md:px-8 py-4 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="font-medium tracking-wide">Get in Touch</span>
                    <Image src="/file.svg" alt="Contact" width={20} height={20}
                      className="opacity-75 group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* About Section - adjust spacing */}
          <section id="about" className="min-h-screen flex items-center justify-center py-32">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                  <p className="section-subtitle">Get to know me</p>
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-12 md:w-24 bg-gradient-to-r from-[#5227FF] to-[#FF9FFC]"></div>
                    <h2 className="gradient-text section-title">About Me</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                  <div className="space-y-8">
                    <div className="card card-hover">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                          <Image src="/window.svg" alt="Background" width={24} height={24}
                            className="opacity-75 group-hover:rotate-12 transition-transform"
                          />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight text-white">Background</h3>
                      </div>
                      <p className="body-text">
                        As a software engineer, I&apos;m passionate about creating innovative digital solutions
                        that make a difference. My approach combines technical expertise with creative
                        problem-solving, always pushing the boundaries of what&apos;s possible in web development.
                      </p>
                    </div>

                    <div className="card card-hover">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                          <Image src="/globe.svg" alt="What I Do" width={24} height={24}
                            className="opacity-75 group-hover:rotate-12 transition-transform"
                          />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight text-white">What I Do</h3>
                      </div>
                      <p className="body-text">
                        I specialize in building modern web applications with a focus on performance,
                        scalability, and user experience. From responsive front-end interfaces to
                        robust back-end systems, I ensure every project meets the highest standards
                        of quality and innovation.
                      </p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <Image src="/file.svg" alt="Skills" width={24} height={24} className="opacity-75" />
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight text-white">Technical Expertise</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                      <div>
                        <h4 className="text-[#5227FF] mb-6 text-lg font-medium tracking-wide flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#5227FF] rounded-full"></span>
                          Frontend Development
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          {[
                            'React / Next.js',
                            'TypeScript',
                            'Tailwind CSS',
                            'Three.js',
                            'GSAP',
                            'WebGL'
                          ].map((skill, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                              <span className="w-1.5 h-1.5 bg-[#5227FF] rounded-full group-hover:scale-150 transition-transform"></span>
                              <span className="text-gray-300 text-sm tracking-wide">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[#FF9FFC] mb-6 text-lg font-medium tracking-wide flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#FF9FFC] rounded-full"></span>
                          Backend Development
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          {[
                            'Node.js',
                            'Python',
                            'GraphQL',
                            'PostgreSQL',
                            'MongoDB',
                            'REST APIs'
                          ].map((skill, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                              <span className="w-1.5 h-1.5 bg-[#FF9FFC] rounded-full group-hover:scale-150 transition-transform"></span>
                              <span className="text-gray-300 text-sm tracking-wide">{skill}</span>
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

          {/* Projects Section - adjust spacing */}
          <section id="projects" className="min-h-screen flex items-center justify-center py-32">
            <div className="container mx-auto px-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-4">My Work</p>
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-24 bg-gradient-to-r from-[#5227FF] to-[#FF9FFC]"></div>
                    <h2 className="text-4xl md:text-5xl font-bold">
                      <span className="bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] bg-clip-text text-transparent">
                        Featured Projects
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF]/10 to-[#FF9FFC]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        <Image src="/globe.svg" alt="Portfolio" width={24} height={24}
                          className="opacity-75 group-hover:rotate-12 transition-transform"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">Interactive Portfolio</h3>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-6">
                      A modern portfolio website showcasing creative development work. Features Three.js
                      animations, smooth transitions, and responsive design for an engaging user experience.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">React</span>
                      <span className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">Three.js</span>
                      <span className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">GSAP</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <a href="#" className="group inline-flex items-center gap-2 text-[#5227FF] hover:text-[#FF9FFC] transition-colors duration-300">
                        <span className="font-medium">View Project</span>
                        <Image src="/globe.svg" alt="View" width={16} height={16}
                          className="opacity-75 group-hover:translate-x-1 transition-transform"
                        />
                      </a>
                      <a href="#" className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
                        <span className="font-medium">GitHub</span>
                        <Image src="/file.svg" alt="GitHub" width={16} height={16}
                          className="opacity-75 group-hover:translate-x-1 transition-transform"
                        />
                      </a>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF]/10 to-[#FF9FFC]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        <Image src="/window.svg" alt="E-Commerce" width={24} height={24}
                          className="opacity-75 group-hover:rotate-12 transition-transform"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">E-Commerce Platform</h3>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-6">
                      A full-stack e-commerce solution featuring real-time inventory management,
                      secure payment processing, and an intuitive admin dashboard for seamless
                      product management.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">Next.js</span>
                      <span className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">TypeScript</span>
                      <span className="px-3 py-1.5 text-sm bg-white/5 rounded-full text-gray-300">PostgreSQL</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <a href="#" className="group inline-flex items-center gap-2 text-[#5227FF] hover:text-[#FF9FFC] transition-colors duration-300">
                        <span className="font-medium">View Project</span>
                        <Image src="/globe.svg" alt="View" width={16} height={16}
                          className="opacity-75 group-hover:translate-x-1 transition-transform"
                        />
                      </a>
                      <a href="#" className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
                        <span className="font-medium">GitHub</span>
                        <Image src="/file.svg" alt="GitHub" width={16} height={16}
                          className="opacity-75 group-hover:translate-x-1 transition-transform"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section - adjust spacing */}
          <section id="contact" className="min-h-screen flex items-center justify-center py-32">
            <div className="container mx-auto px-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-4">Contact</p>
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-24 bg-gradient-to-r from-[#5227FF] to-[#FF9FFC]"></div>
                    <h2 className="text-4xl md:text-5xl font-bold">
                      <span className="bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] bg-clip-text text-transparent">
                        Get in Touch
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <Image src="/window.svg" alt="Connect" width={24} height={24} className="opacity-75" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white">Let&apos;s Connect</h3>
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-8">
                        I&apos;m always excited to hear about new projects and opportunities.
                        Whether you have a question or just want to say hi, feel free to
                        reach out and I&apos;ll get back to you soon!
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {socialItems.map((social, index) => (
                          <a
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg text-white transition-all duration-300"
                          >
                            <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                              <Image
                                src={social.icon}
                                alt={social.label}
                                width={16}
                                height={16}
                                className="opacity-75 group-hover:rotate-12 transition-transform"
                              />
                            </div>
                            <span className="font-medium">{social.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <Image src="/globe.svg" alt="Status" width={24} height={24} className="opacity-75" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">Current Status</h3>
                    </div>

                    <div className="space-y-6 mb-10">
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-gray-300 font-medium">Available for freelance work</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <span className="w-2 h-2 bg-[#5227FF] rounded-full animate-pulse"></span>
                        <span className="text-gray-300 font-medium">Open to job opportunities</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <span className="w-2 h-2 bg-[#FF9FFC] rounded-full animate-pulse"></span>
                        <span className="text-gray-300 font-medium">Interested in collaborations</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <p className="text-gray-300 mb-6 font-medium">Preferred contact method:</p>
                      <a
                        href="mailto:kstooksbury@gmail.com"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-[#5227FF] hover:bg-[#4315FF] text-white rounded-lg transition-all duration-300"
                      >
                        <span className="font-medium">Send me an email</span>
                        <Image
                          src="/file.svg"
                          alt="Email"
                          width={20}
                          height={20}
                          className="opacity-75 group-hover:translate-x-1 transition-transform"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
