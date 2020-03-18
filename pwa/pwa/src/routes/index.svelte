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
  }
  .title {
    margin: 0 auto;
    left: 0;
    color: black;
    font-size: 2em;
  }
  .container {
    max-width: 100%;
    margin: 0 auto;
  }
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

<div class="page">
  <div class="title">
    <h1>welcome to advocat.</h1>
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
      </div>
    {/if}
  </div>
</div>