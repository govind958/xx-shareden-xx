"use server";

import nodemailer from 'nodemailer';

export type OrderStatus = 'initiated' | 'processing' | 'in_progress' | 'completed' | 'cancelled';

interface StatusNotificationData {
  customerEmail: string;
  customerName: string;
  orderItemId: string;
  stackName: string;
  newStatus: OrderStatus;
  previousStatus?: OrderStatus;
  progressPercent?: number;
  employeeName?: string;
  adminNote?: string;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const STATUS_CONFIG: Record<OrderStatus, { 
  title: string; 
  emoji: string; 
  color: string; 
  bgColor: string;
  message: string;
  description: string;
}> = {
  initiated: {
    title: 'Order Received',
    emoji: '📋',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    message: 'Your order has been received',
    description: 'We have received your order and it is awaiting processing.',
  },
  processing: {
    title: 'Order Processing',
    emoji: '⚙️',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    message: 'Your order is now being processed',
    description: 'Our team has started working on your order. You will receive updates as we make progress.',
  },
  in_progress: {
    title: 'Work In Progress',
    emoji: '🔨',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    message: 'Your order is actively being worked on',
    description: 'Our team is actively working on your stack. Great progress is being made!',
  },
  completed: {
    title: 'Order Completed',
    emoji: '✅',
    color: '#10B981',
    bgColor: '#D1FAE5',
    message: 'Your order has been completed!',
    description: 'Great news! Your stack is ready. You can now access all the deliverables in your dashboard.',
  },
  cancelled: {
    title: 'Order Cancelled',
    emoji: '❌',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    message: 'Your order has been cancelled',
    description: 'Your order has been cancelled. If you have any questions, please contact our support team.',
  },
};

function generateStatusNotificationHTML(data: StatusNotificationData): string {
  const config = STATUS_CONFIG[data.newStatus];
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const progressBar = data.progressPercent !== undefined ? `
    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: #6B7280; font-size: 14px;">Progress</span>
        <span style="color: #111827; font-size: 14px; font-weight: 600;">${data.progressPercent}%</span>
      </div>
      <div style="background: #E5E7EB; border-radius: 9999px; height: 8px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #14B8A6 0%, #0D9488 100%); height: 100%; width: ${data.progressPercent}%; transition: width 0.3s ease;"></div>
      </div>
    </div>
  ` : '';

  const assignedEmployee = data.employeeName ? `
    <tr>
      <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Assigned To</td>
      <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.employeeName}</td>
    </tr>
  ` : '';

  const adminNoteSection = data.adminNote ? `
    <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px; margin-top: 20px;">
      <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 600;">Note from our team:</p>
      <p style="color: #78350F; font-size: 14px; margin: 8px 0 0 0;">${data.adminNote}</p>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update - ${config.title}</title>
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
                      <span style="color: white; font-size: 12px; font-weight: 600;">STATUS UPDATE</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="background-color: white; padding: 40px;">
              
              <!-- Status Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: ${config.bgColor}; padding: 16px 32px; border-radius: 50px;">
                  <span style="color: ${config.color}; font-size: 18px; font-weight: 600;">${config.emoji} ${config.title}</span>
                </div>
              </div>
              
              <!-- Greeting -->
              <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 24px;">Hi ${data.customerName}! 👋</h2>
              <p style="color: #6B7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                ${config.message}
              </p>
              
              <!-- Status Description -->
              <div style="background: ${config.bgColor}; border-left: 4px solid ${config.color}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.6;">
                  ${config.description}
                </p>
              </div>
              
              <!-- Order Details Card -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Order Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Stack</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 600;">${data.stackName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Order Item ID</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right; font-family: monospace;">${data.orderItemId.slice(0, 8)}...</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Status</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background: ${config.bgColor}; color: ${config.color}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${data.newStatus.replace('_', ' ').toUpperCase()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Updated At</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${currentDate}</td>
                  </tr>
                  ${assignedEmployee}
                </table>
                ${progressBar}
              </div>
              
              ${adminNoteSection}
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://xx-shareden-xx.vercel.app/'}/private?tab=stackboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4);">
                  View Order Status →
                </a>
              </div>
              
              <!-- Help Text -->
              <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6B7280; font-size: 14px; margin: 0;">
                  Questions about your order? Reply to this email or contact us at<br/>
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
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://xx-shareden-xx.vercel.app/'}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy</a>
                      &nbsp;•&nbsp;
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://xx-shareden-xx.vercel.app/'}/terms" style="color: #9ca3af; text-decoration: none;">Terms</a>
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

export async function sendStatusNotificationEmail(
  data: StatusNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Attempting to send status notification email...');
    console.log('SMTP_USER configured:', !!process.env.SMTP_USER);
    console.log('SMTP_PASS configured:', !!process.env.SMTP_PASS);
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP not configured, skipping status notification email');
      return { success: false, error: 'SMTP not configured' };
    }

    const config = STATUS_CONFIG[data.newStatus];
    const html = generateStatusNotificationHTML(data);

    const mailOptions = {
      from: `"Shareden" <${process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: `${config.emoji} ${config.title} - ${data.stackName}`,
      html: html,
    };

    console.log('Sending email to:', data.customerEmail);
    console.log('Subject:', mailOptions.subject);
    
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Status notification email sent to ${data.customerEmail} for order item ${data.orderItemId} - Status: ${data.newStatus}`);
    console.log('Message ID:', info.messageId);
    return { success: true };

  } catch (error) {
    console.error('Failed to send status notification email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

export async function sendBulkStatusNotifications(
  notifications: StatusNotificationData[]
): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  const results = await Promise.allSettled(
    notifications.map(data => sendStatusNotificationEmail(data))
  );

  const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - sent;
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason?.message || 'Unknown error');

  return { success: failed === 0, sent, failed, errors };
}
