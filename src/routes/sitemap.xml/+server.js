import { getPostImages, getPostPublishDate, getPostSlug, getPosts } from '$lib/cohost';
import { minify as minifyXML } from 'minify-xml';
import config from '$lib/config';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const posts = await getPosts();
  let response = new Response(xml(posts));
  response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
  response.headers.set('Content-Type', 'application/xml');

  return response;
}

const xml = (/** @type {Post[]} */ posts) => minifyXML(`
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${config.siteURL}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts
    .map(post => `  
      <url>
        <loc>${config.siteURL}/${getPostSlug(post)}</loc>
        <lastmod>${getPostPublishDate(post)?.toISOString()}</lastmod>
        ${getPostImages(post).length > 0 ? `
          <image:image>
            <image:loc>${getPostImages(post)[0].fileURL}</image:loc>
            <image:caption>${post.headline}</image:caption>
          </image:image>
        ` : ''}
      </url>
    `)}
</urlset>
`);