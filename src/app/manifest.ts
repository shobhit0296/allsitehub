import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AllSiteHub — The Ultimate Web & Streaming Hub',
    short_name: 'AllSiteHub',
    description: 'Discover verified streaming portals, 4K movies, anime hubs, live sports, AI tools & developer utilities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05050c',
    theme_color: '#05050c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
