<script>
    import { onMount, getContext } from "svelte"
    import { Button, notifier, Notifications } from '../../node_modules/smelte/src'
    import VerticalDrawer from '../components/VerticalDrawer/VerticalDrawer.svelte'
    import TemplateForm from '../components/TemplateForm.svelte'
    import { useDatabase } from '../helpers'

    let { username } = getContext("user");

    let db
    let formShapes = []
    let baseForm;

    const button_form = () => {activeForm = true;console.log("test")}

    const cancelled = (event) => {
        activeForm = false;
        notifier.notify("cancelled form submission")
    }
    const completed = async (event) => {   
        let {doc} = event.detail
        doc.author = $username
        doc.assigned = undefined
        doc.type = "activity"
        doc.status = "new"
        let {longitude, latitude} = await (await fetch("map/postcode-to-latlon?geocode=" + doc.postZipCode)).json()
        doc.longitude = longitude
        doc.latitude = latitude
        //todo : location lookup and population
        console.log (await db.put(doc))
        activeForm = false;
        notifier.notify("completed form submission")
    }

    const init = async () => {
        db = await useDatabase({name: "job_index"})
        const formDB = await useDatabase({name: "job_templates"})
        baseForm = await formDB.get("base-job")
        formShapes = (await formDB.allDocs({include_docs:true})).rows.map(row => row.doc).filter(doc => doc.name)
    }

    onMount( () => {init()})
    let activeForm = false;
</script>

<div class="flex flex-wrap -mb-4 -mx-4">
    {#each formShapes as thisForm}
    <wrap class="px-2 pb-4">
        <Button icon={thisForm.icon} light on:click={() => activeForm = thisForm}></Button>
    </wrap>
    {/each}
</div> 

<VerticalDrawer bottom={true} persistent={false} bind:show={activeForm}>
    <div style="margin: 2em;">
        {#if activeForm}
            <TemplateForm  on:cancel={cancelled} on:completed={completed} template={activeForm} subtemplate={[baseForm]} ></TemplateForm>
        {/if}
    </div>
</VerticalDrawer>

<Notifications />








