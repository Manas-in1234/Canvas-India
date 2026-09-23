import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PolicyPageLayout title="Privacy Policy">
      <p className="text-sm text-stone-500">Website: canvassindia.com</p>

      <p>
        Canvas India (&ldquo;Canvas India&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects
        your privacy and is committed to protecting the personal information you provide when using our website,
        canvassindia.com (the &ldquo;Website&rdquo;).
      </p>
      <p>
        This Privacy Policy explains what information we collect, how we use it, when we may share it, and the
        choices available to you.
      </p>
      <p>By accessing or using the Website, you acknowledge that you have read and understood this Privacy Policy.</p>

      <PolicySection heading="1. Information We Collect">
        <p>
          We may collect information that you voluntarily provide to us when you browse our Website, create an
          account, place an order, contact us, submit an enquiry, or otherwise interact with our services.
        </p>
        <p>This may include:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Full name</li>
          <li>Email address</li>
          <li>Mobile/telephone number</li>
          <li>Billing address</li>
          <li>Shipping/delivery address</li>
          <li>City, state and PIN code</li>
          <li>Account information</li>
          <li>Order and transaction details</li>
          <li>Product preferences</li>
          <li>Images or artwork uploaded for customised products</li>
          <li>Information provided to our customer support team</li>
          <li>Any other information voluntarily provided by you</li>
        </ul>
        <p>
          We may also automatically collect certain technical information when you visit the Website, such as IP
          address, browser type, device type, operating system, pages visited, referring URLs, approximate
          location, and Website interaction data.
        </p>
      </PolicySection>

      <PolicySection heading="2. How We Use Your Information">
        <p>We may use your information to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Process and fulfil orders</li>
          <li>Manufacture or customise products according to your requirements</li>
          <li>Process payments</li>
          <li>Arrange shipping and delivery</li>
          <li>Provide order confirmations and updates</li>
          <li>Contact you regarding your order</li>
          <li>Improve our products and Website</li>
          <li>Prevent fraud and misuse</li>
          <li>Maintain Website security</li>
          <li>Analyse Website usage</li>
          <li>Send promotional communications where permitted</li>
          <li>Comply with applicable legal, accounting and regulatory requirements</li>
        </ul>
      </PolicySection>

      <PolicySection heading="3. Custom Images and Artwork">
        <p>
          If you purchase a personalised or customised product, you may provide photographs, artwork, designs or
          other content for printing.
        </p>
        <p>You represent that you have the necessary rights or permission to use and reproduce any content uploaded by you.</p>
        <p>
          We use such content solely for purposes reasonably necessary to process, manufacture, fulfil and support
          your order, unless otherwise permitted by you or required by law.
        </p>
      </PolicySection>

      <PolicySection heading="4. Payment Information">
        <p>Payments may be processed through third-party payment gateways.</p>
        <p>
          Canvas India does not intentionally store complete credit/debit card numbers, CVV numbers, UPI PINs or
          banking passwords on its own servers.
        </p>
        <p>
          Payment information may be securely processed by the applicable payment service provider according to
          its security and privacy practices.
        </p>
      </PolicySection>

      <PolicySection heading="5. Sharing of Information">
        <p>We do not sell or rent your personal information.</p>
        <p>We may share necessary information with trusted service providers, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Payment gateways</li>
          <li>Courier and logistics companies</li>
          <li>Website hosting providers</li>
          <li>Technology providers</li>
          <li>Analytics providers</li>
          <li>Customer-support providers</li>
          <li>Marketing service providers, where applicable</li>
          <li>Professional advisers</li>
          <li>Government authorities or law-enforcement agencies where legally required</li>
        </ul>
        <p>For example, your name, phone number and delivery address may be provided to a courier partner to fulfil your order.</p>
      </PolicySection>

      <PolicySection heading="6. Cookies">
        <p>We may use cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Enable essential Website functions</li>
          <li>Remember preferences</li>
          <li>Maintain shopping-cart information</li>
          <li>Improve Website performance</li>
          <li>Analyse Website traffic</li>
          <li>Understand user behaviour</li>
          <li>Improve marketing and advertising performance</li>
        </ul>
        <p>You may control cookies through your browser settings. Disabling certain cookies may affect Website functionality.</p>
      </PolicySection>

      <PolicySection heading="7. Marketing Communications">
        <p>
          Where permitted by law, we may contact you regarding new products, offers, discounts, promotions and
          other information about Canvas India.
        </p>
        <p>You may opt out of promotional communications at any time.</p>
        <p>
          Transactional communications relating to orders, payments, delivery, refunds or customer support may
          still be sent when necessary.
        </p>
      </PolicySection>

      <PolicySection heading="8. Data Security">
        <p>
          We take reasonable technical and organisational measures to protect personal information against
          unauthorised access, misuse, loss, alteration or disclosure.
        </p>
      </PolicySection>

      <PolicySection heading="9. Data Retention">
        <p>
          We retain personal information only for as long as reasonably necessary for legitimate business
          purposes, including order fulfilment, customer support, accounting, taxation, legal compliance, dispute
          resolution and fraud prevention.
        </p>
        <p>Where information is no longer required, we may delete, anonymise or securely dispose of it subject to applicable law.</p>
      </PolicySection>

      <PolicySection heading="10. Third-Party Websites">
        <p>Our Website may contain links to third-party websites or services.</p>
        <p>
          Canvas India is not responsible for the privacy practices or content of third-party websites. We
          encourage you to review their privacy policies before providing personal information.
        </p>
      </PolicySection>

      <PolicySection heading="11. Your Rights">
        <p>Subject to applicable law, you may contact us to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Request access to personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion where legally permissible</li>
          <li>Withdraw consent where applicable</li>
          <li>Opt out of promotional communications</li>
          <li>Ask questions regarding our use of your information</li>
          <li>Raise a privacy-related concern or complaint</li>
        </ul>
        <p>We may request reasonable verification before processing certain requests.</p>
      </PolicySection>

      <PolicySection heading="12. Children's Privacy">
        <p>
          The Website is not intended to knowingly collect personal information from children in circumstances
          where such collection is prohibited by law.
        </p>
        <p>If you believe a child has provided personal information to us improperly, please contact us.</p>
      </PolicySection>

      <PolicySection heading="13. Policy Changes">
        <p>We may update this Privacy Policy from time to time.</p>
        <p>The updated version will be published on this page with a revised &ldquo;Last Updated&rdquo; date.</p>
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
