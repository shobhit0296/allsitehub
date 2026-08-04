import type { MetadataRoute } from 'next';
import { CATEGORIES } from './data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://allsitehub.online';

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((catName) => {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return {
      url: `${baseUrl}/#cat-${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryEntries,
  ];
}
