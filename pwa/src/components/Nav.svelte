<script>
	import { stores } from '@sapper/app';
	import { getContext } from 'svelte';
	import { colourInvert } from '../helpers.js';
	import { Tabs } from '../../node_modules/smelte/src';

    const { page } = stores();
	let { loggedIn, username } = getContext("user")
	let accountMenu = [];

	function colourInvertButton() {
		colourInvert.update(n => !n)
	}

	const navMenu = [
		{ to: '/', text: 'Home'},
		{ to: '/registration_map', text: 'Registration Map'}
	]

	$: path = $page.path;
	$: {
		if ($loggedIn) {
			accountMenu = [
				{ to: '/account', text: $username },
				{ to: '/signout', text: 'Logout' }
			]
		} else {
			accountMenu = [
				{ to: '/login', text: 'Login' },
				{ to: '/register', text: 'Register' }
			]
		}
	}
</script>

<style>
	.nav-box {
		background: var(--colour-scheme-dark);
	}
	.rightmenu { 
		width: 200px;
		float: right;
		overflow: auto; 
	}
	.leftmenu { 
		width: 250px;
		float: left;
		overflow: auto; 
		white-space: nowrap;
	}
</style>
<div class="nav-box">
	<div class="rightmenu">
		<Tabs
			items={accountMenu}
			bind:selected={path} />
	</div>
	<div class="leftmenu">
		<Tabs
			items={navMenu}
			bind:selected={path} />
	</div>
</div>