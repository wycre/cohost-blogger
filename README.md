# cohost-blogger

A self-hostable front-end for [Cohost](https://cohost.org/) mimicing a CMS.

## What?

CMSes are stupid to host, stupid to make and stupid to find. Why bother? We have a perfectly fine Cohost. Let's use that!

This site, pointed at a Cohost user and tag, will find every post under that tag and display it in a nice way, including the comments and proper rendering of the contents themselves.

## How?

_If you're on NixOS, you should be able to integrate it into your [system config as a flake](https://git.oat.zone/dark-firepit/dotfiles/commit/26552bfb01e487fbabcdd6f72f2a1f1a0eb56cd2) or just run it with `nix run`._

First, install the dependencies:

```sh
git clone https://git.oat.zone/oat/cohost-blogger && cd cohost-blogger
npm install
```

Afterwards, for development, you can run:

```
npm run dev
```

Or, for deployment:

```
npm run build
PORT=1234 node build
```

## Configuration

Currently, there isn't a proper configuration system - this is not yet made to be hosted by anyone by me. You can head into [`src/lib/config.js`](https://git.oat.zone/oat/cohost-blogger/src/lib/config.js) for all instance-specific configuration, but this will be expanded into a proper system eventually:tm.

## Attributions

- **[@mintexists](https://cohost.org/mintexists)**, for help reverse-engineering the Cohost API
- **[Cohost's devteam](https://cohost.org/staff)** - while this site does interact _with_ Cohost, lots of the [Markdown processing code](https://git.oat.zone/oat/cohost-blogger/src/branch/main/src/lib/markdown) is borrowed from their sourcemaps