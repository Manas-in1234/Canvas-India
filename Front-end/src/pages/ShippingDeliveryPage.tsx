import React from 'react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { PolicySection } from '../components/PolicySection';

export const ShippingDeliveryPage: React.FC = () => {
  return (
    <PolicyPageLayout title="Shipping & Delivery Policy">
      <p>
        This Shipping &amp; Delivery Policy explains how Canvas India processes and delivers orders placed
        through canvassindia.com.
      </p>

      <PolicySection heading="1. Order Processing">
        <p>Once your order is successfully placed and payment is confirmed, we begin processing your order.</p>
        <p>For standard products, processing may generally take 2&ndash;3 business days.</p>
        <p>
          For customised products, additional production time may be required depending on the product, artwork,
          size, quantity and customisation requirements.
        </p>
        <p>
          The estimated processing or delivery timeline displayed at checkout or communicated by our team should
          be considered the applicable estimate for your order.
        </p>
      </PolicySection>

      <PolicySection heading="2. Delivery Time">
        <p>
          After an order is dispatched, delivery generally takes approximately 4&ndash;5 business days, depending
          on the delivery location and courier service.
        </p>
        <p>Delivery timelines are estimates and are not guaranteed unless expressly stated otherwise.</p>
        <p>Remote locations may require additional delivery time.</p>
      </PolicySection>

      <PolicySection heading="3. Shipping Charges">
        <p>Shipping charges, where applicable, will be displayed during checkout before you complete your purchase.</p>
        <p>Shipping charges may vary based on:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Product size</li>
          <li>Product weight</li>
          <li>Quantity</li>
          <li>Delivery location</li>
          <li>Shipping service selected</li>
        </ul>
      </PolicySection>

      <PolicySection heading="4. Delivery Address">
        <p>Customers are responsible for providing an accurate and complete delivery address.</p>
        <p>Please carefully verify:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name</li>
          <li>House/Flat number</li>
          <li>Street/locality</li>
          <li>City</li>
          <li>State</li>
          <li>PIN code</li>
          <li>Mobile number</li>
        </ul>
        <p>
          Canvas India will not be responsible for delays or additional costs caused by incorrect or incomplete
          address information supplied by the customer.
        </p>
      </PolicySection>

      <PolicySection heading="5. Tracking">
        <p>Where tracking is available, tracking details may be shared with you after dispatch.</p>
        <p>You may use the tracking information provided to monitor your shipment.</p>
      </PolicySection>

      <PolicySection heading="6. Delivery Attempts">
        <p>Courier partners may make multiple delivery attempts depending on their policies.</p>
        <p>If delivery fails because:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The recipient is unavailable</li>
          <li>The address is incorrect</li>
          <li>The recipient refuses delivery</li>
          <li>The customer does not respond to the courier</li>
          <li>The customer fails to accept the shipment</li>
        </ul>
        <p>additional shipping or re-delivery charges may apply where permitted.</p>
      </PolicySection>

      <PolicySection heading="7. Damaged Packages">
        <p>We strongly recommend inspecting the package at the time of delivery.</p>
        <p>If the package appears visibly damaged, please:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Take photographs/videos of the package before opening it.</li>
          <li>Record the condition of the outer packaging.</li>
          <li>Open the package carefully.</li>
          <li>Take clear photographs/videos of the product and packaging.</li>
          <li>Contact Canvas India as soon as reasonably possible.</li>
        </ul>
        <p>Claims relating to transit damage should preferably be reported within 48 hours of delivery.</p>
        <p>Failure to report damage promptly may make investigation or resolution more difficult.</p>
      </PolicySection>

      <PolicySection heading="8. Wrong or Missing Product">
        <p>If you receive:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The wrong product</li>
          <li>The wrong size</li>
          <li>The wrong design</li>
          <li>A missing item</li>
          <li>A materially different product from what was ordered</li>
        </ul>
        <p>please contact us promptly with your order number and supporting photographs/videos.</p>
        <p>
          We will investigate and, where the issue is attributable to Canvas India, provide an appropriate
          resolution in accordance with our Refund &amp; Return Policy.
        </p>
      </PolicySection>

      <PolicySection heading="9. Delivery Delays">
        <p>Canvas India is not responsible for delays caused by third-party courier companies or circumstances outside our reasonable control.</p>
        <p>Examples include:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Extreme weather</li>
          <li>Natural disasters</li>
          <li>Strikes</li>
          <li>Government restrictions</li>
          <li>Transportation disruptions</li>
          <li>Festivals and public holidays</li>
          <li>Incorrect addresses</li>
          <li>Remote-area delivery issues</li>
          <li>Unexpected logistics disruptions</li>
        </ul>
        <p>We will, however, make reasonable efforts to assist you in tracking and resolving delayed shipments.</p>
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
