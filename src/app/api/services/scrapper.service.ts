import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function scrappWeb(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    const doc = new JSDOM(html, {
      url: url,
    });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      throw new Error('Failed to extract article content. The page might be too complex or not an article.');
    }
    const information = `La url de la web es:${url}\n` + article.textContent.trim();
    return information;

  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error;
  }
}