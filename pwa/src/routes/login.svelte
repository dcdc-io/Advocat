<script>
  import { Button, TextField } from '../../node_modules/smelte/src'
  import { signIn } from '../helpers.js'
  import { goto } from "@sapper/app"
  import * as yup from 'yup'

  let user = {
    email: ""
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
        await signIn(user)
      } catch(e) {
        //
      }
    } 
    isSubmitting = false
  }

  const validate = async () => {
    return new Promise((resolve, reject) => {
      const schema = yup.object().share({
        email: yup.string().required(),
        password: yup.string().password()
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

  <Button block type="submit" disabled={isSubmitting}>Sign In</Button>
</form>