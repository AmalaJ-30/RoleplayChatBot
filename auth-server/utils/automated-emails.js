
import dotenv from 'dotenv';
dotenv.config();

import postmark from 'postmark';
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

export async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`; // Point to your frontend or backend verification route

  const htmlBody = `
    <h2>Verify Your Email</h2>
    <p>Click the link below to activate your Roleplay Chatbot account:</p>
    <a href="${verifyUrl}">Verify My Account</a>
    <p>If you did not sign up, please ignore this email.</p>
  `;

  await client.sendEmail({
    From: process.env.POSTMARK_SENDER, // e.g., "no-reply@yourdomain.com"
    To: to,
    Subject: "Verify your Roleplay Chatbot account",
    HtmlBody: htmlBody,
    TextBody: `Visit this link to verify your account: ${verifyUrl}`
  });
}
