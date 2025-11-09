import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    console.log('📧 Order confirmation API called');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { sessionId, size, paymentMethod, transactionHash, amount, shippingInfo } = body;

    let customerEmail = '';
    let customerName = '';
    let customerPhone = '';
    let shippingAddress: any = null;
    let orderDetails = '';

    // If Stripe payment, get session details
    if (sessionId) {
      console.log('Retrieving Stripe session:', sessionId);
      
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Stripe session retrieved successfully');

        customerEmail = session.customer_details?.email || '';
        customerName = session.customer_details?.name || '';
        customerPhone = session.customer_details?.phone || 'Not provided';
        shippingAddress = session.shipping_details?.address;
        
        console.log('Customer:', customerName, customerEmail);
        console.log('Phone:', customerPhone);
        console.log('Shipping address:', JSON.stringify(shippingAddress));
      
        orderDetails = `
          <h2>🎉 NEW ORDER - UnderGround TV Hoodie</h2>
          <p><strong>Payment Method:</strong> Credit Card (Stripe)</p>
          
          <h3>📦 Order Details:</h3>
          <ul>
            <li><strong>Product:</strong> UnderGround TV Hoodie</li>
            <li><strong>Size:</strong> ${session.metadata?.size || size || 'Not specified'}</li>
            <li><strong>Amount Paid:</strong> $${(session.amount_total! / 100).toFixed(2)} USD</li>
            <li><strong>Order ID:</strong> ${sessionId}</li>
          </ul>

          <h3>👤 Customer Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
            <li><strong>Phone:</strong> ${customerPhone}</li>
          </ul>

          <h3>📬 Shipping Address:</h3>
          <p>
            ${customerName}<br/>
            ${shippingAddress?.line1 || 'N/A'}<br/>
            ${shippingAddress?.line2 ? shippingAddress.line2 + '<br/>' : ''}
            ${shippingAddress?.city || ''}, ${shippingAddress?.state || ''} ${shippingAddress?.postal_code || ''}<br/>
            ${shippingAddress?.country || ''}
          </p>

          <hr style="margin: 20px 0; border: 1px solid #ccc;" />
          
          <p style="color: #666;">Ship within 3-5 business days and send tracking info to customer.</p>
        `;
      } catch (stripeError: any) {
        console.error('❌ Stripe error:', stripeError);
        throw new Error(`Failed to retrieve Stripe session: ${stripeError.message}`);
      }
    } else if (shippingInfo) {
      // Crypto payment with shipping info
      customerEmail = shippingInfo.email;
      customerName = shippingInfo.name;
      
      orderDetails = `
        <h2>🎉 NEW ORDER - UnderGround TV Hoodie</h2>
        <p><strong>Payment Method:</strong> Cryptocurrency (MetaMask) 🦊</p>
        
        <h3>📦 Order Details:</h3>
        <ul>
          <li><strong>Product:</strong> UnderGround TV Hoodie</li>
          <li><strong>Size:</strong> ${size}</li>
          <li><strong>Amount Paid:</strong> ${amount}</li>
          <li><strong>Transaction Hash:</strong> <a href="https://etherscan.io/tx/${transactionHash}" target="_blank">${transactionHash}</a></li>
        </ul>

        <h3>👤 Customer Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${shippingInfo.name}</li>
          <li><strong>Email:</strong> ${shippingInfo.email}</li>
          <li><strong>Phone:</strong> ${shippingInfo.phone}</li>
        </ul>

        <h3>📬 Shipping Address:</h3>
        <p>
          ${shippingInfo.name}<br/>
          ${shippingInfo.address}<br/>
          ${shippingInfo.apartment ? shippingInfo.apartment + '<br/>' : ''}
          ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}<br/>
          ${shippingInfo.country}
        </p>

        <hr style="margin: 20px 0; border: 1px solid #ccc;" />
        
        <p style="color: #666;">Ship within 3-5 business days and send tracking info to customer.</p>
      `;
    }

    // Send notification to admin FIRST (most important!)
    console.log('Sending admin email to:', process.env.ADMIN_EMAIL);
    console.log('From:', process.env.FROM_EMAIL);
    
    try {
      const emailResult = await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.ADMIN_EMAIL!,
        subject: `🛒 NEW ORDER - UnderGround TV Hoodie (${sessionId ? 'Stripe' : 'Crypto'})`,
        html: orderDetails,
      });
      console.log('✅ Admin notification sent successfully:', emailResult);
    } catch (adminError: any) {
      console.error('❌ Failed to send admin notification:', adminError);
      console.error('Admin error details:', adminError.message);
      // Don't throw - still continue to try sending customer email
    }

    // Send email to customer (with simpler confirmation message)
    if (customerEmail) {
      const customerMessage = `
        <h2>Order Confirmation - UnderGround TV</h2>
        <p>Thank you for your order, ${customerName}!</p>
        
        <h3>Order Details:</h3>
        <ul>
          <li><strong>Product:</strong> UnderGround TV Hoodie</li>
          <li><strong>Size:</strong> ${size}</li>
          ${sessionId ? `<li><strong>Amount:</strong> $${orderDetails.match(/\$(\d+\.\d+)/)?.[1]} USD</li>` : `<li><strong>Amount:</strong> ${amount}</li>`}
        </ul>

        <p>Your order will be processed and shipped within 3-5 business days.</p>
        <p>You'll receive a tracking number once your order ships.</p>
        <p>Thank you for supporting independent journalism!</p>
        
        <p>- UnderGround TV Team</p>
      `;

      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL!,
          to: customerEmail,
          subject: 'Order Confirmation - UnderGround TV Hoodie',
          html: customerMessage,
        });
        console.log('✅ Customer confirmation sent successfully');
      } catch (customerError) {
        console.error('❌ Failed to send customer confirmation:', customerError);
      }
    }

    console.log('✅ Order confirmation completed successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Order confirmation error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

