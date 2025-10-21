import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  authors: string;
  date: string;
  content: string;
  language: string;
  imageUrl?: string;
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  let article: Article | null = null;

  try {
    const articlesPath = path.join(process.cwd(), 'lib', 'articles.json');
    const fileContents = await fs.readFile(articlesPath, 'utf8');
    const data = JSON.parse(fileContents);
    article = data.articles.find((a: Article) => a.id === params.id);
  } catch (error) {
    console.error('Error loading article:', error);
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link href="/" className="text-red-500 hover:text-red-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const languageNames: { [key: string]: string } = {
    en: 'English',
    es: 'Español',
    ar: 'العربية',
    fa: 'فارسی'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-red-500 hover:text-red-400 mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="mb-6">
          <span className="inline-block bg-red-600 text-white text-sm px-3 py-1 rounded">
            {languageNames[article.language]}
          </span>
        </div>

        {article.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <h1 className="text-4xl font-bold mb-4 leading-tight">{article.title}</h1>
        
        <div className="mb-6 text-gray-400">
          <p className="text-red-500 uppercase font-semibold mb-1">{article.authors}</p>
          <p>{article.date}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="text-lg leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <Link 
            href="/donations"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Support Our Journalism
          </Link>
        </div>
      </article>
    </div>
  );
}
