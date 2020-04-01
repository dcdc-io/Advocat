<script>
    import { useDatabase, validateClaimForm, getUserAccountDB} from '../helpers.js'
    import * as yup from 'yup';
    import { onMount, getContext } from 'svelte';
    import { Button, TextField, DatePicker, Select } from '../../node_modules/smelte/src'
    
    export let template
    let formShape
    let files
    let filename = ""
    let isSubmitting = false

    let { username } = getContext("user");

    let formData = {}
    let formError = {}

    $: {
        if (files && files.length) {
            filename = files[0].name
        }
    }

    const components = {
        "TextField": TextField,
        "Button": Button
    }

    const init = async () => {
        const db = await useDatabase({name:"claim_templates"})
        try {
            formShape = await db.get(template)
            formData = {}
            formShape.fields.forEach(field => {
                formData[field.name] = field.default
                formError[field.name] = ""
            });
            
      
        } catch (e) {
            console.error("db:", db)
            console.error("template:", template)
            console.error("e:", e)
        }        
    }
   
    const validate = async () => {
        for(let error in formError){
            error = "";
        }
        return await validateClaimForm(
            formData,
            error => formError = error,
            formShape
        )
    }

    const handleSubmit = async () => {
        isSubmitting = true
        const ok = await validate()
        if(ok){
            let data = []
            for(let key in formData)
            {
                data.push({
                            name: key,
                            value: formData[key]
                         })
            }
            await (await getUserAccountDB($username)).post({
                      "formName": formShape.name,
                      "formVersion": formShape.version,
                      "type": "claim",
                      "fields": data
            })
            isSubmitting = false
            console.log("yes")
        }else{
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
            {#each formShape.fields as field}
                {#if field.inputType === "TextField"}
                    <TextField label={field.label} bind:value={formData[field.name]} error={formError[field.name]}></TextField>
                {:else if field.inputType === "DateField"}
                    <DatePicker label={field.label} bind:value={formData[field.name]}></DatePicker>
                {:else if field.inputType === "FileField"}
                    <br/>
                    <label for="fileupload">
                        UPLOAD (TODO: needs button style!)<Button>test</Button>
                    </label>
                    <span>{filename}</span>
                    <input id="fileupload" style="display: none;" type="file" bind:files />
                {:else if field.inputType === "SelectField"}
                    <Select bind:value={formData[field.name]} items={field.values} />
                {:else}
                    <p> unknown form data type detected </p>
                {/if}
            {/each}
            <Button block type="submit" disabled={isSubmitting}> submit </Button>
        </form>
    {:else}
        <p> form loading...</p>
    {/if}
</div>