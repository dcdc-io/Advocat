<script>
    import { useDatabase, validateClaimForm, getUserAccountDB, randomStringSC} from '../helpers.js'
    import * as yup from 'yup';
    import { onMount, getContext, createEventDispatcher } from 'svelte';
    import { Button, TextField, DatePicker, Select, Card } from '../../node_modules/smelte/src'
    import FileField from './FileField/index.svelte'
    
    export let template

    let formShape
    let files = {}
    let isSubmitting = false

    let { username } = getContext("user");

    let formData = {}
    let formError = {}

    const dispatch = createEventDispatcher()

    const components = {
        "TextField": TextField,
        "Button": Button
    }

    const getCustomData = async (arg) =>{
        if (!arg.custom) { return arg }
        //this is lazy for now
        // in future assume user account db, account is id, name is part of the doc, this *might* be enough
        if (arg.custom === "account.name") {
            return await (await (await getUserAccountDB($username)).get("account")).name
        }
    }

    const init = async () => {
        const db = await useDatabase({name:"claim_templates"})
        try {
            formShape = await db.get(template)
            if(formShape == undefined){
                throw new error("template not found")
            }
            
            formShape.fields.forEach( async field => {
                //if (!edit) {
                    formData[field.name] = typeof field.default === "object" ? await getCustomData(field.default) : field.default
                //}
                //formError[field.name] = ""
            });
        } catch (e) {
            console.error("db:", db)
            console.error("template:", template)
            console.error("e:", e)
        }        
    }
   
    const validate = async () => {
        return await validateClaimForm(
            formData,
            error => {formError = error},
            formShape
        )
    }

    const button_cancel = async () =>{
        dispatch("cancel")
    }


    const handleSubmit = async () => {
        isSubmitting = true
        const ok = await validate()
        if (ok){
            let data = []            
            for(let key in formData)
            {
                data.push({
                    name: key,
                    value: formData[key]
                })
            }
            
            const doc = {
                "_id": formShape.unique ? formShape._id : formShape._id + randomStringSC(20),
                "formID": formShape._id,
                "formName": formShape.name,
                "formVersion": formShape.version,
                "type": "claim",
                "fields":data
            }
            // TODO use this rev to put stuff
            let db = await getUserAccountDB($username)
            let rev = (await db.put(doc)).rev            
            while (files.length > 0)
            {
                let currentFile = files.pop()
                let fileContents = await currentFile.stream().getReader().read()
                
                rev = await db.putAttachment(doc._id, currentFile.name, rev, fileContents, {type: 'image'}).rev
            }

            dispatch("completed", doc)
            isSubmitting = false
            console.log("yes")
        } else {
            isSubmitting = false
            console.log("no")
        }
    }
       
    onMount(() => {
        if (template) {
            init()
        }
    })
</script>
    
<style></style>
<div class="form_container">
    {#if formShape}
        <form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
            <h3>{formShape.name}</h3>
            {#each formShape.fields.sort( (a,b) => a.order - b.order) as field}
                {#if field.inputType === "TextField"}
                    <TextField label={field.label} bind:value={formData[field.name]} error={formError[field.name]}></TextField>
                {:else if field.inputType === "DateField"}
                    <DatePicker label={field.label} bind:value={formData[field.name]}></DatePicker>
                {:else if field.inputType === "FileField"}
                    <br/>    
                     <Card.Card class="w-full px-4 py-2">
                        <label >{field.label}</label >
                        <FileField bind:files={formData["files"]}>
                            <Card.Card>
                                <div slot="title"><span data-dz-name></span></div>
                                <div slot="media"><img alt="upload thumbnail" class="w-full" data-dz-thumbnail /></div>
                            </Card.Card>
                        </FileField>
                        {#if formError[field.name]}
                            <error>{formError[field.name]}</error>
                        {/if}
                    </Card.Card>
                {:else if field.inputType === "SelectField"}
                    <Select label={field.label} bind:value={formData[field.name]} items={field.values} />
                {:else}
                    <p> unknown form data type detected </p>
                {/if}
            {/each}
            <Button block type="submit" disabled={isSubmitting}> submit </Button> <br><br>
            <Button block on:click={button_cancel} disabled={isSubmitting}>Cancel</Button>

        </form>
    {:else}
        <p> form loading...</p>
    {/if}
</div>