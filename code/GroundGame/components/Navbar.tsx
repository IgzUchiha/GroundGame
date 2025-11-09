'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaTwitter, FaInstagram, FaYoutube, FaTelegram } from 'react-icons/fa';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const [language, setLanguage] = useState('en');
  const [showLanguages, setShowLanguages] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
    { code: 'fa', name: 'فارسی' },
  ];

  return (
    <nav className="bg-black text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/underground-tv-logo.jpg" 
              alt="UnderGround TV" 
              width={702} 
              height={678}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/videos" className="hover:text-red-500 transition-colors">
              Videos
            </Link>
            <Link href="/shop" className="hover:text-red-500 transition-colors">
              Shop
            </Link>
            <Link href="/donations" className="hover:text-red-500 transition-colors">
              Donations
            </Link>
            <Link href="/admin" className="hover:text-red-500 transition-colors">
              Publish Article
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center space-x-1 hover:text-red-500 transition-colors"
              >
                <Globe size={20} />
                <span>{languages.find(l => l.code === language)?.name}</span>
              </button>
              
              {showLanguages && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguages(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 border-l border-gray-700 pl-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCHf6zQDywaqFM1rWeZeciTA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <FaTelegram size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/videos" 
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Videos
              </Link>
              <Link 
                href="/shop" 
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/donations" 
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donations
              </Link>
              <Link 
                href="/admin" 
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Publish Article
              </Link>

              {/* Language Selector for Mobile */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe size={18} />
                  <span className="text-sm font-semibold">Language</span>
                </div>
                <div className="space-y-1 pl-6">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left py-1 text-sm ${
                        language === lang.code ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media for Mobile */}
              <div className="flex items-center space-x-4 px-3 py-4 border-t border-gray-800">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCHf6zQDywaqFM1rWeZeciTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  <FaYoutube size={20} />
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  <FaTelegram size={20} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
