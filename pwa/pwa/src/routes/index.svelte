<script>
  import { getContext } from "svelte";
  let { loggedIn, username } = getContext("user");
</script>

{#if $loggedIn}
  <div>
    <h2>welcome back {$username}</h2>
  </div>
{:else}
  <div>
    <span>welcome to advocat.</span>
  </div>
{/if}
