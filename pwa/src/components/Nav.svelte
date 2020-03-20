<script>
	export let segment;
	import { getContext } from 'svelte'
	let { loggedIn, username } = getContext("user")

	import { colourInvert } from '../helpers.js'
	function colourInvertButton() {
		colourInvert.update(n => !n)
	}
</script>

<style>
	nav {
		font-weight: 300;
		padding: 0 1em;
		background-color: var(--colour-scheme-dark);
		color: var(--colour-scheme-light);
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		background-color: var(--colour-scheme-light);
		height: 4px;
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
	.info{
		color: var(--colour-scheme-dark);
	}
	/* .button-box {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 100;
		margin: 5px;
		padding: 2px;
		width: 3em;
	} */
</style>

<nav>
	<ul>
		<li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a></li>
		<li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li>
		<!-- <li><a rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>blog</a></li> -->
		<li><a aria-current='{segment === "jobs" ? "page" : undefined}' href='jobs'>jobs</a></li>
		{#if true}  <!-- TODO: replace if statement when roles are implemented -->
			<li><a aria-current='{segment === "advocats" ? "page" : undefined}' href='advocats'>advocats</a></li>
		{/if}
		{#if $loggedIn}
       		<li><p class="info">welcome back, {$username}</p></li>
		{:else}
			<li><a aria-current='{segment === "login" ? "page" : undefined}' href='login'>login</a></li>
			<li><a aria-current='{segment === "register" ? "page" : undefined}' href='register'>register</a></li>
      	{/if}
		<!-- TODO: logout -->
	</ul>
	<!-- <div class="button-box">
		{#if $colourInvert}
			<button on:click={colourInvertButton}>Go Light</button>
		{:else}
			<button on:click={colourInvertButton}>Go Dark</button>
		{/if}
	</div> -->
</nav>
