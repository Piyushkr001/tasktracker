import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Send confirmation email to subscriber
    const confirmationHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 16px;">Welcome to TaskTracker! 🚀</h2>
        <p>Hi there,</p>
        <p>Thank you for subscribing to our newsletter! We are thrilled to have you join our community.</p>
        <p>You'll now receive regular updates, workflow tips, and articles about managing tasks efficiently, increasing productivity, and mastering developer collaborations.</p>
        <p style="margin-top: 24px; font-weight: bold; color: #4f46e5;">Best regards,<br>The TaskTracker Team</p>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 24px 0;">
        <p style="font-size: 11px; color: #71717a; text-align: center;">You are receiving this email because you signed up on our website. If you want to unsubscribe, please reply to this email.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Welcome to TaskTracker Newsletter! 🎉',
      html: confirmationHtml,
      text: 'Thank you for subscribing to our newsletter! We are thrilled to have you join our community.',
    });

    // 2. Notify administrator/owner about the signup
    const adminEmail = process.env.CONTACT_RECEIVER_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Newsletter Subscription: ${email} 📬`,
        text: `You have a new newsletter subscriber: ${email}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px; max-width: 600px;">
            <h3 style="color: #4f46e5;">New Subscriber Alert</h3>
            <p><strong>Email Address:</strong> ${email}</p>
            <p><strong>Signup Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error: any) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
