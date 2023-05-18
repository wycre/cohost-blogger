<script>
  import { assets } from '$app/paths';
  import { renderPostPlaintext, renderPostSummaryMarkdown } from '$lib/markdown/rendering';
  import { formatDate } from '$lib/utils';
  import config from '$lib/config';
  import { getPostImages, getPostMetadata, getPostPublishDate, getPostSlug } from '../lib/cohost';
  import readingTime from 'reading-time/lib/reading-time';

  import '../prose.scss';

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>{config.blogName}</title>
  <meta name="description" content={config.blogDescription}>
  <link rel="icon" href="{assets}/favicon.png" type="image/png">
  <link rel="canonical" href="{config.siteURL}/">

  <meta property="og:site_name" content={config.blogName}>
  <meta property="og:type" content="website">
  <meta property="og:title" content={config.blogName}>
  <meta property="og:description" content={config.blogDescription}>
  <meta property="og:url" content="{config.siteURL}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content={config.blogName}>
  <meta name="twitter:description" content={config.blogDescription}>
  <meta name="twitter:url" content="{config.siteURL}/">
  <meta name="description" content={config.blogDescription}>

  <link rel="alternate" title={config.blogName} type="application/rss+xml" href="{config.siteURL}/rss.xml">
</svelte:head>

<style lang="scss">
  .inner {
    margin: 10px auto;
    max-width: 1200px;
    width: 100%;
  }

  .posts {
    display: grid;
    gap: 4.8vmin 4vmin;
    grid-template-columns: repeat(6,1fr);
    @media (max-width: 991px) {
      grid-template-columns: 1fr 1fr;
    }
    padding: max(4.8vmin,36px) 0 0;
    position: relative;

    & > * {
      grid-column: span 2;
    }
  }

  .post-card {
    background-color: var(--card-overlay);
    border-radius: 1em;
    overflow: hidden;

    word-break: break-word;

    .image {
      display: block;
      margin-bottom: 1.25em;
      position: relative;

      img {
        height: 100%;
        inset: 0;
        -o-object-fit: cover;
        object-fit: cover;
        position: absolute;
        width: 100%;
      }

      &::after {
        content: "";
        display: block;
        padding-bottom: 55%;
      }
    }

    header {
      padding: 0 0.75rem;
      .title {
        font-size: 1.3rem;
        font-weight: 800;
        line-height: 1.2;
        margin: 0;
        margin-bottom: 0.25em;
      }

      .excerpt {
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        font-size: 0.8rem;
        line-height: 1.5;
        max-width: 720px;
        overflow-y: hidden;
        word-break: break-word;
      }
    }

    .misc {
      padding: 0.75rem;
      color: var(--text-color-light);
    }

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > a {
      flex: 0 0 auto;
      min-height: 0;
      display: block;
    }
    & > .misc {
      max-height: 100%;
    }

    &:hover {
      header {
        opacity: 0.8;
      }
    }
  }

  .summary {
    max-width: 750px;
    margin: 0 auto;
    padding: 1em 1em;
  }

  .header {
    height: 460px;
    max-height: 60vw;
    position: relative;

    background:
      linear-gradient(to bottom, rgba(0,0,0,0), 85%, var(--background-color)),
      fixed center / cover no-repeat var(--background-image);

    .logo {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      vertical-align: middle;
      max-width: 100%;
      padding: 1em;

      img {
        animation: 2s infinite ease-in-out alternate light-bob;
      }
    }
  }

  @keyframes light-bob {
    from {
      transform: rotate(1deg);
    }
    to {
      transform: rotate(-1deg);
    }
  }
</style>

<div class="header" style="--background-image: url('{assets}/banner.png')">
  <div class="logo">
    <img src="{assets}/logo.png" alt="logo">
  </div>
</div>

<div class="inner">
  <div class="summary prose">
    <p>
      <b>Hi!</b> Welcome to the dumping grounds for my thoughts, experiments, ideas and whatever else I decide to write up.
    </p>
    <p>
      These aren't particularly well-organized, and I don't plan for them to be - I just write about whatever occupies my time or thoughts without
      much regard for how interesting it might be. The things I generally tend to think about, however, tend to be tech or programming related, so
      it's likely you'll see quite a bit of that here.
    </p>
    <p>
      This site is also actually a proxy of my <a href="https://cohost.org/{config.handle}/tagged/{config.tag}" target="_blank" rel="noopener noreferrer">cohost page</a>!
      The posts are just presented in a more convenient way, and are generally easier to embed and share.
    </p>
  </div>

  <div class="posts">
    {#each data.posts as post}
      <article class="post-card">
        <a href={'/' + getPostSlug(post)} class="link-wrapper">
          {#if getPostImages(post).length > 0}
            <div class="image">
              <!-- dumb hack for variable declaration -->
              {#each [getPostImages(post)[0]] as img}
                <img src={img.previewURL} alt={img.altText} width={img.width} height={img.height}>
              {/each}
            </div>
          {/if}
          <header>
            <h2 class="title">{post.headline}</h2>
            <div class="post preview excerpt prose">
              {@html renderPostSummaryMarkdown(post.blocks, post.publishedAt ? new Date(post.publishedAt) : undefined)}
            </div>
          </header>
        </a>
        <small class="misc">
          {#if getPostPublishDate(post)}
            <time datetime={getPostPublishDate(post)?.toISOString()}>{formatDate(getPostPublishDate(post))}</time>
            &middot;
          {/if}
          {Math.ceil(readingTime(renderPostPlaintext(post.plainTextBody)).minutes)} minute read</small>
        <!--{JSON.stringify(post)}-->
      </article>
    {/each}
  </div>
</div>