import React from 'react';

interface PolicySectionProps {
  heading?: string;
  children: React.ReactNode;
}

/** Consistent section heading + spacing for legal/policy page bodies. */
export const PolicySection: React.FC<PolicySectionProps> = ({ heading, children }) => (
  <section>
    {heading && (
      <h2 className="text-lg font-bold text-stone-900 mt-10 mb-3 first:mt-0">{heading}</h2>
    )}
    <div className="space-y-3">{children}</div>
  </section>
);
