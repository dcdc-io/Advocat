<script>
  import { useDatabase, colourInvert } from '../helpers.js'
  import { getContext } from "svelte";
  import { goto } from '@sapper/app'
  import GroupBrowser from '../components/GroupBrowser.svelte'
  let { loggedIn, username } = getContext("user");
  const click = (page) => () => goto(page)

  let groupsDb
  let groups = []
  $: {
    if ($loggedIn) {
      groupsDb = useDatabase({name:"groups"})
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
    min-width: 320px;
    margin: 0 auto;
  }
  .title {
    margin: 0 auto;
    left: 0;
    font-family: "ChangaOne Regular";
    font-size: 20px;
    p {
      font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      font-size: 14px;
    }
  }
  .container {
    margin: 0 auto;
    padding-top: 3em;
  }
  .calltoaction {
    border-radius: 8px;
    padding: 1em;
    margin: 1em 0;
    cursor: pointer;
  }
</style>

<h3>advocat.</h3>
{#if !$loggedIn}
  <div>advocat. was created in response to the 2020 international coronavirus crisis.</div>
  <br />
  <div>advocat. helps coordinate volunteer effort to <a href="about" class="underline font-bold">safely</a> support neighbours, friends, family and your local community.</div>
{/if}


{#if $loggedIn}
  <div>
    <div>
      <h3>welcome back {$username}</h3>
    </div>
    <GroupBrowser {groups} />
  </div>
{:else}
  <div class="calltoaction" style="border: 2px solid {$colourInvert ? "var(--colour-scheme-light)" : "var(--colour-scheme-dark)" }" on:click={click("find_groups")}>
    <h3 class="underline">Find Help</h3>
    <p>Find volunteer groups in your local area.</p>
  </div>
  <div class="calltoaction" style="border: 2px solid {$colourInvert ? "var(--colour-scheme-light)" : "var(--colour-scheme-dark)" }" on:click={click("register")}>
    <h3 class="underline">Be a Volunteer</h3>
    <p>Create or join a volunteer group.</p>
  </div>
{/if}
