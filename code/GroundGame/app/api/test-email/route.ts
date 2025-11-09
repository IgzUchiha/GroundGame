import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    console.log('Testing email with Resend API Key:', process.env.RESEND_API_KEY?.slice(0, 10) + '...');
    console.log('Admin Email:', process.env.ADMIN_EMAIL);
    console.log('From Email:', process.env.FROM_EMAIL);

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: 'Test Email - UnderGround TV',
      html: '<h1>Test Email</h1><p>If you receive this, your email setup is working!</p>',
    });

    console.log('Email sent successfully:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent!',
      result 
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: errorMsg,
        details: String(error)
      },
      { status: 500 }
    );
  }
}

