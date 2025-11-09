import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const testSessionId = req.nextUrl.searchParams.get('session_id');
  
  if (!testSessionId) {
    return NextResponse.json({ 
      error: 'Please provide a session_id parameter' 
    });
  }

  try {
    console.log('Testing order confirmation with session:', testSessionId);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: testSessionId,
      }),
    });

    const data = await response.json();
    
    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      data: data
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}

