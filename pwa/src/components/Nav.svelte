<script>
	import { stores } from '@sapper/app';
	import { getContext } from 'svelte';
	import { Tabs } from '../../node_modules/smelte/src';

    const { page } = stores();
	let { loggedIn, username } = getContext("user")
	let accountMenu = [];

	const navMenu = [
		{ to: '/', text: 'Home'},
		{ to: '/registration_map', text: 'Map'}
	]

	$: path = $page.path;
	$: {
		if ($loggedIn) {
			accountMenu = [
				{ to: '/claims', text: 'Tech Preview'},
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
        display: flex;
    }
    .leftmenu { 
        flex: 1;
        display: flex;
        justify-content: flex-start;
    }
    .rightmenu { 
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }
</style>
<div class="nav-box">
    <div class="leftmenu">
        <Tabs
            items={navMenu}
            bind:selected={path} />
    </div>
    <div class="rightmenu">
        <Tabs
            items={accountMenu}
            bind:selected={path} />
    </div>
</div>