import { visit } from "unist-util-visit";

/**
 * @param {RootAST} hast
 */
export function copyImgAltToTitle(hast) {
  visit(hast, { type: 'element', tagName: 'img' }, (node) => {
    if (node.properties?.alt) {
      node.properties.title = node.properties.alt;
    }
  });
}

/**
 * @param {RootAST} hast
 */
export function lazyLoadImages(hast) {
  visit(hast, { type: 'element', tagName: 'img' }, (node) => {
    node.properties.loading = 'lazy';
  });
}


/**
 * @param {RootAST} hast
 */
export function dropCohostBloggerIgnoreBlocks(hast) {
  visit(hast, { type: 'element' }, (node, index, parent) => {
    if (parent === null || index === null) return;

    // remove any elements that match the class
    if (node.properties.className && node.properties.className.includes('cohost-blogger-ignore')) {
      parent.children.splice(index, 1);

      // if there's nothing else in the parent, then remove it aswell
      if (parent.children.length === 0 && parent.type === 'element') {
        // don't actually know how to remove it lol... display: none will do
        parent.properties.style = 'display:none';
      }
    }

    return true;
  });
}

// largely copied from makeIframelyEmbeds
/**
 * @param {RootAST} hast
 */
export function makeLazyEmbeds(hast) {
  visit(hast, { type: 'element', tagName: 'a' }, (node, index, parent) => {
    if (parent === null || index === null) return;

    // GFM autolink literals have the following two properties:
    // - they have exactly one child, and it's a text child;
    if (node.children.length != 1 || node.children[0].type != 'text')
      return;
    // - the starting offset of the text child matches the starting offset
    //   of the node (angle-bracket autolinks and explicit links differ by 1
    //   char)
    if (
      !node.position ||
      !node.children[0].position ||
      node.children[0].position.start.offset != node.position.start.offset
    )
      return;

    // additionally, GFM autolink literals in their own paragraph are the
    // only child of their parent node.
    if (parent.children.length != 1) return;

    // plain videos
    // todo: THIS IS LAZY!!!!
    if (node.properties?.href.endsWith('.mp4') || node.properties?.href.endsWith('.webm')) {
      // render the parent element to fit the video better
      if (parent.type === 'element') {
        parent.tagName = 'div';
        parent.properties.style = 'width:100%;display:flex;justify-content:center'
      }

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'video',
        properties: {
          src: node.properties?.href,
          autoplay: 'true',
          playsinline: 'true',
          // todo: what the hell
          loop: node.properties?.href.includes('autoplay=false') ? 'false' : 'true',
          style: 'width: 100%;max-width: 600px',
          controls: 'true'
        },
        children: [],
      });
    // youtube videos
    } else if (node.properties?.href.startsWith('https://www.youtube.com/')) {
      // <iframe src="https://www.youtube.com/embed/avNF21NRe10?feature=oembed" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" title="[NotITG Release] eyes in the water" name="fitvid0" frameborder="0"></iframe>
      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'iframe',
        properties: {
          src: node.properties?.href.replace('/watch?v=', '/embed/'),
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          frameborder: 0,
          style: 'width:100%;aspect-ratio:16/9',
          allowfullscreen: 'true'
        },
        children: [],
      });
    }

    return true;
  });
}