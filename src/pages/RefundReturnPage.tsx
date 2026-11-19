import { useSupportPage } from '../context/SupportPagesContext';
import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const RefundReturnPage: React.FC = () => {
  const { content, copy } = useSupportPage("refund-policy");
  return (
    <PolicyPageLayout title={copy("f1", "Refund & Return Policy")}>
      <p>{content["f2"] ?? <>
        Canvas India aims to provide high-quality canvas, acrylic and related products. If you receive a product
        that is damaged, defective, incorrectly manufactured or materially different from what you ordered,
        please contact us so that we can review the issue.
      </>}</p>

      <PolicySection heading={copy("f3", "1. Eligible Returns")}>
        <p>{content["f4"] ?? <>A product may be eligible for return, replacement or refund where it is:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f5"] ?? <>Damaged during transit</>}</li>
          <li>{content["f6"] ?? <>Defective</>}</li>
          <li>{content["f7"] ?? <>Incorrectly manufactured</>}</li>
          <li>{content["f8"] ?? <>Incorrectly printed due to an error attributable to Canvas India</>}</li>
          <li>{content["f9"] ?? <>The wrong product</>}</li>
          <li>{content["f10"] ?? <>Materially different from the product ordered</>}</li>
          <li>{content["f11"] ?? <>Missing parts or components, where applicable</>}</li>
        </ul>
        <p>{content["f12"] ?? <>All return and refund requests are subject to verification.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f13", "2. Customised Products")}>
        <p>{content["f14"] ?? <>Customised and personalised products are made specifically according to the customer&apos;s instructions.</>}</p>
        <p>{content["f15"] ?? <>
          Accordingly, customised products are generally not eligible for return or refund merely because the
          customer has changed their mind, selected the wrong photograph, provided an incorrect design, entered
          incorrect text, or no longer wants the product, subject to applicable law.
        </>}</p>
        <p>{content["f16"] ?? <>
          However, customised products may qualify for replacement, return or refund where the product is
          defective, damaged, incorrectly produced, or materially different from the approved/order
          specifications due to an error attributable to Canvas India.
        </>}</p>
      </PolicySection>

      <PolicySection heading={copy("f17", "3. Wrong Image or Low-Quality Image Provided by Customer")}>
        <p>{content["f18"] ?? <>For products created using customer-provided photographs or artwork, customers are responsible for providing suitable files.</>}</p>
        <p>{content["f19"] ?? <>Canvas India is not responsible for defects caused solely by:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f20"] ?? <>Low-resolution photographs</>}</li>
          <li>{content["f21"] ?? <>Blurry source images</>}</li>
          <li>{content["f22"] ?? <>Poor-quality artwork</>}</li>
          <li>{content["f23"] ?? <>Incorrect cropping caused by customer instructions</>}</li>
          <li>{content["f24"] ?? <>Incorrect files uploaded by the customer</>}</li>
          <li>{content["f25"] ?? <>Incorrect spelling or text supplied by the customer</>}</li>
        </ul>
        <p>{content["f26"] ?? <>Where possible, we may contact customers if we identify a significant issue before production.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f27", "4. Reporting Damaged Products")}>
        <p>{content["f28"] ?? <>If your product arrives damaged, please contact us preferably within 48 hours of delivery.</>}</p>
        <p>{content["f29"] ?? <>Please provide:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f30"] ?? <>Order number</>}</li>
          <li>{content["f31"] ?? <>Photographs of the outer packaging</>}</li>
          <li>{content["f32"] ?? <>Photographs of the shipping label</>}</li>
          <li>{content["f33"] ?? <>Clear photographs/videos of the damaged product</>}</li>
          <li>{content["f34"] ?? <>Description of the issue</>}</li>
        </ul>
        <p>{content["f35"] ?? <>This information may be required to investigate the claim with the courier or logistics provider.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f36", "5. Return Request Process")}>
        <p>{content["f37"] ?? <>To request a return or replacement:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f38"] ?? <>Contact Canvas India using the official contact details.</>}</li>
          <li>{content["f39"] ?? <>Provide your order number.</>}</li>
          <li>{content["f40"] ?? <>Explain the issue.</>}</li>
          <li>{content["f41"] ?? <>Provide photographs/videos where requested.</>}</li>
          <li>{content["f42"] ?? <>Wait for confirmation from our support team.</>}</li>
          <li>{content["f43"] ?? <>If approved, follow the return instructions provided by us.</>}</li>
        </ul>
        <p>{content["f44"] ?? <>Do not send products back without receiving return instructions, unless specifically directed to do so.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f45", "6. Inspection")}>
        <p>{content["f46"] ?? <>Returned products may be inspected to determine whether the reported issue qualifies for a refund or replacement.</>}</p>
        <p>{content["f47"] ?? <>A claim may be rejected where inspection establishes that:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f48"] ?? <>The product was damaged after delivery due to customer handling.</>}</li>
          <li>{content["f49"] ?? <>The product was improperly used.</>}</li>
          <li>{content["f50"] ?? <>The issue was caused by customer-provided content.</>}</li>
          <li>{content["f51"] ?? <>The product matches the order specifications.</>}</li>
          <li>{content["f52"] ?? <>The return request does not satisfy the applicable policy.</>}</li>
        </ul>
      </PolicySection>

      <PolicySection heading={copy("f53", "7. Replacement")}>
        <p>{content["f54"] ?? <>
          Where an eligible product is found to be defective, damaged or incorrectly supplied, Canvas India may,
          at its discretion and subject to applicable law:
        </>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f55"] ?? <>Replace the product</>}</li>
          <li>{content["f56"] ?? <>Repair the product where reasonably possible</>}</li>
          <li>{content["f57"] ?? <>Provide a refund</>}</li>
          <li>{content["f58"] ?? <>Provide another appropriate remedy</>}</li>
        </ul>
        <p>{content["f59"] ?? <>For customised products, replacement may be preferred where the issue can reasonably be corrected.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f60", "8. Refunds")}>
        <p>{content["f61"] ?? <>If a refund is approved, the eligible refund will generally be processed through the original payment method.</>}</p>
        <p>{content["f62"] ?? <>The refund amount may depend on the circumstances of the order and applicable law.</>}</p>
        <p>{content["f63"] ?? <>Refunds will not be withheld where a refund is legally required.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f64", "9. Refund Processing Time")}>
        <p>{content["f65"] ?? <>
          After a refund is approved, the amount may take approximately 5&ndash;10 business days to reflect in
          the customer&apos;s bank account or payment method.
        </>}</p>
        <p>{content["f66"] ?? <>Actual processing times depend on the payment gateway, bank or financial institution.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f67", "10. Non-Returnable Situations")}>
        <p>{content["f68"] ?? <>Subject to applicable consumer rights, returns/refunds may generally not be available for:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f69"] ?? <>Change of mind</>}</li>
          <li>{content["f70"] ?? <>Personal preference</>}</li>
          <li>{content["f71"] ?? <>Incorrect customer-provided photograph</>}</li>
          <li>{content["f72"] ?? <>Customer-provided low-resolution image</>}</li>
          <li>{content["f73"] ?? <>Customer-provided incorrect artwork</>}</li>
          <li>{content["f74"] ?? <>Customer-provided spelling/text errors</>}</li>
          <li>{content["f75"] ?? <>Incorrect measurements supplied by the customer</>}</li>
          <li>{content["f76"] ?? <>Products damaged after successful delivery due to customer handling</>}</li>
          <li>{content["f77"] ?? <>Customised products where there is no defect or error attributable to Canvas India</>}</li>
        </ul>
      </PolicySection>

      <PolicySection heading={copy("f78", "11. Shipping Costs for Returns")}>
        <p>{content["f79"] ?? <>
          Where the return is approved because of an error attributable to Canvas India or a qualifying product
          defect/damage, Canvas India may bear reasonable return shipping costs as applicable.
        </>}</p>
        <p>{content["f80"] ?? <>Where a return is requested for a reason not covered by this policy, the customer may be responsible for applicable shipping or other costs.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f81", "12. Exchange")}>
        <p>{content["f82"] ?? <>Product exchanges may be offered where appropriate and subject to product availability.</>}</p>
        <p>{content["f83"] ?? <>Customised products may generally not be exchanged merely because the customer changes their mind.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f84", "13. Promotional or Discounted Orders")}>
        <p>{content["f85"] ?? <>Products purchased using promotional offers or discounts remain subject to this policy.</>}</p>
        <p>{content["f86"] ?? <>A discount or promotional offer does not remove rights that cannot legally be excluded.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f87", "14. Fraudulent or Abusive Claims")}>
        <p>{content["f88"] ?? <>Canvas India reserves the right to investigate potentially fraudulent, misleading or abusive refund/return claims.</>}</p>
        <p>{content["f89"] ?? <>Nothing in this section limits any rights available to customers under applicable law.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f90", "Contact Us")}>
        <p>{content["f91"] ?? <>Email: info@canvassindia.com</>}</p>
        <p>{content["f92"] ?? <>Landline number: 040-29303344</>}</p>
        <p>{content["f93"] ?? <>WhatsApp: 78930 51555</>}</p>
        <p>{content["f94"] ?? <>
          Address: Building No./Flat No. H NO 4-9-197/B/84, HMT Nagar, Nacharam, Hyderabad, Telangana &ndash; 500076
        </>}</p>
      </PolicySection>
    </PolicyPageLayout>
  );
};
