import { useSupportPage } from '../context/SupportPagesContext';
import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const CancellationPolicyPage: React.FC = () => {
  const { content, copy } = useSupportPage("cancellation-policy");
  return (
    <PolicyPageLayout title={copy("f1", "Cancellation Policy")}>
      <p>{content["f2"] ?? <>This Cancellation Policy applies to orders placed through canvassindia.com.</>}</p>

      <PolicySection heading={copy("f3", "1. Cancellation Requests")}>
        <p>{content["f4"] ?? <>Customers may request cancellation by contacting Canvas India as soon as possible after placing an order.</>}</p>
        <p>{content["f5"] ?? <>Cancellation is subject to the current processing status of the order.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f6", "2. Standard Products")}>
        <p>{content["f7"] ?? <>
          For standard, non-customised products, cancellation requests may be accepted if the order has not
          entered production or dispatch.
        </>}</p>
        <p>{content["f8"] ?? <>Once an order has entered production or has been dispatched, cancellation may no longer be possible.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f9", "3. Customised Products")}>
        <p>{content["f10"] ?? <>
          Because customised products are produced specifically according to the customer&apos;s requirements,
          cancellation may not be possible once production has commenced.
        </>}</p>
        <p>{content["f11"] ?? <>This may include products involving:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f12"] ?? <>Customer-uploaded photographs</>}</li>
          <li>{content["f13"] ?? <>Custom artwork</>}</li>
          <li>{content["f14"] ?? <>Custom text</>}</li>
          <li>{content["f15"] ?? <>Custom dimensions</>}</li>
          <li>{content["f16"] ?? <>Personalised designs</>}</li>
          <li>{content["f17"] ?? <>Special production instructions</>}</li>
        </ul>
        <p>{content["f18"] ?? <>Where applicable law provides a mandatory cancellation or consumer remedy, those rights will continue to apply.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f19", "4. Cancellation Before Production")}>
        <p>{content["f20"] ?? <>
          If an eligible cancellation request is received before production begins, Canvas India may cancel the
          order and initiate an eligible refund.
        </>}</p>
        <p>{content["f21"] ?? <>Refund processing times may depend on the payment gateway and customer&apos;s bank.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f22", "5. Cancellation After Production")}>
        <p>{content["f23"] ?? <>
          If production has already commenced, cancellation may be refused because materials, labour and
          production resources may already have been committed to the order.
        </>}</p>
        <p>{content["f24"] ?? <>For customised products, cancellation after production begins will generally not be permitted except where required by applicable law.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f25", "6. Cancellation After Dispatch")}>
        <p>{content["f26"] ?? <>Once an order has been dispatched, it generally cannot be cancelled through the Website.</>}</p>
        <p>{content["f27"] ?? <>If you no longer require the product, you may contact us regarding the applicable return process, if the product is eligible for return.</>}</p>
        <p>{content["f28"] ?? <>Customised products may not be eligible for return merely because the customer has changed their mind.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f29", "7. Order Cancellation by Canvas India")}>
        <p>{content["f30"] ?? <>Canvas India may cancel an order in circumstances including:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f31"] ?? <>Product unavailability</>}</li>
          <li>{content["f32"] ?? <>Incorrect pricing or product information</>}</li>
          <li>{content["f33"] ?? <>Payment failure</>}</li>
          <li>{content["f34"] ?? <>Suspected fraudulent activity</>}</li>
          <li>{content["f35"] ?? <>Incorrect or unverifiable customer information</>}</li>
          <li>{content["f36"] ?? <>Delivery restrictions</>}</li>
          <li>{content["f37"] ?? <>Technical errors</>}</li>
          <li>{content["f38"] ?? <>Violation of our Terms &amp; Conditions</>}</li>
        </ul>
        <p>{content["f39"] ?? <>If payment has already been received for an order cancelled by Canvas India, an eligible refund will be initiated.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f40", "8. Refund After Cancellation")}>
        <p>{content["f41"] ?? <>Approved refunds will generally be processed through the original payment method where possible.</>}</p>
        <p>{content["f42"] ?? <>The time taken for the amount to reflect in the customer&apos;s account depends on the payment gateway, bank or financial institution.</>}</p>
      </PolicySection>

      <PolicySection heading={copy("f43", "9. How to Request Cancellation")}>
        <p>{content["f44"] ?? <>To request cancellation, contact:</>}</p>
        <p>{content["f45"] ?? <>Email: info@canvassindia.com</>}</p>
        <p>{content["f46"] ?? <>Landline: 040-29303344</>}</p>
        <p>{content["f47"] ?? <>WhatsApp: 78939 46464</>}</p>
        <p>{content["f48"] ?? <>Please provide:</>}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{content["f49"] ?? <>Order number</>}</li>
          <li>{content["f50"] ?? <>Customer name</>}</li>
          <li>{content["f51"] ?? <>Registered mobile/email</>}</li>
          <li>{content["f52"] ?? <>Reason for cancellation</>}</li>
        </ul>
        <p>{content["f53"] ?? <>Cancellation requests should be submitted as early as possible.</>}</p>
      </PolicySection>
    </PolicyPageLayout>
  );
};
