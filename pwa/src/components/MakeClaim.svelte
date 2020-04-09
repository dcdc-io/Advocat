<script>
    import TemplateForm from "../components/TemplateForm.svelte";
    import { Button, Snackbar, notifier, Notifications } from '../../node_modules/smelte/src'
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB, useDatabase} from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let claimBeingMade = false
    let forms;

    const completedClaim = _ => {
        claimBeingMade = false;
        notifier.notify("Claim successfully recorded.")
    }

    const cancelledClaim = _ => {
        claimBeingMade = false;
        notifier.notify("cancelled claim submission")
    }

    const init = async () => {
        let claim_templates = await useDatabase({name:"claim_templates"})
        let user_db = await getUserAccountDB($username)
        let docs = await claim_templates.allDocs({include_docs: true})
        forms = docs.rows
        for(let form in forms){
            if(forms[form].doc.unique){                
                user_db.get(forms[form].id).then(() => forms[form].hidden = true).catch( 
                    (e) => {
                        if(e.status != 404) {console.log(e)}
                    }
                )
            }
        }
    }

    onMount( () => {init()})
</script>

{#if claimBeingMade}
    <TemplateForm on:cancel={cancelledClaim} on:completed={completedClaim} template={claimBeingMade}></TemplateForm>
{:else}
    <div class="button-container">
        {#if forms}
            {#each forms as form}
                {#if !form.hidden}
                    <Button on:click={() => claimBeingMade = form.id} block>{form.doc.name}</Button><br><br>
                {/if}
            {/each}
        {/if}
    </div>
{/if}

<Notifications />
