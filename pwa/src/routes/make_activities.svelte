<script>
    import { onMount } from "svelte"
    import { Button, notifier, Notifications} from '../../node_modules/smelte/src'
    import VerticalDrawer from '../components/VerticalDrawer/VerticalDrawer.svelte'
    import TemplateForm from '../components/TemplateForm.svelte'
    import { useDatabase } from '../helpers'

    let db
    let formShapes = {}
    let baseForm;

    const button_form = () => {activeForm = true;console.log("test")}

    const cancelled = (event) => {
        activeForm = false;
        notifier.notify("cancelled form submission")
    }
    const completed = async (event) => {   
        let doc = event.detail
        doc.type = "activity"
        //todo : location lookup and population
        console.log (await db.put(doc))
        activeForm = false;
        notifier.notify("completed form submission")
    }

    const init = async () => {
        db = await useDatabase({name: "job_index"})
        const formDB = await useDatabase({name: "job_templates"})
        baseForm = await formDB.get("job-header")
        formShapes["shopping"] = await formDB.get("void-uk-shopping")
        formShapes["dogWalking"] = await formDB.get("void-uk-dog-walking")
        formShapes["verifyUser"] = await formDB.get("void-uk-verification")
        formShapes["childCare"] = await formDB.get("void-uk-childcare")

    }

    onMount( () => {init()})
    let activeForm = false;
</script>

<div class="flex mb-4 -mx-4">
    <!-- todo: make this build the form using db + account info -->
    <Button icon="shopping_cart" class="flex-1 bg-gray-500 mx-2 h-12 w-1/3" on:click={() => {activeForm = formShapes["shopping"]}}>shopping</Button> 
    <Button icon="pets"          class="flex-1 bg-gray-500 mx-2 h-12 w-1/3" on:click={() => {activeForm = formShapes["dogWalking"]}}>dog walking</Button>
    <Button icon="verified_user" class="flex-1 bg-gray-500 mx-2 h-12 w-1/3" on:click={() => {activeForm = formShapes["verifyUser"]}}>verify a user</Button>
    <Button icon="child_friendly"class="flex-1 bg-gray-500 mx-2 h-12 w-1/3" on:click={() => {activeForm = formShapes["childCare"]}}>Child Care</Button>
    <Button icon="local_taxi"    class="flex-1 bg-gray-500 mx-2 h-12 w-1/3" >Taxi</Button>
    <Button icon="build"         class="flex-1 bg-gray-500 mx-2 h-12 w-1/3" >DIY</Button>
</div> 

<VerticalDrawer bottom={true} persistent={true} bind:show={activeForm}>
    <div style="margin: 2em;">
        {#if activeForm}
            <TemplateForm  on:cancel={cancelled} on:completed={completed} template={activeForm} subtemplate={[baseForm]} ></TemplateForm>
        {/if}
    </div>
</VerticalDrawer>

<Notifications />








