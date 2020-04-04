<svelte:head>
	<title>Login</title>
</svelte:head>

<script>
  import { getContext } from "svelte"
  import { Button, TextField } from '../../node_modules/smelte/src'
  import { goto } from "@sapper/app"
  import * as yup from 'yup'

  let { loggedIn, username } = getContext("user");

  const SIGNIN = 0
  const SIGNINGIN = 1
  const MAGICLINKSENT = 2

  let stage = SIGNIN

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
        stage = SIGNINGIN
        const signin = await fetch("signin", { 
          method: "POST", 
          body: JSON.stringify(user), 
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!user.password) {
          stage = MAGICLINKSENT
        }
        else if (!(await signin.json()).ok && user.password) {
          stage = SIGNIN
          error.email = "Something didn't work. Are these details correct?"
        }
        else {
          $loggedIn = true
          $username = user.email.toLowerCase()
          goto(".")
        }
      } catch(e) {
        //
        stage = SIGNIN
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

<style>
  .register-box {
    margin: 0 auto;
    width: 100%;
  }
</style>

<h3>Sign In</h3>

{#if stage === SIGNIN}
<form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>

  <TextField label="email" bind:value={user.email} placeholder="e.g. you@example.com" error={error.email} />

  <TextField label="password" bind:value={user.password} type="password" error={error.password} />


  <h6>Don't remember your password?</h6>

  <p>Leave the password field empty and we will send you a magic link to sign in.</p>

  <br>

  <Button block type="submit" disabled={isSubmitting}>Sign In</Button>
</form>
<br><br>
<div class="register-box">
  <Button style="width:100%;" type="button" href="register">Don't have an account? Register Here!</Button>
</div>
{/if}

{#if stage === SIGNINGIN}
<p>Please wait a moment while we check your details.</p>
{/if}

{#if stage === MAGICLINKSENT}
<p>Please check your email for a link to sign in.</p>
{/if}