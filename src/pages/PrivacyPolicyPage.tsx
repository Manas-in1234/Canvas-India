import { useSupportPage } from '../context/SupportPagesContext';
import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const PrivacyPolicyPage: React.FC = () => {
  const { content, copy } = useSupportPage("privacy-policy");
  return (
    <PolicyPageLayout title={copy("f1", "Privacy Policy")}>
      <p className="text-sm text-stone-500">{content["f2"] ?? <>Website: canvassindia.com</>}</p>

      <p>{content["f3"] ?? <>
        Canvas India (&ldquo;Canvas India&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects
        your privacy and is committed to protecting the personal information you provide when using our website,
        canvassindia.com (the &ldquo;Website&rdquo;).
      </>}</p>
      <p>{content["f4"] ?? <>
        This Privacy Policy explains what information we collect, how we use it, when we may share it, and the
        choices available to you.
      </>}</p>
      <p>{content["f5"] ?? <>By accessing or using the Website, you acknowledge that you have read and understood this Privacy Policy.</>}</p>

      <PolicySection heading={copy("f6", "1. Information We Collect")}>
        <p>{content["f7"] ?? <>
          We may collect information that you voluntarily provide to us when you browse our Website, create an
          account, place an order, contact us, submit an enquiry, or otherwise interact with our services.
        </>}</p>
        <p>{content["f8"] ?? <>This may include:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f9"] ?? <>Full name</>}</li>
          <li>{content["f10"] ?? <>Email address</>}</li>
          <li>{content["f11"] ?? <>Mobile/telephone number</>}</li>
          <li>{content["f12"] ?? <>Billing address</>}</li>
          <li>{content["f13"] ?? <>Shipping/delivery address</>}</li>
          <li>{content["f14"] ?? <>City, state and PIN code</>}</li>
          <li>{content["f15"] ?? <>Account information</>}</li>
          <li>{content["f16"] ?? <>Order and transaction details</>}</li>
          <li>{content["f17"] ?? <>Product preferences</>}</li>
          <li>{content["f18"] ?? <>Images or artwork uploaded for customised products</>}</li>
          <li>{content["f19"] ?? <>Information provided to our customer support team</>}</li>
          <li>{content["f20"] ?? <>Any other information voluntarily provided by you</>}</li>
        </ul>
        <p>{content["f21"] ?? <>
          We may also automatically collect certain technical information when you visit the Website, such as IP
          address, browser type, device type, operating system, pages visited, referring URLs, approximate
          location, and Website interaction data.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f22", "2. How We Use Your Information")}>
        <p>{content["f23"] ?? <>We may use your information to:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f24"] ?? <>Process and fulfil orders</>}</li>
          <li>{content["f25"] ?? <>Manufacture or customise products according to your requirements</>}</li>
          <li>{content["f26"] ?? <>Process payments</>}</li>
          <li>{content["f27"] ?? <>Arrange shipping and delivery</>}</li>
          <li>{content["f28"] ?? <>Provide order confirmations and updates</>}</li>
          <li>{content["f29"] ?? <>Contact you regarding your order</>}</li>
          <li>{content["f30"] ?? <>Improve our products and Website</>}</li>
          <li>{content["f31"] ?? <>Prevent fraud and misuse</>}</li>
          <li>{content["f32"] ?? <>Maintain Website security</>}</li>
          <li>{content["f33"] ?? <>Analyse Website usage</>}</li>
          <li>{content["f34"] ?? <>Send promotional communications where permitted</>}</li>
          <li>{content["f35"] ?? <>Comply with applicable legal, accounting and regulatory requirements</>}</li>
        </ul>
      </PolicySection>

      <PolicySection heading={copy("f36", "3. Custom Images and Artwork")}>
        <p>{content["f37"] ?? <>
          If you purchase a personalised or customised product, you may provide photographs, artwork, designs or
          other content for printing.
        </>}</p>
        <p>{content["f38"] ?? <>You represent that you have the necessary rights or permission to use and reproduce any content uploaded by you.</>}</p>
        <p>{content["f39"] ?? <>
          We use such content solely for purposes reasonably necessary to process, manufacture, fulfil and support
          your order, unless otherwise permitted by you or required by law.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f40", "4. Payment Information")}>
        <p>{content["f41"] ?? <>Payments may be processed through third-party payment gateways.</>}</p>
        <p>{content["f42"] ?? <>
          Canvas India does not intentionally store complete credit/debit card numbers, CVV numbers, UPI PINs or
          banking passwords on its own servers.
        </>}</p>
        <p>{content["f43"] ?? <>
          Payment information may be securely processed by the applicable payment service provider according to
          its security and privacy practices.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f44", "5. Sharing of Information")}>
        <p>{content["f45"] ?? <>We do not sell or rent your personal information.</>}</p>
        <p>{content["f46"] ?? <>We may share necessary information with trusted service providers, including:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f47"] ?? <>Payment gateways</>}</li>
          <li>{content["f48"] ?? <>Courier and logistics companies</>}</li>
          <li>{content["f49"] ?? <>Website hosting providers</>}</li>
          <li>{content["f50"] ?? <>Technology providers</>}</li>
          <li>{content["f51"] ?? <>Analytics providers</>}</li>
          <li>{content["f52"] ?? <>Customer-support providers</>}</li>
          <li>{content["f53"] ?? <>Marketing service providers, where applicable</>}</li>
          <li>{content["f54"] ?? <>Professional advisers</>}</li>
          <li>{content["f55"] ?? <>Government authorities or law-enforcement agencies where legally required</>}</li>
        </ul>
        <p>{content["f56"] ?? <>For example, your name, phone number and delivery address may be provided to a courier partner to fulfil your order.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f57", "6. Cookies")}>
        <p>{content["f58"] ?? <>We may use cookies and similar technologies to:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f59"] ?? <>Enable essential Website functions</>}</li>
          <li>{content["f60"] ?? <>Remember preferences</>}</li>
          <li>{content["f61"] ?? <>Maintain shopping-cart information</>}</li>
          <li>{content["f62"] ?? <>Improve Website performance</>}</li>
          <li>{content["f63"] ?? <>Analyse Website traffic</>}</li>
          <li>{content["f64"] ?? <>Understand user behaviour</>}</li>
          <li>{content["f65"] ?? <>Improve marketing and advertising performance</>}</li>
        </ul>
        <p>{content["f66"] ?? <>You may control cookies through your browser settings. Disabling certain cookies may affect Website functionality.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f67", "7. Marketing Communications")}>
        <p>{content["f68"] ?? <>
          Where permitted by law, we may contact you regarding new products, offers, discounts, promotions and
          other information about Canvas India.
        </>}</p>
        <p>{content["f69"] ?? <>You may opt out of promotional communications at any time.</>}</p>
        <p>{content["f70"] ?? <>
          Transactional communications relating to orders, payments, delivery, refunds or customer support may
          still be sent when necessary.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f71", "8. Data Security")}>
        <p>{content["f72"] ?? <>
          We take reasonable technical and organisational measures to protect personal information against
          unauthorised access, misuse, loss, alteration or disclosure.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f73", "9. Data Retention")}>
        <p>{content["f74"] ?? <>
          We retain personal information only for as long as reasonably necessary for legitimate business
          purposes, including order fulfilment, customer support, accounting, taxation, legal compliance, dispute
          resolution and fraud prevention.
        </>}</p>
        <p>{content["f75"] ?? <>Where information is no longer required, we may delete, anonymise or securely dispose of it subject to applicable law.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f76", "10. Third-Party Websites")}>
        <p>{content["f77"] ?? <>Our Website may contain links to third-party websites or services.</>}</p>
        <p>{content["f78"] ?? <>
          Canvas India is not responsible for the privacy practices or content of third-party websites. We
          encourage you to review their privacy policies before providing personal information.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f79", "11. Your Rights")}>
        <p>{content["f80"] ?? <>Subject to applicable law, you may contact us to:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f81"] ?? <>Request access to personal information we hold about you</>}</li>
          <li>{content["f82"] ?? <>Request correction of inaccurate information</>}</li>
          <li>{content["f83"] ?? <>Request deletion where legally permissible</>}</li>
          <li>{content["f84"] ?? <>Withdraw consent where applicable</>}</li>
          <li>{content["f85"] ?? <>Opt out of promotional communications</>}</li>
          <li>{content["f86"] ?? <>Ask questions regarding our use of your information</>}</li>
          <li>{content["f87"] ?? <>Raise a privacy-related concern or complaint</>}</li>
        </ul>
        <p>{content["f88"] ?? <>We may request reasonable verification before processing certain requests.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f89", "12. Children's Privacy")}>
        <p>{content["f90"] ?? <>
          The Website is not intended to knowingly collect personal information from children in circumstances
          where such collection is prohibited by law.
        </>}</p>
        <p>{content["f91"] ?? <>If you believe a child has provided personal information to us improperly, please contact us.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f92", "13. Policy Changes")}>
        <p>{content["f93"] ?? <>We may update this Privacy Policy from time to time.</>}</p>
        <p>{content["f94"] ?? <>The updated version will be published on this page with a revised &ldquo;Last Updated&rdquo; date.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f95", "Contact Us")}>
        <p>{content["f96"] ?? <>Email: info@canvassindia.com</>}</p>
        <p>{content["f97"] ?? <>Landline number: 040-29303344</>}</p>
        <p>{content["f98"] ?? <>WhatsApp: 78930 51555</>}</p>
        <p>{content["f99"] ?? <>
          Address: Building No./Flat No. H NO 4-9-197/B/84, HMT Nagar, Nacharam, Hyderabad, Telangana &ndash; 500076
        </>}</p>
      </PolicySection>
    </PolicyPageLayout>
  );
};
