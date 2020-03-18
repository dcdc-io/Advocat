<script>
	import Nav from '../components/Nav.svelte';
	import { setContext } from 'svelte'

	import { autoLogin } from "../helpers.js"

	import { writable } from 'svelte/store'
	const loggedIn = writable(false)
	const username = writable("empty")
	setContext("user", { loggedIn, username })

	autoLogin()

	export let segment;
</script>

<style>
	main {
		padding: 1.5em;
		box-sizing: border-box;
		flex: 1;
	}	
	.footer {
		padding: 1em;
		text-align: center;
		color: black;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>

<div class="footer">
  <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
</div>
