import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theclasspilot.com';

  const routes = [
    '',
    '/about',
    '/pricing',
    '/how-it-works',
    '/contact',
    '/help',
    '/blog',
    '/terms',
    '/cookies',
    '/accessibility',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
