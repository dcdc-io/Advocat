<style></style>
<script>
    import { useDatabase } from '../helpers.js'
    import { form } from 'svelte-forms'
    
    let email = ""
    let password = ""
    let password2 = ""

    const validatePassword = value => ({ valid: value.length > 8, name: "passwordTooShort" });
    const matchPasswords = value => ({ valid: value === password, name: "passwordMismatch" });

    const registerForm = form(() => ({
        email:     {value: email,     validators: ["required", "email"]},
        password:  {value: password,  validators: [validatePassword]},
        password2: {value: password2, validators: [matchPasswords]}
    }))

	const database = async () => {
		numbers = useDatabase({name:"numbers"})
    }
    
	const registerUser = async () => {
        validateForm()
    }
    
    const validateForm = async () => {
        console.log(email) 
    }
</script>

<svelte:head>
	<title>register</title>
</svelte:head>


<h1>this is a register page</h1>
<form>
    email <input id="email" type="text" bind:value={email}><br>
      {#if $registerForm.email.errors.includes('email') }
        <p>The email is invalid</p>
      {/if}
    password <input id="password" type="password" bind:value={password}><br>
      {#if $registerForm.password.errors.includes('passwordTooShort')}
        <p>The password supplied is too short</p>
      {/if}
    password validation <input id="password2" type="password" bind:value={password2}><br>
      {#if $registerForm.password2.errors.includes('passwordMismatch')}
        <p>Passwords Don't match</p>
      {/if}
    Do you want to be a worker <input id="worker" type="checkbox">

    <button on:click={registerUser}>Done</button>
</form>