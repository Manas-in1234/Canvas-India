import { useSupportPage } from '../context/SupportPagesContext';
import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const TermsConditionsPage: React.FC = () => {
  const { content, copy } = useSupportPage("terms-and-conditions");
  return (
    <PolicyPageLayout title={copy("f1", "Terms & Conditions")}>
      <p className="text-sm text-stone-500">{content["f2"] ?? <>Website: canvassindia.com</>}</p>

      <p>{content["f3"] ?? <>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Canvas India
        website and your purchase of products from us.
      </>}</p>
      <p>{content["f4"] ?? <>By accessing the Website or placing an order, you agree to these Terms.</>}</p>
      <p>{content["f5"] ?? <>If you do not agree with these Terms, please do not use the Website.</>}</p>

      <PolicySection heading={copy("f6", "1. About Canvas India")}>
        <p>{content["f7"] ?? <>
          Canvas India operates an online platform through which customers may browse, purchase and, where
          offered, customise canvas prints, acrylic products, wall-art products and related items.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f8", "2. Eligibility")}>
        <p>{content["f9"] ?? <>By using this Website, you represent that:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f10"] ?? <>The information provided by you is accurate and complete.</>}</li>
          <li>{content["f11"] ?? <>You are legally capable of entering into a binding transaction under applicable law.</>}</li>
          <li>{content["f12"] ?? <>You will use the Website only for lawful purposes.</>}</li>
        </ul>
      </PolicySection>

      <PolicySection heading={copy("f13", "3. Product Information")}>
        <p>{content["f14"] ?? <>
          We make reasonable efforts to ensure that product descriptions, specifications, dimensions, images and
          pricing displayed on the Website are accurate.
        </>}</p>
        <p>{content["f15"] ?? <>However:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f16"] ?? <>Actual colours may vary slightly depending on your device display.</>}</li>
          <li>{content["f17"] ?? <>Product appearance may vary due to manufacturing and printing processes.</>}</li>
          <li>{content["f18"] ?? <>Minor variations in texture, finish, colour or dimensions may occur.</>}</li>
          <li>{content["f19"] ?? <>Images shown on the Website may be illustrative.</>}</li>
        </ul>
        <p>{content["f20"] ?? <>Such minor variations that do not materially affect the product shall not necessarily constitute a defect.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f21", "4. Customised Products")}>
        <p>{content["f22"] ?? <>Certain products may be customised using photographs, designs, text or other content supplied by the customer.</>}</p>
        <p>{content["f23"] ?? <>For customised products:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f24"] ?? <>You are responsible for providing accurate information and appropriate files.</>}</li>
          <li>{content["f25"] ?? <>You must ensure that uploaded images have sufficient quality and resolution.</>}</li>
          <li>{content["f26"] ?? <>Canvas India is not responsible for poor print quality caused by low-resolution or unsuitable customer-provided files.</>}</li>
          <li>{content["f27"] ?? <>You are responsible for ensuring that you have permission to use uploaded photographs, artwork, logos or other materials.</>}</li>
          <li>{content["f28"] ?? <>
            Once production has commenced, customised orders may not be eligible for cancellation or return except
            where the product is defective, damaged, incorrectly produced or otherwise eligible under applicable law.
          </>}</li>
        </ul>
      </PolicySection>

      <PolicySection heading={copy("f29", "5. Customer Content")}>
        <p>{content["f30"] ?? <>You retain responsibility for content uploaded or submitted by you.</>}</p>
        <p>{content["f31"] ?? <>You must not submit content that:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f32"] ?? <>Infringes another person&apos;s copyright, trademark or other intellectual-property rights</>}</li>
          <li>{content["f33"] ?? <>Is unlawful</>}</li>
          <li>{content["f34"] ?? <>Contains malicious code</>}</li>
          <li>{content["f35"] ?? <>Is fraudulent or misleading</>}</li>
          <li>{content["f36"] ?? <>Violates applicable law</>}</li>
        </ul>
        <p>{content["f37"] ?? <>You grant Canvas India the limited permission necessary to use submitted content solely for processing and fulfilling your order.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f38", "6. Prices")}>
        <p>{content["f39"] ?? <>All product prices displayed on the Website are subject to change without prior notice.</>}</p>
        <p>{content["f40"] ?? <>The applicable price at the time of placing your order will generally apply to that order.</>}</p>
        <p>{content["f41"] ?? <>Where applicable, taxes, shipping charges or other additional charges will be displayed during checkout.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f42", "7. Orders")}>
        <p>{content["f43"] ?? <>Placing an order constitutes a request to purchase the selected products.</>}</p>
        <p>{content["f44"] ?? <>An order will be considered accepted once Canvas India confirms the order or begins processing it.</>}</p>
        <p>{content["f45"] ?? <>We reserve the right to cancel an order in circumstances including:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f46"] ?? <>Product unavailability</>}</li>
          <li>{content["f47"] ?? <>Pricing or listing errors</>}</li>
          <li>{content["f48"] ?? <>Payment issues</>}</li>
          <li>{content["f49"] ?? <>Suspected fraudulent activity</>}</li>
          <li>{content["f50"] ?? <>Incorrect customer information</>}</li>
          <li>{content["f51"] ?? <>Delivery restrictions</>}</li>
          <li>{content["f52"] ?? <>Violation of these Terms</>}</li>
        </ul>
        <p>{content["f53"] ?? <>If we cancel an order after payment has been received, the eligible amount will be refunded through the applicable payment method.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f54", "8. Payment")}>
        <p>{content["f55"] ?? <>Orders must be paid using the payment methods made available on the Website.</>}</p>
        <p>{content["f56"] ?? <>You agree to provide accurate billing and payment information.</>}</p>
        <p>{content["f57"] ?? <>
          Canvas India is not responsible for delays caused by payment-gateway failures, banking networks or
          other third-party payment infrastructure.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f58", "9. Shipping and Delivery")}>
        <p>{content["f59"] ?? <>Orders are shipped to the address provided by the customer during checkout.</>}</p>
        <p>{content["f60"] ?? <>Customers are responsible for ensuring that the delivery address and contact information are accurate.</>}</p>
        <p>{content["f61"] ?? <>Delivery timelines are estimates and may be affected by:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f62"] ?? <>Courier delays</>}</li>
          <li>{content["f63"] ?? <>Weather</>}</li>
          <li>{content["f64"] ?? <>Public holidays</>}</li>
          <li>{content["f65"] ?? <>Natural disasters</>}</li>
          <li>{content["f66"] ?? <>Address issues</>}</li>
          <li>{content["f67"] ?? <>Incorrect contact information</>}</li>
          <li>{content["f68"] ?? <>Remote-location delivery</>}</li>
          <li>{content["f69"] ?? <>Logistics disruptions</>}</li>
          <li>{content["f70"] ?? <>Events beyond our reasonable control</>}</li>
        </ul>
        <p>{content["f71"] ?? <>Please refer to our separate Shipping &amp; Delivery Policy for further information.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f72", "10. Cancellations")}>
        <p>{content["f73"] ?? <>Cancellation eligibility depends on the stage of order processing.</>}</p>
        <p>{content["f74"] ?? <>Orders may generally be cancelled before production or dispatch, subject to our Cancellation Policy.</>}</p>
        <p>{content["f75"] ?? <>Customised products may not be cancellable once production has commenced.</>}</p>
        <p>{content["f76"] ?? <>Please refer to our separate Cancellation Policy.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f77", "11. Returns and Refunds")}>
        <p>{content["f78"] ?? <>Returns and refunds are governed by our Refund &amp; Return Policy.</>}</p>
        <p>{content["f79"] ?? <>
          Products that are damaged, defective, incorrectly manufactured or incorrectly supplied may qualify for
          replacement, return or refund subject to the applicable policy.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f80", "12. Intellectual Property")}>
        <p>{content["f81"] ?? <>All content on the Website, including:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f82"] ?? <>Logos</>}</li>
          <li>{content["f83"] ?? <>Brand names</>}</li>
          <li>{content["f84"] ?? <>Text</>}</li>
          <li>{content["f85"] ?? <>Graphics</>}</li>
          <li>{content["f86"] ?? <>Product images</>}</li>
          <li>{content["f87"] ?? <>Website design</>}</li>
          <li>{content["f88"] ?? <>Layout</>}</li>
          <li>{content["f89"] ?? <>Software</>}</li>
          <li>{content["f90"] ?? <>Videos</>}</li>
          <li>{content["f91"] ?? <>Original artwork</>}</li>
        </ul>
        <p>{content["f92"] ?? <>is owned by or licensed to Canvas India unless otherwise stated.</>}</p>
        <p>{content["f93"] ?? <>You may not reproduce, copy, distribute, modify or commercially exploit Website content without prior written permission.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f94", "13. Prohibited Use")}>
        <p>{content["f95"] ?? <>You agree not to:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f96"] ?? <>Use the Website for unlawful purposes</>}</li>
          <li>{content["f97"] ?? <>Attempt to gain unauthorised access</>}</li>
          <li>{content["f98"] ?? <>Interfere with Website operation</>}</li>
          <li>{content["f99"] ?? <>Introduce malicious software</>}</li>
          <li>{content["f100"] ?? <>Copy Website content for commercial purposes</>}</li>
          <li>{content["f101"] ?? <>Misrepresent your identity</>}</li>
          <li>{content["f102"] ?? <>Use the Website to commit fraud</>}</li>
          <li>{content["f103"] ?? <>Violate another person&apos;s rights</>}</li>
        </ul>
      </PolicySection>

      <PolicySection heading={copy("f104", "14. Limitation of Liability")}>
        <p>{content["f105"] ?? <>
          To the maximum extent permitted by applicable law, Canvas India shall not be responsible for indirect,
          incidental, special or consequential losses arising from the use of the Website or products, except
          where such limitation is not permitted by law.
        </>}</p>
        <p>{content["f106"] ?? <>Nothing in these Terms is intended to exclude or limit any consumer rights or legal protections that cannot lawfully be excluded.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f107", "15. Force Majeure")}>
        <p>{content["f108"] ?? <>
          Canvas India shall not be responsible for delays or failure to perform obligations caused by
          circumstances beyond our reasonable control, including natural disasters, governmental restrictions,
          strikes, internet or infrastructure failures, transportation disruptions, pandemics, war, civil unrest
          or other unforeseen events.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f109", "16. Governing Law")}>
        <p>{content["f110"] ?? <>These Terms shall be governed by the applicable laws of India.</>}</p>
        <p>{content["f111"] ?? <>
          Subject to applicable consumer-protection and other mandatory laws, disputes shall be subject to the
          jurisdiction of the appropriate courts having jurisdiction over the business of Canvas India.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f112", "17. Changes to These Terms")}>
        <p>{content["f113"] ?? <>We may modify these Terms from time to time.</>}</p>
        <p>{content["f114"] ?? <>
          The revised Terms will be published on the Website. Continued use of the Website after changes are
          published constitutes acceptance of the revised Terms to the extent permitted by law.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f115", "Contact Us")}>
        <p>{content["f116"] ?? <>Email: info@canvassindia.com</>}</p>
        <p>{content["f117"] ?? <>Landline number: 040-29303344</>}</p>
        <p>{content["f118"] ?? <>WhatsApp: 78930 51555</>}</p>
        <p>{content["f119"] ?? <>
          Address: Building No./Flat No. H NO 4-9-197/B/84, HMT Nagar, Nacharam, Hyderabad,
          Telangana &ndash; 500076
        </>}</p>
      </PolicySection>
    </PolicyPageLayout>
  );
};
