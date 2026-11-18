export interface SupportPage {
  slug: string;
  content: Record<string, string>;
  updatedAt: string | null;
}

export const SUPPORT_PAGE_LABELS: Record<string, string> = {
  'about-us': 'About Us',
  'privacy-policy': 'Privacy Policy',
  'terms-and-conditions': 'Terms & Conditions',
  'cancellation-policy': 'Cancellation Policy',
};
