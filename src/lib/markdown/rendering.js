// most of this is borrowed from cohost's source code - i have no clue how it all works lmfao

import { unified } from 'unified';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import glsl from 'highlight.js/lib/languages/glsl'
import deepmerge from 'deepmerge';
import { compile } from 'html-to-text';
import { copyImgAltToTitle, dropCohostBloggerIgnoreBlocks, lazyLoadImages, makeLazyEmbeds } from './processors';
const convert = compile({
  wordwrap: false,
});

// todo: convert to cohost-like age ruleset system?
// previous age schemas didn't really affect anything since they were exclusively
// sanitization related, but fourth age adds linebreaks, so now i have to
// actually bother with it

const THIRD_AGE_SCHEMA = deepmerge(defaultSchema, {
  attributes: {
    "*": ["style"],
  },
  tagNames: ["video", "audio", "aside"], // consistency with current rules,
});

const LINEBREAK_CUTOFF = new Date("2023-05-10T15:00:00-04:00");

const externalRel = ['nofollow', 'noopener', 'noreferrer'];

/**
 * @param {string} src
 * @param {boolean} [xhtml]
 * @param {Date} [date]
 */
export function renderPostMarkdown(src, xhtml, date) {
  let stack = unified()
    .use(remarkParse);

  if ((date || new Date()) > LINEBREAK_CUTOFF) {
    stack = stack.use(remarkBreaks);
  }

  return stack
    .use(remarkGfm, {
      singleTilde: false,
    })
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeHighlight, {
      ignoreMissing: true,
      languages: {glsl},
    })
    .use(() => copyImgAltToTitle)
    .use(() => lazyLoadImages)
    //.use(() => cleanUpFootnotes)
    .use(rehypeRaw)
    .use(() => dropCohostBloggerIgnoreBlocks)
    // sanitization on trusted posts isn't suuuper necessary
    // and prevents things like classes from being passed
    // along
    //.use(rehypeSanitize, COHOST_BLOGGER_SCHEMA)
    //.use(() => stripSecondAgeStyles(postDate))
    //.use(() => stripThirdAgeStyles(postDate));
    .use(() => makeLazyEmbeds)
    .use(rehypeExternalLinks, {
      rel: externalRel,
      target: '_blank',
    })
    .use(rehypeStringify, {
      closeSelfClosing: xhtml,
      upperDoctype: xhtml
    })
    //.use(() => convertMentions)
    //.use(parseEmoji, { cohostPlus: options.hasCohostPlus })
    .processSync(src)
    .toString();
}

/**
 * @param {StorageBlock[]} blocks
 * @param {Date} [date]
 */
export function renderPostSummaryMarkdown(blocks, date) {
  const origBlocks = blocks.filter(block => block.type === 'markdown');
  const readmoreIndex = origBlocks.findIndex(
    (block) => block.markdown.content === "---"
  );
  if (readmoreIndex > -1) {
    origBlocks.splice(readmoreIndex);
  }
  return renderPostMarkdown(origBlocks.map(b => b.markdown.content).join('\n\n'), false, date);
}

/**
 * @param {string} src
 * @param {Date} [date]
 * @returns string
 */
export function renderCommentMarkdown(src, date) {
  let stack = unified()
    .use(remarkParse);

  if ((date || new Date()) > LINEBREAK_CUTOFF) {
    stack = stack.use(remarkBreaks);
  }

  return stack
    .use(remarkGfm, {
      singleTilde: false,
    })
    .use(remarkRehype)
    .use(() => copyImgAltToTitle)
    .use(() => lazyLoadImages)
    //.use(() => cleanUpFootnotes)
    .use(rehypeSanitize, THIRD_AGE_SCHEMA)
    //.use(() => stripSecondAgeStyles(postDate))
    .use(rehypeExternalLinks, {
        rel: externalRel,
        target: '_blank',
    })
    .use(rehypeStringify)
    //.use(() => convertMentions)
    //.use(parseEmoji, { cohostPlus: options.hasCohostPlus })
    .processSync(src)
    .toString();
}

/**
 * @param {string} src
 * @param {Date} [date]
 * @returns string
 */
export function renderPlaintext(src, date) {
  const renderedBody = renderCommentMarkdown(src, date);
  return convert(renderedBody);
}
/**
 * @param {string} src
 * @param {Date} [date]
 * @returns string
 */
export function renderPostPlaintext(src, date) {
  const renderedBody = renderPostMarkdown(src, false, date);
  return convert(renderedBody);
}
/**
 * @param {StorageBlock[]} blocks
 * @param {Date} [date]
 * @returns string
 */
export function renderPostSummaryPlaintext(blocks, date) {
  const renderedBody = renderPostSummaryMarkdown(blocks, date);
  return convert(renderedBody);
}