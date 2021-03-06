<script>
    import TemplateForm from "../components/TemplateForm.svelte";
    import QRScanner from "../components/QRScanner.svelte";
    import { Button, Snackbar, notifier, Notifications } from '../../node_modules/smelte/src'
    import { onMount, getContext } from 'svelte';
    import { buildFormShape, getUserAccountDB, useDatabase} from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let claimBeingMade = false
    let isScanning = false
    let forms;
    let formShapes = {};

    const completedClaim = async event => {
        let {doc, formDataFiles} = event.detail
        doc.type = "claim"
        const db = await getUserAccountDB($username)
        let thisRev = (await db.put(doc)).rev
        for (let fieldKey of Object.keys(formDataFiles)) {
            let targetField = doc.fields.find(field => field.name === fieldKey)
            targetField.value = []
            for (let fileActual of formDataFiles[fieldKey]) {
                // first put attachment
                let next = await db.putAttachment(doc._id, fileActual.name, thisRev, fileActual, fileActual.type)
                // then update doc to point field to attachment
                if (next.rev) {
                    targetField.value.push(fileActual.name)
                    thisRev = next.rev
                }
            }
        }
        // update doc if files were added
        if (doc._rev != thisRev) {
            await db.put({
                ...(await db.get(doc._id)),
                ...doc
            })
        }
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
            formShapes[forms[form].id] = forms[form].doc
            if(forms[form].doc.unique){              
                user_db.get(forms[form].id).then(() => forms[form].hidden = true).catch( 
                    (e) => {
                        if(e.status != 404) {console.log(e)}
                    }
                )
            }
        }
        // console.log(formShapes)
    }

    const verifyClaim = async (url) => {
        console.log(url)
        fetch(url).then((resp) => {
            if(resp.ok) {
                showVerifiedClaim(resp.doc)
            } else {
                console.log("Error verifying claim")
            }
        })
    }

    const showVerifiedClaim = (doc) => {
        console.log(doc)
    }

    onMount( () => {init()})
</script>

{#if claimBeingMade}
    <TemplateForm on:cancel={cancelledClaim} on:completed={completedClaim}  template={formShapes[claimBeingMade]}></TemplateForm>
{:else if isScanning}
    <QRScanner height="100" width="100" opts=... on:scan={(event) => verifyClaim(event.detail)}>
        <div class="placeholder">No cameras loaded!</div>
    </QRScanner>
{:else}
    <div class="button-container">
        {#if forms}
            {#each forms as form}
                {#if !form.hidden}
                    <br><Button on:click={() => claimBeingMade = form.id} block>{form.doc.name}</Button><br>
                {/if}
            {/each}
        {/if}
        <br><Button on:click={() => isScanning = true} block>Scan Code</Button><br>       
    </div>
{/if}

<Notifications />
