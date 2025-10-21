'use client';

import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  authors: string;
  date: string;
  language: string;
  excerpt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    excerpt: '',
    content: '',
    language: 'en',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [showManageSection, setShowManageSection] = useState(false);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
        fetchArticles(); // Load articles after login
      } else {
        setAuthError('Invalid password. Please try again.');
      }
    } catch {
      setAuthError('Authentication error. Please try again.');
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/articles?id=${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Article deleted successfully!');
        fetchArticles(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete article.');
      }
    } catch {
      setMessage('Error deleting article.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }),
      });

      if (response.ok) {
        setMessage('Article published successfully!');
        setFormData({
          title: '',
          authors: '',
          excerpt: '',
          content: '',
          language: 'en',
          imageUrl: ''
        });
        fetchArticles(); // Refresh the article list
        setTimeout(() => {
          setMessage('');
          setShowManageSection(true); // Show manage section after publishing
        }, 2000);
      } else {
        setMessage('Failed to publish article. Please try again.');
      }
    } catch {
      setMessage('Error publishing article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-gray-800 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">🔒 JOURNALIST LOGIN</h1>
            <p className="text-gray-300 mb-6 text-center">
              Enter the password to access the admin panel
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 text-red-200">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              <p>Only authorized journalists can access this panel</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">JOURNALIST ADMIN PANEL</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Publish New Article</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Language / لغة / زبان / Idioma
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="en">English</option>
                <option value="es">Español (Spanish)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="fa">فارسی (Farsi)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Article Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
                placeholder="Enter article title"
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Author(s)
              </label>
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
                placeholder="e.g., JOHN DOE"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Excerpt (Brief Summary) - THIS SHOWS ON HOMEPAGE
              </label>
              <p className="text-xs text-yellow-400 mb-2">
                ⚠️ Write 1-2 sentences that will appear on the homepage article cards. Make it compelling!
              </p>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
                placeholder="Example: It had been 5 years since I last sat in his classroom. We discuss everything that&apos;s happening and what it all means..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Character count: {formData.excerpt.length} (recommended: 100-200)
              </p>
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Article Content - THIS SHOWS WHEN READERS CLICK &quot;READ MORE&quot;
              </label>
              <p className="text-xs text-blue-400 mb-2">
                📝 Write your complete article here. This is what readers see on the full article page.
              </p>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
                placeholder="Write your full article here... This can be as long as you need. Use Enter to create paragraphs."
              />
              <p className="text-xs text-gray-400 mt-1">
                Word count: {formData.content.split(/\s+/).filter(word => word.length > 0).length}
              </p>
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Article'}
              </button>
              
              {message && (
                <span className={`${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Manage Articles Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-red-600">MANAGE ARTICLES</h2>
            <button
              onClick={() => setShowManageSection(!showManageSection)}
              className="text-sm bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showManageSection ? 'Hide Articles' : 'Show Articles'}
            </button>
          </div>

          {showManageSection && (
            <div className="bg-gray-800 rounded-lg p-6">
              {loadingArticles ? (
                <p className="text-gray-400">Loading articles...</p>
              ) : articles.length === 0 ? (
                <p className="text-gray-400">No articles published yet.</p>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div key={article.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-red-600 px-2 py-1 rounded">
                            {article.language.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">{article.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{article.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">By {article.authors}</p>
                        <p className="text-sm text-gray-300 line-clamp-2">{article.excerpt}</p>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <a
                          href={`/article/${article.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-center"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 border border-blue-600 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-blue-400">📝 Instructions for Journalists</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Select the language you&apos;re writing in</li>
            <li>• Write clear, compelling titles and excerpts</li>
            <li>• The excerpt appears on the homepage - keep it under 200 characters</li>
            <li>• Full article content supports paragraphs and basic formatting</li>
            <li>• Articles are automatically published to the homepage</li>
            <li>• Use &quot;Manage Articles&quot; to view or delete published articles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
