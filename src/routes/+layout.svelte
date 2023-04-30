<script>
  import 'modern-normalize/modern-normalize.css';
  import '../app.scss';
  import CommandLine from '$lib/CommandLine.svelte';

  import { page } from '$app/stores';
  import config from '$lib/config';
  import constants from '$lib/constants';
</script>

<style lang="scss">
  footer {
    background: #0a0b0c;
    color: #fff;
    margin: max(12vmin,64px) 0 0;
    padding: 0 max(4vmin,20px);
    padding-bottom: 140px;
    padding-top: 48px;
    position: relative;
    
    .inner {
      color: hsla(0,0%,100%,.7);
      font-size: 0.9rem;
      text-align: center;
    }
  }

  .inner {
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
  }
</style>

<header>
  <CommandLine>
    cd {(new URL($page.url)).pathname}
  </CommandLine>
</header>

<slot/>

<footer>
  <div class="inner">
    <a href="https://cohost.org/{config.handle}/tagged/{config.tag}" target="_blank" rel="noopener noreferrer">view on cohost</a>
    &middot;
    <a href={constants.repo} target="_blank" rel="noopener noreferrer">powered by {constants.name}</a>
  </div>
</footer>