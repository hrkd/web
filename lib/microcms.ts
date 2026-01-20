import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'f10kcqa8tt',
  apiKey: process.env.MICROCMS_API_KEY || '',
});

export type Category = {
  id: string;
  title: string;
};

export type Article = {
  id: string;
  title: string;
  url?: string;
  year: number;
  type: Category[];
  from?: number;
};

export type ArticlesResponse = {
  contents: Article[];
  totalCount: number;
};

export async function getArticles() {
  return await client.get<ArticlesResponse>({
    endpoint: 'articles',
    queries: { limit: 100 },
  });
}
