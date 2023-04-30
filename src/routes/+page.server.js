import { getPosts } from '$lib/cohost';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const posts = await getPosts();
  return {
    posts: posts
  };
}