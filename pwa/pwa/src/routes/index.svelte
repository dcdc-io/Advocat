<script>
  import { getContext } from "svelte";
  import { goto } from '@sapper/app'
  let { loggedIn, username } = getContext("user");

  const click = (page) => () => goto(page)
</script>

<style lang="scss">
  .calltoaction {
    background: black;
    color: white;
    padding: 1em;
    margin: 1em 0;
    cursor: pointer;
    h2 {
      text-decoration: underline;
    }
  }
</style>

{#if $loggedIn}
  <div>
    <h2>welcome back {$username}</h2>
  </div>
{:else}
  <div>
    <div>
      <h1>welcome to advocat.</h1>
    </div>
    <div class="calltoaction" on:click={click("findgroups")}>
      <h2>find groups</h2>
      <p>find volunteer groups in your local area</p>
    </div>
    <div class="calltoaction" on:click={click("createagroup")}>
      <h2>create a group</h2>
      <p>create a volunteer group with other people in your area</p>
    </div>
    <div>
      <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
    </div>
  </div>
{/if}
