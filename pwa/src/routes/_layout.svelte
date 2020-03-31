<script>
	import "smelte/src/tailwind.css";

	import Nav from '../components/Nav.svelte';
	import { setContext, onMount } from 'svelte'
	import { checkLocalUser } from "../helpers.js"

	import { writable } from 'svelte/store'
	const loggedIn = writable(false)
	const username = writable("empty")
	setContext("user", { loggedIn, username })	

	export let segment;

	onMount(() => {
		checkLocalUser({ loggedIn, username })
	})
</script>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 2em;
		box-sizing: border-box;
		flex: 1;
		color: var(--colour-scheme-dark);
	}	
	.footer {
		padding: 1em;
		text-align: center;
		color: black;
		font-weight: 300;
		color: var(--colour-scheme-dark);
		border-top: 0.1px solid var(--colour-scheme-dark);;
	}
</style>

<Nav {segment}></Nav>

<main >
	<slot></slot>
</main>

<div class="footer">
  <p><a href="data" class="underline">Data Policy</a> - <a href="about" class="underline">About</a> - <a href="faqs" class="underline">FAQs</a> - <a href="https://blog.advocat.group" class="underline" target="_blank">Developer Blog</a></p>
  <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
</div>
