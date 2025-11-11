// index.js

import { sendBatchEmails } from "./common/helpers/emailSender.js";

// List of clients (small strategic batch)
const clients = [
  { name: "Ronan Sibunga ", email: "ronan.sibunga@gmail.com" },
  { name: "Mich Sibunga  ", email: "mich.sumida@gmail.com" },
];

// Email template
const createTemplate = (name) => `
  <h1>Hello ${name}</h1>
  <p>We’re excited to share our latest web and mobile solutions with you.</p>
  <p>Visit our website to see what we can do for your business!</p>
`;
const subject = "Ronan Dev: Solutions Tailored for You";

// Send the emails
sendBatchEmails(clients, subject, createTemplate)
  .then(() => console.log("All emails sent!"))
  .catch((err) => console.error(err));
