'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ethers } from 'ethers';

// Declare MetaMask ethereum type
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

interface ShippingInfo {
  email: string;
  name: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function ShopPage() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: '',
    name: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const priceUSD = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE_USD || '69.99');
  const priceETH = process.env.NEXT_PUBLIC_PRODUCT_PRICE_ETH || '0.025';
  const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS!;

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed!\n\nPlease install MetaMask: https://metamask.io/download/');
        return;
      }

      console.log('Connecting wallet...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts && accounts.length > 0) {
        setConnectedWallet(accounts[0]);
        setWalletConnected(true);
        console.log('Wallet connected:', accounts[0]);
        alert(`Wallet connected!\n\n${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      const err = error as { code?: number };
      if (err.code === 4001) {
        alert('Connection rejected. Please approve the connection in MetaMask.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: selectedSize,
          priceUSD,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async () => {
    // Validate shipping info first
    if (!shippingInfo.email || !shippingInfo.name || !shippingInfo.phone || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || 
        !shippingInfo.zipCode || !shippingInfo.country) {
      alert('Please fill out all shipping information before paying.');
      return;
    }

    setLoading(true);
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert('MetaMask is not installed!\n\nPlease install MetaMask extension: https://metamask.io/download/');
        setLoading(false);
        return;
      }

      console.log('=== STARTING METAMASK PAYMENT ===');
      console.log('Wallet address:', walletAddress);
      console.log('Price ETH:', priceETH);
      console.log('Window.ethereum exists:', !!window.ethereum);
      
      // Try to connect directly with MetaMask's method first
      try {
        console.log('Step 1: Requesting accounts from MetaMask...');
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        console.log('✅ Accounts received:', accounts);
        
        if (!accounts || accounts.length === 0) {
          alert('No wallet connected. Please unlock MetaMask and try again.');
          setLoading(false);
          return;
        }

        console.log('Step 2: Creating provider...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log('✅ Signer ready');
        
        console.log('Step 3: Preparing transaction...');
        const transactionParams = {
          to: walletAddress,
          value: ethers.parseEther(priceETH),
        };
        console.log('Transaction params:', transactionParams);
        
        console.log('Step 4: Sending transaction (MetaMask should popup now)...');
        const tx = await signer.sendTransaction({
          to: walletAddress,
          value: ethers.parseEther(priceETH),
        });
        console.log('✅ Transaction sent! Hash:', tx.hash);
        
        console.log('Step 5: Waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('✅ Transaction confirmed!', receipt);
      } catch (requestError) {
        console.error('❌ Error during request:', requestError);
        throw requestError;
      }
      
      // Send order confirmation with shipping info
      const response = await fetch('/api/order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: selectedSize,
          paymentMethod: 'crypto',
          transactionHash: tx.hash,
          amount: priceETH + ' ETH',
          shippingInfo,
        }),
      });

      if (response.ok) {
        window.location.href = `/shop/success?tx=${tx.hash}`;
      }
    } catch (error) {
      console.error('MetaMask error:', error);
      
      const err = error as { code?: number; message?: string };
      let errorMessage = 'Payment failed. ';
      
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected. You declined the transaction in MetaMask.';
      } else if (err.code === -32002) {
        errorMessage = 'MetaMask is already processing a request. Please check MetaMask.';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds in your wallet to complete this transaction.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600">OFFICIAL MERCH</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src="/hoodie-product.jpg"
                alt="UnderGround TV Hoodie"
                width={800}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">UnderGround TV Hoodie</h2>
              <p className="text-2xl text-red-500 font-bold">${priceUSD.toFixed(2)} USD</p>
              <p className="text-lg text-gray-400">or {priceETH} ETH</p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-300 mb-4">
                Premium quality heavyweight hoodie featuring the UnderGround TV logo. 
                Perfect for supporting independent journalism while staying comfortable.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>80% Cotton, 20% Polyester</li>
                <li>Heavy blend fleece</li>
                <li>Front pouch pocket</li>
                <li>Double-lined hood with matching drawcord</li>
                <li>Ribbed cuffs and waistband</li>
                <li>Screen printed logo</li>
              </ul>
            </div>

            {/* Size Selection */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4">Select Size</h3>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      selectedSize === size
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'stripe'
                      ? 'border-red-600 bg-red-600/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold">Credit Card</p>
                    <p className="text-sm text-gray-400">via Stripe</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'crypto'
                      ? 'border-red-600 bg-red-600/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold">Crypto</p>
                    <p className="text-sm text-gray-400">via MetaMask</p>
                  </div>
                </button>
              </div>

              {/* Checkout Button */}
              {paymentMethod === 'stripe' ? (
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Checkout with Stripe'}
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Connect Wallet Button */}
                  {!walletConnected ? (
                    <div className="space-y-3">
                      <button
                        onClick={connectWallet}
                        className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        🦊 Connect MetaMask Wallet
                      </button>
                      <p className="text-sm text-gray-400 text-center">
                        Connect your wallet first to pay with crypto
                      </p>
                    </div>
                  ) : !showShippingForm ? (
                    <div className="space-y-3">
                      <div className="bg-green-900/20 border border-green-600 rounded-lg p-3">
                        <p className="text-sm text-green-400">
                          ✅ Wallet Connected: {connectedWallet.substring(0, 6)}...{connectedWallet.substring(38)}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowShippingForm(true)}
                        className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors"
                      >
                        Continue to Shipping Info
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Shipping Information</h4>
                      
                      {/* Email */}
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />

                      {/* Name */}
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />

                      {/* Phone */}
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />

                      {/* Street Address */}
                      <input
                        type="text"
                        placeholder="Street Address *"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />

                      {/* Apartment/Suite */}
                      <input
                        type="text"
                        placeholder="Apartment, Suite, etc. (optional)"
                        value={shippingInfo.apartment}
                        onChange={(e) => setShippingInfo({...shippingInfo, apartment: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />

                      {/* City */}
                      <input
                        type="text"
                        placeholder="City *"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />

                      {/* State and Zip */}
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="State/Province *"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Zip Code *"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                          required
                        />
                      </div>

                      {/* Country */}
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="ES">Spain</option>
                        <option value="IT">Italy</option>
                        <option value="MX">Mexico</option>
                      </select>

                      <button
                        onClick={handleCryptoPayment}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : `Pay ${priceETH} ETH with MetaMask`}
                      </button>

                      <button
                        onClick={() => setShowShippingForm(false)}
                        className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>🚚 Shipping:</strong> Orders typically ship within 3-5 business days.
                <br />
                <strong>📦 Free Shipping:</strong> On all orders within the US.
                <br />
                <strong>🔒 Secure:</strong> All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

