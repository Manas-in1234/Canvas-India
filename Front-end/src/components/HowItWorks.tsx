import React from 'react';
import { MousePointerClick, UploadCloud, Sliders, PackageCheck, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Choose a Product',
      desc: 'Pick canvas, acrylic, cork, frames or posters suited for your wall or gift.',
      icon: MousePointerClick,
    },
    {
      number: '2',
      title: 'Upload Your Design',
      desc: 'Upload high-res photos, family memories, digital art or company logos.',
      icon: UploadCloud,
    },
    {
      number: '3',
      title: 'Customize',
      desc: 'Select desired dimensions, edge wrap, finishes and live preview your piece.',
      icon: Sliders,
    },
    {
      number: '4',
      title: 'Order & Receive',
      desc: 'Handcrafted in India, bubble-shield packaged and delivered to your doorstep.',
      icon: PackageCheck,
    },
  ];

  return (
    <section className="py-10 sm:py-12 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Ordering personalized prints takes less than two minutes from upload to checkout.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 xl:gap-7 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200 relative flex flex-col items-center text-center shadow-sm hover:border-[var(--accent-border)] transition-colors"
              >
                {/* Step badge */}
                <div className="w-12 h-12 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center font-black text-lg mb-3 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Step {step.number}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
