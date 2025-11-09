'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id?: string;
  title: string;
  authors: string;
  date: string;
  excerpt: string;
  url?: string;
  source: string;
  language: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Fetch both Grayzone and custom articles
      const [grayzoneRes, customRes] = await Promise.all([
        fetch('/api/grayzone'),
        fetch('/api/articles')
      ]);

      const grayzoneArticles = await grayzoneRes.json();
      const customArticles = await customRes.json();

      // Combine and sort by date
      const allArticles = [...customArticles, ...grayzoneArticles]
        .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

      setArticles(allArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedLanguage === 'all' 
    ? articles 
    : articles.filter(article => article.language === selectedLanguage);

  const languageNames: { [key: string]: string } = {
    all: 'All Languages',
    en: 'English',
    es: 'Español',
    ar: 'العربية',
    fa: 'فارسی'
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section - Featured Video */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-red-600">FEATURED VIDEO</h2>
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/kOEI5kF9Gzs"
              title="Featured Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-red-600">LATEST STORIES</h2>
            
            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Filter:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <article key={article.id || index} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                  <div className="p-6">
                    {/* Language Badge */}
                    <div className="mb-3">
                      <span className="inline-block text-xs bg-red-600 text-white px-2 py-1 rounded">
                        {languageNames[article.language]}
                      </span>
                      {article.source === 'ground-game' && (
                        <span className="inline-block text-xs bg-blue-600 text-white px-2 py-1 rounded ml-2">
                          UnderGround TV
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white hover:text-red-500 transition-colors">
                      {article.source === 'ground-game' && article.id ? (
                        <Link href={`/article/${article.id}`}>
                          {article.title}
                        </Link>
                      ) : (
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      )}
                    </h3>
                    <p className="text-sm text-red-500 mb-2 uppercase">{article.authors}</p>
                    <p className="text-sm text-gray-400 mb-3">{article.date}</p>
                    <p className="text-gray-300 mb-4">{article.excerpt}</p>
                    
                    {article.source === 'ground-game' && article.id ? (
                      <Link 
                        href={`/article/${article.id}`}
                        className="text-red-500 hover:text-red-400 font-semibold"
                      >
                        Read More →
                      </Link>
                    ) : (
                      <a 
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-400 font-semibold"
                      >
                        Read More →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Support Independent Journalism</h2>
          <p className="text-xl mb-6">Help us continue bringing you uncensored news</p>
          <Link 
            href="/donations"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
}
