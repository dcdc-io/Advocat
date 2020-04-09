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

    const button_COVID19 = () =>{
        claimBeingMade = "void-uk-covid-19-antibody-test";
    }

    const button_GP = () =>{
        claimBeingMade = "void-uk-is-gp";
    }

    const init = async () => {
        let claim_templates = await useDatabase({name:"claim_templates"})
        let user_db = await getUserAccountDB()
        let docs = await claim_templates.allDocs({include_docs: true})
        forms = docs.rows
        for(let form of forms){
            if(form.doc.unique){
                let existingDoc = await user_db.get(form.id).catch( () => {})
                if(existingDoc){ form.hidden = true}
            }
        }
    }

    init();
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
