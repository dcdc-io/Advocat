<script>
  import { useDatabase, colourInvert } from '../helpers.js'
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
    max-width: 600px;
    margin: 0 auto;
  }
  .title {
    margin: 0 auto;
    left: 0;
    font-family: "ChangaOne Regular";
    p {
      font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }
  }
  .container {
    margin: 0 auto;
  }
  .calltoaction {
    border-radius: 15px;
    padding: 1em;
    margin: 1em 0;
    cursor: pointer;
    h2 {
      font-family: "ChangaOne Regular";
    }
  }
</style>

<div class="page">
  <div class="title">
    <h1>welcome to advocat.</h1>
    {#if !$loggedIn}
    <p>advocat. was created as a local response to the 2020 international coronavirus crisis.</p>
    <p>advocat. helps you to coordinate your volunteer led efforts so that you can better support neighbours, friends, family and your local community throughout these difficult times.</p>
    {/if}
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
        <div class="calltoaction" style="border: 2px solid {$colourInvert ? '#f9f9f9' : '#808080'}" on:click={click("findgroups")}>
          <h2>find help</h2>
          <p>find volunteer groups in your local area</p>
        </div>
        <div class="calltoaction" style="border: 2px solid {$colourInvert ? '#f9f9f9' : '#808080'}" on:click={click("create_group")}>
          <h2>be a volunteer</h2>
          <p>create or join a volunteer group with other people in your area</p>
        </div>
      </div>
    {/if}
  </div>
</div>