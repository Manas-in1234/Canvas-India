import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const TermsConditionsPage: React.FC = () => {
  return (
    <PolicyPageLayout title="Terms & Conditions">
      <p className="text-sm text-stone-500">Website: canvassindia.com</p>

      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Canvas India
        website and your purchase of products from us.
      </p>
      <p>By accessing the Website or placing an order, you agree to these Terms.</p>
      <p>If you do not agree with these Terms, please do not use the Website.</p>

      <PolicySection heading="1. About Canvas India">
        <p>
          Canvas India operates an online platform through which customers may browse, purchase and, where
          offered, customise canvas prints, acrylic products, wall-art products and related items.
        </p>
      </PolicySection>

      <PolicySection heading="2. Eligibility">
        <p>By using this Website, you represent that:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The information provided by you is accurate and complete.</li>
          <li>You are legally capable of entering into a binding transaction under applicable law.</li>
          <li>You will use the Website only for lawful purposes.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="3. Product Information">
        <p>
          We make reasonable efforts to ensure that product descriptions, specifications, dimensions, images and
          pricing displayed on the Website are accurate.
        </p>
        <p>However:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Actual colours may vary slightly depending on your device display.</li>
          <li>Product appearance may vary due to manufacturing and printing processes.</li>
          <li>Minor variations in texture, finish, colour or dimensions may occur.</li>
          <li>Images shown on the Website may be illustrative.</li>
        </ul>
        <p>Such minor variations that do not materially affect the product shall not necessarily constitute a defect.</p>
      </PolicySection>

      <PolicySection heading="4. Customised Products">
        <p>Certain products may be customised using photographs, designs, text or other content supplied by the customer.</p>
        <p>For customised products:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>You are responsible for providing accurate information and appropriate files.</li>
          <li>You must ensure that uploaded images have sufficient quality and resolution.</li>
          <li>Canvas India is not responsible for poor print quality caused by low-resolution or unsuitable customer-provided files.</li>
          <li>You are responsible for ensuring that you have permission to use uploaded photographs, artwork, logos or other materials.</li>
          <li>
            Once production has commenced, customised orders may not be eligible for cancellation or return except
            where the product is defective, damaged, incorrectly produced or otherwise eligible under applicable law.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="5. Customer Content">
        <p>You retain responsibility for content uploaded or submitted by you.</p>
        <p>You must not submit content that:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Infringes another person&apos;s copyright, trademark or other intellectual-property rights</li>
          <li>Is unlawful</li>
          <li>Contains malicious code</li>
          <li>Is fraudulent or misleading</li>
          <li>Violates applicable law</li>
        </ul>
        <p>You grant Canvas India the limited permission necessary to use submitted content solely for processing and fulfilling your order.</p>
      </PolicySection>

      <PolicySection heading="6. Prices">
        <p>All product prices displayed on the Website are subject to change without prior notice.</p>
        <p>The applicable price at the time of placing your order will generally apply to that order.</p>
        <p>Where applicable, taxes, shipping charges or other additional charges will be displayed during checkout.</p>
      </PolicySection>

      <PolicySection heading="7. Orders">
        <p>Placing an order constitutes a request to purchase the selected products.</p>
        <p>An order will be considered accepted once Canvas India confirms the order or begins processing it.</p>
        <p>We reserve the right to cancel an order in circumstances including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Product unavailability</li>
          <li>Pricing or listing errors</li>
          <li>Payment issues</li>
          <li>Suspected fraudulent activity</li>
          <li>Incorrect customer information</li>
          <li>Delivery restrictions</li>
          <li>Violation of these Terms</li>
        </ul>
        <p>If we cancel an order after payment has been received, the eligible amount will be refunded through the applicable payment method.</p>
      </PolicySection>

      <PolicySection heading="8. Payment">
        <p>Orders must be paid using the payment methods made available on the Website.</p>
        <p>You agree to provide accurate billing and payment information.</p>
        <p>
          Canvas India is not responsible for delays caused by payment-gateway failures, banking networks or
          other third-party payment infrastructure.
        </p>
      </PolicySection>

      <PolicySection heading="9. Shipping and Delivery">
        <p>Orders are shipped to the address provided by the customer during checkout.</p>
        <p>Customers are responsible for ensuring that the delivery address and contact information are accurate.</p>
        <p>Delivery timelines are estimates and may be affected by:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Courier delays</li>
          <li>Weather</li>
          <li>Public holidays</li>
          <li>Natural disasters</li>
          <li>Address issues</li>
          <li>Incorrect contact information</li>
          <li>Remote-location delivery</li>
          <li>Logistics disruptions</li>
          <li>Events beyond our reasonable control</li>
        </ul>
        <p>Please refer to our separate Shipping &amp; Delivery Policy for further information.</p>
      </PolicySection>

      <PolicySection heading="10. Cancellations">
        <p>Cancellation eligibility depends on the stage of order processing.</p>
        <p>Orders may generally be cancelled before production or dispatch, subject to our Cancellation Policy.</p>
        <p>Customised products may not be cancellable once production has commenced.</p>
        <p>Please refer to our separate Cancellation Policy.</p>
      </PolicySection>

      <PolicySection heading="11. Returns and Refunds">
        <p>Returns and refunds are governed by our Refund &amp; Return Policy.</p>
        <p>
          Products that are damaged, defective, incorrectly manufactured or incorrectly supplied may qualify for
          replacement, return or refund subject to the applicable policy.
        </p>
      </PolicySection>

      <PolicySection heading="12. Intellectual Property">
        <p>All content on the Website, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Logos</li>
          <li>Brand names</li>
          <li>Text</li>
          <li>Graphics</li>
          <li>Product images</li>
          <li>Website design</li>
          <li>Layout</li>
          <li>Software</li>
          <li>Videos</li>
          <li>Original artwork</li>
        </ul>
        <p>is owned by or licensed to Canvas India unless otherwise stated.</p>
        <p>You may not reproduce, copy, distribute, modify or commercially exploit Website content without prior written permission.</p>
      </PolicySection>

      <PolicySection heading="13. Prohibited Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the Website for unlawful purposes</li>
          <li>Attempt to gain unauthorised access</li>
          <li>Interfere with Website operation</li>
          <li>Introduce malicious software</li>
          <li>Copy Website content for commercial purposes</li>
          <li>Misrepresent your identity</li>
          <li>Use the Website to commit fraud</li>
          <li>Violate another person&apos;s rights</li>
        </ul>
      </PolicySection>

      <PolicySection heading="14. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, Canvas India shall not be responsible for indirect,
          incidental, special or consequential losses arising from the use of the Website or products, except
          where such limitation is not permitted by law.
        </p>
        <p>Nothing in these Terms is intended to exclude or limit any consumer rights or legal protections that cannot lawfully be excluded.</p>
      </PolicySection>

      <PolicySection heading="15. Force Majeure">
        <p>
          Canvas India shall not be responsible for delays or failure to perform obligations caused by
          circumstances beyond our reasonable control, including natural disasters, governmental restrictions,
          strikes, internet or infrastructure failures, transportation disruptions, pandemics, war, civil unrest
          or other unforeseen events.
        </p>
      </PolicySection>

      <PolicySection heading="16. Governing Law">
        <p>These Terms shall be governed by the applicable laws of India.</p>
        <p>
          Subject to applicable consumer-protection and other mandatory laws, disputes shall be subject to the
          jurisdiction of the appropriate courts having jurisdiction over the business of Canvas India.
        </p>
      </PolicySection>

      <PolicySection heading="17. Changes to These Terms">
        <p>We may modify these Terms from time to time.</p>
        <p>
          The revised Terms will be published on the Website. Continued use of the Website after changes are
          published constitutes acceptance of the revised Terms to the extent permitted by law.
        </p>
      </PolicySection>

      <PolicySection heading="Contact Us">
        <p>Email: info@canvassindia.com</p>
        <p>Contact number: 78930 51555</p>
        <p>
          Address: Building No./Flat No. H NO 4-9-197/8184, HMT Nagar, HMT Nagar Main Road, Nacharam, Hyderabad,
          Hyderabad District, Telangana &ndash; 500076
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
};
