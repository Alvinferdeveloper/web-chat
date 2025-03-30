import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core';
import { getExecutablePath } from '../utils/os';
export async function scrappWeb(url: string){
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await getExecutablePath(),
        headless: true
      });
  
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded'});
      const body = await page.evaluate(() => document.body.innerText);
      const information = `La url de la web es:${url}\n` + body;
      await browser.close();
      return information;
}