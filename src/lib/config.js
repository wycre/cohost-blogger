export default {
  // Basic site details
  handle: 'wycre',                                  // This must match your cohost handle
  tag: 'cohost-blogger',                            // Tag your chosts with this for cohost-blogger to read it
  blogName: 'Wycre\'s blog',                        // This will be displayed as the title for the tab
  blogDescription: 'Archival and Awful Websites',
  siteURL: 'https://blog.wycre.net',                // This is the URL of the site hosting cohost-blogger


  longDescription: '<p>\n' +                        // This is the HTML for the long description of your blog
      '      <b>Hi!</b> Welcome to cohost-blogger.\n' +
      'This is the default long description for the blog. Edit your basic details in <code>src/lib/config.js</code>' +
      '    </p>\n' +
      '    <p>\n' +
      '      This page will show any posts on the <code>{config.handle}</code> cohost blog with the tag <code>{config.tag}</code>.<br>' +
      'And read README.md for more detailed information on how to set this up.' +
      '    </p>\n' +
      '    <h2>Setup guide</h2>\n' +
      '    <p>\n' +
      '      To get started using cohost-blogger, follow these steps.\n' +
      '    </p>\n' +
      '    <ol>\n' +
      '      <li>Update the values in <code>src/lib/config.js</code></li>\n' +
      '      <li>Change this description in <code>src/routes/+page.svelte</code></li>\n' +
      '      <li>The header and footer are located in <code>src/routes/+layout.svelte</code></li>\n' +
      '      <li>If you desire to change the general layout of post pages, that can be found in <code>src/routes/[post=slug]/+page.svelte</code></li>\n' +
      '    </ol>\n' +
      '    <p>\n' +
      '      When you\'re done with your changes, run <code>npm run build</code> then <code>node build</code>\n' +
      '      This will run the server on port 3000 by default, change this by setting the environment variable <code>PORT</code>\n' +
      '      <br>\n' +
      '      Alternatively you can use the provided Dockerfile to create a docker image of this app.\n' +
      '    </p>',

  // CommandLine header details
  subDomain: 'blog',                                // text for this sites subdomain
  rootDomain: 'wycre.net',                          // The root domain for this site
  rootURL: 'https://wycre.net'                      // The URL for the root domain
};
