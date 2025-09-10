'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import type { ComponentType, FC } from 'react';

const BackgroundEffects = dynamic(() => import('../components/BackgroundEffects'), { ssr: false });
const StaggeredMenu = dynamic(() => import('../components/StaggeredMenu'), { ssr: false }) as ComponentType<any>;
const TextType = dynamic(() => import('../components/TextType'), { ssr: false });

interface MenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
}

interface SocialItem {
  label: string;
  link: string;
}

const menuItems: MenuItem[] = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
  { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

const socialItems: SocialItem[] = [
  { label: 'GitHub', link: 'https://github.com/yourusername' },
  { label: 'Discord', link: '#discord' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/yourusername' }
];

export default function Home() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = 'smooth';
		return () => {
			document.documentElement.style.scrollBehavior = '';
		};
	}, []);

	return (
		<div className="relative min-h-screen overflow-x-hidden bg-black">
			{/* Fixed Background */}
			<div className="fixed inset-0 bg-black">
				<BackgroundEffects />
			</div>

			{/* Navigation */}
			<div className="relative z-50">
				<StaggeredMenu
					position="right"
					items={menuItems as any[]}
					socialItems={socialItems as any[]}
					displaySocials={true}
					displayItemNumbering={true}
					menuButtonColor="#fff"
					openMenuButtonColor="#fff"
					changeMenuColorOnOpen={true}
					colors={['#151515', '#1a1a1a', '#0a0a0a']}
					logoUrl="/vercel.svg"
					accentColor="#5227FF"
				/>
			</div>

			{/* Main Content */}
			<main className="relative z-10">
				{/* Home Section */}
				<section id="home" className="min-h-screen flex items-center justify-center pt-20">
					<div className="container mx-auto px-8">
						<div className="max-w-4xl space-y-6">
							<div className="flex flex-col justify-center items-center space-y-4">
								<TextType
									text="Hello, I'm"
									className="text-lg md:text-xl text-[#5227FF] font-medium"
									typingSpeed={50}
									showCursor={false}
								/>
								<h1 className="text-5xl md:text-7xl font-bold text-white">
									<TextType
										text="Kassi Stooksbury"
										className="text-white"
										typingSpeed={70}
										initialDelay={1000}
										showCursor={false}
									/>
								</h1>
								<h2 className="text-4xl md:text-6xl font-bold">
									<TextType
										text="Creative Developer"
										className="bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] bg-clip-text text-transparent"
										typingSpeed={60}
										initialDelay={2000}
										showCursor={true}
										cursorClassName="text-[#FF9FFC]"
									/>
								</h2>
							</div>

							<p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
								I craft immersive digital experiences through code, blending creativity
								with technical expertise to build the next generation of web applications.
							</p>

							<div className="flex flex-wrap gap-4 pt-4">
								<a
									href="#projects"
									className="px-6 py-3 bg-[#5227FF] hover:bg-[#4315ff] text-white rounded-lg transition-all duration-300 font-medium"
								>
									View My Work
								</a>
								<a
									href="#contact"
									className="px-6 py-3 border border-[#5227FF] text-[#5227FF] hover:bg-[#5227FF]/10 rounded-lg transition-all duration-300 font-medium"
								>
									Get in Touch
								</a>
							</div>

							<div className="pt-12 flex items-center gap-6">
								<div className="h-[1px] w-12 bg-gradient-to-r from-[#5227FF] to-transparent"></div>
								<div className="flex gap-6">
									<a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer"
									   className="text-gray-400 hover:text-white transition-colors">
										GitHub
									</a>
									<a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer"
									   className="text-gray-400 hover:text-white transition-colors">
										LinkedIn
									</a>
									<a href="#contact" className="text-gray-400 hover:text-white transition-colors">
										Email
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="min-h-screen flex items-center justify-center">
					<div className="container mx-auto px-8">
						<h2 className="text-4xl font-bold text-white mb-12">About Me</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="space-y-6">
								<p className="text-xl text-gray-300">
									I specialize in building exceptional digital experiences. With a focus on interactive websites and creative development,
									I bring ideas to life through code.
								</p>
								<p className="text-xl text-gray-300">
									My expertise includes React, Three.js, and modern web technologies to create immersive user experiences.
								</p>
							</div>
							<div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
								<h3 className="text-2xl font-semibold text-white mb-6">Skills</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h4 className="text-[#5227FF] mb-2">Frontend</h4>
										<ul className="space-y-2 text-gray-300">
											<li>React / Next.js</li>
											<li>Three.js / WebGL</li>
											<li>TypeScript</li>
											<li>GSAP</li>
										</ul>
									</div>
									<div>
										<h4 className="text-[#5227FF] mb-2">Backend</h4>
										<ul className="space-y-2 text-gray-300">
											<li>Node.js</li>
											<li>Python</li>
											<li>PostgreSQL</li>
											<li>GraphQL</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				<section id="projects" className="min-h-screen flex items-center justify-center">
					<div className="container mx-auto px-8">
						<h2 className="text-4xl font-bold text-white mb-12">Featured Projects</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10">
								<h3 className="text-2xl font-semibold text-white mb-4">Interactive Portfolio</h3>
								<p className="text-gray-300 mb-6">Personal portfolio featuring Three.js animations and GSAP transitions</p>
								<div className="flex flex-wrap gap-2 mb-6">
									<span className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-200">React</span>
									<span className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-200">Three.js</span>
									<span className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-200">GSAP</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Contact Section */}
				<section id="contact" className="min-h-screen flex items-center justify-center">
					<div className="container mx-auto px-8">
						<h2 className="text-4xl font-bold text-white mb-8">Get In Touch</h2>
						<div className="max-w-2xl">
							<p className="text-xl text-gray-300 mb-12">
                I&apos;m currently open to new opportunities and collaborations.
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
							<div className="flex flex-wrap gap-4">
								{socialItems.map((social, index) => (
									<a
										key={index}
										href={social.link}
										target="_blank"
										rel="noopener noreferrer"
										className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg text-white transition-all duration-300"
									>
										{social.label}
									</a>
								))}
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
