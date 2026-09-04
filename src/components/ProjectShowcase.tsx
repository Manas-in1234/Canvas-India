import React, { useState } from 'react';
import { ArrowRight, MapPin, Building, Sparkles, ExternalLink, X } from 'lucide-react';
import { PROJECT_CASE_STUDIES, ProjectCaseStudy } from '../data/brandData';

interface ProjectShowcaseProps {
  onOpenQuote: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onOpenQuote }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  return (
    <section id="project-showcase" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Architectural Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              MADE FOR SPACES THAT MATTER.
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              From historic palace sanctuaries to pan-India luxury flagships, explore our bespoke commissions.
            </p>
          </div>

          <button
            onClick={onOpenQuote}
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {PROJECT_CASE_STUDIES.map((project, idx) => {
            // Asymmetric column spans
            const colSpan = idx === 0 ? 'md:col-span-7' : idx === 1 ? 'md:col-span-5' : idx === 2 ? 'md:col-span-4' : idx === 3 ? 'md:col-span-8' : 'md:col-span-12';
            const isWide = idx === 0 || idx === 3 || idx === 4;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`${colSpan} group relative rounded-3xl overflow-hidden bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500`}
              >
                {/* Image */}
                <div className={`relative w-full ${isWide ? 'aspect-16/10 sm:aspect-16/9' : 'aspect-4/3 sm:aspect-1/1'} overflow-hidden`}>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white border border-white/20">
                      {project.category}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-white/20 group-hover:bg-orange-500 text-white flex items-center justify-center transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{project.location}</span>
                      <span className="text-stone-500">•</span>
                      <span>{project.client}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight group-hover:text-orange-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 max-w-xl">
                      {project.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {project.materialsUsed.map((mat) => (
                        <span
                          key={mat}
                          className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-xs text-[10px] font-medium text-stone-200"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 my-auto">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-stone-100 text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-16/9 w-full relative">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-3">
                <span>Client: <strong className="text-stone-900">{selectedProject.client}</strong></span>
                <span>Location: <strong className="text-stone-900">{selectedProject.location}</strong></span>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">
                {selectedProject.description}
              </p>
              {selectedProject.outcome && (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900">
                  <strong>Outcome & Performance:</strong> {selectedProject.outcome}
                </div>
              )}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onOpenQuote();
                  }}
                  className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-bold text-xs shadow-md"
                >
                  Inquire Similar Custom Fabrication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
