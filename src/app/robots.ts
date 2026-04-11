import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/dashboard/*', '/api/*', '/rubrics', '/rubrics/*', '/classes', '/classes/*', '/create-class', '/login', '/signup'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://theclasspilot.com'}/sitemap.xml`,
  };
}
