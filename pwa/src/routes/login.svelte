<script>
  import { Button, TextField } from '../../node_modules/smelte/src'
  import { signIn } from '../helpers.js'
  import { goto } from "@sapper/app"
  import * as yup from 'yup'

  let user = {
    email: "",
    password: ""
  }

  let error = {
    email: ""
  }

  let isSubmitting = false;

  const handleSubmit = async () => {
    isSubmitting = true
    const ok = await validate()
    if (ok) {
      try {
        await fetch("signin", { 
          method: "POST", 
          body: JSON.stringify(user), 
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch(e) {
        //
      }
    } 
    isSubmitting = false
  }

  const validate = async () => {
    return new Promise((resolve, reject) => {
      const schema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().nullable()
      })
      error.email = ""
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
  <title>advocat. login</title>
</svelte:head>

<form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
  <h3>Sign In</h3>

  <TextField label="email" bind:value={user.email} placeholder="e.g. you@example.com" error={error.email} />

  <TextField label="password" bind:value={user.password} type="password" error={error.password} />

  <p>If you don't remember your password leave it empty and we will send you a magic link to sign in.</p>

  <br>

  <Button block type="submit" disabled={isSubmitting}>Sign In</Button>
</form>