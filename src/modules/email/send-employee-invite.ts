"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";

function getInviteEmailHTML(email: string, inviteToken: string): string {
  const signupUrl = `${SITE_URL}/Employee_portal/signup?token=${inviteToken}`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Employee Invitation - Shareden</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Shareden</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">You're Invited to Join the Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: white; padding: 40px;">
              <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 22px;">Hello!</h2>
              <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                You have been invited to join Shareden as an employee. Click the button below to create your account and complete the signup process.
              </p>
              <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
                After signing up, your account will be reviewed by an administrator. You will receive an email once your account is approved.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${signupUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Accept Invitation & Sign Up
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0 0;">
                This link expires in 7 days. If you did not expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1f2937; padding: 24px 40px; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 Shareden. All rights reserved.</p>
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

function getAdminNotificationHTML(employeeName: string, employeeEmail: string): string {
  const adminUrl = `${SITE_URL}/admin/employees`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Employee Pending Approval</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Shareden Admin</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">New Employee Pending Approval</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: white; padding: 40px;">
              <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 22px;">Hello Admin,</h2>
              <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                A new employee has signed up and is awaiting your approval:
              </p>
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600;">${employeeName}</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">${employeeEmail}</p>
              </div>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${adminUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Review & Approve
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1f2937; padding: 24px 40px; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 Shareden. All rights reserved.</p>
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

function getApprovalResultHTML(approved: boolean): string {
  const isApproved = approved;
  const title = isApproved ? "Your Account Has Been Approved" : "Your Account Request Was Not Approved";
  const message = isApproved
    ? "Your employee account has been approved. You can now sign in to the Employee Portal and start working."
    : "Unfortunately, your account request was not approved. If you believe this is an error, please contact your administrator.";
  const ctaText = isApproved ? "Sign In to Employee Portal" : "Contact Support";
  const ctaUrl = isApproved ? `${SITE_URL}/Employee_portal/login` : `mailto:support@shareden.com`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Shareden</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: white; padding: 40px;">
              <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                ${message}
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${ctaUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  ${ctaText}
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1f2937; padding: 24px 40px; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 Shareden. All rights reserved.</p>
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

export async function sendEmployeeInviteEmail(
  email: string,
  inviteToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: "SMTP not configured" };
    }
    const html = getInviteEmailHTML(email, inviteToken);
    await transporter.sendMail({
      from: `"Shareden" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "You're Invited to Join Shareden - Employee Portal",
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send employee invite email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendAdminNewEmployeeNotification(
  employeeName: string,
  employeeEmail: string,
  adminEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: "SMTP not configured" };
    }
    const html = getAdminNotificationHTML(employeeName, employeeEmail);
    await transporter.sendMail({
      from: `"Shareden" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Employee Pending Approval: ${employeeName}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendEmployeeApprovalEmail(
  email: string,
  approved: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: "SMTP not configured" };
    }
    const html = getApprovalResultHTML(approved);
    const subject = approved
      ? "Your Shareden Employee Account Has Been Approved"
      : "Your Shareden Employee Account Request";
    await transporter.sendMail({
      from: `"Shareden" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}