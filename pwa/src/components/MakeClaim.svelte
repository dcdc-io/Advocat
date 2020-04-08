<script>
    import TemplateForm from "../components/TemplateForm.svelte";
    import { Button, Snackbar, notifier, Notifications } from '../../node_modules/smelte/src'
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let claimBeingMade = false

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

</script>

{#if claimBeingMade}
    <TemplateForm on:cancel={cancelledClaim} on:completed={completedClaim} template={claimBeingMade}></TemplateForm>
{:else}
<!-- TODO: in future this will be a dropdown -->
    <div class="button-container">
    <!-- TODO: disable button when record exists and template is unique? -->
        <Button on:click={button_GP} block>I'm a GP in the UK</Button> <br><br> 
        <Button on:click={button_COVID19} block>Record COVID-19 Antibody Test</Button>
    </div>
{/if}

<Notifications />
