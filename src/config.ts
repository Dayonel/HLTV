import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'
import { gotScraping } from 'got-scraping'
import { chromium } from "playwright";
import { sleep } from './utils';
export interface HLTVConfig {
  loadPage: (url: string) => Promise<string>
  httpAgent: HttpsAgent | HttpAgent,
  requestMethod: 'request' | 'playwright'
}

export const defaultLoadPage =
  (httpAgent: HttpsAgent | HttpAgent | undefined, requestMethod: HLTVConfig['requestMethod'] = 'request') => (url: string) =>
    new Promise<string>(async (resolve) => {
      if (requestMethod === 'playwright') {
        const browser = await chromium.launchPersistentContext(`${__dirname}/../playwrightUserData`, {
          headless: false,
          locale: 'en'
        });
        const page = await browser.newPage();
        await page.goto(url);
        let html = await page.content();

        if (html.includes('Checking your browser before accessing')) {
          console.log("html Checking your browser before accessing");
          
          await sleep(30000);
          html = await page.content();
        }
        await browser.close();
        resolve(html);
      } else {
        gotScraping({ url, agent: { http: httpAgent, https: httpAgent } }).then(
          (res) => resolve(res.body)
        )
      }
    })

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent),
  requestMethod: 'request',
}

export const CONFIG = {
  BASE: 'https://www.hltv.org',
}