'use client';

import { useState } from 'react';
import { FaBitcoin, FaEthereum, FaCopy, FaCheck } from 'react-icons/fa';

export default function DonationsPage() {
  const [copiedBitcoin, setCopiedBitcoin] = useState(false);
  const [copiedEthereum, setCopiedEthereum] = useState(false);

  // Crypto wallet addresses for donations
  const bitcoinAddress = 'bc1qfs4lley9xha93usq0ndms9lnv0rtylqf9j39pn';
  const ethereumAddress = '0xC11f1d9832167378CE3d42dB7460c2dB0008b8cf';

  const copyToClipboard = (text: string, type: 'bitcoin' | 'ethereum') => {
    navigator.clipboard.writeText(text);
    if (type === 'bitcoin') {
      setCopiedBitcoin(true);
      setTimeout(() => setCopiedBitcoin(false), 2000);
    } else {
      setCopiedEthereum(true);
      setTimeout(() => setCopiedEthereum(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">SUPPORT UNDERGROUND TV</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Donate?</h2>
          <p className="text-gray-300 mb-4">
            UnderGround TV is committed to independent journalism that exposes the truth without corporate or government influence. 
            Your donations directly support our investigative reporting, video production, and on-the-ground coverage.
          </p>
          <p className="text-gray-300">
            We accept cryptocurrency donations to ensure maximum privacy and security for our supporters.
          </p>
        </div>

        {/* Bitcoin Donation */}
        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <FaBitcoin className="text-orange-500 text-4xl mr-4" />
            <h3 className="text-2xl font-bold">Bitcoin (BTC)</h3>
          </div>
          <p className="text-gray-400 mb-4">Send Bitcoin to this address:</p>
          <div className="bg-gray-900 p-4 rounded-lg mb-4 break-all">
            <code className="text-sm text-green-400">{bitcoinAddress}</code>
          </div>
          <button
            onClick={() => copyToClipboard(bitcoinAddress, 'bitcoin')}
            className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {copiedBitcoin ? (
              <>
                <FaCheck className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <FaCopy className="mr-2" />
                Copy Bitcoin Address
              </>
            )}
          </button>
        </div>

        {/* Ethereum Donation */}
        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <FaEthereum className="text-purple-500 text-4xl mr-4" />
            <h3 className="text-2xl font-bold">Ethereum (ETH)</h3>
          </div>
          <p className="text-gray-400 mb-4">Send Ethereum to this address:</p>
          <div className="bg-gray-900 p-4 rounded-lg mb-4 break-all">
            <code className="text-sm text-green-400">{ethereumAddress}</code>
          </div>
          <button
            onClick={() => copyToClipboard(ethereumAddress, 'ethereum')}
            className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {copiedEthereum ? (
              <>
                <FaCheck className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <FaCopy className="mr-2" />
                Copy Ethereum Address
              </>
            )}
          </button>
        </div>

        {/* Additional Information */}
        <div className="bg-red-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Thank You for Your Support!</h3>
          <p className="text-lg">
            Every donation helps us continue our mission to bring you independent, uncensored journalism. 
            Your support makes a real difference.
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gray-800 border border-yellow-600 rounded-lg p-6">
          <h4 className="text-xl font-bold mb-2 text-yellow-500">⚠️ Security Notice</h4>
          <p className="text-gray-300 text-sm">
            Always verify wallet addresses before sending funds. UnderGround TV will never contact you asking for donations 
            through direct messages or email. Only use the addresses listed on this official website.
          </p>
        </div>
      </div>
    </div>
  );
}
