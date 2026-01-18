'use client';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ContactSection.css';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const particlesRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating form submission with a timeout
    // Replace this with actual form submission logic
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Message sent successfully! I\'ll get back to you soon.');
      setMessageType('success');
      setFormState({ name: '', email: '', message: '' });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
        setMessageType('');
      }, 5000);
    }, 1500);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;
    const particles = particlesRef.current;

    if (!section || !form || !particles) return;

    // Animate form elements on scroll
    const formElements = form.querySelectorAll('.form-element');
    gsap.fromTo(formElements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: form,
          start: 'top 80%',
          end: 'bottom 70%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Create floating particles effect
    const createParticles = () => {
      particles.innerHTML = '';
      const count = window.innerWidth < 768 ? 15 : 25;

      for (let i = 0; i < count; i++) {
        const size = Math.random() * 8 + 3;
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particles.appendChild(particle);
      }
    };

    createParticles();
    window.addEventListener('resize', createParticles);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === form || trigger.trigger === section) {
          trigger.kill();
        }
      });
      window.removeEventListener('resize', createParticles);
    };
  }, []);

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div ref={particlesRef} className="particles-container"></div>
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-header">
            <h2 className="text-[60px] sm:text-[70px] md:text-[90px] lg:text-[100px] font-bold leading-[1] tracking-tighter mb-8 bg-gradient-to-r from-[#5227FF] to-[#FF9FFC] text-transparent bg-clip-text select-none font-[--font-dela-gothic]">
              CONTACT ME
            </h2>
            <p className="contact-subtitle">
              Let's collaborate on something amazing! Fill out the form below, and I'll get back to you soon.
            </p>
          </div>

          <div className="contact-form-wrapper">
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
              <div className="form-element">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="form-input"
                />
              </div>

              <div className="form-element">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email address"
                  className="form-input"
                />
              </div>

              <div className="form-element">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="How can I help you?"
                  rows={5}
                  className="form-textarea"
                />
              </div>

              <div className="form-element">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {submitMessage && (
                <div className={`form-message ${messageType}`}>
                  {submitMessage}
                </div>
              )}
            </form>

            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-info-text">
                  <h4>Phone</h4>
                  <p>+1 (513) 283-7632</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-info-text">
                  <h4>Email</h4>
                  <p>kassistooksbury@gmail.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="contact-info-text">
                  <h4>Location</h4>
                  <p>Columbus, Ohio, USA</p>
                </div>
              </div>

              <div className="social-links">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
