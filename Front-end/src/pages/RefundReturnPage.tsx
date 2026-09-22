import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const RefundReturnPage: React.FC = () => {
  return (
    <PolicyPageLayout title="Refund & Return Policy">
      <p>
        Canvas India aims to provide high-quality canvas, acrylic and related products. If you receive a product
        that is damaged, defective, incorrectly manufactured or materially different from what you ordered,
        please contact us so that we can review the issue.
      </p>

      <PolicySection heading="1. Eligible Returns">
        <p>A product may be eligible for return, replacement or refund where it is:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Damaged during transit</li>
          <li>Defective</li>
          <li>Incorrectly manufactured</li>
          <li>Incorrectly printed due to an error attributable to Canvas India</li>
          <li>The wrong product</li>
          <li>Materially different from the product ordered</li>
          <li>Missing parts or components, where applicable</li>
        </ul>
        <p>All return and refund requests are subject to verification.</p>
      </PolicySection>

      <PolicySection heading="2. Customised Products">
        <p>Customised and personalised products are made specifically according to the customer&apos;s instructions.</p>
        <p>
          Accordingly, customised products are generally not eligible for return or refund merely because the
          customer has changed their mind, selected the wrong photograph, provided an incorrect design, entered
          incorrect text, or no longer wants the product, subject to applicable law.
        </p>
        <p>
          However, customised products may qualify for replacement, return or refund where the product is
          defective, damaged, incorrectly produced, or materially different from the approved/order
          specifications due to an error attributable to Canvas India.
        </p>
      </PolicySection>

      <PolicySection heading="3. Wrong Image or Low-Quality Image Provided by Customer">
        <p>For products created using customer-provided photographs or artwork, customers are responsible for providing suitable files.</p>
        <p>Canvas India is not responsible for defects caused solely by:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Low-resolution photographs</li>
          <li>Blurry source images</li>
          <li>Poor-quality artwork</li>
          <li>Incorrect cropping caused by customer instructions</li>
          <li>Incorrect files uploaded by the customer</li>
          <li>Incorrect spelling or text supplied by the customer</li>
        </ul>
        <p>Where possible, we may contact customers if we identify a significant issue before production.</p>
      </PolicySection>

      <PolicySection heading="4. Reporting Damaged Products">
        <p>If your product arrives damaged, please contact us preferably within 48 hours of delivery.</p>
        <p>Please provide:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Order number</li>
          <li>Photographs of the outer packaging</li>
          <li>Photographs of the shipping label</li>
          <li>Clear photographs/videos of the damaged product</li>
          <li>Description of the issue</li>
        </ul>
        <p>This information may be required to investigate the claim with the courier or logistics provider.</p>
      </PolicySection>

      <PolicySection heading="5. Return Request Process">
        <p>To request a return or replacement:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contact Canvas India using the official contact details.</li>
          <li>Provide your order number.</li>
          <li>Explain the issue.</li>
          <li>Provide photographs/videos where requested.</li>
          <li>Wait for confirmation from our support team.</li>
          <li>If approved, follow the return instructions provided by us.</li>
        </ul>
        <p>Do not send products back without receiving return instructions, unless specifically directed to do so.</p>
      </PolicySection>

      <PolicySection heading="6. Inspection">
        <p>Returned products may be inspected to determine whether the reported issue qualifies for a refund or replacement.</p>
        <p>A claim may be rejected where inspection establishes that:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The product was damaged after delivery due to customer handling.</li>
          <li>The product was improperly used.</li>
          <li>The issue was caused by customer-provided content.</li>
          <li>The product matches the order specifications.</li>
          <li>The return request does not satisfy the applicable policy.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="7. Replacement">
        <p>
          Where an eligible product is found to be defective, damaged or incorrectly supplied, Canvas India may,
          at its discretion and subject to applicable law:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Replace the product</li>
          <li>Repair the product where reasonably possible</li>
          <li>Provide a refund</li>
          <li>Provide another appropriate remedy</li>
        </ul>
        <p>For customised products, replacement may be preferred where the issue can reasonably be corrected.</p>
      </PolicySection>

      <PolicySection heading="8. Refunds">
        <p>If a refund is approved, the eligible refund will generally be processed through the original payment method.</p>
        <p>The refund amount may depend on the circumstances of the order and applicable law.</p>
        <p>Refunds will not be withheld where a refund is legally required.</p>
      </PolicySection>

      <PolicySection heading="9. Refund Processing Time">
        <p>
          After a refund is approved, the amount may take approximately 5&ndash;10 business days to reflect in
          the customer&apos;s bank account or payment method.
        </p>
        <p>Actual processing times depend on the payment gateway, bank or financial institution.</p>
      </PolicySection>

      <PolicySection heading="10. Non-Returnable Situations">
        <p>Subject to applicable consumer rights, returns/refunds may generally not be available for:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Change of mind</li>
          <li>Personal preference</li>
          <li>Incorrect customer-provided photograph</li>
          <li>Customer-provided low-resolution image</li>
          <li>Customer-provided incorrect artwork</li>
          <li>Customer-provided spelling/text errors</li>
          <li>Incorrect measurements supplied by the customer</li>
          <li>Products damaged after successful delivery due to customer handling</li>
          <li>Customised products where there is no defect or error attributable to Canvas India</li>
        </ul>
      </PolicySection>

      <PolicySection heading="11. Shipping Costs for Returns">
        <p>
          Where the return is approved because of an error attributable to Canvas India or a qualifying product
          defect/damage, Canvas India may bear reasonable return shipping costs as applicable.
        </p>
        <p>Where a return is requested for a reason not covered by this policy, the customer may be responsible for applicable shipping or other costs.</p>
      </PolicySection>

      <PolicySection heading="12. Exchange">
        <p>Product exchanges may be offered where appropriate and subject to product availability.</p>
        <p>Customised products may generally not be exchanged merely because the customer changes their mind.</p>
      </PolicySection>

      <PolicySection heading="13. Promotional or Discounted Orders">
        <p>Products purchased using promotional offers or discounts remain subject to this policy.</p>
        <p>A discount or promotional offer does not remove rights that cannot legally be excluded.</p>
      </PolicySection>

      <PolicySection heading="14. Fraudulent or Abusive Claims">
        <p>Canvas India reserves the right to investigate potentially fraudulent, misleading or abusive refund/return claims.</p>
        <p>Nothing in this section limits any rights available to customers under applicable law.</p>
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
