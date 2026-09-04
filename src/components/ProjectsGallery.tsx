import React, { useState } from 'react';
import { Sparkles, MapPin, Building, CheckCircle2, ArrowRight } from 'lucide-react';
import { PROJECT_CASE_STUDIES } from '../data/brandData';

interface ProjectsGalleryProps {
  onViewProjectQuote?: (projectTitle: string) => void;
}

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ onViewProjectQuote }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Office', 'Hospitality & Cafés', 'Luxury Residences', 'Retail'];

  const projects = [
    {
      id: 'mindspace-hq',
      title: 'Mindspace Financial & Tech HQ',
      category: 'Office',
      location: 'Gurugram & CyberCity',
      materials: 'Portuguese Acoustic Cork & Backlit Acrylic',
      description: '24,000 sq.ft executive floor installation with acoustic sound-dampening strategy pods and laser-milled architectural directories.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'alibaug-villa',
      title: 'The Alibaug Coastal Villa',
      category: 'Luxury Residences',
      location: 'Alibaug, Maharashtra',
      materials: 'Belgian Linen Canvas & Teak Floating Frames',
      description: 'Curated large-format triptych canvas commissions and moisture-sealed family portraits harmonized with coastal sea-breeze protection.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'third-wave-cafe',
      title: 'Artisan Roastery & Café Flagship',
      category: 'Hospitality & Cafés',
      location: 'Indiranagar, Bengaluru',
      materials: 'Organic Cork Notice Murals & Cast Acrylic Signage',
      description: 'Hand-crafted community notice boards and custom coffee origin infographics printed on high-density Portuguese cork with zero off-gassing.',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'oberoi-boutique',
      title: 'Heritage Boutique Suites',
      category: 'Hospitality & Cafés',
      location: 'Udaipur, Rajasthan',
      materials: 'Pure Cotton Canvas & Mitered Teak Frames',
      description: 'Fine art royal archival reproductions across 48 guest suites matching traditional Mewari architecture with 100+ year zero-fade UV inks.',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'retail-studio',
      title: 'Luxury Flagship Retail Studio',
      category: 'Retail',
      location: 'Bandra West, Mumbai',
      materials: 'Diamond-Milled Acrylic Displays & Pedestals',
      description: 'Seamless 12mm optical acrylic product vitrines and pedestal cubes engineered for luxury merchandise and tactile boutique lighting.',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'innovate-cowork',
      title: 'Apex Co-Working Campus',
      category: 'Office',
      location: 'HITEC City, Hyderabad',
      materials: 'Hexagonal Acoustic Cork Walls & Canvas Art',
      description: 'Over 300 modular acoustic cork tiles deployed across collaborative war rooms to absorb sound reverberation and pin active sprint cards.',
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="bg-stone-50 py-12 sm:py-16 border-b border-stone-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#E85D04] text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Installations Across India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F243E] tracking-tight uppercase">
              CANVAS INDIA PROJECTS
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Explore completed architectural, hospitality, and residential installations engineered by our team.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 overflow-x-auto max-w-full shadow-xs">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-[#E85D04] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid: 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Project Image */}
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#0F243E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-xs">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E85D04] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location}</span>
                  </div>

                  <h3 className="text-base font-black text-[#0F243E] group-hover:text-[#E85D04] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-700">
                    <span className="font-bold text-stone-900">Materials: </span>
                    <span className="text-stone-600">{project.materials}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  onClick={() => onViewProjectQuote && onViewProjectQuote(project.title)}
                  className="w-full py-2 bg-stone-50 hover:bg-orange-50 border border-stone-200 text-[#E85D04] hover:text-[#c94e03] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Request Similar Custom Spec</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
