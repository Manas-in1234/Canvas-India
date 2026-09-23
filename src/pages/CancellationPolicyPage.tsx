import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const CancellationPolicyPage: React.FC = () => {
  return (
    <PolicyPageLayout title="Cancellation Policy">
      <p>This Cancellation Policy applies to orders placed through canvassindia.com.</p>

      <PolicySection heading="1. Cancellation Requests">
        <p>Customers may request cancellation by contacting Canvas India as soon as possible after placing an order.</p>
        <p>Cancellation is subject to the current processing status of the order.</p>
      </PolicySection>

      <PolicySection heading="2. Standard Products">
        <p>
          For standard, non-customised products, cancellation requests may be accepted if the order has not
          entered production or dispatch.
        </p>
        <p>Once an order has entered production or has been dispatched, cancellation may no longer be possible.</p>
      </PolicySection>

      <PolicySection heading="3. Customised Products">
        <p>
          Because customised products are produced specifically according to the customer&apos;s requirements,
          cancellation may not be possible once production has commenced.
        </p>
        <p>This may include products involving:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Customer-uploaded photographs</li>
          <li>Custom artwork</li>
          <li>Custom text</li>
          <li>Custom dimensions</li>
          <li>Personalised designs</li>
          <li>Special production instructions</li>
        </ul>
        <p>Where applicable law provides a mandatory cancellation or consumer remedy, those rights will continue to apply.</p>
      </PolicySection>

      <PolicySection heading="4. Cancellation Before Production">
        <p>
          If an eligible cancellation request is received before production begins, Canvas India may cancel the
          order and initiate an eligible refund.
        </p>
        <p>Refund processing times may depend on the payment gateway and customer&apos;s bank.</p>
      </PolicySection>

      <PolicySection heading="5. Cancellation After Production">
        <p>
          If production has already commenced, cancellation may be refused because materials, labour and
          production resources may already have been committed to the order.
        </p>
        <p>For customised products, cancellation after production begins will generally not be permitted except where required by applicable law.</p>
      </PolicySection>

      <PolicySection heading="6. Cancellation After Dispatch">
        <p>Once an order has been dispatched, it generally cannot be cancelled through the Website.</p>
        <p>If you no longer require the product, you may contact us regarding the applicable return process, if the product is eligible for return.</p>
        <p>Customised products may not be eligible for return merely because the customer has changed their mind.</p>
      </PolicySection>

      <PolicySection heading="7. Order Cancellation by Canvas India">
        <p>Canvas India may cancel an order in circumstances including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Product unavailability</li>
          <li>Incorrect pricing or product information</li>
          <li>Payment failure</li>
          <li>Suspected fraudulent activity</li>
          <li>Incorrect or unverifiable customer information</li>
          <li>Delivery restrictions</li>
          <li>Technical errors</li>
          <li>Violation of our Terms &amp; Conditions</li>
        </ul>
        <p>If payment has already been received for an order cancelled by Canvas India, an eligible refund will be initiated.</p>
      </PolicySection>

      <PolicySection heading="8. Refund After Cancellation">
        <p>Approved refunds will generally be processed through the original payment method where possible.</p>
        <p>The time taken for the amount to reflect in the customer&apos;s account depends on the payment gateway, bank or financial institution.</p>
      </PolicySection>

      <PolicySection heading="9. How to Request Cancellation">
        <p>To request cancellation, contact:</p>
        <p>Email: info@canvassindia.com</p>
        <p>Phone: 78930 51555</p>
        <p>Please provide:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Order number</li>
          <li>Customer name</li>
          <li>Registered mobile/email</li>
          <li>Reason for cancellation</li>
        </ul>
        <p>Cancellation requests should be submitted as early as possible.</p>
      </PolicySection>
    </PolicyPageLayout>
  );
};
