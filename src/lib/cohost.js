import * as fs from 'fs/promises';
import config from '$lib/config';

const COHOST_API_URI = 'https://cohost.org/api/v1/trpc/';
/**
 * @param {string} route
 * @param {Record<string, any>} input
 */
export async function trpcRequest(route, input) {
  const url = new URL(COHOST_API_URI + route);
  if (input) url.searchParams.set('input', JSON.stringify(input));
  const data = await (await fetch(url)).json();
  return data;
}

const PAGES_PER_POST = 20;

/**
 * @param {number} page
 * @returns {Promise<Post[]>}
 */
export async function fetchAllPosts(page = 0) {
  const data = await trpcRequest('posts.getPostsTagged', {
    projectHandle: config.handle,
    tagSlug: config.tag,
    page: page
  });

  let posts = data.result.data.items;

  if (data.result.data.nItems >= PAGES_PER_POST) {
    posts = [...posts, ...(await fetchAllPosts(page + 1))]
  }

  return posts;
}

/**
 * @returns {Promise<Post[]>}
 */
async function getPostsUncached() {
  return await fetchAllPosts();
  //return JSON.parse(await fs.readFile('src/testPosts.json', 'utf8')).filter(post => post.tags.includes('cohost-blogger'));
}

// this technically only stores the preview data - the posts on the actual pages are always fetched
// however there is no way to fetch a specified amount of info, so cache it is
let postCache = {
  /** @type {Post[]} **/
  posts: [],
  refreshed: -1
}
const CACHE_INVALID_PERIOD = 60 * 1000;

/**
 * @returns {Promise<Post[]>}
 */
export async function getPosts() {
  const timeSinceCache = Date.now() - postCache.refreshed;
  if (timeSinceCache > CACHE_INVALID_PERIOD) {
    postCache.posts = await getPostsUncached();
    postCache.refreshed = Date.now();
  }

  return postCache.posts;
}

/**
 * @param {Post} post
 */
export function getPostImages(post) {
  return post.blocks.filter(block => block.type === 'attachment').map(block => block.attachment);
}
const COMMENT_REGEX = /^\s*<!--\s*@cohost-blogger-meta\s+([\S\s]+)\s*-->\s*$/;
/**
 * @param {Post} post
 * @returns {Record<string, string>}
 */
export function getPostMetadata(post) {
  return post.blocks
    .filter(block => block.type === 'markdown')
    .map(block => block.markdown.content)
    .map(text => COMMENT_REGEX.exec(text)).filter(res => res !== null).map(res => res[1])
    .reduce((lines, comment) => [...lines, ...comment.split('\n')], [])
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .reduce((properties, line) => {
      properties[line.split(':')[0].trim()] = line.split(':')[1].trim();
      return properties;
    }, {});
}

/**
 * @param {Post} post 
 * @returns {Date | null}
 */
export function getPostPublishDate(post) {
  const meta = getPostMetadata(post);
  if (meta['published-at']) return new Date(meta['published-at']);
  if (post.publishedAt) return new Date(post.publishedAt);
  return null;
}

/**
 * @param {Post} post 
 * @returns {string}
 */
export function getPostSlug(post) {
  return getPostMetadata(post).slug || post.filename;
}