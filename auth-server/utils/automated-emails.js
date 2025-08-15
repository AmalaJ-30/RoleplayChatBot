
import dotenv from 'dotenv';
dotenv.config();

import postmark from 'postmark';
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export async function sendVerificationEmail(to, token) {
  const verifyUrl = `${FRONTEND_URL}/signup/verify?token=${encodeURIComponent(token)}`;

  const htmlBody = `
    <h2>Verify Your Email</h2>
    <p>Click the link below to activate your Roleplay Chatbot account:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>If you did not sign up, please ignore this email.</p>
  `;

  await client.sendEmail({
    From: process.env.POSTMARK_SENDER,
    To: to,
    Subject: "Verify your Roleplay Chatbot account",
    HtmlBody: htmlBody,
    TextBody: `Visit this link to verify your account: ${verifyUrl}`
  });
}

export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const htmlBody = `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password:</p>
    <p>Please note that this link expires after 15 minutes</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  await client.sendEmail({
    From: process.env.POSTMARK_SENDER,
    To: to,
    Subject: "Reset your CampusMind password",
    HtmlBody: htmlBody,
    TextBody: `Visit this link to reset your password: ${resetUrl}`
  });
}
