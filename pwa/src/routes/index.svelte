<svelte:head>
	<title>advocat.</title>
</svelte:head>

<script>
  import { useDatabase } from '../helpers.js'
  import { getContext } from "svelte";
  import { goto } from '@sapper/app'
  import GroupBrowser from '../components/GroupBrowser.svelte'
  let { loggedIn, username } = getContext("user");
  const click = (page) => () => goto(page)
  
  let groupsDb
  let groups = []
  $: {
    if ($loggedIn) {
     /* 
      groupsDb = useDatabase({name:"groups"})
      groupsDb.allDocs({include_docs:true}).then(result => {
        groups = result.rows.map(r => r.doc)
      })
      */
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

<div class="bg-secondary-100 border-t-4 border-secondary-500 rounded-b text-secondary-900 px-4 py-3 shadow-md" role="alert">
  <div class="flex">
    <div class="py-1"><svg class="fill-current h-6 w-6 text-secondary-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      <p class="font-bold">UK COVID-19 Antibody Test Tech Preview</p>
      <p class="text-sm">To support our application for <a href="https://techforce19.uk/" class="underline" target="_blank">#techforce19</a> we have published a technical preview of a self service coronavirus test result tracker feature which can be enabled after login from your account area.</p>
      <br/>
      <p class="text-bold text-sm">You should not use this feature to report genuine test results as any certifications produced during the preview period will be automatically voided.</p>
      <br/>
      <p class="text-sm">You can read more about our #techforce19 application and COVID-19 Antibody Test self reporting in this post on our developer blog: <a href="https://blog.advocat.group/techforce19" class="underline">blog.advocat.group/techforce19</a></p>
      <br/>
      <p class="text-sm">If you do not have an account you can <a href="register" class="underline">register here.</a></p>
    </div>
  </div>
</div>
<br/>

{#if !$loggedIn}
  <div>advocat. was created in response to the 2020 international coronavirus crisis.</div>
  <br />
  <div>advocat. helps coordinate volunteer effort to <a href="about" class="underline font-bold">safely</a> support neighbours, friends, family and your local community.</div>
{/if}


{#if $loggedIn}
  <div>
    <div>
      <h4>welcome back {$username}</h4>
    </div>
    <GroupBrowser {groups} />
  </div>
{:else}
  <div class="calltoaction" style="border: 2px solid var(--colour-scheme-dark)" on:click={click("find_groups")}>
    <h3 class="underline">Find Help</h3>
    <p>Find volunteer groups in your local area.</p>
  </div>
  <div class="calltoaction" style="border: 2px solid var(--colour-scheme-dark)" on:click={click("register")}>
    <h3 class="underline">Be a Volunteer</h3>
    <p>Create or join a volunteer group.</p>
  </div>
{/if}
