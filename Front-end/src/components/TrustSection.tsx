import React from 'react';
import { 
  Award, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: 'Museum Grade Quality',
      subtitle: 'Premium Materials',
      desc: 'Heavy 380 GSM cotton canvas & optical acrylic. 12-color archival inks fade-resistant for 50+ years.',
    },
    {
      icon: Sparkles,
      title: 'Easy Customization',
      subtitle: 'Upload & Preview',
      desc: 'Upload directly from phone or laptop, adjust crops and preview in live 3D before ordering.',
    },
    {
      icon: Truck,
      title: 'Pan-India Fast Delivery',
      subtitle: '19,000+ Pin Codes',
      desc: 'Dispatched in 48 hours in 5-ply packaging. Insured doorstep delivery across India.',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure Payments',
      subtitle: 'Bank-Grade Security',
      desc: 'UPI (GPay, PhonePe, Paytm), RuPay, NetBanking and GST invoicing supported.',
    },
    {
      icon: HeartHandshake,
      title: 'Satisfaction Guarantee',
      subtitle: 'Love It Or Free Reprint',
      desc: 'Free instant reprint if your print arrives damaged or does not match your proof.',
    },
  ];

  return (
    <section className="py-12 sm:py-14 bg-white border-b border-stone-100">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Why 1,50,000+ Indian Homes Choose Canvas India
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Direct-from-manufacturer pricing, authentic materials, and uncompromising print craftsmanship
          </p>
        </div>

        {/* 5 Pillars Clean Horizontal Layout — Box-Free */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center sm:text-left">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="space-y-2">
                <Icon className="w-6 h-6 text-[var(--accent)] mb-2" strokeWidth={1.8} />
                <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
                  {pillar.subtitle}
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
