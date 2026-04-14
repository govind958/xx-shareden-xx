"use server";

import nodemailer from 'nodemailer';

interface InvoiceItem {
  name: string;
}

interface InvoiceData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  paymentId: string;
  items: InvoiceItem[];
}

// Create transporter - configure with your SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generateInvoiceHTML(data: InvoiceData): string {
  const orderDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemsHTML = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice - ${data.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Shareden</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Infrastructure Made Simple</p>
                  </td>
                  <td align="right">
                    <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;">
                      <span style="color: white; font-size: 12px; font-weight: 600;">INVOICE</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="background-color: white; padding: 40px;">
              
              <!-- Success Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: #ECFDF5; padding: 12px 24px; border-radius: 50px;">
                  <span style="color: #059669; font-size: 16px; font-weight: 600;">✓ Payment Successful</span>
                </div>
              </div>
              
              <!-- Greeting -->
              <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 24px;">Hi ${data.customerName}! 👋</h2>
              <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                Thank you for your purchase! Your order has been confirmed and your stacks are being prepared.
              </p>
              
              <!-- Order Details Card -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Order Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right; font-family: monospace;">${data.orderId.slice(0, 8)}...</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment ID</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right; font-family: monospace;">${data.paymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">Razorpay</td>
                  </tr>
                </table>
              </div>
              
              <!-- Items Card -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Items Purchased</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th style="padding: 12px 0; text-align: left; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e7eb;">Stack</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shareden.com'}/private?tab=stackboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4);">
                  View Your Stacks →
                </a>
              </div>
              
              <!-- Help Text -->
              <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Questions? Reply to this email or contact us at<br/>
                  <a href="mailto:support@shareden.com" style="color: #14B8A6; text-decoration: none;">support@shareden.com</a>
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 24px 40px; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 Shareden. All rights reserved.</p>
                  </td>
                  <td align="right">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shareden.com'}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy</a>
                      &nbsp;•&nbsp;
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shareden.com'}/terms" style="color: #9ca3af; text-decoration: none;">Terms</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendInvoiceEmail(data: InvoiceData): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP not configured, skipping invoice email');
      return { success: false, error: 'SMTP not configured' };
    }

    const html = generateInvoiceHTML(data);

    const mailOptions = {
      from: `"Shareden" <${process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: `Order Confirmed - Your Shareden Invoice #${data.orderId.slice(0, 8)}`,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`Invoice email sent to ${data.customerEmail} for order ${data.orderId}`);
    return { success: true };

  } catch (error) {
    console.error('Failed to send invoice email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

