import type { VercelRequest, VercelResponse } from '@vercel/node';

interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

/**
 * The news page asks this function. This function asks NewsAPI with the server key,
 * so the key never goes to the browser.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'API key not configured' });
  }

  const requested = parseInt(String(req.query.pageSize ?? ''), 10);
  const pageSize = Math.min(Math.max(Number.isFinite(requested) ? requested : 20, 1), 100);

  const params = new URLSearchParams({
    q: 'earthquake OR seismic OR tremor',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(pageSize),
  });

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      headers: { 'User-Agent': 'Yanig/1.0', 'X-Api-Key': apiKey },
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsAPIResponse = await response.json();

    // Keep the same answer for 10 minutes. This saves NewsAPI requests.
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    return res.status(200).json({
      success: true,
      articles: data.articles,
      totalResults: data.totalResults,
    });
  } catch {
    return res.status(502).json({ success: false, error: 'Failed to fetch news' });
  }
}
