// emailSender.js

import nodemailer from nodemailer

// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
  host: "mail.yourdomain.com", // your mail server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a single email
async function sendEmail(to, subject, htmlContent) {
  try {
    await transporter.sendMail({
      from: '"Ronan Dev" <no-reply@yourdomain.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
  }
}

// Function to send batch emails
async function sendBatchEmails(clients, subject, template) {
  for (const client of clients) {
    const personalizedMessage = template.replace("{{name}}", client.name);
    await sendEmail(client.email, subject, personalizedMessage);
  }
}

module.exports = { sendEmail, sendBatchEmails };
