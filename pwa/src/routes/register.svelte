<script>
  import { Button, TextField } from '../../node_modules/smelte/src'
  import LocationWidget, { getLocation } from "../components/LocationWidget.svelte";
  import { signUp } from '../helpers.js'
  import * as yup from 'yup'
	import { onMount } from 'svelte';

  
  let user = { 
    name: "",
    email: "",
    location: ""
  }

  let error = {
    name: "",
    email: "",
    location: ""
  }

  let isValid 
  let isSubmitting
  let thankYou

  const update = (data) => {}
  
  const handleSubmit = async () => {
    isSubmitting = true
    const ok = await validate()
    if (ok) {
      user.location = await getLocation()
      console.log(user)
      await signUp(user)
      user.name = ""
      user.email = ""
      isSubmitting = false
      thankYou = true
    } else {
      isSubmitting = false
    }
  }

  const validate = async () => {
    return new Promise((resolve, reject) => {
      const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        location: yup.string()
      })
      error.name = "";
      error.email = "";
      schema.validate(user, {abortEarly: false})
        .then(async () => {
          resolve(true)
        })
        .catch(err => {
          (err.inner || []).forEach(err => {
            error[err.path] = err.message
          })
          resolve(false)
        })
    })
  }
</script>

<svelte:head>
	<title>advocat. register</title>
</svelte:head>

<form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
  <h3>Be a Volunteer</h3>

  <p>
    After you register we will send you an activation link that you can click to sign in:
  </p>

  <TextField label="name" bind:value={user.name} placeholder="e.g. Jonas Salk" error={error.name} />

  <TextField label="email" bind:value={user.email} placeholder="e.g. you@example.com" error={error.email} />
  
  <p>
    By telling us your location we can tell the groups nearby that you can help:
  </p>
  <LocationWidget update={update}></LocationWidget>
  <br>

  <Button block type="submit" disabled={isSubmitting}>Register</Button>
</form>