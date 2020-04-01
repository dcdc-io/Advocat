<script>
    import { useDatabase } from '../helpers.js'
    import * as yup from 'yup';
    import { onMount  } from 'svelte';
    import { Button, TextField, DatePicker } from '../../node_modules/smelte/src'

    
    export let template
    let formShape
    let files
    let filename = ""

    let formdata
    let formerror 

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
            formdata = {
                serialNumber: "",
                date: "",
                photo: {}
            }
        } catch (e) {
            console.error("db:", db)
            console.error("template:", template)
            console.error("e:", e)
        }        
    }

    const generateValidation = (input) => {
        return input.reduce( (total, fun) => {
            return total[fun[0]](...fun.slice(1))
        }, yup)
    }

    const validate = async () => {
        return new Promise((resolve, reject) => {
          let schema = {}
          formShape.fields.forEach(field => 
              schema[field.name] = generateValidation(field.validation)
          )
          schema = yup.object().shape(schema)
          // reset errors
          for (const key of Object.keys(formerror)) {
              formerror[key] = ""
          }
          schema.validate(formdata, {abortEarly: false})
            .then(async () => {
              resolve(true)
            })
            .catch(err => {
              (err.inner || []).forEach(err => {
                console.log(err)
                formerror[err.path] = err.message
              })
              resolve(false)
            })
        })
    }

    const handleSubmit = async () => {
        const ok = await validate()
        if(ok){
            console.log("yes")
        }else{
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
                    <TextField label={field.label} bind:value={formdata[field.name]} error={formerror[field.name]}></TextField>
                {:else if field.inputType === "DateField"}
                    <DatePicker label={field.label} bind:value={formdata[field.name]}></DatePicker>
                {:else if field.inputType === "FileField"}
                    <br/>
                    <label for="fileupload">
                        UPLOAD (TODO: needs button style!)
                    </label>
                    <span>{filename}</span>
                    <input id="fileupload" style="display: none;" type="file" bind:files />
                {:else}
                    <p> unknown form data type detected </p>
                {/if}
            {/each}
            <Button block> submit </Button>
        </form>
    {/if}
</div>