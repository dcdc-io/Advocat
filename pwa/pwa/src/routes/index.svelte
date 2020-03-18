<script>
  import { useDatabase } from '../helpers.js'
  import { getContext } from "svelte";
  import { goto } from '@sapper/app'
  import GroupBrowser from '../components/GroupBrowser.svelte'
  let { loggedIn, username } = getContext("user");
  const click = (page) => () => goto(page)

  const groupsDb = useDatabase({name:"groups"})
  let groups = []
  $: {
    if ($loggedIn) {
      groupsDb.allDocs({include_docs:true}).then(result => {
        groups = result.rows.map(r => r.doc)
      })
    }
  }

</script>

<style lang="scss">
  .page {
    height: 100%;
    padding-top: 10%
  }
  .title {
    margin: 0 auto;
    left: 0;
    font-family: "ChangaOne Regular";
    color: white;
    padding-bottom: 5%;
    font-size: 2em;
  }
  .container {
    max-width: 90%;
    margin: 0 auto;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 90%;
    text-align: center;
    margin: 0 auto;
    color: white;
  }
  .calltoaction {
    background: #808080;
    color: white;
    padding: 1em;
    margin: 1em 0;
    cursor: pointer;
    border-radius: 15px;
    border: 2px solid white;
    h2 {
      text-decoration: underline;
    }
  }
</style>

<div class="page">
  <div class="title">
    <h1>adVoCat.</h1>
  </div>
  <div class="container">
    {#if $loggedIn}
      <div>
        <div>
          <h1>welcome back {$username}</h1>
        </div>
        <GroupBrowser {groups} />
      </div>
    {:else}
      <div> 
        <div class="calltoaction" on:click={click("findgroups")}>
          <h2>find groups</h2>
          <p>find volunteer groups in your local area</p>
        </div>
        <div class="calltoaction" on:click={click("create_group")}>
          <h2>create a group</h2>
          <p>create a volunteer group with other people in your area</p>
        </div>
        <div class="footer">
          <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
        </div>
      </div>
    {/if}
  </div>
</div>
