<script>
  import { getContext } from "svelte";
  import { goto } from '@sapper/app'
  import GroupBrowser from '../components/GroupBrowser.svelte'
  let { loggedIn, username } = getContext("user");
  const click = (page) => () => goto(page)

  let groups = [{}, {}]
</script>

<style lang="scss">
  .calltoaction {
    background: #808080;
    color: white;
    border-radius: 15px;
    padding: 1em;
    margin: 1em 0;
    cursor: pointer;
    border: 2px solid white;
    h2 {
      text-decoration: underline;
    }
  }
  .title {
    font-family: "ChangaOne Regular";
    color: white;
  }
  .footer {
    position: fixed;
    bottom: 0;
    margin: 0 auto;
    color: white;
  }
</style>

{#if $loggedIn}
  <div>
    <div>
      <h1>welcome back {$username}</h1>
    </div>
    <GroupBrowser {groups} />
  </div>
{:else}
  <div>
    <div class="title">
      <h1>welcome to adVoCat.</h1>
    </div>
    <div class="calltoaction" on:click={click("findgroups")}>
      <h2>find groups</h2>
      <p>find volunteer groups in your local area</p>
    </div>
    <div class="calltoaction" on:click={click("createagroup")}>
      <h2>create a group</h2>
      <p>create a volunteer group with other people in your area</p>
    </div>
    <div class="footer">
      <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
    </div>
  </div>
{/if}
