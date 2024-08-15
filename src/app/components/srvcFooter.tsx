import { useEffect, useState } from "react";
import { Order } from "@/data/inventory";

// Utility function to URL-encode text
function urlEncodeText(text: string) {
  return encodeURIComponent(text);
}

const SrvcFooter = ({ order }: { order: Order }) => {
  const [smsHref, setSmsHref] = useState("sms:3478226610");
  const phoneNumber = "3478226610";

  useEffect(() => {
    // Generate the SMS text from the order's prices
    let smsText = order.orders
      .map(price => `${price.name || ''} - ${price.description}: $${price.amount}`)
      .join('\n');
    
    // Add the total amount at the end of the message
    const totalAmount = order.orders.reduce((total, price) => total + price.amount, 0);
    smsText += `\nTotal: $${totalAmount}`;

    // URL-encode the SMS text
    smsText = urlEncodeText(smsText);

    // Determine the SMS href based on the user's device
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      setSmsHref(`sms:${phoneNumber}?body=${smsText}`);
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setSmsHref(`sms:${phoneNumber}&body=${smsText}`);
    } else {
      console.warn('SMS functionality is not supported.');
    }
  }, [order]);

  return (
    <div className="footer-container">
      <div className="footer row around">
        <span>OPEN 10AM TO 10PM</span>
        <span>CASH ONLY</span>
        <a href={"sms:3478226610"} style={{ textDecoration: 'none', color: 'inherit' }}>
          347.822.6610
        </a>
      </div>
    </div>
  );
}

export default SrvcFooter;
