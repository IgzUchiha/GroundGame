'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const txHash = searchParams.get('tx');
  const [loading, setLoading] = useState(true);
  const [orderSent, setOrderSent] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Send order confirmation for Stripe payment
      console.log('Sending order confirmation for session:', sessionId);
      fetch('/api/order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          console.log('Order confirmation response status:', response.status);
          console.log('Order confirmation response data:', data);
          if (!response.ok) {
            console.error('Order confirmation failed with status:', response.status);
            console.error('Error details:', data);
            alert('Failed to send order confirmation email. Please contact support with your order details.');
          } else {
            console.log('✅ Order confirmation sent successfully!');
          }
          setOrderSent(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error sending confirmation:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold mb-4 text-green-500">Order Confirmed!</h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Thank you for your purchase and for supporting independent journalism!
          </p>

          <div className="bg-gray-900 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-2xl font-bold mb-4 text-red-600">What's Next?</h2>
            
            {sessionId ? (
              <>
                <div className="space-y-3 text-gray-300">
                  <p>✅ Your payment has been processed successfully</p>
                  <p>✅ A confirmation email has been sent to your inbox</p>
                  <p>📦 Your UnderGround TV hoodie will ship within 3-5 business days</p>
                  <p>📧 You'll receive a tracking number once your order ships</p>
                </div>
              </>
            ) : txHash ? (
              <>
                <div className="space-y-3 text-gray-300 mb-4">
                  <p>✅ Your crypto payment has been confirmed</p>
                  <p>✅ A confirmation email has been sent with your shipping details</p>
                  <p>📦 Your UnderGround TV hoodie will ship within 3-5 business days</p>
                  <p>📧 You'll receive a tracking number once your order ships</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                  <p className="text-xs text-green-400 break-all font-mono">{txHash}</p>
                  <a 
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block"
                  >
                    View on Etherscan →
                  </a>
                </div>
              </>
            ) : (
              <p className="text-gray-300">Your order has been received and is being processed.</p>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Back to Home
            </Link>
            
            <div className="text-center">
              <Link
                href="/shop"
                className="text-red-500 hover:text-red-400 underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Questions about your order? Contact us at{' '}
              <a href="mailto:bruh54167@gmail.com" className="text-red-500 hover:text-red-400">
                bruh54167@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

