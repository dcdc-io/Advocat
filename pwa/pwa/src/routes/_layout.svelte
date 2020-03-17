<script>
	import Nav from '../components/Nav.svelte';
	import { setContext } from 'svelte'

	import { autoLogin } from "../helpers.js"

	import { writable } from 'svelte/store'
	const loggedIn = writable(false)
	setContext("user", { loggedIn })

	autoLogin()

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>