import nodemailer from 'nodemailer';

// Helper to initialize Nodemailer SMTP transporter if config is present
const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const secure = process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('[MAIL UTILITY WARNING] SMTP credentials are not configured in your environment. Printing mock email below:');
    console.log('==================== MOCK EMAIL START ====================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (text) console.log(`Text Body: ${text}`);
    if (html) console.log(`HTML Body:\n${html}`);
    console.log('==================== MOCK EMAIL END ======================');
    return { mock: true, messageId: `mock-email-${Date.now()}` };
  }

  const sender = process.env.EMAIL_USER;
  return transporter.sendMail({
    from: `"TaskTracker" <${sender}>`,
    to,
    subject,
    text,
    html,
  });
}
