<style>
div.error{
	color: red
}
</style>
<script>
	import { login } from '../helpers.js'
	import { goto } from "@sapper/app"

	let username = ""
	let password = ""
	let error = ""

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
	<title>login</title>
</svelte:head>

<h1>login</h1>
<div class="error">{error}</div>

email <input type="text" bind:value={username}>
password <input type="password" bind:value={password}>

<button on:click={logInButton}>log in</button><button on:click={register}>register</button>