<script>
    import { useDatabase, validateClaimForm, getUserAccountDB, randomStringSC} from '../helpers.js'
    import * as yup from 'yup';
    import { onMount, getContext, createEventDispatcher } from 'svelte';
    import { Button, TextField, DatePicker, Select, Card } from '../../node_modules/smelte/src'
    import FileField from './FileField/index.svelte'
    
    export let template
    export let subtemplate = []

    let files = {}
    let formShape
    let isSubmitting = false

    let { username } = getContext("user");

    let formData = {}
    let formDataFiles = {}
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
        formShape = template
        subtemplate.forEach(subTemplate =>{
            formShape.fields.forEach(field => {
                 field.order -= 1000
            });
            formShape.fields = formShape.fields.concat(subTemplate.fields)
        })
        formShape.fields.forEach( async field => {
            formData[field.name] = typeof field.default === "object" ? await getCustomData(field.default) : field.default
        });
    }
   
    const validate = async () => {
        const ok = await validateClaimForm(
            formData, 
            formDataFiles,
            error => {
                for (let fld of Object.keys(formData)) {
                    formError[fld] = null
                }
                for (let key of Object.keys(error)) {
                    formError[key] = error[key]
                }
            },
            formShape
        )
        console.log(formError)
        return ok
    }

    const button_cancel = async () =>{
        dispatch("cancel")
    }

    const handleSubmit = async () => {
        isSubmitting = true
        const ok = await validate()
        if (ok) {
            let data = []
            for (let key in formData)
            {
                data.push({
                    name: key,
                    value: formData[key]
                    // todo: insert order from formshape
                })
            }            
            let doc = {
                _id: formShape.unique ? formShape._id : formShape._id + randomStringSC(20),
                formID: formShape._id,
                formName: formShape.name,
                formVersion: formShape.version,
                icon: formShape.icon,
                fields: data,
                created: Date.now()
            }
            
            dispatch("completed", {doc: doc , formDataFiles: formDataFiles})
            isSubmitting = false
            console.log("yes")
        } else {
            isSubmitting = false
            console.log(ok)
            console.log("no")
        }
    }
       
    let promise = init()
</script>
    
<style></style>
<div class="form_container">
    {#await promise}
        Loading...
    {:then value}
        <form on:submit|preventDefault={handleSubmit} on:invalid={validate}>
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
                        <FileField bind:files={formDataFiles[field.name]} bind:filenames={formData[field.name]}>
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
    {/await}
</div>