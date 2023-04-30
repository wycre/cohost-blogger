<script>
  import Comment from '$lib/Comment.svelte';
  import { getPostImages, getPostPublishDate, getPostSlug, renderASTMap } from '$lib/cohost';
  import { renderPostMarkdown, renderPostSummaryPlaintext } from '$lib/markdown/rendering';
  import { formatDate } from '$lib/utils';
  import * as timeago from 'timeago.js';

  import '../../prose.scss';

  import 'highlight.js/styles/github-dark-dimmed.css';
  import { onMount } from 'svelte';
  import config from '$lib/config';
  import constants from '$lib/constants';

  /** @type {import('./$types').PageData} */
  export let data;

  /**
   * @type {Post}
   */
  const post = data.post;
  /**
   * @type {Record<string, Comment[]>}
   */
  const comments = data.comments;

  let publishTimestampElement;
  onMount(() => {
    if (publishTimestampElement) {
      timeago.render([publishTimestampElement]);
    }
  });

  // metadata
  const canonicalURL = `${config.siteURL}/${getPostSlug(post)}/`;
  const summary = renderPostSummaryPlaintext(post.blocks);
  const image = getPostImages(post)[0];
</script>

<svelte:head>
  <title>{post.headline} &middot; {config.blogName}</title>

  <meta name="description" content={summary}>
  <link rel="canonical" href={canonicalURL}>
        
  <meta property="og:site_name" content="{config.blogName}">
  <meta property="og:type" content="article">
  <meta property="og:title" content={post.headline}>
  <meta property="og:description" content={summary}>
  <meta property="og:url" content={canonicalURL}>
  {#if image}
    <meta property="og:image" content={image.fileURL}>
    <meta property="og:image:width" content={image.width}>
    <meta property="og:image:height" content={image.height}>
  {/if}
  {#if getPostPublishDate(post)}
    <meta property="article:published_time" content={getPostPublishDate(post)?.toISOString()}>
  {/if}
        
  <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'}>
  <meta name="twitter:title" content={post.headline}>
  <meta name="twitter:description" content={summary}>
  <meta name="twitter:url" content={canonicalURL}>
  {#if image}
    <meta name="twitter:image" content={image.fileURL}>
  {/if}

  <meta name="generator" content={constants.name}>
</svelte:head>

<style lang="scss">
  .inner {
    max-width: 800px;
    margin: 20px auto;
    padding: 0 1em;
  }
  .post-container {
    h1 {
      margin-bottom: 0;
    }

    .note, .note a {
      color: var(--text-color-light);
      font-size: 0.8rem;
    }

    .image {
      margin: 1rem auto;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .comments-label {
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .comments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>

<div class="inner">
  <div class="prose post-container">
    <h1 class="title">{post.headline}</h1>

    <span class="note">
      <a rel="noreferrer nofollower" target="_blank" href={post.singlePostPageUrl}>
        {#if getPostPublishDate(post)}
          <time bind:this={publishTimestampElement} datetime={getPostPublishDate(post)?.toISOString()}>{timeago.format(getPostPublishDate(post))}</time>
        {:else}
          draft
        {/if}
      </a>
      &middot;
      by <a rel="noreferrer nofollower" target="_blank" href={post.postingProject.url}>{post.postingProject.displayName}</a>
    </span>

    {#if getPostImages(post).length > 0}
      <div class="image">
        <!-- dumb hack for variable declaration -->
        {#each [getPostImages(post)[0]] as img}
          <img src={img.previewURL} alt={img.altText} width={img.width} height={img.height}>
        {/each}
      </div>
    {/if}
    <div class="post">
      {@html renderPostMarkdown(post.plainTextBody)}
    </div>
  </div>

  <hr>

  {#if getPostPublishDate(post)}
    <small>published <time datetime={getPostPublishDate(post)?.toISOString()}>{formatDate(getPostPublishDate(post))}</time></small>
  {:else}
    <small>draft</small>
  {/if}

  <div class="comments-label">{post.numComments} comments &middot; <a href={post.singlePostPageUrl} target="_blank" rel="noreferrer noopener">join the discussion on cohost</a></div>

  <div class="comments">
    {#each comments[post.postId] as comment}
      <Comment data={comment}/>
    {/each}
  </div>
</div>