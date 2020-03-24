<script>
	import { login } from '../helpers.js'
	import { goto } from "@sapper/app"

	let user = {
		email: "",
		password: ""
	}

	let error = {
		email: "",
		password: ""
	}

	const logInButton = async () => {
		try{
			await login({username: username, password: password})
			goto("/")
		} catch(e) {
			console.log(e.message)
			error = e.message
		}
	}

	const register = async () => {
		goto("/register")
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