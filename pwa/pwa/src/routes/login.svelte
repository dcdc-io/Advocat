<style>
div.error{
	color: red
}
</style>
<script>
	import { useDatabase } from '../helpers.js'
	import { goto } from "@sapper/app"

	let username = ""
	let password = ""
	let error = ""
	let db = useDatabase({name:""})

	const logIn = async () => {
		console.log(`logging in ${username}:${password}`)	
		try{
			await db.login({username: username, password: password})

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

<button on:click={logIn}>log in</button><button on:click={register}>register</button>