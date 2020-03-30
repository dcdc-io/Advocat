<svelte:head>
	<title>Account</title>
</svelte:head>

<script>
	import { getContext, onMount } from "svelte"
	import { Button, TextField } from '../../node_modules/smelte/src'
	import { goto } from "@sapper/app"
	import * as yup from 'yup'

	let { loggedIn, username } = getContext("user");
	let user = {
		email: "",
		firstName: "",
		surname: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		country: "",
		postcode: "",
	}
	let error = {};
	let validChangeDetected = false;

	const handleSubmit = async () => {
		await validate();
		if (validChangeDetected) {
			// Update DB with user info
			validChangeDetected = false;
		}
	}

	const validate = () => {
		const schema = yup.object().shape({
			email: yup.string().email().required(),
			firstName: yup.string().nullable(),
			surname: yup.string().nullable(),
			addressLine1: yup.string().nullable(),
			addressLine2: yup.string().nullable(),
			city: yup.string().nullable(),
			country: yup.string().nullable(),
			postcode: yup.string().nullable()
		})
		return schema.validate(user, {abortEarly: false}).then(() => {
			validChangeDetected = true;
		}).catch(err => {
			(err.inner || []).forEach(err => {
				error[err.path] = err.message
			})
			validChangeDetected = false;
		})
	}

	onMount(async () => {
		// Get user info
	});
</script>

<style>
	.login-redirect {
		margin: 0 auto;
		text-align: center;
	}
</style>

{#if $loggedIn}
	<form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
		<div>
			<p>Personal Information</p>
			<TextField label="Email" bind:value={user.email} />
			<TextField label="First Name" bind:value={user.firstName} />
			<TextField label="Surname" bind:value={user.surname} />
		</div>
		<br>
		<div>
			<p>Address</p>
			<TextField label="Address Line 1" bind:value={user.addressLine1} />
			<TextField label="Address Line 2" bind:value={user.addressLine2} />
			<TextField label="Town/City" bind:value={user.city} />
			<TextField label="Country" bind:value={user.country} />
			<TextField label="Post/Zip Code" bind:value={user.postcode} />
		</div>
		<br>
		<Button block type="submit" disabled={!validChangeDetected}>Update Information</Button>
	</form>
	<br>
	<Button type="button" href="change_password">Change Password</Button>
{:else}
	<div class="login-redirect">
		<br><br>
		<p>Please login to edit account information</p>
		<br>
		<Button type="button" href="login">Login now!</Button>
	</div>
{/if}
