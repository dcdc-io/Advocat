<script>
    import { Button, notifier, Notifications} from '../../node_modules/smelte/src'
    import VerticalDrawer from '../components/VerticalDrawer/VerticalDrawer.svelte'
    import TemplateForm from '../components/TemplateForm.svelte'

    let formShapes = {}
    let db
    let baseForm;

    const button_form = () => {activeForm = true;console.log("test")}

    const cancelled = (event) => {
        activeForm = false;
        notifier.notify("cancelled form submission")
    }
    const completed = (event) => {   
        let doc = event.detail
        console.log(doc)
        //TODO : jobstuff
        activeForm = false;
        notifier.notify("completed form submission")
    }

    const init = async () => {
        db = await useDatabase({name: "job_templates"})
        baseForm = db.get("job-header")
        formShapes["shopping"] = db.get("void-uk-shopping")
    }

    onMount( () => {init()})
    let activeForm = false;
</script>

<div class="flex mb-4 -mx-4">
    <!-- todo: make this build the form using db + account info -->
    <Button class="bg-gray-500 mx-2 h-12 w-1/3" on:click={() => {activeForm = formShapes["shopping"]}}> shopping</Button> 
    <Button class="bg-gray-500 mx-2 h-12 w-1/3" on:click={() =>{}}> button two</Button>
    <Button class="bg-gray-500 mx-2 h-12 w-1/3" on:click={() =>{}}> button three</Button>
</div> 

<VerticalDrawer bottom={true} persistent={false} bind:show={activeForm}>
    <div style="margin: 2em;">
        {#if activeForm}
            <TemplateForm  on:cancel={cancelled} on:completed={completed} template={activeForm} subtemplate={[baseForm]} ></TemplateForm>
        {/if}
    </div>
</VerticalDrawer>

<Notifications />








