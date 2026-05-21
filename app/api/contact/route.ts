import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Field Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Please provide your name.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Please enter your message.' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || 'dev@taskpilot.app';

    // 1. Send details to site administrator
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #4f46e5; border-bottom: 1px solid #e4e4e7; padding-bottom: 10px; margin-bottom: 16px;">New Contact Message 📬</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f4f4f5; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #27272a; line-height: 1.5;">
${message}
        </div>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;">
        <p style="font-size: 11px; color: #71717a;">Received at: ${new Date().toLocaleString()}</p>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `Contact Form: Message from ${name} ✉️`,
      html: adminHtml,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    // 2. Send receipt confirmation back to the user
    const userConfirmationHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 16px;">We've received your message! 🙌</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to us. We have successfully received your message and will review it shortly.</p>
        <p>Here is a copy of your message for reference:</p>
        <div style="background-color: #f4f4f5; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #71717a; line-height: 1.5; margin-bottom: 20px;">
${message}
        </div>
        <p>Our team typically responds within 24-48 business hours.</p>
        <p style="margin-top: 24px; font-weight: bold; color: #4f46e5;">Best regards,<br>The TaskTracker Team</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Message Received - TaskTracker Support ✔️',
      html: userConfirmationHtml,
      text: `Hi ${name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nYour message:\n${message}`,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error: any) {
    console.error('Contact Form API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
