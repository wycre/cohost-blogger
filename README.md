# cohost-blogger

A self-hostable front-end for [Cohost](https://cohost.org/) mimicking a CMS.

## What?

CMSes are stupid to host, stupid to make and stupid to find. Why bother? We have a perfectly fine Cohost. Let's use that!

This site, pointed at a Cohost user and tag, will find every post under that tag and display it in a nice way, including 
the comments and proper rendering of the contents themselves.

## How?

_If you're on NixOS, you should be able to integrate it into your [system config as a flake](https://git.oat.zone/dark-firepit/dotfiles/commit/26552bfb01e487fbabcdd6f72f2a1f1a0eb56cd2) or just run it with `nix run`._

First, install the dependencies:

```sh
git clone https://github.com/wycre/cohost-blogger.git && cd cohost-blogger
npm install
```

Afterwards, for development, you can run:

```sh
npm run dev
```

Or, for deployment:

For running natively:
```sh
npm run build
export PORT=1234 # pick your port 
node build
```

For running in Docker:
```sh
npm run build
docker build -t cohost-blogger .
docker run --name cohost-blogger -p 3001:3000 -d cohost-blogger
```

## Configuration

Currently, this still requires some web skills to configure. 

### Instance-specific config
You can head into [`src/lib/config.js`](./src/lib/config.js) for all instance-specific configuration,
this relates to your URL and cohost tag, etc.

This fork of the cohost-blogger intends to offer a more genericized version of the original. 

In general:
1. Ensure all values in [`src/lib/config.js`](./src/lib/config.js) are set to your liking
2. Replace images in [`static`](./static) to your own.

Advanced:
- The homepage can be updated in [`src/routes/+page.svelte](./src/routes/+page.svelte)
- The header and footer can be modified in [`src/routes/+layout.svelte](./src/routes/+layout.svelte)
- The general layout of individual post pages can be modified in [`src/routes/\[post=slug\]/+page.svelte](./src/routes/[post=slug]/+page.svelte)


## Writing notes

There are a few different quirks from Cohost's official parser you must keep in mind:

- Most sanitization rulesets do not apply to posts
  - This means that classes and other otherwise removed attributes are kept
    - Classes are isolated in the app, however, so don't be afraid of using classes if you must
  - They still apply to comments
- Isolation is a bit more loose
- The background of the post can be dark depending on the user's theme

### Cohost-exclusive content

You may specify Cohost-exclusive content like so:

```html
<div class="cohost-blogger-ignore">
  Everything inside of here is hidden on cohost-blogger!
</div>
```

### Metadata

cohost-blogger metadata may be specified like so:

```html
<!--@cohost-blogger-meta
slug: so-how-are-there-eyes-in-the-water-exactly
published-at: 2023-01-24
-->
```

It may be inserted at any point in the post, as long as it is _a separate block_ - prepended and appended with 2 newlines.

Currently, only `slug` and `published-at` are valid keys, however more may be added in the future. `slug` specifies the URL, while `published-at` overrides the publication date for reuploaded posts.

### Videos

Currently, only direct links and YouTube links are supported as videos. You embed them the same way you do on Cohost - by putting them in plaintext in their own paragraph.

**Direct link videos autoplay.** This may start playing audio in certain cases! Please append `?autoplay=false` to video URLs with sound.

## Development notes

### Markdown processing

Most Markdown processing code is borrowed from Cohost itself. You can download its partial source code [from its sourcemaps](https://cohost.org/mintexists/post/635463-wrote-a-little-scrip), if you wish to reference it

### Nix Flake NPM dependencies

Each time you add, remove or otherwise modify an NPM dependency, you **must** update the hash in the Nix Flake:

1. Replace the dependency hash in `flake.nix` with a fake one:

    ```nix
    npmDepsHash = pkgs.lib.fakeHash;
    ```

2. Run `nix run` to attempt to build the package. It will fail, giving you an error that looks like this:

    ```
    error: hash mismatch in fixed-output derivation '/nix/store/h6s1rmcyrllqgqmrmhgmzgf2xkhws20r-cohost-blogger-0.0.1-npm-deps.drv':
         specified: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
            got:    sha256-hzn0sjxcysxe++IPyhKE/syx3S1Nh2hKGcjvS6UaLvY=
    ```

3. Replace the dependency hash with the expected hash:

    ```nix
    npmDepsHash = "sha256-hzn0sjxcysxe++IPyhKE/syx3S1Nh2hKGcjvS6UaLvY=";
    ```

## Attributions

- **[oatmealine](https://oat.zone/)**, for creating this entire thing to begin with
- **[@mintexists](https://cohost.org/mintexists)**, for help reverse-engineering the Cohost API
- **[Cohost's devteam](https://cohost.org/staff)** - while this site does interact _with_ Cohost, lots of the [Markdown processing code](./src/lib/markdown) is borrowed from their sourcemaps
