import { getPostImages, getPostPublishDate, getPostSlug, getPosts } from '$lib/cohost';
import { renderPostMarkdown, renderPostSummaryPlaintext } from '$lib/markdown/rendering';
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
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${config.blogName}</title>
    <description>${config.blogDescription}</description>
    <link>${config.siteURL}/</link>
		<link href="${config.siteURL}/rss.xml" rel="self" type="application/rss+xml" />
    <ttl>60</ttl>
		<image>
			<url>${config.siteURL}/favicon.png</url>
			<title>${config.blogName}</title>
			<link>${config.siteURL}/</link>
		</image>
    ${posts
      .map(post => `
        <item>
          <title>${post.headline}</title>
          <description>${renderPostSummaryPlaintext(post.blocks)}</description>
          <link>${config.siteURL}/${getPostSlug(post)}/</link>
          <dc:creator>${post.postingProject.displayName}</dc:creator>
          <pubDate>${getPostPublishDate(post)?.toUTCString()}</pubDate>
          ${getPostImages(post).length > 0 ? 
            `<content url="${getPostImages(post)[0].fileURL}" medium="image" />`
          : ''}
          <content:encoded><![CDATA[
            ${renderPostMarkdown(post.plainTextBody, true)}
          ]]></content:encoded>
        </item>
      `)}
  </channel>
</rss>
`);