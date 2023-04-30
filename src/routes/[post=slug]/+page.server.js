import { getPostMetadata, getPosts, trpcRequest } from '$lib/cohost';
import { error } from '@sveltejs/kit';

export const trailingSlash = 'always';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const posts = await getPosts();

  let post = posts.find(post => getPostMetadata(post).slug === params.post);
  if (!post) post = posts.find(post => post.filename === params.post);
  if (!post) throw error(404, {message: 'Post not found'});

  const postId = post.postId;
  const postFetched = await trpcRequest('posts.singlePost', {
    handle: post.postingProject.handle,
    postId: postId
  });

  // uh oh! let's just serve from the emptier post cache
  if (!postFetched.result) return {post: post, comments: {[postId]: []}};

  return postFetched.result.data;
}