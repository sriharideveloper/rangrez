import nodemailer from 'nodemailer';

// Configure the Nodemailer transporter
// Assumes GMAIL_USER and GMAIL_PASS are set in .env.local
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const STORE_NAME = "Rangrez";
const STORE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://rangrez.store"; // Replace with actual store URL if different
const SUPPORT_EMAIL = process.env.GMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

// Reusable styling for emails to ensure aesthetic and premium look
const emailStyles = `
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9fafb;
      color: #1f2937;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    .header {
      background-color: #111827;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #111827;
    }
    .order-details-box {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
    }
    .order-details-box h3 {
      margin-top: 0;
      font-size: 16px;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .item-row:last-child {
      border-bottom: none;
    }
    .item-name {
      font-weight: 500;
      color: #111827;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #4b5563;
    }
    .totals-row.grand-total {
      font-weight: 700;
      font-size: 18px;
      color: #111827;
      border-top: 2px solid #e5e7eb;
      padding-top: 16px;
      margin-top: 8px;
    }
    .cta-button {
      display: inline-block;
      background-color: #c9a050;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 30px 0;
      transition: background-color 0.2s;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .footer a {
      color: #c9a050;
      text-decoration: none;
    }
  </style>
`;

/**
 * Sends order confirmation emails to the customer and the admin.
 * @param {Object} orderData - The destructured session/order data from Supabase.
 * @param {string} orderId - The created Order ID.
 */
export async function sendOrderConfirmationEmail(orderData, orderId) {
  const {
    address,
    items,
    subtotal,
    discount_amount,
    shipping_fee,
    total,
  } = orderData;

  const customerEmail = address?.email;
  const customerName = address?.name || 'Valued Customer';

  if (!customerEmail) {
    console.error("No customer email found for order confirmation.");
    return;
  }

  const itemsList = items || [];
  // Build items HTML
  const itemsHtml = itemsList.map(item => `
    <div class="item-row">
      <span class="item-name">${item.product_name || item.name || 'Item'} x${item.quantity || 1}</span>
      <span>₹${item.price || 0}</span>
    </div>
  `).join('');

  // HTML Template for Customer
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${STORE_NAME}</h1>
        </div>
        <div class="content">
          <div class="greeting">Thank you for your purchase, ${customerName}!</div>
          <p>We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
          
          <div class="order-details-box">
            <h3>Order Summary (#${orderId.slice(0, 8).toUpperCase()})</h3>
            ${itemsHtml}
            <div style="margin-top: 16px;">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>₹${subtotal || total}</span>
              </div>
              ${discount_amount ? `
              <div class="totals-row">
                <span>Discount</span>
                <span>-₹${discount_amount}</span>
              </div>
              ` : ''}
              <div class="totals-row">
                <span>Shipping</span>
                <span>${shipping_fee ? `₹${shipping_fee}` : 'Free'}</span>
              </div>
              <div class="totals-row grand-total">
                <span>Total</span>
                <span>₹${total}</span>
              </div>
            </div>
          </div>

          <center>
            <a href="${STORE_URL}" class="cta-button">Continue Shopping</a>
          </center>

          <p>If you have any questions, reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #c9a050;">${SUPPORT_EMAIL}</a>.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // HTML Template for Admin
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header" style="background-color: #2e7d32;">
          <h1>New Order Received</h1>
        </div>
        <div class="content">
          <div class="greeting">A new order has been placed!</div>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Total Amount:</strong> ₹${total}</p>
          
          <center>
            <a href="${STORE_URL}/admin/orders" class="cta-button" style="background-color: #2e7d32;">View in Admin Panel</a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send Customer Email
    await transporter.sendMail({
      from: `"${STORE_NAME}" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation from ${STORE_NAME} (#${orderId.slice(0, 8).toUpperCase()})`,
      html: customerHtml,
    });

    // Send Admin Email
    await transporter.sendMail({
      from: `"${STORE_NAME} Alerts" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `[New Order] ₹${total} - ${customerName}`,
      html: adminHtml,
    });

    console.log(`Order confirmation emails sent for Order ID: ${orderId}`);
  } catch (error) {
    console.error("Error sending order confirmation emails:", error);
  }
}

/**
 * Sends an order status update email to the customer.
 * @param {string} orderId - The Order ID.
 * @param {string} customerEmail - The customer's email.
 * @param {string} customerName - The customer's name (optional).
 * @param {Object} updates - The updates object containing order_status, tracking_url, etc.
 */
export async function sendStatusUpdateEmail(orderId, customerEmail, customerName, updates) {
  if (!customerEmail) {
    console.error("No customer email provided for status update.");
    return;
  }

  const statusMap = {
    'processing': 'Processing',
    'confirmed': 'Confirmed',
    'shipped': 'Shipped',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  const readableStatus = statusMap[updates.order_status] || updates.order_status;
  const name = customerName || 'Valued Customer';
  
  let customMessage = `Your order status has been updated to: <strong>${readableStatus}</strong>.`;
  
  if (updates.order_status === 'shipped') {
    customMessage = `Great news! Your order has been shipped and is on its way to you.`;
  } else if (updates.order_status === 'delivered') {
    customMessage = `Your order has been delivered! We hope you love your purchase.`;
  }

  const trackingHtml = updates.tracking_url ? `
    <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-left: 4px solid #c9a050; border-radius: 4px;">
      <h4 style="margin-top: 0; margin-bottom: 10px; color: #1e293b;">Tracking Information</h4>
      <p style="margin: 0; color: #475569; font-size: 14px;">Your order is being shipped via DTDC.</p>
      ${updates.tracking_number ? `<p style="margin: 5px 0 15px 0; color: #475569; font-size: 14px;">Tracking Number: <strong>${updates.tracking_number}</strong></p>` : ''}
      <a href="${updates.tracking_url}" style="display: inline-block; background-color: #1e293b; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: 500; font-size: 14px;">Track Package</a>
    </div>
  ` : '';

  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${STORE_NAME}</h1>
        </div>
        <div class="content">
          <div class="greeting">Order Update, ${name}</div>
          <p style="font-size: 16px;">${customMessage}</p>
          
          <div class="order-details-box">
            <h3 style="border: none; padding: 0; margin: 0;">Order #${orderId.slice(0, 8).toUpperCase()}</h3>
            <p style="margin-top: 8px; color: #6b7280; font-size: 14px;">Current Status: <span style="font-weight: 600; color: #c9a050;">${readableStatus}</span></p>
          </div>

          ${trackingHtml}

          <center>
            <a href="${STORE_URL}" class="cta-button">Visit Store</a>
          </center>

          <p>If you have any questions, reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #c9a050;">${SUPPORT_EMAIL}</a>.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${STORE_NAME}" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `Update on your ${STORE_NAME} Order #${orderId.slice(0, 8).toUpperCase()}`,
      html: customerHtml,
    });

    console.log(`Order status update email sent to ${customerEmail} for Order ID: ${orderId}`);
  } catch (error) {
    console.error("Error sending order status update email:", error);
  }
}
