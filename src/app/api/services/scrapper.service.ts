import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function scrappWeb(urls: string[]) {
  let combinedText = '';

  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(
            `Skipping ${url}: Failed to fetch - ${response.statusText}`
          );
          return;
        }

        const html = await response.text();
        const doc = new JSDOM(html, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (article && article.textContent) {
          combinedText += `--- INICIO CONTENIDO DE ${url} ---\n\n${article.textContent.trim()}\n\n--- FIN CONTENIDO DE ${url} ---\n\n`;
        }
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      }
    })
  );

  if (!combinedText) {
    throw new Error('Could not extract any content from the provided URL(s).');
  }

  return combinedText;
}