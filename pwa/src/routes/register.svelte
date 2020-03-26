<script>
  import { Button, TextField, Checkbox } from '../../node_modules/smelte/src'
  import LocationWidget, { getLocation } from "../components/LocationWidget.svelte";
  import { signUp } from '../helpers.js'
  import * as yup from 'yup'
	import { onMount } from 'svelte';

  
  let user = { 
    name: "",
    email: "",
    location: "",
    accepted: false
  }

  let error = {
    name: "",
    email: "",
    location: "",
    accepted: ""
  }

  let isValid 
  let isSubmitting = false
  let thankYou = false
  
  const update = (data) => {}
  
  const handleSubmit = async () => {
    isSubmitting = true
    const ok = await validate()
    if (ok) {
      user.location = await getLocation()
      try {
        await signUp(user)
      } catch(e) {
        // TODO: already registered this email?
        // TODO: should we send a reminder?
      }
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
      console.log(user)
      const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        location: yup.string(),
        accepted: yup.boolean().oneOf([true])
      })
      error.name = "";
      error.email = "";
      error.accepted = "";
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

{#if !thankYou}
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
  <LocationWidget on:update={update}></LocationWidget>
  <Checkbox bind:checked={user.accepted}><span slot="label">I have read the <a href='data' class='underline'>data policy</a>.</span></Checkbox>
  <br>

  <Button block type="submit" disabled={isSubmitting}>Register</Button>
</form>
{:else}
<h3>Thank You</h3>
<p>We will send you an email shortly with a link to confirm your registration. Once it is confirmed you will be able to use advocat. and create a profile.</p>
{/if}