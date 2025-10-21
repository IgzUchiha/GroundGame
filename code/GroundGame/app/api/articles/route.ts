import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const articlesPath = path.join(process.cwd(), 'lib', 'articles.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    const fileContents = await fs.readFile(articlesPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    let articles = data.articles;
    
    // Filter by language if specified
    if (language && language !== 'all') {
      articles = articles.filter((article: { language: string }) => article.language === language);
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json({ articles: [] });
  }
}

export async function POST(request: Request) {
  try {
    const newArticle = await request.json();
    
    // Read existing articles
    const fileContents = await fs.readFile(articlesPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Add new article with timestamp
    const article = {
      ...newArticle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      source: 'ground-game'
    };
    
    data.articles.unshift(article);
    
    // Write back to file
    await fs.writeFile(articlesPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('id');

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
    }

    // Read existing articles
    const fileContents = await fs.readFile(articlesPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Filter out the article to delete
    const originalLength = data.articles.length;
    data.articles = data.articles.filter((article: { id: string }) => article.id !== articleId);
    
    if (data.articles.length === originalLength) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Write back to file
    await fs.writeFile(articlesPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
