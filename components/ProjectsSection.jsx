'use client';

import React from 'react';
import './ProjectsSection.css';

export default function ProjectsSection() {
  return (
    <section id="projects" className="projects-section">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="display-title gradient-text font-[--font-dela-gothic]">PROJECTS</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A selection of work, experiments, and prototypes. Currently under active development.
          </p>
        </div>

        <div className="projects-content">
          <div className="construction-sign">
            <div className="icon">🚧</div>
            <h3 className="title">Under Construction</h3>
            <p className="subtitle">This section is being built — check back soon for projects and case studies.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

