<script>
  import { onMount } from "svelte";
  import { renderCommentMarkdown } from "./markdown/rendering";
  import * as timeago from 'timeago.js';
  import ProfilePicture from "./ProfilePicture.svelte";

  /**
   * @type {Comment}
   */
  export let data;

  let timestampElement;
  onMount(() => {
    timeago.render([timestampElement]);
  });
</script>

<style lang="scss">
  .comment {
    position: relative;

    display: flex;
    flex-direction: row;
    gap: 1rem;

    .pointer {
      position: absolute;
      top: -16px;
    }

    .content {
      flex: 1 1 0%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 0.5rem;

      .author {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;

        .display-name {
          display: block;
          max-width: 100%;
          flex-shrink: 1;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          font-weight: 700;

          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }

        .handle {
          display: block;
          color: var(--text-color-light);

          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }

        a.timestamp {
          color: inherit;

          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }

        time {
          display: block;
          flex: 0 0 none;
          font-size: small;
          color: var(--text-color-light);
        }
      }

      .comment-text {
        margin-top: 0;
        margin-bottom: 0;
        overflow-wrap: break-word;

        :global(p) {
          margin: 0;
        }
        :global(img) {
          margin-top: 2em;
          margin-bottom: 2em;
          max-width: 100%;
        }
      }
    }
  }
  .thread {
    padding-left: 1rem;
    margin-left: 2rem;
    border-left: 0.25rem solid var(--line-color);
    
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
</style>

<article class="comment">
  <a id="comment-{data.comment.commentId}" class="pointer"></a>
  <ProfilePicture url={data.poster.avatarURL} type={data.poster.avatarShape} handle={data.poster.handle} hideOnMobile={true}/>
  <div class="content">
    <div class="author">
      <ProfilePicture url={data.poster.avatarURL} type={data.poster.avatarShape} handle={data.poster.handle} hideOnMobile={false} tiny/>
      <a
        rel="author"
        href="https://cohost.org/{data.poster.handle}"
        class="display-name"
        title="{data.poster.displayName}">
        {data.poster.displayName}
      </a>
      <a href="https://cohost.org/{data.poster.handle}" class="handle">
        @{data.poster.handle}
      </a>
      <a href="#comment-{data.comment.commentId}" class="timestamp">
        <time
          bind:this={timestampElement}
          datetime="{data.comment.postedAtISO}"
          title="{(new Date(data.comment.postedAtISO)).toString()}"
          >
          {timeago.format(data.comment.postedAtISO)}
        </time>
      </a>
    </div>
    <div class="comment-text">
      {@html renderCommentMarkdown(data.comment.body)}
    </div>
  </div>
</article>
{#each data.comment.children as child}
  <div class="thread">
    <svelte:self data={child}/>
  </div>
{/each}