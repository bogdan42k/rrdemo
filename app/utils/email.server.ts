import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { randomBytes } from "crypto";

// SMTP Configuration from environment variables
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465 (SSL/TLS), false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "noreply@example.com";
const FROM_NAME = process.env.SMTP_FROM_NAME || "rrdemo";

// Create reusable transporter
let transporter: Transporter;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

// Verify SMTP connection (useful for debugging)
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log("✅ SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    return false;
  }
}

// Token generation utility
export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

// Base email sending function
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("📧 Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return false;
  }
}

// Email Templates

interface WelcomeEmailOptions {
  to: string;
  name: string;
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailOptions): Promise<boolean> {
  const subject = `Welcome to ${FROM_NAME}!`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${FROM_NAME}!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for verifying your email and joining ${FROM_NAME}. We're excited to have you on board!</p>
            <p>Your account is now fully activated and ready to use.</p>
            <a href="${process.env.APP_URL || "http://localhost:5173"}/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The ${FROM_NAME} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

interface VerificationEmailOptions {
  to: string;
  name: string;
  token: string;
}

export async function sendVerificationEmail({ to, name, token }: VerificationEmailOptions): Promise<boolean> {
  const verificationUrl = `${process.env.APP_URL || "http://localhost:5173"}/verify?token=${token}`;
  const subject = `Verify your email address`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .code { background: #fff; padding: 15px; border: 2px dashed #667eea; border-radius: 5px; font-family: monospace; font-size: 16px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for registering with ${FROM_NAME}. To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">${verificationUrl}</div>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This verification link will expire in 24 hours. If you didn't create an account with ${FROM_NAME}, please ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

interface PasswordResetEmailOptions {
  to: string;
  name: string;
  token: string;
}

export async function sendPasswordResetEmail({ to, name, token }: PasswordResetEmailOptions): Promise<boolean> {
  const resetUrl = `${process.env.APP_URL || "http://localhost:5173"}/reset-password?token=${token}`;
  const subject = `Reset your password`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .code { background: #fff; padding: 15px; border: 2px dashed #dc3545; border-radius: 5px; font-family: monospace; font-size: 16px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>We received a request to reset your password for your ${FROM_NAME} account. Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">${resetUrl}</div>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will not change unless you click the link above</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

interface LoginNotificationOptions {
  to: string;
  name: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export async function sendLoginNotification({
  to,
  name,
  ipAddress,
  userAgent,
  timestamp
}: LoginNotificationOptions): Promise<boolean> {
  const subject = `New login to your ${FROM_NAME} account`;

  const formattedDate = timestamp.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Parse user agent to extract browser/device info (basic parsing)
  const browser = userAgent?.includes("Chrome") ? "Chrome"
    : userAgent?.includes("Firefox") ? "Firefox"
    : userAgent?.includes("Safari") ? "Safari"
    : userAgent?.includes("Edge") ? "Edge"
    : "Unknown Browser";

  const device = userAgent?.includes("Mobile") ? "Mobile Device"
    : userAgent?.includes("Tablet") ? "Tablet"
    : "Desktop/Laptop";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
          .info-item { display: flex; margin: 8px 0; }
          .info-label { font-weight: bold; min-width: 120px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 New Login Detected</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>We detected a new login to your ${FROM_NAME} account. If this was you, you can safely ignore this email.</p>

            <div class="info-box">
              <h3 style="margin-top: 0;">Login Details:</h3>
              <div class="info-item">
                <span class="info-label">Time:</span>
                <span>${formattedDate}</span>
              </div>
              ${ipAddress ? `
              <div class="info-item">
                <span class="info-label">IP Address:</span>
                <span>${ipAddress}</span>
              </div>
              ` : ''}
              <div class="info-item">
                <span class="info-label">Device:</span>
                <span>${device}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Browser:</span>
                <span>${browser}</span>
              </div>
            </div>

            <div class="warning">
              <strong>⚠️ Wasn't you?</strong>
              <p style="margin: 10px 0;">If you didn't log in at this time, your account may have been compromised. Please secure your account immediately:</p>
              <a href="${process.env.APP_URL || "http://localhost:5173"}/reset" class="button">Reset Your Password</a>
            </div>

            <p style="margin-top: 30px;">Stay safe,<br>The ${FROM_NAME} Security Team</p>
          </div>
          <div class="footer">
            <p>This is an automated security notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

// Utility function to calculate token expiry
export function getTokenExpiry(hoursFromNow: number = 24): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hoursFromNow);
  return expiry;
}

// Utility to check if token is expired
export function isTokenExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() > expiryDate;
}
