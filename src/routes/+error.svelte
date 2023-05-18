<script>
  import { page } from '$app/stores';
</script>

<style>
  .content {
    max-width: 600px;
    margin: auto; 
  }
  .gradient {
    font-size: 5rem;
    line-height: 1.0;
    background: repeating-linear-gradient(98deg, rgba(190,190,190,1) 0%, rgba(190,190,190,1) 10%, rgba(207,207,207,1) 10%, rgba(207,207,207,1) 20%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bolder;
  }
  h1 {
    margin-bottom: 0.15em;
  }
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
</style>

<div class="content">
  <div class="error">
    <div class="gradient">
      <h1>{$page.status}</h1>
    </div>
    {$page.error.message}
  </div>
</div>